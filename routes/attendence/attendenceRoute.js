const express = require("express");
const {
  attendenceCheckInCtrl,
  attendenceCheckOutCtrl,
} = require("../../controllers/attendence/attendenceCtrl");

const attendenceRoute = express.Router();
const authMiddleware = require("../../middlewares/auth/authMiddleware");

attendenceRoute.post("/", authMiddleware, attendenceCheckInCtrl);
attendenceRoute.put("/:id", authMiddleware, attendenceCheckOutCtrl);

module.exports = attendenceRoute;
