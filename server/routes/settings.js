import { Router } from "express";
import User from "../models/User.js";
import Result from "../models/Result.js";
import Code from "../models/Code.js";
import GameSession from "../models/GameSession.js";
import { issueCode, consumeCode } from "../services/codes.js";
import { startSession, endSession } from "../services/session.js";
import { requireAuth } from "../middleware/auth.js";
import { codeLimiter } from "../middleware/limits.js";
import { badRequest, conflict, unauthorized } from "../utils/httpError.js";
import * as check from "../utils/validate.js";

const router = Router();

router.use(requireAuth);

async function confirmPassword(user, password) {
  if (typeof password !== "string" || !password) throw badRequest("Enter your current password.");
  const withHash = await User.findById(user._id).select("+passwordHash");
  if (!(await withHash.checkPassword(password))) throw unauthorized("That password is wrong.");
  return withHash;
}

router.patch("/profile", async (req, res) => {
  const user = req.user;

  if (req.body.username !== undefined) {
    const username = check.username(req.body.username);
    const usernameKey = username.toLowerCase();
    if (usernameKey !== user.usernameKey && (await User.exists({ usernameKey }))) {
      throw conflict("That username is taken.");
    }
    user.username = username;
    user.usernameKey = usernameKey;
  }

  if (req.body.bio !== undefined) {
    user.bio = check.text(req.body.bio, { field: "Bio", max: 80, required: false });
  }

  await user.save();
  res.json({ user: user.toSelf(), message: "Profile saved." });
});

router.patch("/password", async (req, res) => {
  const user = await confirmPassword(req.user, req.body.currentPassword);
  const next = check.password(req.body.newPassword, "New password");
  if (await user.checkPassword(next)) throw badRequest("Pick a password you haven't used here before.");

  await user.setPassword(next);
  user.tokenVersion += 1;
  await user.save();

  startSession(res, user, true);
  res.json({ message: "Password changed. Other devices were signed out." });
});

router.post("/two-factor/start", codeLimiter, async (req, res) => {
  if (req.user.twoFactor) throw badRequest("Two-factor is already on.");
  await issueCode(req.user, "enable-2fa");
  res.json({ message: `We sent a code to ${req.user.email}.` });
});

router.post("/two-factor/enable", async (req, res) => {
  const code = check.code(req.body.code);
  if (req.user.twoFactor) throw badRequest("Two-factor is already on.");

  await consumeCode(req.user, "enable-2fa", code);
  req.user.twoFactor = true;
  await req.user.save();
  res.json({ user: req.user.toSelf(), message: "Two-factor authentication is on." });
});

router.post("/two-factor/disable", async (req, res) => {
  const user = await confirmPassword(req.user, req.body.password);
  user.twoFactor = false;
  await user.save();
  res.json({ user: user.toSelf(), message: "Two-factor authentication is off." });
});

router.post("/sign-out-everywhere", async (req, res) => {
  await User.updateOne({ _id: req.user._id }, { $inc: { tokenVersion: 1 } });
  endSession(res);
  res.json({ message: "Signed out on every device." });
});

router.delete("/account", async (req, res) => {
  const user = await confirmPassword(req.user, req.body.password);

  for (const followedId of user.following) {
    await User.updateOne({ _id: followedId, followerCount: { $gt: 0 } }, { $inc: { followerCount: -1 } });
  }
  const followers = await User.find({ following: user._id }).select("_id following");
  for (const follower of followers) {
    follower.following = follower.following.filter((id) => !id.equals(user._id));
    await follower.save();
  }

  await Promise.all([
    Result.deleteMany({ user: user._id }),
    Code.deleteMany({ user: user._id }),
    GameSession.deleteMany({ user: user._id }),
  ]);
  await user.deleteOne();

  endSession(res);
  res.json({ message: "Your account and stats were deleted." });
});

export default router;
