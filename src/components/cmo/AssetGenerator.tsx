import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  Share2,
  LayoutTemplate,
  Megaphone,
  Sparkles,
  Copy,
  Check,
  Wand2,
  Globe,
} from 'lucide-react';
import { useCmoStore, localeCurrency } from '../../lib/cmoStore';

type Preset = 'email' | 'social' | 'landing' | 'ad';

const presets: { id: Preset; label: string; icon: typeof Mail; desc: string }[] = [
  { id: 'email', label: 'Email Sequence', icon: Mail, desc: 'High-converting 3-email sequence' },
  { id: 'social', label: 'Social Post', icon: Share2, desc: 'Meta / TikTok caption + hooks' },
  { id: 'landing', label: 'Landing Page', icon: LayoutTemplate, desc: 'Copy blueprint for landing pages' },
  { id: 'ad', label: 'Ad Creative', icon: Megaphone, desc: 'Copy + visual prompts for ads' },
];

const localEvents = ['Hari Raya Aidilfitri', '11.11 Mega Sale', 'Chinese New Year', 'Deepavali', 'Merdeka Sale', 'Year-End Clearance'];

function generateAsset(preset: Preset, instructions: string, dna: ReturnType<typeof useCmoStore>['brandDNA'], event: string): string {
  const brand = dna.brandName || 'Your Brand';
  const currency = localeCurrency[dna.locale];
  const tone = dna.tone.toLowerCase();
  const eventLine = event ? ` ${event} Special:` : '';

  switch (preset) {
    case 'email':
      return `Subject: ${eventLine} ${brand} — your early access is here

Hi [First Name],

We know you've been waiting for this.

${dna.uvp || 'Our handpicked offering'} — now available exclusively for you, our valued customer.

What's inside:
- Premium quality, crafted with care
- ${currency}25 off your first order (code: WELCOME25)
- Free delivery within Klang Valley

This ${tone} offer ends in 48 hours. Don't miss out.

[Claim Your Offer Now]

Warm regards,
The ${brand} Team

P.S. — Reply to this email and tell us what you'd love to see next. We read every message.

---

Email 2 (Day 2):
Subject: Still thinking? Here's what others are saying...

Hi [First Name],

We noticed you haven't claimed your ${currency}25 offer yet — so we wanted to share what other customers are saying:

"The best [product] I've had in years." — Aisyah, KL
"Fresh, fast, and absolutely worth it." — Wei Ming, PJ

Your discount code WELCOME25 expires tonight at midnight.

[Claim Before It's Gone]

---

Email 3 (Day 3):
Subject: Last call — your ${currency}25 offer expires in 3 hours

Hi [First Name],

This is it. Your exclusive ${event || 'welcome'} offer from ${brand} expires in 3 hours.

No gimmicks, no extensions. Just one last chance to save ${currency}25.

[Activate My Discount Now]

Thanks for being part of the ${brand} family.`;

    case 'social':
      return `Hook: ${eventLine} Stop scrolling — this one's for you. 🛑

Caption:
${brand} is here to change the game. ${dna.uvp || 'Quality you can feel, value you can trust.'}

${event ? `Celebrate ${event} with us:` : 'Why our customers keep coming back:'}
✨ Premium quality, every single time
✨ ${currency}25 OFF your first order
✨ Free delivery for orders above ${currency}80

Tag a friend who needs this. 👇

#SMEGrow #ShopLocal #${brand.replace(/\s/g, '')}${event ? ' #' + event.replace(/[^a-zA-Z]/g, '') : ''}

---

TikTok Variation:
POV: You just found the best ${dna.industry || 'local brand'} in KL 🤯

Comment "${event ? 'RAYA' : 'MINE'}" and we'll DM you the discount link 🔥

#SMEBusiness #ShopLocal #SMEGrow #SmallBusinessTok`;

    case 'landing':
      return `LANDING PAGE COPY BLUEPRINT — ${brand}

HERO HEADLINE:
${dna.uvp || 'Premium quality. Delivered with care.'}

HERO SUBHEAD:
${event || 'Experience'} the ${dna.industry || 'finest'} in Malaysia — crafted for ${dna.icp || 'people who deserve the best'}.

PRIMARY CTA: [Get Started — Save ${currency}25]
SECONDARY CTA: See How It Works

---

SOCIAL PROOF SECTION:
"What a game-changer. I'll never go back." — Aisyah, KL
"Fresh, fast, and worth every ringgit." — Wei Ming, PJ

---

FEATURE BLOCK 1:
Title: Crafted With Purpose
Body: Every ${brand} product is made with one goal — to exceed your expectations.

FEATURE BLOCK 2:
Title: Fast, Reliable Delivery
Body: Order before 2pm and get same-day delivery across Klang Valley.

FEATURE BLOCK 3:
Title: Risk-Free Guarantee
Body: Not happy? We'll make it right — no questions asked.

---

FINAL CTA:
Ready to experience ${brand}?
[Claim Your ${currency}25 Discount Now]`;

    case 'ad':
      return `AD CREATIVE — ${brand} ${event || 'Campaign'}

PRIMARY COPY:
${eventLine} ${dna.uvp || 'Premium quality, delivered.'}
Get ${currency}25 off your first order today.

HEADLINE OPTIONS:
1. "${currency}25 OFF — Limited Time Only"
2. "The ${dna.industry || 'local brand'} everyone's talking about"
3. "Try ${brand} risk-free — save ${currency}25"

VISUAL PROMPT 1 (Single Image):
A warm, inviting flat-lay of ${brand} products on a wooden table, soft natural lighting, Malaysian aesthetic, with a bold "${currency}25 OFF" badge in the top-right corner.

VISUAL PROMPT 2 (Carousel):
Slide 1: Close-up hero shot of the product
Slide 2: Happy customer using/enjoying the product
Slide 3: Behind-the-scenes making/process
Slide 4: Reviews + ratings card
Slide 5: CTA card with discount code

VISUAL PROMPT 3 (Video):
Open with a problem hook ("Tired of overpaying for [problem]?"), fast cuts of product highlights, end with bold CTA and ${currency}25 discount overlay.

TARGETING SUGGESTION:
${dna.icp || 'Working professionals aged 25-40 in Klang Valley'}
Interests: ${dna.industry || 'F&B, lifestyle, online shopping'}
Lookalike: Past purchasers

CTA: Shop Now`;

    default:
      return '';
  }
}

export function AssetGenerator() {
  const { brandDNA } = useCmoStore();
  const [preset, setPreset] = useState<Preset>('email');
  const [instructions, setInstructions] = useState('');
  const [event, setEvent] = useState('');
  const [output, setOutput] = useState('');
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const generate = () => {
    setGenerating(true);
    setOutput('');
    setTimeout(() => {
      setOutput(generateAsset(preset, instructions, brandDNA, event));
      setGenerating(false);
    }, 1200);
  };

  const copy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left: Prompt Inputs */}
      <div className="space-y-4">
        {/* Preset Selection */}
        <div className="rounded-2xl border border-surface-800 bg-surface-900/50 overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-4 border-b border-surface-800">
            <div className="w-8 h-8 rounded-lg bg-brand-purple/10 border border-brand-purple/20 flex items-center justify-center">
              <Wand2 className="w-4 h-4 text-brand-purple" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Asset Type</h3>
              <p className="text-xs text-surface-500">Select a format to generate</p>
            </div>
          </div>
          <div className="p-4 grid grid-cols-2 gap-3">
            {presets.map((p) => {
              const Icon = p.icon;
              const selected = preset === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setPreset(p.id)}
                  className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${
                    selected
                      ? 'border-brand-purple bg-brand-purple/10 ring-2 ring-brand-purple/30'
                      : 'border-surface-700 bg-surface-950/40 hover:border-surface-600'
                  }`}
                >
                  <Icon className={`w-5 h-5 flex-shrink-0 ${selected ? 'text-brand-purple' : 'text-surface-500'}`} />
                  <div>
                    <p className={`text-sm font-semibold ${selected ? 'text-white' : 'text-surface-300'}`}>{p.label}</p>
                    <p className="text-[10px] text-surface-500">{p.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Instructions */}
        <div className="rounded-2xl border border-surface-800 bg-surface-900/50 p-5 space-y-4">
          <div>
            <label className="text-xs text-surface-400 font-medium mb-1.5 block">Custom Instructions / Tone Overrides</label>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder={`e.g., Make it more ${brandDNA.tone.toLowerCase()}, emphasize urgency, target ${brandDNA.icp || 'your ICP'}...`}
              rows={3}
              className="w-full rounded-lg border border-surface-700 bg-surface-950/50 px-3 py-2.5 text-sm text-white placeholder:text-surface-600 focus:outline-none focus:ring-2 focus:ring-brand-purple/40 resize-none"
            />
          </div>

          <div>
            <label className="text-xs text-surface-400 font-medium flex items-center gap-1.5 mb-1.5">
              <Globe className="w-3.5 h-3.5" />
              Localized Event Framing (Malaysia / SEA)
            </label>
            <div className="flex flex-wrap gap-1.5">
              {localEvents.map((e) => (
                <button
                  key={e}
                  onClick={() => setEvent(event === e ? '' : e)}
                  className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                    event === e
                      ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
                      : 'border-surface-700 bg-surface-950/40 text-surface-400 hover:text-white'
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={generate}
            disabled={generating}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-brand-purple to-brand-blue text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-lg disabled:opacity-60"
          >
            <Sparkles className="w-4 h-4" />
            {generating ? 'Generating...' : 'Generate Asset'}
          </button>
        </div>
      </div>

      {/* Right: Output Display */}
      <div className="rounded-2xl border border-surface-800 bg-surface-900/50 overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-surface-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Ready-to-Copy Assets</h3>
              <p className="text-xs text-surface-500">{presets.find((p) => p.id === preset)?.label}</p>
            </div>
          </div>
          {output && (
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-surface-500">{output.length} chars</span>
              <button
                onClick={copy}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-surface-700 bg-surface-800/50 text-xs text-surface-300 hover:text-white hover:border-surface-600 transition-all"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-green-400" />
                    <span className="text-green-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        <div className="flex-1 p-5 min-h-[400px]">
          <AnimatePresence mode="wait">
            {generating ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center h-full"
              >
                <div className="w-8 h-8 border-2 border-brand-purple border-t-transparent rounded-full animate-spin mb-3" />
                <p className="text-sm text-surface-400">Generating {presets.find((p) => p.id === preset)?.label}...</p>
              </motion.div>
            ) : output ? (
              <motion.div
                key="output"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="h-full"
              >
                <pre className="text-sm text-surface-200 leading-relaxed whitespace-pre-wrap font-mono h-full overflow-y-auto">
                  {output}
                </pre>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center h-full text-center"
              >
                <Wand2 className="w-10 h-10 text-surface-700 mb-3" />
                <p className="text-sm text-surface-400">Configure your inputs and click Generate.</p>
                <p className="text-xs text-surface-600 mt-1">Outputs inherit your Brand DNA from Tab 1.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
