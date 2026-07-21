import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera,
  Upload,
  ImageIcon,
  Loader2,
  CheckCircle2,
  X,
  Edit3,
  Save,
  Plus,
  Trash2,
  ScanLine,
  Sparkles,
} from 'lucide-react';
import { useMicroStore, type MicroTransaction } from '../lib/microStore';

interface ParsedField {
  date: string;
  items: { name: string; qty: number; price: number }[];
  total_amount: number;
  payment_method: string;
  confidence_score: number;
}

const sampleParses: ParsedField[] = [
  {
    date: new Date().toISOString().slice(0, 10),
    items: [
      { name: 'Nasi Lemak Ayam', qty: 8, price: 8.5 },
      { name: 'Teh Ais', qty: 6, price: 3.0 },
      { name: 'Kuih Muih (5pcs)', qty: 4, price: 5.0 },
    ],
    total_amount: 103.0,
    payment_method: 'DuitNow QR',
    confidence_score: 0.94,
  },
  {
    date: new Date(Date.now() - 86400000).toISOString().slice(0, 10),
    items: [
      { name: 'Roti Canai', qty: 12, price: 2.0 },
      { name: 'Teh Tarik', qty: 10, price: 3.5 },
    ],
    total_amount: 59.0,
    payment_method: 'Cash',
    confidence_score: 0.88,
  },
  {
    date: new Date(Date.now() - 172800000).toISOString().slice(0, 10),
    items: [
      { name: 'Custom Birthday Cake', qty: 1, price: 180.0 },
      { name: 'Cupcakes (6pcs)', qty: 1, price: 35.0 },
    ],
    total_amount: 215.0,
    payment_method: 'DuitNow Transfer',
    confidence_score: 0.91,
  },
];

type Phase = 'idle' | 'scanning' | 'review';

export function MicroOCRUpload() {
  const { addTransaction } = useMicroStore();
  const [phase, setPhase] = useState<Phase>('idle');
  const [isDragging, setIsDragging] = useState(false);
  const [parsed, setParsed] = useState<ParsedField | null>(null);
  const [saved, setSaved] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return;
    setPhase('scanning');
    // Simulate vision model OCR + structured extraction
    setTimeout(() => {
      const sample = sampleParses[Math.floor(Math.random() * sampleParses.length)];
      setParsed({ ...sample, items: sample.items.map((i) => ({ ...i })) });
      setPhase('review');
    }, 2200);
  }, []);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(e.type === 'dragenter' || e.type === 'dragover');
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const updateItem = (idx: number, field: 'name' | 'qty' | 'price', value: string | number) => {
    if (!parsed) return;
    const items = [...parsed.items];
    items[idx] = { ...items[idx], [field]: value };
    const total = items.reduce((s, i) => s + i.qty * i.price, 0);
    setParsed({ ...parsed, items, total_amount: Math.round(total * 100) / 100 });
  };

  const addItem = () => {
    if (!parsed) return;
    setParsed({ ...parsed, items: [...parsed.items, { name: '', qty: 1, price: 0 }] });
  };

  const removeItem = (idx: number) => {
    if (!parsed) return;
    const items = parsed.items.filter((_, i) => i !== idx);
    const total = items.reduce((s, i) => s + i.qty * i.price, 0);
    setParsed({ ...parsed, items, total_amount: Math.round(total * 100) / 100 });
  };

  const save = () => {
    if (!parsed) return;
    const tx: Omit<MicroTransaction, 'id'> = {
      date: parsed.date,
      items: parsed.items,
      total_amount: parsed.total_amount,
      payment_method: parsed.payment_method,
      source: 'ocr',
      confidence_score: parsed.confidence_score,
    };
    addTransaction(tx);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setParsed(null);
      setPhase('idle');
    }, 1800);
  };

  const reset = () => {
    setParsed(null);
    setPhase('idle');
  };

  return (
    <div className="rounded-2xl border border-surface-800 bg-surface-900/50 overflow-hidden">
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-surface-800">
        <div className="w-8 h-8 rounded-lg bg-brand-purple/10 border border-brand-purple/20 flex items-center justify-center">
          <ScanLine className="w-4 h-4 text-brand-purple" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">Snap-and-Sense OCR Parser</h3>
          <p className="text-xs text-surface-500">Upload receipts, logbooks, or DuitNow screenshots</p>
        </div>
      </div>

      <div className="p-5">
        <AnimatePresence mode="wait">
          {/* Idle: Dropzone */}
          {phase === 'idle' && (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileRef.current?.click()}
                className={`relative cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-all duration-300 ${
                  isDragging
                    ? 'border-brand-purple bg-brand-purple/5 scale-[1.02]'
                    : 'border-surface-700 bg-surface-950/40 hover:border-surface-600 hover:bg-surface-800/40'
                }`}
              >
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={(e) => handleFiles(e.target.files)}
                />
                <motion.div
                  animate={isDragging ? { y: [0, -6, 0] } : {}}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-purple/20 to-brand-blue/20 border border-brand-purple/20 flex items-center justify-center mb-3"
                >
                  <Camera className="w-7 h-7 text-brand-purple" />
                </motion.div>
                <p className="text-sm font-medium text-white mb-1">Snap or upload a photo</p>
                <p className="text-xs text-surface-500">
                  Paper receipts, handwritten logbooks, or bank transfer screenshots
                </p>
                <div className="flex items-center justify-center gap-3 mt-4">
                  <span className="flex items-center gap-1 text-[10px] text-surface-400">
                    <Camera className="w-3 h-3" /> Camera
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-surface-400">
                    <Upload className="w-3 h-3" /> Upload
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-surface-400">
                    <ImageIcon className="w-3 h-3" /> Drag & Drop
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Scanning */}
          {phase === 'scanning' && (
            <motion.div
              key="scanning"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-12"
            >
              <Loader2 className="w-10 h-10 text-brand-purple animate-spin mb-4" />
              <p className="text-sm font-medium text-white mb-1">Vision model extracting data...</p>
              <p className="text-xs text-surface-500">Converting unstructured image into structured JSON</p>
              <div className="mt-4 w-48 h-1.5 rounded-full bg-surface-800 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-brand-purple to-brand-blue"
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 2.2, ease: 'easeInOut' }}
                />
              </div>
            </motion.div>
          )}

          {/* Review & Confirm */}
          {phase === 'review' && parsed && (
            <motion.div
              key="review"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-brand-purple" />
                  <span className="text-sm font-semibold text-white">Review & Confirm</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                    parsed.confidence_score >= 0.9
                      ? 'bg-green-500/15 text-green-400'
                      : 'bg-amber-500/15 text-amber-400'
                  }`}>
                    {Math.round(parsed.confidence_score * 100)}% confidence
                  </span>
                  <button onClick={reset} className="text-surface-400 hover:text-white transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Date & Payment */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-surface-500 font-semibold">Date</label>
                  <input
                    type="date"
                    value={parsed.date}
                    onChange={(e) => setParsed({ ...parsed, date: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-surface-700 bg-surface-950/50 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-purple/40 focus:border-brand-purple/60"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-surface-500 font-semibold">Payment Method</label>
                  <input
                    type="text"
                    value={parsed.payment_method}
                    onChange={(e) => setParsed({ ...parsed, payment_method: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-surface-700 bg-surface-950/50 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-purple/40 focus:border-brand-purple/60"
                  />
                </div>
              </div>

              {/* Items Table */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase tracking-wider text-surface-500 font-semibold">Items</span>
                  <button
                    onClick={addItem}
                    className="flex items-center gap-1 text-xs text-brand-purple hover:text-brand-purple-light transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add item
                  </button>
                </div>
                <div className="space-y-2">
                  {parsed.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => updateItem(idx, 'name', e.target.value)}
                        placeholder="Item name"
                        className="flex-1 rounded-lg border border-surface-700 bg-surface-950/50 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-purple/40"
                      />
                      <input
                        type="number"
                        value={item.qty}
                        onChange={(e) => updateItem(idx, 'qty', Number(e.target.value))}
                        className="w-16 rounded-lg border border-surface-700 bg-surface-950/50 px-2 py-2 text-sm text-white text-center focus:outline-none focus:ring-2 focus:ring-brand-purple/40"
                      />
                      <input
                        type="number"
                        step="0.10"
                        value={item.price}
                        onChange={(e) => updateItem(idx, 'price', Number(e.target.value))}
                        className="w-24 rounded-lg border border-surface-700 bg-surface-950/50 px-2 py-2 text-sm text-white text-right focus:outline-none focus:ring-2 focus:ring-brand-purple/40"
                      />
                      <button
                        onClick={() => removeItem(idx)}
                        className="text-surface-500 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-surface-950/60 border border-surface-800">
                <span className="text-xs text-surface-400 font-medium">Total Amount</span>
                <span className="text-lg font-bold text-white">RM {parsed.total_amount.toFixed(2)}</span>
              </div>

              {/* Save Button */}
              <button
                onClick={save}
                disabled={saved}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-brand-purple to-brand-blue text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-lg disabled:opacity-70"
              >
                {saved ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Saved to Dashboard
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save to Micro Dashboard
                  </>
                )}
              </button>
              <p className="text-center text-[10px] text-surface-500">
                <Edit3 className="w-3 h-3 inline mr-1" />
                Tap any field to edit before saving — no technical skills needed.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
