import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Rocket,
  AlertTriangle,
  Target,
  Copy,
  Check,
  Megaphone,
  Image as ImageIcon,
  Users,
  Download,
  TrendingDown,
  MousePointerClick,
  Facebook,
  Instagram,
  ShoppingBag,
  ChevronRight,
  Activity,
  Zap,
  ArrowRight,
} from 'lucide-react';

type Tab = 'ad-copy' | 'visual-mockup';

interface RemediationCampaign {
  id: string;
  category: string;
  dropPercent: number;
  weekRange: string;
  status: 'active' | 'monitoring';
  severity: 'high' | 'medium';
  strategy: string;
  objective: string;
  segmentSize: number;
  projectedConversion: string;
  projectedRecovery: string;
  filters: { label: string; value: string }[];
  adCopy: {
    facebook: { hook: string; body: string; cta: string; hashtags: string };
    instagram: { hook: string; body: string; cta: string; hashtags: string };
    tiktok: { hook: string; body: string; cta: string; hashtags: string };
  };
}

const campaigns: RemediationCampaign[] = [
  {
    id: 'premium-weekend',
    category: 'Premium Weekend Collection',
    dropPercent: 20,
    weekRange: '4-week rolling average',
    status: 'active',
    severity: 'high',
    strategy:
      'Launch a targeted customer retention bundle promo aimed at high-value repeat buyers who have lapsed in the last 30 days. Offer a 25% discount on bundle purchases (2+ items) to re-activate purchase frequency and recover lost weekend revenue.',
    objective: 'Reactivate churning mid-tier buyers via targeted value bundles',
    segmentSize: 1247,
    projectedConversion: '8.5%',
    projectedRecovery: 'RM 14,200',
    filters: [
      { label: 'Purchase History', value: 'Bought within the last 90 days' },
      { label: 'Recency Gap', value: 'No purchase in the past 30 days' },
      { label: 'Customer Tier', value: 'High-value (Monetary > RM 500)' },
      { label: 'Segment', value: 'Champions & Legacy Stars' },
      { label: 'Channel Preference', value: 'Meta Ads + WhatsApp Business' },
    ],
    adCopy: {
      facebook: {
        hook: 'Your favorite weekend treats just got sweeter — and smarter.',
        body: "We noticed you haven't visited us in a while, so we've curated an exclusive bundle just for you. Get 25% off our Premium Weekend Collection when you bundle 2 or more items. Handpicked for our loyal repeat buyers — because you deserve the best.\n\nOffer valid this week only. Tap below to claim your personalized bundle before it's gone.",
        cta: 'Claim My 25% Bundle',
        hashtags: '#SMEBusiness #ShopLocal #SMEGrow #WeekendVibes #SmartShopping',
      },
      instagram: {
        hook: 'Weekend mode: ACTIVATED. Your exclusive bundle is waiting.',
        body: "We miss you! Here's a little something to bring you back — 25% off our Premium Weekend Collection, curated specially for our valued repeat customers.\n\nTag a friend who'd love this and share the local love.",
        cta: 'Tap the link in bio to claim',
        hashtags: '#SMEBusiness #ShopLocal #SMEGrow #WeekendTreats #LocalLove #RepeatCustomerPerks',
      },
      tiktok: {
        hook: 'POV: You left us on read and we still pulled up with a deal.',
        body: "We saw you haven't shopped in a minute, so we made you a bundle. 25% off Premium Weekend Collection — no gatekeeping, just good vibes and better prices.\n\nComment \"WEEKEND\" and we'll DM you the link.",
        cta: 'Click the cart icon to shop now',
        hashtags: '#SMEBusiness #ShopLocal #SMEGrow #SmallBusinessTok #WeekendDeal #LocalBusiness #TikTokMadeMeBuyIt',
      },
    },
  },
  {
    id: 'accessories-line',
    category: 'Accessories Line',
    dropPercent: 14,
    weekRange: '4-week rolling average',
    status: 'active',
    severity: 'medium',
    strategy:
      'Deploy a cross-sell flash campaign pairing Accessories with top-selling main products at a bundled discount. Target recent buyers of main products who have not yet purchased accessories.',
    objective: 'Cross-sell accessories to recent main-product buyers',
    segmentSize: 832,
    projectedConversion: '6.2%',
    projectedRecovery: 'RM 7,800',
    filters: [
      { label: 'Purchase History', value: 'Bought a main product within 60 days' },
      { label: 'Cross-sell Gap', value: 'No accessory purchase on record' },
      { label: 'Customer Tier', value: 'Mid-value (Monetary RM 150-500)' },
      { label: 'Segment', value: 'Potential Loyalists' },
      { label: 'Channel Preference', value: 'Meta Ads + Email' },
    ],
    adCopy: {
      facebook: {
        hook: 'Complete the look — your accessories upgrade is here.',
        body: "You've got the main event, now get the finishing touch. For a limited time, enjoy 20% off all accessories when you pair them with your favorite picks. Stylish, practical, and perfectly matched.\n\nDon't miss out — upgrade your set today.",
        cta: 'Shop Accessories Now',
        hashtags: '#SMEBusiness #ShopLocal #SMEGrow #CompleteTheLook #AccessoryUpgrade',
      },
      instagram: {
        hook: 'The missing piece? We found it for you.',
        body: "Your style is almost complete. Add the perfect accessories to your collection with 20% off every pairing this week.\n\nSlide into our DMs for your personalized picks.",
        cta: 'Tap the link in bio to browse',
        hashtags: '#SMEBusiness #ShopLocal #SMEGrow #StyleUpgrade #AccessoryGame #LocalLove',
      },
      tiktok: {
        hook: 'POV: You bought the main thing but forgot the best part.',
        body: "We've got you. 20% off all accessories this week — the perfect add-on to what you already love.\n\nComment \"UPGRADE\" and we'll send you the link.",
        cta: 'Tap the cart to complete your set',
        hashtags: '#SMEBusiness #ShopLocal #SMEGrow #CompleteTheLook #SmallBusinessTok #AccessoryCheck',
      },
    },
  },
];

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={copy}
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-surface-700 bg-surface-800/50 text-xs text-surface-300 hover:text-white hover:border-surface-600 hover:bg-surface-800 transition-all duration-200"
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 text-green-400" />
          <span className="text-green-400">Copied!</span>
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5" />
          <span>{label}</span>
        </>
      )}
    </button>
  );
}

export function RevenueRecoveryPage() {
  const [selectedId, setSelectedId] = useState(campaigns[0].id);
  const [activeTab, setActiveTab] = useState<Tab>('ad-copy');

  const selected = campaigns.find((c) => c.id === selectedId)!;

  const tabs: { id: Tab; label: string; icon: typeof Megaphone }[] = [
    { id: 'ad-copy', label: 'Ad Copy', icon: Megaphone },
    { id: 'visual-mockup', label: 'Visual Mockup', icon: ImageIcon },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-1"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-red-500/20 border border-amber-500/30 flex items-center justify-center">
            <Rocket className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Revenue Recovery Engine</h1>
            <p className="text-surface-400 text-sm">
              Autonomous, data-driven marketing execution loops triggered by live transactional anomalies.
            </p>
          </div>
        </div>
      </motion.div>

      {/* State Sync Banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center gap-3 px-4 py-3 rounded-xl border border-green-500/20 bg-green-500/5"
      >
        <div className="w-8 h-8 rounded-lg bg-green-500/15 flex items-center justify-center flex-shrink-0">
          <Activity className="w-4 h-4 text-green-400" />
        </div>
        <div className="flex-1">
          <p className="text-sm text-white font-medium">Synced with AI Analysis Hub</p>
          <p className="text-xs text-surface-400">
            {campaigns.length} anomaly triggers detected during file analysis have been auto-converted into active remediation campaigns.
          </p>
        </div>
        <span className="flex items-center gap-1.5 text-xs text-green-400 font-medium">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          LIVE
        </span>
      </motion.div>

      {/* Active Alerts Dashboard */}
      <div>
        <h2 className="text-sm font-semibold text-surface-300 uppercase tracking-wider mb-3">
          Active Alerts
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {campaigns.map((campaign, i) => {
            const isSelected = campaign.id === selectedId;
            const severityColor =
              campaign.severity === 'high'
                ? 'border-amber-500/40 bg-amber-500/5'
                : 'border-orange-500/30 bg-orange-500/5';
            return (
              <motion.button
                key={campaign.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.08 }}
                onClick={() => setSelectedId(campaign.id)}
                className={`text-left rounded-2xl border p-5 transition-all duration-300 ${
                  isSelected
                    ? `${severityColor} ring-2 ring-amber-500/30`
                    : 'border-surface-800 bg-surface-900/50 hover:border-surface-700 hover:bg-surface-800/50'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                        campaign.severity === 'high'
                          ? 'bg-amber-500/15 border border-amber-500/25'
                          : 'bg-orange-500/15 border border-orange-500/25'
                      }`}
                    >
                      <TrendingDown
                        className={`w-4 h-4 ${
                          campaign.severity === 'high' ? 'text-amber-400' : 'text-orange-400'
                        }`}
                      />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{campaign.category}</p>
                      <p className="text-xs text-surface-500">{campaign.weekRange}</p>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wider ${
                      campaign.severity === 'high'
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'bg-orange-500/20 text-orange-400'
                    }`}
                  >
                    {campaign.severity === 'high' ? 'HIGH PRIORITY' : 'MEDIUM'}
                  </span>
                </div>
                <div className="flex items-end gap-2 mb-3">
                  <span className="text-3xl font-bold text-white">-{campaign.dropPercent}%</span>
                  <span className="text-xs text-surface-400 mb-1.5">sales drop this week</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs text-green-400">
                    <Zap className="w-3 h-3" />
                    Remediation campaign active
                  </span>
                  {isSelected && (
                    <ChevronRight className="w-4 h-4 text-amber-400" />
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Campaign Console */}
      <motion.div
        key={selected.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-2xl border border-surface-800 bg-surface-900/50 overflow-hidden"
      >
        {/* Console Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-800 bg-surface-950/30">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center">
              <Target className="w-4 h-4 text-brand-blue" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Campaign Console</h3>
              <p className="text-xs text-surface-500">{selected.category}</p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-lg bg-amber-500/15 text-amber-400 text-xs font-semibold">
            -{selected.dropPercent}% anomaly
          </span>
        </div>

        <div className="p-6 space-y-6">
          {/* Section A: Strategy Brief */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2 py-0.5 rounded-md bg-surface-800 text-surface-400 text-[10px] font-bold tracking-wider">
                SECTION A
              </span>
              <h4 className="text-sm font-semibold text-white">Strategy Brief</h4>
            </div>
            <div className="rounded-xl border border-surface-800 bg-surface-950/40 p-5 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-brand-blue/15 flex items-center justify-center flex-shrink-0">
                  <Target className="w-3.5 h-3.5 text-brand-blue" />
                </div>
                <div>
                  <p className="text-xs text-surface-500 uppercase tracking-wider mb-0.5">Objective</p>
                  <p className="text-sm text-white font-medium">{selected.objective}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-amber-500/15 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <div>
                  <p className="text-xs text-surface-500 uppercase tracking-wider mb-0.5">
                    Anomaly Addressed
                  </p>
                  <p className="text-sm text-surface-200 leading-relaxed">
                    {selected.category} experienced a{' '}
                    <span className="font-semibold text-amber-400">{selected.dropPercent}% sales drop</span>{' '}
                    this week compared to the {selected.weekRange}. This campaign directly targets the
                    customer cohort most likely to reverse the trend.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-green-500/15 flex items-center justify-center flex-shrink-0">
                  <Zap className="w-3.5 h-3.5 text-green-400" />
                </div>
                <div>
                  <p className="text-xs text-surface-500 uppercase tracking-wider mb-0.5">
                    Intervention Strategy
                  </p>
                  <p className="text-sm text-surface-200 leading-relaxed">{selected.strategy}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Section B: Generative Ad Hub */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2 py-0.5 rounded-md bg-surface-800 text-surface-400 text-[10px] font-bold tracking-wider">
                SECTION B
              </span>
              <h4 className="text-sm font-semibold text-white">Generative Ad Hub</h4>
            </div>

            {/* Tab Switcher */}
            <div className="flex gap-1 mb-4 rounded-xl border border-surface-800 bg-surface-950/40 p-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex-1 justify-center ${
                      isActive
                        ? 'bg-surface-800 text-white'
                        : 'text-surface-400 hover:text-surface-200'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-brand-blue' : ''}`} />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <AnimatePresence mode="wait">
              {activeTab === 'ad-copy' && (
                <motion.div
                  key="ad-copy"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-3"
                >
                  {([
                    { platform: 'facebook', icon: Facebook, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
                    { platform: 'instagram', icon: Instagram, color: 'text-pink-400', bg: 'bg-pink-500/10', border: 'border-pink-500/20' },
                    { platform: 'tiktok', icon: ShoppingBag, color: 'text-surface-200', bg: 'bg-surface-700/40', border: 'border-surface-600' },
                  ] as const).map(({ platform, icon: Icon, color, bg, border }) => {
                    const copy = selected.adCopy[platform];
                    const fullCopy = `${copy.hook}\n\n${copy.body}\n\n${copy.cta}\n\n${copy.hashtags}`;
                    return (
                      <div key={platform} className={`rounded-xl border ${border} ${bg} p-4`}>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Icon className={`w-4 h-4 ${color}`} />
                            <span className="text-sm font-semibold text-white capitalize">{platform}</span>
                          </div>
                          <CopyButton text={fullCopy} label="Copy All" />
                        </div>
                        <div className="space-y-2.5">
                          <div>
                            <span className="text-[10px] uppercase tracking-wider text-surface-500 font-semibold">Hook</span>
                            <div className="flex items-start justify-between gap-3 mt-0.5">
                              <p className="text-sm text-white font-medium leading-relaxed">{copy.hook}</p>
                              <CopyButton text={copy.hook} label="Copy" />
                            </div>
                          </div>
                          <div>
                            <span className="text-[10px] uppercase tracking-wider text-surface-500 font-semibold">Body</span>
                            <div className="flex items-start justify-between gap-3 mt-0.5">
                              <p className="text-sm text-surface-200 leading-relaxed whitespace-pre-line">{copy.body}</p>
                              <CopyButton text={copy.body} label="Copy" />
                            </div>
                          </div>
                          <div>
                            <span className="text-[10px] uppercase tracking-wider text-surface-500 font-semibold">Call to Action</span>
                            <p className="text-sm text-brand-blue font-medium mt-0.5">{copy.cta}</p>
                          </div>
                          <div>
                            <span className="text-[10px] uppercase tracking-wider text-surface-500 font-semibold">Hashtags</span>
                            <div className="flex items-start justify-between gap-3 mt-0.5">
                              <p className="text-xs text-surface-300 leading-relaxed">{copy.hashtags}</p>
                              <CopyButton text={copy.hashtags} label="Copy" />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </motion.div>
              )}

              {activeTab === 'visual-mockup' && (
                <motion.div
                  key="visual-mockup"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="flex justify-center"
                >
                  <div className="w-full max-w-sm">
                    <div className="rounded-2xl overflow-hidden border border-surface-700 bg-gradient-to-b from-surface-800 to-surface-950 shadow-2xl">
                      {/* Ad Header */}
                      <div className="flex items-center gap-2 px-4 py-3 border-b border-surface-700/50">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-blue to-brand-purple flex items-center justify-center">
                          <ShoppingBag className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-white">YourStore</p>
                          <p className="text-[10px] text-surface-500">Sponsored</p>
                        </div>
                      </div>

                      {/* Visual Canvas */}
                      <div className="relative aspect-square bg-gradient-to-br from-brand-blue/10 via-surface-900 to-brand-purple/10 flex items-center justify-center overflow-hidden">
                        <div
                          className="absolute inset-0 opacity-20"
                          style={{
                            backgroundImage:
                              'radial-gradient(circle at 30% 30%, rgba(0,102,255,0.3) 0%, transparent 50%), radial-gradient(circle at 70% 70%, rgba(107,33,168,0.3) 0%, transparent 50%)',
                          }}
                        />
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.3, type: 'spring' }}
                          className="relative z-10 text-center"
                        >
                          <div className="w-28 h-28 mx-auto rounded-2xl bg-gradient-to-br from-surface-700 to-surface-800 border border-surface-600 flex items-center justify-center mb-3 shadow-xl">
                            <ShoppingBag className="w-12 h-12 text-surface-400" />
                          </div>
                          <p className="text-xs text-surface-400">{selected.category}</p>
                        </motion.div>
                        <div className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-red-500/90 text-white text-xs font-bold shadow-lg">
                          -25%
                        </div>
                      </div>

                      {/* Ad Body */}
                      <div className="p-4 space-y-3">
                        <p className="text-sm font-semibold text-white leading-snug">
                          {selected.adCopy.facebook.hook}
                        </p>
                        <p className="text-xs text-surface-400 leading-relaxed line-clamp-2">
                          {selected.adCopy.facebook.body}
                        </p>
                        <button className="w-full py-2.5 rounded-xl bg-gradient-to-r from-brand-blue to-brand-purple text-white text-sm font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-lg">
                          <MousePointerClick className="w-4 h-4" />
                          Claim Promo
                        </button>
                        <div className="flex items-center justify-center gap-1.5 pt-1">
                          <TrendingDown className="w-3 h-3 text-amber-400" />
                          <span className="text-[10px] text-surface-500">
                            Auto-generated by Virtual CMO Agent
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Section C: Target Logistics */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2 py-0.5 rounded-md bg-surface-800 text-surface-400 text-[10px] font-bold tracking-wider">
                SECTION C
              </span>
              <h4 className="text-sm font-semibold text-white">Target Logistics</h4>
            </div>

            <div className="space-y-4">
              {/* Stat Cards */}
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-xl border border-surface-800 bg-surface-950/40 p-4 text-center">
                  <Users className="w-5 h-5 text-brand-blue mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">
                    {selected.segmentSize.toLocaleString()}
                  </p>
                  <p className="text-[10px] text-surface-500 uppercase tracking-wider mt-1">
                    Segment Size
                  </p>
                </div>
                <div className="rounded-xl border border-surface-800 bg-surface-950/40 p-4 text-center">
                  <Target className="w-5 h-5 text-green-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">{selected.projectedConversion}</p>
                  <p className="text-[10px] text-surface-500 uppercase tracking-wider mt-1">
                    Est. Conversion
                  </p>
                </div>
                <div className="rounded-xl border border-surface-800 bg-surface-950/40 p-4 text-center">
                  <TrendingDown className="w-5 h-5 text-amber-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">
                    {selected.projectedRecovery.replace('RM ', 'RM ').replace('k', 'k')}
                  </p>
                  <p className="text-[10px] text-surface-500 uppercase tracking-wider mt-1">
                    Revenue Recovery
                  </p>
                </div>
              </div>

              {/* Filter Breakdown */}
              <div className="rounded-xl border border-surface-800 bg-surface-950/40 p-4">
                <h5 className="text-xs font-semibold text-surface-300 uppercase tracking-wider mb-3">
                  Target Filters
                </h5>
                <div className="space-y-2.5">
                  {selected.filters.map((filter, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center justify-between gap-3 py-2 border-b border-surface-800/50 last:border-0"
                    >
                      <span className="text-xs text-surface-400 font-medium">{filter.label}</span>
                      <span className="text-xs text-white font-medium text-right">{filter.value}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Export Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-lg">
                  <Download className="w-4 h-4" />
                  Export to Meta Ads
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-surface-700 bg-surface-800/50 text-surface-200 text-sm font-semibold hover:bg-surface-800 hover:text-white transition-all">
                  <Download className="w-4 h-4" />
                  Export as CSV
                </button>
              </div>
              <p className="text-center text-[10px] text-surface-500">
                Target list exports as CSV with hashed phone numbers for privacy compliance.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
