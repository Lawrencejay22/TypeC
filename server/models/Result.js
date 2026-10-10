import mongoose from "mongoose";

const resultSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    mode: { type: String, required: true },
    playStyle: { type: String, required: true },
    wpm: { type: Number, required: true },
    accuracy: { type: Number, required: true },
    score: { type: Number, required: true },
    kills: { type: Number, required: true },
    mistakes: { type: Number, required: true },
    chars: { type: Number, required: true },
    duration: { type: Number, required: true },
    grade: { type: String, required: true },
    bestStreak: { type: Number, default: 0 },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

resultSchema.index({ user: 1, createdAt: -1 });

export default mongoose.model("Result", resultSchema);
