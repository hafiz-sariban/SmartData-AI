import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Megaphone,
  Star,
  Crown,
  MessageCircle,
  Download,
  Send,
  ChevronRight,
  Zap,
  Target,
  Users,
  TrendingUp,
  CheckCircle2,
} from 'lucide-react';

interface StrategyCard {
  id: number;
  icon: typeof Star;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  actionLabel: string;
  actionIcon: typeof MessageCircle;
  color: string;
  bgColor: string;
  borderColor: string;
}

const strategies: StrategyCard[] = [
  {
    id: 1,
    icon: Star,
    title: 'Immediate Action: Legacy Stars Cluster',
    titleEn: 'Immediate Action: Legacy Stars Cluster',
    description:
      'This cluster has not purchased in 3 months but has high historical spend. Send a 15% loyalty discount campaign via WhatsApp to recover lost sales.',
    descriptionEn:
      'This cluster has not purchased in 3 months but has high historical spend. Send a 15% loyalty discount campaign via WhatsApp to recover lost sales.',
    actionLabel: 'Export List to WhatsApp Blast',
    actionIcon: MessageCircle,
    color: 'text-blue-400',
    bgColor: 'from-blue-500/10 to-blue-500/5',
    borderColor: 'border-blue-500/20',
  },
  {
    id: 2,
    icon: Crown,
    title: 'Action: Champions Cluster',
    titleEn: 'Action: Champions Cluster',
    description:
      'This cluster buys every week. Launch an "Early Access" campaign for new products to maintain momentum.',
    descriptionEn:
      'This cluster buys every week. Launch an "Early Access" campaign for new products to maintain momentum.',
    actionLabel: 'Export Cost to FB Ads',
    actionIcon: Target,
    color: 'text-purple-400',
    bgColor: 'from-purple-500/10 to-purple-500/5',
    borderColor: 'border-purple-500/20',
  },
  {
    id: 3,
    icon: Users,
    title: 'Action: Casual Visitors Cluster',
    titleEn: 'Action: Casual Visitors Cluster',
    description:
      'This cluster (60% of customers) bought once. Send a "Buy One Get One" campaign to convert them into repeat buyers.',
    descriptionEn:
      'This cluster (60% of customers) bought once. Send a "Buy One Get One" campaign to convert them into repeat buyers.',
    actionLabel: 'Export to Email Campaign',
    actionIcon: Send,
    color: 'text-green-400',
    bgColor: 'from-green-500/10 to-green-500/5',
    borderColor: 'border-green-500/20',
  },
];

export function MarketingPage() {
  const [exported, setExported] = useState<Record<number, boolean>>({});
  const [showDetail, setShowDetail] = useState<number | null>(null);

  const handleExport = (id: number) => {
    setExported((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setExported((prev) => ({ ...prev, [id]: false }));
    }, 3000);
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-1"
      >
        <h1 className="text-2xl font-bold text-white">Marketing Strategy Generator</h1>
        <p className="text-surface-400 text-sm">
          CRISP-DM Phase 6 / Deployment: AI-generated strategies in English
        </p>
      </motion.div>

      {/* Strategy Cards */}
      <div className="grid grid-cols-1 gap-4">
        {strategies.map((strategy, i) => {
          const Icon = strategy.icon;
          const ActionIcon = strategy.actionIcon;
          const isExported = exported[strategy.id];
          const isExpanded = showDetail === strategy.id;

          return (
            <motion.div
              key={strategy.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              className={`rounded-2xl border ${strategy.borderColor} bg-gradient-to-br ${strategy.bgColor} p-6 transition-all duration-300`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl ${strategy.bgColor} border ${strategy.borderColor} flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-6 h-6 ${strategy.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-bold text-white">
                      {strategy.title}
                    </h3>
                    <button
                      onClick={() => setShowDetail(isExpanded ? null : strategy.id)}
                      className="text-surface-400 hover:text-white transition-colors flex items-center gap-1 text-sm"
                    >
                      {isExpanded ? 'Less' : 'More'}
                      <ChevronRight
                        className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                      />
                    </button>
                  </div>
                  <p className="text-sm text-surface-300 leading-relaxed mb-3">
                    {strategy.description}
                  </p>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-3 pt-3 border-t border-surface-800/50"
                    >
                      <p className="text-xs text-surface-500 uppercase tracking-wider font-medium mb-1">
                        Details
                      </p>
                      <p className="text-sm text-surface-400 leading-relaxed mb-3">
                        {strategy.descriptionEn}
                      </p>
                    </motion.div>
                  )}
                  <div className="flex items-center gap-3 mt-4">
                    <button
                      onClick={() => handleExport(strategy.id)}
                      className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        isExported
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                          : 'bg-gradient-to-r from-brand-blue to-brand-purple text-white hover:opacity-90'
                      }`}
                    >
                      {isExported ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          Exported Successfully!
                        </>
                      ) : (
                        <>
                          <ActionIcon className="w-4 h-4" />
                          {strategy.actionLabel}
                        </>
                      )}
                    </button>
                    <div className="flex items-center gap-1 text-xs text-surface-500">
                      <Zap className="w-3 h-3" />
                      <span>AI-generated</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="rounded-2xl border border-surface-800 bg-surface-900/50 p-5"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-surface-400">Expected ROI</p>
              <p className="text-xl font-bold text-white">3.2x</p>
            </div>
          </div>
          <p className="text-xs text-surface-500">
            Expected ROI for Legacy Stars retention campaign
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="rounded-2xl border border-surface-800 bg-surface-900/50 p-5"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-xs text-surface-400">Target Reach</p>
              <p className="text-xl font-bold text-white">845 customers</p>
            </div>
          </div>
          <p className="text-xs text-surface-500">
            Target reach for this week's campaign
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="rounded-2xl border border-surface-800 bg-surface-900/50 p-5"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
              <Megaphone className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-xs text-surface-400">Active Campaigns</p>
              <p className="text-xl font-bold text-white">3</p>
            </div>
          </div>
          <p className="text-xs text-surface-500">
            Active campaigns across all channels
          </p>
        </motion.div>
      </div>
    </div>
  );
}
