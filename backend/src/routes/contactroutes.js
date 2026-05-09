import express from 'express';
import { createContact, getAllConatacts } from '../controlleres/contactcontrollers.js';
import { authorize, protect } from '../middlewares/authmiddlewares.js';

const contactRouter = express.Router();

contactRouter.post("/", createContact);
contactRouter.get("/", protect, authorize("admin"), getAllConatacts);

export default contactRouter;