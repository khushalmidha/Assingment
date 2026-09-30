import React from 'react';
import { Heart, Sparkles, Radio, ArrowRight, ShieldCheck, Cpu, Flame, Users, Trophy, Play } from 'lucide-react';

export default function LandingPage({ profiles, onSelectPerson, onStartDating, onNavigate }) {
  const featuredProfiles = profiles.slice(0, 6);

  return (
    <div className="space-y-20 pb-16">
      
      {/* Hero Section */}
      <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden">
        {/* Ambient glow backgrounds */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-roseNeon-500/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 w-[400px] h-[300px] bg-violetNeon-500/15 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center px-4 relative z-10 space-y-6">
          
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-rose-300 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-rose-400" />
            <span>Autonomous Dating Agents • Powered by Claude Sonnet 4.6</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-extrabold tracking-tight text-white leading-[1.1]">
            Your AI Agent <br />
            <span className="gradient-text-flame">Dates On Your Behalf.</span>
          </h1>

          <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
            We scrape public LinkedIn & Instagram profiles, synthesize high-fidelity psychological personas, and orchestrate real multi-turn simulated dates with persistent memory and MCP tool harnesses.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => onNavigate('dating')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-roseNeon-500 via-roseNeon-600 to-violetNeon-500 text-white font-bold text-sm shadow-glow-rose hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-2 group"
            >
              <Radio className="w-4 h-4 text-white animate-pulse" />
              <span>Watch Live Agent Date</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => onNavigate('input')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 font-bold text-sm backdrop-blur-md transition-all flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-4 h-4 text-violet-400" />
              <span>Analyze New Profile</span>
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12 border-t border-white/10">
            <div className="glass-panel p-4 rounded-2xl text-center">
              <div className="text-2xl sm:text-3xl font-display font-extrabold text-white">26</div>
              <div className="text-xs text-slate-400 font-mono mt-1">Public Figures Scraped</div>
            </div>
            <div className="glass-panel p-4 rounded-2xl text-center">
              <div className="text-2xl sm:text-3xl font-display font-extrabold text-rose-400">100%</div>
              <div className="text-xs text-slate-400 font-mono mt-1">Public Profiles (Zero Login)</div>
            </div>
            <div className="glass-panel p-4 rounded-2xl text-center">
              <div className="text-2xl sm:text-3xl font-display font-extrabold text-violet-400">4 Tools</div>
              <div className="text-xs text-slate-400 font-mono mt-1">MCP Model Context Protocol</div>
            </div>
            <div className="glass-panel p-4 rounded-2xl text-center">
              <div className="text-2xl sm:text-3xl font-display font-extrabold text-emerald-400">Mem0</div>
              <div className="text-xs text-slate-400 font-mono mt-1">Persistent Agent Memory</div>
            </div>
          </div>

        </div>
      </section>

      {/* 5-Step Agentic Architecture */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-mono font-semibold text-roseNeon-500 uppercase tracking-widest">
            End-To-End Architecture
          </span>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-white">
            How The Agentic Dating Engine Works
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            {
              step: '01',
              title: 'Playwright Stealth',
              desc: 'Visits public LinkedIn & Instagram profiles without login using randomized headers and anti-detection scroll delays.',
              color: 'from-amber-500/20 to-amber-500/5',
              border: 'border-amber-500/30',
              icon: '🌐'
            },
            {
              step: '02',
              title: 'Claude Sonnet 4.6',
              desc: 'Extracts Core Needs, Hobbies, Personality Traits, Lifestyle Signals, Dealbreakers, and 3 tailored conversation openers.',
              color: 'from-rose-500/20 to-rose-500/5',
              border: 'border-rose-500/30',
              icon: '🧠'
            },
            {
              step: '03',
              title: 'Voice Persona Synthesis',
              desc: 'Calibrates vocabulary, tone, and pacing based on Instagram captions and LinkedIn writing style.',
              color: 'from-violet-500/20 to-violet-500/5',
              border: 'border-violet-500/30',
              icon: '🎙️'
            },
            {
              step: '04',
              title: 'MCP Multi-Agent Date',
              desc: 'Agents converse for 6–8 turns, invoking get_partner_profile, store_memory, recall_memory, and score_date tools.',
              color: 'from-cyan-500/20 to-cyan-500/5',
              border: 'border-cyan-500/30',
              icon: '⚡'
            },
            {
              step: '05',
              title: 'Compatibility Matrix',
              desc: 'Aggregates multi-dimensional date scores to rank best matches with deep AI explanations.',
              color: 'from-emerald-500/20 to-emerald-500/5',
              border: 'border-emerald-500/30',
              icon: '🏆'
            }
          ].map((item, idx) => (
            <div
              key={idx}
              className={`p-6 rounded-2xl glass-panel bg-gradient-to-b ${item.color} border ${item.border} space-y-3 relative overflow-hidden`}
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl">{item.icon}</span>
                <span className="font-mono text-xs font-bold text-slate-500">{item.step}</span>
              </div>
              <h3 className="text-sm font-bold text-white font-display">{item.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Public Figure Agents */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-mono font-semibold text-roseNeon-500 uppercase tracking-widest">
              Live Demo Directory
            </span>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-white mt-1">
              Curated Public Figure Agents
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Pre-scraped and fully analyzed. Explore their profiles or launch real-time simulated dates.
            </p>
          </div>
          <button
            onClick={() => onNavigate('profiles')}
            className="text-xs font-semibold text-rose-400 hover:text-rose-300 flex items-center space-x-1 group"
          >
            <span>View All 26 Profiles</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProfiles.map((p) => (
            <div
              key={p.id}
              className="glass-panel glass-panel-hover rounded-2xl overflow-hidden p-5 flex flex-col justify-between space-y-4"
            >
              <div className="flex items-start space-x-4">
                <img
                  src={p.avatar}
                  alt={p.name}
                  className="w-16 h-16 rounded-2xl object-cover border border-white/10 shadow-lg"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold text-white truncate font-display">{p.name}</h3>
                  <p className="text-xs text-rose-400 font-medium truncate">{p.company || p.currentRole}</p>
                  <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{p.headline}</p>
                </div>
              </div>

              {/* Voice tone & hobbies */}
              <div className="space-y-2">
                <div className="flex items-center space-x-1.5 text-[11px] text-slate-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                  <span className="font-mono text-violet-300">Tone: {p.voicePersona?.tone || 'Thoughtful'}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(p.analysis?.hobbies || []).slice(0, 2).map((h, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 text-[10px] rounded-md bg-white/5 border border-white/10 text-slate-300 truncate max-w-[200px]"
                    >
                      {h}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 border-t border-white/5 flex items-center space-x-2">
                <button
                  onClick={() => onSelectPerson(p)}
                  className="flex-1 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-semibold border border-white/10 transition"
                >
                  View Profile
                </button>
                <button
                  onClick={() => onStartDating(p.id)}
                  className="py-2 px-3 rounded-xl bg-roseNeon-500/20 hover:bg-roseNeon-500/30 text-rose-400 text-xs font-semibold border border-roseNeon-500/30 transition flex items-center space-x-1"
                >
                  <Radio className="w-3 h-3" />
                  <span>Date</span>
                </button>
              </div>

            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
