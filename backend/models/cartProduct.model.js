import mongoose from "mongoose";

const cartProductSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.ObjectId,
      ref: "PRODUCT",
    },
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "USER",
    },
    quantity: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const cartProductModel = mongoose.model("CARTPRODUCT", cartProductSchema);
export default cartProductModel;
