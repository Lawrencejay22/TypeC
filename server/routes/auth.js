import { Router } from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Code from "../models/Code.js";
import { issueCode, consumeCode } from "../services/codes.js";
import { startSession, endSession } from "../services/session.js";
import { authLimiter, codeLimiter } from "../middleware/limits.js";
import HttpError, { badRequest, conflict, unauthorized } from "../utils/httpError.js";
import * as check from "../utils/validate.js";

const router = Router();

const MAX_FAILED_LOGINS = 5;
const LOCK_MS = 15 * 60 * 1000;
const STALE_SIGNUP_MS = 24 * 60 * 60 * 1000;
const DUMMY_HASH = bcrypt.hashSync("this-is-not-anyones-password", 12);
const WRONG_LOGIN = "Wrong username/email or password.";

router.use(authLimiter);

async function sendCodeQuietly(user, purpose) {
  try {
    await issueCode(user, purpose);
  } catch (err) {
    if (err.status !== 429) throw err;
  }
}

function findByIdentifier(identifier) {
  const key = identifier.toLowerCase();
  return key.includes("@") ? User.findOne({ email: key }) : User.findOne({ usernameKey: key });
}

router.post("/register", async (req, res) => {
  const username = check.username(req.body.username);
  const email = check.email(req.body.email);
  const password = check.password(req.body.password);
  if (req.body.acceptTerms !== true) throw badRequest("Please accept the Terms and Privacy Policy.");

  const usernameKey = username.toLowerCase();
  const [byEmail, byName] = await Promise.all([User.findOne({ email }), User.findOne({ usernameKey })]);

  if (byEmail?.verified) throw conflict("That email already has an account. Sign in instead.");

  if (byName && !(byEmail && byName._id.equals(byEmail._id))) {
    const stale = !byName.verified && Date.now() - byName.createdAt.getTime() > STALE_SIGNUP_MS;
    if (!stale) throw conflict("That username is taken.");
    await byName.deleteOne();
  }

  const user = byEmail || new User({ email });
  user.username = username;
  user.usernameKey = usernameKey;
  await user.setPassword(password);
  await user.save();

  await sendCodeQuietly(user, "verify");

  res.status(201).json({
    step: "verify",
    email: user.email,
    message: `We sent a 6-digit code to ${user.email}.`,
  });
});

router.post("/verify", async (req, res) => {
  const email = check.email(req.body.email);
  const code = check.code(req.body.code);

  const user = await User.findOne({ email });
  if (!user) throw badRequest("That code has expired. Ask for a new one.");
  if (user.verified) throw badRequest("This account is already verified. Sign in instead.");

  await consumeCode(user, "verify", code);
  user.verified = true;
  await user.save();

  startSession(res, user, true);
  res.json({ step: "done", user: user.toSelf() });
});

router.post("/resend", codeLimiter, async (req, res) => {
  const email = check.email(req.body.email);
  const purpose = check.oneOf(req.body.purpose, ["verify", "login"], "code type");

  const user = await User.findOne({ email });
  if (user) {
    const pendingLogin = purpose === "login" && user.twoFactor && (await Code.exists({ user: user._id, purpose: "login" }));
    if ((purpose === "verify" && !user.verified) || pendingLogin) {
      await issueCode(user, purpose);
    }
  }

  res.json({ message: "If that account needs a code, a new one is on its way." });
});

router.post("/login", async (req, res) => {
  const identifier = check.text(req.body.identifier, { field: "Username or email", max: 254 });
  const password = typeof req.body.password === "string" ? req.body.password : "";
  if (!password) throw badRequest("Password is required.");
  const remember = req.body.remember === true;

  const user = await findByIdentifier(identifier).select("+passwordHash");

  if (!user) {
    await bcrypt.compare(password, DUMMY_HASH);
    throw unauthorized(WRONG_LOGIN);
  }

  if (user.isLocked()) {
    const minutes = Math.ceil((user.lockUntil.getTime() - Date.now()) / 60000);
    throw new HttpError(423, `Too many failed attempts. Try again in ${minutes} minute${minutes === 1 ? "" : "s"}.`);
  }

  if (!(await user.checkPassword(password))) {
    user.failedLogins += 1;
    if (user.failedLogins >= MAX_FAILED_LOGINS) {
      user.failedLogins = 0;
      user.lockUntil = new Date(Date.now() + LOCK_MS);
    }
    await user.save();
    throw unauthorized(WRONG_LOGIN);
  }

  user.failedLogins = 0;
  user.lockUntil = undefined;
  await user.save();

  if (!user.verified) {
    await sendCodeQuietly(user, "verify");
    return res.status(403).json({
      step: "verify",
      email: user.email,
      message: "Verify your email first. We sent you a code.",
    });
  }

  if (user.twoFactor) {
    await sendCodeQuietly(user, "login");
    return res.json({
      step: "two-factor",
      email: user.email,
      message: "Two-factor is on. Enter the code we emailed you.",
    });
  }

  startSession(res, user, remember);
  res.json({ step: "done", user: user.toSelf() });
});

router.post("/login/two-factor", async (req, res) => {
  const email = check.email(req.body.email);
  const code = check.code(req.body.code);
  const remember = req.body.remember === true;

  const user = await User.findOne({ email });
  if (!user || !user.verified || !user.twoFactor) throw badRequest("That code has expired. Sign in again.");

  await consumeCode(user, "login", code);
  startSession(res, user, remember);
  res.json({ step: "done", user: user.toSelf() });
});

router.post("/forgot", codeLimiter, async (req, res) => {
  const email = check.email(req.body.email);
  const user = await User.findOne({ email });
  if (user?.verified) await sendCodeQuietly(user, "reset");
  res.json({ message: "If that email has an account, we sent a reset code." });
});

router.post("/reset", async (req, res) => {
  const email = check.email(req.body.email);
  const code = check.code(req.body.code);
  const password = check.password(req.body.password, "New password");

  const user = await User.findOne({ email });
  if (!user || !user.verified) throw badRequest("That code has expired. Ask for a new one.");

  await consumeCode(user, "reset", code);
  await user.setPassword(password);
  user.tokenVersion += 1;
  user.failedLogins = 0;
  user.lockUntil = undefined;
  await user.save();

  endSession(res);
  res.json({ message: "Password updated. Sign in with your new password." });
});

router.post("/logout", (req, res) => {
  endSession(res);
  res.json({ message: "Signed out." });
});

router.get("/me", (req, res) => {
  res.json({ user: req.user ? req.user.toSelf() : null });
});

export default router;
