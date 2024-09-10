import express from "express";
import { createTaskValidator, updateTaskValidator } from "../middleware/taskValidator.middleware.js";
import { insertTask, getTaskById, updateTaskById, deleteTaskById } from "../controllers/task.controller.js";

const taskRouter = express.Router();

taskRouter.post("/", createTaskValidator, insertTask);

taskRouter.get("/:id", getTaskById);

taskRouter.put("/:id", updateTaskValidator, updateTaskById);

taskRouter.delete("/:id", deleteTaskById);

export { taskRouter };
