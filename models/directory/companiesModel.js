const mongoose = require("mongoose");
const bycrypt = require("bcryptjs");

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

const companiesSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    nameAr: {
      type: String,
      required: true,
    },
    reviews: [reviewSchema],
    companyCategory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CompanyCategory",
      },
    ],
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      required: true,
      default: "undefined",
    },
    addressAr: {
      type: String,
      required: true,
      default: "undefined",
    },
   
    registrationNumber: {
      type: String,
      required: true,
    },
    registered: {
      type: Boolean,
      required: true,
      default: false,
    },
    pushToken: {
      type: String,
    },
    website: {
      type: String,
    },
    type: {
      type: String,
      default: "company",
    },
    description: {
      type: String,
    },
    descriptionAr: {
      type: String,
    },
    details: {
      type: String,
    },
    detailsAr: {
      type: String,
    },
    image: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

companiesSchema.methods.matchPassword = async function (enteredPassword) {
  return await bycrypt.compare(enteredPassword, this.password);
};

companiesSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bycrypt.genSalt(10);
  this.password = await bycrypt.hash(this.password, salt);
});

const Companies = mongoose.model("Companies", companiesSchema);

module.exports = Companies;
