import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const languageSchema = new mongoose.Schema(
  {
    races: { type: Number, default: 0 },
    sumWpm: { type: Number, default: 0 },
    bestWpm: { type: Number, default: 0 },
  },
  { _id: false }
);

const statsSchema = new mongoose.Schema(
  {
    races: { type: Number, default: 0 },
    wins: { type: Number, default: 0 },
    sumWpm: { type: Number, default: 0 },
    sumAcc: { type: Number, default: 0 },
    avgWpm: { type: Number, default: 0 },
    avgAcc: { type: Number, default: 0 },
    bestWpm: { type: Number, default: 0 },
    chars: { type: Number, default: 0 },
    kills: { type: Number, default: 0 },
    score: { type: Number, default: 0 },
    streak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    lastPlayDay: { type: String, default: "" },
    lastPlayedAt: { type: Date },
  },
  { _id: false }
);

const badgeSchema = new mongoose.Schema(
  {
    key: { type: String, required: true },
    earnedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, trim: true },
    usernameKey: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    verified: { type: Boolean, default: false },
    twoFactor: { type: Boolean, default: false },
    bio: { type: String, default: "", maxlength: 80 },
    tokenVersion: { type: Number, default: 0 },
    failedLogins: { type: Number, default: 0 },
    lockUntil: { type: Date },
    lastSeen: { type: Date },
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    followerCount: { type: Number, default: 0 },
    stats: { type: statsSchema, default: () => ({}) },
    languages: { type: Map, of: languageSchema, default: () => new Map() },
    badges: { type: [badgeSchema], default: [] },
  },
  { timestamps: true }
);

userSchema.index({ "stats.avgWpm": -1, "stats.avgAcc": -1 });
userSchema.index({ lastSeen: -1 });

userSchema.methods.setPassword = async function setPassword(plain) {
  this.passwordHash = await bcrypt.hash(plain, 12);
};

userSchema.methods.checkPassword = function checkPassword(plain) {
  return bcrypt.compare(plain, this.passwordHash);
};

userSchema.methods.isLocked = function isLocked() {
  return Boolean(this.lockUntil && this.lockUntil > new Date());
};

userSchema.methods.hasBadge = function hasBadge(key) {
  return this.badges.some((badge) => badge.key === key);
};

userSchema.methods.toSelf = function toSelf() {
  return {
    id: this._id.toString(),
    username: this.username,
    email: this.email,
    bio: this.bio,
    verified: this.verified,
    twoFactor: this.twoFactor,
    joined: this.createdAt,
  };
};

export default mongoose.model("User", userSchema);
