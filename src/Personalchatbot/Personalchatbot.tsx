import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot, User, Minimize2, Sparkles } from 'lucide-react';
import './PersonalChatbot.css';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
}

// ─── Gemini Config ────────────────────────────────────────────────────────────
const GEMINI_API_KEY = 'AIzaSyAQI1Q1Gr4ylxKKpOoMWEeyt3OD--BFeq4'; 
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

const SYSTEM_INSTRUCTION = `
You are Sanket Fulzele's personal AI assistant embedded in his portfolio website.
Your job is to answer questions about Sanket — his skills, experience, projects, and background.
Be friendly, professional, and concise. Always stay on topic about Sanket.

Here is Sanket's information:
[TODO: Add your personal info here — skills, experience, education, projects, contact, etc.]

If someone asks something unrelated to Sanket, politely redirect them:
"I'm here specifically to help you learn about Sanket Fulzele! Ask me about his skills, projects, or experience."
`;

// ─── Helpers ──────────────────────────────────────────────────────────────────
const callGemini = async (messages: Message[]): Promise<string> => {
  const contents = messages
    .filter((m) => m.role !== 'system')
    .map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

  const body = {
    system_instruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
    contents,
    generationConfig: { maxOutputTokens: 512, temperature: 0.7 },
  };

  const res = await fetch(GEMINI_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error(`Gemini API error: ${res.status}`);
  const data: GeminiResponse = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not generate a response.';
};

const QUICK_PROMPTS: string[] = [
  'What are your top skills?',
  'Tell me about your experience',
  'What projects have you built?',
  'How can I contact you?',
];

// ─── Component ────────────────────────────────────────────────────────────────
const PersonalChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: 'assistant',
      content: "Hey there! 👋 I'm Sanket's AI assistant. Ask me anything about his skills, projects, or experience!",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [hasNewMessage, setHasNewMessage] = useState<boolean>(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isMinimized]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen, isMinimized]);

  const handleOpen = () => {
    setIsOpen(true);
    setIsMinimized(false);
    setHasNewMessage(false);
  };

  const sendMessage = async (text?: string): Promise<void> => {
    const trimmed = (text || input).trim();
    if (!trimmed || loading) return;

    const userMsg: Message = { id: Date.now(), role: 'user', content: trimmed, timestamp: new Date() };
    const updatedMessages = [...messages, userMsg];

    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      const reply = await callGemini(updatedMessages);
      const assistantMsg: Message = { id: Date.now() + 1, role: 'assistant', content: reply, timestamp: new Date() };
      setMessages((prev) => [...prev, assistantMsg]);

      if (isMinimized) setHasNewMessage(true);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: 'assistant',
          content: '⚠️ Something went wrong. Please try again!',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date: Date): string =>
    date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <>
      {/* ── FAB Button ─────────────────────────────────────────────────────── */}
      {!isOpen && (
        <button className="chatbot-fab" onClick={handleOpen} aria-label="Open chat">
          <div className="fab-glow" />
          <MessageCircle size={26} />
          <span className="fab-label">Chat with AI</span>
        </button>
      )}

      {/* ── Chat Window ────────────────────────────────────────────────────── */}
      {isOpen && (
        <div className={`chatbot-window ${isMinimized ? 'minimized' : ''}`}>

          {/* Header */}
          <div className="chatbot-header">
            <div className="chatbot-header-left">
              <div className="chatbot-avatar">
                <Bot size={18} />
                <span className="avatar-pulse" />
              </div>
              <div className="chatbot-header-info">
                <span className="chatbot-header-name">Sanket's AI</span>
                <span className="chatbot-header-status">
                  <span className="status-dot" /> Online
                </span>
              </div>
            </div>
            <div className="chatbot-header-actions">
              <button
                className="chatbot-icon-btn"
                onClick={() => setIsMinimized((v) => !v)}
                aria-label="Minimize"
              >
                <Minimize2 size={16} />
              </button>
              <button
                className="chatbot-icon-btn close"
                onClick={() => setIsOpen(false)}
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>
            {hasNewMessage && isMinimized && (
              <span className="chatbot-notif-badge">1</span>
            )}
          </div>

          {/* Body (hidden when minimized) */}
          {!isMinimized && (
            <>
              {/* Messages */}
              <div className="chatbot-messages">
                {messages.map((msg) => (
                  <div key={msg.id} className={`chat-message ${msg.role}`}>
                    <div className="message-icon">
                      {msg.role === 'assistant' ? <Bot size={14} /> : <User size={14} />}
                    </div>
                    <div className="message-bubble">
                      <p>{msg.content}</p>
                      <span className="message-time">{formatTime(msg.timestamp)}</span>
                    </div>
                  </div>
                ))}

                {/* Typing indicator */}
                {loading && (
                  <div className="chat-message assistant">
                    <div className="message-icon">
                      <Bot size={14} />
                    </div>
                    <div className="message-bubble typing">
                      <span /><span /><span />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Prompts */}
              {messages.length === 1 && (
                <div className="quick-prompts">
                  <p className="quick-prompts-label">
                    <Sparkles size={12} /> Quick questions
                  </p>
                  <div className="quick-prompts-list">
                    {QUICK_PROMPTS.map((q) => (
                      <button key={q} className="quick-prompt-btn" onClick={() => sendMessage(q)}>
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input */}
              <div className="chatbot-input-area">
                <textarea
                  ref={inputRef}
                  className="chatbot-input"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask me about Sanket..."
                  rows={1}
                  disabled={loading}
                />
                <button
                  className="chatbot-send-btn"
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || loading}
                  aria-label="Send"
                >
                  <Send size={16} />
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default PersonalChatbot;