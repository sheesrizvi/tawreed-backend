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
  // let payload = {
  //   notification: {
  //     title: title,
  //     body: body,
  //     icon: 'https://d1.awsstatic.com/awselemental/Images/link_front_v2.dbbc649d3acf98e837af3c3fc71105e54bc901f1.png'
  //   },
  //   apns: {
  //     payload: {
  //       aps: {
  //         'mutable-content': 1, // 1 or true
  //       },
  //     },
  //     fcm_options: {
  //       image: 'image-url',
  //     },
  //   },
  //   // apns: {
  //   //   payload: {
  //   //     aps: {
  //   //       'mutable-content': 1,
  //   //     },
  //   //   },
  //   //   fcm_options: {
  //   //     image: 'image-url',
  //   //   },
  //   // },
  // };

  // const options = {
  //   priority: "high",
  //   timeToLive: 60 * 60 * 24,
  // };

  // admin
  //   .messaging()
  //   .sendToDevice(registrationToken, payload, options)
  //   .then(function (response) {
  //     console.log(response)
  //     res.status(201).send(response);
  //   })
  //   .catch(function (error) {
  //     res.status(404);
  //     throw new Error(error);
  //   });

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
      users,
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

module.exports = router;
