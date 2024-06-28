const mongoose = require("mongoose");

const areaSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  nameAr: {
    type: String,
    required: true,
  },
});

const Area = mongoose.model("Area", areaSchema);

module.exports = Area;
