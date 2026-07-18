import React from 'react'

const ChatHeader = ({ currentChat, setSidebarOpenHandler }) => {
    return (
        <>
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
        </>
    )
}

export default ChatHeader
