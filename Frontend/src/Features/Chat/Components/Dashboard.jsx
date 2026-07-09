import { useEffect, useRef, useState } from "react";
import useChat from "../Hooks/useChat";
import { useSelector } from "react-redux";
import Markdown from 'react-markdown'


const quickPrompts = ["Summarize this thread", "Draft a launch email", "Suggest next steps"];

const Dashboard = () => {
    const { socketConnectionHandler, startNewChatHandler, sendQueryHandler, getChatsHandler, setActiveChatHandler, getMessagesHandler, deleteChatHandler } = useChat();
    const { chats, currentChat, chatMessages } = useSelector((state) => state.chat);

    const [draft, setDraft] = useState("");
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteTargetId, setDeleteTargetId] = useState(null);
    const messagesContainerRef = useRef(null);

    useEffect(() => {
        const services = socketConnectionHandler();
        if (typeof services === "function") {
            services();
        }
    }, []);

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
        <div className="min-h-screen bg-[#0A0A0A] px-3 text-white sm:px-4 sm:py-4 lg:px-6">
            <div className="mx-auto flex h-[calc(100dvh-1.5rem)] max-w-full min-h-0 flex-col overflow-hidden rounded-[28px] border border-[#3c3c3c] bg-[#111111] shadow-[0_0_40px_rgba(0,0,0,0.35)]">
                <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
                    <aside className="w-full border-b border-[#232323] bg-[#0f0f0f]/90 p-4 lg:w-[320px] lg:border-b-0 lg:border-r lg:p-5">
                        <div className="flex items-center gap-2.5">
                            <img className="h-10 w-10" src="../../../../public/images/AppLogo.png" alt="AskBase logo" />
                            <div>
                                <p className="text-lg font-semibold tracking-tight text-white">AskBase</p>
                                <p className="text-xs uppercase tracking-[0.25em] text-[#888887]">AI workspace</p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => startNewChatHandler()}
                            className="mt-5 w-full rounded-xl border border-[#F5FF3A]/40 bg-[#F5FF3A] px-4 py-3 text-sm font-semibold text-[#0A0A0A] transition hover:brightness-110"
                        >
                            + New chat
                        </button>

                        <div className="mt-6 flex items-center justify-between">
                            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#888887]">Recent chats</p>
                            <button className="text-xs text-[#F5FF3A] transition hover:text-[#ABD600]">View all</button>
                        </div>

                        <div className="mt-5 w-[90%] space-y-4">
                            {chats.map((chat) => {
                                const isActive = currentChat?.id === chat.id;

                                return (
                                    <div className="flex relative items-center justify-between gap-4"
                                        key={chat.id}>
                                        <button
                                            onClick={() => {
                                                setActiveChatHandler(chat.id);
                                                getMessagesHandler(chat.id);
                                            }}
                                            className={`w-full rounded-2xl border px-3 py-3 text-left transition ${isActive ? "border-[#F5FF3A]/40 bg-[#F5FF3A] text-[#0A0A0A]" : "border-transparent bg-[#151515] text-white hover:border-[#3c3c3c]"}`}
                                        >
                                            <div className="flex items-center justify-between gap-3">
                                                <p className={`truncate text-sm font-semibold ${isActive ? "text-[#0A0A0A]" : "text-white"}`}>{chat.title}</p>
                                                {chat.unread && <span className="h-2.5 w-2.5 rounded-full bg-[#F5FF3A]" />}
                                            </div>
                                            <p className={`mt-1 truncate text-xs ${isActive ? "text-[#0A0A0A]/80" : "text-[#888887]"}`}>{chat.preview}</p>
                                            <p className={`mt-2 text-[11px] uppercase tracking-[0.2em] ${isActive ? "text-[#0A0A0A]/70" : "text-[#6b7280]"}`}>{chat.time}</p>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => openDeleteConfirm(chat.id)}
                                            className="absolute -right-10 text-[#888887] transition hover:text-[#F5FF3A]"
                                            aria-label={`Delete ${chat.title}`}
                                        >
                                            <i className="ri-more-line"></i>
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </aside>

                    <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
                        <header className="flex items-center justify-between border-b border-[#232323] px-4 py-4 sm:px-6">
                            <div>
                                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#888887]">Active conversation</p>
                                <h2 className="mt-1 text-xl font-semibold text-white">{currentChat?.title}</h2>
                            </div>
                            <div className="rounded-full border border-[#3c3c3c] bg-[#151515] px-3 py-1.5 text-xs uppercase tracking-[0.25em] text-[#F5FF3A]">
                                Live draft
                            </div>
                        </header>

                        <section ref={messagesContainerRef} className="flex-1 min-h-0 overflow-y-auto scrollbar-none px-4 py-4 sm:px-6 sm:py-6">
                            <div className="mx-auto flex max-w-full flex-col gap-10">
                                {chatMessages.map((message, idx) => (
                                    < div
                                        key={idx}
                                        className={`flex ${message.role === "human" ? "justify-end" : "justify-start"}`}
                                    >
                                        <div
                                            className={`max-w-[85%] rounded-2xl border px-4 py-3 text-md leading-8 shadow-sm ${message.role === "human"
                                                ? "border-[#F5FF3A]/30 bg-[#F5FF3A] text-[#0A0A0A]"
                                                : "border-[#3c3c3c] bg-[#161616] text-[#f5f5f5]"
                                                }`}
                                        >
                                            {message.role == 'ai' ?
                                                <Markdown>{message.content}</Markdown>
                                                :
                                                <p>{message.content}</p>
                                            }
                                            <p className={`mt-2 text-[13px] uppercase tracking-[0.2em] ${message.role === "human" ? "text-[#0A0A0A]/70" : "text-[#888887]"}`}>
                                                {message.time}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <footer className="border-t border-[#232323] px-4 py-4 sm:px-6 sm:py-5">
                            <div className="mx-auto flex max-w-3xl flex-col gap-3">
                                <div className="flex flex-wrap gap-2">
                                    {quickPrompts.map((prompt) => (
                                        <button
                                            key={prompt}
                                            type="button"
                                            onClick={() => setDraft(prompt)}
                                            className="rounded-full border border-[#3c3c3c] bg-[#161616] px-3 py-1.5 text-sm text-[#C8C6C5] transition hover:border-[#F5FF3A]/40 hover:text-[#F5FF3A]"
                                        >
                                            {prompt}
                                        </button>
                                    ))}
                                </div>

                                <form onSubmit={handleSend} className="rounded-2xl border border-[#3c3c3c] bg-[#161616] p-2">
                                    <div className="flex items-center gap-2">
                                        <input
                                            value={draft}
                                            onChange={(event) => setDraft(event.target.value)}
                                            placeholder="Ask anything..."
                                            className="flex-1 border-none bg-transparent px-3 py-3 text-sm text-white outline-none placeholder:text-[#888887]"
                                        />
                                        <button
                                            type="submit"
                                            className="rounded-xl bg-[#F5FF3A] p-3 text-[#0A0A0A] transition hover:brightness-110"
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
                        </footer>
                    </main>
                </div>
            </div >
            {showDeleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
                    <div className="w-full max-w-md rounded-3xl border border-[#3c3c3c] bg-[#111111] p-6 shadow-[0_0_40px_rgba(0,0,0,0.35)]">
                        <p className="text-lg font-semibold text-white">Delete this chat?</p>
                        <p className="mt-2 text-sm leading-6 text-[#888887]">
                            This conversation will be removed from your list. This action cannot be undone.
                        </p>
                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={closeDeleteConfirm}
                                className="rounded-xl border border-[#3c3c3c] bg-[#161616] px-4 py-2 text-sm text-white transition hover:border-[#F5FF3A]/40"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={confirmDelete}
                                className="rounded-xl bg-[#F5FF3A] px-4 py-2 text-sm font-semibold text-[#0A0A0A] transition hover:brightness-110"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div >
    );
};

export default Dashboard;
