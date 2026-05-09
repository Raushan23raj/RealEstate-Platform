import express from 'express'
import { addToWhishlist, getWhishlistProperty, removeToWhishlist } from '../controlleres/whishlistcontrollers.js';
import { protect } from '../middlewares/authmiddlewares.js';

const WhishlistRouter = express.Router();

WhishlistRouter.post("/:propertyId", protect, addToWhishlist)

WhishlistRouter.get("/", protect, getWhishlistProperty);

WhishlistRouter.delete("/:propertyId", protect, removeToWhishlist)

export default WhishlistRouter
