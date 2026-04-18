import React from 'react';

const LoadingBar = ({ onComplete }) => {
    const [progress, setProgress] = React.useState(0);

    React.useEffect(() => {
        const timer = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(timer);
                    setTimeout(onComplete, 500); 
                    return 100;
                }
                return prev + 5; 
            });
        }, 100);

        return () => clearInterval(timer);
    }, [onComplete]);

    return (
        <div className="w-full space-y-4 animate-pulse">
            <div className="flex justify-between text-[10px] text-[#ffcc00]">
                <span>SYSTEM_SCANNING...</span>
                <span>{progress}%</span>
            </div>
            <div className="w-full h-8 bg-[#111] border-4 border-[#444] p-1">
                <div
                    className="h-full bg-[#3e802a] transition-all duration-100 ease-out"
                    style={{ width: `${progress}%` }}
                />
            </div>
            <p className="text-[8px] text-[#888] animate-bounce">INITIALIZING GPU HEURISTICS...</p>
        </div>
    );
};

export default LoadingBar;