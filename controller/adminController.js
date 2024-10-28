const asyncHandler = require("express-async-handler");
const { generateTokenAdmin } = require("../utils/generateToken.js");
const Admin = require("../models/adminModel.js");
const VendorEcom = require("../models/ecom/vendorEcomModel.js");
const EcomProduct = require("../models/ecom/ecomProductModel.js");
const PropertyManager = require("../models/property/propertyManagerModel.js");
const Properties = require("../models/property/propertiesModel.js");
const MaintenanceManager = require("../models/maintenance/maintenanceManager.js");
const MaintenanceForm = require("../models/maintenance/maintenanceForms.js");
const Companies = require("../models/directory/companiesModel.js");

// @desc    Auth user & get token
// @route   POST /api/users/login
//  @access   Public

const authAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password)
  const admin = await Admin.findOne({ email });
  console.log(admin)
  if (admin && (await admin.matchPassword(password))) {
    res.json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      token: generateTokenAdmin(admin._id, admin.name, admin.email, admin.type),
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// @desc    User registration
// @route   POST /api/users
//@access   Public

const registerAdmin = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await Admin.findOne({ email });

  if (userExists) {
    res.status(404);
    throw new Error("User already exists");
  }

  const admin = await Admin.create({
    name,
    email,
    password,
  });

  if (admin) {
    res.status(201).json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      token: generateTokenAdmin(admin._id, admin.name, admin.email, admin.type),
    });
  } else {
    res.status(404);
    throw new Error("Invalid user data");
  }
});
const ecomSellers = asyncHandler(async (req, res) => {
  const page = Number(req.query.pageNumber) || 1;
  const pageSize = 30;
  const count = await VendorEcom.countDocuments({
    active: true,
  });
  var pageCount = Math.floor(count / 30);
  if (count % 30 !== 0) {
    pageCount = pageCount + 1;
  }
  const sellers = await VendorEcom.find({}, "_id name")
    .limit(pageSize)
    .sort({ createdAt: -1 })
    .skip(pageSize * (page - 1));
  res.json({ sellers, pageCount });
});
const allEcomSellers = asyncHandler(async (req, res) => {
  const sellers = await VendorEcom.find({});
  res.json(sellers);
});
const deleteSeller = asyncHandler(async (req, res) => {
  await EcomProduct.deleteMany({ seller: req.query.id });
  await VendorEcom.deleteOne({ _id: req.query.id });
  res.json("deleted");
});
const propertyManagers = asyncHandler(async (req, res) => {
  const page = Number(req.query.pageNumber) || 1;
  const pageSize = 30;
  const count = await PropertyManager.countDocuments({
    active: true,
  });
  var pageCount = Math.floor(count / 30);
  if (count % 30 !== 0) {
    pageCount = pageCount + 1;
  }
  const sellers = await PropertyManager.find({}, "_id name")
    .limit(pageSize)
    .sort({ createdAt: -1 })
    .skip(pageSize * (page - 1));
  res.json({ sellers, pageCount });
});
const allPropertyManagers = asyncHandler(async (req, res) => {
  const sellers = await PropertyManager.find({});

  res.json(sellers);
});
const deletePropertyManagers = asyncHandler(async (req, res) => {
  await Properties.deleteMany({ propertyManager: req.query.id });
  await PropertyManager.deleteOne({ _id: req.query.id });
  res.json("deleted");
});

const maintenanceManagers = asyncHandler(async (req, res) => {
  const page = Number(req.query.pageNumber) || 1;
  const pageSize = 30;
  const count = await MaintenanceManager.countDocuments({
    active: true,
  });
  var pageCount = Math.floor(count / 30);
  if (count % 30 !== 0) {
    pageCount = pageCount + 1;
  }
  const sellers = await MaintenanceManager.find({}, "_id name")
    .limit(pageSize)
    .sort({ createdAt: -1 })
    .skip(pageSize * (page - 1));
  res.json({ sellers, pageCount });
});
const allMaintenanceManagers = asyncHandler(async (req, res) => {
  const sellers = await MaintenanceManager.find({});

  res.json(sellers);
});
const deleteMaintenanceManagers = asyncHandler(async (req, res) => {
  await MaintenanceForm.deleteMany({ propertyManager: req.query.id });
  await MaintenanceManager.deleteOne({ _id: req.query.id });
  res.json("deleted");
});

const company = asyncHandler(async (req, res) => {
  const page = Number(req.query.pageNumber) || 1;
  const pageSize = 30;
  const count = await Companies.countDocuments({
    active: true,
  });
  var pageCount = Math.floor(count / 30);
  console.log(pageCount);
  if (count % 30 !== 0) {
    pageCount = pageCount + 1;
  }
  const sellers = await Companies.find({})
    .limit(pageSize)
    .sort({ createdAt: -1 })
    .skip(pageSize * (page - 1));

  res.json({ sellers, pageCount });
});

const allCompanies = asyncHandler(async (req, res) => {
  const sellers = await Companies.find({});

  res.json(sellers);
});

const deletecompany = asyncHandler(async (req, res) => {
  await Companies.deleteOne({ _id: req.query.id });
  res.json("deleted");
});

const adminDashboard = asyncHandler(async (req, res) => {
  const companiesCount = await Companies.countDocuments({})
  const ecommerceVendorCount = await VendorEcom.countDocuments({})
  const maintenanceVendorCount = await MaintenanceManager.countDocuments({})
  const propertyVendorCount = await PropertyManager.countDocuments({})
  res.status(200).json({
      companiesCount,
      ecommerceVendorCount,
      maintenanceVendorCount,
      propertyVendorCount
  })
})


module.exports = {
  allEcomSellers,
  authAdmin,
  registerAdmin,
  ecomSellers,
  deleteSeller,
  allPropertyManagers,
  propertyManagers,
  deletePropertyManagers,
  maintenanceManagers,
  allMaintenanceManagers,
  deleteMaintenanceManagers,
  company,
  deletecompany,
  allCompanies,
  adminDashboard
};
