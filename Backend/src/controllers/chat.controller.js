import chatModel from "../models/chatModel.js";
import messageModel from "../models/messageModel.js";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { generateChatTitle, invokeAi } from "../services/ai.service.js";

const query = async (req, res) => {
    const { query, chatId } = req.body;
    const userId = req.user.userid;

    if (!query) return res.status(404).json({
        message: "No query found",
        success: false,
        err: "No query found"
    })

    let chat = null;
    let chatTitle = null;


    //  If chatId is not provided, create a new chat with a generated title
    if (!chatId) {

        chatTitle = await generateChatTitle(query);
        chat = await chatModel.create({ userId, title: chatTitle });

    }

    // If chatId is provided, continue the existing chat

    const message = await messageModel.create({ chatId: chatId || chat._id, content: query, role: 'human' });

    const allMessages = await messageModel.find({ chatId: chatId ? chatId : chat._id }).sort({ createdAt: 1 });

    const AiResponse = await invokeAi(allMessages);

    const responseMessage = await messageModel.create({ chatId: chatId ? chatId : chat._id, content: AiResponse, role: 'ai' });

    res.status(200).json({
        AiResponse: AiResponse,
        success: true,
        chat
    })


}

const getChats = async (req, res) => {
    const userId = req.user.userid;

    const chats = await chatModel.find({ userId });

    if (!chats) return res.status(404).json({
        message: "No chats found",
        success: false,
        error: "No chats found with the provided userId"
    })

    res.status(200).json({
        chats,
        success: true
    })
}

const getMessages = async (req, res) => {
    const { chatId } = req.query;
    const userId = req.user.userid;


    if (!chatId) return res.status(404).json({
        message: "No chatId found",
        success: false,
        error: " No chatId provided"
    })

    const chat = await chatModel.findOne({ _id: chatId, userId });

    if (!chat) return res.status(404).json({
        message: "Chat do not exist",
        success: false,
        error: "Chat do not exist"
    })

    const messages = await messageModel.find({ chatId });

    if (!messages) return res.status(200).json({
        message: "No message created for this chat",
        success: true,
    })

    res.status(200).json({
        messages,
        success: true

    })
}

const deleteChat = async (req, res) => {
    const { chatId } = req.body;
    const userId = req.user.userid;

    if (!chatId) return res.status(404).json({
        message: "No chatId found",
        success: false,
        error: "No chatId provided"
    })

    const chat = await chatModel.deleteOne({ _id: chatId, userId });

    if (!chat) return res.status(404).json({
        message: "Chat already deleted or do not exist",
        success: false,
        error: "Chat do not exist"
    })

    await messageModel.deleteMany({ chatId });

    res.status(200).json({
        message: "Chat deleted successfully",
        success: true
    })

}


export default { query, getChats, getMessages, deleteChat };