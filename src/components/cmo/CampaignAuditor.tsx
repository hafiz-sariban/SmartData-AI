import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Stethoscope,
  Eye,
  Gift,
  ShieldQuestion,
  MousePointerClick,
  Sparkles,
  CheckCircle2,
  XCircle,
  FlaskConical,
} from 'lucide-react';
import { useCmoStore } from '../../lib/cmoStore';

interface MetricScore {
  key: string;
  label: string;
  icon: typeof Eye;
  score: number;
  color: string;
}

interface Feedback {
  keep: string[];
  cut: string[];
  test: string[];
}

function auditCopy(text: string, dna: ReturnType<typeof useCmoStore>['brandDNA']): { metrics: MetricScore[]; feedback: Feedback } {
  const lower = text.toLowerCase();
  const len = text.length;

  // Hook strength
  let hook = 5;
  if (/\?/.test(text)) hook += 1;
  if (/(stop|wait|imagine|what if|did you know|picture this)/i.test(text)) hook += 2;
  if (len > 20 && len < 120) hook += 1;
  if (/^(introducing|announcing|new)/i.test(text)) hook += 1;
  hook = Math.min(10, hook);

  // Value clarity
  let value = 4;
  if (/(rm|ringgit|\$|off|free|save|discount|bonus)/i.test(text)) value += 2;
  if (dna.uvp && lower.includes(dna.uvp.toLowerCase().slice(0, 10))) value += 2;
  if (/(because|so you|means|guarantee)/i.test(text)) value += 1;
  value = Math.min(10, value);

  // Objection handling
  let friction = 3;
  if (/(risk.free|no questions|guarantee|refund|cancel anytime|money back)/i.test(text)) friction += 3;
  if (/(easy|simple|minutes|setup|no experience)/i.test(text)) friction += 2;
  if (/(faq|what if|worried|concerned)/i.test(text)) friction += 2;
  friction = Math.min(10, friction);

  // CTA friction (higher = better/lower friction)
  let cta = 4;
  if (/(click|tap|get|claim|join|start|shop|order|download|sign up)/i.test(text)) cta += 3;
  if (/(now|today|limited|expires|before)/i.test(text)) cta += 2;
  if (/[\[\(].*[\]\)]/.test(text)) cta += 1; // bracket-style CTA
  cta = Math.min(10, cta);

  const metrics: MetricScore[] = [
    { key: 'hook', label: 'Attention & Hook', icon: Eye, score: hook, color: 'text-brand-blue' },
    { key: 'value', label: 'Value Clarity', icon: Gift, score: value, color: 'text-emerald-400' },
    { key: 'friction', label: 'Objection Handling', icon: ShieldQuestion, score: friction, color: 'text-amber-400' },
    { key: 'cta', label: 'CTA Strength', icon: MousePointerClick, score: cta, color: 'text-pink-400' },
  ];

  const feedback: Feedback = {
    keep: [],
    cut: [],
    test: [],
  };

  if (hook >= 7) feedback.keep.push('Strong opening hook — grabs attention within the first line.');
  else feedback.cut.push("Weak opening — the first sentence doesn't stop the scroll. Lead with a question or bold claim.");

  if (value >= 7) feedback.keep.push('Clear value proposition — the reader knows what they get.');
  else feedback.test.push('Test adding a specific number or price anchor (e.g., "Save RM25") to sharpen the offer.');

  if (friction >= 7) feedback.keep.push('Objections are addressed — risk reversal language is present.');
  else feedback.cut.push('No risk reversal found — add a guarantee, FAQ line, or "no experience needed" to lower hesitation.');

  if (cta >= 7) feedback.keep.push('Clear, action-oriented CTA — the reader knows exactly what to do next.');
  else feedback.test.push('A/B test a more direct CTA — try "Claim Your RM25 Discount" vs "Learn More".');

  if (dna.forbiddenWords) {
    const forbidden = dna.forbiddenWords.toLowerCase().split(',').map((w) => w.trim()).filter(Boolean);
    const found = forbidden.find((w) => w && lower.includes(w));
    if (found) feedback.cut.push(`Forbidden word "${found}" detected — remove immediately to protect brand integrity.`);
  }

  if (feedback.keep.length === 0) feedback.keep.push('No standout strengths yet — iterate based on the cuts and tests below.');
  if (feedback.cut.length === 0) feedback.cut.push('No critical issues — the copy is structurally sound.');
  if (feedback.test.length === 0) feedback.test.push('Run a standard A/B test on the headline as a next iteration.');

  return { metrics, feedback };
}

export function CampaignAuditor() {
  const { brandDNA } = useCmoStore();
  const [draft, setDraft] = useState('');
  const [result, setResult] = useState<{ metrics: MetricScore[]; feedback: Feedback } | null>(null);
  const [auditing, setAuditing] = useState(false);

  const runAudit = () => {
    setAuditing(true);
    setResult(null);
    setTimeout(() => {
      setResult(auditCopy(draft, brandDNA));
      setAuditing(false);
    }, 1000);
  };

  const overallScore = result ? Math.round(result.metrics.reduce((s, m) => s + m.score, 0) / 4 * 10) : 0;

  return (
    <div className="space-y-6">
      {/* Input */}
      <div className="rounded-2xl border border-surface-800 bg-surface-900/50 overflow-hidden">
        <div className="flex items-center gap-2.5 px-5 py-4 border-b border-surface-800">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
            <Stethoscope className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Campaign Auditor</h3>
            <p className="text-xs text-surface-500">Paste ad copy, email subject lines, or landing page headlines for diagnostic scoring</p>
          </div>
        </div>

        <div className="p-5 space-y-4">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Paste your ad copy, email subject line, landing page headline, or campaign brief here..."
            rows={5}
            className="w-full rounded-lg border border-surface-700 bg-surface-950/50 px-3 py-2.5 text-sm text-white placeholder:text-surface-600 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/60 transition-all resize-none"
          />
          <button
            onClick={runAudit}
            disabled={!draft.trim() || auditing}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-500 text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-lg disabled:opacity-40"
          >
            <Sparkles className="w-4 h-4" />
            {auditing ? 'Auditing...' : 'Run Audit'}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* Overall Score + Radar */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Overall */}
              <div className="rounded-2xl border border-surface-800 bg-surface-900/50 p-5 flex flex-col items-center justify-center">
                <p className="text-xs text-surface-400 uppercase tracking-wider mb-2">Overall Score</p>
                <div className="relative w-24 h-24">
                  <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="rgb(30,41,59)" strokeWidth="8" />
                    <motion.circle
                      cx="50" cy="50" r="42" fill="none" stroke="url(#overallGrad)" strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={2 * Math.PI * 42}
                      initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                      animate={{ strokeDashoffset: 2 * Math.PI * 42 * (1 - overallScore / 100) }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                    />
                    <defs>
                      <linearGradient id="overallGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={overallScore >= 75 ? '#10b981' : overallScore >= 50 ? '#f59e0b' : '#ef4444'} />
                        <stop offset="100%" stopColor={overallScore >= 75 ? '#3b82f6' : overallScore >= 50 ? '#f97316' : '#dc2626'} />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">{overallScore}</span>
                  </div>
                </div>
                <p className="text-xs text-surface-400 mt-2">
                  {overallScore >= 75 ? 'Strong — ready to ship' : overallScore >= 50 ? 'Needs work — iterate' : 'Weak — major rework'}
                </p>
              </div>

              {/* Metric Bars */}
              <div className="lg:col-span-2 rounded-2xl border border-surface-800 bg-surface-900/50 p-5 space-y-4">
                {result.metrics.map((m, i) => {
                  const Icon = m.icon;
                  return (
                    <motion.div
                      key={m.key}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <Icon className={`w-4 h-4 ${m.color}`} />
                          <span className="text-sm text-surface-300 font-medium">{m.label}</span>
                        </div>
                        <span className={`text-sm font-bold ${m.color}`}>{m.score}/10</span>
                      </div>
                      <div className="h-2 rounded-full bg-surface-800 overflow-hidden">
                        <motion.div
                          className={`h-full rounded-full bg-current ${m.color}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${m.score * 10}%` }}
                          transition={{ duration: 0.8, ease: 'easeOut', delay: i * 0.1 }}
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Feedback Panel */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Keep */}
              <div className="rounded-2xl border border-green-500/30 bg-green-500/5 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                  <h4 className="text-sm font-semibold text-white">Keep</h4>
                </div>
                <ul className="space-y-2">
                  {result.feedback.keep.map((f, i) => (
                    <li key={i} className="text-xs text-surface-300 leading-relaxed flex items-start gap-2">
                      <span className="text-green-400 mt-0.5">+</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Cut */}
              <div className="rounded-2xl border border-red-500/30 bg-red-500/5 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <XCircle className="w-5 h-5 text-red-400" />
                  <h4 className="text-sm font-semibold text-white">Cut</h4>
                </div>
                <ul className="space-y-2">
                  {result.feedback.cut.map((f, i) => (
                    <li key={i} className="text-xs text-surface-300 leading-relaxed flex items-start gap-2">
                      <span className="text-red-400 mt-0.5">-</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Test */}
              <div className="rounded-2xl border border-brand-blue/30 bg-brand-blue/5 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <FlaskConical className="w-5 h-5 text-brand-blue" />
                  <h4 className="text-sm font-semibold text-white">Test (A/B)</h4>
                </div>
                <ul className="space-y-2">
                  {result.feedback.test.map((f, i) => (
                    <li key={i} className="text-xs text-surface-300 leading-relaxed flex items-start gap-2">
                      <span className="text-brand-blue mt-0.5">→</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
