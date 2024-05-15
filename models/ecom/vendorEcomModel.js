const mongoose = require("mongoose");
const bycrypt = require("bcryptjs");

const vendorEcomSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    nameAr: {
      type: String,
      required: true,
    },
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
    logo: {
        type: String,
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
    type: {
      type: String,
      default: "ecom"
    },
   
  },
  {
    timestamps: true,
  }
);

vendorEcomSchema.methods.matchPassword = async function (enteredPassword) {
  return await bycrypt.compare(enteredPassword, this.password);
};

vendorEcomSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bycrypt.genSalt(10);
  this.password = await bycrypt.hash(this.password, salt);
});

const VendorEcom = mongoose.model("VendorEcom", vendorEcomSchema);

module.exports = VendorEcom;
