import { createSlice } from "@reduxjs/toolkit";

export const chatSlice = createSlice({
    name: "chats",
    initialState: {
        chats: [{
            title: '',
            id: null
        }],
        currentChat: { id: null },
        chatMessages: [{
            content: '',
            role: null,
        }],
    },
    reducers: {
        setChats: (state, action) => {
            state.chats = action.payload;
        },
        setCurrentChat: (state, action) => {
            state.currentChat = action.payload;
        },
        setChatMessages: (state, action) => {
            state.chatMessages = action.payload;
        }
    }
})

export const {setChats,setCurrentChat,setChatMessages} = chatSlice.actions;
export default chatSlice.reducer;