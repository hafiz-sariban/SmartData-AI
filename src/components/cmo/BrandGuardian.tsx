import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Wand2,
  Building2,
  Users,
  Target,
  MessageSquare,
  Ban,
  Globe,
} from 'lucide-react';
import { useCmoStore, localeLabels } from '../../lib/cmoStore';

const toneOptions = ['Professional', 'Playful', 'Authoritative', 'Witty', 'Empathetic', 'Bold'];

function calculateAlignmentScore(draft: string, dna: ReturnType<typeof useCmoStore>['brandDNA']): number {
  if (!draft.trim()) return 0;
  let score = 70;
  const lower = draft.toLowerCase();

  // Check forbidden words
  if (dna.forbiddenWords) {
    const forbidden = dna.forbiddenWords.toLowerCase().split(',').map((w) => w.trim()).filter(Boolean);
    forbidden.forEach((w) => {
      if (w && lower.includes(w)) score -= 15;
    });
  }

  // Check brand name presence
  if (dna.brandName && lower.includes(dna.brandName.toLowerCase())) score += 10;

  // Check tone markers
  const playfulMarkers = ['!', 'amazing', 'love', 'fun', 'wow'];
  const professionalMarkers = ['leverage', 'solution', 'strategy', 'optimize', 'seamless']
  ;
  if (dna.tone === 'Playful' && playfulMarkers.some((m) => lower.includes(m))) score += 8;
  if (dna.tone === 'Professional' && professionalMarkers.some((m) => lower.includes(m))) score += 8;
  if (dna.tone === 'Bold' && ['breakthrough', 'dominate', 'unleash', 'game-changer'].some((m) => lower.includes(m))) score += 8;

  // Length check
  if (draft.length > 50 && draft.length < 500) score += 5;

  return Math.max(0, Math.min(100, score));
}

function autoCorrect(draft: string, dna: ReturnType<typeof useCmoStore>['brandDNA']): string {
  let corrected = draft;
  if (dna.forbiddenWords) {
    const forbidden = dna.forbiddenWords.split(',').map((w) => w.trim()).filter(Boolean);
    forbidden.forEach((w) => {
      if (w) {
        const re = new RegExp(w, 'gi');
        corrected = corrected.replace(re, '[brand-safe alternative]');
      }
    });
  }
  if (dna.brandName && !corrected.toLowerCase().includes(dna.brandName.toLowerCase()) && corrected.length > 20) {
    corrected = `${dna.brandName} — ${corrected}`;
  }
  return corrected;
}

export function BrandGuardian() {
  const { brandDNA, setBrandDNA } = useCmoStore();
  const [draft, setDraft] = useState('');
  const [audited, setAudited] = useState(false);

  const score = calculateAlignmentScore(draft, brandDNA);
  const corrected = autoCorrect(draft, brandDNA);

  const scoreColor =
    score >= 80 ? 'text-green-400' : score >= 60 ? 'text-amber-400' : 'text-red-400';
  const scoreBg =
    score >= 80 ? 'from-green-500 to-emerald-500' : score >= 60 ? 'from-amber-500 to-orange-500' : 'from-red-500 to-rose-500';

  const fields = [
    { key: 'brandName', label: 'Brand Name', icon: Building2, placeholder: 'e.g., Kuih Corner' },
    { key: 'industry', label: 'Industry Sector', icon: Globe, placeholder: 'e.g., F&B / Local Delights' },
    { key: 'icp', label: 'Ideal Customer Persona (ICP)', icon: Users, placeholder: 'e.g., Working moms aged 25-40 in Klang Valley' },
    { key: 'uvp', label: 'Unique Value Proposition', icon: Target, placeholder: 'e.g., Fresh handcrafted kuih delivered same-day' },
  ] as const;

  return (
    <div className="space-y-6">
      {/* Brand DNA Form */}
      <div className="rounded-2xl border border-surface-800 bg-surface-900/50 overflow-hidden">
        <div className="flex items-center gap-2.5 px-5 py-4 border-b border-surface-800">
          <div className="w-8 h-8 rounded-lg bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center">
            <Shield className="w-4 h-4 text-brand-blue" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Brand DNA Configuration</h3>
            <p className="text-xs text-surface-500">Define your brand identity — all agent outputs inherit this DNA</p>
          </div>
        </div>

        <div className="p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {fields.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.key}>
                  <label className="text-xs text-surface-400 font-medium flex items-center gap-1.5 mb-1.5">
                    <Icon className="w-3.5 h-3.5" />
                    {f.label}
                  </label>
                  <input
                    type="text"
                    value={brandDNA[f.key]}
                    onChange={(e) => setBrandDNA({ [f.key]: e.target.value })}
                    placeholder={f.placeholder}
                    className="w-full rounded-lg border border-surface-700 bg-surface-950/50 px-3 py-2.5 text-sm text-white placeholder:text-surface-600 focus:outline-none focus:ring-2 focus:ring-brand-blue/40 focus:border-brand-blue/60 transition-all"
                  />
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-surface-400 font-medium flex items-center gap-1.5 mb-1.5">
                <MessageSquare className="w-3.5 h-3.5" />
                Brand Tone of Voice
              </label>
              <div className="flex flex-wrap gap-2">
                {toneOptions.map((t) => (
                  <button
                    key={t}
                    onClick={() => setBrandDNA({ tone: t })}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                      brandDNA.tone === t
                        ? 'border-brand-blue bg-brand-blue/15 text-white'
                        : 'border-surface-700 bg-surface-950/40 text-surface-400 hover:text-white hover:border-surface-600'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs text-surface-400 font-medium flex items-center gap-1.5 mb-1.5">
                <Globe className="w-3.5 h-3.5" />
                Localization
              </label>
              <select
                value={brandDNA.locale}
                onChange={(e) => setBrandDNA({ locale: e.target.value as typeof brandDNA.locale })}
                className="w-full rounded-lg border border-surface-700 bg-surface-950/50 px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-blue/40"
              >
                {Object.entries(localeLabels).map(([k, v]) => (
                  <option key={k} value={k} className="bg-surface-900">{v}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs text-surface-400 font-medium flex items-center gap-1.5 mb-1.5">
              <Ban className="w-3.5 h-3.5" />
              Forbidden Words / Competitor Names
            </label>
            <input
              type="text"
              value={brandDNA.forbiddenWords}
              onChange={(e) => setBrandDNA({ forbiddenWords: e.target.value })}
              placeholder="e.g., cheap, competitor1, competitor2"
              className="w-full rounded-lg border border-surface-700 bg-surface-950/50 px-3 py-2.5 text-sm text-white placeholder:text-surface-600 focus:outline-none focus:ring-2 focus:ring-brand-blue/40 focus:border-brand-blue/60 transition-all"
            />
            <p className="text-[10px] text-surface-600 mt-1">Comma-separated. The agent will never use these words in outputs.</p>
          </div>
        </div>
      </div>

      {/* Live AI Audit Box */}
      <div className="rounded-2xl border border-surface-800 bg-surface-900/50 overflow-hidden">
        <div className="flex items-center gap-2.5 px-5 py-4 border-b border-surface-800">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <Wand2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Live Brand Alignment Audit</h3>
            <p className="text-xs text-surface-500">Paste any external draft copy to validate against your Brand DNA</p>
          </div>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <label className="text-xs text-surface-400 font-medium mb-1.5 block">Paste draft copy to validate</label>
            <textarea
              value={draft}
              onChange={(e) => {
                setDraft(e.target.value);
                setAudited(false);
              }}
              placeholder="Paste your ad copy, email body, social caption, or landing page text here..."
              rows={4}
              className="w-full rounded-lg border border-surface-700 bg-surface-950/50 px-3 py-2.5 text-sm text-white placeholder:text-surface-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/60 transition-all resize-none"
            />
          </div>

          <button
            onClick={() => setAudited(true)}
            disabled={!draft.trim()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-lg disabled:opacity-40"
          >
            <Sparkles className="w-4 h-4" />
            Validate Copy
          </button>

          <AnimatePresence>
            {audited && draft.trim() && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {/* Score Gauge */}
                <div className="flex items-center gap-4 p-4 rounded-xl border border-surface-800 bg-surface-950/40">
                  <div className="relative w-16 h-16 flex-shrink-0">
                    <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                      <circle cx="32" cy="32" r="28" fill="none" stroke="rgb(30,41,59)" strokeWidth="6" />
                      <motion.circle
                        cx="32" cy="32" r="28" fill="none" stroke="url(#scoreGrad)" strokeWidth="6"
                        strokeLinecap="round"
                        strokeDasharray={2 * Math.PI * 28}
                        initial={{ strokeDashoffset: 2 * Math.PI * 28 }}
                        animate={{ strokeDashoffset: 2 * Math.PI * 28 * (1 - score / 100) }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                      />
                      <defs>
                        <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" className={`[stop-color:currentColor] ${scoreColor}`} />
                          <stop offset="100%" className={`[stop-color:currentColor] ${scoreColor}`} />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className={`text-lg font-bold ${scoreColor}`}>{score}</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white">Brand Alignment Score</p>
                    <p className="text-xs text-surface-400">
                      {score >= 80 ? 'Excellent alignment with your brand DNA.' :
                       score >= 60 ? 'Decent alignment — some corrections applied below.' :
                       'Poor alignment — significant corrections needed.'}
                    </p>
                    <div className="mt-2 h-2 rounded-full bg-surface-800 overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full bg-gradient-to-r ${scoreBg}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${score}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                </div>

                {/* Auto-corrected version */}
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-semibold text-white">Auto-Corrected Version</span>
                  </div>
                  <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                    <p className="text-sm text-surface-200 leading-relaxed whitespace-pre-wrap">
                      {corrected || draft}
                    </p>
                  </div>
                </div>

                {/* Audit notes */}
                <div className="space-y-2">
                  {brandDNA.forbiddenWords && draft.toLowerCase().match(new RegExp(brandDNA.forbiddenWords.split(',').map(w => w.trim().toLowerCase()).filter(Boolean).join('|'), 'i')) && (
                    <div className="flex items-start gap-2 p-3 rounded-lg border border-red-500/20 bg-red-500/5">
                      <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-surface-300">
                        <span className="font-semibold text-red-400">Forbidden word detected.</span> Replaced with brand-safe placeholder.
                      </p>
                    </div>
                  )}
                  {brandDNA.brandName && !draft.toLowerCase().includes(brandDNA.brandName.toLowerCase()) && (
                    <div className="flex items-start gap-2 p-3 rounded-lg border border-amber-500/20 bg-amber-500/5">
                      <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-surface-300">
                        <span className="font-semibold text-amber-400">Brand name missing.</span> Prepended "{brandDNA.brandName}" to the opening.
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
