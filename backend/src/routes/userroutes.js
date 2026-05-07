import express from 'express'
import { getprofile, publicprofile, updateprofile } from '../controlleres/usercontrolleres.js';
import { protect } from "../middlewares/authmiddlewares.js";
import upload from '../middlewares/uploadmiddlewares.js';

const userRouter = express.Router();

userRouter.get("/profile", protect, getprofile);

userRouter.put("/profile", protect, upload.single("profilepic"), updateprofile);

userRouter.get("/public/:id", publicprofile);

export default userRouter;