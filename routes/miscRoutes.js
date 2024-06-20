const express = require("express");

const { admin } = require("../middleware/authmiddleware");
const { createBanner, getBanner, deleteBanner, deletefeaturedProperty, deletefeaturedProduct, createfeaturedProperty, createfeaturedProduct, getfeaturedProperties, getfeaturedProducts } = require("../controller/miscController");
const router = express.Router();

router.route("/banner").post(createBanner);
router.route("/banner").get(getBanner);
router.route("/banner").delete(deleteBanner);
router.route("/property/delete").delete(deletefeaturedProperty);
router.route("/product/delete").delete(deletefeaturedProduct);
router.route("/property/create").post(createfeaturedProperty);
router.route("/product/create").post(createfeaturedProduct);
router.route("/property").get(getfeaturedProperties);
router.route("/product").get(getfeaturedProducts);


module.exports = router;
