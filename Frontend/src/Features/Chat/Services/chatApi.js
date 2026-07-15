import axios from 'axios';

const api = axios.create({
    baseURL: "https://askbase-qv8j.onrender.com/api/chat",
    withCredentials: true
})

export const sendQueryApi = async (query, chatId) => {
    const response = await api.post('/query', { query, chatId });
    return response.data;
}

export const getChatsAPi = async () => {
    const response = await api.get('/getChats');
    return response.data;
}

export const getMessagesApi = async (chatId) => {
    const response = await api.get(`/getMessages/?chatId=${chatId}`);
    return response.data;
}


export const deleteChatAPi = async (chatId) => {
    const response = await api.delete(`/deleteChat/?chatId=${chatId}`);
    return response.data;
}

