import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import useChat from "../Hooks/useChat";
import Markdown from 'react-markdown'
import SideBar from "../Components/SideBar/Sidebar";
import ChatSection from "../Components/ChatSection/ChatSection";
import ChatFooter from "../Components/ChatSection/ChatFooter";
import ChatDeletion from "../Components/SideBar/ChatDeletion";
import ChatHeader from "../Components/ChatSection/ChatHeader";



const Dashboard = () => {
    const { socketConnectionHandler, sendQueryHandler, startNewChatHandler, setSidebarOpenHandler, setActiveChatHandler, getMessagesHandler, getChatsHandler, deleteChatHandler, finishAnimationHandler } = useChat();
    const { chats, currentChat, chatMessages, AIResChunks, isStreaming } = useSelector((state) => state.chat);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);


    const [deleteTargetId, setDeleteTargetId] = useState(null);

    const [displayedText, setDisplayedText] = useState("");
    const messagesContainerRef = useRef(null);

    useEffect(() => {
        socketConnectionHandler();
    }, []);

    // Typing animation effect for AI response - only while streaming
    useEffect(() => {
        if (!isStreaming) {
            setDisplayedText("");
            return;
        }

        if (AIResChunks.content.length > displayedText.length) {
            const timer = setTimeout(() => {
                setDisplayedText(AIResChunks.content.substring(0, displayedText.length + 1));
            }, 0.00010); // Adjust speed here (lower = faster)
            return () => clearTimeout(timer);
        } else if (AIResChunks.content.length > 0 && displayedText.length === AIResChunks.content.length && isStreaming) {
            // Animation complete - finish streaming and move to chatMessages
            finishAnimationHandler();
        }
    }, [displayedText, AIResChunks.content, isStreaming, finishAnimationHandler]);

    useEffect(() => {
        async function callgetChatHandler() {
            await getChatsHandler();
        }
        callgetChatHandler();
    }, []);

    useEffect(() => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    }, [chatMessages, currentChat?.id]);


    const openDeleteConfirm = (chatId) => {
        setDeleteTargetId(chatId);
        setShowDeleteConfirm(true);
    };

    const closeDeleteConfirm = () => {
        setShowDeleteConfirm(false);
        setDeleteTargetId(null);
    };

    const confirmDelete = async () => {
        if (!deleteTargetId) return;

        await deleteChatHandler(deleteTargetId);
        closeDeleteConfirm();
    };



    return (
        <div className="h-screen bg-[#0A0A0A] text-white flex overflow-hidden">


            {/* LEFT SIDEBAR  */}
            <SideBar startNewChatHandler={startNewChatHandler} setSidebarOpenHandler={setSidebarOpenHandler} setActiveChatHandler={setActiveChatHandler} getMessagesHandler={getMessagesHandler} setDisplayedText={setDisplayedText} openDeleteConfirm={openDeleteConfirm} />

            {/* ── MAIN CONTENT ── */}
            <main className="flex-1 flex flex-col min-h-0 min-w-0">

                {/* ── Top Header Bar ── */}
                <ChatHeader currentChat={currentChat} setSidebarOpenHandler={setSidebarOpenHandler} />

                {/* ── Messages Area ── */}
                <ChatSection finishAnimationHandler={finishAnimationHandler} displayedText={displayedText} setDisplayedText={setDisplayedText} />

                {/* ── Bottom Input Area ── */}
                <ChatFooter setDisplayedText={setDisplayedText} sendQueryHandler={sendQueryHandler} currentChat={currentChat} />
            </main >

            {/* ── Delete Confirmation Modal ── */}
            <ChatDeletion showDeleteConfirm={showDeleteConfirm} closeDeleteConfirm={closeDeleteConfirm} confirmDelete={confirmDelete} />
        </div >
    );
};

export default Dashboard;