const express = require("express");

const authMiddleware = require("../../middlewares/auth/authMiddleware");
const {
  createPayrollCtrl,
  fetchPayrollsCtrl,
  fetchSinglePayroll,
  updatePayrollCtrl,
  deletePayrollCtrl,
} = require("../../controllers/Payroll/PayrollCtrl");

const payrollRoutes = express.Router();
payrollRoutes.post("/create", authMiddleware, createPayrollCtrl);
payrollRoutes.get("/fetch", authMiddleware, fetchPayrollsCtrl);
payrollRoutes.get("/fetch/:id", authMiddleware, fetchSinglePayroll);
payrollRoutes.put("/update/:id", authMiddleware, updatePayrollCtrl);
payrollRoutes.delete("/fetch/:id", authMiddleware, deletePayrollCtrl);
module.exports = payrollRoutes;
