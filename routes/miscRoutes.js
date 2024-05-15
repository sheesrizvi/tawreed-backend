const express = require("express");

const { admin } = require("../middleware/authmiddleware");
const { createBanner, getBanner, deleteBanner } = require("../controller/miscController");
const router = express.Router();

router.route("/banner").post(createBanner);
router.route("/banner").get(getBanner);
router.route("/banner").delete(deleteBanner);


module.exports = router;
