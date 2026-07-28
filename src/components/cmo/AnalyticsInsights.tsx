import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart3,
  Upload,
  FileSpreadsheet,
  TrendingUp,
  TrendingDown,
  Rocket,
  Loader2,
  X,
  Sparkles,
} from 'lucide-react';
import { useCmoStore, localeCurrency } from '../../lib/cmoStore';

interface Insight {
  type: 'winning' | 'bleeding' | 'next';
  title: string;
  body: string;
  metric?: string;
  value?: string;
}

function generateInsights(dna: ReturnType<typeof useCmoStore>['brandDNA']): Insight[] {
  const currency = localeCurrency[dna.locale];
  return [
    {
      type: 'winning',
      title: "What's Winning — Scale Up",
      body: `Ad Set B has a 3.4x ROAS — increase budget by 20%.`,
      metric: 'ROAS',
      value: '3.4x',
    },
    {
      type: 'winning',
      title: 'Retargeting is converting',
      body: `Retargeting past buyers campaign has 2.1x ROAS with ${currency}0.85 CPC. Double the audience size by adding lookalikes.`,
      metric: 'CPC',
      value: `${currency}0.85`,
    },
    {
      type: 'bleeding',
      title: "What's Bleeding — Kill / Pivot",
      body: `Ad Set A CTR dropped under 0.8% — pause immediately.`,
      metric: 'CTR',
      value: '0.7%',
    },
    {
      type: 'bleeding',
      title: 'Cold traffic is wasting spend',
      body: `Top-of-funnel campaign has ${currency}4.20 CPC (industry avg: ${currency}1.50). Pivot budget to warm audiences.`,
      metric: 'CPC',
      value: `${currency}4.20`,
    },
    {
      type: 'next',
      title: 'Recommended Next Move',
      body: `Reallocate ${currency}500 from Ad Set A into retargeting past buyers.`,
      metric: 'Reallocation',
      value: `${currency}500`,
    },
    {
      type: 'next',
      title: 'Test new creative angle',
      body: `Your UVP-driven creatives outperform generic ones by 45%. Generate 3 new variants using the Asset Generator (Tab 3).`,
      metric: 'Lift',
      value: '+45%',
    },
  ];
}

const insightStyles: Record<string, { icon: typeof TrendingUp; border: string; bg: string; color: string; emoji: string }> = {
  winning: { icon: TrendingUp, border: 'border-green-500/30', bg: 'bg-green-500/5', color: 'text-green-400', emoji: '🟢' },
  bleeding: { icon: TrendingDown, border: 'border-red-500/30', bg: 'bg-red-500/5', color: 'text-red-400', emoji: '🔴' },
  next: { icon: Rocket, border: 'border-brand-blue/30', bg: 'bg-brand-blue/5', color: 'text-brand-blue', emoji: '🚀' },
};

export function AnalyticsInsights() {
  const { brandDNA } = useCmoStore();
  const [fileName, setFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [insights, setInsights] = useState<Insight[] | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return;
    setFileName(files[0].name);
    setParsing(true);
    setInsights(null);
    setTimeout(() => {
      setInsights(generateInsights(brandDNA));
      setParsing(false);
    }, 1800);
  }, [brandDNA]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(e.type === 'dragenter' || e.type === 'dragover');
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const reset = () => {
    setFileName(null);
    setInsights(null);
    setParsing(false);
  };

  return (
    <div className="space-y-6">
      {/* Dropzone */}
      <div className="rounded-2xl border border-surface-800 bg-surface-900/50 overflow-hidden">
        <div className="flex items-center gap-2.5 px-5 py-4 border-b border-surface-800">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <BarChart3 className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Performance Data Ingestion</h3>
            <p className="text-xs text-surface-500">Upload Meta Ads, Google Ads, or Shopee/WooCommerce CSV exports</p>
          </div>
        </div>

        <div className="p-5">
          <input
            ref={fileRef}
            type="file"
            accept=".csv,.xlsx,.xls"
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />

          {!fileName ? (
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}
              className={`relative cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-all duration-300 ${
                isDragging
                  ? 'border-emerald-500 bg-emerald-500/5 scale-[1.02]'
                  : 'border-surface-700 bg-surface-950/40 hover:border-surface-600 hover:bg-surface-800/40'
              }`}
            >
              <FileSpreadsheet className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
              <p className="text-sm font-medium text-white mb-1">Drop your CSV or click to upload</p>
              <p className="text-xs text-surface-500">Supports Meta Ads, Google Ads, Shopee, WooCommerce exports</p>
            </div>
          ) : (
            <div className="flex items-center justify-between p-4 rounded-xl border border-surface-700 bg-surface-950/40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center">
                  <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{fileName}</p>
                  <p className="text-xs text-surface-500">
                    {parsing ? 'Parsing and analyzing...' : insights ? 'Analysis complete' : 'Ready'}
                  </p>
                </div>
              </div>
              <button onClick={reset} className="text-surface-500 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Parsing State */}
      <AnimatePresence>
        {parsing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-12"
          >
            <Loader2 className="w-8 h-8 text-emerald-400 animate-spin mb-3" />
            <p className="text-sm text-surface-400">Translating numbers into business insights...</p>
            <p className="text-xs text-surface-600 mt-1">Analyzing ROAS, CTR, CPC, and Bounce Rate</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Insights */}
      <AnimatePresence>
        {insights && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-semibold text-white">Plain-English Business Insights</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {insights.map((insight, i) => {
                const style = insightStyles[insight.type];
                const Icon = style.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.08 }}
                    className={`rounded-2xl border ${style.border} ${style.bg} p-5`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-lg ${style.bg} border ${style.border} flex items-center justify-center`}>
                          <Icon className={`w-4 h-4 ${style.color}`} />
                        </div>
                        <span className="text-xs font-semibold text-white">{insight.title}</span>
                      </div>
                      {insight.value && (
                        <span className={`px-2 py-0.5 rounded-md ${style.bg} ${style.color} text-xs font-bold`}>
                          {insight.value}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-surface-200 leading-relaxed">{insight.body}</p>
                  </motion.div>
                );
              })}
            </div>

            {/* Summary metrics strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Avg ROAS', value: '2.8x', color: 'text-green-400' },
                { label: 'Avg CTR', value: '1.4%', color: 'text-amber-400' },
                { label: 'Avg CPC', value: `${localeCurrency[brandDNA.locale]}1.20`, color: 'text-brand-blue' },
                { label: 'Bounce Rate', value: '38%', color: 'text-red-400' },
              ].map((m, i) => (
                <div key={i} className="rounded-xl border border-surface-800 bg-surface-950/40 p-3 text-center">
                  <p className="text-lg font-bold text-white">{m.value}</p>
                  <p className="text-[10px] text-surface-500 uppercase tracking-wider">{m.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!insights && !parsing && (
        <div className="rounded-2xl border border-surface-800 bg-surface-900/30 p-12 text-center">
          <BarChart3 className="w-10 h-10 text-surface-700 mx-auto mb-3" />
          <p className="text-sm text-surface-400">Upload a performance CSV to generate plain-English insights.</p>
          <p className="text-xs text-surface-600 mt-1">We translate ROAS, CTR, CPC into "scale up", "kill", and "next move" actions.</p>
        </div>
      )}
    </div>
  );
}
