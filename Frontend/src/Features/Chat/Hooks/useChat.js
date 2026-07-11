import { io } from 'socket.io-client';
import { deleteChatAPi, getChatsAPi, getMessagesApi, sendQueryApi } from "../Services/chatApi";
import { useDispatch, useSelector } from 'react-redux';
import { AddNewChat, AddNewChatMessage, setChatMessages, setChats, setCurrentChat, deleteChat, setAiResChunks, setIsStreaming, finishStreaming, AddAiResChunks } from "../State/chatSlice";
import { setChatError, setChatLoading } from "../../Chat/State/chatSlice.js";
import { useEffect, useRef } from 'react';

const useChat = () => {

    const dispatch = useDispatch();
    const chats = useSelector((state) => state.chat.chats);

    // Initialize socket connection with streaming state management
    useEffect(() => {
        const socket = io('http://localhost:7000', {
            withCredentials: true
        });

        socket.on('connect', () => {
            console.log('Connected to server');
        })

        socket.on('ResponseChunk', (chunk) => {
            dispatch(setIsStreaming(true));
            dispatch(AddAiResChunks(chunk));
        })

        return () => {
            socket.disconnect();
        }
    }, [dispatch]);

    const startNewChatHandler = () => {
        dispatch(setCurrentChat(null));
        dispatch(setChatMessages([{
            content: '',
            chatId: null,
            time: null,
            role: null,
        }]));
    }

    const sendQueryHandler = async (query, chatId) => {

        dispatch(setChatLoading(true));
        dispatch(setAiResChunks(''));
        dispatch(setIsStreaming(true));

        const humanTime = new Intl.DateTimeFormat('en-IN', {
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        }).format(new Date());

        dispatch(AddNewChatMessage({ content: query, chatId: chatId || null, time: humanTime, role: 'user' }));

        try {

            const res = await sendQueryApi(query, chatId);
            const createdChat = res?.chat;

            if (!chatId && createdChat?._id) {
                dispatch(AddNewChat({ title: createdChat.title, id: createdChat._id }));
            }

            if (createdChat) {
                dispatch(setCurrentChat({ title: createdChat.title, id: createdChat._id || chatId }));
            }
            // Don't add the full response here - let socket chunks handle it via finishStreaming
        }
        catch (error) {
            dispatch(setChatError(error.message));
        }
        finally {
            dispatch(setChatLoading(false));
        }

    }

    const getChatsHandler = async () => {
        try {
            const res = await getChatsAPi();
            const chatsState = res.chats.map(chat => {
                return { title: chat.title, id: chat._id };
            });
            dispatch(setChats(chatsState));
        }
        catch (error) {
            dispatch(setChatError(error.message));
        }
    }

    const setActiveChatHandler = (chatId) => {
        try {
            const currentChat = chats.find((chat) => {
                return chat.id === chatId;
            })
            dispatch(setCurrentChat(currentChat));
        }
        catch (error) {
            dispatch(setChatError(error.message));
        }
    }

    const getMessagesHandler = async (chatId) => {
        try {

            const res = await getMessagesApi(chatId);

            const messegesState = res.messages.map(msg => {
                const formattedDate = new Intl.DateTimeFormat('en-IN', {
                    month: 'long',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true
                }).format(new Date(msg.createdAt))
                return { content: msg.content, chatId: msg.chatId, time: formattedDate, role: msg.role }
            });
            dispatch(setChatMessages(messegesState));
        }
        catch (error) {
            dispatch(setChatError(error.message));
        }
    }

    const deleteChatHandler = async (chatId) => {
        try {
            await deleteChatAPi(chatId);
            dispatch(deleteChat(chatId));
        }
        catch (error) {
            dispatch(setChatError(error.message));
        }
    }

    const socketConnectionHandler = () => {
        // Socket is initialized in useEffect, this is for backward compatibility
        return null;
    }

    const finishAnimationHandler = () => {
        // Called when typing animation completes
        dispatch(finishStreaming());
    }

    return { socketConnectionHandler, startNewChatHandler, sendQueryHandler, getChatsHandler, setActiveChatHandler, getMessagesHandler, deleteChatHandler, finishAnimationHandler }
}

export default useChat;