// routes/chatRoutes.js

import express from 'express';

import { protect } from '../middlewares/authmiddlewares.js';

import { createChat, sendMessage, getUserChats, getSingleChat, deleteEntireChat, specificChat} from '../controlleres/chatcontrollers.js';

const chatRouter = express.Router();


// protect all routes
chatRouter.use(protect);

chatRouter.post("/create", createChat);

chatRouter.post("/send/:chatId", sendMessage);

chatRouter.get("/my-chats", getUserChats);

chatRouter.get("/:chatId", getSingleChat);

chatRouter.delete("/delete-chat/:chatId", deleteEntireChat);

chatRouter.delete("/delete-message/:chatId/:messageId", specificChat);


export default chatRouter;