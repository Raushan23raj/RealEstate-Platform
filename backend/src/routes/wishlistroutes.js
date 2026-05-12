import express from 'express'
import { addToWishlist, getWishlistProperty, removeToWishlist } from '../controlleres/wishlistcontrollers.js';
import { protect } from '../middlewares/authmiddlewares.js';

const WishlistRouter = express.Router();

WishlistRouter.post("/:propertyId", protect, addToWishlist)

WishlistRouter.get("/", protect, getWishlistProperty);

WishlistRouter.delete("/:propertyId", protect, removeToWishlist)

export default WishlistRouter
