const mongoose = require("mongoose");

const PayrollSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    accountInfo: {
      pfAccountNumber: Number,
      bankAccountNumber: Number,
      UAN: Number,
      ESINumber: Number,
    },
    annualCtc: Number,
    earnings: {
      basic: Number,
      houseRentAllowance: Number,
      conveyanceAllowance: Number,
      fixedAllowance: Number,
      bonus: Number,
    },
    reimbursements: {
      telephoneReimbursement: Number,
      fuelReimbursement: Number,
    },
    deductions: {
      EmployeeProvidentFund: Number,
      HealthInsurance: Number,
      IncomeTax: Number,
    },
    statusPayroll: { type: String, default: "Inactive" },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    addedTime: Date,
    ModifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    modifiedTime: Date,
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
    timestamps: true,
  }
);

// Compile Schema into model

const Payroll = mongoose.model("Payroll", PayrollSchema);

module.exports = Payroll;
