import express from "express";
import chatController from "../controllers/chat.controller.js";
import verifyUser from "../middleware/authMiddleware.js";

const chatRoute = express.Router();

chatRoute.post('/newChat', verifyUser, chatController.newChat);

chatRoute.post('/continue/:chatId', verifyUser, chatController.continueChat);

export default chatRoute;