const mongoose = require("mongoose");

const maintenanceFormSchema = mongoose.Schema({
  maintenanceCategory: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "MaintenanceCategory",
  },
  // questions: [
  //   { title: { type: String, required: true }, options: [{ type: String }] },
  // ],
  description: {
    type: String,
  },
  dateTime: {
    type: String,
  },
  location: {
    type: { type: String, default: "Point" },
    coordinates: { type: [Number], index: "2dsphere" },
  },
  image: [
    {
      type: String,
    },
  ],
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "MaintenanceManager",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
});

const MaintenanceForm = mongoose.model(
  "MaintenanceForm",
  maintenanceFormSchema
);

module.exports = MaintenanceForm;
