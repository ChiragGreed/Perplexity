import chatModel from "../models/chatModel.js";
import messageModel from "../models/messageModel.js";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { generateChatTitle, invokeAi } from "../services/ai.service.js";

const newChat = async (req, res) => {
    const { query } = req.body;
    const userId = req.user.userid;

    if (!query) return res.status(404).json({
        message: "No query found",
        success: false,
        err: "No query found"
    })

    const chatTitle = await generateChatTitle({ title });

    const chat = await chatModel.create({ userId, title: chatTitle });

    const message = await messageModel.create({ chatId: chat._id, content: query, role: 'human' });

    const AiResponse = await invokeAi({ query });

    const responseMessage = await messageModel.create({ chatId: chat._id, content: AiResponse, role: 'ai' });

    res.status(200).json({
        AiResponse: AiResponse,
        success: true
    })
}

const continueChat = async (req, res) => {
    const { query } = req.body;
    const { chatId } = req.params;

    if (!query) return res.status(404).json({
        message: "No query found",
        success: false,
        err: "No query found"
    })

    const chat = await chatModel.findById(chatId);

    if (!chat) return res.status(404).json({
        message: " Chat not found",
        success: false,
        err: "Chat do not exist"
    })

    const message = await messageModel.create({ chatId, content: query, role: "human" });

    const allMessages = await messageModel.find({ chatId }).sort({ createdAt: 1 });


    const context = allMessages.map((msg) => {
        if (msg.role === 'human') {
            return new HumanMessage(msg.content);
        } else if (msg.role === 'ai') {
            return new AIMessage(msg.content);
        }
        else return null;
    }).filter((Boolean));


    console.log("Context: ", context);
    const AiResponse = await invokeAi(context);

    const responseMessage = await messageModel.create({ chatId: chat._id, content: AiResponse, role: 'ai' });

    res.status(200).json({
        message: AiResponse,
        success: true
    })

}


export default { newChat, continueChat }