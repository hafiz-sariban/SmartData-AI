import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CalendarDays,
  Instagram,
  Music2,
  Linkedin,
  Mail,
  Video,
  Image,
  Layers,
  FileText,
  Sparkles,
  Clock,
  Zap,
} from 'lucide-react';
import { useCmoStore } from '../../lib/cmoStore';

const platforms = [
  { id: 'instagram', label: 'Instagram', icon: Instagram, color: 'text-pink-400', bg: 'bg-pink-500/10', border: 'border-pink-500/30' },
  { id: 'tiktok', label: 'TikTok', icon: Music2, color: 'text-surface-200', bg: 'bg-surface-700/40', border: 'border-surface-600' },
  { id: 'linkedin', label: 'LinkedIn', icon: Linkedin, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30' },
  { id: 'email', label: 'Email', icon: Mail, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30' },
];

const objectives = [
  'Launch new product line',
  'Brand awareness boost',
  'Holiday / festival promo',
  'Customer reactivation',
  'Lead generation',
];

const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

interface CalendarEntry {
  day: string;
  platform: string;
  hook: string;
  format: string;
  cta: string;
  effort: 'Low' | 'Medium' | 'High';
}

const formatIcons: Record<string, typeof Video> = {
  'Video Script': Video,
  'Single Image': Image,
  'Carousel': Layers,
  'Long-form Text': FileText,
};

const effortColors: Record<string, string> = {
  Low: 'text-green-400 bg-green-500/10 border-green-500/30',
  Medium: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
  High: 'text-red-400 bg-red-500/10 border-red-500/30',
};

function generateCalendar(objective: string, selectedPlatforms: string[], tone: string, brandName: string): CalendarEntry[] {
  const hooks = [
    `Behind-the-scenes: how we make every ${brandName || 'product'} count`,
    `Customer spotlight: real results from real fans`,
    `Quick tip: 3 ways to get more from your ${brandName || 'brand'} experience`,
    `Myth-busting: what nobody tells you about ${objective.toLowerCase()}`,
    `Limited drop alert: first 50 customers get an exclusive bonus`,
    `Storytime: the moment we knew this had to happen`,
    `Sunday recap + what's coming next week`,
  ];
  const formats = ['Video Script', 'Single Image', 'Carousel', 'Long-form Text'];
  const ctas = ['Tap the link in bio', 'Share your story', 'Claim the offer', 'Join the waitlist', 'Comment to enter'];
  const efforts: ('Low' | 'Medium' | 'High')[] = ['Low', 'Medium', 'High'];

  return dayLabels.map((day, i) => {
    const platform = selectedPlatforms.length > 0
      ? selectedPlatforms[i % selectedPlatforms.length]
      : 'instagram';
    return {
      day,
      platform,
      hook: hooks[i % hooks.length],
      format: formats[i % formats.length],
      cta: ctas[i % ctas.length],
      effort: efforts[i % 3],
    };
  });
}

export function ContentPlanner() {
  const { brandDNA } = useCmoStore();
  const [objective, setObjective] = useState(objectives[0]);
  const [week, setWeek] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['instagram', 'tiktok']);
  const [generated, setGenerated] = useState<CalendarEntry[]>([]);

  const togglePlatform = (id: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const generate = () => {
    setGenerated(generateCalendar(objective, selectedPlatforms, brandDNA.tone, brandDNA.brandName));
  };

  return (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="rounded-2xl border border-surface-800 bg-surface-900/50 overflow-hidden">
        <div className="flex items-center gap-2.5 px-5 py-4 border-b border-surface-800">
          <div className="w-8 h-8 rounded-lg bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center">
            <CalendarDays className="w-4 h-4 text-brand-blue" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Weekly Content Engine</h3>
            <p className="text-xs text-surface-500">Generate a 7-day content calendar with platform-specific angles</p>
          </div>
        </div>

        <div className="p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-surface-400 font-medium mb-1.5 block">Campaign Objective</label>
              <select
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                className="w-full rounded-lg border border-surface-700 bg-surface-950/50 px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-blue/40"
              >
                {objectives.map((o) => (
                  <option key={o} value={o} className="bg-surface-900">{o}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-surface-400 font-medium mb-1.5 block">Target Week</label>
              <input
                type="week"
                value={week}
                onChange={(e) => setWeek(e.target.value)}
                className="w-full rounded-lg border border-surface-700 bg-surface-950/50 px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-blue/40"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-surface-400 font-medium mb-1.5 block">Focus Channels</label>
            <div className="flex flex-wrap gap-2">
              {platforms.map((p) => {
                const Icon = p.icon;
                const selected = selectedPlatforms.includes(p.id);
                return (
                  <button
                    key={p.id}
                    onClick={() => togglePlatform(p.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-all ${
                      selected
                        ? `${p.bg} ${p.border} ${p.color}`
                        : 'border-surface-700 bg-surface-950/40 text-surface-400 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {p.label}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            onClick={generate}
            disabled={selectedPlatforms.length === 0}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-blue to-brand-purple text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-lg disabled:opacity-40"
          >
            <Sparkles className="w-4 h-4" />
            Generate 7-Day Calendar
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      {generated.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3"
        >
          {generated.map((entry, i) => {
            const platform = platforms.find((p) => p.id === entry.platform)!;
            const PlatformIcon = platform.icon;
            const FormatIcon = formatIcons[entry.format];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.06 }}
                className="rounded-xl border border-surface-800 bg-surface-900/50 p-4 hover:border-surface-700 transition-all group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-surface-300 uppercase tracking-wider">{entry.day}</span>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border ${platform.bg} ${platform.border} ${platform.color} text-[10px] font-semibold`}>
                    <PlatformIcon className="w-3 h-3" />
                    {platform.label}
                  </span>
                </div>

                <p className="text-sm text-white font-medium leading-snug mb-3">{entry.hook}</p>

                <div className="flex items-center gap-1.5 mb-2">
                  <FormatIcon className="w-3.5 h-3.5 text-surface-500" />
                  <span className="text-xs text-surface-400">{entry.format}</span>
                </div>

                <div className="flex items-center gap-1.5 mb-3">
                  <Zap className="w-3.5 h-3.5 text-brand-blue" />
                  <span className="text-xs text-brand-blue font-medium">{entry.cta}</span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-surface-800/50">
                  <span className="flex items-center gap-1 text-[10px] text-surface-500">
                    <Clock className="w-3 h-3" />
                    Production Effort
                  </span>
                  <span className={`px-2 py-0.5 rounded-md border text-[10px] font-semibold ${effortColors[entry.effort]}`}>
                    {entry.effort}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {generated.length === 0 && (
        <div className="rounded-2xl border border-surface-800 bg-surface-900/30 p-12 text-center">
          <CalendarDays className="w-10 h-10 text-surface-700 mx-auto mb-3" />
          <p className="text-sm text-surface-400">Configure your campaign and generate a 7-day content calendar.</p>
        </div>
      )}
    </div>
  );
}
