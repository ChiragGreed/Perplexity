import axios from 'axios';

const api = axios.create({
    origin: "http://localhost:7000/api/chat",
    withCredentials: true
})

export const sendQueryApi = async ({ query }) => {
    const response = await api.post('/query', { query });
    return response.data;
}

export const getChatsAPi = async () => {
    const response = await api.get('/getChats');
    return response.data;
}

export const getMessagesApi = async ({ chatId }) => {
    const response = await api.get('/getMessages', { chatId });
    return response.data;
}


export const deleteChatAPi = async ({ chatId }) => {
    const response = await api.get('/deleteChat', { chatId });
    return response.data;
}

