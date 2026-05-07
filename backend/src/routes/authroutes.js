import express from "express";

import {getme, login, registeruser,verifyemail, forgotPassword,resetPassword} from "../controlleres/authcontrollers.js";

import {authorize, protect } from "../middlewares/authmiddlewares.js";

const authRouter = express.Router();

// Register User
authRouter.post("/registeruser", registeruser);

// Login User
authRouter.post("/login", login);

// Verify Email
authRouter.post("/verify-email", verifyemail);

// Forgot Password
authRouter.post("/forgot-password", forgotPassword);

// Reset Password
authRouter.post("/reset-password/:token", resetPassword);

// Get Logged In User
authRouter.get("/me", protect, getme);


export default authRouter;