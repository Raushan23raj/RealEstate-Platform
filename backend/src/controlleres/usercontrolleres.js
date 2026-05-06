import { User } from "../models/usermodels";
import { ApiError } from "../utils/ApiError";


//get profile
export const getprofile = async (req, res) => {
      try {
            const user = await User.findById(req.user._id).selecting("-password");
             res.staus(200).json({
                  success: true,
                  user
            })

      } catch (error) {
            res.staus(500).json({
                  success: false,
                  message = error.message
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
                  message = error.message
            })
      }
}

//update profile