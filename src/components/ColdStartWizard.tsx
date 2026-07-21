import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Store,
  Calendar,
  DollarSign,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Sparkles,
  Loader2,
  MapPin,
} from 'lucide-react';
import { useMicroStore, getSectorBenchmarks, type MicroTransaction } from '../lib/microStore';

interface ColdStartWizardProps {
  open: boolean;
  onClose: () => void;
}

const sectors = [
  { id: 'F&B Hawker', icon: '🍜', desc: 'Stalls, warung, night markets' },
  { id: 'Home Baker', icon: '🎂', desc: 'Cakes, kuih, custom orders' },
  { id: 'Fashion Retail (Instagram)', icon: '👗', desc: 'Online boutique, live selling' },
  { id: 'Small Service Provider', icon: '🔧', desc: 'Repair, grooming, home service' },
];

const dayOptions = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const districts = [
  'Kuala Lumpur (Central)',
  'Selangor (Urban)',
  'Penang (Georgetown)',
  'Johor Bahru',
  'Ipoh, Perak',
  'Kota Kinabalu, Sabah',
  'Kuching, Sarawak',
  'Other / Not listed',
];

export function ColdStartWizard({ open, onClose }: ColdStartWizardProps) {
  const { setColdStartProfile, addTransactions } = useMicroStore();
  const [step, setStep] = useState(0);
  const [sector, setSector] = useState('');
  const [busiestDays, setBusiestDays] = useState<string[]>([]);
  const [avgRevenue, setAvgRevenue] = useState('');
  const [district, setDistrict] = useState(districts[0]);
  const [generating, setGenerating] = useState(false);
  const [done, setDone] = useState(false);

  const toggleDay = (day: string) => {
    setBusiestDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const canProceed = [
    sector !== '',
    busiestDays.length > 0,
    avgRevenue !== '' && parseFloat(avgRevenue) > 0,
  ];

  const generate = () => {
    setGenerating(true);
    const profile = {
      sector,
      busiestDays,
      avgDailyRevenue: parseFloat(avgRevenue),
      district,
      createdAt: new Date().toISOString(),
    };

    setTimeout(() => {
      setColdStartProfile(profile);
      // Generate synthetic 14-day baseline
      const benchmarks = getSectorBenchmarks(sector);
      const txs: Omit<MicroTransaction, 'id'>[] = [];
      for (let i = 13; i >= 0; i--) {
        const date = new Date(Date.now() - i * 86400000);
        const dayName = dayOptions[(date.getDay() + 6) % 7];
        const isPeak = busiestDays.includes(dayName);
        const variance = 0.7 + Math.random() * 0.6;
        const multiplier = isPeak ? 1 + benchmarks.peakUplift / 100 : 1;
        const dailyTotal = Math.round(profile.avgDailyRevenue * variance * multiplier * 100) / 100;
        txs.push({
          date: date.toISOString().slice(0, 10),
          items: [{ name: `${sector} daily sales`, qty: 1, price: dailyTotal }],
          total_amount: dailyTotal,
          payment_method: Math.random() > 0.5 ? 'DuitNow QR' : 'Cash',
          source: 'cold-start' as const,
        });
      }
      addTransactions(txs);
      setGenerating(false);
      setDone(true);
      setTimeout(() => {
        handleClose();
      }, 2000);
    }, 2500);
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setStep(0);
      setSector('');
      setBusiestDays([]);
      setAvgRevenue('');
      setDistrict(districts[0]);
      setDone(false);
      setGenerating(false);
    }, 300);
  };

  const steps = [
    {
      icon: Store,
      title: 'What\'s your micro-business sector?',
      subtitle: 'This helps us pull local industry benchmarks for your area',
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {sectors.map((s) => (
            <button
              key={s.id}
              onClick={() => setSector(s.id)}
              className={`flex items-center gap-3 p-4 rounded-xl border text-left transition-all duration-200 ${
                sector === s.id
                  ? 'border-brand-blue bg-brand-blue/10 ring-2 ring-brand-blue/30'
                  : 'border-surface-700 bg-surface-950/40 hover:border-surface-600 hover:bg-surface-800/50'
              }`}
            >
              <span className="text-2xl">{s.icon}</span>
              <div>
                <p className="text-sm font-semibold text-white">{s.id}</p>
                <p className="text-xs text-surface-500">{s.desc}</p>
              </div>
            </button>
          ))}
        </div>
      ),
    },
    {
      icon: Calendar,
      title: 'Which are your busiest sales days?',
      subtitle: 'Pick the days where sales typically spike',
      content: (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {dayOptions.map((day) => {
              const selected = busiestDays.includes(day);
              return (
                <button
                  key={day}
                  onClick={() => toggleDay(day)}
                  className={`px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                    selected
                      ? 'border-brand-blue bg-brand-blue/15 text-white'
                      : 'border-surface-700 bg-surface-950/40 text-surface-400 hover:border-surface-600 hover:text-white'
                  }`}
                >
                  {selected && <CheckCircle2 className="w-3.5 h-3.5 inline mr-1.5 text-brand-blue" />}
                  {day}
                </button>
              );
            })}
          </div>
          <div>
            <label className="text-xs text-surface-400 font-medium flex items-center gap-1.5 mb-2">
              <MapPin className="w-3.5 h-3.5" /> Your district (for local benchmarks)
            </label>
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full rounded-xl border border-surface-700 bg-surface-950/50 px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-blue/40"
            >
              {districts.map((d) => (
                <option key={d} value={d} className="bg-surface-900">{d}</option>
              ))}
            </select>
          </div>
        </div>
      ),
    },
    {
      icon: DollarSign,
      title: 'Estimated daily average revenue?',
      subtitle: 'A rough guess is fine — we\'ll refine it as you log sales',
      content: (
        <div className="space-y-4">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 font-medium text-lg">RM</span>
            <input
              type="number"
              value={avgRevenue}
              onChange={(e) => setAvgRevenue(e.target.value)}
              placeholder="150"
              autoFocus
              className="w-full rounded-xl border border-surface-700 bg-surface-950/50 pl-12 pr-4 py-4 text-2xl font-bold text-white placeholder:text-surface-600 focus:outline-none focus:ring-2 focus:ring-brand-blue/40 focus:border-brand-blue/60"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-surface-500 text-sm">per day</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[100, 250, 500].map((amt) => (
              <button
                key={amt}
                onClick={() => setAvgRevenue(String(amt))}
                className="px-3 py-2 rounded-lg border border-surface-700 bg-surface-950/40 text-sm text-surface-300 hover:bg-surface-800 hover:text-white transition-all"
              >
                RM {amt}
              </button>
            ))}
          </div>
          {avgRevenue && parseFloat(avgRevenue) > 0 && (
            <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-4">
              <p className="text-xs text-surface-300 leading-relaxed">
                Based on your inputs, we'll generate a <span className="font-semibold text-white">14-day synthetic baseline</span> using{' '}
                <span className="font-semibold text-green-400">{district}</span> benchmarks for the{' '}
                <span className="font-semibold text-white">{sector}</span> sector. Your predictive models can start working immediately.
              </p>
            </div>
          )}
        </div>
      ),
    },
  ];

  const StepIcon = steps[step].icon;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-2xl border border-surface-800 bg-surface-900 shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-surface-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-blue/20 to-brand-purple/20 border border-brand-blue/30 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-brand-blue" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">Cold-Start Baseline Engine</h3>
                  <p className="text-xs text-surface-500">For micro-sellers with under 14 days of data</p>
                </div>
              </div>
              <button onClick={handleClose} className="text-surface-500 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Progress */}
            <div className="px-6 pt-4">
              <div className="flex items-center gap-2">
                {steps.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                      i <= step ? 'bg-brand-blue' : 'bg-surface-800'
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-surface-500 mt-2">Step {step + 1} of {steps.length}</p>
            </div>

            {/* Content */}
            <div className="p-6">
              {done ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                    className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4"
                  >
                    <CheckCircle2 className="w-8 h-8 text-green-400" />
                  </motion.div>
                  <h4 className="text-lg font-bold text-white mb-1">Baseline Generated!</h4>
                  <p className="text-sm text-surface-400">
                    14 days of synthetic data created. Your dashboard is ready.
                  </p>
                </div>
              ) : generating ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Loader2 className="w-10 h-10 text-brand-blue animate-spin mb-4" />
                  <p className="text-sm font-medium text-white mb-1">Generating synthetic baseline...</p>
                  <p className="text-xs text-surface-500">Augmenting with {district} industry benchmarks</p>
                </div>
              ) : (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center">
                        <StepIcon className="w-4 h-4 text-brand-blue" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-white">{steps[step].title}</h4>
                        <p className="text-xs text-surface-500">{steps[step].subtitle}</p>
                      </div>
                    </div>
                    {steps[step].content}
                  </motion.div>
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            {!done && !generating && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-surface-800">
                <button
                  onClick={() => setStep((s) => Math.max(0, s - 1))}
                  disabled={step === 0}
                  className="flex items-center gap-1 px-4 py-2 text-sm text-surface-400 hover:text-white transition-colors disabled:opacity-40"
                >
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
                {step < steps.length - 1 ? (
                  <button
                    onClick={() => setStep((s) => s + 1)}
                    disabled={!canProceed[step]}
                    className="flex items-center gap-1 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-blue to-brand-purple text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-40"
                  >
                    Next <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={generate}
                    disabled={!canProceed[step]}
                    className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-green-600 to-green-500 text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-40"
                  >
                    <Sparkles className="w-4 h-4" /> Generate Baseline
                  </button>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
