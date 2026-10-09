import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import Code from "../models/Code.js";
import { sendCodeEmail } from "./mailer.js";
import { badRequest, tooMany } from "../utils/httpError.js";

const TTL_MS = 10 * 60 * 1000;
const RESEND_COOLDOWN_MS = 60 * 1000;
const MAX_ATTEMPTS = 5;

export async function issueCode(user, purpose) {
  const existing = await Code.findOne({ user: user._id, purpose });
  if (existing && Date.now() - existing.createdAt.getTime() < RESEND_COOLDOWN_MS) {
    const wait = Math.ceil((RESEND_COOLDOWN_MS - (Date.now() - existing.createdAt.getTime())) / 1000);
    throw tooMany(`Please wait ${wait}s before asking for another code.`);
  }

  const code = crypto.randomInt(0, 1_000_000).toString().padStart(6, "0");

  await Code.deleteMany({ user: user._id, purpose });
  await Code.create({
    user: user._id,
    purpose,
    codeHash: await bcrypt.hash(code, 10),
    expiresAt: new Date(Date.now() + TTL_MS),
  });

  await sendCodeEmail(user, code, purpose);
}

export async function consumeCode(user, purpose, code) {
  const entry = await Code.findOne({ user: user._id, purpose });

  if (!entry || entry.expiresAt < new Date()) {
    if (entry) await entry.deleteOne();
    throw badRequest("That code has expired. Ask for a new one.");
  }

  if (entry.attempts >= MAX_ATTEMPTS) {
    await entry.deleteOne();
    throw tooMany("Too many wrong tries. Ask for a new code.");
  }

  const matches = await bcrypt.compare(code, entry.codeHash);
  if (!matches) {
    entry.attempts += 1;
    await entry.save();
    const left = MAX_ATTEMPTS - entry.attempts;
    throw badRequest(left > 0 ? `Wrong code. ${left} ${left === 1 ? "try" : "tries"} left.` : "Wrong code. Ask for a new one.");
  }

  await entry.deleteOne();
}
