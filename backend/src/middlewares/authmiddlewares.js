import jwt from "jsonwebtoken";
import { User } from "../models/usermodels.js";
import { ApiError } from "../utils/ApiError.js";


export const authmiddleware = async (req, res, next) => {
      try {
            const token = req.header("Authorization")?.replace("Bearer ", "");

            if (!token) {
                  throw new ApiError(401, "Access denied. No token provided")
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            const user = await User.findById(decoded.id).select("-password");

            if (!user) {
                  throw new ApiError(404, "User not found");
            }

            if (user.isBlocked) {
                  throw new ApiError(403, "Your account is blocked");
            }

            req.user = user;

            next();

      } catch (error) {
            return res.status(401).json(
                  new ApiError(401, "Invalid or expired token")
            );
      }
};

// Role Based
export const authorizeRoles = (...roles) => {
      return (req, res, next) => {

            if (!roles.includes(req.user.role)) {
                  return res.status(403).json(
                        new ApiError(403, "Access Denied. You don't have permission.")
                  );
            }

            next();
      };
};