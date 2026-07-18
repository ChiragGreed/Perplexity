import { AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatMistralAI } from "@langchain/mistralai";
import { tool, createAgent } from 'langchain';
import { internetService } from "./internet.service.js";
import * as z from 'zod';
import { io } from "./socket.service.js";
import sendEmail from "./emailService.js";



const Geminimodel = new ChatGoogleGenerativeAI({
    model: "gemini-3.1-flash-lite",
    apiKey: process.env.GOOGLE_API_KEY
});

const Mistralmodel = new ChatMistralAI({
    model: "mistral-small-2603",
    apiKey: process.env.MISTRAL_API_KEY
});


export const invokeAi = async (messages) => {

    const context = messages.map((msg) => {
        if (msg.role === 'user') {
            return new HumanMessage(msg.content);
        } else if (msg.role === 'ai') {
            return new AIMessage(msg.content);
        }
    }).filter((Boolean));


    const emailService = tool(
        async ({ to, subject, html }) => {
            return sendEmail(to, subject, html);
        },
        {
            name: 'send_email',
            description: 'Use this tool if the user asks you or a task requires you to to send an email to an email address.',
            schema: z.object({
                to: z.string().describe('Email address of the receiver.'),
                subject: z.string().describe('Subject of the email.'),
                html: z.string().describe('HTML format of email to send.')
            })
        }
    )

    const internetSearch = tool(
        async ({ query }) => {
            return internetService(query);
        },
        {
            name: 'internet_Search',
            description: 'Use this tool ONLY for current events, real-time data, or queries requiring up-to-date internet information. DO NOT use this tool for general knowledge, history, mathematics, or fictional characters that you already know.',
            schema: z.object({
                query: z.string().describe('Search terms to use for finding response on internet.'),
            })
        }
    )

    const systemPrompt = "You are a knowledgeable AI assistant. Always use your internal knowledge base to answer questions about history, science, fictional characters, and general facts.Only invoke the internet_Search tool if the user asks for breaking news, real - time data, or information past your knowledge cutoff date. Use the send_email tool for sending email to an email address";

    const geminiAgent = createAgent({
        model: Geminimodel,
        tools: [internetSearch, emailService],
        stateModifier: systemPrompt
    });

    const response = await geminiAgent.streamEvents({ messages: context });
    let finalResponse = '';

    for await (const chunk of response) {
        if (chunk.event === 'on_chat_model_stream' && chunk.data?.chunk) {
            io.emit('ResponseChunk', (chunk.data.chunk.content));
            finalResponse += chunk.data.chunk.content;
        }
    }

    return (finalResponse);
}

export const generateChatTitle = async (title) => {
    const response = await Mistralmodel.invoke([
        new SystemMessage("You are a helpful assistant that generates a title for a chat based on the user's query. The title should be concise, relevant, and capture the essence of the conversation. Please provide a single, clear title without any additional explanation or context , under 5-6 words only."),
        new HumanMessage(`Generate a title for the following query: "${title}"`)
    ]);
    return (response.text);
}

