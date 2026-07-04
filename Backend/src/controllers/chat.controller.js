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
        success: true
    })
}


export default { query }