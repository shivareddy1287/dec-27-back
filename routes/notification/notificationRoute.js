const express = require("express");
const {
  addNotificationCtrl,
  fetchNotificationsCtrl,
  updateNotificationsCtrl,
} = require("../../controllers/notification/notificationCtrl");
const authMiddleware = require("../../middlewares/auth/authMiddleware");

const notificationRoute = express.Router();

notificationRoute.post("/", addNotificationCtrl);
notificationRoute.get("/", authMiddleware, fetchNotificationsCtrl);
notificationRoute.put("/", authMiddleware, updateNotificationsCtrl);

module.exports = notificationRoute;
