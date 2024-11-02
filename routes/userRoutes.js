const express = require("express");
const { registerAdmin, authAdmin } = require("../controller/adminController");

const { admin } = require("../middleware/authmiddleware");
const {
  getUsers,
  updateUserProfile,
  getUserProfile,
  deleteUser
} = require("../controller/userController");
const router = express.Router();

//admin
router.route("/").get(getUsers);
router.route("/get-profile").get(getUserProfile);
router.route("/admin-login").post(authAdmin);
router.route("/profile").put(updateUserProfile);
router.route("/delete-user/:id").delete(admin, deleteUser)
//seller

module.exports = router;
