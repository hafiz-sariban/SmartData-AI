import { motion } from 'framer-motion';
import { type LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: LucideIcon;
  trend?: string;
  color: 'blue' | 'purple' | 'green';
}

const colorMap = {
  blue: {
    bg: 'from-brand-blue/20 to-brand-blue/5',
    border: 'border-brand-blue/20',
    icon: 'text-brand-blue',
    iconBg: 'bg-brand-blue/20',
  },
  purple: {
    bg: 'from-brand-purple/20 to-brand-purple/5',
    border: 'border-brand-purple/20',
    icon: 'text-brand-purple',
    iconBg: 'bg-brand-purple/20',
  },
  green: {
    bg: 'from-green-500/20 to-green-500/5',
    border: 'border-green-500/20',
    icon: 'text-green-400',
    iconBg: 'bg-green-500/20',
  },
};

export function StatCard({ title, value, subtitle, icon: Icon, trend, color }: StatCardProps) {
  const colors = colorMap[color];
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`relative overflow-hidden rounded-2xl border ${colors.border} bg-gradient-to-br ${colors.bg} p-5 backdrop-blur-sm`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm text-surface-400 font-medium">{title}</p>
          <h3 className="text-2xl font-bold text-white">{value}</h3>
          <p className="text-xs text-surface-500">{subtitle}</p>
        </div>
        <div className={`w-10 h-10 rounded-xl ${colors.iconBg} flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${colors.icon}`} />
        </div>
      </div>
      {trend && (
        <div className="mt-3 flex items-center gap-1 text-xs font-medium text-green-400">
          <span className="inline-block w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-b-[5px] border-b-green-400" />
          {trend}
        </div>
      )}
    </motion.div>
  );
}
