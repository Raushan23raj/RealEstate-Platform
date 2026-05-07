import express from 'express'
import { getSellerInquiry, markAsRead, sendInquiry } from '../controlleres/inquirycontrollers.js';
import { authorize, protect } from '../middlewares/authmiddlewares.js';

const inquiryRouter = express.Router();

inquiryRouter.post("/", protect, authorize("buyer"), sendInquiry);

inquiryRouter.get("/seller", protect, authorize("seller"), getSellerInquiry);

inquiryRouter.patch("/:id/read", protect, markAsRead);

export default inquiryRouter
