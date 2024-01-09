const express = require("express");
const {
  fetchattendencesCtrl,
  attendenceCheckInCtrl,
  attendenceCheckOutCtrl,
} = require("../../controllers/attendence/attendenceCtrl");

const attendenceRoute = express.Router();
const authMiddleware = require("../../middlewares/auth/authMiddleware");

attendenceRoute.post("/", authMiddleware, attendenceCheckInCtrl);
attendenceRoute.put("/:id", authMiddleware, attendenceCheckOutCtrl);
attendenceRoute.get("/", fetchattendencesCtrl);

module.exports = attendenceRoute;
