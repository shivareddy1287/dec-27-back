const expressAsyncHandler = require("express-async-handler");
const validateMongodbID = require("../../../utils/validateMongodbID");

const {
  backNormalAdminAccessGivenFun,
} = require("../../../utils/restrictBack/restrictedAccessBack");

const PayrollMonth = require("../../../model/payroll/PayrollMonth/PayrollMonth");

// PayrollMonth
// PayrollMonth

//----------------------------------------------------------------
// Create PayrollMonth
//----------------------------------------------------------------

// const createPayrollMonthCtrl = expressAsyncHandler(async (req, res) => {
//   try {
//     const user = await PayrollMonth.create(req?.body);
//     res.json(user);
//   } catch (error) {
//     res.json(error);
//   }
// });

// 1111111111111111
// const createPayrollMonthCtrl = expressAsyncHandler(async (req, res) => {
//   try {
//     const newDataList = req.body;

//     // Array to store successfully inserted data
//     const insertedData = [];

//     for (const newData of newDataList) {
//       // Check if the data already exists in the database
//       const existingData = await PayrollMonth.find({
//         user: newData.user,
//         month: newData.month,
//         year: newData.year,
//       });
//       console.log(existingData, "existingData");

//       if (existingData.length === 0) {
//         // Data doesn't exist, so insert it into the database
//         const user = await PayrollMonth.create(newData);
//         insertedData.push(user);
//       } else {
//         // Data already exists, log a message or take appropriate action
//         console.log(
//           `Data already exists for ${newData.userId} - Month: ${newData.month}, Year: ${newData.year}`
//         );
//       }
//     }

//     if (insertedData.length === 0) {
//       res.send("Data already exists");
//     }

//     res.json(insertedData);
//   } catch (error) {
//     res.json(error);
//   }
// });

const createPayrollMonthCtrl = expressAsyncHandler(async (req, res) => {
  try {
    const newDataList = req.body;

    // Array to store successfully inserted data
    const insertedData = [];
    const alreadyGeneratedData = [];

    for (const newData of newDataList) {
      // Check if the data already exists in the database
      const existingData = await PayrollMonth.find({
        user: newData.user,
        month: newData.month,
        year: newData.year,
      });

      // console.log(existingData, "existingData");

      if (existingData.length === 0) {
        // Data doesn't exist, so insert it into the database
        const user = await PayrollMonth.create(newData);
        insertedData.push(user);
      } else {
        // Data already exists, log a message or take appropriate action
        alreadyGeneratedData.push(newData);
        console.log(
          `Data already exists for ${newData.userId} - Month: ${newData.month}, Year: ${newData.year}`
        );
      }
    }
    // console.log(alreadyGeneratedData, "alreadyGeneratedData");

    if (insertedData.length === 0) {
      res.status(400).json({
        message: "Payroll of this Month is already generated",
        alreadyGeneratedData: alreadyGeneratedData,
      });
    } else {
      res.json(insertedData);
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

// [{userId:1,user:"shiva",month:1,year:2024},{userId:1,user:"shiva",month:2,year:2024},{userId:1,user:"shiva",month:2,year:2023}]

// [{userId:1,user:"shiva",month:2,year:2024},{userId:1,user:"shiva",month:3,year:2024}]

//----------------------------------------------------------------
// Fetch All Payrolls
//----------------------------------------------------------------

const fetchAllPayrollsMonthCtrl = expressAsyncHandler(async (req, res) => {
  const isAdmin = backNormalAdminAccessGivenFun(req?.user?.Access);
  const query = req?.query?.id
    ? { user: req?.query?.id }
    : isAdmin
    ? {}
    : { user: req?.user?.id };

  try {
    const payroll = await PayrollMonth.find(query).populate("user");
    res.json(payroll);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//----------------------------------------------------------------
// fetch Single Payroll month
//----------------------------------------------------------------

const fetchSinglePayrollMonth = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbID(id);

  try {
    const payroll = await PayrollMonth.findById(id).populate("user");

    res.json(payroll);
  } catch (error) {
    console.log(error);
  }
});

module.exports = {
  createPayrollMonthCtrl,
  fetchAllPayrollsMonthCtrl,
  fetchSinglePayrollMonth,
};
