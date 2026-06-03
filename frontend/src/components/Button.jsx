import React from "react";
import { Link } from "react-router-dom";

export default function Button({
    children,
    to,
    href,
    variant = "green",
    className = ""
}) {
    const baseStyles = "border-4 border-black text-[10px] sm:text-xs font-bold active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all transform flex items-center gap-3 justify-center";

    const variants = {
        green: "bg-[#3e802a] text-white px-5 py-3 shadow-[inset_-4px_-4px_#2a5a1c,inset_4px_4px_#56ab3a] hover:bg-[#469130]",
        greenLarge: "bg-[#3e802a] text-white px-6 py-4 shadow-[inset_-4px_-4px_#2a5a1c,inset_4px_4px_#56ab3a] hover:bg-[#469130]",
        gray: "bg-[#555] text-white px-6 py-4 shadow-[inset_-4px_-4px_#333,inset_4px_4px_#777] hover:bg-[#666]"
    };

    const combinedStyles = `${baseStyles} ${variants[variant]} ${className}`;

    if (to) {
        return (
            <Link to={to} className={combinedStyles}>
                {children}
            </Link>
        );
    }

    if (href) {
        return (
            <a href={href} className={combinedStyles}>
                {children}
            </a>
        );
    }

    return (
        <button className={combinedStyles}>
            {children}
        </button>
    );
}