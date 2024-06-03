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
const maintenanceManagerSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    nameAr: {
      type: String,
      required: true,
    },
    review: [reviewSchema],
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    maintenanceCategory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MaintenanceCategory",
      },
    ],
    phone: {
      type: Number,
      required: true,
    },
    services: [
      {
        name: { type: String },
      },
    ],
    servicesAr: [
      {
        name: { type: String },
      },
    ],
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
      default: "maintenance",
    },
  },
  {
    timestamps: true,
  }
);

maintenanceManagerSchema.methods.matchPassword = async function (
  enteredPassword
) {
  return await bycrypt.compare(enteredPassword, this.password);
};

maintenanceManagerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bycrypt.genSalt(10);
  this.password = await bycrypt.hash(this.password, salt);
});

const MaintenanceManager = mongoose.model(
  "MaintenanceManager",
  maintenanceManagerSchema
);

module.exports = MaintenanceManager;
