import socketIoService from "../Services/chat.socket"
import { deleteChatAPi, getChatsAPi, getMessagesApi, sendQueryApi } from "../Services/chatApi";
import { useDispatch, useSelector } from 'react-redux';
import { AddNewChat, AddNewChatMessage, setChatMessages, setChats, setCurrentChat } from "../State/chatSlice";
import { setError, setLoading } from "../../Auth/State/authSlice";

const useChat = () => {

    const dispatch = useDispatch();
    const chats = useSelector((state) => state.chat.chats);

    const socketConnectionHandler = () => {
        return socketIoService;
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
            console.log(error);
        }
        finally {
            dispatch(setLoading(false));
        }

    }

    const getChatsHandler = async () => {
        try {
            const res = await getChatsAPi();
            dispatch(setChats(res));
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
        const res = await getMessagesApi(chatId);
        dispatch(setChatMessages(res));
        return res;
    }

    const deleteChatHandler = async () => {
        const res = await deleteChatAPi();
        return res;
    }

    return { socketConnectionHandler, sendQueryHandler, getChatsHandler, setActiveChatHandler, getMessagesHandler, deleteChatHandler }
}

export default useChat;