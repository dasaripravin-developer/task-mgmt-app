import express from "express";
import { registerValidator, loginValidator } from "../middleware/userValidator.middleware.js";
import { register, login } from "../controllers/user.controller.js";

const userRouter = express.Router();

// Register
userRouter.post("/register", registerValidator, register);

// Login
userRouter.post("/login", loginValidator, login);

export { userRouter };
