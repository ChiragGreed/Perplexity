import { AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatMistralAI } from "@langchain/mistralai"

const Geminimodel = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash-lite",
    apiKey: process.env.GOOGLE_API_KEY
});

const Mistralmodel = new ChatMistralAI({
    model: "mistral-small-2603",
    apiKey: process.env.MISTRAL_API_KEY
});

export const invokeAi = async (messages) => {

    const context = messages.map((msg) => {
        if (msg.role === 'human') {
            return new HumanMessage(msg.content);
        } else if (msg.role === 'ai') {
            return new AIMessage(msg.content);
        }
    }).filter((Boolean));

    const response = await Geminimodel.invoke(context);
    return (response.text);
}

export const generateChatTitle = async (title) => {
    const response = await Mistralmodel.invoke([
        new SystemMessage("You are a helpful assistant that generates a title for a chat based on the user's query. The title should be concise, relevant, and capture the essence of the conversation. Please provide a single, clear title without any additional explanation or context , under 5-6 words only."),
        new HumanMessage(`Generate a title for the following query: "${title}"`)
    ]);
    return (response.text);
}