const express = require("express");
const { registerAdmin, authAdmin } = require("../controller/adminController");

const { admin } = require("../middleware/authmiddleware");
const { getUsers } = require("../controller/userController");
const router = express.Router();


//admin
router.route("/").get(getUsers);
router.route("/admin-login").post(authAdmin);
//seller


module.exports = router;
