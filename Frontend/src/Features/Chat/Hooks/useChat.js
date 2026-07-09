import socketIoService from "../Services/chat.socket"
import { deleteChatAPi, getChatsAPi, getMessagesApi, sendQueryApi } from "../Services/chatApi";
import { useDispatch, useSelector } from 'react-redux';
import { AddNewChat, AddNewChatMessage, setChatMessages, setChats, setCurrentChat, deleteChat } from "../State/chatSlice";
import { setError, setLoading } from "../../Auth/State/authSlice";

const useChat = () => {

    const dispatch = useDispatch();
    const chats = useSelector((state) => state.chat.chats);

    const socketConnectionHandler = () => {
        return socketIoService;
    }

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

        dispatch(setLoading(true));
        dispatch(AddNewChatMessage({ content: query, role: 'human' }));
        try {

            const res = await sendQueryApi(query, chatId);
            if (res.chat !== null) dispatch(AddNewChat({ title: res.chat?.title, id: res.chat?._id }));
            dispatch(AddNewChatMessage({ content: res.AiResponse, role: 'ai' }));
        }
        catch (error) {
            dispatch(setError(error.message));
        }
        finally {
            dispatch(setLoading(false));
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
            dispatch(setError(error.message));
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
            dispatch(setError(error.message));
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
            dispatch(setError(error.message));
        }
    }

    const deleteChatHandler = async (chatId) => {
        try {
            await deleteChatAPi(chatId);
            dispatch(deleteChat(chatId));
        }
        catch (error) {
            dispatch(setError(error.message));
        }
    }

    return { socketConnectionHandler, startNewChatHandler, sendQueryHandler, getChatsHandler, setActiveChatHandler, getMessagesHandler, deleteChatHandler }
}

export default useChat;