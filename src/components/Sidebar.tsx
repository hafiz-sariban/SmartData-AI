import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Upload,
  BrainCircuit,
  Megaphone,
  Settings,
  MessageCircle,
  Bot,
  ChevronLeft,
  ChevronRight,
  Zap,
  Crown,
  Sparkles,
  Rocket,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Upload, label: 'Upload Data', path: '/upload' },
  { icon: BrainCircuit, label: 'AI Analysis Hub', path: '/analysis' },
  { icon: Megaphone, label: 'Marketing Strategy', path: '/marketing' },
  { icon: Rocket, label: 'Revenue Recovery', path: '/recovery' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export function Sidebar({ onChatToggle }: { onChatToggle: () => void }) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside
      className={`flex-shrink-0 flex flex-col bg-surface-900 border-r border-surface-800 transition-all duration-300 ease-in-out ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Brand */}
      <div className="p-4 border-b border-surface-800">
        <div className="flex items-center gap-3">
          <div className="relative flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-brand-blue to-brand-purple flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
            <Sparkles className="w-3 h-3 text-yellow-300 absolute -top-1 -right-1" />
          </div>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="overflow-hidden"
            >
              <h1 className="text-sm font-bold text-white leading-tight">
                DataBijak AI
              </h1>
              <p className="text-[10px] text-surface-400 leading-tight">
                Turn Data into Smarter Actions
              </p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-brand-blue/20 to-brand-purple/20 text-brand-blue-light border border-brand-blue/20'
                    : 'text-surface-400 hover:text-white hover:bg-surface-800'
                }`
              }
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && (
                <span className="truncate">{item.label}</span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Chat toggle */}
      <div className="px-2 py-2">
        <button
          onClick={onChatToggle}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-surface-400 hover:text-white hover:bg-surface-800 transition-all duration-200"
        >
          <MessageCircle className="w-5 h-5 flex-shrink-0" />
          {!collapsed && (
            <span className="truncate">Ask AI CMO</span>
          )}
        </button>
      </div>

      {/* Collapse toggle */}
      <div className="px-2 py-2 border-t border-surface-800">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center px-3 py-2 rounded-lg text-surface-400 hover:text-white hover:bg-surface-800 transition-all"
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <>
              <ChevronLeft className="w-5 h-5" />
              <span className="ml-2 text-xs">Collapse</span>
            </>
          )}
        </button>
      </div>

      {/* Pricing Plan */}
      <div className="p-4 border-t border-surface-800">
        <div className="relative rounded-xl bg-gradient-to-br from-brand-blue/10 to-brand-purple/10 border border-brand-blue/20 p-3">
          <div className="flex items-center gap-2 mb-1">
            <Crown className="w-4 h-4 text-yellow-400" />
            {!collapsed && (
              <span className="text-xs font-semibold text-white">
                Basic Plan
              </span>
            )}
          </div>
          {!collapsed && (
            <>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-bold text-white">RM49</span>
                <span className="text-xs text-surface-400">/month</span>
              </div>
              <div className="mt-2 flex items-center gap-1 text-xs text-green-400">
                <Zap className="w-3 h-3" />
                <span>Active</span>
              </div>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}
