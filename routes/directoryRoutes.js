const express = require("express");

const { admin, auth } = require("../middleware/authmiddleware");

const {
  allCompanies,
  company,
  deletecompany,
  adminDashboard
} = require("../controller/adminController");
const {
  createCategory,
  getAllCategory,
  deleteCategory,
  setMyCategory,
  getMyCategory,
  delMyCategory,
  getCompanyByCategory,
  updateProfile,
  getProfile,
  searchCompanies,
  createCompanyReview,
} = require("../controller/directoryController");
const router = express.Router();

//admin
router.route("/category").post(createCategory);
router.route("/get-categories").get(getAllCategory);
router.route("/delete-categories").delete(deleteCategory);

router.route("/get-all-sellers").get(allCompanies);
router.route("/search").get(searchCompanies);
router.route("/get-seller-byCat").get(getCompanyByCategory);
router.route("/get-sellers").get(company);
router.route("/delete-sellers").delete(admin, deletecompany);
router.route("/set-my-categories").post(auth, setMyCategory);
router.route("/get-my-categories").get(getMyCategory);
router.route("/del-my-categories").delete(delMyCategory);
router.route("/update-profile").post(updateProfile);
router.route("/get-profile").get(getProfile);
router.route("/create-review").post(createCompanyReview);


module.exports = router;
