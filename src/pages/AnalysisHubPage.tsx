import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, ZAxis } from 'recharts';
import { BrainCircuit, Users, TrendingUp, Clock, DollarSign, ShoppingCart } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Segment {
  id: string;
  segment_name: string;
  percentage: number;
  customer_count: number;
  avg_recency: number;
  avg_frequency: number;
  avg_monetary: number;
}

const COLORS = ['#0066FF', '#6B21A8', '#22C55E'];

const segmentColors: Record<string, string> = {
  'Legacy Stars': '#0066FF',
  'Champions': '#6B21A8',
  'Casual Visitors': '#22C55E',
};

interface MockCustomer {
  id: string;
  name: string;
  segment: string;
  recency: number;
  frequency: number;
  monetary: number;
  cluster: number;
}

const mockCustomers: MockCustomer[] = [
  { id: 'C001', name: 'John Morrison', segment: 'Legacy Stars', recency: 95, frequency: 6, monetary: 3200, cluster: 0 },
  { id: 'C002', name: 'Sarah Chen', segment: 'Champions', recency: 12, frequency: 38, monetary: 5800, cluster: 1 },
  { id: 'C003', name: 'David Patel', segment: 'Casual Visitors', recency: 42, frequency: 2, monetary: 150, cluster: 2 },
  { id: 'C004', name: 'Emily Wong', segment: 'Legacy Stars', recency: 88, frequency: 9, monetary: 2700, cluster: 0 },
  { id: 'C005', name: 'Michael Tan', segment: 'Champions', recency: 7, frequency: 45, monetary: 6200, cluster: 1 },
  { id: 'C006', name: 'Robert Lim', segment: 'Casual Visitors', recency: 30, frequency: 1, monetary: 80, cluster: 2 },
  { id: 'C007', name: 'Lisa Anderson', segment: 'Legacy Stars', recency: 102, frequency: 5, monetary: 3100, cluster: 0 },
  { id: 'C008', name: 'James Ooi', segment: 'Champions', recency: 14, frequency: 35, monetary: 5100, cluster: 1 },
  { id: 'C009', name: 'Karen Teo', segment: 'Casual Visitors', recency: 55, frequency: 3, monetary: 220, cluster: 2 },
  { id: 'C010', name: 'William Smith', segment: 'Casual Visitors', recency: 60, frequency: 1, monetary: 95, cluster: 2 },
];

const scatterData = mockCustomers.map((c) => ({
  x: c.frequency,
  y: c.monetary,
  z: c.recency,
  name: c.name,
  segment: c.segment,
  fill: segmentColors[c.segment],
}));

export function AnalysisHubPage() {
  const [segments, setSegments] = useState<Segment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('customer_segments').select('*').then(({ data }) => {
      setSegments(data || []);
      setLoading(false);
    });
  }, []);

  const pieData = segments.map((s) => ({
    name: s.segment_name,
    value: s.percentage,
    count: s.customer_count,
  }));

  const totalCustomers = segments.reduce((sum, s) => sum + s.customer_count, 0);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-1">
        <h1 className="text-2xl font-bold text-white">AI Analysis Hub</h1>
        <p className="text-surface-400 text-sm">
          CRISP-DM Phase 4-5: Customer segmentation insights powered by AI clustering.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {segments.map((segment, i) => {
          const iconMap = [
            { icon: Clock, label: 'Avg Recency', value: `${segment.avg_recency} days`, color: 'text-blue-400' },
            { icon: ShoppingCart, label: 'Avg Frequency', value: `${segment.avg_frequency} purchases`, color: 'text-purple-400' },
            { icon: DollarSign, label: 'Avg Monetary', value: `RM${segment.avg_monetary}`, color: 'text-green-400' },
          ];
          const Icon = iconMap[i].icon;
          return (
            <motion.div
              key={segment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl border border-surface-800 bg-surface-900/50 p-5"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[i] }}
                  />
                  <h3 className="text-sm font-semibold text-white">{segment.segment_name}</h3>
                </div>
                <span className="text-2xl font-bold text-white">{segment.percentage}%</span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-surface-400">Customers</span>
                  <span className="text-white font-medium">{segment.customer_count.toLocaleString()}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-surface-800 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: COLORS[i] }}
                    initial={{ width: 0 }}
                    animate={{ width: `${segment.percentage}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <Icon className={`w-4 h-4 ${iconMap[i].color}`} />
                  <span className="text-xs text-surface-400">{iconMap[i].label}:</span>
                  <span className="text-xs text-white font-medium">{iconMap[i].value}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl border border-surface-800 bg-surface-900/50 p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-brand-blue" />
            <h2 className="text-lg font-semibold text-white">Customer Segmentation</h2>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    border: '1px solid #1E293B',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '13px',
                  }}
                  formatter={(value: number, name: string, props: any) => [
                    `${value}% (${props.payload.count} customers)`,
                    name,
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-6 mt-2">
            {pieData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[index] }}
                />
                <span className="text-xs text-surface-300">{entry.name}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-2xl border border-surface-800 bg-surface-900/50 p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <BrainCircuit className="w-5 h-5 text-brand-purple" />
            <h2 className="text-lg font-semibold text-white">Cluster Visualization</h2>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis
                  type="number"
                  dataKey="x"
                  name="Frequency"
                  stroke="#64748B"
                  fontSize={12}
                  label={{ value: 'Purchase Frequency', position: 'bottom', fill: '#64748B', fontSize: 11 }}
                />
                <YAxis
                  type="number"
                  dataKey="y"
                  name="Monetary"
                  stroke="#64748B"
                  fontSize={12}
                  label={{ value: 'Monetary Value (RM)', angle: -90, position: 'insideLeft', fill: '#64748B', fontSize: 11 }}
                />
                <ZAxis type="number" dataKey="z" range={[100, 400]} />
                <Tooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    border: '1px solid #1E293B',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '13px',
                  }}
                  formatter={(value: number, name: string, props: any) => {
                    if (name === 'z') return [`${value} days`, 'Recency'];
                    return [value, name];
                  }}
                  labelFormatter={(label: any, payload: any) => {
                    if (payload && payload[0]) {
                      return payload[0].payload.name;
                    }
                    return '';
                  }}
                />
                <Scatter data={scatterData} fill="#8884d8">
                  {scatterData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} fillOpacity={0.8} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-6 mt-2">
            {Object.entries(segmentColors).map(([name, color]) => (
              <div key={name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                <span className="text-xs text-surface-300">{name}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="rounded-2xl border border-surface-800 bg-surface-900/50 overflow-hidden"
      >
        <div className="flex items-center gap-2 px-5 py-4 border-b border-surface-800">
          <TrendingUp className="w-5 h-5 text-green-400" />
          <h2 className="text-lg font-semibold text-white">Sample Customer Mapping</h2>
          <span className="ml-2 text-xs text-surface-500">(Showing {mockCustomers.length} of {totalCustomers} customers)</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-surface-400 text-xs uppercase tracking-wider border-b border-surface-800">
                <th className="px-5 py-3 text-left font-medium">Customer ID</th>
                <th className="px-5 py-3 text-left font-medium">Name</th>
                <th className="px-5 py-3 text-left font-medium">Segment</th>
                <th className="px-5 py-3 text-left font-medium">Recency (days)</th>
                <th className="px-5 py-3 text-left font-medium">Frequency</th>
                <th className="px-5 py-3 text-left font-medium">Monetary (RM)</th>
              </tr>
            </thead>
            <tbody>
              {mockCustomers.map((customer, i) => (
                <motion.tr
                  key={customer.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="border-b border-surface-800/50 hover:bg-surface-800/30 transition-colors"
                >
                  <td className="px-5 py-3 text-surface-300 font-mono">{customer.id}</td>
                  <td className="px-5 py-3 text-white font-medium">{customer.name}</td>
                  <td className="px-5 py-3">
                    <span
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium"
                      style={{
                        backgroundColor: `${segmentColors[customer.segment]}20`,
                        color: segmentColors[customer.segment],
                      }}
                    >
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: segmentColors[customer.segment] }} />
                      {customer.segment}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-surface-300">{customer.recency}</td>
                  <td className="px-5 py-3 text-surface-300">{customer.frequency}</td>
                  <td className="px-5 py-3 text-surface-300">{customer.monetary.toLocaleString()}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
