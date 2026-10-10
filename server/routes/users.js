import { Router } from "express";
import User from "../models/User.js";
import { requireAuth } from "../middleware/auth.js";
import { buildProfile } from "../services/player.js";
import { badRequest, notFound } from "../utils/httpError.js";

const router = Router();

const USERNAME_RE = /^[a-zA-Z0-9_]{3,20}$/;

async function findPlayer(username) {
  if (!USERNAME_RE.test(username)) throw notFound("Player not found.");
  const user = await User.findOne({ usernameKey: username.toLowerCase(), verified: true });
  if (!user) throw notFound("Player not found.");
  return user;
}

router.get("/me", requireAuth, async (req, res) => {
  res.json(await buildProfile(req.user, req.user));
});

router.get("/:username", async (req, res) => {
  const player = await findPlayer(req.params.username);
  res.json(await buildProfile(player, req.user));
});

router.post("/:username/follow", requireAuth, async (req, res) => {
  const target = await findPlayer(req.params.username);
  if (target._id.equals(req.user._id)) throw badRequest("You can't follow yourself.");

  const update = await User.updateOne(
    { _id: req.user._id, following: { $ne: target._id } },
    { $push: { following: target._id } }
  );
  if (update.modifiedCount) {
    await User.updateOne({ _id: target._id }, { $inc: { followerCount: 1 } });
  }

  const fresh = await User.findById(target._id).select("followerCount");
  res.json({ isFollowing: true, followers: fresh.followerCount });
});

router.delete("/:username/follow", requireAuth, async (req, res) => {
  const target = await findPlayer(req.params.username);

  const update = await User.updateOne(
    { _id: req.user._id, following: target._id },
    { $pull: { following: target._id } }
  );
  if (update.modifiedCount) {
    await User.updateOne({ _id: target._id, followerCount: { $gt: 0 } }, { $inc: { followerCount: -1 } });
  }

  const fresh = await User.findById(target._id).select("followerCount");
  res.json({ isFollowing: false, followers: fresh.followerCount });
});

export default router;
