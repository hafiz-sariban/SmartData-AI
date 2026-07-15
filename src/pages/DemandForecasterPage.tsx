import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PackageSearch,
  Calendar,
  TrendingUp,
  AlertTriangle,
  Warehouse,
  Clock,
  ChevronDown,
  Flame,
  ShoppingBag,
  Gift,
  Sparkles,
  ArrowUpRight,
  ArrowRight,
} from 'lucide-react';

interface ForecastEvent {
  id: string;
  name: string;
  icon: typeof Flame;
  dateLabel: string;
  daysOut: number;
  demandIndex: number;
  color: string;
  bg: string;
  border: string;
  skus: SkuRow[];
  capacityWarning: {
    overflowPercent: number;
    recommendation: string;
  };
}

interface SkuRow {
  name: string;
  sku: string;
  surgePercent: number;
  stockIncrease: number;
  risk: 'low' | 'medium' | 'high';
  currentStock: number;
}

const events: ForecastEvent[] = [
  {
    id: 'hari-raya',
    name: 'Hari Raya Aidilfitri Forecast',
    icon: Flame,
    dateLabel: 'Eid al-Fitr 2026',
    daysOut: 42,
    demandIndex: 94,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    skus: [
      { name: 'Premium Baju Kurung Set', sku: 'BK-2026-001', surgePercent: 180, stockIncrease: 450, risk: 'high', currentStock: 120 },
      { name: 'Kuih Raya Gift Box (Assorted)', sku: 'KR-GIFT-050', surgePercent: 145, stockIncrease: 320, risk: 'high', currentStock: 80 },
      { name: 'Festive Home Decor Bundle', sku: 'HD-RAYA-014', surgePercent: 95, stockIncrease: 210, risk: 'medium', currentStock: 65 },
      { name: 'Men\'s Baju Melayu Premium', sku: 'BM-MEN-008', surgePercent: 88, stockIncrease: 180, risk: 'medium', currentStock: 90 },
      { name: 'Raya Cookie Sampler Pack', sku: 'CK-SMP-022', surgePercent: 72, stockIncrease: 150, risk: 'low', currentStock: 140 },
      { name: 'Traditional Songkok Collection', sku: 'SG-TRD-003', surgePercent: 60, stockIncrease: 95, risk: 'low', currentStock: 50 },
    ],
    capacityWarning: {
      overflowPercent: 35,
      recommendation:
        'Warehouse Capacity Warning: Projected stock volume will exceed current storage baseline by 35%. Recommendation: Secure a 30-day temporary fulfillment space or schedule rolling vendor drop-shipments.',
    },
  },
  {
    id: '11-11',
    name: '11.11 Mega Sale Forecast',
    icon: ShoppingBag,
    dateLabel: 'November 11, 2026',
    daysOut: 119,
    demandIndex: 88,
    color: 'text-brand-blue',
    bg: 'bg-brand-blue/10',
    border: 'border-brand-blue/30',
    skus: [
      { name: 'Wireless Earbuds Pro (Gen 3)', sku: 'WE-PRO-003', surgePercent: 210, stockIncrease: 600, risk: 'high', currentStock: 200 },
      { name: 'Smart Home Hub Mini', sku: 'SH-HUB-012', surgePercent: 165, stockIncrease: 380, risk: 'high', currentStock: 110 },
      { name: 'Portable Power Bank 20K', sku: 'PB-20K-007', surgePercent: 120, stockIncrease: 280, risk: 'medium', currentStock: 150 },
      { name: 'Phone Case Bundle (Top 10)', sku: 'PC-BDL-045', surgePercent: 85, stockIncrease: 190, risk: 'medium', currentStock: 300 },
      { name: 'USB-C Fast Charger Kit', sku: 'UC-CHG-019', surgePercent: 68, stockIncrease: 140, risk: 'low', currentStock: 220 },
      { name: 'Screen Protector Multi-Pack', sku: 'SP-MUL-031', surgePercent: 52, stockIncrease: 100, risk: 'low', currentStock: 400 },
    ],
    capacityWarning: {
      overflowPercent: 28,
      recommendation:
        'Warehouse Capacity Warning: Projected stock volume will exceed current storage baseline by 28%. Recommendation: Secure a 30-day temporary fulfillment space or schedule rolling vendor drop-shipments.',
    },
  },
  {
    id: 'year-end',
    name: 'Year-End Clearance',
    icon: Gift,
    dateLabel: 'December 2026',
    daysOut: 160,
    demandIndex: 76,
    color: 'text-green-400',
    bg: 'bg-green-500/10',
    border: 'border-green-500/30',
    skus: [
      { name: 'Gift Set Premium Hamper', sku: 'GH-PRM-001', surgePercent: 155, stockIncrease: 350, risk: 'high', currentStock: 90 },
      { name: 'Festive Greeting Card Pack', sku: 'GC-PCK-024', surgePercent: 110, stockIncrease: 240, risk: 'medium', currentStock: 180 },
      { name: 'Year-End Combo Bundle', sku: 'CB-YE-018', surgePercent: 92, stockIncrease: 200, risk: 'medium', currentStock: 75 },
      { name: 'Clearance Mystery Box', sku: 'MB-CLR-009', surgePercent: 78, stockIncrease: 160, risk: 'low', currentStock: 60 },
      { name: 'Holiday Season Decoration Kit', sku: 'HD-HOL-033', surgePercent: 65, stockIncrease: 120, risk: 'low', currentStock: 100 },
    ],
    capacityWarning: {
      overflowPercent: 18,
      recommendation:
        'Warehouse Capacity Warning: Projected stock volume will exceed current storage baseline by 18%. Recommendation: Optimize vertical racking and consolidate slow-moving SKUs to free aisle space.',
    },
  },
];

const riskStyles: Record<string, { label: string; color: string; bg: string; border: string }> = {
  high: { label: 'High', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30' },
  medium: { label: 'Medium', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30' },
  low: { label: 'Low', color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/30' },
};

export function DemandForecasterPage() {
  const [selectedId, setSelectedId] = useState(events[0].id);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const selected = events.find((e) => e.id === selectedId)!;
  const SelectedIcon = selected.icon;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-1">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-blue/20 to-green-500/20 border border-brand-blue/30 flex items-center justify-center">
            <PackageSearch className="w-5 h-5 text-brand-blue" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Seasonal Demand Forecaster</h1>
            <p className="text-surface-400 text-sm">
              Predictive supply chain and stock orchestration based on multi-year historical festival cycles.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Target Event Selector */}
      <div className="relative">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="w-full flex items-center justify-between gap-3 px-5 py-4 rounded-2xl border border-surface-800 bg-surface-900/50 hover:border-surface-700 hover:bg-surface-800/50 transition-all duration-300"
        >
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${selected.bg} ${selected.border} border flex items-center justify-center`}>
              <SelectedIcon className={`w-5 h-5 ${selected.color}`} />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-white">{selected.name}</p>
              <p className="text-xs text-surface-400">
                {selected.dateLabel} &middot; {selected.daysOut} days out &middot; Demand Index: {selected.demandIndex}
              </p>
            </div>
          </div>
          <ChevronDown className={`w-5 h-5 text-surface-400 transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        <AnimatePresence>
          {dropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute z-20 mt-2 w-full rounded-2xl border border-surface-800 bg-surface-900 shadow-2xl overflow-hidden"
            >
              {events.map((event) => {
                const Icon = event.icon;
                const isSelected = event.id === selectedId;
                return (
                  <button
                    key={event.id}
                    onClick={() => {
                      setSelectedId(event.id);
                      setDropdownOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-5 py-3.5 text-left transition-colors duration-200 ${
                      isSelected ? 'bg-surface-800/70' : 'hover:bg-surface-800/50'
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-lg ${event.bg} ${event.border} border flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-4 h-4 ${event.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white">{event.name}</p>
                      <p className="text-xs text-surface-500">
                        {event.dateLabel} &middot; {event.daysOut} days out
                      </p>
                    </div>
                    {isSelected && <div className="w-2 h-2 rounded-full bg-brand-blue" />}
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Countdown Banner */}
      <motion.div
        key={selected.id}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className={`rounded-2xl border ${selected.border} ${selected.bg} p-5`}
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl ${selected.bg} ${selected.border} border flex items-center justify-center`}>
              <Clock className={`w-6 h-6 ${selected.color}`} />
            </div>
            <div>
              <p className="text-xs text-surface-400 uppercase tracking-wider mb-0.5">Time to Event Spike</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-white">{selected.daysOut}</span>
                <span className="text-sm text-surface-300">days remaining</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{selected.demandIndex}</p>
              <p className="text-[10px] text-surface-500 uppercase tracking-wider">Demand Index</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{selected.skus.length}</p>
              <p className="text-[10px] text-surface-500 uppercase tracking-wider">SKUs Tracked</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-amber-400">+{selected.capacityWarning.overflowPercent}%</p>
              <p className="text-[10px] text-surface-500 uppercase tracking-wider">Cap. Overflow</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Component A: SKU Procurement Blueprint */}
      <motion.div
        key={`skus-${selected.id}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-2xl border border-surface-800 bg-surface-900/50 overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-brand-blue" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">SKU Procurement Blueprint</h3>
              <p className="text-xs text-surface-500">High-velocity items predicted for {selected.dateLabel}</p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-lg bg-surface-800 text-surface-300 text-xs font-medium">
            {selected.skus.length} items
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-800 bg-surface-950/30">
                <th className="text-left px-6 py-3 text-[11px] font-semibold text-surface-400 uppercase tracking-wider">
                  Product Name / SKU
                </th>
                <th className="text-right px-4 py-3 text-[11px] font-semibold text-surface-400 uppercase tracking-wider">
                  Predicted Demand Surge
                </th>
                <th className="text-right px-4 py-3 text-[11px] font-semibold text-surface-400 uppercase tracking-wider">
                  Recommended Stock Increase
                </th>
                <th className="text-center px-4 py-3 text-[11px] font-semibold text-surface-400 uppercase tracking-wider">
                  Risk Factor
                </th>
              </tr>
            </thead>
            <tbody>
              {selected.skus.map((sku, i) => {
                const risk = riskStyles[sku.risk];
                return (
                  <motion.tr
                    key={sku.sku}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b border-surface-800/50 last:border-0 hover:bg-surface-800/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-surface-800 border border-surface-700 flex items-center justify-center flex-shrink-0">
                          <PackageSearch className="w-4 h-4 text-surface-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{sku.name}</p>
                          <p className="text-xs text-surface-500 font-mono">{sku.sku}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <ArrowUpRight className="w-3.5 h-3.5 text-amber-400" />
                        <span className="text-sm font-bold text-amber-400">+{sku.surgePercent}%</span>
                      </div>
                      {/* Mini surge bar */}
                      <div className="mt-1.5 w-24 h-1.5 rounded-full bg-surface-800 overflow-hidden ml-auto">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-amber-500 to-red-500"
                          style={{ width: `${Math.min(sku.surgePercent / 2.5, 100)}%` }}
                        />
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <span className="text-sm font-semibold text-white">+{sku.stockIncrease}</span>
                      <span className="text-xs text-surface-500 ml-1.5">units</span>
                      <p className="text-[10px] text-surface-600 mt-0.5">Current: {sku.currentStock}</p>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border ${risk.bg} ${risk.border} ${risk.color} text-xs font-semibold`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${risk.color.replace('text-', 'bg-')}`} />
                        {risk.label}
                      </span>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Component B: Temporary Capacity Planner */}
      <motion.div
        key={`capacity-${selected.id}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="rounded-2xl border border-red-500/30 bg-gradient-to-r from-red-500/10 via-red-500/5 to-transparent overflow-hidden"
      >
        <div className="absolute" />
        <div className="p-6 space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center justify-center flex-shrink-0">
              <Warehouse className="w-6 h-6 text-red-400" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 rounded-md bg-red-500/20 text-red-400 text-[10px] font-bold tracking-wider">
                  CAPACITY ALERT
                </span>
                <span className="text-xs text-surface-500">Auto-detected by forecast engine</span>
              </div>
              <p className="text-sm text-white leading-relaxed font-medium">
                {selected.capacityWarning.recommendation}
              </p>
            </div>
          </div>

          {/* Capacity Visualization */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
            <div className="rounded-xl border border-surface-800 bg-surface-950/40 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Warehouse className="w-4 h-4 text-surface-400" />
                <span className="text-xs text-surface-400 font-medium">Current Baseline</span>
              </div>
              <p className="text-xl font-bold text-white">100%</p>
              <div className="mt-2 h-2 rounded-full bg-surface-800 overflow-hidden">
                <div className="h-full w-full rounded-full bg-surface-600" />
              </div>
            </div>
            <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-red-400" />
                <span className="text-xs text-red-400 font-medium">Projected Volume</span>
              </div>
              <p className="text-xl font-bold text-red-400">{100 + selected.capacityWarning.overflowPercent}%</p>
              <div className="mt-2 h-2 rounded-full bg-surface-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-500 to-red-500"
                  style={{ width: '100%' }}
                />
              </div>
            </div>
            <div className="rounded-xl border border-surface-800 bg-surface-950/40 p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span className="text-xs text-amber-400 font-medium">Overflow</span>
              </div>
              <p className="text-xl font-bold text-amber-400">+{selected.capacityWarning.overflowPercent}%</p>
              <p className="text-[10px] text-surface-500 mt-1">Above storage capacity</p>
            </div>
          </div>

          {/* Action Recommendations */}
          <div className="flex flex-col sm:flex-row gap-3 pt-1">
            <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-red-500 text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-lg">
              <Sparkles className="w-4 h-4" />
              Generate Procurement Plan
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-surface-700 bg-surface-800/50 text-surface-200 text-sm font-semibold hover:bg-surface-800 hover:text-white transition-all">
              <ArrowRight className="w-4 h-4" />
              Contact Fulfillment Partner
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
