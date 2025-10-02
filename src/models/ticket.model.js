import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
  code: { type: String, unique: true, required: true },
  purchase_datetime: { type: Date, default: Date.now },
  amount: { type: Number, required: true, min: 0 },
  purchaser: { type: String, required: true }, // email del user
}, { timestamps: true });

export default mongoose.model("tickets", ticketSchema);
