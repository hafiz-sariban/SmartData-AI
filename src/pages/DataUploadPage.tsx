import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileSpreadsheet, CheckCircle2, Circle, Loader2, ArrowRight, Download, Sparkles, MessageSquare } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Papa from 'papaparse';

interface Agent {
  id: number;
  name: string;
  title: string;
  description: string;
  status: 'pending' | 'running' | 'complete';
}

const agents: Agent[] = [
  {
    id: 1,
    name: 'Data Engineer',
    title: 'Agent 1: Data Engineer',
    description: 'Analyzing columns, mapping schemas, and cleaning missing rows...',
    status: 'pending',
  },
  {
    id: 2,
    name: 'Business Consultant',
    title: 'Agent 2: Business Consultant',
    description: 'Determining objectives. Identified: Customer transaction data. Running RFM analysis...',
    status: 'pending',
  },
  {
    id: 3,
    name: 'Data Scientist Coder',
    title: 'Agent 3: Data Scientist Coder',
    description: 'Writing Python script. Executing K-Means clustering algorithm inside code sandbox...',
    status: 'pending',
  },
  {
    id: 4,
    name: 'Virtual CMO Agent',
    title: 'Agent 4: Virtual CMO Agent',
    description: 'Translating mathematical clusters into actionable marketing strategies...',
    status: 'pending',
  },
];

export function DataUploadPage() {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [agentStates, setAgentStates] = useState<Agent[]>(agents);
  const [completed, setCompleted] = useState(false);
  const [recordsCount, setRecordsCount] = useState(0);
  const [customPrompt, setCustomPrompt] = useState('');

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(e.type === 'dragenter' || e.type === 'dragover');
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && (droppedFile.name.endsWith('.csv') || droppedFile.name.endsWith('.xlsx') || droppedFile.name.endsWith('.xls'))) {
      setFile(droppedFile);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const startProcessing = async () => {
    if (!file) return;
    setProcessing(true);
    setCompleted(false);
    setAgentStates(agents.map(a => ({ ...a, status: 'pending' })));

    // Parse CSV if applicable
    let count = 0;
    if (file.name.endsWith('.csv')) {
      const text = await file.text();
      const parsed = Papa.parse(text, { header: true });
      count = parsed.data.length;
      setRecordsCount(count);
    } else {
      count = Math.floor(Math.random() * 5000) + 500;
      setRecordsCount(count);
    }

    // Simulate multi-agent pipeline
    for (let i = 0; i < agents.length; i++) {
      setAgentStates(prev =>
        prev.map((a, idx) =>
          idx === i ? { ...a, status: 'running' } : idx < i ? { ...a, status: 'complete' } : a
        )
      );
      await new Promise(r => setTimeout(r, 2000 + Math.random() * 1000));
      setAgentStates(prev =>
        prev.map((a, idx) =>
          idx === i ? { ...a, status: 'complete' } : a
        )
      );
    }

    // Save to database
    const ext = file.name.split('.').pop() || 'csv';
    await supabase.from('projects').insert({
      name: file.name,
      file_type: ext,
      records_count: count,
      health_status: 'good',
    });

    setProcessing(false);
    setCompleted(true);
  };

  const reset = () => {
    setFile(null);
    setProcessing(false);
    setCompleted(false);
    setAgentStates(agents.map(a => ({ ...a, status: 'pending' })));
    setCustomPrompt('');
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-1"
      >
        <h1 className="text-2xl font-bold text-white">Upload Data</h1>
        <p className="text-surface-400 text-sm">
          CRISP-DM Phase 1-3: Let the AI agents process your raw data into clean, structured insights.
        </p>
      </motion.div>

      <AnimatePresence mode="wait">
        {!file && !completed && (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => document.getElementById('file-input')?.click()}
              className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-12 text-center transition-all duration-300 ${
                isDragging
                  ? 'border-brand-blue bg-brand-blue/5 scale-[1.02]'
                  : 'border-surface-700 bg-surface-900/50 hover:border-surface-600 hover:bg-surface-800/50'
              }`}
            >
              <input
                id="file-input"
                type="file"
                accept=".csv,.xlsx,.xls"
                className="hidden"
                onChange={handleFileSelect}
              />
              <motion.div
                animate={isDragging ? { y: [0, -8, 0] } : {}}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-blue/20 to-brand-purple/20 border border-brand-blue/20 flex items-center justify-center mb-4"
              >
                <Upload className="w-8 h-8 text-brand-blue" />
              </motion.div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Drag & Drop Your Excel or CSV File
              </h3>
              <p className="text-sm text-surface-400 mb-1">
                Drop your Excel or CSV file here
              </p>
              <p className="text-xs text-surface-500">
                Supported formats: .csv, .xlsx, .xls (max 50MB)
              </p>
            </div>
          </motion.div>
        )}

        {file && !completed && (
          <motion.div
            key="processing"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* File info */}
            <div className="rounded-2xl border border-surface-800 bg-surface-900/50 p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-brand-blue/20 flex items-center justify-center">
                <FileSpreadsheet className="w-6 h-6 text-brand-blue" />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-medium">{file.name}</h3>
                <p className="text-xs text-surface-400">
                  {(file.size / 1024).toFixed(1)} KB &middot; {recordsCount > 0 ? `${recordsCount} records` : 'Parsing...'}
                </p>
              </div>
              {!processing && (
                <button
                  onClick={startProcessing}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-brand-blue to-brand-purple text-white text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Start AI Analysis
                </button>
              )}
              <button
                onClick={reset}
                className="text-sm text-surface-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
            </div>

            {/* Custom Analysis Instructions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className={`rounded-2xl border bg-surface-900/50 p-5 transition-all duration-300 ${
                processing
                  ? 'border-surface-800 opacity-60'
                  : 'border-surface-800'
              }`}
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="w-9 h-9 rounded-lg bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-4 h-4 text-brand-blue" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-white">
                    Custom Analysis Instructions (Optional)
                  </h3>
                  <p className="text-xs text-surface-400 mt-1 leading-relaxed">
                    Leave blank to let our AI agents autonomously audit and map out your data trends based on standardized retail performance benchmarks. Alternatively, type specific requirements below.
                  </p>
                </div>
              </div>
              <textarea
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value.slice(0, 500))}
                disabled={processing}
                placeholder="e.g., Focus heavily on our weekend product performance, identify our highest-churning customer pockets, or analyze cross-selling trends for the current holiday quarter..."
                className={`w-full rounded-xl border bg-surface-950/50 px-4 py-3 text-sm text-white placeholder:text-surface-600 resize-none transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/40 focus:border-brand-blue/60 ${
                  processing
                    ? 'border-surface-800 cursor-not-allowed'
                    : 'border-surface-700 hover:border-surface-600'
                }`}
                rows={4}
              />
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-surface-500">
                  {customPrompt.trim() === ''
                    ? 'AI agents will apply autonomous default analysis based on retail benchmarks.'
                    : 'Custom instructions will guide the AI agents during analysis.'}
                </p>
                <span className={`text-xs font-mono ${customPrompt.length > 450 ? 'text-yellow-400' : 'text-surface-600'}`}>
                  {customPrompt.length}/500
                </span>
              </div>
            </motion.div>

            {/* Agent Pipeline */}
            <div className="rounded-2xl border border-surface-800 bg-surface-900/50 p-6 space-y-4">
              <h3 className="text-sm font-semibold text-surface-300 uppercase tracking-wider">
                Multi-Agent Pipeline
              </h3>
              <div className="space-y-3">
                {agentStates.map((agent, index) => (
                  <motion.div
                    key={agent.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-500 ${
                      agent.status === 'running'
                        ? 'border-brand-blue/40 bg-brand-blue/5'
                        : agent.status === 'complete'
                        ? 'border-green-500/30 bg-green-500/5'
                        : 'border-surface-800 bg-surface-800/30'
                    }`}
                  >
                    <div className="flex-shrink-0">
                      {agent.status === 'complete' ? (
                        <CheckCircle2 className="w-6 h-6 text-green-400" />
                      ) : agent.status === 'running' ? (
                        <Loader2 className="w-6 h-6 text-brand-blue animate-spin" />
                      ) : (
                        <Circle className="w-6 h-6 text-surface-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-sm font-semibold text-white">
                          {agent.title}
                        </span>
                        {agent.status === 'running' && (
                          <span className="px-2 py-0.5 rounded-md bg-brand-blue/20 text-brand-blue text-[10px] font-bold animate-pulse">
                            RUNNING
                          </span>
                        )}
                        {agent.status === 'complete' && (
                          <span className="px-2 py-0.5 rounded-md bg-green-500/20 text-green-400 text-[10px] font-bold">
                            DONE
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-surface-400">{agent.description}</p>
                    </div>
                    {agent.status === 'running' && (
                      <div className="flex-shrink-0 w-24 h-1.5 rounded-full bg-surface-800 overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-brand-blue to-brand-purple"
                          initial={{ width: '0%' }}
                          animate={{ width: '100%' }}
                          transition={{ duration: 2.5, ease: 'easeInOut' }}
                        />
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {completed && (
          <motion.div
            key="completed"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            <div className="rounded-2xl border border-green-500/30 bg-green-500/5 p-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className="mx-auto w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4"
              >
                <CheckCircle2 className="w-8 h-8 text-green-400" />
              </motion.div>
              <h3 className="text-xl font-bold text-white mb-2">
                Analysis Complete!
              </h3>
              <p className="text-sm text-surface-400 mb-6">
                All 4 AI agents have successfully processed your data. {recordsCount} records analyzed.
              </p>
              <div className="flex items-center justify-center gap-3">
                <a
                  href="/analysis"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-blue to-brand-purple text-white text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
                >
                  View AI Analysis Hub
                  <ArrowRight className="w-4 h-4" />
                </a>
                <button
                  onClick={reset}
                  className="px-5 py-2.5 rounded-xl border border-surface-700 text-surface-300 text-sm font-medium hover:bg-surface-800 transition-colors"
                >
                  Upload Another File
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
