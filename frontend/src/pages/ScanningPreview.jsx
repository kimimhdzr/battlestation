import React, { useState, useEffect } from "react";
import battlestationImage from '../assets/battlestation.jpeg';

const DETECTIONS_MOCK = [
    { class: "monitor (main_top)", confidence: "99%", top: "9%", left: "37%", width: "25%", height: "22%", color: "#00ff00" },
    { class: "monitor (left)", confidence: "98%", top: "31%", left: "28%", width: "14%", height: "13%", color: "#00ff00" },
    { class: "monitor (center)", confidence: "99%", top: "31%", left: "42%", width: "14%", height: "12%", color: "#00ff00" },
    { class: "monitor (right)", confidence: "97%", top: "31%", left: "56%", width: "15%", height: "13%", color: "#00ff00" },
    { class: "audio_monitor (L)", confidence: "96%", top: "35%", left: "18%", width: "9%", height: "13%", color: "#38bdf8" },
    { class: "audio_monitor (R)", confidence: "95%", top: "33%", left: "72%", width: "7%", height: "11%", color: "#38bdf8" },
    { class: "ergonomic_chair", confidence: "99%", top: "46%", left: "38%", width: "21%", height: "46%", color: "#a855f7" },
    { class: "server_rack (L)", confidence: "98%", top: "62%", left: "7%", width: "23%", height: "37%", color: "#f43f5e" },
    { class: "server_rack (R)", confidence: "99%", top: "58%", left: "76%", width: "22%", height: "35%", color: "#f43f5e" },
];

export default function ScanningPreview() {
    const [visibleBoxes, setVisibleBoxes] = useState([]);
    const [displayedScore, setDisplayedScore] = useState(0);
    const targetScore = 100; // Max tier unlocked

    // 1. Core Detection Scanning Loop
    useEffect(() => {
        const interval = setInterval(() => {
            setVisibleBoxes((prev) => {
                if (prev.length >= DETECTIONS_MOCK.length) {
                    return [];
                }
                return [...prev, DETECTIONS_MOCK[prev.length]];
            });
        }, 400);

        return () => clearInterval(interval);
    }, []);

    // 2. Arcade Rolling Slot Machine Score Effect
    useEffect(() => {
        if (visibleBoxes.length === 0) {
            setDisplayedScore(0);
            let current = 0;

            const rollTimer = setInterval(() => {
                current += 4; // Step faster to scale up to 100 cleanly
                if (current >= targetScore) {
                    setDisplayedScore(targetScore);
                    clearInterval(rollTimer);
                } else {
                    setDisplayedScore(current);
                }
            }, 25);

            return () => clearInterval(rollTimer);
        }
    }, [visibleBoxes.length]);

    return (
        <div className="w-full max-w-4xl mx-auto bg-[#111] border-4 border-dashed border-[#ffcc00] p-6 relative font-['Press_Start_2P',monospace]">

            <style>{`
                @keyframes laserMove {
                  0% { top: 0%; opacity: 0.8; }
                  50% { opacity: 1; }
                  100% { top: 100%; opacity: 0.3; }
                }
                @keyframes textGlitch {
                  0%, 100% { transform: translate(0); text-shadow: none; }
                  50% { transform: translate(-1px, 1px); text-shadow: -1px 0 #ff0055, 1px 0 #00ff00; }
                }
            `}</style>

            {/* Header Panel */}
            <div className="flex justify-between items-center mb-4 text-[10px] text-[#00ff00]">
                <span className="animate-pulse animate-[textGlitch_1s_infinite]">
                    &gt; LIVE_YOLO_STREAM.EXE
                </span>
                <span className="text-[#ffcc00]">NICE SETUP DETECTED</span>
            </div>

            {/* Live Score Dashboard */}
            <div className="mb-6 p-4 bg-black border-4 border-[#222] flex flex-col sm:flex-row justify-between items-center gap-4">
                <div>
                    <span className="text-[9px] text-[#888] block mb-1">ANALYSIS METRIC:</span>
                    <div className="text-[#ff0055] text-[10px] uppercase">
                        STATUS: Found {visibleBoxes.length} elements.
                    </div>
                </div>

                <div className="text-center sm:text-right">
                    <span className="text-[9px] text-[#888] block mb-1">LIVE BATTLE SCORE:</span>
                    <div className={`text-2xl sm:text-3xl font-bold tracking-wider transition-all duration-300 ${displayedScore === targetScore ? 'text-[#00ff00]' : 'text-yellow-400'}`}>
                        {String(displayedScore).padStart(2, '0')}/100
                    </div>
                </div>
            </div>

            {/* Image and Scanning Canvas Container */}
            <div className="relative w-full overflow-hidden border-4 border-[#222] bg-black">
                <img
                    src={battlestationImage}
                    alt="Battlestation Target"
                    className="w-full h-auto block object-contain opacity-80 mix-blend-screen [image-rendering:pixelated]"
                />

                <div className="absolute left-0 right-0 h-1 bg-[#00ff00] shadow-[0_0_15px_#00ff00,0_0_30px_#00ff00] pointer-events-none z-20 animate-[laserMove_3s_linear_infinite]" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00ff00]/5 to-transparent pointer-events-none mix-blend-color-dodge" />

                {/* Detections Mapping */}
                {visibleBoxes.map((det, idx) => (
                    <div
                        key={idx}
                        className="absolute border-2 font-bold pointer-events-none transition-all duration-150 ease-out"
                        style={{
                            top: det.top,
                            left: det.left,
                            width: det.width,
                            height: det.height,
                            borderColor: det.color,
                            backgroundColor: `${det.color}15`,
                            boxShadow: `0 0 8px ${det.color}`,
                        }}
                    >
                        <span
                            className="absolute -top-[16px] left-[-2px] text-black text-[7px] px-1 py-0.5 whitespace-nowrap uppercase tracking-tighter"
                            style={{ backgroundColor: det.color }}
                        >
                            {det.class} {det.confidence}
                        </span>

                        <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2" style={{ borderColor: det.color }} />
                        <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2" style={{ borderColor: det.color }} />
                        <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2" style={{ borderColor: det.color }} />
                        <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2" style={{ borderColor: det.color }} />
                    </div>
                ))}
            </div>

            {/* Real-time Status Footer */}
            <div className="mt-4 flex justify-between items-center text-[9px] text-[#888]">
                <span>OBJECTS RENDERED: {visibleBoxes.length} / {DETECTIONS_MOCK.length}</span>
                <span className="text-[#00ff00] animate-pulse">[PERFECT RIG ENCOUNTERED]</span>
            </div>
        </div>
    );
}