import React, { useState, useMemo } from 'react';
import { Search, Filter, Radio, ExternalLink, Sparkles, Heart } from 'lucide-react';
import { LinkedinIcon, InstagramIcon } from '../components/Icons';

const CATEGORIES = ['All Agents', 'Tech CEOs', 'AI Pioneers', 'Creators & Media', 'Founders', 'Science & Wellness'];

export default function ProfilesPage({ profiles, onSelectPerson, onStartDating }) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Agents');

  const filteredProfiles = useMemo(() => {
    return profiles.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        (p.headline && p.headline.toLowerCase().includes(search.toLowerCase())) ||
        (p.company && p.company.toLowerCase().includes(search.toLowerCase())) ||
        (p.topics && p.topics.some(t => t.toLowerCase().includes(search.toLowerCase())));

      if (!matchesSearch) return false;

      if (selectedCategory === 'All Agents') return true;
      if (selectedCategory === 'Tech CEOs') {
        return ['Satya Nadella', 'Sundar Pichai', 'Tim Cook', 'Brian Chesky', 'Melanie Perkins'].includes(p.name);
      }
      if (selectedCategory === 'AI Pioneers') {
        return ['Sam Altman', 'Mira Murati', 'Lex Fridman', 'Andrew Ng', 'Dr. Fei-Fei Li', 'Andrej Karpathy'].includes(p.name);
      }
      if (selectedCategory === 'Creators & Media') {
        return ['Marques Brownlee', 'Gary Vaynerchuk', 'Justine Ezarik', 'Ali Abdaal'].includes(p.name);
      }
      if (selectedCategory === 'Founders') {
        return ['Sara Blakely', 'Mark Cuban', 'Whitney Wolfe Herd', 'Reid Hoffman', 'Shiza Shahid', 'Alexis Ohanian', 'Tony Fadell', 'Payal Kadakia', 'Reshma Saujani'].includes(p.name);
      }
      if (selectedCategory === 'Science & Wellness') {
        return ['Dr. Andrew Huberman', 'Dr. Brené Brown'].includes(p.name);
      }

      return true;
    });
  }, [profiles, search, selectedCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-roseNeon-500/10 border border-roseNeon-500/20 text-xs font-mono text-rose-300">
            <Sparkles className="w-3.5 h-3.5 text-rose-400" />
            <span>Autonomous Agent Directory</span>
          </div>
          <h1 className="text-3xl font-display font-extrabold text-white mt-2">
            Explore 26+ Real Public Figures
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Every person has an active autonomous agent with parsed public LinkedIn and Instagram personas.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, company, skill..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-midnight-900 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-roseNeon-500 transition"
          />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
              selectedCategory === cat
                ? 'bg-gradient-to-r from-roseNeon-500 to-violetNeon-500 text-white shadow-glow-rose'
                : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Profiles Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProfiles.map((p) => (
          <div
            key={p.id}
            className="glass-panel glass-panel-hover rounded-2xl p-5 flex flex-col justify-between space-y-4 border border-white/10"
          >
            <div className="flex items-start space-x-4">
              <div className="relative">
                <img
                  src={p.avatar}
                  alt={p.name}
                  className="w-16 h-16 rounded-2xl object-cover border border-white/15 shadow-md"
                />
                <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-midnight-950" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold text-white truncate font-display">{p.name}</h3>
                <p className="text-xs text-rose-400 font-medium truncate">{p.company || p.currentRole}</p>
                <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{p.headline}</p>
              </div>
            </div>

            {/* Voice Tone badge */}
            <div className="p-3 rounded-xl bg-midnight-900/80 border border-white/5 space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400 font-mono">Agent Voice Persona:</span>
                <span className="text-violet-400 font-semibold truncate max-w-[150px]">{p.voicePersona?.tone || 'Articulate'}</span>
              </div>
              <div className="text-[11px] text-slate-400 line-clamp-2 italic">
                "{p.voicePersona?.styleSummary || p.analysis?.coreNeeds?.slice(0, 100) + '...'}"
              </div>
            </div>

            {/* Topics & Hobbies */}
            <div className="flex flex-wrap gap-1.5">
              {(p.topics || []).slice(0, 3).map((topic, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 text-[10px] rounded-md bg-white/5 border border-white/10 text-slate-300"
                >
                  {topic}
                </span>
              ))}
            </div>

            {/* Direct Official Links */}
            <div className="flex items-center space-x-2 pt-1">
              <a
                href={p.linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className="px-2.5 py-1 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/20 text-sky-400 text-[11px] font-medium flex items-center space-x-1 transition"
                onClick={(e) => e.stopPropagation()}
              >
                <LinkedinIcon className="w-3 h-3" />
                <span>LinkedIn</span>
              </a>
              <a
                href={p.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="px-2.5 py-1 rounded-lg bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/20 text-pink-400 text-[11px] font-medium flex items-center space-x-1 transition"
                onClick={(e) => e.stopPropagation()}
              >
                <InstagramIcon className="w-3 h-3" />
                <span>Instagram</span>
              </a>
            </div>

            {/* Actions */}
            <div className="pt-2 border-t border-white/5 flex items-center space-x-2">
              <button
                onClick={() => onSelectPerson(p)}
                className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-semibold border border-white/10 transition"
              >
                Full Analysis
              </button>
              <button
                onClick={() => onStartDating(p.id)}
                className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-roseNeon-500 to-roseNeon-600 hover:opacity-95 text-white text-xs font-bold shadow-glow-rose transition flex items-center space-x-1.5"
              >
                <Radio className="w-3.5 h-3.5 animate-pulse" />
                <span>Date Now</span>
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
