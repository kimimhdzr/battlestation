import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const ErrorModal = ({ message, onClose }) => {
    if (!message) return null;

    return (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 select-none animate-[fadeIn_0.2s_ease-out]">
            
            {/* Inline style for precise theme animation synchronization */}
            <style>{`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes boxGlitch { 
                    0%, 100% { border-color: #ff0055; } 
                    50% { border-color: #ffcc00; } 
                }
            `}</style>

            {/* Main Container - Cyberpunk Terminal Box */}
            <div className="w-full max-w-md bg-[#222] border-[6px] border-[#ff0055] outline outline-[6px] outline-black p-0 shadow-[0_15px_0_rgba(0,0,0,0.6)] animate-[boxGlitch_2s_infinite]">
                
                {/* Header Title Bar */}
                <div className="bg-black border-b-4 border-[#444] text-[#ffcc00] flex justify-between items-center p-3">
                    <span className="text-[9px] sm:text-[10px] flex items-center gap-2 font-['Press_Start_2P',monospace] tracking-wider animate-pulse">
                        <AlertTriangle size={14} className="text-[#ffcc00]" /> 
                        [ SYSTEM_CRITICAL ]
                    </span>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-[#666] hover:text-[#ff0055] transition-colors focus:outline-none"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 text-center space-y-6 bg-[#1a1a1a]">
                    {/* Error Content */}
                    <p className="text-[10px] sm:text-xs leading-loose font-['Press_Start_2P',monospace] text-[#eee] whitespace-pre-line text-left bg-black p-4 border-2 border-dashed border-[#444]">
                        <span className="text-[#ff0055] block mb-2 font-bold">&gt; ERROR_LOG:</span>
                        {message}
                    </p>
                    
                    {/* Retro Action Button */}
                    <button
                        type="button"
                        onClick={onClose}
                        className="bg-[#ff0055] text-white py-3 px-6 border-4 border-black shadow-[inset_-4px_-4px_#aa0033,inset_4px_4px_#ff3366] text-[10px] font-['Press_Start_2P',monospace] font-bold hover:bg-[#ff1a66] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all transform tracking-widest"
                    >
                        TERMINATE
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ErrorModal;