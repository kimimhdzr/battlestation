import React, { useState, useRef } from "react";
import { Upload, Scan, RotateCcw, FolderOpen, ArrowLeft } from "lucide-react";
import ErrorModal from "../components/ErrorModal";
import LoadingBar from "../components/LoadingBar";
import Button from "../components/Button"; 
import { useNavigate } from "react-router-dom";

const BattlestationRater = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [imageDims, setImageDims] = useState({ width: 0, height: 0 });
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const navigate = useNavigate();

  const handleFile = (selectedFile) => {
    if (selectedFile && selectedFile.type.startsWith("image/")) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result);
        const img = new Image();
        img.onload = () =>
          setImageDims({ width: img.width, height: img.height });
        img.src = reader.result;
      };
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

    setResult(null);
    setIsScanning(true); 

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/rate-my-setup", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Backend error");

      const data = await response.json();

      setResult({
        score: data.score,
        status: data.summary,
        detections: data.detections,
        image: preview,
      });
    } catch (error) {
      console.error("Connection failed:", error);
      setError(`CRITICAL ERROR:\nSCANNER OFFLINE.\nCHECK PYTHON BACKEND.`);
    } finally {
      setIsScanning(false); 
    }
  };

  const reset = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setIsScanning(false);
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-[#eee] font-mono p-4 sm:p-8 md:p-10 flex flex-col items-center overflow-x-hidden">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');`}</style>

      {/* The External Modal */}
      <ErrorModal message={error} onClose={() => setError(null)} />

      <div className="w-full max-w-5xl bg-[#222] border-[4px] sm:border-[6px] border-[#444] outline outline-[4px] sm:outline-[6px] outline-black p-4 sm:p-6 md:p-8 shadow-[0_12px_0_rgba(0,0,0,0.4)] sm:shadow-[0_20px_0_rgba(0,0,0,0.4)] font-['Press_Start_2P',monospace]">

        {/* Top Header Row - FIXED: Changed flex-col to flex-row on mobile and added justify-between */}
        <div className="relative flex flex-row items-center justify-between sm:justify-center gap-4 mb-6 sm:mb-8 min-h-[40px] w-full">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="sm:absolute left-0 bg-[#555] text-white py-2 px-3 border-4 border-black shadow-[inset_-4px_-4px_#333,inset_4px_4px_#777] text-[9px] sm:text-[10px] flex items-center gap-2 hover:bg-[#666] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all uppercase w-auto shrink-0"
          >
            <ArrowLeft size={12} />
            back
          </button>

          {/* Title - shrink-0 ensures text doesn't fragment on tightly squished viewports */}
          <h1 className="text-[10px] sm:text-lg md:text-2xl text-[#ffcc00] drop-shadow-[2px_2px_0_#000] sm:drop-shadow-[3px_3px_0_#000] text-right sm:text-center uppercase tracking-tight px-2 shrink-0">
            battlestation rater
          </h1>
        </div>

        <hr className="border-2 border-[#444] mb-6 sm:mb-8" />

        {/* Main Content Layout Block */}
        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 justify-center items-stretch lg:items-start">
          
          {/* Left Side Component Pane: Image Upload Controls */}
          <div className="w-full lg:max-w-xs space-y-4 flex flex-col justify-between">
            <form onSubmit={handleScan} className="w-full flex-1 flex flex-col">
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={onDrop}
                onClick={() => fileInputRef.current.click()}
                className={`relative cursor-pointer transition-colors duration-200 p-4 sm:p-6 border-4 border-dashed flex-1 flex flex-col items-center justify-center text-center min-h-[160px] sm:min-h-[200px]
                  ${isDragging ? "bg-[#444] border-[#3e802a]" : "bg-[#333] border-[#555]"}`}
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
                    <p className="text-[9px] sm:text-[10px] leading-loose text-[#888] uppercase">
                      drag image here
                      <br className="hidden sm:inline" />— or —
                    </p>
                    <div className="bg-[#555] text-white py-2.5 px-3 border-4 border-black shadow-[inset_-4px_-4px_#333,inset_4px_4px_#777] text-[9px] sm:text-[10px] flex items-center gap-2 justify-center uppercase max-w-full">
                      <FolderOpen size={12} /> browse files
                    </div>
                  </div>
                ) : (
                  <div className="w-full">
                    <img
                      src={preview}
                      alt="Preview"
                      className="max-h-36 sm:max-h-48 mx-auto object-contain border-2 border-black"
                    />
                    <p className="text-[8px] mt-3 text-[#888] uppercase tracking-wider">ready to scan</p>
                  </div>
                )}
              </div>

              {!isScanning ? (
                <button
                  type="submit"
                  disabled={!file}
                  className="w-full mt-4 bg-[#3e802a] text-white p-3 sm:p-4 border-4 border-black shadow-[inset_-4px_-4px_#2a5a1c,inset_4px_4px_#56ab3a] active:translate-y-1 active:shadow-none transition-transform disabled:opacity-50 disabled:cursor-not-allowed text-[10px] sm:text-[11px] flex items-center justify-center gap-2 uppercase tracking-wide"
                >
                  <Scan size={14} /> scan setup
                </button>
              ) : (
                <div className="mt-4 p-4 border-4 border-[#444] bg-[#222]">
                  <LoadingBar />
                </div>
              )}
            </form>
          </div>

          {/* Right Side Component Pane: Results Processing Display Terminal */}
          {result && !isScanning && (
            <div className="w-full lg:flex-1 bg-[#111] border-4 border-dashed border-[#ffcc00] p-4 sm:p-6 animate-in fade-in slide-in-from-bottom-4 overflow-hidden">
              <span className="text-[9px] sm:text-[10px] text-[#888] uppercase tracking-wider">
                analysis complete:
              </span>
              <h2 className="text-xl sm:text-2xl text-[#00ff00] my-2 sm:my-3 uppercase tracking-tight">
                score: {result.score}/100
              </h2>
              <p className="text-[#ff0055] text-[9px] sm:text-[10px] leading-relaxed mb-4 uppercase break-words">
                status: {result.status}
              </p>

              {/* Dynamic canvas frame containing percentage layout tags */}
              <div className="relative w-full bg-[#111] mb-5 border-4 border-[#222] overflow-hidden">
                <img
                  src={result.image}
                  alt="Scanned"
                  className="w-full h-auto block object-contain image-pixelated"
                />
                {result.detections &&
                  result.detections.map((det, idx) => {
                    const [x1, y1, x2, y2] = det.bbox;
                    const left = `${(x1 / imageDims.width) * 100}%`;
                    const top = `${(y1 / imageDims.height) * 100}%`;
                    const width = `${((x2 - x1) / imageDims.width) * 100}%`;
                    const height = `${((y2 - y1) / imageDims.height) * 100}%`;

                    return (
                      <div
                        key={idx}
                        className="absolute border-[1px] sm:border-2 border-[#00ff00] bg-[#00ff00]/15 pointer-events-none shadow-[0_0_4px_rgba(0,255,0,0.5)]"
                        style={{ left, top, width, height }}
                      >
                        <span className="absolute -top-[13px] sm:-top-[18px] left-[-1px] sm:left-[-2px] bg-[#00ff00] text-black text-[6px] sm:text-[8px] font-bold px-0.5 sm:px-1 whitespace-nowrap uppercase scale-90 sm:scale-100 origin-bottom-left">
                          {det.class} {Math.round(det.confidence * 100)}%
                        </span>
                      </div>
                    );
                  })}
              </div>

              <button
                type="button"
                onClick={reset}
                className="bg-[#ff0055] text-white py-2.5 px-5 sm:py-3 sm:px-6 border-4 border-black shadow-[inset_-4px_-4px_#aa0033,inset_4px_4px_#ff3366] active:translate-y-1 active:shadow-none text-[10px] sm:text-[11px] flex items-center gap-2 uppercase tracking-widest w-full sm:w-auto justify-center"
              >
                <RotateCcw size={12} /> reset
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BattlestationRater;