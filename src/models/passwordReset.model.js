import mongoose from "mongoose";

const passwordResetSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true, index: true },
  tokenHash: { type: String, required: true },
  expiresAt: { type: Date, required: true, index: true },
  usedAt: { type: Date, default: null },
}, { timestamps: true });

export default mongoose.model("password_resets", passwordResetSchema);
