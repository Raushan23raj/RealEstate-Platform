import express from 'express'
import { addproperty, deleteproperty, getlalproperties, getmyproperty, getpropertydetails, getPropetyCounts, getsellerdashboard, updateproperty, updatepropertystatus } from '../controlleres/propertycontrollers.js';
import { authorize, protect } from '../middlewares/authmiddlewares.js';
import upload from '../middlewares/uploadmiddlewares.js';


const propertyRouter = express.Router();

propertyRouter.get("/", getlalproperties);


//protect only those routes where seller can work

propertyRouter.post("/", protect, authorize("seller"), upload.array("image", 10), addproperty);
propertyRouter.get("/my", protect, authorize("seller"), getmyproperty);

propertyRouter.put("/:id", protect, authorize("seller"), upload.array("image", 10), updateproperty);

propertyRouter.delete("/:id", protect, authorize("seller"), deleteproperty);

propertyRouter.patch("/:id/status", protect, authorize("seller"), updatepropertystatus);

propertyRouter.get("/counts", getPropetyCounts);

propertyRouter.get("/:id", getpropertydetails);

propertyRouter.get("/seller/dashboard", protect, authorize("seller"), getsellerdashboard);

export default propertyRouter;



