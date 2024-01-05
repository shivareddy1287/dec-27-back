const express = require("express");

const authMiddleware = require("../../../middlewares/auth/authMiddleware");

const {
  createPayrollMonthCtrl,
  fetchAllPayrollsMonthCtrl,
  fetchSinglePayrollMonth,
} = require("../../../controllers/Payroll/PayrollMonth/PayrollMonthCtrl");

const payrollMonthRoutes = express.Router();

// PayrollMonth

payrollMonthRoutes.post("/create", authMiddleware, createPayrollMonthCtrl);
payrollMonthRoutes.get("/fetch", authMiddleware, fetchAllPayrollsMonthCtrl);
payrollMonthRoutes.get("/fetch/:id", authMiddleware, fetchSinglePayrollMonth);

module.exports = payrollMonthRoutes;
