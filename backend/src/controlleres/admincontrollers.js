import { User } from '../models/usermodels.js'
import { Property } from '../models/propertymodels.js'
import Inquiry from '../models/inquirymodels.js'

// view all user

export const getAllUsers = async (req, res) => {
      try {

            const users = await User.find().select("-password");

            res.status(200).json({
                  success: true,
                  total: users.length,
                  users
            });

      } catch (error) {

            res.status(500).json({
                  success: false,
                  message: error.message
            });
      }
};

// block a particular user

export const blockUser = async (req, res) => {
      try {
            const user = await User.findById(req.params.id);

            if (!user) {
                  return res.status(404).json({
                        success: false,
                        message: "User not found"
                  });
            }

            user.isBlocked = !user.isBlocked;
            await user.save();

            res.json({
                  success: true,
                  message: user.isBlocked ? "User Blocked" : "User Unblocked",
                  isBlocked: user.isBlocked
            })

      } catch (error) {
            res.status(500).json({
                  success: false,
                  message: error.message
            });
      }
}
// delete a particular user

export const deleteUser = async (req, res) => {
      try {
            const user = await User.findByIdAndDelete(req.params.id);

            if (!user) {
                  return res.status(404).json({
                        success: false,
                        message: "User not found"
                  });
            }

            res.status(200).json({
                  success: true,
                  message: "User deleted successfully"
            });
      } catch (error) {
            res.status(500).json({
                  success: false,
                  message: error.message
            });
      }
}

//view all properties

export const getAllProperties = async (req, res) => {
      try {

            const properties = await Property.find()
                  .populate("seller", "name email");

            res.status(200).json({
                  success: true,
                  total: properties.length,
                  properties
            });

      } catch (error) {

            res.status(500).json({
                  success: false,
                  message: error.message
            });
      }
};

// delete a particular property

export const deleteProperty = async (req, res) => {
      try {
            const property = await Property.findByIdAndDelete(req.params.id);

            if (!property) {
                  return res.status(404).json({
                        success: false,
                        message: "Property not found"
                  })
            }

            res.status(200).json({
                  success: true,
                  message: "Property deleted successfully"
            })

      } catch (error) {
            res.status(500).json({
                  success: false,
                  message: error.message
            });
      }
}

//to view all inquiry

export const getAllInquiry = async (req, res) => {
      try {
            const inquiries = await Inquiry.find()
                  .populate("buyer", "name email")
                  .populate("seller", "name email")
                  .populate("property", "title price")
                  .sort({ createdAt: -1 });

            res.json({
                  success: true,
                  total: inquiries.length,
                  inquiries
            })

      } catch (error) {
            res.status(500).json({
                  success: false,
                  message: error.message
            });
      }
}

//dashboard analytic

export const getDashboardStats = async (req, res) => {
      try {
            const totalUsers = await User.countDocuments();

            const totalProperties = await Property.countDocuments();

            const activeListing = await Property.countDocuments({
                  status: "sale"
            });

            const soldProperties = await Property.countDocuments({
                  status: "sold"
            });


            res.status(200).json({
                  success: true,
                  dashboard: {
                        totalUsers,
                        totalProperties,
                        activeListing,
                        soldProperties
                  }
            });

      } catch (error) {

            return res.status(500).json({
                  success: false,
                  message: error.message
            });
      }
}

//to get pending seller account

export const getPendingSeller = async (req, res) => {
      try {

            const pendingSellers = await User.find({
                  role: "seller",
                  isApproved: false
            }).select("-password");

            res.status(200).json({
                  success: true,
                  total: pendingSellers.length,
                  pendingSellers
            });

      } catch (error) {

            return res.status(500).json({
                  success: false,
                  message: error.message
            });
      }
};

// to approve seller

export const approvedSeller = async (req, res) => {
      try {

            const seller = await User.findById(req.params.id);

            if (!seller) {
                  return res.status(404).json({
                        success: false,
                        message: "Seller not found"
                  });
            }

            if (seller.role !== "seller") {
                  return res.status(400).json({
                        success: false,
                        message: "User is not a seller"
                  });
            }

            if (seller.isApproved === true) {
                  return res.status(400).json({
                        success: false,
                        message: "Seller already approved"
                  });
            }

            // approve seller
            seller.isApproved = true;

            await seller.save();

            return res.status(200).json({
                  success: true,
                  message: "Seller account approved successfully",
                  seller
            });

      } catch (error) {

            return res.status(500).json({
                  success: false,
                  message: error.message
            });
      }
}