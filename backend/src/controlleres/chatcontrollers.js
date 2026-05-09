import Chat from "../models/chatModel.js";

//crete chat or get existing chat
export const createChat = async (req, res) => {
      try {

            const { sellerId, propertyId, buyerId: providedBuyerId } = req.body;
            let buyerId, finalsellerId;
            if (req.user.role === "seller") {
                  buyerId = providedBuyerId;
                  finalsellerId = req.user._id;
            }
            else {
                  buyerId = req.user._id;
                  finalsellerId = sellerId;
            }

            if (!buyerId || !finalsellerId) {
                  return res.status(400).json({
                        message: "Missing buyer or seller Id"
                  })
            }
            // check existing chat
            let chat = await Chat.findOne({
                  buyer: buyerId,
                  seller: finalsellerIdsellerId,
            });

            if (!chat) {
                  chat = await Chat.create({
                        buyer: buyerId,
                        seller: finalsellerIdsellerId,
                        property: propertyId,
                        messages: []
                  });
            }
            chat = await Chat.findById(chat._id)
                  .populate("buyer", "name email")
                  .populate("seller", "name email")
                  .populate("property", "title price images")
            
            return res.status(200).json({
                  success: true,
                  chat
            });

      } catch (error) {

            return res.status(500).json({
                  success: false,
                  message: error.message
            });
      }
};



export const sendMessage = async (req, res) => {
      try {
            const { chatId, text, image } = req.body;
            const userID = req.user.id;

            const chat = await Chat.findById(chatId);

            if (!chat) {
                  return res.status(404).json({
                        success: false,
                        message: "Chat not found"
                  });
            }
            if (chat.buyer.toString() !== userID && chat.seller.toString() !== userId) {
                  return res.status(403).json({
                        message: "Not authorized to send message in this chat"
                  })
            }

            const newMessage = {
                  sender: userID,
                  text,
                  image,
                  createdAt: new Date()
            };
            chat.message.puhs(newMessage);
            await chat.save();

            const savedMessage = chat.message[chat.message.length - 1];
            res.json({
                  chat,
                  newMessage: savedMessage
            })

      } catch (error) {

            return res.status(500).json({
                  success: false,
                  message: error.message
            });
      }
};




// get all user chats


export const getUserChats = async (req, res) => {
      try {

            const userId = req.user._id;
            const chats = await Chat.find({
                  $or: [
                        { buyer: userId },
                        { seller: userId}
                  ]
            })
                  .populate("buyer", "name email")
                  .populate("seller", "name email")
                  .populate("property", "title price images")
                  .sort({ updatedAt: -1 });

            return res.status(200).json({
                  success: true,
                  total: chats.length,
                  chats
            });

      } catch (error) {

            return res.status(500).json({
                  success: false,
                  message: error.message
            });
      }
};


export const getSingleChat = async (req, res) => {
      try {

            const chat = await Chat.findById(req.params.chatId)
                  .populate(
                  "message: sender", 
                  "name profilePic"
                  );

            if (!chat) {
                  return res.status(404).json({
                        success: false,
                        message: "Chat not found"
                  });
            }
            const userId = req.user._id.toString();
            if (chat.buyer.toString !== userId && chat.seller.toString() != userId) {
                  return res.status(403).json({
                        message:"Your are not authorized"
                  })
            }
            return res.status(200).json({
                  success: true,
                  chat
            });

      } catch (error) {

            return res.status(500).json({
                  success: false,
                  message: error.message
            });
      }
};

export const deleteEntireChat = async (req, res) => {
      try {
            const userId = req.user._id;
            const chat = await chat.findById(req.params.chatId);

            if (!chats) {
                  return res.status(404).json({
                        message:"chat not found"
                  })
            }
            if (chat.buyer.toString() !== userId.toString && chat.seller.toString() !== userId.toString()) {
                  return res.status(403).json({
                        message: "Your are not authorized"
                  })
            }
            await chat.findByIdAndDelete(req.params.chatId);
            res.json({
                  message:"chat deleted successfully"
            })

      } catch (error) {
            return res.status(500).json({
                  success: false,
                  message: error.message
            });
      }
}

//to delete a specific message
export const specificChat = async (req, res) => {
      try {
            const userId = req.user._id;
            const chat = await chat.findById(req.params.chatId);

            if (!chats) {
                  return res.status(404).json({
                        message: "chat not found"
                  })
            }
            const message = chat.message.id(req.params.message);
            if (!message) {
                  return res.status(404).json({
                        message:"Message not found"
                  })
            }
            if (message.sender.toString() != userId.toString()) {
                  return res.status(403).json({
                        message:"Not Authorised to delete this message"
                  })
            }
            chat.message.pull(req.params.messageId);
            await chat.save();
            res.json({ meassage: "Message deleted successfully!", chat });
 
      } catch (error) {
            return res.status(500).json({
                  success: false,
                  message: error.message
            });
      }
}