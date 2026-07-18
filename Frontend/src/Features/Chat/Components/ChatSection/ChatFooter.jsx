import React, { useState } from 'react'

const ChatFooter = ({ setDisplayedText, sendQueryHandler ,currentChat}) => {
    const quickPrompts = ["Summarize this thread", "Draft a launch email", "Suggest next steps"];
    const [draft, setDraft] = useState("");

    const handleSend = async (event) => {
        event.preventDefault();
        const trimmed = draft.trim();
        if (!trimmed) return;

        setDisplayedText(""); // Reset animation for new response
        await sendQueryHandler(trimmed, currentChat?.id);

        setDraft("");
    };

    return (
        <>
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
        </>
    )
}

export default ChatFooter
