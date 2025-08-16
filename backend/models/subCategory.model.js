import mongoose from "mongoose";

const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      default: "",
    },
    category: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "CATEGORY",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const subCategoryModel = mongoose.model("SUBCATEGORY", subCategorySchema);
export default subCategoryModel;
