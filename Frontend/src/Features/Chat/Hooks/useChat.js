import socketIoService from "../Services/chat.socket"
import { deleteChatAPi, sendQueryApi } from "../Services/chatApi";
import { useDispatch } from 'react-redux';
import { setChats } from "../State/chatSlice";

const useChat = () => {

    const dispatch = useDispatch();

    const socketConnectionHandler = () => {
        return socketIoService;
    }

    const sendQueryHandler = async () => {
        const res = await sendQueryApi();
        return res;
    }

    const getChatsHandler = async () => {
        const res = await getChatsAPi();
        return res;
    }

    const getMessagesHandler = async () => {
        const res = await getMessagesApi();
        return res;
    }

    const deleteChatHandler = async () => {
        const res = await deleteChatAPi();
        return res;
    }

    return { socketConnectionHandler }
}

export default useChat;