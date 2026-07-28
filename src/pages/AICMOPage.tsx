import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  CalendarDays,
  Wand2,
  Stethoscope,
  BarChart3,
  Bot,
} from 'lucide-react';
import { BrandGuardian } from '../components/cmo/BrandGuardian';
import { ContentPlanner } from '../components/cmo/ContentPlanner';
import { AssetGenerator } from '../components/cmo/AssetGenerator';
import { CampaignAuditor } from '../components/cmo/CampaignAuditor';
import { AnalyticsInsights } from '../components/cmo/AnalyticsInsights';

type TabId = 'brand' | 'content' | 'assets' | 'auditor' | 'analytics';

const tabs: { id: TabId; label: string; icon: typeof Shield; desc: string }[] = [
  { id: 'brand', label: 'Brand Guardian', icon: Shield, desc: 'Define DNA & audit copy' },
  { id: 'content', label: 'Content Engine', icon: CalendarDays, desc: '7-day calendar planner' },
  { id: 'assets', label: 'Asset Generator', icon: Wand2, desc: 'Multi-format copy creation' },
  { id: 'auditor', label: 'Campaign Auditor', icon: Stethoscope, desc: 'Score & optimize copy' },
  { id: 'analytics', label: 'Analytics Insights', icon: BarChart3, desc: 'Translate numbers to actions' },
];

export function AICMOPage() {
  const [activeTab, setActiveTab] = useState<TabId>('brand');

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-1">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-blue/20 to-emerald-500/20 border border-brand-blue/30 flex items-center justify-center">
            <Bot className="w-5 h-5 text-brand-blue" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">AI CMO Agent</h1>
            <p className="text-surface-400 text-sm">
              Your autonomous marketing department — brand, content, assets, audits, and analytics.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Tab Bar */}
      <div className="flex items-center gap-1 overflow-x-auto rounded-2xl border border-surface-800 bg-surface-900/50 p-1.5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-surface-800 text-white shadow-lg'
                  : 'text-surface-400 hover:text-surface-200 hover:bg-surface-800/50'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-brand-blue' : ''}`} />
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>

      {/* Active Tab Description */}
      <div className="flex items-center gap-2 text-xs text-surface-500">
        <span className="font-semibold text-surface-300 uppercase tracking-wider">
          {tabs.find((t) => t.id === activeTab)?.label}
        </span>
        <span>·</span>
        <span>{tabs.find((t) => t.id === activeTab)?.desc}</span>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
        >
          {activeTab === 'brand' && <BrandGuardian />}
          {activeTab === 'content' && <ContentPlanner />}
          {activeTab === 'assets' && <AssetGenerator />}
          {activeTab === 'auditor' && <CampaignAuditor />}
          {activeTab === 'analytics' && <AnalyticsInsights />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
