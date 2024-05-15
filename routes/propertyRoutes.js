const express = require("express");

const { admin } = require("../middleware/authmiddleware");
const { allPropertyManagers, propertyManagers, deletePropertyManagers } = require("../controller/adminController");
const { createProperty, deleteProperty, getAllProperties, updateProperty } = require("../controller/propertyController");
const router = express.Router();


//admin

router.route("/").get(getAllProperties)
router.route("/create").post(createProperty)
router.route("/edit").post(updateProperty)
router.route("/delete-property").delete(deleteProperty)
router.route("/get-all-sellers").get(admin, allPropertyManagers)
router.route("/get-sellers").get(admin, propertyManagers)
router.route("/delete-sellers").delete(admin, deletePropertyManagers)

module.exports = router;
