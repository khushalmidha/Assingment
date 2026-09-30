import React, { useState } from 'react';
import { Sparkles, Terminal, CheckCircle2, ArrowRight, Check, Play, AlertCircle } from 'lucide-react';
import { LinkedinIcon, InstagramIcon } from '../components/Icons';

const QUICK_PRESETS = [
  {
    name: 'Pieter Levels',
    role: 'Founder @ Nomad List & Remote OK',
    linkedin: 'https://www.linkedin.com/in/pieterlevels',
    instagram: 'https://www.instagram.com/levelsio'
  },
  {
    name: 'Marques Brownlee',
    role: 'Tech Creator & Pro Athlete',
    linkedin: 'https://www.linkedin.com/in/marques-brownlee-4b531478',
    instagram: 'https://www.instagram.com/mkbhd'
  },
  {
    name: 'Sam Altman',
    role: 'CEO @ OpenAI',
    linkedin: 'https://www.linkedin.com/in/samaltman',
    instagram: 'https://www.instagram.com/sama'
  },
  {
    name: 'Guillermo Rauch',
    role: 'CEO @ Vercel',
    linkedin: 'https://www.linkedin.com/in/rauchg',
    instagram: 'https://www.instagram.com/rauchg'
  },
  {
    name: 'Cleo Abram',
    role: 'Creator @ Huge If True',
    linkedin: 'https://www.linkedin.com/in/cleoabram',
    instagram: 'https://www.instagram.com/cleoabram'
  }
];

export default function InputPage({ onProfileCreated, onStartDating }) {
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState([]);
  const [createdProfile, setCreatedProfile] = useState(null);
  const [error, setError] = useState(null);

  const handleApplyPreset = (preset) => {
    setLinkedinUrl(preset.linkedin);
    setInstagramUrl(preset.instagram);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!linkedinUrl || !instagramUrl) {
      setError('Please provide both public LinkedIn and public Instagram URLs.');
      return;
    }

    setLoading(true);
    setError(null);
    setCreatedProfile(null);
    setTerminalLogs([
      { text: 'Initiating scrape pipeline across verified sources...', status: 'running' }
    ]);

    // Simulated terminal steps with checkmarks
    const steps = [
      'Fetching LinkedIn (Apify + Googlebot fallback)...',
      'Fetching Instagram (Apify + facebookexternalhit fallback)...',
      'Analyzing psychological traits with Claude Sonnet 4.6...',
      'Extracting Core Needs, Hobbies, and Evidence Citations...',
      'Building persistent voice profile in Mem0 memory store...'
    ];

    let stepIdx = 0;
    const interval = setInterval(() => {
      if (stepIdx < steps.length) {
        const currentText = steps[stepIdx];
        setTerminalLogs(prev => {
          const updated = [...prev];
          if (updated.length > 0) {
            updated[updated.length - 1].status = 'done';
          }
          updated.push({ text: currentText, status: 'running' });
          return updated;
        });
        stepIdx++;
      }
    }, 1100);

    try {
      const response = await fetch('/api/profiles/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ linkedinUrl, instagramUrl })
      });

      const result = await response.json();
      clearInterval(interval);

      if (result.success && result.data) {
        setTerminalLogs(prev => {
          const finalLogs = prev.map(l => ({ ...l, status: 'done' }));
          finalLogs.push({ text: 'Agent synthesized successfully! All evidence tags verified.', status: 'done' });
          return finalLogs;
        });
        setCreatedProfile(result.data);
        if (onProfileCreated) onProfileCreated(result.data);
      } else {
        setError(result.error || 'Failed to analyze profile.');
      }
    } catch (err) {
      clearInterval(interval);
      setError(err.message || 'Scraping and analysis pipeline encountered an error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 animate-fade-in">
      
      {/* Title */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#E8472A]/10 border border-[#E8472A]/20 text-xs font-mono text-[#E8472A]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Live Ingestion Pipeline</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white">
          Add New Person & Build Dating Agent
        </h1>
        <p className="text-xs sm:text-sm text-[#6B7280] max-w-xl mx-auto">
          Paste any public LinkedIn and Instagram links. Our multi-stage scraper parses bio and captions, feeds them to Claude Sonnet 4.6, and registers an autonomous dating agent.
        </p>
      </div>

      {/* Main Form Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
        
        {/* Quick Presets */}
        <div className="space-y-2">
          <label className="text-xs font-mono text-slate-400 block uppercase">
            Quick Fill From Cohort:
          </label>
          <div className="flex flex-wrap gap-2">
            {QUICK_PRESETS.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => handleApplyPreset(preset)}
                className="px-3 py-1.5 rounded-xl bg-[#0A0A0F] hover:bg-white/10 text-slate-300 text-xs font-medium border border-white/5 transition flex items-center space-x-1.5"
              >
                <span>{preset.name}</span>
                <span className="text-[10px] text-slate-500">({preset.role.split('@')[0].trim()})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-300 flex items-center space-x-1.5">
              <LinkedinIcon className="w-3.5 h-3.5 text-sky-400" />
              <span>Public LinkedIn URL</span>
            </label>
            <input
              type="url"
              required
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              placeholder="https://www.linkedin.com/in/username"
              className="w-full bg-[#0A0A0F] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#E8472A] transition"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-300 flex items-center space-x-1.5">
              <InstagramIcon className="w-3.5 h-3.5 text-pink-400" />
              <span>Public Instagram URL</span>
            </label>
            <input
              type="url"
              required
              value={instagramUrl}
              onChange={(e) => setInstagramUrl(e.target.value)}
              placeholder="https://www.instagram.com/username"
              className="w-full bg-[#0A0A0F] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#6C47FF] transition"
            />
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#E8472A] to-[#6C47FF] hover:opacity-95 text-white font-bold text-xs shadow-glow-spark flex items-center justify-center space-x-2 transition disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>{loading ? 'Synthesizing Agent...' : 'Scrape & Synthesize Dating Agent'}</span>
          </button>
        </form>

        {/* Real-Time Terminal Progress Log */}
        {(loading || terminalLogs.length > 0) && (
          <div className="rounded-2xl bg-[#0A0A0F] border border-white/10 p-5 font-mono text-xs space-y-2">
            <div className="flex items-center justify-between text-slate-500 pb-2 border-b border-white/5">
              <div className="flex items-center space-x-2">
                <Terminal className="w-4 h-4 text-[#E8472A]" />
                <span className="text-[11px] uppercase tracking-wider">AGENT SYNTHESIS TERMINAL LOG</span>
              </div>
              <span className="text-[10px] text-emerald-400">Claude Sonnet 4.6</span>
            </div>

            <div className="space-y-1.5 pt-1 text-slate-300">
              {terminalLogs.map((log, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  {log.status === 'done' ? (
                    <span className="text-emerald-400 font-bold">✓</span>
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-[#E8472A] animate-ping" />
                  )}
                  <span className={log.status === 'done' ? 'text-slate-300' : 'text-[#E8472A]'}>
                    {log.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Completed Ready Box */}
        {createdProfile && (
          <div className="p-6 rounded-2xl bg-[#0A0A0F] border border-emerald-500/30 text-center space-y-4 animate-fade-in">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto">
              <Check className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-white">Your agent is ready!</h3>
              <p className="text-xs text-[#E8472A] font-mono mt-0.5">
                {createdProfile.name} • {createdProfile.personality_archetype || 'The Creative Pioneer'}
              </p>
              <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                Verified psychological profile registered in memory. You can now launch a live simulated date against any of the other figures.
              </p>
            </div>

            <button
              onClick={() => onStartDating && onStartDating(createdProfile.id)}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#E8472A] to-[#6C47FF] text-white text-xs font-bold shadow-glow-spark inline-flex items-center space-x-2"
            >
              <span>Watch them date</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>

    </div>
  );
}
