import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux';
import Markdown from 'react-markdown';
import useChat from '../../Hooks/useChat';


const ChatSection = ({ finishAnimationHandler, displayedText, setDisplayedText }) => {
    const messagesContainerRef = useRef(null);
    const { chatMessages, currentChat, AIResChunks, isStreaming } = useSelector((state) => state.chat);


    useEffect(() => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    }, [chatMessages, currentChat?.id]);


    // Typing animation effect for AI response - only while streaming
    useEffect(() => {
        if (!isStreaming) {
            setDisplayedText("");
            return;
        }

        if (AIResChunks.content.length > displayedText.length) {
            const timer = setTimeout(() => {
                setDisplayedText(AIResChunks.content.substring(0, displayedText.length + 1));
            }, 0.010); // Adjust speed here (lower = faster)
            return () => clearTimeout(timer);
        } else if (AIResChunks.content.length > 0 && displayedText.length === AIResChunks.content.length && isStreaming) {
            // Animation complete - finish streaming and move to chatMessages
            finishAnimationHandler();
        }
    }, [displayedText, AIResChunks.content, isStreaming, finishAnimationHandler]);

    return (
        <>
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
        </>
    )
}

export default ChatSection
