import React, { useState } from "react";
import Button from "./Button";
import { Menu, X } from "lucide-react"; 

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);

    const navLinks = [
        { label: "features", href: "#features" },
        { label: "demo", href: "#demo" },
        { label: "how it works", href: "#how-it-works" },
        { label: "github", href: "https://github.com/kimimhdzr/battlestation.git", external: true },
    ];

    return (
        <header className="bg-[#222] border-b-[6px] border-[#444] outline outline-[4px] outline-black sticky top-0 z-50 font-['Press_Start_2P',monospace]">
            <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                
                {/* Logo / Brand (Stays on the far left) */}
                <h1 className="text-[#ffcc00] text-[10px] sm:text-xs tracking-wider drop-shadow-[2px_2px_0_#000] shrink-0">
                    BATTLESTATION RATER
                </h1>

                {/* Desktop Navigation Links (Pushed to the right using ml-auto) */}
                <nav className="hidden lg:block ml-auto mr-8">
                    <ul className="flex items-center gap-6 list-none m-0 p-0">
                        {navLinks.map((link, index) => (
                            <li key={index}>
                                <a 
                                    href={link.href} 
                                    target={link.external ? "_blank" : "_self"}
                                    rel={link.external ? "noopener noreferrer" : ""}
                                    className="text-[#aaa] hover:text-[#00ff00] text-[9px] sm:text-[10px] tracking-widest transition-colors duration-150 uppercase relative group py-2 block"
                                >
                                    <span className="absolute -left-3 opacity-0 group-hover:opacity-100 transition-opacity text-[#00ff00]">
                                        &gt;
                                    </span>
                                    {link.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Right Actions Block (START Button & Mobile Hamburger) */}
                <div className="flex items-center gap-4 shrink-0">
                    <div className="hidden sm:block">
                        <Button to="/rater" variant="green">
                            START
                        </Button>
                    </div>

                    {/* Mobile Hamburger Trigger Button */}
                    <button
                        type="button"
                        onClick={toggleMenu}
                        className="lg:hidden p-2 bg-[#333] border-4 border-black text-[#ffcc00] hover:text-[#00ff00] active:translate-x-[1px] active:translate-y-[1px] transition-all"
                        aria-label="Toggle Menu"
                    >
                        {isOpen ? <X size={16} /> : <Menu size={16} />}
                    </button>
                </div>
            </div>

            {/* Mobile Dropdown Panel Drawer */}
            {isOpen && (
                <div className="lg:hidden bg-[#1a1a1a] border-b-[6px] border-[#444] outline outline-[4px] outline-black p-6 animate-in fade-in slide-in-from-top-4 duration-200">
                    <nav>
                        <ul className="flex flex-col gap-6 list-none m-0 p-0">
                            {navLinks.map((link, index) => (
                                <li key={index}>
                                    <a 
                                        href={link.href}
                                        target={link.external ? "_blank" : "_self"}
                                        rel={link.external ? "noopener noreferrer" : ""}
                                        onClick={() => setIsOpen(false)} 
                                        className="text-[#aaa] hover:text-[#00ff00] text-[10px] tracking-widest block uppercase transition-colors"
                                    >
                                        <span className="text-[#00ff00] mr-2">&gt;</span>
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                            
                            <li className="pt-2 sm:hidden">
                                <Button to="/rater" variant="green" className="w-full">
                                    START SCANNING
                                </Button>
                            </li>
                        </ul>
                    </nav>
                </div>
            )}
        </header>
    );
}