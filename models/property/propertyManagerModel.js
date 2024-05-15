const mongoose = require("mongoose");
const bycrypt = require("bcryptjs");

const propertyManagerSchema = mongoose.Schema(
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
      default: "property"
    },
   
  },
  {
    timestamps: true,
  }
);

propertyManagerSchema.methods.matchPassword = async function (enteredPassword) {
  return await bycrypt.compare(enteredPassword, this.password);
};

propertyManagerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bycrypt.genSalt(10);
  this.password = await bycrypt.hash(this.password, salt);
});

const PropertyManager = mongoose.model("PropertyManager", propertyManagerSchema);

module.exports = PropertyManager;
