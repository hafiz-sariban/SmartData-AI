import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle,
  Target,
  Copy,
  Check,
  Megaphone,
  Image as ImageIcon,
  Users,
  Download,
  Sparkles,
  TrendingDown,
  MousePointerClick,
  Facebook,
  Instagram,
  ShoppingBag,
} from 'lucide-react';

type Tab = 'ad-copy' | 'visual-mockup' | 'audience-targeting';

const adCopy = {
  facebook: {
    hook: 'Your favorite weekend treats just got sweeter — and smarter.',
    body: 'We noticed you haven\'t visited us in a while, so we\'ve curated an exclusive bundle just for you. Get 25% off our Premium Weekend Collection when you bundle 2 or more items. Handpicked for our loyal repeat buyers — because you deserve the best.\n\nOffer valid this week only. Tap below to claim your personalized bundle before it\'s gone.',
    cta: 'Claim My 25% Bundle',
    hashtags: '#SMEBusiness #ShopLocal #WeekendVibes #SmartShopping #SupportLocal',
  },
  instagram: {
    hook: 'Weekend mode: ACTIVATED. Your exclusive bundle is waiting.',
    body: 'We miss you! Here\'s a little something to bring you back — 25% off our Premium Weekend Collection, curated specially for our valued repeat customers.\n\nTag a friend who\'d love this and share the local love.',
    cta: 'Tap the link in bio to claim',
    hashtags: '#SMEBusiness #ShopLocal #WeekendTreats #LocalLove #RepeatCustomerPerks',
  },
  tiktok: {
    hook: 'POV: You left us on read and we still pulled up with a deal.',
    body: 'We saw you haven\'t shopped in a minute, so we made you a bundle. 25% off Premium Weekend Collection — no gatekeeping, just good vibes and better prices.\n\nComment "WEEKEND" and we\'ll DM you the link.',
    cta: 'Click the cart icon to shop now',
    hashtags: '#SMEBusiness #ShopLocal #SmallBusinessTok #WeekendDeal #LocalBusiness #TikTokMadeMeBuyIt',
  },
};

const audienceData = {
  segmentSize: 1247,
  filters: [
    { label: 'Purchase History', value: 'Bought within the last 90 days' },
    { label: 'Recency Gap', value: 'No purchase in the past 30 days' },
    { label: 'Customer Tier', value: 'High-value (Monetary > RM500)' },
    { label: 'Segment', value: 'Champions & Legacy Stars' },
    { label: 'Channel Preference', value: 'Meta Ads + WhatsApp Business' },
  ],
  estimatedReach: '1,247 eligible contacts',
  projectedConversionRate: '8.5%',
  projectedRevenueRecovery: 'RM 14,200',
};

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

export function RoiMarketerDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('ad-copy');

  const tabs: { id: Tab; label: string; icon: typeof Megaphone }[] = [
    { id: 'ad-copy', label: 'Ad Copy Generator', icon: Megaphone },
    { id: 'visual-mockup', label: 'Visual Ad Mockup', icon: ImageIcon },
    { id: 'audience-targeting', label: 'Smart Audience Targeting', icon: Users },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.6 }}
      className="space-y-5"
    >
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-red-500/20 border border-amber-500/30 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-amber-400" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">Closed-Loop Revenue Recovery</h2>
          <p className="text-xs text-surface-400">
            Agent 4: Virtual CMO — The ROI-Driven Data Marketer (The Analytics Edge)
          </p>
        </div>
      </div>

      {/* Alert Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="relative overflow-hidden rounded-2xl border border-amber-500/40 bg-gradient-to-r from-amber-500/10 via-red-500/5 to-transparent p-5"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-red-500" />
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-6 h-6 text-amber-400" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-400 text-[10px] font-bold tracking-wider">
                REVENUE ANOMALY DETECTED
              </span>
              <span className="text-xs text-surface-500">Auto-detected by Agent 4</span>
            </div>
            <p className="text-sm text-white leading-relaxed">
              <span className="font-semibold text-amber-400">Revenue Anomaly Detected:</span>{' '}
              Sales for <span className="font-semibold text-white">Premium Weekend Collection</span> dropped by{' '}
              <span className="font-bold text-red-400">20% this week</span> compared to your 4-week rolling average.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Automated Campaign Strategy */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="rounded-2xl border border-surface-800 bg-surface-900/50 p-5"
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center">
            <Target className="w-4 h-4 text-brand-blue" />
          </div>
          <h3 className="text-sm font-semibold text-white">Automated Campaign Strategy</h3>
          <span className="px-2 py-0.5 rounded-md bg-green-500/15 text-green-400 text-[10px] font-bold tracking-wider">
            AI-GENERATED
          </span>
        </div>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 rounded-xl bg-surface-950/40 border border-surface-800">
            <div className="w-6 h-6 rounded-full bg-brand-blue/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs font-bold text-brand-blue">1</span>
            </div>
            <p className="text-sm text-surface-200 leading-relaxed">
              <span className="font-semibold text-white">Strategy:</span> Launch a targeted customer retention bundle promo targeting high-value repeat buyers.
            </p>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-xl bg-surface-950/40 border border-surface-800">
            <div className="w-6 h-6 rounded-full bg-brand-blue/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs font-bold text-brand-blue">2</span>
            </div>
            <p className="text-sm text-surface-200 leading-relaxed">
              <span className="font-semibold text-white">Offer:</span> 25% discount on Premium Weekend Collection bundles (2+ items), positioned as an exclusive "We Miss You" perk for lapsed high-value customers.
            </p>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-xl bg-surface-950/40 border border-surface-800">
            <div className="w-6 h-6 rounded-full bg-brand-blue/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs font-bold text-brand-blue">3</span>
            </div>
            <p className="text-sm text-surface-200 leading-relaxed">
              <span className="font-semibold text-white">Channel Mix:</span> Meta Ads (Facebook + Instagram) for top-of-funnel awareness, TikTok Shop for viral reach, and WhatsApp Business for direct 1:1 re-engagement.
            </p>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-xl bg-surface-950/40 border border-surface-800">
            <div className="w-6 h-6 rounded-full bg-brand-blue/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs font-bold text-brand-blue">4</span>
            </div>
            <p className="text-sm text-surface-200 leading-relaxed">
              <span className="font-semibold text-white">Projected ROI:</span> Recover an estimated{' '}
              <span className="font-semibold text-green-400">{audienceData.projectedRevenueRecovery}</span> in lost revenue with a projected conversion rate of{' '}
              <span className="font-semibold text-green-400">{audienceData.projectedConversionRate}</span> across {audienceData.estimatedReach}.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Tabbed Creative Assets */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="rounded-2xl border border-surface-800 bg-surface-900/50 overflow-hidden"
      >
        {/* Tab Bar */}
        <div className="flex border-b border-surface-800">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 px-5 py-3.5 text-sm font-medium transition-all duration-200 ${
                  isActive ? 'text-white' : 'text-surface-400 hover:text-surface-200'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-brand-blue' : ''}`} />
                {tab.label}
                {isActive && (
                  <motion.div
                    layoutId="roi-tab-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-blue"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="p-5">
          <AnimatePresence mode="wait">
            {/* Tab 1: Ad Copy Generator */}
            {activeTab === 'ad-copy' && (
              <motion.div
                key="ad-copy"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-4"
              >
                {([
                  { platform: 'facebook', icon: Facebook, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
                  { platform: 'instagram', icon: Instagram, color: 'text-pink-400', bg: 'bg-pink-500/10', border: 'border-pink-500/20' },
                  { platform: 'tiktok', icon: ShoppingBag, color: 'text-surface-200', bg: 'bg-surface-700/40', border: 'border-surface-600' },
                ] as const).map(({ platform, icon: Icon, color, bg, border }) => {
                  const copy = adCopy[platform];
                  const fullCopy = `${copy.hook}\n\n${copy.body}\n\n${copy.cta}\n\n${copy.hashtags}`;
                  return (
                    <div key={platform} className={`rounded-xl border ${border} ${bg} p-4`}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Icon className={`w-4 h-4 ${color}`} />
                          <span className="text-sm font-semibold text-white capitalize">{platform} Ad Copy</span>
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

            {/* Tab 2: Visual Ad Mockup */}
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
                      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 30% 30%, rgba(0,102,255,0.3) 0%, transparent 50%), radial-gradient(circle at 70% 70%, rgba(107,33,168,0.3) 0%, transparent 50%)' }} />
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.3, type: 'spring' }}
                        className="relative z-10 text-center"
                      >
                        <div className="w-28 h-28 mx-auto rounded-2xl bg-gradient-to-br from-surface-700 to-surface-800 border border-surface-600 flex items-center justify-center mb-3 shadow-xl">
                          <ShoppingBag className="w-12 h-12 text-surface-400" />
                        </div>
                        <p className="text-xs text-surface-400">Premium Weekend Collection</p>
                      </motion.div>
                      <div className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-red-500/90 text-white text-xs font-bold shadow-lg">
                        -25%
                      </div>
                    </div>

                    {/* Ad Body */}
                    <div className="p-4 space-y-3">
                      <p className="text-sm font-semibold text-white leading-snug">
                        Your favorite weekend treats just got sweeter.
                      </p>
                      <p className="text-xs text-surface-400 leading-relaxed">
                        Exclusive 25% off bundle for our valued repeat customers. Limited time only.
                      </p>
                      <button className="w-full py-2.5 rounded-xl bg-gradient-to-r from-brand-blue to-brand-purple text-white text-sm font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-lg">
                        <MousePointerClick className="w-4 h-4" />
                        Claim Promo
                      </button>
                      <div className="flex items-center justify-center gap-1.5 pt-1">
                        <TrendingDown className="w-3 h-3 text-amber-400" />
                        <span className="text-[10px] text-surface-500">Auto-generated by Virtual CMO Agent</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Tab 3: Smart Audience Targeting */}
            {activeTab === 'audience-targeting' && (
              <motion.div
                key="audience-targeting"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-4"
              >
                {/* Segment Size */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-xl border border-surface-800 bg-surface-950/40 p-4 text-center">
                    <Users className="w-5 h-5 text-brand-blue mx-auto mb-2" />
                    <p className="text-2xl font-bold text-white">{audienceData.segmentSize.toLocaleString()}</p>
                    <p className="text-[10px] text-surface-500 uppercase tracking-wider mt-1">Segment Size</p>
                  </div>
                  <div className="rounded-xl border border-surface-800 bg-surface-950/40 p-4 text-center">
                    <Target className="w-5 h-5 text-green-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-white">{audienceData.projectedConversionRate}</p>
                    <p className="text-[10px] text-surface-500 uppercase tracking-wider mt-1">Est. Conversion</p>
                  </div>
                  <div className="rounded-xl border border-surface-800 bg-surface-950/40 p-4 text-center">
                    <TrendingDown className="w-5 h-5 text-amber-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-white">RM 14.2k</p>
                    <p className="text-[10px] text-surface-500 uppercase tracking-wider mt-1">Revenue Recovery</p>
                  </div>
                </div>

                {/* Target Filters */}
                <div className="rounded-xl border border-surface-800 bg-surface-950/40 p-4">
                  <h4 className="text-xs font-semibold text-surface-300 uppercase tracking-wider mb-3">
                    Target Filters
                  </h4>
                  <div className="space-y-2.5">
                    {audienceData.filters.map((filter, i) => (
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
                  <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-green-600 to-green-500 text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-lg">
                    <Download className="w-4 h-4" />
                    Export to WhatsApp Business
                  </button>
                </div>
                <p className="text-center text-[10px] text-surface-500">
                  Target list will be exported as a CSV with hashed phone numbers for privacy compliance.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}
