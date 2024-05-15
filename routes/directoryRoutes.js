const express = require("express");

const { admin, auth } = require("../middleware/authmiddleware");


const { allCompanies, company, deletecompany } = require("../controller/adminController");
const { createCategory, getAllCategory, deleteCategory, setMyCategory, getMyCategory, delMyCategory, getCompanyByCategory, updateProfile, getProfile } = require("../controller/directoryController");
const router = express.Router();

//admin
router.route("/category").post(createCategory);
router.route("/get-categories").get(getAllCategory);
router.route("/delete-categories").delete(deleteCategory);



router.route("/get-all-sellers").get(admin, allCompanies);
router.route("/get-seller-byCat").get(getCompanyByCategory);
router.route("/get-sellers").get(admin, company);
router.route("/delete-sellers").delete(admin, deletecompany);
router.route("/set-my-categories").post(auth, setMyCategory);
router.route("/get-my-categories").get(getMyCategory);
router.route("/del-my-categories").delete(delMyCategory);
router.route("/update-profile").post(updateProfile);
router.route("/get-profile").get(getProfile);



module.exports = router;
