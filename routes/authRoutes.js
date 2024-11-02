const express = require("express");
const { registerAdmin, authAdmin } = require("../controller/adminController");
const {
  registerEcomVendor,
  authEcomVendor,
  registerMaintenanceManager,
  authMaintenanceManager,
  registerPropertyManager,
  authPropertyManager,
  registerCompany,
  authCompany,
  approveSeller,
  unapprovedSeller,
  deleteSeller,

} = require("../controller/sellerController");
const { admin } = require("../middleware/authmiddleware");
const {
  registerUser,
  authUser,
  saveShippingAddress,
} = require("../controller/userController");
const router = express.Router();

//admin
router.route("/admin-register").post(registerAdmin);
router.route("/user-register").post(registerUser);
router.route("/admin-login").post(authAdmin);
router.route("/user-login").post(authUser);
router.route("/saveshippingaddress").post(saveShippingAddress);
//seller
router.route("/ecom-register").post(registerEcomVendor);
router.route("/ecom-login").post(authEcomVendor);
router.route("/company-register").post(registerCompany);
router.route("/company-login").post(authCompany);
router.route("/property-register").post(registerPropertyManager);
router.route("/property-login").post(authPropertyManager);
router.route("/maintenance-register").post(registerMaintenanceManager);
router.route("/maintenance-login").post(authMaintenanceManager);
router.route("/approve-seller").post(admin, approveSeller);
router.route("/delete-seller").delete(admin, deleteSeller);
router.route("/unapproved-seller").get(admin, unapprovedSeller);


module.exports = router;
