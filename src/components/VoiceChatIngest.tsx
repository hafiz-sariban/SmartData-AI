import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Mic,
  MessageCircle,
  Sparkles,
  CheckCircle2,
  Loader2,
  Trash2,
} from 'lucide-react';
import { useMicroStore, type MicroTransaction } from '../lib/microStore';

interface ChatMessage {
  id: string;
  role: 'user' | 'bot';
  text: string;
  parsed?: ParsedTransaction;
}

interface ParsedTransaction {
  date: string;
  items: { name: string; qty: number; price: number }[];
  total_amount: number;
  payment_method: string;
}

const malayNumberMap: Record<string, number> = {
  satu: 1, dua: 2, tiga: 3, empat: 4, lima: 5, enam: 6, tujuh: 7, lapan: 8, sembilan: 9, sepuluh: 10,
};

function parseMalayInput(text: string): ParsedTransaction | null {
  const lower = text.toLowerCase().trim();
  if (!lower) return null;

  const items: { name: string; qty: number; price: number }[] = [];
  let total = 0;
  let paymentMethod = 'Cash';

  // Extract total: "total rm180" / "total 180" / "jumlah rm180"
  const totalMatch = lower.match(/(?:total|jumlah)\s*(?:rm)?\s*(\d+(?:\.\d+)?)/);
  if (totalMatch) total = parseFloat(totalMatch[1]);

  // Payment method detection
  if (/duitnow/.test(lower)) paymentMethod = 'DuitNow Transfer';
  else if (/qr/.test(lower)) paymentMethod = 'DuitNow QR';
  else if (/tunai/.test(lower)) paymentMethod = 'Cash';
  else if (/bank/.test(lower)) paymentMethod = 'Bank Transfer';

  // Extract items: patterns like "15 set nasi lemak" or "10 teh ais"
  const itemRegex = /(\d+|[a-z]+)\s+(?:set\s+|pcs\s+|pieces?\s+)?([a-z\s]+?)(?=\s*,|\s*\d+\s|\s+total|\s+jumlah|$)/g;
  let match;
  while ((match = itemRegex.exec(lower)) !== null) {
    let qty = parseInt(match[1]);
    if (isNaN(qty)) qty = malayNumberMap[match[1]] ?? 0;
    if (qty === 0) continue;
    const name = match[2].trim().replace(/^(set|pcs|pieces)\s+/, '');
    if (name.length < 2 || ['total', 'jumlah', 'duitnow', 'tunai', 'bank', 'rm'].includes(name)) continue;

    // Derive unit price from total if only one item and total known
    let price = 0;
    if (total > 0) {
      // Try to find a price hint like "rm 8.50 each"
      const priceHint = lower.match(new RegExp(`${name}.*?rm\\s*(\\d+(?:\\.\\d+)?)`));
      if (priceHint) price = parseFloat(priceHint[1]);
    }
    items.push({ name: name.charAt(0).toUpperCase() + name.slice(1), qty, price });
  }

  // If no items parsed but total exists, create a generic entry
  if (items.length === 0 && total > 0) {
    items.push({ name: 'Sales (unspecified)', qty: 1, price: total });
  }

  // If items exist but no total, sum from prices (or estimate)
  if (total === 0 && items.length > 0) {
    total = items.reduce((s, i) => s + i.qty * i.price, 0);
  }

  if (items.length === 0 && total === 0) return null;

  return {
    date: new Date().toISOString().slice(0, 10),
    items,
    total_amount: Math.round(total * 100) / 100,
    payment_method: paymentMethod,
  };
}

const samplePrompts = [
  'Hari ini jual 15 set nasi lemak, 10 teh ais, total RM180',
  'Semalam 8 cupcake RM15 setiap satu, 3 kek lapis RM40, duitnow RM240',
  'Today sold 5 baju kurung, 2 tudung, total rm350',
];

export function VoiceChatIngest() {
  const { addTransaction } = useMicroStore();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'bot',
      text: 'Hi! Saya DataBijak Bot. Type or speak your sales in any style — Malay, English, or rojak. Contoh: "Hari ini jual 15 set nasi lemak, 10 teh ais, total RM180"',
    },
  ]);
  const [input, setInput] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isParsing]);

  const send = (text?: string) => {
    const content = (text ?? input).trim();
    if (!content) return;
    const userMsg: ChatMessage = { id: Math.random().toString(36).slice(2), role: 'user', text: content };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsParsing(true);

    setTimeout(() => {
      const parsed = parseMalayInput(content);
      const botMsg: ChatMessage = {
        id: Math.random().toString(36).slice(2),
        role: 'bot',
        text: parsed
          ? 'Got it! I parsed your sales into a transaction record. Review below and save to your dashboard.'
          : 'Hmm, I couldn\'t extract a transaction from that. Try mentioning quantities and a total, e.g. "5 roti canai RM2 each, total RM10".',
        parsed: parsed ?? undefined,
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsParsing(false);
    }, 1200);
  };

  const saveParsed = (parsed: ParsedTransaction, msgId: string) => {
    const tx: Omit<MicroTransaction, 'id'> = {
      date: parsed.date,
      items: parsed.items,
      total_amount: parsed.total_amount,
      payment_method: parsed.payment_method,
      source: 'voice',
    };
    addTransaction(tx);
    setMessages((prev) =>
      prev.map((m) =>
        m.id === msgId
          ? { ...m, text: 'Saved to your Micro Dashboard!', parsed: undefined }
          : m
      )
    );
  };

  const toggleListen = () => {
    setIsListening(!isListening);
    // Simulate voice input after a delay
    if (!isListening) {
      setTimeout(() => {
        setIsListening(false);
        const sample = samplePrompts[Math.floor(Math.random() * samplePrompts.length)];
        setInput(sample);
      }, 2000);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 'welcome',
        role: 'bot',
        text: 'Hi! Saya DataBijak Bot. Type or speak your sales in any style — Malay, English, or rojak.',
      },
    ]);
  };

  return (
    <div className="rounded-2xl border border-surface-800 bg-surface-900/50 overflow-hidden flex flex-col" style={{ minHeight: 480 }}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-surface-800 bg-surface-950/30">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-400 border-2 border-surface-900" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">WhatsApp / Voice Note Parser</h3>
            <p className="text-xs text-surface-500">Conversational ingestion — Malay & Singlish supported</p>
          </div>
        </div>
        <button onClick={clearChat} className="text-surface-500 hover:text-red-400 transition-colors">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Chat Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3" style={{ maxHeight: 340 }}>
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                msg.role === 'user'
                  ? 'bg-gradient-to-br from-brand-blue to-brand-purple text-white rounded-br-sm'
                  : 'bg-surface-800 text-surface-200 rounded-bl-sm border border-surface-700'
              }`}
            >
              <p className="text-sm leading-relaxed">{msg.text}</p>

              {/* Parsed entity breakdown */}
              {msg.parsed && (
                <div className="mt-3 p-3 rounded-xl bg-surface-950/60 border border-surface-700 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-green-400 mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    Parsed Transaction
                  </div>
                  <div className="space-y-1">
                    {msg.parsed.items.map((item, i) => (
                      <div key={i} className="flex items-center justify-between text-xs">
                        <span className="text-surface-300">
                          {item.qty}x {item.name}
                        </span>
                        <span className="text-surface-400">
                          {item.price > 0 ? `RM ${(item.qty * item.price).toFixed(2)}` : '—'}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-surface-700/50">
                    <span className="text-xs text-surface-500">Total: <span className="text-white font-semibold">RM {msg.parsed.total_amount.toFixed(2)}</span></span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface-700 text-surface-300">{msg.parsed.payment_method}</span>
                  </div>
                  <button
                    onClick={() => saveParsed(msg.parsed!, msg.id)}
                    className="w-full mt-2 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-green-600 hover:bg-green-500 text-white text-xs font-semibold transition-colors"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Save to Dashboard
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        ))}

        {isParsing && (
          <div className="flex justify-start">
            <div className="bg-surface-800 border border-surface-700 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-2">
              <Loader2 className="w-4 h-4 text-surface-400 animate-spin" />
              <span className="text-xs text-surface-400">Parsing entities...</span>
            </div>
          </div>
        )}
      </div>

      {/* Sample prompts */}
      {messages.length <= 1 && (
        <div className="px-4 pb-2">
          <p className="text-[10px] text-surface-500 uppercase tracking-wider mb-1.5">Try saying:</p>
          <div className="flex flex-wrap gap-1.5">
            {samplePrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => send(prompt)}
                className="text-xs px-2.5 py-1.5 rounded-lg border border-surface-700 bg-surface-800/50 text-surface-300 hover:bg-surface-800 hover:text-white transition-all"
              >
                {prompt.length > 40 ? prompt.slice(0, 40) + '...' : prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-3 border-t border-surface-800 bg-surface-950/30">
        <div className="flex items-center gap-2">
          <button
            onClick={toggleListen}
            className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
              isListening
                ? 'bg-red-500/20 border border-red-500/40 text-red-400 animate-pulse'
                : 'bg-surface-800 border border-surface-700 text-surface-400 hover:text-white'
            }`}
          >
            <Mic className="w-4 h-4" />
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send()}
            placeholder={isListening ? 'Listening...' : 'Type your sales in Malay or English...'}
            className="flex-1 rounded-xl border border-surface-700 bg-surface-950/50 px-4 py-2.5 text-sm text-white placeholder:text-surface-600 focus:outline-none focus:ring-2 focus:ring-green-500/40 focus:border-green-500/60"
          />
          <button
            onClick={() => send()}
            disabled={!input.trim()}
            className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-green-600 to-green-500 text-white flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-40"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
