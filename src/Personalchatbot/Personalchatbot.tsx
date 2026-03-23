import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot, User, Minimize2, Sparkles } from 'lucide-react';
import './personalchatbot.css';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Message {
    id: number;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

interface GeminiPart {
    text?: string;
}

interface GeminiContent {
    parts?: GeminiPart[];
}

interface GeminiCandidate {
    content?: GeminiContent;
}

interface GeminiResponse {
    candidates?: GeminiCandidate[];
}

// ─── Gemini Config ────────────────────────────────────────────────────────────
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;


const SYSTEM_INSTRUCTION = `
You are Sparky — Sanket Fulzele's personal AI assistant, built specifically for recruiters and visitors on his portfolio website.
Your personality: friendly, professional, and efficient. Use light emojis occasionally to keep the tone warm.
Your ONLY job is to answer questions about Sanket. Never go off-topic. Never answer general coding questions or anything unrelated to him.

If someone greets you (hi, hello, good morning, hey, etc.), respond warmly but steer toward Sanket:
e.g. "Hey! 👋 Great timing — I was just waiting to tell someone about Sanket. Ask me anything about him!"
e.g. "Hello there! ☀️ Sparky here. I'm basically Sanket's hype bot — ask me about his skills or projects!"

If someone asks something completely off-topic (weather, jokes, general coding help, world news, etc.), decline it in a witty, fun, slightly sarcastic way — never the same response twice. Examples of the TONE to use (don't repeat these exactly, improvise each time):
e.g. "Ha, I wish I could help with that — but my entire brain is just Sanket's resume. Try me on React.js? ⚛️"
e.g. "Bold question, but I'm a one-trick bot — and that trick is knowing everything about Sanket Fulzele. 😄"
e.g. "My knowledge outside of Sanket is... surprisingly limited. Ask me about his projects instead!"
e.g. "I flunked everything except 'Sanket Studies'. What would you like to know about him? 🎓"
e.g. "That's above my pay grade 😅 — I only know one person really well. Hint: it's Sanket."
Always vary the tone, wording, and emoji. Never repeat the same deflection twice in a conversation.

━━━━━━━━━━━━━━━━━━━━━━━━━━━
📐 RESPONSE STYLE RULES  ← follow these strictly on every reply
━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Keep every reply to 2–3 lines MAX, or a short bullet list (3–5 bullets max).
• Never write long paragraphs. Recruiters are busy — be scannable.
• Prefer bullet points over prose whenever listing skills, projects, or experience.
• Use numbers and metrics when available (e.g. "40% faster load time").
• End with a short follow-up nudge like "Want more details? Just ask! 😊" only when truly helpful.
• Never repeat the same information twice in a reply.
• Do not add unnecessary filler phrases like "Great question!" or "Certainly!".

━━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 PERSONAL INFO
━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Full Name: Sanket Fulzele
- Date of Birth: 19 June 2002 (age 23)
- Location: Nagpur, Maharashtra, India
- Email: sanketfulzelek6@gmail.com
- Phone: 8381001406
- LinkedIn: https://www.linkedin.com/in/sanketfulzele/
- GitHub: https://github.com/SanketFulzele

━━━━━━━━━━━━━━━━━━━━━━━━━━━
🟢 AVAILABILITY  ← answer this immediately and confidently
━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Sanket is actively looking for new opportunities.
- He can join a new company within 15 days of receiving an offer.
- Open to full-time roles, freelance projects, and collaborations.
- Best way to reach him: sanketfulzelek6@gmail.com | LinkedIn: https://www.linkedin.com/in/sanketfulzele/

━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎓 EDUCATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Degree: Bachelor of Commerce (B.Com)
- University: Yashwantrao Chavan Maharashtra University, Butibori, Maharashtra
- Graduated: 2023

━━━━━━━━━━━━━━━━━━━━━━━━━━━
💼 PROFESSIONAL SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━
React.js Developer with 4+ years of experience building responsive, high-performance web applications.
Expert in React.js, Next.js, TypeScript, Redux, and performance optimization (useMemo, React.memo, lazy loading).
Delivered results across logistics, HR, compliance, and e-commerce — improved load times by up to 40%, reduced onboarding time by 60%, and boosted Lighthouse scores by 30%.

━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏆 WHY HIRE SANKET?  ← use this section for "why should we hire" questions
━━━━━━━━━━━━━━━━━━━━━━━━━━━
• 4+ years of React.js expertise with real, measurable impact across multiple industries.
• Architected full apps from scratch — not just a feature developer.
• Strong in performance: improved load times by 40%, Lighthouse scores by 30%.
• Delivered enterprise-grade projects: DSP Mutual Fund HRMS, Grant Thornton CMS, logistics platforms.
• Can join within 15 days. Available now.

━━━━━━━━━━━━━━━━━━━━━━━━━━━
🛠️ TECHNICAL SKILLS
━━━━━━━━━━━━━━━━━━━━━━━━━━━
Languages   : JavaScript (ES6+), TypeScript, HTML5, CSS3
Frameworks  : React.js, Next.js, Redux, Zustand, PWA, Bootstrap, Tailwind CSS
React Skills: Hooks, useMemo, useReducer, React.memo, useCallback, Custom Hooks, Code Splitting, Lazy Loading
Tools       : Git, REST APIs, Socket.IO, AWS, Vercel (CI/CD), React Leaflet

━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏢 WORK EXPERIENCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Paramaya Technology Services Pvt Ltd — Software Engineer I
   Sep 2024 – Present | Nagpur, Maharashtra
   • Architected React.js + TypeScript app from scratch; defined architecture adopted by full team.
   • JSON-driven rendering system cut new-page dev time by ~50%.
   • React.memo + useMemo + lazy loading improved page responsiveness by ~25%.

2. TechnoBase IT Solutions Pvt Ltd — Software Engineer I
   Jun 2023 – Sep 2024 | Nagpur, Maharashtra
   • Built reusable component library used across 3+ projects; reduced duplicate code by ~40%.
   • Integrated Socket.IO + AWS; reduced operational downtime by 35% for 5,000+ active users.
   • Optimized 4+ websites: Lighthouse scores up 30%, avg load time dropped from 4s → 2.5s.

3. TrickySys IT Solutions — Software Engineer I
   May 2022 – Jun 2023 | Nagpur, Maharashtra
   • Built MERN hotel booking app supporting 1,000+ concurrent users; page load times cut by 40%.
   • On-time delivery across all major releases using agile workflows.

━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 PROJECTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. LMS – Logistics Management System
   Tech: React.js, TypeScript, Redux, Socket.IO
   • Role-based platform for suppliers, admins, drivers with full order lifecycle management.
   • Barcode scanning (webcam + mobile) cut item errors by ~30%.
   • Real-time live tracking via Socket.IO + React Leaflet for 10+ concurrent drivers.

2. Paramaya Website — React.js, TypeScript, Redux
   • Modular architecture; 90+ Lighthouse score. JSON-driven pages cut dev time by ~50%.

3. EzeeDesk — Next.js, Redux
   • AI Chatbot, multi-language support (5+ languages), real-time notifications. +20% user engagement.

4. Grant Thornton CMS — Next.js, Redux
   • Enterprise compliance system; integrated 3+ regulatory frameworks; audit prep time down 40%.

5. DSP Mutual Fund HRMS — Next.js, Redux, AWS
   • HRMS for 500+ employees on AWS; onboarding time cut by 60%, HR efficiency up 45%.

6. MyResorts.in — React.js, Redux | https://myresorts.in
   • Resort booking with 50+ listings, complex fare calculation, secure payments. +30% bookings in 3 months.

7. Mahachai.in — HTML, CSS, Bootstrap | https://mahachai.in
   • Marketing site optimized for Core Web Vitals. +25% company sales in 6 months.

━━━━━━━━━━━━━━━━━━━━━━━━━━━
📬 CONTACT SANKET
━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Email: sanketfulzelek6@gmail.com
- Phone: 8381001406
- LinkedIn: https://www.linkedin.com/in/sanketfulzele/
- GitHub: https://github.com/SanketFulzele
- Available to join within 15 days ✅

━━━━━━━━━━━━━━━━━━━━━━━━━━━
🙋 IDENTITY
━━━━━━━━━━━━━━━━━━━━━━━━━━━
If asked "Who are you?" or "What is your name?":
"I'm Sparky ✨ — Sanket's personal AI assistant! Ask me about his skills, projects, or availability. 😊"
`;

// ─── Gemini API Call ──────────────────────────────────────────────────────────
const callGemini = async (messages: Message[]): Promise<string> => {
    const contents = messages.map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
    }));

    const body = {
        system_instruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
        contents,
        generationConfig: { maxOutputTokens: 200, temperature: 0.6 },
    };

    const res = await fetch(GEMINI_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });

    if (!res.ok) throw new Error(`Gemini API error: ${res.status}`);
    const data: GeminiResponse = await res.json();
    return (
        data.candidates?.[0]?.content?.parts?.[0]?.text ??
        'Sorry, I could not generate a response.'
    );
};

// ─── Quick Prompts ────────────────────────────────────────────────────────────
const QUICK_PROMPTS: string[] = [
    "What are Sanket's top skills?",
    'Why should we hire Sanket?',
    'What projects has Sanket built?',
    'Is Sanket available to join immediately?',
    'How can I contact Sanket?',
];

// ─── Component ────────────────────────────────────────────────────────────────
const PersonalChatbot: React.FC = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isMinimized, setIsMinimized] = useState<boolean>(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            role: 'assistant',
            content: "Hey there! 👋 I'm Sparky, Sanket's personal AI assistant. Ask me anything about his skills, projects, or experience!",
            timestamp: new Date(),
        },
    ]);
    const [input, setInput] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [hasNewMessage, setHasNewMessage] = useState<boolean>(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    // Auto-scroll to latest message
    useEffect(() => {
        if (isOpen && !isMinimized) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isOpen, isMinimized]);

    // Focus input when opened
    useEffect(() => {
        if (isOpen && !isMinimized) {
            const timer = setTimeout(() => inputRef.current?.focus(), 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen, isMinimized]);

    const handleOpen = (): void => {
        setIsOpen(true);
        setIsMinimized(false);
        setHasNewMessage(false);
    };

    const sendMessage = async (text?: string): Promise<void> => {
        const trimmed = (text ?? input).trim();
        if (!trimmed || loading) return;

        const userMsg: Message = {
            id: Date.now(),
            role: 'user',
            content: trimmed,
            timestamp: new Date(),
        };
        const updatedMessages: Message[] = [...messages, userMsg];

        setMessages(updatedMessages);
        setInput('');
        setLoading(true);

        try {
            const reply = await callGemini(updatedMessages);
            const assistantMsg: Message = {
                id: Date.now() + 1,
                role: 'assistant',
                content: reply,
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, assistantMsg]);
            if (isMinimized) setHasNewMessage(true);
        } catch {
            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now() + 1,
                    role: 'assistant',
                    content: '⚠️ API usage limit exceeded. Please change the API key.',
                    timestamp: new Date(),
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            void sendMessage();
        }
    };

    const formatTime = (date: Date): string =>
        date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });


    // ─── Markdown → JSX renderer (no extra dependency) ───────────────────────────
    // Handles: **bold**, *italic*, `code`, bullet lines (• - *), plain links
    const parseMarkdown = (text: string): React.ReactNode[] => {
        const lines = text.split('\n');

        return lines.map((line, lineIdx) => {
            // Bullet lines: start with •, -, or "* " (not bold **)
            const bulletMatch = line.match(/^[\s]*([•\-]|\*(?!\*))\s+(.+)/);
            const content = bulletMatch ? bulletMatch[2] : line;

            const renderInline = (str: string): React.ReactNode[] => {
                // Split on **bold**, *italic*, `code`, and bare URLs
                const parts = str.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|https?:\/\/[^\s]+)/g);
                return parts.map((part, i) => {
                    if (/^\*\*[^*]+\*\*$/.test(part))
                        return <strong key={i}>{part.slice(2, -2)}</strong>;
                    if (/^\*[^*]+\*$/.test(part))
                        return <em key={i}>{part.slice(1, -1)}</em>;
                    if (/^`[^`]+`$/.test(part))
                        return <code key={i} className="inline-code">{part.slice(1, -1)}</code>;
                    if (/^https?:\/\/[^\s]+$/.test(part))
                        return <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="msg-link">{part}</a>;
                    return part;
                });
            };

            const key = lineIdx;

            if (bulletMatch) {
                return (
                    <div key={key} className="msg-bullet">
                        <span className="msg-bullet-dot">•</span>
                        <span>{renderInline(content)}</span>
                    </div>
                );
            }

            if (content.trim() === '') return <br key={key} />;

            return <p key={key} className="msg-line">{renderInline(content)}</p>;
        });
    };

    // ─── Render ───────────────────────────────────────────────────────────────
    return (
        <>
            {/* ── FAB Button ─────────────────────────────────────────────────── */}
            {!isOpen && (
                <button className="chatbot-fab" onClick={handleOpen} aria-label="Open chat">
                    <div className="fab-glow" />
                    <MessageCircle size={26} />
                    <span className="fab-label">Sparky</span>
                </button>
            )}

            {/* ── Chat Window ────────────────────────────────────────────────── */}
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
                                <span className="chatbot-header-name">Sparky</span>
                                <span className="chatbot-header-status">
                                    <span className="status-dot" /> Sanket's AI Assistant
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

                    {/* Body — smooth height + opacity transition on minimize/restore */}
                    <div className={`chatbot-body${isMinimized ? ' chatbot-body--hidden' : ''}`}>

                        {/* Messages */}
                        <div className="chatbot-messages">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`chat-message ${msg.role}`}>
                                    <div className="message-icon">
                                        {msg.role === 'assistant' ? <Bot size={14} /> : <User size={14} />}
                                    </div>
                                    <div className="message-bubble">
                                        <div className="msg-content">
                                            {msg.role === 'assistant' ? parseMarkdown(msg.content) : msg.content}
                                        </div>
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

                        {/* Quick Prompts — shown only on first load */}
                        {messages.length === 1 && (
                            <div className="quick-prompts">
                                <p className="quick-prompts-label">
                                    <Sparkles size={12} /> Quick questions
                                </p>
                                <div className="quick-prompts-list">
                                    {QUICK_PROMPTS.map((q) => (
                                        <button
                                            key={q}
                                            className="quick-prompt-btn"
                                            onClick={() => void sendMessage(q)}
                                        >
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
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                                    setInput(e.target.value)
                                }
                                onKeyDown={handleKeyDown}
                                placeholder="Ask me about Sanket..."
                                rows={1}
                                disabled={loading}
                            />
                            <button
                                className="chatbot-send-btn"
                                onClick={() => void sendMessage()}
                                disabled={!input.trim() || loading}
                                aria-label="Send"
                            >
                                <Send size={16} />
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </>
    );
};

export default PersonalChatbot;