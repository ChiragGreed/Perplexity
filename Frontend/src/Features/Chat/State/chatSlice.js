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
        AIResChunks: {
            content: '',
            role: 'ai'
        },
        isStreaming: false,
        chatLoading: false,
        chatError: false,
        socketId: null,
        sidebarOpen: false
    },
    reducers: {
        setChats: (state, action) => {
            state.chats = Array.isArray(action.payload) ? action.payload : [];
        },
        AddNewChat: (state, action) => {
            const chat = action.payload;
            if (!chat?.id) return;

            const existingChat = state.chats.some((existing) => existing.id === chat.id);
            if (!existingChat) {
                state.chats.push({ title: chat.title, id: chat.id });
            }
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
        AddAiResChunks: (state, action) => {
            state.AIResChunks.content += action.payload;
        },
        setAiResChunks: (state, action) => {
            state.AIResChunks.content = action.payload;
        },
        setIsStreaming: (state, action) => {
            state.isStreaming = action.payload;
        },
        finishStreaming: (state, action) => {
            // Move AIResChunks to chatMessages and reset
            if (state.AIResChunks.content.trim() && state.isStreaming) {
                const formattedDate = new Intl.DateTimeFormat('en-IN', {
                    month: 'long',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true
                }).format(new Date());

                state.chatMessages.push({
                    content: state.AIResChunks.content,
                    chatId: state.currentChat?.id || null,
                    time: formattedDate,
                    role: 'ai'
                });
            }
            state.AIResChunks.content = '';
            state.isStreaming = false;
        },
        deleteChat: (state, action) => {
            state.chats = state.chats.filter((chat) => chat.id !== action.payload);
        },
        setChatLoading: (state, action) => {
            state.loading = action.payload;
        },
        setChatError: (state, action) => {
            state.error = action.payload;
        },
        setSocketId: (state, action) => {
            state.socketId = action.payload;
        },
        setSidebarOpen: (state, action) => {
            state.sidebarOpen = action.payload;
        }
    }
})

export const { setChats, AddNewChat, setCurrentChat, setChatMessages, AddNewChatMessage, AddAiResChunks, setAiResChunks, setIsStreaming, finishStreaming, deleteChat, setChatLoading, setChatError, setSocketId, setSidebarOpen } = chatSlice.actions;
export default chatSlice.reducer;