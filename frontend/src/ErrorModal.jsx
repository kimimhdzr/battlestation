import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const ErrorModal = ({ message, onClose }) => {
    if (!message) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="w-full max-w-md bg-[#bcbcbc] border-[4px] border-white outline outline-[4px] outline-black p-1 shadow-[8px_8px_0_rgba(0,0,0,0.5)]">

                <div className="bg-[#000080] text-white flex justify-between items-center p-2 mb-4">
                    <span className="text-[10px] flex items-center gap-2 font-['Press_Start_2P']">
                        <AlertTriangle size={12} /> SYSTEM ALERT
                    </span>
                    <button
                        onClick={onClose}
                        className="bg-[#bcbcbc] border-2 border-white text-black px-1 hover:bg-red-500 transition-colors"
                    >
                        <X size={14} />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-4 text-black text-center space-y-6">
                    <p className="text-[10px] leading-relaxed font-['Press_Start_2P']">
                        {message}
                    </p>
                    <button
                        onClick={onClose}
                        className="bg-[#bcbcbc] text-black py-2 px-6 border-[3px] border-t-white border-l-white border-b-[#808080] border-r-[#808080] active:border-none active:translate-y-[2px] font-['Press_Start_2P'] text-[10px]"
                    >
                        OK
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ErrorModal;