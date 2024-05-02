const { notification } = require("../lib/firebase.client");
const prisma = require("../database/client");

async function sendNotification() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const day = today.getDate();

  const todayMidnightUTC = new Date(Date.UTC(year, month, day, 0, 0, 0));

  const fourteenDaysAgo = new Date(Date.UTC(year, month, day - 14, 0, 0, 0));

  const deviceTokens = await prisma.user.findMany({
    where: {
      OR: [
        {
          date_last_pray: {
            lt: todayMidnightUTC,
            gte: fourteenDaysAgo,
          },
        },

        {
          date_last_pray: null,
          created_date: {
            gt: fourteenDaysAgo,
          },
        },
      ],
    },
    select: {
      device_token: true,
    },
  });

  const deviceTokenArray = [""];

  deviceTokens.map((object) => {
    if (object.device_token != null) {
      deviceTokenArray.push(object.device_token);
    }
  });

  const imageUrl =
    "https://firebasestorage.googleapis.com/v0/b/ipray-c9f90.appspot.com/o/imageNotification.png?alt=media&token=c55a8da6-1e88-4525-b750-640e0b13c833";

  const message = {
    notification: {
      title: "🚨ALERTA IPRAY🚨",
      body: "Você não registrou sua reza hoje, registre e suba no ranking.",
    },
    android: {
      notification: {
        title: "🚨ALERTA IPRAY🚨",
        body: "Você não registrou sua reza hoje, registre e suba no ranking.",
        imageUrl: imageUrl,
      },
    },
    apns: {
      payload: {
        aps: {
          alert: {
            title: "🚨ALERTA IPRAY🚨",
            body: "Você não registrou sua reza hoje, registre e suba no ranking.",
          },
          "mutable-content": 1,
        },
      },
      fcm_options: {
        image: imageUrl,
      },
    },
    webpush: {
      headers: {
        image: imageUrl,
      },
    },
    tokens: deviceTokenArray,
  };
  console.log(deviceTokens)

  notification
    .sendEachForMulticast(message)
    .then((response) => {
      console.log("Successfully sent message:", response);
    })
    .catch((error) => {
      console.log("Error sending message:", error);
    });
}

module.exports = sendNotification;
