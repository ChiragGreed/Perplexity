import { HumanMessage } from "@langchain/core/messages";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatMistralAI } from "@langchain/mistralai"

const Geminimodel = async (query) => {
    const response = await model.invoke(query);
    return (response.text);
}

const Mistralmodel = new ChatMistralAI({
    model: "mistral-small-2603",
    apiKey: process.env.MISTRAL_API_KEY
});

export const invokeAi = async ({ query }) => {
    const response = await Geminimodel.invoke([
        new HumanMessage(query)]);

    return (response.text);

}

export const generateChatTitle = async ({ title }) => {
    const response = await Mistralmodel.invoke(`Create a chat summary title under 10 words for this query: '${title}'`);
    return (response.text);
}