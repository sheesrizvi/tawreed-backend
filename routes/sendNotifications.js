var admin = require("firebase-admin");
const express = require("express");
const router = express.Router();

// var serviceAccount = require("../groceryapp-firebase.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

router.post("/send-notification", async (req, res) => {
  const { token, title, body } = req.body;

  const registrationToken = token;
  let payload = {
    notification: {
      title: title,
      body: body,
    },
  };

  const options = {
    priority: "high",
    timeToLive: 60 * 60 * 24,
  };

  admin
    .messaging()
    .sendToDevice(registrationToken, payload, options)
    .then(function (response) {
      res.status(201).send(response);
    })
    .catch(function (error) {
      res.status(404);
      throw new Error(error);
    });
});

module.exports = router;
