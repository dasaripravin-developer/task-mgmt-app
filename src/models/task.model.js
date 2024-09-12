import mongoose from "mongoose";
import { getNextSequenceValue } from "../models/counter.model.js";

const taskSchema = new mongoose.Schema({
   taskId: { type: Number, index: true, unique: true },
   title: { type: String, required: true },
   description: { type: String },
   status: { type: String, enum: ["Pending", "In Progress", "Completed"], default: "Pending" },
   dueDate: { type: Date },
   userId: { type: Number, required: true, ref: "User" },
   createdAt: { type: Number, default: new Date().getTime() },
   updatedAt: { type: Number, default: new Date().getTime() },
});

taskSchema.pre("save", async function (next) {
   if (this.isNew) {
      this.taskId = await getNextSequenceValue("taskId");
   }
   this.updatedAt = new Date().getTime();
   next();
});

const TaskSchema = mongoose.model("Task", taskSchema);
export { TaskSchema };
