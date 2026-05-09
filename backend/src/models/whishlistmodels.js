import mongoose from "mongoose";

const whishlistSchema = new mongoose.Schema({
      user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"         
      },

      property: {
            type: mongoose.Schema.Types.ObjectId,
            ref:"Property"
      }
},
      { timestamps: true }
)

const Whishlist = mongoose.model("Whishlist", whishlistSchema);

export default Whishlist;