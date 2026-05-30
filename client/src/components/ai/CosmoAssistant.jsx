import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Sparkles, X, Send, Trash2, Minus } from 'lucide-react';
import { useAuth } from '../../AuthContext';
import { API_BASE } from '../../config';
import ChatMessage from './ChatMessage';
import SuggestionChips from './SuggestionChips';

export default function CosmoAssistant() {
  const { token, user } = useAuth();

  // Floating trigger and state boundaries
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'cosmo',
      text: "Hello! I am **COSMO**, your AI Business Intelligence assistant. How can I help you optimize your coworking space operations today? Select a quick action below or ask me any natural language operational telemetry questions."
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef(null);

  // Auto Scroll down on changes
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading]);

  if (!token || !user) return null;

  const handleSendMessage = async (textToSend) => {
    const text = textToSend || inputValue;
    if (!text || text.trim().length === 0) return;

    // Append user input
    const userMsg = { sender: 'user', text: text.trim() };
    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputValue('');
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message: text.trim() })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Server processing error.');
      }

      const data = await response.json();
      setMessages(prev => [...prev, { sender: 'cosmo', text: data.answer }]);
    } catch (err) {
      console.error('COSMO integration issue:', err);
      setMessages(prev => [
        ...prev,
        {
          sender: 'cosmo',
          text: `⚠️ **COSMO Interruption**: ${err.message || 'Failed to establish local API contact.'}`
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        sender: 'cosmo',
        text: "Chat cleared. I am ready to process new operational telemetry inquiries! Ask me about occupancy, branch loads, client risks, or active business recommendations."
      }
    ]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] font-sans antialiased text-slate-100">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="absolute bottom-16 right-0 w-[calc(100vw-48px)] sm:w-[400px] h-[75vh] sm:h-[600px] rounded-2xl border border-white/10 bg-[#0b0d12]/95 shadow-2xl backdrop-blur-2xl flex flex-col overflow-hidden text-left"
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
          >
            {/* Header section */}
            <div className="flex items-center justify-between border-b border-white/10 bg-black/20 px-4 py-3 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 flex items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-500 shadow-md shadow-cyan-500/20 text-slate-950">
                  <Sparkles className="h-5 w-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white tracking-wide">COSMO</h3>
                  <p className="text-[10px] font-semibold text-slate-500 tracking-wider uppercase">AI BI Assistant</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleClearChat}
                  title="Clear Chat History"
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-white/5 hover:text-white transition cursor-pointer"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  title="Minimize Chat"
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-white/5 hover:text-white transition cursor-pointer"
                >
                  <Minus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Content Scroll area */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 bg-gradient-to-b from-transparent to-black/10">
              {messages.map((msg, index) => (
                <ChatMessage key={index} message={msg} />
              ))}

              {loading && (
                <div className="flex gap-3 justify-start mb-4">
                  <div className="h-8 w-8 shrink-0 flex items-center justify-center rounded-xl bg-[#151922] border border-white/5 text-cyan-400">
                    <Sparkles className="h-4 w-4 animate-spin" />
                  </div>
                  <div className="max-w-[85%] rounded-2xl rounded-tl-sm border border-white/5 bg-white/[0.01] px-4 py-3 flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="h-2 w-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="h-2 w-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}

              {/* suggestions chips logic */}
              {messages.length === 1 && !loading && (
                <div className="mt-4 border-t border-white/5 pt-4">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Quick queries</p>
                  <SuggestionChips onSelect={handleSendMessage} />
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Chat Input bar */}
            <div className="border-t border-white/10 px-4 py-3 bg-[#0d0f14]/85 shrink-0">
              <form
                onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
                className="flex items-center gap-2 bg-white/[0.02] border border-white/5 hover:border-white/10 rounded-xl px-3 py-1.5 transition"
              >
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask COSMO operational queries..."
                  className="flex-1 bg-transparent py-1 text-sm outline-none text-white placeholder-slate-500"
                />
                <button
                  type="submit"
                  disabled={loading || !inputValue.trim()}
                  className="rounded-lg bg-cyan-500 hover:bg-cyan-600 disabled:bg-white/[0.04] disabled:text-slate-600 p-2 text-slate-950 transition cursor-pointer shrink-0"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Trigger button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="h-14 w-14 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-600 shadow-lg shadow-cyan-500/25 border border-cyan-400/20 flex items-center justify-center text-slate-950 hover:brightness-110 transition cursor-pointer"
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <MessageSquare className="h-6 w-6" />
        )}
      </motion.button>
    </div>
  );
}
