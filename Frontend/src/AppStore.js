import { configureStore } from '@reduxjs/toolkit';
import authReducer from './Features/Auth/State/authSlice.js';
import chatReducer from './Features/Chat/State/chatSlice.js'


const store = configureStore({
    reducer: {
        auth: authReducer,
        chat: chatReducer
    }
})

export default store