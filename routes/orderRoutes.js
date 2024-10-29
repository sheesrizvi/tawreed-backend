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
  getOrderById,
  deleteOrder
} = require("../controller/orderController");

const router = express.Router();

//products
router.route("/byseller").get(getOrderBySeller);
router.route("/").get(getOrders);
router.route("/myorders").get(getMyOrders);
router.route("/delete-order").post(deleteOrder);
router.route("/update").post(updateOrderDeliveryStatus);
router.route("/create-order").post(addOrderItems);
router.route("/getPendingOrders").get(getPendingOrders);
router.route("/getsalesdaterange").get(getSalesDateRange);
router.route("/online-failed").get(getFailedOnlineOrders);
router.route("/update-order-to-unpaid").post(updateOrderToUnPaid);
router.route("/update-order-to-paid-admin").post(updateOrderToPaidAdmin);
router.route("/:id").get(getOrderById)
module.exports = router;
