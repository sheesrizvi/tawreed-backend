const mongoose = require("mongoose");

const featuredProductSchema = mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.String,
    ref: "EcomProduct",
  },
});

const FeaturedProduct = mongoose.model(
  "FeaturedProduct",
  featuredProductSchema
);

module.exports = FeaturedProduct;
