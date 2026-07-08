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
            role: null,
        }],
    },
    reducers: {
        setChats: (state, action) => {
            state.chats = action.payload.chats.map(chat => {
                return { title: chat.title, id: chat._id };
            });
        },
        AddNewChat: (state, action) => {
            state.chats.push(action.payload);
        },
        setCurrentChat: (state, action) => {
            state.currentChat = action.payload;
        },
        setChatMessages: (state, action) => {
            state.chatMessages = action.payload.messages.map(msg => {
                return { content: msg.content, chatId: msg.chatId, role: msg.role }
            });
        },
        AddNewChatMessage: (state, action) => {
            state.chatMessages.push(action.payload);
        },
    }
})

export const { setChats, AddNewChat, setCurrentChat, setChatMessages, AddNewChatMessage } = chatSlice.actions;
export default chatSlice.reducer;