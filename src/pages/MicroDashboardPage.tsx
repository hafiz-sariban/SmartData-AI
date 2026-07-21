import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Smartphone,
  Wallet,
  TrendingUp,
  AlertTriangle,
  CalendarClock,
  Receipt,
  Mic,
  ScanLine,
  Sparkles,
  Zap,
  ArrowRight,
  Package,
  Banknote,
  Clock,
  CheckCircle2,
  Database,
} from 'lucide-react';
import { useMicroStore, getSectorBenchmarks } from '../lib/microStore';
import { MicroOCRUpload } from '../components/MicroOCRUpload';
import { VoiceChatIngest } from '../components/VoiceChatIngest';
import { ColdStartWizard } from '../components/ColdStartWizard';

export function MicroDashboardPage() {
  const { transactions, coldStartProfile } = useMicroStore();
  const [wizardOpen, setWizardOpen] = useState(false);

  const sector = coldStartProfile?.sector ?? 'F&B Hawker';
  const benchmarks = getSectorBenchmarks(sector);

  const stats = useMemo(() => {
    const totalRevenue = transactions.reduce((s, t) => s + t.total_amount, 0);
    const avgDaily = transactions.length > 0 ? totalRevenue / Math.max(transactions.length, 1) : 0;
    const last7 = transactions
      .filter((t) => {
        const d = new Date(t.date);
        return d >= new Date(Date.now() - 7 * 86400000);
      })
      .reduce((s, t) => s + t.total_amount, 0);
    return { totalRevenue, avgDaily, last7, count: transactions.length };
  }, [transactions]);

  // Insight Card A: Dead Stock
  const deadStock = benchmarks.deadStock[0];

  // Insight Card B: Cash Flow Guardrail
  const projectedShortfall = Math.max(0, benchmarks.supplierBill - stats.last7 * (benchmarks.daysToBill / 7));

  // Insight Card C: Peak Sales Forecast
  const peakDay = benchmarks.peakDay;
  const peakUplift = benchmarks.peakUplift;

  const hasData = transactions.length > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-1">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500/20 to-brand-blue/20 border border-green-500/30 flex items-center justify-center">
            <Smartphone className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Micro-Business Dashboard</h1>
            <p className="text-surface-400 text-sm">
              Zero-Barrier Data Ingestion & Action-First Insights for Malaysian Micro-Enterprises
            </p>
          </div>
        </div>
      </motion.div>

      {/* Cold-Start Banner */}
      {!coldStartProfile && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-brand-blue/30 bg-gradient-to-r from-brand-blue/10 to-brand-purple/5 p-5 flex items-center justify-between flex-wrap gap-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-blue/15 border border-brand-blue/25 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-brand-blue" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">No data yet? Start with a Cold-Start Baseline</p>
              <p className="text-xs text-surface-400">
                Answer 3 quick questions and we'll generate a 14-day synthetic dataset from local benchmarks.
              </p>
            </div>
          </div>
          <button
            onClick={() => setWizardOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-blue to-brand-purple text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-lg"
          >
            <Zap className="w-4 h-4" />
            Start Cold-Start Wizard
          </button>
        </motion.div>
      )}

      {coldStartProfile && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-green-500/20 bg-green-500/5 p-4 flex items-center gap-3"
        >
          <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm text-white font-medium">
              Baseline active: {coldStartProfile.sector} in {coldStartProfile.district}
            </p>
            <p className="text-xs text-surface-400">
              14-day synthetic baseline generated · Avg RM {coldStartProfile.avgDailyRevenue}/day · Peak days: {coldStartProfile.busiestDays.join(', ')}
            </p>
          </div>
          <button
            onClick={() => setWizardOpen(true)}
            className="text-xs text-brand-blue hover:text-brand-blue-light transition-colors"
          >
            Re-run
          </button>
        </motion.div>
      )}

      {/* Ingestion Suite */}
      <div>
        <h2 className="text-sm font-semibold text-surface-300 uppercase tracking-wider mb-3">
          Zero-Barrier Data Ingestion
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <MicroOCRUpload />
          <VoiceChatIngest />
        </div>
      </div>

      {/* Action-First Insight Cards */}
      <div>
        <h2 className="text-sm font-semibold text-surface-300 uppercase tracking-wider mb-3">
          Action-First Insights
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card A: Dead Stock Alert */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-transparent p-5"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 rounded-lg bg-amber-500/15 border border-amber-500/25 flex items-center justify-center">
                <Package className="w-4.5 h-4.5 text-amber-400" />
              </div>
              <span className="px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-400 text-[10px] font-bold tracking-wider">
                DEAD STOCK
              </span>
            </div>
            <h3 className="text-sm font-semibold text-white mb-2">"Untapped Cash" Alert</h3>
            <p className="text-sm text-surface-200 leading-relaxed mb-3">
              <span className="font-bold text-amber-400">RM{deadStock.tiedUpValue}</span> tied up in{' '}
              <span className="font-semibold text-white">{deadStock.name}</span> — run a bundle promo with{' '}
              <span className="font-semibold text-white">{deadStock.bundlePartner}</span> to free up cash flow.
            </p>
            <button className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-400 text-xs font-semibold hover:bg-amber-500/20 transition-colors">
              <Zap className="w-3.5 h-3.5" />
              Generate Bundle Promo
            </button>
          </motion.div>

          {/* Card B: Cash Flow Guardrail */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`rounded-2xl border p-5 ${
              projectedShortfall > 0
                ? 'border-red-500/30 bg-gradient-to-br from-red-500/10 to-transparent'
                : 'border-green-500/30 bg-gradient-to-br from-green-500/10 to-transparent'
            }`}
          >
            <div className="flex items-center gap-2 mb-3">
              <div className={`w-9 h-9 rounded-lg border flex items-center justify-center ${
                projectedShortfall > 0
                  ? 'bg-red-500/15 border-red-500/25'
                  : 'bg-green-500/15 border-green-500/25'
              }`}>
                <Wallet className={`w-4.5 h-4.5 ${projectedShortfall > 0 ? 'text-red-400' : 'text-green-400'}`} />
              </div>
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wider ${
                projectedShortfall > 0
                  ? 'bg-red-500/15 text-red-400'
                  : 'bg-green-500/15 text-green-400'
              }`}>
                CASH FLOW
              </span>
            </div>
            <h3 className="text-sm font-semibold text-white mb-2">Cash Flow Guardrail</h3>
            <p className="text-sm text-surface-200 leading-relaxed mb-3">
              <span className="font-bold text-white">RM{benchmarks.supplierBill.toLocaleString()}</span> supplier bill due in{' '}
              <span className={`font-bold ${projectedShortfall > 0 ? 'text-red-400' : 'text-green-400'}`}>
                {benchmarks.daysToBill} days
              </span>{' '}
              —{' '}
              {projectedShortfall > 0 ? (
                <>
                  projected to be <span className="font-bold text-red-400">RM{Math.round(projectedShortfall)} short</span> based on current sales speed.
                </>
              ) : (
                <span className="text-green-400">you're on track to cover it.</span>
              )}
            </p>
            <button className={`w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-semibold transition-colors ${
              projectedShortfall > 0
                ? 'border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20'
                : 'border-green-500/30 bg-green-500/10 text-green-400 hover:bg-green-500/20'
            }`}>
              <Banknote className="w-3.5 h-3.5" />
              {projectedShortfall > 0 ? 'Plan Cash Recovery' : 'View Cash Forecast'}
            </button>
          </motion.div>

          {/* Card C: Peak Sales Forecast */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-2xl border border-brand-blue/30 bg-gradient-to-br from-brand-blue/10 to-transparent p-5"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 rounded-lg bg-brand-blue/15 border border-brand-blue/25 flex items-center justify-center">
                <TrendingUp className="w-4.5 h-4.5 text-brand-blue" />
              </div>
              <span className="px-2 py-0.5 rounded-md bg-brand-blue/15 text-brand-blue text-[10px] font-bold tracking-wider">
                PEAK FORECAST
              </span>
            </div>
            <h3 className="text-sm font-semibold text-white mb-2">Peak Sales Forecast</h3>
            <p className="text-sm text-surface-200 leading-relaxed mb-3">
              <span className="font-bold text-brand-blue">{peakDay}</span> sales jump{' '}
              <span className="font-bold text-white">+{peakUplift}%</span> based on local {sector.split(' ')[0]} sector benchmarks —{' '}
              <span className="font-semibold text-white">prepare extra stock</span>.
            </p>
            <button className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-brand-blue/30 bg-brand-blue/10 text-brand-blue text-xs font-semibold hover:bg-brand-blue/20 transition-colors">
              <CalendarClock className="w-3.5 h-3.5" />
              Set Stock Reminder
            </button>
          </motion.div>
        </div>
      </div>

      {/* Recent Transactions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="rounded-2xl border border-surface-800 bg-surface-900/50 overflow-hidden"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-surface-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-surface-800 border border-surface-700 flex items-center justify-center">
              <Receipt className="w-4 h-4 text-surface-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Recent Transactions</h3>
              <p className="text-xs text-surface-500">
                {hasData ? `${stats.count} records · RM ${stats.totalRevenue.toFixed(2)} total` : 'No transactions yet'}
              </p>
            </div>
          </div>
          {hasData && (
            <div className="flex items-center gap-1.5 text-xs text-surface-400">
              <Database className="w-3.5 h-3.5" />
              Live data
            </div>
          )}
        </div>

        {hasData ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-surface-800 bg-surface-950/30">
                  <th className="text-left px-5 py-2.5 text-[11px] font-semibold text-surface-400 uppercase tracking-wider">Date</th>
                  <th className="text-left px-4 py-2.5 text-[11px] font-semibold text-surface-400 uppercase tracking-wider">Items</th>
                  <th className="text-left px-4 py-2.5 text-[11px] font-semibold text-surface-400 uppercase tracking-wider">Payment</th>
                  <th className="text-left px-4 py-2.5 text-[11px] font-semibold text-surface-400 uppercase tracking-wider">Source</th>
                  <th className="text-right px-5 py-2.5 text-[11px] font-semibold text-surface-400 uppercase tracking-wider">Total</th>
                </tr>
              </thead>
              <tbody>
                {transactions.slice(0, 8).map((tx, i) => (
                  <motion.tr
                    key={tx.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="border-b border-surface-800/50 last:border-0 hover:bg-surface-800/30 transition-colors"
                  >
                    <td className="px-5 py-3 text-surface-300 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-surface-600" />
                        {new Date(tx.date).toLocaleDateString('en-MY', { day: 'numeric', month: 'short' })}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-surface-300 max-w-xs">
                      <p className="text-xs truncate">
                        {tx.items.map((it) => `${it.qty}x ${it.name}`).join(', ')}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-md bg-surface-800 text-surface-300 text-xs font-medium">
                        {tx.payment_method}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 text-xs ${
                        tx.source === 'ocr' ? 'text-brand-purple' :
                        tx.source === 'voice' ? 'text-green-400' : 'text-brand-blue'
                      }`}>
                        {tx.source === 'ocr' && <ScanLine className="w-3 h-3" />}
                        {tx.source === 'voice' && <Mic className="w-3 h-3" />}
                        {tx.source === 'cold-start' && <Sparkles className="w-3 h-3" />}
                        {tx.source === 'ocr' ? 'OCR' : tx.source === 'voice' ? 'Voice' : 'Baseline'}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right font-semibold text-white whitespace-nowrap">
                      RM {tx.total_amount.toFixed(2)}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-5 py-12 text-center">
            <div className="w-12 h-12 rounded-xl bg-surface-800 border border-surface-700 flex items-center justify-center mx-auto mb-3">
              <Receipt className="w-6 h-6 text-surface-600" />
            </div>
            <p className="text-sm text-surface-400 mb-1">No transactions yet</p>
            <p className="text-xs text-surface-500 mb-4">
              Upload a receipt photo, type your sales in the chat, or run the Cold-Start Wizard to begin.
            </p>
            <button
              onClick={() => setWizardOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-surface-700 bg-surface-800/50 text-surface-200 text-xs font-medium hover:bg-surface-800 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-brand-blue" />
              Try the Cold-Start Wizard
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </motion.div>

      <ColdStartWizard open={wizardOpen} onClose={() => setWizardOpen(false)} />
    </div>
  );
}
