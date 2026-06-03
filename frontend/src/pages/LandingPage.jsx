import React from "react";
import { ArrowRight, Eye, Cpu, Trophy, ScanSearch, Bot } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Button from "../components/Button";
import ScanningPreview from "./ScanningPreview"; // Importing your animated loop scanner

export default function LandingPage() {
  return (
    <div
      className="
        min-h-screen bg-[#1a1a1a] text-[#eee] font-['Press_Start_2P',monospace] overflow-x-hidden antialiased select-none relative
        [image-rendering:pixelated]
        animate-[flicker_0.15s_infinite]
        scroll-smooth
        
        /* Webkit Scrollbar Styling via Tailwind Arbitrary Variants */
        [&::-webkit-scrollbar]:w-3
        [&::-webkit-scrollbar-track]:bg-[#222]
        [&::-webkit-scrollbar-thumb]:bg-[#ffcc00]
        [&::-webkit-scrollbar-thumb]:border-2
        [&::-webkit-scrollbar-thumb]:border-black
        hover:[&::-webkit-scrollbar-thumb]:bg-[#ffe066]

        /* CRT Scanline Overlay Effect */
        before:content-[''] before:fixed before:inset-0 before:pointer-events-none before:z-[9999] before:opacity-25
        before:bg-[repeating-linear-gradient(to_bottom,rgba(255,255,255,0.03)_0px,rgba(255,255,255,0.03)_1px,transparent_2px,transparent_4px)]
      "
    >
      {/* Injecting keyframe animations natively via inline <style> */}
      <style>{`
        @keyframes flicker { 0% { opacity: 0.97; } 50% { opacity: 1; } 100% { opacity: 0.98; } }
        @keyframes gridMove { to { background-position: 76px 76px; } }
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
      `}</style>

      {/* Cyberpunk Animated Grid & Noise Background Layer */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-40">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,204,0,0.13)_1px,transparent_1px),linear-gradient(90deg,rgba(255,204,0,0.13)_1px,transparent_1px)] bg-[size:76px_76px] [mask-image:radial-gradient(circle_at_50%_25%,#000_0_35%,transparent_72%)] animate-[gridMove_16s_linear_infinite] motion-reduce:animate-none" />
        <div className="absolute inset-0 opacity-[0.15] mix-blend-overlay bg-[url('data:image/svg+xml,%3Csvg_xmlns=%27http://www.w3.org/2000/svg%27_width=%27180%27_height=%27180%27%3E%3Cfilter_id=%27n%27%3E%3CfeTurbulence_type=%27fractalNoise%27_baseFrequency=%27.75%27_numOctaves=%273%27_stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect_width=%27180%27_height=%27180%27_filter=%27url(%23n)%27/%3E%3C/svg%3E')]" />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10">
        <Navbar />

        {/* Hero Section */}
        <section className="max-w-6xl mx-auto px-6 py-16">
          <div className="bg-[#222] border-[6px] border-[#444] outline outline-[6px] outline-black p-8 md:p-12 shadow-[0_20px_0_rgba(0,0,0,0.4)]">
            <div className="text-center">
              <div className="text-[#42d86b] text-[10px] sm:text-xs font-bold tracking-widest mb-6 animate-pulse">
                [ COMPUTER VISION SYSTEM ONLINE ]
              </div>

              <h1 className="text-[#ffcc00] text-xl md:text-4xl md:leading-tight tracking-tight drop-shadow-[4px_4px_0_#000]">
                BATTLESTATION
                <br />
                RATER
              </h1>

              <p className="max-w-2xl mx-auto mt-10 text-[10px] md:text-xs leading-loose text-[#bbb]">
                Upload your battlestation image and let our custom-trained YOLO model
                detect components, analyze your setup, and generate a battlestation
                score automatically.
              </p>

              <div className="flex flex-wrap justify-center gap-6 mt-12">
                <Button to="/rater" variant="greenLarge">
                  START SCANNING
                  <ArrowRight size={14} />
                </Button>

                <Button href="#features" variant="gray">
                  VIEW FEATURES
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="max-w-6xl mx-auto px-6 py-12 scroll-mt-24">
          <h2 className="text-[#ffcc00] text-center text-sm sm:text-lg mb-12 tracking-wide">
            FEATURES
          </h2>

          {/* Changed grid columns layout to handle 5 items elegantly across screen sizes */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">

            {/* Card 1 */}
            <div className="bg-[#222] border-4 border-[#444] p-6 shadow-[6px_6px_0_#000] hover:-translate-y-1 transition-transform duration-200">
              <Eye className="text-[#ffcc00] mb-4" size={24} />
              <h3 className="text-[#ffcc00] text-[10px] font-bold tracking-wider mb-4">
                OBJECT DETECTION
              </h3>
              <p className="text-[9px] leading-relaxed text-[#aaa]">
                Detect monitors, keyboards, mice, RGB accessories and other desk components.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-[#222] border-4 border-[#444] p-6 shadow-[6px_6px_0_#000] hover:-translate-y-1 transition-transform duration-200">
              <Cpu className="text-[#ffcc00] mb-4" size={24} />
              <h3 className="text-[#ffcc00] text-[10px] font-bold tracking-wider mb-4">
                AI ANALYSIS
              </h3>
              <p className="text-[9px] leading-relaxed text-[#aaa]">
                Custom YOLO model analyzes your setup configuration using modern computer vision.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-[#222] border-4 border-[#444] p-6 shadow-[6px_6px_0_#000] hover:-translate-y-1 transition-transform duration-200">
              <Trophy className="text-[#ffcc00] mb-4" size={24} />
              <h3 className="text-[#ffcc00] text-[10px] font-bold tracking-wider mb-4">
                SETUP SCORE
              </h3>
              <p className="text-[9px] leading-relaxed text-[#aaa]">
                Receive an instantaneous, calculated competitive score based on detected gear.
              </p>
            </div>

            {/* Card 4 */}
            <div className="bg-[#222] border-4 border-[#444] p-6 shadow-[6px_6px_0_#000] hover:-translate-y-1 transition-transform duration-200">
              <ScanSearch className="text-[#ffcc00] mb-4" size={24} />
              <h3 className="text-[#ffcc00] text-[10px] font-bold tracking-wider mb-4">
                VISUAL OVERLAY
              </h3>
              <p className="text-[9px] leading-relaxed text-[#aaa]">
                Bounding boxes and confidence scores are rendered directly on your image.
              </p>
            </div>

            {/* NEW Card 5: AI Chatbot Feature */}
            <div className="bg-[#222] border-4 border-[#444] p-6 shadow-[6px_6px_0_#000] hover:-translate-y-1 transition-transform duration-200 relative overflow-hidden group">
              

              {/* Reusing lucide-react or custom messages style icons */}
              <Bot className="text-[#ffcc00] mb-4" size={24} />

              <h3 className="text-[#ffcc00] text-[10px] font-bold tracking-wider mb-4">
                BATTLE-BOT AI
              </h3>
              <p className="text-[9px] leading-relaxed text-[#aaa]">
                Chat interactively with a custom LLM assistant to safely upgrade hardware, optimize layout choices, and correct setup bottlenecks.
              </p>
            </div>

          </div>
        </section>

        {/* Demo Dynamic Panel containing your loop animation */}
        <section id='demo' className="max-w-4xl mx-auto px-6 py-12">
          <ScanningPreview />
        </section>

        {/* Workflow Component */}
        <section id='how-it-works' className="max-w-6xl mx-auto px-6 py-12">
          <div className="bg-[#222] border-4 border-[#444] p-8 shadow-[8px_8px_0_#000]">
            <h2 className="text-[#ffcc00] text-center md:text-left text-xs mb-10 tracking-wider">
              HOW IT WORKS
            </h2>

            <div className="grid md:grid-cols-3 gap-8 md:gap-6 text-center">
              <div className="flex flex-col items-center">
                <div className="text-[#42d86b] font-bold text-2xl mb-3 border-b-4 border-[#42d86b] pb-1 px-2">01</div>
                <p className="text-[10px] leading-relaxed text-[#ccc] max-w-[200px]">
                  Upload your clean battlestation camera snap.
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-[#42d86b] font-bold text-2xl mb-3 border-b-4 border-[#42d86b] pb-1 px-2">02</div>
                <p className="text-[10px] leading-relaxed text-[#ccc] max-w-[200px]">
                  YOLO model parses and maps custom desk elements.
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-[#42d86b] font-bold text-2xl mb-3 border-b-4 border-[#42d86b] pb-1 px-2">03</div>
                <p className="text-[10px] leading-relaxed text-[#ccc] max-w-[200px]">
                  Review targeted hardware metrics and raw score outputs.
                </p>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
}