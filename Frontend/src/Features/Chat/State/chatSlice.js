import { createSlice } from "@reduxjs/toolkit";

export const chatSlice = createSlice({
    name: "chats",
    initialState: {
        chats: [{
            title: '',
            id: null
        }],
        currentChat: null,
        chatMessages: [{
            content: '',
            chatId: null,
            time: null,
            role: null,
        }],
    },
    reducers: {
        setChats: (state, action) => {
            state.chats = action.payload;
        },
        AddNewChat: (state, action) => {
            state.chats.push(action.payload);
        },
        setCurrentChat: (state, action) => {
            state.currentChat = action.payload;
        },
        setChatMessages: (state, action) => {
            state.chatMessages = action.payload;
        },
        AddNewChatMessage: (state, action) => {
            state.chatMessages.push(action.payload);
        },
        deleteChat: (state, action) => {
            const index = state.chats.indexOf(action.payload);
            state.chats.splice(index, 1);
        }
    }
})

export const { setChats, AddNewChat, setCurrentChat, setChatMessages, AddNewChatMessage, deleteChat } = chatSlice.actions;
export default chatSlice.reducer;