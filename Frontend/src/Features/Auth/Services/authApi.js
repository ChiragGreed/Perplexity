import axios from 'axios';

const api = axios.create({
    baseURL: 'https://askbase-qv8j.onrender.com/api/auth',
    withCredentials: true
});

export const registerAPi = async (username, email, password) => {
    const response = await api.post('/register', { username, email, password });
    return response.data;
}

export const resendEmailApi = async (username) => {
    const response = await api.post('/resendEmail', { username });
    return response.data;
}

export const loginApi = async (email, password) => {
    const response = await api.post('/login', { email, password });
    return response.data;
}

export const getMeApi = async () => {
    const response = await api.get('/getMe');
    return response.data;
}

