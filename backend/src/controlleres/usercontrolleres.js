import { User } from "../models/usermodels.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadtocloudinary } from "../utils/uploadcloudniary.js";


//getprofile
export const getprofile = async (req, res) => {
      try {
            const user = await User.findById(req.user._id).selecting("-password");
             res.staus(200).json({
                  success: true,
                  user
            })

      } catch (error) {
             res.status(500).json({
                  success: false,
                  message: error.message
            })
      }
}

//to get public profile
export const publicprofile = async (req, res) => {
      try {
            const user = User.findById(req.params.id).selecting("name profilepic role createdat");
            if (!user) {
                  throw new ApiError(404, "user not found")
            }
            res.staus(200).json({
                  success: true,
                  user
            })

      } catch (error) {
             res.staus(500).json({
                  success: false,
                  message: error.message
            })
      }
}

//update profile
export const updateprofile = async (req, res) => {
      try {
            const { name, phone, address, removeprofilePic } = req.body;
            const user = await User.findById(req.user._id);
            if (!user) {
                  throw new ApiError(400,"user not found")
            }

            //image handling
            if (req.file) {
                  const result = await uploadtocloudinary(req.file.buffer, "profiles")
                  user.profilePic = result.secure_url;
            }
            else if (removeprofilePic === "true") {
                  user.profilePic = null;
            }

            if (name !== undefined) user.name = name;
            if (phone !== undefined) user.phone = phone;
            if (address !== undefined) user.address = address;
            
            const updateuser = await user.save();
            res.json({
                  success: true,
                  message: "Profile pic update successfully",
                  user: updateuser
            })

      } catch (error) {
             res.staus(500).json({
                  success: false,
                  message: error.message
            })
      }
}