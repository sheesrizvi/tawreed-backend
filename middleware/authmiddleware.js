const jwt = require("jsonwebtoken");
const Admin = require("../models/adminModel");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const Companies = require("../models/directory/companiesModel");
const VendorEcom = require("../models/ecom/vendorEcomModel");
const PropertyManager = require('../models/property/propertiesModel');
const MaintenanceManager = require("../models/maintenance/maintenanceManager");

const auth = asyncHandler(async (req, res, next) => {

  try {
    const token = req.header("x-auth-token");
    if (!token) return res.status(403).send("Access denied. Login Required");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await Admin.findById(decoded.id);
    next();
  } catch (error) {
    res.status(400).send("Invalid token");
  }
});
const admin = asyncHandler(async (req, res, next) => {

  try {
    const token = req.header("x-auth-token");
    if (!token) return res.status(403).send("Access denied. Admin Login Required");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await Admin.findById(decoded.id);
    next();
  } catch (error) {
    res.status(400).send("Invalid token");
  }
});
const company = asyncHandler(async (req, res, next) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) return res.status(403).send("Access denied. Login Required");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await Companies.findById(decoded.id);
    next();
  } catch (error) {
    res.status(400).send("Invalid token");
  }
});
const vendorEcom = asyncHandler(async (req, res, next) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) return res.status(403).send("Access denied. Login Required");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await VendorEcom.findById(decoded.id);
    next();
  } catch (error) {
    res.status(400).send("Invalid token");
  }
});
const propertyManager = asyncHandler(async (req, res, next) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) return res.status(403).send("Access denied. Login Required");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await PropertyManager.findById(decoded.id);
    next();
  } catch (error) {
    res.status(400).send("Invalid token");
  }
});
const maintenanceManager = asyncHandler(async (req, res, next) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) return res.status(403).send("Access denied. Login Required");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await MaintenanceManager.findById(decoded.id);
    next();
  } catch (error) {
    res.status(400).send("Invalid token");
  }
});


module.exports = { admin, auth, maintenanceManager, vendorEcom, propertyManager, company };
