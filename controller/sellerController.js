const asyncHandler = require("express-async-handler");

const Companies = require("../models/directory/companiesModel.js");
const PropertyManager = require("../models/property/propertyManagerModel.js");
const MaintenanceManager = require("../models/maintenance/maintenanceManager.js");
const VendorEcom = require("../models/ecom/vendorEcomModel.js");
const {
  generateTokenCompany,
  generateTokenProperty,
  generateTokenMaintenance,
  generateTokenEcom,
} = require("../utils/generateToken.js");

// @desc    Company

const authCompany = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const company = await Companies.findOne({ email });

  if (company && (await company.matchPassword(password))) {
    res.json({
      _id: company._id,
      name: company.name,
      email: company.email,
      token: generateTokenCompany(
        company._id,
        company.name,
        company.nameAr,
        company.email,

        company.phone,

        company.type,
        company.registrationNumber,

        company.pushToken
      ),
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

const registerCompany = asyncHandler(async (req, res) => {
  const {
    name,
    nameAr,
    email,
    password,
    companyCategory,
    phone,
    address,
    logo,
    registrationNumber,
    registered,
    website,
    services,
    pushToken,
  } = req.body;
  const userExists = await Companies.findOne({ email });

  if (userExists) {
    res.status(404);
    throw new Error("Company already exists");
  }

  const company = await Companies.create({
    name,
    nameAr,
    email,
    password,
    companyCategory,
    phone,
    address,
    services,
    website,
    logo,
    registrationNumber,
    registered,
    pushToken,
  });

  if (company) {
    res.status(201).json({
      _id: company._id,
      name: company.name,
      email: company.email,
      token: generateTokenCompany(
        company._id,
        company.name,
        company.nameAr,
        company.email,
        company.phone,
        company.type,
        company.registrationNumber,
        company.pushToken
      ),
    });
  } else {
    res.status(404);
    throw new Error("Invalid user data");
  }
});

// @desc    Property

const authPropertyManager = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const propertyManager = await PropertyManager.findOne({ email });

  if (propertyManager && (await propertyManager.matchPassword(password))) {
    res.json({
      _id: propertyManager._id,
      name: propertyManager.name,
      email: propertyManager.email,
      token: generateTokenProperty(
        propertyManager._id,
        propertyManager.name,
        propertyManager.nameAr,
        propertyManager.email,

        propertyManager.phone,
        propertyManager.type,
        propertyManager.registrationNumber,

        propertyManager.pushToken
      ),
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

const registerPropertyManager = asyncHandler(async (req, res) => {
  const {
    name,
    nameAr,
    email,
    password,

    phone,

    logo,
    registrationNumber,
    registered,
    pushToken,
  } = req.body;
  const userExists = await PropertyManager.findOne({ email });

  if (userExists) {
    res.status(404);
    throw new Error("User already exists");
  }

  const company = await PropertyManager.create({
    name,
    nameAr,
    email,
    password,

    phone,

    logo,
    registrationNumber,
    registered,
    pushToken,
  });

  if (company) {
    res.status(201).json({
      _id: company._id,
      name: company.name,
      email: company.email,
      token: generateTokenProperty(
        company._id,
        company.name,
        company.nameAr,
        company.email,

        company.phone,

        company.type,
        company.registrationNumber,

        company.pushToken
      ),
    });
  } else {
    res.status(404);
    throw new Error("Invalid user data");
  }
});

// @desc    Maintenance Manager

const authMaintenanceManager = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const admin = await MaintenanceManager.findOne({ email });

  if (admin && (await admin.matchPassword(password))) {
    res.json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      token: generateTokenMaintenance(
        admin._id,
        admin.name,
        admin.nameAr,
        admin.email,
        admin.phone,
        admin.type,
        admin.registrationNumber,
        admin.pushToken
      ),
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

const registerMaintenanceManager = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    password,
    maintenanceCategory,
    phone,
    nameAr,
    logo,
    registrationNumber,
    registered,
    pushToken,
  } = req.body;
  const userExists = await MaintenanceManager.findOne({ email });

  if (userExists) {
    res.status(404);
    throw new Error("Company already exists");
  }

  const company = await MaintenanceManager.create({
    name,
    email,
    password,
    maintenanceCategory,
    phone,
    nameAr,
    logo,
    registrationNumber,
    registered,
    pushToken,
  });

  if (company) {
    res.status(201).json({
      _id: company._id,
      name: company.name,
      email: company.email,
      token: generateTokenMaintenance(
        company._id,
        company.name,
        company.nameAr,
        company.email,

        company.phone,
        company.type,

        company.registrationNumber,

        company.pushToken
      ),
    });
  } else {
    res.status(404);
    throw new Error("Invalid user data");
  }
});

// @desc    Ecom Vendor

const authEcomVendor = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const vendorEcom = await VendorEcom.findOne({ email });

  if (vendorEcom && (await vendorEcom.matchPassword(password))) {
    res.json({
      _id: vendorEcom._id,
      name: vendorEcom.name,
      email: vendorEcom.email,
      token: generateTokenEcom(
        vendorEcom._id,
        vendorEcom.name,
        vendorEcom.nameAr,
        vendorEcom.email,
        vendorEcom.phone,
        vendorEcom.type,

        vendorEcom.registrationNumber,

        vendorEcom.pushToken
      ),
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

const registerEcomVendor = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    password,
    nameAr,
    phone,
    logo,
    registrationNumber,
    registered,
    pushToken,
  } = req.body;

  const userExists = await VendorEcom.findOne({ email });

  if (userExists) {
    res.status(404);
    throw new Error("Company already exists");
  }

  const company = await VendorEcom.create({
    name,
    email,
    password,
    nameAr,
    phone,
    logo,
    registrationNumber,
    registered,
    pushToken,
  });

  if (company) {
    res.status(201).json({
      _id: company._id,
      name: company.name,
      email: company.email,
      token: generateTokenEcom(
        company._id,
        company.name,
        company.nameAr,
        company.email,
        company.phone,
        company.type,
        company.registrationNumber,
        company.pushToken
      ),
    });
  } else {
    res.status(404);
    throw new Error("Invalid user data");
  }
});
const approveSeller = asyncHandler(async (req, res) => {
  const { id, sellerType } = req.body;

  let seller;
  switch (sellerType) {
    case "ecom":
      seller = await VendorEcom.findById(id);
      if (seller) {
        seller.registered = true;
        const updatedUser = await seller.save();
        res.json("Approved");
      }
      break;
    case "company":
      seller = await Companies.findById(id);
      if (seller) {
        seller.registered = true;
        const updatedUser = await seller.save();
        res.json("Approved");
      }
      break;
    case "maintenance":
      seller = await MaintenanceManager.findById(id);
      if (seller) {
        seller.registered = true;
        const updatedUser = await seller.save();
        res.json("Approved");
      }
      break;
    case "property":
      seller = await PropertyManager.findById(id);
      if (seller) {
        seller.registered = true;
        const updatedUser = await seller.save();
        res.json("Approved");
      }
      break;

    default:
      break;
  }
});
const unapprovedSeller = asyncHandler(async (req, res) => {
  const pageNumber = req.query.pageNumber || 1
  const pageSize = req.query.pageSize || 20
  const ecom = await VendorEcom.find({ registered: false });
  const company = await Companies.find({ registered: false });
  const maintenance = await MaintenanceManager.find({ registered: false });
  const property = await PropertyManager.find({ registered: false });
  const unapproved = ecom.concat(company, maintenance, property);
  const totalDocuments = unapproved.length || []
  const pageCount = Math.ceil(totalDocuments/pageSize)
  const startIndex = (pageNumber - 1) * pageSize;
  const paginatedResults = unapproved.slice(startIndex, startIndex + pageSize);
  res.json({unapproved: paginatedResults, pageCount});
});

const deleteSeller = asyncHandler(async (req, res) => {
  const { id, sellerType } = req.query;
  console.log('sellerType', sellerType, id)
  let seller;
  switch (sellerType) {
    case "ecom":
      seller = await VendorEcom.findById(id);
      if(seller) {
        await VendorEcom.findByIdAndDelete(id)
        return res.status(200).send({message: 'Deleted'})
      }
      break;
    case "company":
      seller = await Companies.findById(id);
      if (seller) {
        await Companies.findByIdAndDelete(id)
        return res.status(200).send({message: 'Deleted'})
      }
      break;
    case "maintenance":
      seller = await MaintenanceManager.findById(id);
      if (seller) {
        await MaintenanceManager.findByIdAndDelete(id)
        return res.status(200).send({message: 'Deleted'})
      }
      break;
    case "property":
      seller = await PropertyManager.findById(id);
      if (seller) {
        await PropertyManager.findByIdAndDelete(id)
        return res.status(200).send({message: 'Deleted'})
      }
      break;

    default:
      break;
  }

  return res.status(400).send({ message: 'Not a valid request to delete'})
})

module.exports = {
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
  deleteSeller
};
