import mongoose from "mongoose";

const gameSessionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  mode: { type: String, required: true },
  playStyle: { type: String, required: true },
  startedAt: { type: Date, default: Date.now },
  finished: { type: Boolean, default: false },
  expiresAt: { type: Date, required: true },
});

gameSessionSchema.index({ user: 1, finished: 1 });
gameSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model("GameSession", gameSessionSchema);
