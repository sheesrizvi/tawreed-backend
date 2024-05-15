const mongoose = require("mongoose");

const companyCategorySchema = mongoose.Schema({
  
  name: {
    type: String,
    required: true,
  },
  nameAr: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  descriptionAr: {
    type: String,
  },
  image: {
    type: String,
  },
  active: {
    type: Boolean,
  },
});

const CompanyCategory = mongoose.model("CompanyCategory", companyCategorySchema);

module.exports = CompanyCategory;
