import express from "express";
import chatController from "../controllers/chat.controller.js";
import verifyUser from "../middleware/authMiddleware.js";

const chatRoute = express.Router();

chatRoute.post('/query', verifyUser, chatController.receiver);

export default chatRoute