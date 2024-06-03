const asyncHandler = require("express-async-handler");

const User = require("../models/userModel");
const pdf = require("html-pdf");

const nodemailer = require("nodemailer");
const emailTemplate = require("../document/email");
const { startOfDay, endOfDay, parseISO } = require("date-fns");
const EcomProduct = require("../models/ecom/ecomProductModel");
const Order = require("../models/ecom/orderModel");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const sendEmail = asyncHandler(
  async (orderItems, paymentMethod, totalPrice, user) => {
    const items = orderItems;
    var options = { format: "A4" };

    await pdf
      .create(orderpdf({ items, user, paymentMethod, totalPrice }), options)
      .toFile(`${__dirname}/orderinvoice.pdf`, (err, res) => {
        transporter.sendMail({
          from: ` Tawree <sales@tawreed.com>`, // sender address
          to: `${user.email}`, // list of receivers
          replyTo: `<sales@tawreed.com>`,
          subject: `Order Confirm ${user?.name}`, // Subject line
          text: `Order from Tawreed`, // plain text body
          html: emailTemplate(orderItems, paymentMethod, totalPrice), // html body
          attachments: [
            {
              filename: "orderinvoice.pdf",
              path: `${__dirname}/orderinvoice.pdf`,
            },
          ],
        });
      });
  }
);

const addOrderItems = asyncHandler(async (req, res) => {
  const user = await User.findById(req.body.userId);
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    totalPrice,
    paymentResult,
    deliveryStatus,
    userId,
    seller,
    notes,
  } = req.body;

  if (paymentMethod == "COD") {
    const order = await Order.create({
      orderItems,
      user: userId,
      seller,
      shippingAddress,
      paymentResult,
      paymentMethod,
      itemsPrice,
      deliveryStatus,
      isPaid: false,
      shippingPrice,
      totalPrice,
      notes,
    });
    if (order) {
      for (let i = 0; i < orderItems.length; i++) {
        const product = await EcomProduct.findById(orderItems[i].ecomproduct);

        if (product) {
          product.countInStock = product.countInStock - orderItems[i].qty;
          await product.save();
        }
      }
      // reward algo
      // const reward = await UserReward.findOne({ user: userId });

      // const a = reward.amount + itemsPrice * 0.1;
      // reward.amount = a;
      // await reward.save();

      //   sendEmail(orderItems, paymentMethod, totalPrice, user);
      res.status(201).json(order);
    }
  } else {
    const order = await Order.create({
      orderItems,
      user: userId,
      seller,
      shippingAddress,
      paymentResult,
      paymentMethod,
      itemsPrice,
      deliveryStatus,
      shippingPrice,
      totalPrice,
      notes,
    });
    if (order) {
      // count in stock algo

      for (let i = 0; i < orderItems.length; i++) {
        const product = await EcomProduct.findById(orderItems[i].ecomproduct);
        if (product) {
          product.countInStock = product.countInStock - orderItems[i].qty;
          await product.save();
        }
      }
      // reward algo
      // // const reward = await UserReward.findOne({ user: userId });

      // reward.amount = reward.amount + itemsPrice * 0.1;

      // await reward.save();

      res.status(201).json(order);
    }
  }
});

const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.body.id);
  const user = await User.findById(order.user);
  const orderItems = order.orderItems;
  const paymentMethod = order.paymentMethod;
  //change
  const totalPrice = order.totalPrice;

  if (order) {
    sendEmail(orderItems, paymentMethod, totalPrice, user);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

const getMyOrders = asyncHandler(async (req, res) => {
  const pageSize = 30;
  const page = Number(req.query.pageNumber) || 1;
  const orders = await Order.find({ user: req.query.userId })
    .sort({ createdAt: -1 })
    .limit(pageSize)
    .skip(pageSize * (page - 1));
  res.json(orders);
});
const getOrderBySeller = asyncHandler(async (req, res) => {
  const pageSize = 30;
  const page = Number(req.query.pageNumber) || 1;
  const count = await Order.countDocuments({ seller: req.query.sellerId })
  var pageCount = Math.floor(count / 30);
  if (count % 30 !== 0) {
    pageCount = pageCount + 1;
  }
 
    
  const orders = await Order.find({seller: req.query.sellerId})
    .sort({ createdAt: -1 })
    .limit(pageSize)
    .skip(pageSize * (page - 1))

  res.json({orders, pageCount});
});
const getPendingOrders = asyncHandler(async (req, res) => {
  const count = await Order.countDocuments({
    deliveryStatus: { $ne: "Delivered" },
  });
  const count2 = await Order.countDocuments({
    deliveryStatus: "Cancelled",
  });
  const total = count - count2;

  res.json(total);
});
const updateOrderToUnPaid = asyncHandler(async (req, res) => {
  const a = req.body.invoiceId;
  const order = await Order.findById(req.body.id);

  if (order) {
    order.isPaid = false;
    order.invoiceId = a;

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});
const getSalesDateRange = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;
  const s1 = parseISO(startDate);
  const s2 = parseISO(endDate);
  const pageSize = 30;
  const page = Number(req.query.pageNumber) || 1;
  const count = await Order.countDocuments({ isPaid: true });
  var pageCount = Math.floor(count / 30);
  if (count % 30 !== 0) {
    pageCount = pageCount + 1;
  }

  const monthlySales = await Order.find({
    $and: [
      {
        createdAt: {
          $gte: startOfDay(s1),
          $lte: endOfDay(s2),
        },
      },
      { isPaid: true },
      { deliveryStatus: "Delivered" },
    ],
  })
    .sort({ createdAt: -1 })
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .populate("user", "id name")
    .populate("orderItems.product");

  res.json({
    monthlySales,
    pageCount,
  });
});

const updateOrderDeliveryStatus = asyncHandler(async (req, res) => {
  const { orderId, deliveryStatus } = req.body;

  const order = await Order.findOneAndUpdate(
    { _id: orderId },
    { deliveryStatus: deliveryStatus }
  );

  if (deliveryStatus == "Cancelled") {
    order.isPaid = false;
    for (let i = 0; i < order.orderItems.length; i++) {
      const product = await EcomProduct.findById(
        order.orderItems[i].ecomproduct
      );
      if (product) {
        product.countInStock = product.countInStock + order.orderItems[i].qty;
        await product.save();
      }
    }
  }

  if (order) {
    order.deliveryStatus == "Delivered";
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

const getOrders = asyncHandler(async (req, res) => {
  const pageSize = 30;
  const page = Number(req.query.pageNumber) || 1;
  const count = await Order.countDocuments({ isPaid: true });
  var pageCount = Math.floor(count / 30);
  if (count % 30 !== 0) {
    pageCount = pageCount + 1;
  }
  const orders = await Order.find({ isPaid: true })
    .sort({ createdAt: -1 })
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .populate("user", "id name");
  res.json({ orders, pageCount });
});
const getFailedOnlineOrders = asyncHandler(async (req, res) => {
  const pageSize = 30;
  const page = Number(req.query.pageNumber) || 1;
  const count = await Order.countDocuments({ isPaid: false });
  var pageCount = Math.floor(count / 30);
  if (count % 30 !== 0) {
    pageCount = pageCount + 1;
  }
  const orders = await Order.find({ isPaid: false })
    .sort({ createdAt: -1 })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ orders, pageCount });
});
const updateOrderToPaidAdmin = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.body.id);

  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

module.exports = {
  updateOrderToPaidAdmin,
  getFailedOnlineOrders,
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderDeliveryStatus,
  getMyOrders,
  getOrders,
  getPendingOrders,
  getSalesDateRange,
  updateOrderToUnPaid,
  getOrderBySeller
};
