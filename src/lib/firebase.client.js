const admin = require("firebase-admin");
const serviceAccount = require("./credentials.json");

const serviceAccountTyped = serviceAccount;

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccountTyped),
  });
}

const notification = admin.messaging();

module.exports = { notification };
