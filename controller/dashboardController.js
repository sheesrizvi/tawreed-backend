const asyncHandler = require("express-async-handler");
const Companies = require("../models/directory/companiesModel");
const PropertyManager = require("../models/property/propertyManagerModel");
const VendorEcom = require("../models/ecom/vendorEcomModel");
const MaintenanceManager = require("../models/maintenance/maintenanceManager");
const User = require("../models/userModel");
const Properties = require("../models/property/propertiesModel");
const EcomProduct = require("../models/ecom/ecomProductModel");
const Order = require("../models/ecom/orderModel");
const mongoose = require("mongoose")

const adminDashboard = asyncHandler(async (req, res) => {
    const companiesCount = await Companies.countDocuments({})
    const ecommerceVendorCount = await VendorEcom.countDocuments({})
    const maintenanceVendorCount = await MaintenanceManager.countDocuments({})
    const propertyVendorCount = await PropertyManager.countDocuments({})

    const ecom = await VendorEcom.countDocuments({ registered: false });
    const company = await Companies.countDocuments({ registered: false });
    const maintenance = await MaintenanceManager.countDocuments({ registered: false });
    const property = await PropertyManager.countDocuments({ registered: false });
    const unapproved = ecom + company + maintenance + property
    const users = await User.countDocuments({})
    const properties = await Properties.countDocuments({})

    let totalSales = await Order.aggregate([
        { $unwind: "$orderItems" },  
        {
          $group: {
            _id: null,
            totalSales: { $sum: "$orderItems.finalprice" },
          },
        },
      ]);
  
    totalSales = totalSales[0]?.totalSales || 0;

    res.status(200).json({
        companiesCount,
        ecommerceVendorCount,
        maintenanceVendorCount,
        propertyVendorCount,
        unapproved,
        users,
        properties,
        totalSales
    })
})

const ecomDashboard = asyncHandler(async (req, res) => {
   const { sellerId } = req.query
    const productCountBySeller = await EcomProduct.countDocuments({seller: sellerId })
    const currentYear = new Date().getFullYear();
    const totalSalesBySeller = await Order.aggregate([
        { $unwind: "$orderItems" },
        { $match: { "orderItems.seller": new mongoose.Types.ObjectId(sellerId) } },
        {
          $group: {
            _id: null,
            totalSales: { $sum: "$orderItems.finalprice" },
          },
        },
      ]);

      const monthlySalesBySeller = await Order.aggregate([
        { $unwind: "$orderItems" },
        { $match: { "orderItems.seller": new mongoose.Types.ObjectId(sellerId) } },
        {
          $project: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
            finalprice: "$orderItems.finalprice",
          },
        },
        { $match: { year: currentYear } },
        {
          $group: {
            _id: "$month",
            monthlySales: { $sum: "$finalprice" },
          },
        },
        { $sort: { _id: 1 } }, 
      ]);

      res.status(200).send({
        productCountBySeller,
        totalSales: totalSalesBySeller[0]?.totalSales || 0,
        monthlySales: monthlySalesBySeller,
      });

   
})

module.exports = {
    adminDashboard,
    ecomDashboard
}