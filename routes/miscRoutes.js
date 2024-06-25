const express = require("express");

const { admin } = require("../middleware/authmiddleware");
const {
  createBanner,
  getBanner,
  deleteBanner,
  deletefeaturedProperty,
  deletefeaturedProduct,
  createfeaturedProperty,
  createfeaturedProduct,
  getfeaturedProperties,
  getfeaturedProducts,
  addWishlistItems,
  deleteWishlistItems,
  getWishlist,
} = require("../controller/miscController");
const router = express.Router();

router.route("/wishlist/getall").get(getWishlist);
router.route("/wishlist/create").post(addWishlistItems);
router.route("/wishlist/delete").delete(deleteWishlistItems);
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
