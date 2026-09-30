import React, { useState } from 'react';
import { Heart, Sparkles, Users, Radio, Trophy, PlusCircle, Layers, Menu, X } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, profilesCount = 25 }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'landing', label: 'Overview', icon: Sparkles },
    { id: 'profiles', label: `People (${profilesCount})`, icon: Users },
    { id: 'dating', label: 'Date Arena', icon: Radio, pulse: true },
    { id: 'rankings', label: 'Rankings', icon: Trophy },
    { id: 'matrix', label: '25×25 Matrix', icon: Layers }
  ];

  const handleNav = (tab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-white/10 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand */}
        <div 
          onClick={() => handleNav('landing')}
          className="flex items-center space-x-3 cursor-pointer group"
        >
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#E8472A] via-[#6C47FF] to-[#FF7849] p-[2px] shadow-glow-spark group-hover:scale-105 transition-transform duration-300">
            <div className="w-full h-full bg-[#0A0A0F] rounded-[14px] flex items-center justify-center">
              <Heart className="w-5 h-5 text-[#E8472A] fill-[#E8472A] animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-xl tracking-tight text-white group-hover:text-[#E8472A] transition-colors">
                Agentic Dating
              </span>
              <span className="px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider bg-[#E8472A]/15 text-[#E8472A] border border-[#E8472A]/30 rounded-full font-semibold">
                Claude 4.6
              </span>
            </div>
            <p className="text-xs text-[#6B7280] hidden sm:block">Autonomous AI Romance on Public Data</p>
          </div>
        </div>

        {/* Desktop Navigation Tabs */}
        <nav className="hidden md:flex items-center space-x-1 glass-pill p-1.5 rounded-full">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`px-3.5 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 flex items-center space-x-1.5 ${
                activeTab === item.id
                  ? 'bg-gradient-to-r from-[#E8472A] to-[#6C47FF] text-white shadow-glow-spark'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon className={`w-3.5 h-3.5 ${item.pulse && activeTab !== item.id ? 'text-[#E8472A] animate-pulse' : ''}`} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-3">
          <div className="hidden lg:flex items-center space-x-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Mem0 + SSE Active</span>
          </div>

          <button
            onClick={() => handleNav('input')}
            className="hidden sm:flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#E8472A] to-[#6C47FF] text-white text-xs font-bold shadow-glow-spark hover:opacity-95 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Person</span>
          </button>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 transition"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#0A0A0F]/95 backdrop-blur-xl animate-fade-in">
          <div className="px-4 py-4 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`w-full px-4 py-3 rounded-xl text-sm font-semibold transition-all flex items-center space-x-3 ${
                  activeTab === item.id
                    ? 'bg-gradient-to-r from-[#E8472A]/20 to-[#6C47FF]/20 text-[#E8472A] border border-[#E8472A]/30'
                    : 'text-slate-300 hover:bg-white/5 border border-transparent'
                }`}
              >
                <item.icon className={`w-4 h-4 ${item.pulse && activeTab !== item.id ? 'text-[#E8472A] animate-pulse' : ''}`} />
                <span>{item.label}</span>
              </button>
            ))}
            
            <button
              onClick={() => handleNav('input')}
              className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-[#E8472A] to-[#6C47FF] text-white text-sm font-bold flex items-center justify-center space-x-2 mt-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add New Person</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
