const expressAsyncHandler = require("express-async-handler");
const Attendence = require("../../model/attendence/attendence");

const fetchattendencesCtrl = expressAsyncHandler(async (req, res) => {
  try {
    const attendence = await Attendence.find({}).populate("user");
    res.json(attendence);
  } catch (error) {
    res.json(error);
  }
});

const attendenceCheckInCtrl = expressAsyncHandler(async (req, res) => {
  console.log(req.body);
  const userId = req.user;
  console.log(userId);
  try {
    const attendence = await Attendence.create({ ...req.body, user: userId });
    console.log(attendence);
    res.json(attendence);
  } catch (error) {
    res.json(error);
  }
});

const attendenceCheckOutCtrl = expressAsyncHandler(async (req, res) => {
  console.log(req.body);
  const id = req.params.id;

  try {
    const attendence = await Attendence.findByIdAndUpdate(id, { ...req.body });
    res.json(attendence);
  } catch (error) {
    res.json(error);
  }
});

module.exports = {
  fetchattendencesCtrl,
  attendenceCheckInCtrl,
  attendenceCheckOutCtrl,
};
