const express = require("express");

const { admin } = require("../middleware/authmiddleware");
const {
  allPropertyManagers,
  propertyManagers,
  deletePropertyManagers,
} = require("../controller/adminController");
const {
  createProperty,
  deleteProperty,
  getAllProperties,
  updateProperty,
  getAllPropertiesAdmin,
  searchProperty,
} = require("../controller/propertyController");
const router = express.Router();

//admin

router.route("/").get(getAllProperties);
router.route("/alladmin").get(getAllPropertiesAdmin);
router.route("/search").get(searchProperty);
router.route("/create").post(createProperty);
router.route("/edit").post(updateProperty);
router.route("/delete-property").delete(deleteProperty);
router.route("/get-all-sellers").get(allPropertyManagers);
router.route("/get-sellers").get(admin, propertyManagers);
router.route("/delete-sellers").delete(admin, deletePropertyManagers);

module.exports = router;
