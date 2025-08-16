import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "USER",
    },
    orderId: {
      type: String,
      required: [true, "plase provide the order id"],
      unique: true,
    },
    productId: {
      type: mongoose.Schema.ObjectId,
      ref: "PRODUCT",
    },
    product_details: {
      name: String,
      iamge: Array,
    },
    paymentId: {
      type: String,
      default: "",
    },
    payment_status: {
      type: String,
      default: "",
    },
    delivery_address: {
      type: mongoose.Schema.ObjectId,
      ref: "ADDRESS",
    },
    subTotalAmt: {
      type: Number,
      default: 0,
    },
    totalAmt: {
      type: Number,
      default: 0,
    },
    invoice_receipt: {
      type: String,
      default: "",
    },
  },
  {
    timestamp: true,
  }
);

const orderModel = mongoose.model("ORDER", orderSchema);
export default orderModel;
