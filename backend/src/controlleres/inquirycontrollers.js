import Inquiry from "../models/inquirymodels.js";
import { Property } from "../models/propertymodels.js";
import { ApiError } from "../utils/ApiError.js";

//buyer send enquiry
export const sendInquiry = async (req, res) => {
      try {
            const { propertyId, message } = req.body;
            const property = await Property.findById(propertyId).populate("seller");

            if (!property) {
                  throw new ApiError(400,"Property not found")
            }

            const sellerId = property.seller?._id ?? property.seller;
            if (!sellerId) {
                  throw new ApiError(400, "Property seller not found")
            }

            const inquiry = await Inquiry.create({
                  property: propertyId,
                  buyer: req.user._id,
                  seller: sellerId,
                  message
            })
            res.status(201).json({
                  success: true,
                  message: "Inquiry send successfully!",
                  inquiry
            })

      } catch (error) {
            res.status(500).json({
                  success: false,
                  message: error.message
            })
      }
}

//seller views inquiry

export const getSellerInquiry = async (req, res) => {
      try {
            const inquiries = await Inquiry.find({
             seller: req.user._id
            })
                  .populate("buyer", "name email phone")
                  .populate("property", "title price image city")
                  .sort({ createdAt: -1 })
            
            res.json({
                  success: true,
                  count: inquiries.length,
                  inquiries
            })
            
                  

      } catch (error) {
            res.status(500).json({
                  success: false,
                  message: error.message
            })
      }
}

//mark inquiry as read

export const markAsRead = async (req, res) => {
      try {
            const inquiry = await Inquiry.findById(req.params.id);

            if (!inquiry) {
                  throw new ApiError(404,"Inquiry not found")
            }
            inquiry.isRead = true;
            await inquiry.save();

            res.json({
                  success: true,
                  message: "Marked as Read"
            })

      } catch (error) {
            res.status(500).json({
                  success: false,
                  message: error.message
            })
      }
}