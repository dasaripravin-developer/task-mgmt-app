import Joi from "joi";

export const createTask = Joi.object({
     title: Joi.string().required(),
     description: Joi.string().required(),
     status: Joi.string().optional(),
     dueDate: Joi.date().required(),
});

export const updateTask = Joi.object({
     title: Joi.string().optional(),
     description: Joi.string().optional(),
     status: Joi.string().optional(),
     dueDate: Joi.date().optional(),
});

/* 
 id: { type: Number, index: true, unique: true },
     title: { type: String, required: true },
     description: { type: String },
     status: { type: String, enum: ["Pending", "In Progress", "Completed"], default: "Pending" },
     dueDate: { type: Date },
     createdAt: { type: Number, default: new Date().getTime() },
     updatedAt: { type: Number, default: new Date().getTime() },
*/
