const express = require("express");

const authMiddleware = require("../../middlewares/auth/authMiddleware");
const {
  createTasksGivenCtrl,
  fetchTasksGivensCtrl,
  fetchSingleTasksGiven,
  updateTasksGivenCtrl,
  deleteTasksGivenCtrl,
} = require("../../controllers/TasksGivenCtrl/TasksGivenCtrl");

const TasksGivenRoutes = express.Router();
TasksGivenRoutes.post("/create", createTasksGivenCtrl);
TasksGivenRoutes.get("/fetch", fetchTasksGivensCtrl);
TasksGivenRoutes.get("/fetch/:id", authMiddleware, fetchSingleTasksGiven);
TasksGivenRoutes.put("/update/:id", authMiddleware, updateTasksGivenCtrl);
TasksGivenRoutes.delete("/fetch/:id", authMiddleware, deleteTasksGivenCtrl);
module.exports = TasksGivenRoutes;
