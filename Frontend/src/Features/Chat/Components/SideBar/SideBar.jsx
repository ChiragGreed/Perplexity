import { useSelector } from "react-redux";
import useChat from "../../Hooks/useChat";



const SideBar = ({ startNewChatHandler, setSidebarOpenHandler, setActiveChatHandler, getMessagesHandler, setDisplayedText, openDeleteConfirm }) => {
    const { chats, currentChat, sidebarOpen } = useSelector((state) => state.chat);

    return <>


        {/* ── Mobile Sidebar Overlay ── */}
        {sidebarOpen && (
            <div
                className="fixed inset-0 z-40 bg-black/60 lg:hidden"
                onClick={() => setSidebarOpenHandler(false)}
            />
        )}

        <aside
            className={`fixed lg:relative z-50 h-full w-[280px] bg-[#111111] border-r border-[#1C1C1E] flex flex-col transition-transform duration-300 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
                }`}
        >
            {/* Brand */}
            <div className="flex items-center gap-3 px-6 pt-6 pb-4">
                <img className="h-10 w-10" src="/images/AppLogo.png" alt="AskBase logo" />
                <div>
                    <p className="text-lg font-semibold tracking-tight text-white">AskBase</p>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#71717A]">AI Assistant</p>
                </div>
            </div>

            {/* New Chat Button */}
            <div className="px-5 pt-2 pb-4">
                <button
                    type="button"
                    onClick={() => {
                        startNewChatHandler();
                        setDisplayedText("");
                        setSidebarOpenHandler(false);
                    }}
                    className="w-full bg-linear-to-r from-[#F5FF3A] to-[#ABD600] text-black rounded-xl px-4 py-3 text-md font-semibold flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-[0_0_20px_rgba(171,214,0,0.3)] active:scale-[0.98]"
                >
                    <svg viewBox="0 0 20 20" className="h-4.5 w-4.5" fill="currentColor">
                        <path d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" />
                    </svg>
                    New Chat
                </button>
            </div>

            {/* Section Label */}
            <div className="px-6 pt-2 pb-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#71717A]">Recent chats</p>
            </div>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto px-3 space-y-1 scrollbar-none [&::-webkit-scrollbar]:hidden">
                {chats.slice().reverse().map((chat, idx) => {
                    const isActive = currentChat?.id === chat.id;

                    return (
                        <div className="group relative flex items-center" key={chat.id ?? `chat-${idx}`}>
                            <button
                                onClick={() => {
                                    setActiveChatHandler(chat.id);
                                    getMessagesHandler(chat.id);
                                    setSidebarOpenHandler(false);
                                }}
                                className={`w-full flex items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors duration-200 ${isActive
                                    ? "bg-[#1C1B1B] border-l-2 border-[#F59E0B] text-white"
                                    : "border-l-2 border-transparent text-[#A1A1AA] hover:bg-[#1C1B1B] hover:text-white"
                                    }`}
                            >
                                <svg viewBox="0 0 20 20" className={`h-4 w-4 shrink-0 ${isActive ? "text-[#F59E0B]" : "text-[#534434]"}`} fill="currentColor">
                                    <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zm-5 0H8v2h2V9z" clipRule="evenodd" />
                                </svg>
                                <span className={`truncate text-sm font-medium ${isActive ? "text-white" : ""}`}>{chat.title}</span>
                            </button>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    openDeleteConfirm(chat.id);
                                }}
                                className="absolute right-2 opacity-0 group-hover:opacity-100 text-[#71717A] hover:text-[#ffb4ab] transition-all duration-200 p-1 rounded-md"
                                aria-label={`Delete ${chat.title}`}
                            >
                                <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor">
                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    );
                })}
            </div>
        </aside>
    </>
}

export default SideBar