import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import useChat from "../Hooks/useChat";
import Markdown from 'react-markdown'
import SideBar from "../Components/SideBar/Sidebar";


const quickPrompts = ["Summarize this thread", "Draft a launch email", "Suggest next steps"];

const Dashboard = () => {
    const { socketConnectionHandler, sendQueryHandler, getChatsHandler, deleteChatHandler, finishAnimationHandler, setSidebarOpenHandler } = useChat();
    const { chats, currentChat, chatMessages, AIResChunks, isStreaming } = useSelector((state) => state.chat);

    const [draft, setDraft] = useState("");
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

    const handleSend = async (event) => {
        event.preventDefault();
        const trimmed = draft.trim();
        if (!trimmed) return;

        setDisplayedText(""); // Reset animation for new response
        await sendQueryHandler(trimmed, currentChat?.id);

        setDraft("");
    };

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

           
            {/* ── LEFT SIDEBAR ── */}
            <SideBar setDisplayedText={setDisplayedText} openDeleteConfirm={openDeleteConfirm} />

            {/* ── MAIN CONTENT ── */}
            <main className="flex-1 flex flex-col min-h-0 min-w-0">

                {/* ── Top Header Bar ── */}
                <header className="shrink-0 flex items-center justify-between border-b border-[#1C1C1E] px-4 py-4 sm:px-8 bg-[#0A0A0A]/80 backdrop-blur-md">
                    <div className="flex items-center gap-4">
                        {/* Mobile hamburger */}
                        <button
                            type="button"
                            onClick={() => setSidebarOpenHandler(true)}
                            className="lg:hidden text-[#A1A1AA] hover:text-white transition-colors p-1"
                            aria-label="Open sidebar"
                        >
                            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
                            </svg>
                        </button>
                        <div>
                            <h2 className="text-lg font-semibold text-white tracking-tight">
                                {currentChat?.title || "New Conversation"}
                            </h2>
                        </div>
                    </div>
                </header>

                {/* ── Messages Area ── */}
                <section
                    ref={messagesContainerRef}
                    className="flex-1 overflow-y-auto px-4 py-8 sm:px-8 lg:px-12 scrollbar-none [&::-webkit-scrollbar]:hidden"
                >
                    <div className="mx-auto max-w-[800px] flex flex-col gap-8 min-h-full">
                        {chatMessages.length === 0 || (chatMessages.length === 1 && chatMessages[0].role === null) ? (
                            <div className="flex-1 flex flex-col items-center justify-end pb-49  translate-x-[-12%] sm:pb-49 opacity-90 animate-in fade-in duration-700">
                                <div className="flex items-center gap-2">
                                    <img className="h-30 w-38 -mr-12 drop-shadow-2xl" src="/images/AppLogo.png" alt="AskBase logo" />
                                    <h1 className="text-6xl sm:text-8xl font-thin text-white tracking-tight drop-shadow-lg">AskBase</h1>
                                </div>
                                <p className="text-[14px] mt-4 font-thin uppercase tracking-[0.2em] text-[#A1A1AA] drop-shadow-md">AI Assistant</p>
                            </div>
                        ) : (
                            chatMessages.map((message, idx) => (
                                <div
                                    key={idx}
                                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    {message.role === "user" ? (
                                        /* ── User Bubble ── */
                                        <div className="flex flex-col items-end gap-1.5 max-w-[85%] lg:max-w-[75%]">
                                            <div className="bg-linear-to-r from-[#F5FF3A] to-[#ABD600] rounded-2xl rounded-tr-sm px-5 py-3.5 shadow-lg shadow-[#ABD600]/10">
                                                <p className="text-sm leading-relaxed text-[#1a1a1a] font-medium">{message.content}</p>
                                            </div>
                                            {message.time && (
                                                <span className="text-[11px] tracking-wide text-[#71717A] px-1">{message.time}</span>
                                            )}
                                        </div>
                                    ) : (
                                        /* ── AI Bubble ── */
                                        <div className="flex gap-3 max-w-[90%] lg:max-w-[85%]">
                                            <div className="shrink-0 mt-1">
                                            </div>
                                            <div className="flex flex-col gap-1.5">
                                                <div className="bg-[#141414] border border-[#1C1C1E] rounded-2xl rounded-tl-sm px-5 py-4">
                                                    <div className="text-sm leading-7 text-[#E5E2E1] prose prose-invert prose-sm max-w-none">
                                                        <Markdown>{message.content}</Markdown>
                                                    </div>
                                                </div>
                                                {message.time && (
                                                    <span className="text-[11px] tracking-wide text-[#71717A] px-1">AI · {message.time}</span>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}

                        {isStreaming && (
                            <div className="flex gap-3 max-w-[90%] lg:max-w-[85%]">
                                <div className="shrink-0 mt-1">
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <div className="bg-[#141414] border border-[#1C1C1E] rounded-2xl rounded-tl-sm px-5 py-4">
                                        <div className="text-sm leading-7 text-[#E5E2E1] prose prose-invert prose-sm max-w-none">
                                            <Markdown>{displayedText}</Markdown>
                                            {displayedText.length < AIResChunks.content.length && (
                                                <span className="inline-block w-2 h-5 ml-1 bg-[#F5FF3A] animate-pulse rounded-sm"></span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </section >

                {/* ── Bottom Input Area ── */}
                < footer className="shrink-0 border-t border-[#1C1C1E] px-4 py-5 sm:px-8 lg:px-12 bg-gradient-to-t from-[#0A0A0A] to-[#0A0A0A]/95" >
                    <div className="mx-auto max-w-[800px] flex flex-col gap-3">

                        {/* Quick Prompt Pills */}
                        <div className="flex flex-wrap gap-2">
                            {quickPrompts.map((prompt) => (
                                <button
                                    key={prompt}
                                    type="button"
                                    onClick={() => setDraft(prompt)}
                                    className="bg-linear-to-r from-[#F5FF3A] to-[#ABD600] text-black border border-[#F59E0B]/20 px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wide transition-colors duration-200"
                                >
                                    {prompt}
                                </button>
                            ))}
                        </div>

                        {/* Input Form */}
                        <form onSubmit={handleSend} className="relative">
                            <div className="bg-[#0F0F0F] border border-[#1C1C1E] focus-within:border-[#F59E0B]/40 rounded-2xl p-2 flex items-center gap-2 transition-colors duration-300">
                                <input
                                    value={draft}
                                    onChange={(event) => setDraft(event.target.value)}
                                    placeholder="Ask anything..."
                                    className="flex-1 border-none bg-transparent px-4 py-3 text-sm text-white outline-none placeholder:text-[#71717A] caret-[#F59E0B]"
                                />
                                <button
                                    type="submit"
                                    className="bg-linear-to-r from-[#F5FF3A] to-[#ABD600] p-3 rounded-xl text-black transition-all duration-300 hover:shadow-[0_0_15px_rgba(171,214,0,0.4)] active:scale-95 shrink-0"
                                    aria-label="Send message"
                                >
                                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M5 12h14" strokeLinecap="round" />
                                        <path d="m12 5 7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                            </div>
                        </form>
                    </div>
                </footer >
            </main >

            {/* ── Delete Confirmation Modal ── */}
            {
                showDeleteConfirm && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
                        <div className="w-full max-w-md bg-[#141414] border border-[#1C1C1E] rounded-2xl p-6 shadow-[0_0_40px_rgba(245,158,11,0.08)]">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 rounded-xl bg-[#F59E0B]/10 flex items-center justify-center">
                                    <svg viewBox="0 0 20 20" className="h-5 w-5 text-[#F59E0B]" fill="currentColor">
                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <p className="text-lg font-semibold text-white">Delete this chat?</p>
                            </div>
                            <p className="mt-2 text-sm leading-6 text-[#A1A1AA] ml-[52px]">
                                This conversation will be removed from your list. This action cannot be undone.
                            </p>
                            <div className="mt-6 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={closeDeleteConfirm}
                                    className="rounded-xl border border-[#27272A] bg-transparent px-5 py-2.5 text-sm font-medium text-white transition-colors duration-200 hover:border-[#F59E0B]/40 hover:text-[#FBBF24]"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={confirmDelete}
                                    className="rounded-xl bg-linear-to-r from-[#F5FF3A] to-[#ABD600] px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:shadow-[0_0_15px_rgba(171,214,0,0.4)]"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default Dashboard;
