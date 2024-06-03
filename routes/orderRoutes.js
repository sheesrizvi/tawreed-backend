const express = require("express");
const {
  updateOrderDeliveryStatus,
  addOrderItems,
  getMyOrders,
  getPendingOrders,
  getSalesDateRange,
  updateOrderToUnPaid,
  getFailedOnlineOrders,
  updateOrderToPaidAdmin,
  getOrders,
  getOrderBySeller,
} = require("../controller/orderController");

const router = express.Router();

//products
router.route("/").get(getOrders);
router.route("/myorders").get(getMyOrders);
router.route("/byseller").get(getOrderBySeller);
router.route("/update").post(updateOrderDeliveryStatus);
router.route("/create-order").post(addOrderItems);
router.route("/getPendingOrders").get(getPendingOrders);
router.route("/getsalesdaterange").get(getSalesDateRange);
router.route("/online-failed").get(getFailedOnlineOrders);
router.route("/update-order-to-unpaid").post(updateOrderToUnPaid);
router.route("/update-order-to-paid-admin").post(updateOrderToPaidAdmin);

module.exports = router;
