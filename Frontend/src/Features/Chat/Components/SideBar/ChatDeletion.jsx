import React from 'react'

const ChatDeletion = ({ showDeleteConfirm, closeDeleteConfirm, confirmDelete }) => {


    return (
        <>
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
        </>
    )
}

export default ChatDeletion
