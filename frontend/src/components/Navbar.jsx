import React from 'react';
import { Heart, Sparkles, Users, Cpu, Trophy, PlusCircle, Radio } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, profilesCount = 26, datesCount = 13 }) {
  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-white/10 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand */}
        <div 
          onClick={() => setActiveTab('landing')}
          className="flex items-center space-x-3 cursor-pointer group"
        >
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-roseNeon-500 via-violetNeon-500 to-cyanNeon-500 p-[2px] shadow-glow-rose group-hover:scale-105 transition-transform duration-300">
            <div className="w-full h-full bg-midnight-950 rounded-[14px] flex items-center justify-center">
              <Heart className="w-5 h-5 text-roseNeon-500 fill-roseNeon-500 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-display font-bold text-xl tracking-tight text-white group-hover:text-roseNeon-500 transition-colors">
                Agentic Dating
              </span>
              <span className="px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider bg-roseNeon-500/20 text-roseNeon-500 border border-roseNeon-500/30 rounded-full font-semibold">
                MCP 2.0
              </span>
            </div>
            <p className="text-xs text-slate-400">Autonomous AI Romance on Public Data</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center space-x-1 glass-pill p-1.5 rounded-full">
          <button
            onClick={() => setActiveTab('landing')}
            className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 flex items-center space-x-1.5 ${
              activeTab === 'landing'
                ? 'bg-gradient-to-r from-roseNeon-500 to-violetNeon-500 text-white shadow-glow-rose'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('profiles')}
            className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 flex items-center space-x-1.5 ${
              activeTab === 'profiles'
                ? 'bg-gradient-to-r from-roseNeon-500 to-violetNeon-500 text-white shadow-glow-rose'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Agents ({profilesCount})</span>
          </button>

          <button
            onClick={() => setActiveTab('dating')}
            className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 flex items-center space-x-1.5 ${
              activeTab === 'dating'
                ? 'bg-gradient-to-r from-roseNeon-500 to-violetNeon-500 text-white shadow-glow-rose'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
            <span>Date Simulator</span>
          </button>

          <button
            onClick={() => setActiveTab('rankings')}
            className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 flex items-center space-x-1.5 ${
              activeTab === 'rankings'
                ? 'bg-gradient-to-r from-roseNeon-500 to-violetNeon-500 text-white shadow-glow-rose'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Rankings</span>
          </button>
        </nav>

        {/* CTA Button */}
        <div className="flex items-center space-x-3">
          <div className="hidden lg:flex items-center space-x-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Claude Sonnet 4.6 Online</span>
          </div>

          <button
            onClick={() => setActiveTab('input')}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-roseNeon-500 via-roseNeon-600 to-violetNeon-500 text-white text-xs font-bold shadow-glow-rose hover:opacity-95 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Person</span>
          </button>
        </div>

      </div>
    </header>
  );
}
