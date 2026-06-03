import React from "react";

export default function Footer() {
    return (
        <footer className="mt-16 bg-black border-t-4 border-[#444]">
            <div className="max-w-6xl mx-auto px-6 py-10 text-center">
                <div className="text-[#ffcc00] text-[10px] mb-4 tracking-widest">
                    BATTLESTATION RATER
                </div>
                <p className="text-[#666] text-[9px] tracking-wide">
                    &copy; 2024 BattleStation Rater. All rights reserved. <br/>Developed by Group 1 OCC 1 WIF3009 Python for Scientific Computing Session 2025/2026, Universiti Malaya.
                </p>
            </div>
        </footer>
    );
}
