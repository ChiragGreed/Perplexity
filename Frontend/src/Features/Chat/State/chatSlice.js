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
        chatError: false
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
            if (state.AIResChunks.content.trim()) {
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
            const index = state.chats.indexOf(action.payload);
            state.chats.splice(index, 1);
        },
        setChatLoading: (state, action) => {
            state.loading = action.payload;
        },
        setChatError: (state, action) => {
            state.error = action.payload;
        }
    }
})

export const { setChats, AddNewChat, setCurrentChat, setChatMessages, AddNewChatMessage, AddAiResChunks, setAiResChunks, setIsStreaming, finishStreaming, deleteChat, setChatLoading, setChatError } = chatSlice.actions;
export default chatSlice.reducer;