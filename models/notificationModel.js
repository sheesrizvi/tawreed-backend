const mongoose = require("mongoose");

const notificationSchema = mongoose.Schema({
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  }],
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  image: {
    type: String,
  },
});

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
