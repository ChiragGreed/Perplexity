import socketIoService from "../Services/chat.socket"

const useChat = () => {

    const socketConnectionHandler = () => {
        return socketIoService;
    }

    return { socketConnectionHandler }
}

export default useChat;