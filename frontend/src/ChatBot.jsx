import React, { useState, useRef, useEffect } from "react";

const ChatBot = ({ detectionResult }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingContent]);

  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${ta.scrollHeight}px`;
  }, [input]);

  const sendMessage = async () => {
    if (!input.trim() || isStreaming) return;

    const userMessage = { role: "user", content: input.trim() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsStreaming(true);
    setStreamingContent("");

    const contextForApi = detectionResult
      ? {
          score: detectionResult.score,
          detections: detectionResult.detections,
          summary: detectionResult.status,
        }
      : null;

    try {
      const response = await fetch("http://127.0.0.1:8000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages,
          detection_context: contextForApi,
        }),
      });

      if (!response.ok) throw new Error("Chat API error");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n\n");

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const payload = line.slice(6);
          if (payload === "[DONE]") {
            setMessages((prev) => [
              ...prev,
              { role: "assistant", content: accumulated },
            ]);
            setStreamingContent("");
            setIsStreaming(false);
            return;
          }
          accumulated += payload;
          setStreamingContent(accumulated);
        }
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: accumulated },
      ]);
      setStreamingContent("");
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "ERROR: BATTLE-BOT OFFLINE. CHECK BACKEND." },
      ]);
      setStreamingContent("");
    } finally {
      setIsStreaming(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-[#ffcc00] text-black px-4 py-3 border-4 border-black shadow-[inset_-4px_-4px_#aa8800,inset_4px_4px_#ffee55] active:translate-y-1 active:shadow-none text-[10px]"
        style={{ fontFamily: "'Press Start 2P', monospace" }}
      >
        ▲ BATTLE-BOT AI
      </button>
    );
  }

  return (
    <div
      className="fixed bottom-6 right-6 w-[400px] flex flex-col bg-[#222] border-4 border-[#ffcc00] shadow-[0_8px_0_rgba(0,0,0,0.5)]"
      style={{ fontFamily: "'Press Start 2P', monospace", maxHeight: "600px" }}
    >
      {/* Title bar */}
      <div className="flex items-center justify-between bg-[#1a1a1a] px-4 py-3 border-b-4 border-[#ffcc00]">
        <span className="text-[#ffcc00] text-[9px]">BATTLE-BOT AI</span>
        <button
          onClick={() => setIsOpen(false)}
          className="text-[#888] hover:text-[#ffcc00] text-[9px]"
        >
          ▼ CLOSE
        </button>
      </div>

      {/* Context indicator */}
      <div className="px-4 py-2 bg-[#111] border-b-2 border-[#333]">
        <span className="text-[7px] text-[#555]">
          {detectionResult
            ? `SETUP LOADED — SCORE ${detectionResult.score}/100`
            : "NO SCAN LOADED — ASK GENERAL QUESTIONS"}
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ minHeight: "200px", maxHeight: "340px" }}>
        {messages.length === 0 && !isStreaming && (
          <p className="text-[#555] text-[8px] leading-relaxed text-center mt-4">
            {detectionResult
              ? "SETUP SCANNED. ASK ME ANYTHING ABOUT YOUR RIG."
              : "SCAN YOUR SETUP FIRST OR ASK ME ANYTHING."}
          </p>
        )}

        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] px-3 py-2 text-[8px] leading-relaxed ${
                msg.role === "user"
                  ? "bg-[#3e802a] text-white border-2 border-black"
                  : "bg-[#111] text-[#00ff00] border-2 border-[#333]"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {streamingContent && (
          <div className="flex justify-start">
            <div className="max-w-[80%] px-3 py-2 text-[8px] leading-relaxed bg-[#111] text-[#00ff00] border-2 border-[#333]">
              {streamingContent}
              <span className="animate-pulse">▮</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="flex gap-2 p-3 border-t-4 border-[#ffcc00] bg-[#1a1a1a]">
        <textarea
          ref={textareaRef}
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isStreaming}
          placeholder="TYPE MESSAGE..."
          className="flex-1 bg-[#111] border-2 border-[#444] text-[#eee] text-[8px] px-2 py-2 resize-none focus:outline-none focus:border-[#ffcc00] disabled:opacity-50 placeholder-[#444]"
          style={{ fontFamily: "'Press Start 2P', monospace", maxHeight: "120px", overflowY: "auto" }}
        />
        <button
          onClick={sendMessage}
          disabled={isStreaming || !input.trim()}
          className="bg-[#ffcc00] text-black px-3 py-2 border-2 border-black text-[8px] shadow-[inset_-2px_-2px_#aa8800,inset_2px_2px_#ffee55] active:translate-y-px active:shadow-none disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {isStreaming ? "..." : "SEND"}
        </button>
      </div>
    </div>
  );
};

export default ChatBot;
