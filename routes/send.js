var admin = require("firebase-admin");
const express = require("express");
const router = express.Router();

var serviceAccount = require("../tawreed-a7e95-firebase-adminsdk-8fgw4-6b612ed9bb.json");
const User = require("../models/userModel");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

router.post("/send-notification", async (req, res) => {
  const { token, title, body, image } = req.body;

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

  admin
    .messaging()
    .send(message)
    .then((response) => {
      // Response is a message ID string.
      console.log("Successfully sent message:", response);
      res.json(response);
    })
    .catch((error) => {
      console.log("Error sending message:", error);
    });
});
router.post("/send-notification-all", async (req, res) => {
  const { title, body, image } = req.body;
  const tokens = User.find({}).select("pushToken");
  const registrationToken = tokens;
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
    tokens: registrationToken,
  };

  admin
    .messaging()
    .send(message)
    .then((response) => {
      // Response is a message ID string.
      console.log("Successfully sent message:", response);
      res.json(response);
    })
    .catch((error) => {
      console.log("Error sending message:", error);
    });
});

module.exports = router;
