import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Database,
  Bot,
  TrendingUp,
  FileText,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  ArrowRight,
  Clock,
} from 'lucide-react';
import { StatCard } from '../components/StatCard';
import { supabase } from '../lib/supabase';

interface Project {
  id: string;
  name: string;
  file_type: string;
  records_count: number;
  health_status: 'good' | 'warning' | 'critical';
  created_at: string;
}

const healthConfig = {
  good: { icon: CheckCircle2, color: 'text-green-400', bg: 'bg-green-500/10', label: 'Good' },
  warning: { icon: AlertTriangle, color: 'text-yellow-400', bg: 'bg-yellow-500/10', label: 'Warning' },
  critical: { icon: AlertCircle, color: 'text-red-400', bg: 'bg-red-500/10', label: 'Critical' },
};

export function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setProjects(data || []);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-1"
      >
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-surface-400 text-sm">
          Welcome to SmartData AI — Turn Data into Smarter Actions
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Total Records Processed"
          value="12,450"
          subtitle="Records processed across all projects"
          icon={Database}
          trend="+1,240 this week"
          color="blue"
        />
        <StatCard
          title="Active AI Agents"
          value="4"
          subtitle="Multi-agent CRISP-DM pipeline running"
          icon={Bot}
          color="purple"
        />
        <StatCard
          title="Sales Growth Driven"
          value="+22.4%"
          subtitle="Average improvement in conversion rate"
          icon={TrendingUp}
          trend="Target: +30%"
          color="green"
        />
      </div>

      {/* Recent Projects */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl border border-surface-800 bg-surface-900/50 backdrop-blur-sm overflow-hidden"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-surface-800">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-brand-blue" />
            <h2 className="text-lg font-semibold text-white">Recent Projects</h2>
          </div>
          <button className="text-sm text-brand-blue-light hover:text-brand-blue flex items-center gap-1 transition-colors">
            View all <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-surface-400 text-xs uppercase tracking-wider border-b border-surface-800">
                <th className="px-5 py-3 text-left font-medium">File Name</th>
                <th className="px-5 py-3 text-left font-medium">Type</th>
                <th className="px-5 py-3 text-left font-medium">Records</th>
                <th className="px-5 py-3 text-left font-medium">Health Status</th>
                <th className="px-5 py-3 text-left font-medium">Uploaded</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8">
                    <div className="flex flex-col gap-2">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="h-12 rounded-lg bg-surface-800 animate-shimmer bg-[length:200%_100%] bg-gradient-to-r from-surface-800 via-surface-700 to-surface-800" />
                      ))}
                    </div>
                  </td>
                </tr>
              ) : (
                projects.map((project, i) => {
                  const health = healthConfig[project.health_status];
                  const HealthIcon = health.icon;
                  return (
                    <motion.tr
                      key={project.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="border-b border-surface-800/50 hover:bg-surface-800/30 transition-colors"
                    >
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-brand-blue-light" />
                          <span className="text-white font-medium">{project.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <span className="px-2 py-0.5 rounded-md bg-surface-800 text-surface-300 text-xs font-medium uppercase">
                          {project.file_type}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-surface-300">
                        {project.records_count.toLocaleString()}
                      </td>
                      <td className="px-5 py-3">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${health.bg} ${health.color} text-xs font-medium`}>
                          <HealthIcon className="w-3.5 h-3.5" />
                          {health.label}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-surface-400 text-xs flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(project.created_at).toLocaleDateString('en-MY', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
