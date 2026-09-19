"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { X, Send, MessageSquare, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { getSocket } from "@/lib/socket";
import { messageApi } from "@/lib/api";
import MessageList from "./MessageList";

export default function ChatWindow({ hiring, currentUserEmail, currentUserName, onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [typingUser, setTypingUser] = useState(null);
  const typingTimeout = useRef(null);
  const socketRef = useRef(null);
  const messagesRef = useRef(messages);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const hiringId = hiring._id;

  // Determine the other party's name & email
  const otherPartyEmail =
    currentUserEmail === hiring.clientEmail ? hiring.lawyerEmail : hiring.clientEmail;
  const otherPartyName =
    currentUserEmail === hiring.clientEmail ? hiring.lawyerName : (hiring.clientName || "User");

  // Mark-all-unread via socket (or individual via REST fallback)
  const markAllRead = useCallback(async () => {
    if (socketRef.current?.connected) {
      socketRef.current.emit("message:read", { hiringId, readerEmail: currentUserEmail });
    } else {
      try {
        const unread = messagesRef.current.filter(
          (m) => m.receiverEmail === currentUserEmail && !m.read
        );
        await Promise.all(
          unread.map((m) => messageApi.markRead(m._id, currentUserEmail))
        );
      } catch { /* best-effort */ }
    }
  }, [hiringId, currentUserEmail]);

  // Load existing messages + connect socket
  useEffect(() => {
    let mounted = true;
    const socket = getSocket();
    socketRef.current = socket;

    (async () => {
      try {
        const { data: result } = await messageApi.getByHiring(hiringId);
        if (mounted && result?.success) setMessages(result.data);
      } catch {
        if (mounted) toast.error("Failed to load messages");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    socket.connect();
    socket.emit("join_room", { hiringId, email: currentUserEmail });

    const onNewMessage = (msg) => {
      setMessages((prev) => {
        if (prev.some((m) => m._id === msg._id)) return prev;
        return [...prev, msg];
      });
    };

    const onMessagesRead = ({ readerEmail }) => {
      if (readerEmail === currentUserEmail) return;
      setMessages((prev) =>
        prev.map((m) =>
          m.senderEmail === currentUserEmail && m.receiverEmail === readerEmail
            ? { ...m, read: true }
            : m
        )
      );
    };

    const onMessageRead = ({ messageId }) => {
      setMessages((prev) =>
        prev.map((m) =>
          m.senderEmail === currentUserEmail && m._id === messageId
            ? { ...m, read: true }
            : m
        )
      );
    };

    const onTyping = ({ email, isTyping: typing }) => {
      if (email === currentUserEmail) return;
      if (typing) {
        setTypingUser(email);
        clearTimeout(typingTimeout.current);
        typingTimeout.current = setTimeout(() => setTypingUser(null), 2000);
      } else {
        setTypingUser(null);
      }
    };

    const onError = (err) => {
      if (err?.error) toast.error(err.error);
    };

    socket.on("new_message", onNewMessage);
    socket.on("messages_read", onMessagesRead);
    socket.on("message_read", onMessageRead);
    socket.on("typing", onTyping);
    socket.on("send_message_error", onError);

    return () => {
      mounted = false;
      socket.off("new_message", onNewMessage);
      socket.off("messages_read", onMessagesRead);
      socket.off("message_read", onMessageRead);
      socket.off("typing", onTyping);
      socket.off("send_message_error", onError);
      socket.emit("leave_room", { hiringId });
      socket.disconnect();
      clearTimeout(typingTimeout.current);
    };
  }, [hiringId, currentUserEmail]);

  // Mark messages as read whenever new messages arrive
  useEffect(() => {
    if (!loading && messages.length > 0) {
      markAllRead();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, messages.length]);

  const handleTyping = (value) => {
    setInput(value);
    if (socketRef.current?.connected) {
      socketRef.current.emit("typing", {
        hiringId,
        email: currentUserEmail,
        isTyping: true,
      });
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || isSending) return;

    setInput("");
    setIsSending(true);

    // Stop typing indicator
    if (socketRef.current?.connected) {
      socketRef.current.emit("typing", {
        hiringId,
        email: currentUserEmail,
        isTyping: false,
      });
    }

    try {
      // Primary path: REST POST (server broadcasts to room)
      const { data: result } = await messageApi.send({
        hiringId,
        senderEmail: currentUserEmail,
        senderName: currentUserName || currentUserEmail,
        receiverEmail: otherPartyEmail,
        text,
      });

      if (!result?.success) {
        throw new Error(result?.error || "Failed to send");
      }
    } catch (err) {
      toast.error(err.message || "Failed to send message");
      setInput(text); // restore input on failure
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-md h-[80vh] sm:h-[600px] sm:rounded-2xl bg-[#0B1524] border border-slate-800 shadow-2xl flex flex-col rounded-t-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-[#152238] border-b border-slate-800 px-4 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">{otherPartyName}</p>
              <p className="text-[11px] text-slate-500 truncate max-w-[200px]">{otherPartyEmail}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Messages */}
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="w-5 h-5 text-sky-400 animate-spin" />
          </div>
        ) : (
          <MessageList messages={messages} currentUserEmail={currentUserEmail} />
        )}

        {/* Typing indicator */}
        {typingUser && (
          <p className="text-[11px] text-slate-500 italic px-4 pb-1">
            {otherPartyName} is typing...
          </p>
        )}

        {/* Input */}
        <form
          onSubmit={handleSend}
          className="border-t border-slate-800 bg-[#152238] px-4 py-3 flex items-center gap-2 shrink-0"
        >
          <input
            value={input}
            onChange={(e) => handleTyping(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend(e);
              }
            }}
            placeholder="Type a message..."
            disabled={isSending}
            className="flex-1 bg-[#0B1524] border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-sky-500 placeholder:text-slate-500 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isSending || !input.trim()}
            className="p-2.5 bg-sky-500 hover:bg-sky-600 disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-xl transition-colors"
          >
            {isSending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
}