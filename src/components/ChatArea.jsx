import { useState, useRef, useEffect } from 'react';
import MarkdownRenderer from './MarkdownRenderer';

function SendIcon({ size = 17 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>
    </svg>
  );
}

function MenuIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/>
    </svg>
  );
}

function SunIcon({ size = 17 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
    </svg>
  );
}

function MoonIcon({ size = 17 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
    </svg>
  );
}

function BotIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2M20 14h2M15 13v2M9 13v2"/>
    </svg>
  );
}

function UserIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  );
}

function SparklesIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
      <path d="M5 3v4M19 17v4M3 5h4M17 19h4"/>
    </svg>
  );
}

function PlusIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

const SUGGESTIONS = [
  { icon: '💻', text: 'Write a Python function to sort a list' },
  { icon: '☕', text: 'Explain Java Spring Boot annotations' },
  { icon: '🧠', text: 'What are common design patterns?' },
  { icon: '🔧', text: 'Help me debug a REST API issue' },
];

export default function ChatArea({
  conversation,
  loading,
  onSendMessage,
  dark,
  onToggleTheme,
  onToggleSidebar,
  onNewChat,
}) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation?.messages, loading]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 160) + 'px';
    }
  }, [input]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    onSendMessage(input.trim());
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const messages = conversation?.messages || [];

  const formatTime = (ts) => {
    return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`flex-1 flex flex-col h-screen min-w-0 ${dark ? 'bg-[#111219]' : 'bg-gray-50'}`}>
      {/* Header */}
      <header
        className={`flex items-center justify-between px-4 sm:px-6 py-3 border-b shrink-0 ${
          dark
            ? 'bg-[#111219]/95 border-gray-800/60 backdrop-blur-lg'
            : 'bg-white/95 border-gray-200 backdrop-blur-lg'
        }`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onToggleSidebar}
            className={`lg:hidden p-2 rounded-xl transition-colors ${
              dark ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
            }`}
          >
            <MenuIcon />
          </button>
          <div className="min-w-0">
            <h2 className={`text-sm font-bold truncate ${dark ? 'text-white' : 'text-gray-900'}`}>
              {conversation ? conversation.title : 'AI Chat Assistant'}
            </h2>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <p className={`text-[11px] font-medium ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
                {conversation ? `${messages.length} messages` : 'Online • Ready to chat'}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onNewChat}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
              dark
                ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white border border-gray-700'
                : 'bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-gray-200 shadow-sm'
            }`}
          >
            <PlusIcon />
            <span className="hidden sm:inline">New Chat</span>
          </button>
          <button
            onClick={onToggleTheme}
            className={`p-2.5 rounded-xl transition-all duration-300 ${
              dark
                ? 'bg-gray-800 text-amber-400 hover:bg-gray-700 hover:text-amber-300 border border-gray-700'
                : 'bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-gray-200 shadow-sm'
            }`}
            title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {dark ? <SunIcon /> : <MoonIcon />}
          </button>
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full px-4 py-8">
            {/* Welcome screen */}
            <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-6 ${
              dark
                ? 'bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 shadow-2xl shadow-indigo-500/20'
                : 'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-2xl shadow-indigo-500/30'
            }`}>
              <BotIcon size={36} />
              <style>{`.w-20 svg { color: white; }`}</style>
            </div>
            <h2 className={`text-2xl sm:text-3xl font-extrabold mb-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent`}>
              How can I help you?
            </h2>
            <p className={`text-sm max-w-md text-center mb-10 leading-relaxed ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
              Ask me anything — I can help with coding, debugging, explanations, and much more.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg w-full">
              {SUGGESTIONS.map((s, i) => (
                <button
                  key={i}
                  onClick={() => onSendMessage(s.text)}
                  className={`text-left px-4 py-3.5 rounded-2xl text-sm transition-all duration-200 border group ${
                    dark
                      ? 'border-gray-800 text-gray-400 hover:bg-gray-800/70 hover:text-gray-200 hover:border-gray-700'
                      : 'border-gray-200 text-gray-500 hover:bg-white hover:text-gray-800 hover:border-gray-300 hover:shadow-md'
                  }`}
                >
                  <span className="text-lg mr-2">{s.icon}</span>
                  <span className="font-medium">{s.text}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-1">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`message-animate flex gap-3 py-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="shrink-0 w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center mt-0.5 shadow-lg shadow-indigo-500/20">
                    <BotIcon size={15} />
                    <style>{`.w-8.rounded-xl svg { color: white; }`}</style>
                  </div>
                )}
                <div
                  className={`max-w-[85%] sm:max-w-[78%] ${
                    msg.role === 'user'
                      ? `px-4 py-3 rounded-2xl rounded-br-sm ${
                          'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                        } shadow-lg shadow-indigo-500/20`
                      : `px-4 py-3 rounded-2xl rounded-bl-sm ${
                          dark
                            ? 'bg-[#1a1b26] text-gray-200 border border-gray-800/80'
                            : 'bg-white text-gray-700 border border-gray-100 shadow-sm'
                        }`
                  }`}
                >
                  {msg.role === 'assistant' ? (
                    <MarkdownRenderer content={msg.content} dark={dark} />
                  ) : (
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  )}
                  <p className={`text-[10px] mt-2 font-medium ${
                    msg.role === 'user'
                      ? 'text-indigo-200/70'
                      : dark
                        ? 'text-gray-600'
                        : 'text-gray-400'
                  }`}>
                    {formatTime(msg.timestamp)}
                  </p>
                </div>
                {msg.role === 'user' && (
                  <div className={`shrink-0 w-8 h-8 rounded-xl flex items-center justify-center mt-0.5 ${
                    dark ? 'bg-gray-800 text-gray-300' : 'bg-gray-200 text-gray-600'
                  }`}>
                    <UserIcon />
                  </div>
                )}
              </div>
            ))}

            {/* Loading indicator */}
            {loading && (
              <div className="message-animate flex gap-3 py-3">
                <div className="shrink-0 w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                  <BotIcon size={15} />
                </div>
                <div className={`px-5 py-4 rounded-2xl rounded-bl-sm ${
                  dark
                    ? 'bg-[#1a1b26] border border-gray-800/80'
                    : 'bg-white border border-gray-100 shadow-sm'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <span className={`w-2 h-2 rounded-full dot-blink-1 ${dark ? 'bg-indigo-400' : 'bg-indigo-500'}`}></span>
                      <span className={`w-2 h-2 rounded-full dot-blink-2 ${dark ? 'bg-purple-400' : 'bg-purple-500'}`}></span>
                      <span className={`w-2 h-2 rounded-full dot-blink-3 ${dark ? 'bg-pink-400' : 'bg-pink-500'}`}></span>
                    </div>
                    <span className={`text-sm font-medium ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                      Thinking...
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className={`border-t p-3 sm:p-4 shrink-0 ${dark ? 'bg-[#111219] border-gray-800/60' : 'bg-white border-gray-200'}`}>
        <form
          onSubmit={handleSubmit}
          className={`max-w-3xl mx-auto flex items-end gap-2 sm:gap-3 rounded-2xl border p-2 transition-all duration-200 ${
            dark
              ? 'bg-[#1a1b26] border-gray-800 focus-within:border-indigo-500/40 focus-within:ring-2 focus-within:ring-indigo-500/10'
              : 'bg-gray-50 border-gray-200 focus-within:border-indigo-300 focus-within:ring-2 focus-within:ring-indigo-100 focus-within:bg-white'
          }`}
        >
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message... (Shift+Enter for new line)"
            rows={1}
            className={`flex-1 resize-none bg-transparent px-3 py-2.5 text-sm outline-none placeholder:text-gray-400 ${
              dark ? 'text-white' : 'text-gray-900'
            }`}
            disabled={loading}
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className={`p-2.5 rounded-xl transition-all duration-200 shrink-0 ${
              input.trim() && !loading
                ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 active:scale-95 hover:brightness-110'
                : dark
                  ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <SendIcon />
          </button>
        </form>
        <p className={`text-center text-[10px] mt-2.5 font-medium ${dark ? 'text-gray-700' : 'text-gray-400'}`}>
          AI can make mistakes. Verify important information.
        </p>
      </div>
    </div>
  );
}
