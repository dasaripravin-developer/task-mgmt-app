import mongoose from "mongoose";

let count = 1;
const taskSchema = new mongoose.Schema({
     id: { type: Number, index: true, unique: true },
     title: { type: String, required: true },
     description: { type: String },
     status: { type: String, enum: ["Pending", "In Progress", "Completed"], default: "Pending" },
     dueDate: { type: Date },
     userId: { type: Number, required: true, ref: "User" },
     createdAt: { type: Number, default: new Date().getTime() },
     updatedAt: { type: Number, default: new Date().getTime() },
});

taskSchema.pre("save", function (next) {
     if (this.isNew) {
          console.log("this is new one");
          this.id = count++;
     }
     this.updatedAt = new Date().getTime();
     next();
});

const TaskSchema = mongoose.model("Task", taskSchema);
export { TaskSchema };
