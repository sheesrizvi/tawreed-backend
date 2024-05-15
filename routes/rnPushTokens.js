const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const Properties = require("../models/property/propertiesModel");
const MaintenanceManager = require("../models/maintenance/maintenanceManager");
const VendorEcom = require("../models/ecom/vendorEcomModel");
const Companies = require("../models/directory/companiesModel");

router.post("/register-token-user", async (req, res) => {
  // const User = req.body.user;

  const user = await User.findById(req.body.user._id);

  if (!user) return res.status(400).send({ error: "Invalid user." });
  user.pushToken = req.body.token;

  const updatedUser = await user.save();
  res.status(201).send();
});
router.post("/register-token-property", async (req, res) => {
  // const User = req.body.user;

  const user = await Properties.findById(req.body.user._id);

  if (!user) return res.status(400).send({ error: "Invalid user." });
  user.pushToken = req.body.token;

  const updatedUser = await user.save();
  res.status(201).send();
});
router.post("/register-token-maintenance", async (req, res) => {
  // const User = req.body.user;

  const user = await MaintenanceManager.findById(req.body.user._id);

  if (!user) return res.status(400).send({ error: "Invalid user." });
  user.pushToken = req.body.token;

  const updatedUser = await user.save();
  res.status(201).send();
});
router.post("/register-token-ecom", async (req, res) => {
  // const User = req.body.user;

  const user = await VendorEcom.findById(req.body.user._id);

  if (!user) return res.status(400).send({ error: "Invalid user." });
  user.pushToken = req.body.token;

  const updatedUser = await user.save();
  res.status(201).send();
});
router.post("/register-token-company", async (req, res) => {
  // const User = req.body.user;

  const user = await Companies.findById(req.body.user._id);

  if (!user) return res.status(400).send({ error: "Invalid user." });
  user.pushToken = req.body.token;

  const updatedUser = await user.save();
  res.status(201).send();
});

module.exports = router;
