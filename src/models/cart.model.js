import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "products",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },
}, { _id: false });

const cartSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    default: null,          
  },
  products: {
    type: [cartItemSchema],
    default: [],
  },
}, { timestamps: true });

export default mongoose.model("carts", cartSchema);
