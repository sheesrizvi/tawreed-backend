var admin = require("firebase-admin");
const express = require("express");
const router = express.Router();

var serviceAccount = require("../tawreed-a7e95-firebase-adminsdk-8fgw4-6b612ed9bb.json");
const User = require("../models/userModel");
const Notification = require("../models/notificationModel");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

router.post("/send-notification", async (req, res) => {
  const { token, title, body, image, id } = req.body;

  let user = [];
  user.push(id);

  const registrationToken = token;


  const message = {
    notification: {
      title: title,
      body: body,
    },
    android: {
      notification: {
        imageUrl: image,
      },
    },
    apns: {
      payload: {
        aps: {
          "mutable-content": 1,
        },
      },
      fcm_options: {
        image: image,
      },
    },
    token: registrationToken,
  };

  const createNoti = async () => {
    const notification = await Notification.create({
      title,
      description: body,
      users: user,
      image
    });
    if (notification) {
      console.log("success");
    } else {
      res.status(404);
      throw new Error("Error");
    }
  };
  admin
    .messaging()
    .send(message)
    .then((response) => {
      // Response is a message ID string.

      createNoti().then(() => {
        console.log("Successfully sent message:", response);
        res.json("success");
      });
    })
    .catch((error) => {
      console.log("Error sending message:", error);
    });
});

router.post("/send-notification-all", async (req, res) => {
  const { title, body, image } = req.body;
  const tokens = await User.find({ pushToken: { $exists: true } }).select(
    "pushToken -_id"
  );
  const user = await User.find({ pushToken: { $exists: true } }).select("_id");
  const registrationToken = tokens.map((item) => item.pushToken);
  const users = user.map((item) => item._id);

  const createNoti = async () => {
    const notification = await Notification.create({
      title,
      description: body,
      users, image
    });
    if (notification) {
      console.log("success");
    } else {
      res.status(404);
      throw new Error("Error");
    }
  };

  const message = {
    notification: {
      title: title,
      body: body,
    },
    android: {
      notification: {
        imageUrl: image,
      },
    },
    apns: {
      payload: {
        aps: {
          "mutable-content": 1,
        },
      },
      fcm_options: {
        image: image,
      },
    },
    tokens: registrationToken,
  };

  admin
    .messaging()
    .sendMulticast(message)
    .then((response) => {
      // Response is a message ID string.
      createNoti().then(() => {
        console.log("Successfully sent message:", response);
        res.json("success");
      });
    })
    .catch((error) => {
      console.log("Error sending message:", error);
    });
});

router.get("/get-all", async (req, res) => {
  const notifications = await Notification.find({});
  if (notifications) {
    res.status(201).json(notifications);
  } else {
    res.status(404);
    throw new Error("Error");
  }
});

router.get("/get-byuser", async (req, res) => {
  const notifications = await Notification.find({
    users: { $in: [req.query.userId] },
  });
  if (notifications) {
    res.status(201).json(notifications);
  } else {
    res.status(404);
    throw new Error("Error");
  }
});

router.delete("/delete-byuser", async (req, res) => {
  const { id, user } = req.query;

  const notifications = await Notification.updateOne({ _id: id }, { $pull: { users: user } });

  res.json('success')
});

module.exports = router;
