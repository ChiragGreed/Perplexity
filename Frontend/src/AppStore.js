import { configureStore } from '@reduxjs/toolkit';
import authReducer from './Features/Auth/Store/authSlice.js';


const store = configureStore({
    reducer: {
        auth: authReducer
    }
})

export default store