const express = require("express");
const {
  addholidayCtrl,
  fetchholidaysCtrl,
  fetchHolidayCtrl,
  updateHolidayCtrl,
  deleteHolidayCtrl,
} = require("../../controllers/holiday/holidayCtrl");
const authMiddleware = require("../../middlewares/auth/authMiddleware");

const holidayRoute = express.Router();

holidayRoute.post("/", addholidayCtrl);
holidayRoute.get("/", fetchholidaysCtrl);
holidayRoute.get("/:id", fetchHolidayCtrl);
holidayRoute.delete("/:id", deleteHolidayCtrl);
holidayRoute.put("/update/:id", updateHolidayCtrl);

module.exports = holidayRoute;
