import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings,
  User,
  Bell,
  Shield,
  Palette,
  ChevronRight,
  Globe,
  CreditCard,
  HelpCircle,
  LogOut,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';

interface SettingItem {
  id: string;
  icon: typeof User;
  title: string;
  subtitle: string;
  type: 'toggle' | 'navigate' | 'info';
  value?: boolean;
  info?: string;
}

const settingSections: { title: string; items: SettingItem[] }[] = [
  {
    title: 'Account',
    items: [
      {
        id: 'profile',
        icon: User,
        title: 'Profile Settings',
        subtitle: 'Update your business information',
        type: 'navigate',
      },
      {
        id: 'notifications',
        icon: Bell,
        title: 'Notifications',
        subtitle: 'Email and push notification preferences',
        type: 'toggle',
        value: true,
      },
    ],
  },
  {
    title: 'Preferences',
    items: [
      {
        id: 'language',
        icon: Globe,
        title: 'Language',
        subtitle: 'English (default)',
        type: 'info',
        info: 'EN',
      },
      {
        id: 'theme',
        icon: Palette,
        title: 'Theme',
        subtitle: 'Dark mode (default)',
        type: 'toggle',
        value: true,
      },
    ],
  },
  {
    title: 'Security & Billing',
    items: [
      {
        id: 'security',
        icon: Shield,
        title: 'Security',
        subtitle: 'Two-factor authentication and password',
        type: 'navigate',
      },
      {
        id: 'billing',
        icon: CreditCard,
        title: 'Billing',
        subtitle: 'Basic Plan — RM49/month',
        type: 'navigate',
      },
    ],
  },
];

export function SettingsPage() {
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    notifications: true,
    theme: true,
  });

  const toggle = (id: string) => {
    setToggles((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-1"
      >
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-surface-400 text-sm">
          Manage your account, preferences, and billing
        </p>
      </motion.div>

      <div className="space-y-6">
        {settingSections.map((section, si) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: si * 0.1 }}
          >
            <h3 className="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-3 px-1">
              {section.title}
            </h3>
            <div className="rounded-2xl border border-surface-800 bg-surface-900/50 overflow-hidden">
              {section.items.map((item, ii) => {
                const Icon = item.icon;
                const isToggle = item.type === 'toggle';
                const isInfo = item.type === 'info';
                const isOn = toggles[item.id] ?? false;

                return (
                  <div
                    key={item.id}
                    className={`flex items-center gap-4 px-5 py-4 hover:bg-surface-800/30 transition-colors cursor-pointer ${
                      ii < section.items.length - 1
                        ? 'border-b border-surface-800/50'
                        : ''
                    }`}
                    onClick={() => isToggle && toggle(item.id)}
                  >
                    <div className="w-10 h-10 rounded-xl bg-surface-800 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-surface-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-white">
                        {item.title}
                      </h4>
                      <p className="text-xs text-surface-400">{item.subtitle}</p>
                    </div>
                    {isToggle && (
                      <div className="flex-shrink-0">
                        {isOn ? (
                          <ToggleRight className="w-6 h-6 text-brand-blue" />
                        ) : (
                          <ToggleLeft className="w-6 h-6 text-surface-600" />
                        )}
                      </div>
                    )}
                    {isInfo && (
                      <span className="text-xs text-surface-400 font-medium flex-shrink-0">
                        {item.info}
                      </span>
                    )}
                    {!isToggle && !isInfo && (
                      <ChevronRight className="w-5 h-5 text-surface-500 flex-shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        ))}

        {/* Help & Sign Out */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-2xl border border-surface-800 bg-surface-900/50 overflow-hidden"
        >
          <div className="flex items-center gap-4 px-5 py-4 border-b border-surface-800/50 hover:bg-surface-800/30 transition-colors cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-surface-800 flex items-center justify-center flex-shrink-0">
              <HelpCircle className="w-5 h-5 text-surface-400" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-medium text-white">Help Center</h4>
              <p className="text-xs text-surface-400">FAQs and documentation</p>
            </div>
            <ChevronRight className="w-5 h-5 text-surface-500" />
          </div>
          <div className="flex items-center gap-4 px-5 py-4 hover:bg-surface-800/30 transition-colors cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center flex-shrink-0">
              <LogOut className="w-5 h-5 text-red-400" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-medium text-red-400">Sign Out</h4>
              <p className="text-xs text-surface-400">Log out of your account</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
