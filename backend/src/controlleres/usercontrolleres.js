import { User } from "../models/usermodels.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadtocloudinary } from "../utils/uploadcloudniary.js";


//getprofile
export const getprofile = async (req, res) => {
      try {
            const user = await User.findById(req.user._id).select("-password");
             res.status(200).json({
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
            const user = await User.findById(req.params.id).select("name profilePic role createdAt");
            if (!user) {
                  throw new ApiError(404, "user not found")
            }
            res.status(200).json({
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
            const safeUser = updateuser.toObject();
            delete safeUser.password;

            res.json({
                  success: true,
                  message: "Profile pic update successfully",
                  user: safeUser
            })

      } catch (error) {
             res.status(500).json({
                  success: false,
                  message: error.message
            })
      }
}
