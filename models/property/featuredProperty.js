const mongoose = require("mongoose");

const featuredPropertySchema = mongoose.Schema({
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Properties",
  },
});

const FeaturedProperty = mongoose.model(
  "FeaturedProperty",
  featuredPropertySchema
);

module.exports = FeaturedProperty;
