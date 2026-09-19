"use client";

import { useEffect, useRef } from "react";
import { Check, CheckCheck } from "lucide-react";

function formatTime(timestamp) {
  if (!timestamp) return "";
  const d = new Date(timestamp);
  const now = new Date();
  const isToday =
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate();

  const time = d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  if (isToday) return time;
  return `${d.toLocaleDateString("en-US", { month: "short", day: "numeric" })} ${time}`;
}

function ReadStatus({ read }) {
  return read ? (
    <CheckCheck className="w-3.5 h-3.5 text-sky-400 inline-block ml-1" />
  ) : (
    <Check className="w-3.5 h-3.5 text-slate-500 inline-block ml-1" />
  );
}

export default function MessageList({ messages, currentUserEmail }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!messages || messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-slate-500 text-sm italic px-4 text-center">
        No messages yet. Say hello!
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
      {messages.map((msg) => {
        const isOwn = msg.senderEmail === currentUserEmail;
        return (
          <div key={msg._id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[78%] rounded-2xl px-3.5 py-2 shadow-sm ${
              isOwn
                ? "bg-sky-600 text-white rounded-br-md"
                : "bg-[#152238] text-slate-100 border border-slate-700 rounded-bl-md"
            }`}>
              {!isOwn && msg.senderName && (
                <p className="text-[11px] font-semibold text-sky-400 mb-0.5">{msg.senderName}</p>
              )}
              <p className="text-sm leading-relaxed break-words">{msg.text}</p>
              <p className={`text-[10px] mt-1 flex items-center justify-end gap-1 ${
                isOwn ? "text-sky-200" : "text-slate-500"
              }`}>
                {formatTime(msg.timestamp)}
                {isOwn && <ReadStatus read={msg.read} />}
              </p>
            </div>
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
}