const mongoose = require("mongoose");

const imageBannerSchema = mongoose.Schema({
  image: {
    type: String,
    required: true,
  },
  name: {
    type: String,
  }, 
  product: {
    type: String,
  },
  company: {
    type: String,
  },
  maintenance: {
    type: String,
  },
  property: {
    type: String,
  },
});

const Banner = mongoose.model("Banner", imageBannerSchema);

module.exports = Banner;