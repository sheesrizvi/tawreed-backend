const express = require("express");

const { admin } = require("../middleware/authmiddleware");
const {
  createCategory,
  getAllCategory,
  deleteCategory,
  createBrand,
  getAllBrands,
  deleteBrand,
  createProduct,
  getAllProduct,
  deleteProduct,
  updateProduct,
  createProductReview,
} = require("../controller/ecomController");
const {
  ecomSellers,
  deleteSeller,
  allEcomSellers,
} = require("../controller/adminController");
const router = express.Router();

//admin
router.route("/category").post(createCategory);
router.route("/get-categories").get(getAllCategory);
router.route("/delete-categories").delete(deleteCategory);
router.route("/brands").post(createBrand);
router.route("/get-brands").get(getAllBrands);
router.route("/delete-brands").delete(deleteBrand);
router.route("/products").post(createProduct);
router.route("/products").get(getAllProduct);
router.route("/edit-product").get(updateProduct);
router.route("/delete-products").delete(deleteProduct);
router.route("/get-all-sellers").get(admin, allEcomSellers);
router.route("/get-sellers").get(admin, ecomSellers);
router.route("/delete-sellers").delete(admin, deleteSeller);
router.route("/create-review").post(createProductReview);

module.exports = router;
