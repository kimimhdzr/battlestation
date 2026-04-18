import React, { useState, useRef } from 'react';
import { Upload, Scan, RotateCcw, FolderOpen } from 'lucide-react';
import ErrorModal from './ErrorModal';

const BattlestationRater = () => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [result, setResult] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

    // Handle file selection
    const handleFile = (selectedFile) => {
        if (selectedFile && selectedFile.type.startsWith('image/')) {
            setFile(selectedFile);
            const reader = new FileReader();
            reader.onload = () => setPreview(reader.result);
            reader.readAsDataURL(selectedFile);
        }
    };

    const onDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        handleFile(e.dataTransfer.files[0]);
    };


    const handleScan = async (e) => {
        e.preventDefault();
        if (!file) return;

        // 1. Prepare the data
        const formData = new FormData();
        formData.append('image', file); // 'image' is the key Python will look for

        try {
            // 2. Send request to Python server
            // Replace 5000 with 8000 if your friend is using FastAPI
            const response = await fetch('http://localhost:5000/scan', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) throw new Error('Backend error');

            const data = await response.json();

            // 3. Update the UI with real data from Python
            setResult({
                score: data.score,
                status: data.status,
                image: preview // Keeps the local preview for speed
            });
        } catch (error) {
            console.error("Connection failed:", error);
            setError(`CRITICAL ERROR:\nSCANNER OFFLINE.\nCHECK PYTHON BACKEND.`);
        }
    };


    const reset = () => {
        setFile(null);
        setPreview(null);
        setResult(null);
    };

    return (
        <div className="min-h-screen bg-[#1a1a1a] text-[#eee] font-mono p-10 flex flex-col items-center">

            {/* Google Font link would usually go in your index.html or layout */}
            <style>{`@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');`}</style>

            {/* The External Modal */}
            <ErrorModal
                message={error}
                onClose={() => setError(null)}
            />

            <div className="w-full max-w-5xl bg-[#222] border-[6px] border-[#444] outline outline-[6px] outline-black p-8 shadow-[0_20px_0_rgba(0,0,0,0.4)] font-['Press_Start_2P']">

                <h1 className="text-xl md:text-2xl text-[#ffcc00] mb-6 drop-shadow-[3px_3px_0_#000] text-center">
                    BATTLESTATION RATER
                </h1>

                <hr className="border-2 border-[#444] mb-8" />

                <div className="flex flex-col lg:flex-row gap-8 justify-center items-start">

                    {/* Left Side: Form */}
                    <div className="w-full lg:max-w-xs space-y-4">
                        <form onSubmit={handleScan}>
                            <div
                                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                onDragLeave={() => setIsDragging(false)}
                                onDrop={onDrop}
                                onClick={() => fileInputRef.current.click()}
                                className={`relative cursor-pointer transition-colors duration-200 p-6 border-4 border-dashed flex flex-col items-center justify-center text-center 
                                    ${isDragging ? 'bg-[#444] border-[#3e802a]' : 'bg-[#333] border-[#555]'}`}
                            >
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={(e) => handleFile(e.target.files[0])}
                                    className="hidden"
                                    accept="image/*"
                                />

                                {!preview ? (
                                    <div className="space-y-4">
                                        <p className="text-[10px] leading-loose text-[#888]">DRAG IMAGE HERE<br />— OR —</p>
                                        <div className="bg-[#555] text-white py-3 px-4 border-4 border-black shadow-[inset_-4px_-4px_#333,inset_4px_4px_#777] text-[10px] flex items-center gap-2">
                                            <FolderOpen size={14} /> BROWSE FILES
                                        </div>
                                    </div>
                                ) : (
                                    <div className="w-full">
                                        <img src={preview} alt="Preview" className="max-h-48 mx-auto" />
                                        <p className="text-[8px] mt-3 text-[#888]">READY TO SCAN</p>
                                    </div>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={!file}
                                className="w-full mt-4 bg-[#3e802a] text-white p-4 border-4 border-black shadow-[inset_-4px_-4px_#2a5a1c,inset_4px_4px_#56ab3a] active:translate-y-1 active:shadow-none transition-transform disabled:opacity-50 disabled:cursor-not-allowed text-[11px] flex items-center justify-center gap-2"
                            >
                                <Scan size={16} /> SCAN SETUP
                            </button>
                        </form>
                    </div>

                    {/* Right Side: Result */}
                    {result && (
                        <div className="w-full lg:flex-1 bg-[#111] border-4 border-dashed border-[#ffcc00] p-6 animate-in fade-in slide-in-from-bottom-4">
                            <span className="text-[10px] text-[#888]">ANALYSIS COMPLETE:</span>
                            <h2 className="text-2xl text-[#00ff00] my-3">SCORE: {result.score}/100</h2>
                            <p className="text-[#ff0055] text-[10px] leading-relaxed mb-4">STATUS: {result.status}</p>

                            <div className="w-full bg-[#111] mb-6">
                                <img
                                    src={result.image}
                                    alt="Scanned"
                                    className="w-full h-auto object-contain image-pixelated border-4 border-[#222]"
                                // style={{ imageRendering: 'pixelated' }}
                                />
                            </div>

                            <button
                                onClick={reset}
                                className="bg-[#ff0055] text-white py-3 px-6 border-4 border-black shadow-[inset_-4px_-4px_#aa0033,inset_4px_4px_#ff3366] active:translate-y-1 active:shadow-none text-[11px] flex items-center gap-2"
                            >
                                <RotateCcw size={14} /> RESET
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BattlestationRater;