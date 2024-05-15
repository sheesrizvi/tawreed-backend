const mongoose = require("mongoose");

const reviewSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const ecomproductSchema = mongoose.Schema(
  {
    _id: String,

    name: {
      type: String,
      required: true,
    },
    nameAr: {
      type: String,
      required: true,
    },
    image: [
      {
        type: String,
        required: true,
      },
    ],
    ecomBrand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EcomBrand",
    },
    ecomCategory: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "EcomCategory",
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "VendorEcom",
    },
    manufacturer: {
      type: String,
    },
    manufacturerAr: {
      type: String,
    },
    active: {
      type: Boolean,
      default: true,
    },
    description: {
      type: String,
    },
    details: {
      type: String,
    },
    descriptionAr: {
      type: String,
    },
    detailsAr: {
      type: String,
    },

    reviews: [reviewSchema],
    rating: {
      type: Number,
      required: true,
      default: 0,
    },

    price: {
      type: Number,
      required: true,
      default: 0,
    },
    discount: {
      type: Number,
      required: true,
      default: 0,
    },
    countInStock: {
      type: Number,
      required: true,
      default: 10,
    },
  },
  {
    timestamps: true,
  }
);

const EcomProduct = mongoose.model("EcomProduct", ecomproductSchema);

module.exports = EcomProduct;
