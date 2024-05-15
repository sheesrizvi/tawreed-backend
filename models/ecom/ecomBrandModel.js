const mongoose = require("mongoose");

const ecombrandSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  nameAr: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
});

const EcomBrand = mongoose.model("EcomBrand", ecombrandSchema);

module.exports = EcomBrand;
