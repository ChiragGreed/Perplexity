import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-lite",
  apiKey: process.env.GOOGLE_API_KEY
});

export const useAi = async () => {
    await model.invoke('what is your module name').then((res) => {
        console.log('Ai: '+res.text);
    })
}