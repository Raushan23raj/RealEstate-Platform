import Whishlist from "../models/whishlistmodels.js";

//to add property to whishlist

export const addToWhishlist = async (req, res) => {
      try {
            const { propertyId } = req.body;
            const alreadyExist = await Whishlist.findOne({
                  user: req.user._id,
                  property: propertyId
            })

            if (alreadyExist) {
                  return res.status(400).json({
                        success: false,
                        message: "Property already in wishlist"
                  })
            }

            const wishlist = await Whishlist.create({
                  user: req.user._id,
                  property: propertyId
            })

            return res.status(200).json({
                  success: true,
                  message: "Property added to wishlist",
                  wishlist
            })


      } catch (error) {
            return res.status(500).json({
                  success: false,
                  message: error.message
            });
      }
}

//to get property from whishlist

export const getWhishlistProperty = async (req, res) => {
      try {
            const data = await Whishlist.find({
                  user: req.user._id
            }).populate("property");

            return res.status(200).json({
                  data
            })

      } catch (error) {
            return res.status(500).json({
                  success: false,
                  message: error.message
            });
      }
}

//to remove property from whishlist

export const removeToWhishlist = async (req, res) => {
      try {
            const { propertyId } = req.body;

            const result = await Whishlist.findOneAndDelete({
                  user: req.user._id,
                  property: propertyId
            });

            if (!result) {
                  return res.status(404).json({
                        success: false,
                        message: "Property not found in whishlist"
                  });
            }

            return res.status(200).json({
                  success: true,
                  message: "Property removed from whishlist"
            });

      } catch (error) {
            return res.status(500).json({
                  success: false,
                  message: error.message
            });
      }
}