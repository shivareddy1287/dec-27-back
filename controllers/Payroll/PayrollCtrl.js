const generateToken = require("../../config/token/generateToken");

const expressAsyncHandler = require("express-async-handler");
const validateMongodbID = require("../../utils/validateMongodbID");

const sendEmailWithUser = require("../../utils/sendEmailWithUser");
const {
  backNormalAdminAccessGivenFun,
} = require("../../utils/restrictBack/restrictedAccessBack");
const Payroll = require("../../model/payroll/Payroll");

//----------------------------------------------------------------
// create Payroll
//----------------------------------------------------------------

const createPayrollCtrl = expressAsyncHandler(async (req, res) => {
  console.log(req?.body, "created");

  try {
    const user = await Payroll.create({
      ...req?.body,
    });
    res.json(user);
  } catch (error) {
    res.json(error);
  }
});

//----------------------------------------------------------------
// Fetch Payrolls
//----------------------------------------------------------------

const fetchPayrollsCtrl = expressAsyncHandler(async (req, res) => {
  const isAdmin = backNormalAdminAccessGivenFun(req?.user?.Access);
  const query = req?.query?.id
    ? { user: req?.query?.id }
    : isAdmin
    ? {}
    : { user: req?.user?.id };

  try {
    const payroll = await Payroll.find(query)
      .populate("user")
      .populate("addedBy")
      .populate("ModifiedBy");
    res.json(payroll);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//----------------------------------------------------------------
// Fetch Payrolls
//----------------------------------------------------------------

const fetchAllActivePayrollsCtrl = expressAsyncHandler(async (req, res) => {
  const isAdmin = backNormalAdminAccessGivenFun(req?.user?.Access);
  const query = req?.query?.id
    ? { user: req?.query?.id }
    : isAdmin
    ? { statusPayroll: "Active" }
    : { user: req?.user?.id };

  // const query = req?.query?.id
  // ? { user: req?.query?.id, status: "Active" }
  // : isAdmin
  // ? { status: "Active" }
  // : { user: req?.user?.id, statusPayroll: "Active" };

  try {
    const payroll = await Payroll.find(query)
      .populate("user")
      .populate("addedBy")
      .populate("ModifiedBy");
    res.json(payroll);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//----------------------------------------------------------------
// user details
//----------------------------------------------------------------

const fetchSinglePayroll = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbID(id);

  try {
    const payroll = await Payroll.findById(id)
      .populate("user")
      .populate("addedBy")
      .populate("ModifiedBy");

    res.json(payroll);
  } catch (error) {
    console.log(error);
  }
});

//----------------------------------------------------------------
// Update Payroll
//----------------------------------------------------------------

const updatePayrollCtrl = expressAsyncHandler(async (req, res) => {
  console.log(req?.params?.id, "params");
  // const { _id } = req?.user;
  console.log(req?.body, "req?.body");

  // validateMongodbID(_id);
  try {
    const user = await Payroll.findByIdAndUpdate(
      req?.params?.id,
      {
        ...req?.body,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    res.json(user);
  } catch (error) {
    res.json(error);
  }
});

//----------------------------------------------------------------
// delete the user
//----------------------------------------------------------------

const deletePayrollCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req?.params;
  console.log(id, "delete asset");
  try {
    const deletedUser = await Payroll.findByIdAndDelete(id);
    res.json(deletedUser);
  } catch (error) {
    console.log(error);
    res.json(error);
  }
});

module.exports = {
  createPayrollCtrl,
  fetchPayrollsCtrl,
  fetchSinglePayroll,
  updatePayrollCtrl,
  deletePayrollCtrl,
  fetchAllActivePayrollsCtrl,
};
