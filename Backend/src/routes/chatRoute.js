import express from "express";
import chatController from "../controllers/chat.controller.js";
import verifyUser from "../middleware/authMiddleware.js";

const chatRoute = express.Router();

chatRoute.post('/query', verifyUser, chatController.query);

chatRoute.get('/getChats', verifyUser, chatController.getChats);

chatRoute.get('/getMessages', verifyUser, chatController.getMessages);

chatRoute.delete('/deleteChat', verifyUser, chatController.deleteChat);


export default chatRoute;