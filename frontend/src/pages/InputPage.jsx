import React, { useState } from 'react';
import { Sparkles, Terminal, CheckCircle2, ArrowRight, Globe, Loader2, AlertCircle, Play } from 'lucide-react';
import { LinkedinIcon, InstagramIcon } from '../components/Icons';

const QUICK_PRESETS = [
  {
    name: 'Satya Nadella',
    role: 'CEO @ Microsoft',
    linkedin: 'https://www.linkedin.com/in/satyanadella',
    instagram: 'https://www.instagram.com/satyanadella'
  },
  {
    name: 'Sam Altman',
    role: 'CEO @ OpenAI',
    linkedin: 'https://www.linkedin.com/in/samaltman',
    instagram: 'https://www.instagram.com/sama'
  },
  {
    name: 'Mira Murati',
    role: 'AI Technologist, ex-CTO OpenAI',
    linkedin: 'https://www.linkedin.com/in/mira-murati',
    instagram: 'https://www.instagram.com/miramurati'
  },
  {
    name: 'Marques Brownlee',
    role: 'Tech Creator & Pro Athlete',
    linkedin: 'https://www.linkedin.com/in/marquesbrownlee',
    instagram: 'https://www.instagram.com/mkbhd'
  },
  {
    name: 'Whitney Wolfe Herd',
    role: 'Founder @ Bumble',
    linkedin: 'https://www.linkedin.com/in/whitney-wolfe-herd',
    instagram: 'https://www.instagram.com/whitney'
  }
];

export default function InputPage({ onProfileCreated }) {
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [logs, setLogs] = useState([]);
  const [createdProfile, setCreatedProfile] = useState(null);
  const [error, setError] = useState(null);

  const pipelineSteps = [
    'Launching Playwright stealth browser with randomized user agents...',
    'Navigating public LinkedIn & Instagram profiles (zero login required)...',
    'Extracting roles, bio, captions, hashtags, and writing style...',
    'Feeding scraped context to Claude Sonnet 4.6 Dating Profile Analyzer...',
    'Structuring Core Needs, Hobbies, Traits, Lifestyle Signals & 3 Openers...',
    'Synthesizing Voice Persona and persisting to Mem0 memory store...'
  ];

  const handleApplyPreset = (preset) => {
    setLinkedinUrl(preset.linkedin);
    setInstagramUrl(preset.instagram);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!linkedinUrl || !instagramUrl) {
      setError('Please provide both a public LinkedIn URL and a public Instagram URL.');
      return;
    }

    setLoading(true);
    setError(null);
    setCreatedProfile(null);
    setLogs([]);
    setActiveStep(0);

    // Simulate animated pipeline progress steps
    const stepInterval = setInterval(() => {
      setActiveStep((prev) => {
        if (prev < pipelineSteps.length - 1) {
          const next = prev + 1;
          setLogs((l) => [...l, `[${new Date().toLocaleTimeString()}] ${pipelineSteps[next]}`]);
          return next;
        }
        return prev;
      });
    }, 1400);

    try {
      setLogs([`[${new Date().toLocaleTimeString()}] Initiating scraping pipeline...`]);
      
      const response = await fetch('/api/profiles/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ linkedinUrl, instagramUrl })
      });

      const result = await response.json();
      clearInterval(stepInterval);

      if (result.success && result.data) {
        setActiveStep(pipelineSteps.length);
        setLogs((l) => [
          ...l,
          `[${new Date().toLocaleTimeString()}] ✅ Profile successfully analyzed: ${result.data.name}`,
          `[${new Date().toLocaleTimeString()}] Stored in database & Mem0 memory.`
        ]);
        setCreatedProfile(result.data);
      } else {
        throw new Error(result.error || 'Failed to analyze profile.');
      }
    } catch (err) {
      clearInterval(stepInterval);
      console.error('Scrape error:', err);
      setError(err.message || 'An error occurred during scraping and analysis.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-12">
      
      {/* Title */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-violetNeon-500/10 border border-violetNeon-500/20 text-xs font-mono text-violet-300">
          <Globe className="w-3.5 h-3.5 text-violet-400" />
          <span>Step 1 & 2 Pipeline • Automated Browser Ingestion</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-white">
          Ingest & Analyze a New Person
        </h1>
        <p className="text-sm text-slate-300 max-w-xl mx-auto">
          Paste a public LinkedIn profile URL and public Instagram URL. Our Playwright stealth scraper and Claude Sonnet 4.6 engine will automatically build their autonomous dating agent.
        </p>
      </div>

      {/* Preset Quick-Fill Buttons */}
      <div className="glass-panel p-5 rounded-2xl space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-slate-400 font-semibold uppercase tracking-wider">
            Quick-Fill Verified Presets:
          </span>
          <span className="text-[11px] text-slate-500">Click to autofill valid public pairs</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {QUICK_PRESETS.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleApplyPreset(p)}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-slate-300 hover:text-white transition flex items-center space-x-1.5"
            >
              <span>{p.name}</span>
              <span className="text-[10px] text-slate-500">({p.role})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
        
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-200 uppercase tracking-wider mb-2 flex items-center space-x-2">
              <LinkedinIcon className="w-4 h-4 text-sky-400" />
              <span>Public LinkedIn Profile URL</span>
            </label>
            <input
              type="url"
              placeholder="https://www.linkedin.com/in/satyanadella"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-midnight-900 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-roseNeon-500 focus:ring-1 focus:ring-roseNeon-500 transition font-mono"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-200 uppercase tracking-wider mb-2 flex items-center space-x-2">
              <InstagramIcon className="w-4 h-4 text-pink-400" />
              <span>Public Instagram Profile URL</span>
            </label>
            <input
              type="url"
              placeholder="https://www.instagram.com/satyanadella"
              value={instagramUrl}
              onChange={(e) => setInstagramUrl(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-midnight-900 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-roseNeon-500 focus:ring-1 focus:ring-roseNeon-500 transition font-mono"
              required
            />
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-roseNeon-500 via-roseNeon-600 to-violetNeon-500 text-white font-bold text-sm shadow-glow-rose hover:opacity-95 disabled:opacity-50 transition flex items-center justify-center space-x-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Scraping & Synthesizing Agent with Claude...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Trigger Autonomous Scraping & Analysis</span>
            </>
          )}
        </button>

      </form>

      {/* Real-time Pipeline Terminal Visualizer */}
      {(loading || logs.length > 0) && (
        <div className="glass-panel rounded-2xl overflow-hidden border border-white/10">
          <div className="bg-midnight-950 px-4 py-3 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span>Live Agent Ingestion Terminal</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/60" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
            </div>
          </div>
          <div className="p-4 bg-midnight-950/90 font-mono text-xs text-emerald-400 space-y-2 max-h-56 overflow-y-auto">
            {logs.map((log, idx) => (
              <div key={idx} className="flex items-start space-x-2 leading-relaxed">
                <span className="text-slate-600 select-none">&gt;</span>
                <span className="text-slate-300">{log}</span>
              </div>
            ))}
            {loading && (
              <div className="flex items-center space-x-2 text-rose-400 animate-pulse">
                <span>&gt;</span>
                <span>Executing: {pipelineSteps[activeStep] || 'Processing data...'}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Success Card */}
      {createdProfile && (
        <div className="glass-panel p-6 rounded-3xl border border-emerald-500/40 bg-emerald-950/10 space-y-6 animate-fade-in">
          <div className="flex items-center space-x-3 text-emerald-400">
            <CheckCircle2 className="w-6 h-6 flex-shrink-0" />
            <div>
              <h3 className="text-base font-bold text-white">Agent Created & Stored Successfully!</h3>
              <p className="text-xs text-slate-400">Profile synthesized, voice persona calibrated, and memory initialized.</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 p-4 rounded-2xl bg-midnight-900 border border-white/10">
            <img
              src={createdProfile.avatar}
              alt={createdProfile.name}
              className="w-16 h-16 rounded-2xl object-cover border border-white/20"
            />
            <div className="flex-1 min-w-0">
              <h4 className="text-base font-bold text-white truncate font-display">{createdProfile.name}</h4>
              <p className="text-xs text-rose-400 truncate">{createdProfile.company || createdProfile.currentRole}</p>
              <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{createdProfile.headline}</p>
            </div>
          </div>

          <div className="space-y-2 text-xs text-slate-300">
            <div className="font-semibold text-white">🎯 Core Needs Extracted:</div>
            <p className="text-slate-400 leading-relaxed bg-white/5 p-3 rounded-xl border border-white/5">
              {createdProfile.analysis?.coreNeeds}
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => onProfileCreated(createdProfile)}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-roseNeon-500 to-violetNeon-500 text-white font-bold text-xs shadow-glow-rose hover:opacity-95 transition flex items-center justify-center space-x-2"
            >
              <span>View Full Persona Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
