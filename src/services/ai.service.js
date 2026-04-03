import { HumanMessage } from "@langchain/core/messages";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const model = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash-lite",
    apiKey: process.env.GOOGLE_API_KEY
});

export const invokeAi = async ({ query }) => {
    const response = await model.invoke([
        new HumanMessage(query)]);

    return (response.text);

}