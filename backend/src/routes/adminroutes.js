import express from 'express'
import { approvedSeller, blockUser, deleteProperty, deleteUser, getAllInquiry, getAllProperties, getAllUsers, getDashboardStats, getPendingSeller } from '../controlleres/admincontrollers.js';
import { protect, authorize } from '../middlewares/authmiddlewares.js'

const adminRouter = express.Router();
adminRouter.use(protect, authorize("admin"));

adminRouter.get("/users", getAllUsers);

adminRouter.patch("/users/:id", blockUser);

adminRouter.delete("/users/:id", deleteUser);

adminRouter.get("/properties", getAllProperties);

adminRouter.delete("/properties/:id", deleteProperty);

adminRouter.get("/inquiries", getAllInquiry);

adminRouter.get("/stats", getDashboardStats);

adminRouter.get("/pending-seller", getPendingSeller);

adminRouter.patch("/approved-seller/:id", approvedSeller);

export default adminRouter;