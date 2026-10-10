import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, maxlength: 60 },
    email: { type: String, required: true, maxlength: 254 },
    subject: { type: String, required: true, maxlength: 100 },
    message: { type: String, required: true, maxlength: 2000 },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: { type: String, enum: ["new", "read", "closed"], default: "new" },
  },
  { timestamps: true }
);

export default mongoose.model("Message", messageSchema);
