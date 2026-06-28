import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, Bot, User, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

export function ChatWidget({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Hello! I am your SmartData AI CMO. Ask me about sales strategies, customer segmentation, or your data.',
      created_at: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  async function sendMessage() {
    if (!input.trim() || loading) return;
    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input.trim(),
      created_at: new Date().toISOString(),
    };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setLoading(true);

    // Save to db
    await supabase.from('chat_messages').insert({
      role: 'user',
      content: userMsg.content,
    });

    // Simulate AI response
    setTimeout(async () => {
      const responses: Record<string, string> = {
        default: 'Based on the latest analysis, I recommend focusing on retention campaigns for the Legacy Stars cluster.',
        bintang: 'The Legacy Stars cluster (25%) needs to be saved with a 15% loyalty campaign via WhatsApp.',
        pembeli: 'The Champions cluster (15%) generates 40% of sales. Do not lose them!',
        strategi: 'Best strategy: 15% discount for Legacy Stars, Early Access for Champions.',
      };
      const text = userMsg.content.toLowerCase();
      const replyText =
        Object.keys(responses).find((k) => text.includes(k)) === 'bintang'
          ? responses.bintang
          : Object.keys(responses).find((k) => text.includes(k)) === 'pembeli'
          ? responses.pembeli
          : Object.keys(responses).find((k) => text.includes(k)) === 'strategi'
          ? responses.strategi
          : responses.default;

      const assistantMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: replyText,
        created_at: new Date().toISOString(),
      };
      setMessages((m) => [...m, assistantMsg]);
      setLoading(false);
      await supabase.from('chat_messages').insert({
        role: 'assistant',
        content: assistantMsg.content,
      });
    }, 1500);
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.25 }}
          className="fixed bottom-4 right-4 z-50 w-[420px] max-w-[calc(100vw-2rem)] h-[560px] max-h-[calc(100vh-2rem)] bg-surface-900 rounded-2xl border border-surface-700 shadow-2xl flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-surface-800 bg-gradient-to-r from-brand-blue/10 to-brand-purple/10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-blue to-brand-purple flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">AI CMO</h3>
                <p className="text-[10px] text-green-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  Online
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-surface-400 hover:text-white hover:bg-surface-800 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2 ${
                  msg.role === 'user' ? 'flex-row-reverse' : ''
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    msg.role === 'user'
                      ? 'bg-brand-blue'
                      : 'bg-brand-purple'
                  }`}
                >
                  {msg.role === 'user' ? (
                    <User className="w-3.5 h-3.5 text-white" />
                  ) : (
                    <Bot className="w-3.5 h-3.5 text-white" />
                  )}
                </div>
                <div
                  className={`max-w-[80%] rounded-xl px-3 py-2 text-sm ${
                    msg.role === 'user'
                      ? 'bg-brand-blue text-white'
                      : 'bg-surface-800 text-surface-200'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-2">
                <div className="w-7 h-7 rounded-lg bg-brand-purple flex items-center justify-center flex-shrink-0">
                  <Bot className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="bg-surface-800 rounded-xl px-3 py-2 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 text-brand-purple animate-spin" />
                  <span className="text-sm text-surface-400">AI is thinking...</span>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="px-3 py-3 border-t border-surface-800">
            <div className="flex items-center gap-2 bg-surface-800 rounded-xl px-3 py-2 border border-surface-700 focus-within:border-brand-blue transition-colors">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Ask your business question..."
                className="flex-1 bg-transparent text-sm text-white placeholder-surface-500 outline-none"
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || loading}
                className="p-1.5 rounded-lg bg-brand-blue text-white hover:bg-brand-blue-light disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
