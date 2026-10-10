import User from "../models/User.js";
import { readSession, endSession } from "../services/session.js";
import { unauthorized } from "../utils/httpError.js";

const SEEN_EVERY_MS = 30 * 1000;

export async function loadUser(req, res, next) {
  const session = readSession(req);
  if (!session) return next();

  const user = await User.findById(session.sub);
  if (!user || !user.verified || user.tokenVersion !== session.v) {
    endSession(res);
    return next();
  }

  req.user = user;

  const now = Date.now();
  if (!user.lastSeen || now - user.lastSeen.getTime() > SEEN_EVERY_MS) {
    user.lastSeen = new Date(now);
    await User.updateOne({ _id: user._id }, { $set: { lastSeen: user.lastSeen } });
  }

  next();
}

export function requireAuth(req, res, next) {
  if (!req.user) return next(unauthorized());
  next();
}
