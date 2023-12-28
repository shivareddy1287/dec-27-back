const generateToken = require("../../config/token/generateToken");

const expressAsyncHandler = require("express-async-handler");
const validateMongodbID = require("../../utils/validateMongodbID");

const ExitDetails = require("../../model/exitDetails/ExitDetails");
const {
  backNormalAdminAccessGivenFun,
} = require("../../utils/restrictBack/restrictedAccessBack");

//----------------------------------------------------------------
// create ExitDetails
//----------------------------------------------------------------

// const createExitDetailsCtrl = expressAsyncHandler(async (req, res) => {
//   // Business Logic
//   console.log(req?.body, "created");
//   try {
//     const user = await ExitDetails.create({
//       ...req?.body,
//     });
//     res.json(user);
//   } catch (error) {
//     res.json(error);
//   }
// });

const createExitDetailsCtrl = expressAsyncHandler(async (req, res) => {
  try {
    const selfUserApply = req?.body?.user === req?.user?.id;
    const isAdmin = backNormalAdminAccessGivenFun(req?.user?.Access);
    if (!selfUserApply && isAdmin) {
      const exitDetails = await ExitDetails.create({
        ...req.body,
      });

      res.json(exitDetails);
    }

    if (selfUserApply) {
      const latestExitDetails = await ExitDetails.findOne({
        user: req.body.user, // Assuming there's a 'user' field in your ExitDetails model
      }).sort({ createdAt: -1 });

      if (latestExitDetails) {
        // Check if the user has created an exit details record within the last two minutes
        const twoMinutesAgo = new Date();
        twoMinutesAgo.setMinutes(twoMinutesAgo.getMinutes() - 2);

        if (latestExitDetails.createdAt > twoMinutesAgo) {
          // User has already created an exit details record within the last two minutes
          return res.status(400).json({
            message:
              "You can only create an exit details record once every two minutes.",
          });
        }
      }

      // If the user hasn't created an exit details record in the last two minutes, proceed to create a new one
      const exitDetails = await ExitDetails.create({
        ...req.body,
      });
      res.json(exitDetails);
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
});

//----------------------------------------------------------------
// Fetch ExitDetailss
//----------------------------------------------------------------

const fetchExitDetailssCtrl = expressAsyncHandler(async (req, res) => {
  const isAdmin = backNormalAdminAccessGivenFun(req?.user?.Access);
  const query = req?.query?.id
    ? { user: req?.query?.id }
    : isAdmin
    ? {}
    : { user: req?.user?.id };
  try {
    const ExitDetailss = await ExitDetails.find(query)
      .populate("user")
      .populate("addedBy")
      .populate("ModifiedBy")
      .populate("Interviewer");
    res.json(ExitDetailss);
  } catch (error) {
    console.log(error);
  }
});

//----------------------------------------------------------------
// user details
//----------------------------------------------------------------

const fetchSingleExitDetails = expressAsyncHandler(async (req, res) => {
  // console.log(req.headers);
  const { id } = req.params;
  validateMongodbID(id);

  try {
    const user = await ExitDetails.findById(id)
      .populate("user")
      .populate("addedBy")
      .populate("ModifiedBy")
      .populate("Interviewer");

    res.json(user);
  } catch (error) {
    console.log(error);
  }
});

//----------------------------------------------------------------
// Update ExitDetails
//----------------------------------------------------------------

const updateExitDetailsCtrl = expressAsyncHandler(async (req, res) => {
  console.log(req?.params?.id, "params");
  // const { _id } = req?.user;
  console.log(req?.body, "req?.body");

  // validateMongodbID(_id);
  try {
    const user = await ExitDetails.findByIdAndUpdate(
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
// Withdraw ExitDetails
//----------------------------------------------------------------
const withdrawExitDetailsCtrl = expressAsyncHandler(async (req, res) => {
  try {
    // Check if separationStatus is already set to "withdraw"
    const existingExitDetails = await ExitDetails.findById(req.params.id);

    if (
      existingExitDetails &&
      existingExitDetails.separationStatus === "Withdraw"
    ) {
      return res
        .status(400)
        .json({ message: "Separation already in 'withdraw' status" });
    }

    if (
      existingExitDetails &&
      existingExitDetails.separationStatus === "Approved"
    ) {
      return res
        .status(400)
        .json({ message: "Separation already in 'Approved' status" });
    }

    // Update separationStatus
    const updatedExitDetails = await ExitDetails.findByIdAndUpdate(
      req.params.id,
      {
        separationStatus: "Withdraw",
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedExitDetails) {
      // Handle case where the document with the given id was not found
      return res.status(404).json({ message: "Exit details not found" });
    }

    res.json({ message: "Separation Successfully withdrew" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

//----------------------------------------------------------------
// Approve ExitDetails
//----------------------------------------------------------------
const approveExitDetailsCtrl = expressAsyncHandler(async (req, res) => {
  try {
    // Check if separationStatus is already set to "withdraw"
    const existingExitDetails = await ExitDetails.findById(req.params.id);

    if (
      existingExitDetails &&
      existingExitDetails.separationStatus === "Withdraw"
    ) {
      return res
        .status(400)
        .json({ message: "Separation already in 'Withdraw' status" });
    }

    if (
      existingExitDetails &&
      existingExitDetails.separationStatus === "Approved"
    ) {
      return res
        .status(400)
        .json({ message: "Separation already in 'Approved' status" });
    }

    // Update separationStatus
    const updatedExitDetails = await ExitDetails.findByIdAndUpdate(
      req.params.id,
      {
        separationStatus: "Approved",
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedExitDetails) {
      // Handle case where the document with the given id was not found
      return res.status(404).json({ message: "Exit details not found" });
    }

    res.json({ message: "Separation Successfully Approved" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

//----------------------------------------------------------------
// delete the user
//----------------------------------------------------------------

const deleteExitDetailsCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req?.params;
  console.log(id);
  // if (!id) throw new Error("Please provide user ID");

  // check isf user id is valid
  validateMongodbID(id);
  try {
    const deletedUser = await ExitDetails.findByIdAndDelete(id);
    res.json(deletedUser);
  } catch (error) {
    console.log(error);
    res.json(error);
  }
});

module.exports = {
  createExitDetailsCtrl,
  fetchExitDetailssCtrl,
  fetchSingleExitDetails,
  updateExitDetailsCtrl,
  deleteExitDetailsCtrl,
  withdrawExitDetailsCtrl,
  approveExitDetailsCtrl,
};

// const createExitDetailsCtrl = expressAsyncHandler(async (req, res) => {
//   // Business Logic
//   // console.log(req?.body, "created");

//   //   try {
//   //   const user = await ExitDetails.create({
//   //     ...req?.body,
//   //   });
//   //   res.json(user);
//   // } catch (error) {
//   //   res.json(error);
//   // }
//   const isAdmin = backNormalAdminAccessGivenFun(req?.user?.Access);

//   try {
//     const selfUserApply = req.body.user === req?.user?._id;
//     if (selfUserApply) {
//       const latestExitDetails = await ExitDetails.findOne({
//         user: req.body.user, // Assuming there's a 'user' field in your ExitDetails model
//       }).sort({ createdAt: -1 });

//       if (latestExitDetails) {
//         // Check if the user has created an exit details record within the last two minutes
//         const twoMinutesAgo = new Date();
//         twoMinutesAgo.setMinutes(twoMinutesAgo.getMinutes() - 1);

//         if (latestExitDetails.createdAt > twoMinutesAgo) {
//           // User has already created an exit details record within the last two minutes
//           return res.status(400).json({
//             message:
//               "You can only create an exit details record once every two minutes.",
//           });
//         }
//       }
//       const exitDetails = await ExitDetails.create({
//         ...req.body,
//       });
//       res.json(exitDetails);
//     }

//     // if (isAdmin) {
//     //   // If the user hasn't created an exit details record in the last two minutes, proceed to create a new one
//     //   const exitDetails = await ExitDetails.create({
//     //     ...req.body,
//     //   });
//     //   res.json(exitDetails);
//     // }
//   } catch (error) {
//     res.status(500).json({ message: "Internal Server Error", error });
//   }
// });
