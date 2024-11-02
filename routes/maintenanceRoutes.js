const express = require("express");

const { admin, auth } = require("../middleware/authmiddleware");

const {
  createCategory,
  getAllCategory,
  deleteCategory,
  submitForm,
  getsubmittedForms,
  setMyCategory,
  getMyCategory,
  delMyCategory,
  getMaintenanceByCategory,
  getsubmittedFormsByManager,
  getsubmittedFormsByUser,
  updateCategory,
  getAllCategoryWithPagination,
} = require("../controller/maintenanceController");
const {
  allMaintenanceManagers,
  maintenanceManagers,
  deleteMaintenanceManagers,
} = require("../controller/adminController");
const router = express.Router();

//admin
router.route("/category").post(createCategory);
router.route("/category/update").post(updateCategory);
router.route("/get-categories").get(getAllCategory);
router.route("/get-categories-with-pagination").get(getAllCategoryWithPagination);
router.route("/delete-categories").delete(deleteCategory);

//form
router.route("/form").post(submitForm);
router.route("/get-forms").get(getsubmittedForms);
router.route("/get-forms-by-user").get(getsubmittedFormsByUser);
router.route("/get-forms-by-manager").get(getsubmittedFormsByManager);

router.route("/get-all-sellers").get(admin, allMaintenanceManagers);
router.route("/get-sellers").get(admin, maintenanceManagers);
router.route("/delete-sellers").delete(admin, deleteMaintenanceManagers);
router.route("/set-my-categories").post(auth, setMyCategory);
router.route("/get-my-categories").get(getMyCategory);
router.route("/del-my-categories").delete(delMyCategory);
router.route("/get-seller-byCat").get(getMaintenanceByCategory);

// router.route("/products").post(createProduct)
// router.route("/products").get(getAllProduct)
// router.route("/delete-products").delete(deleteProduct)
// router.route("/get-sellers").get(admin, ecomSellers)
// router.route("/delete-sellers").delete(admin, deleteSeller)

module.exports = router;
