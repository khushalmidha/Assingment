import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Radio, Sparkles, Heart, Filter, ExternalLink, CheckCircle2 } from 'lucide-react';
import { LinkedinIcon, InstagramIcon } from '../components/Icons';

const ARCHETYPE_CATEGORIES = [
  'All Archetypes',
  'Nomads & Creators',
  'Design & Product',
  'Founders & Builders',
  'Science & Health'
];

const NEED_TYPES = ['All Needs', 'Emotional', 'Relational', 'Lifestyle'];

export default function ProfilesPage({ profiles, onSelectPerson, onStartDating }) {
  const [search, setSearch] = useState('');
  const [selectedArchetype, setSelectedArchetype] = useState('All Archetypes');
  const [selectedNeedType, setSelectedNeedType] = useState('All Needs');

  const filteredProfiles = useMemo(() => {
    return profiles.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        (p.headline && p.headline.toLowerCase().includes(search.toLowerCase())) ||
        (p.personality_archetype && p.personality_archetype.toLowerCase().includes(search.toLowerCase())) ||
        (p.topics && p.topics.some(t => t.toLowerCase().includes(search.toLowerCase())));

      if (!matchesSearch) return false;

      // Archetype filter
      if (selectedArchetype !== 'All Archetypes') {
        const arch = (p.personality_archetype || '').toLowerCase();
        if (selectedArchetype === 'Nomads & Creators') {
          if (!/nomad|minimalist|storyteller|synthesizer|hardware|community/i.test(arch)) return false;
        } else if (selectedArchetype === 'Design & Product') {
          if (!/designer|architect|product|pioneer|empathic/i.test(arch)) return false;
        } else if (selectedArchetype === 'Founders & Builders') {
          if (!/visionary|hacker|romantic|empire|polymath|contrarian|overachiever|hustler/i.test(arch)) return false;
        } else if (selectedArchetype === 'Science & Health') {
          if (!/neuro|techno|compounder|experimenter|matriarch/i.test(arch)) return false;
        }
      }

      // Need type filter
      if (selectedNeedType !== 'All Needs') {
        const targetType = selectedNeedType.toLowerCase();
        const hasType = (p.needs || []).some(n => (n.type || '').toLowerCase() === targetType);
        if (!hasType) return false;
      }

      return true;
    });
  }, [profiles, search, selectedArchetype, selectedNeedType]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#E8472A]/10 border border-[#E8472A]/20 text-xs font-mono text-[#E8472A]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>25 Verified Public Figures Cohort</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mt-2">
            The Autonomous Agent Roster
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280] mt-1">
            Every figure's agent operates strictly on public LinkedIn + Instagram data with verified citations.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, archetype, craft..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#13131A] border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-[#E8472A] transition"
          />
        </div>
      </div>

      {/* Filter Bars: Archetype + Need Type */}
      <div className="space-y-3 pt-2 border-t border-white/5">
        <div className="flex items-center justify-between flex-wrap gap-2">
          {/* Archetype filter */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
            {ARCHETYPE_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedArchetype(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition ${
                  selectedArchetype === cat
                    ? 'bg-[#E8472A] text-white shadow-glow-spark'
                    : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Need type filter */}
          <div className="flex items-center space-x-1 bg-[#13131A] p-1 rounded-xl border border-white/5">
            <span className="text-[10px] font-mono text-slate-500 px-2 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Need:
            </span>
            {NEED_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedNeedType(type)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition ${
                  selectedNeedType === type
                    ? 'bg-[#6C47FF] text-white shadow-glow-violet'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Masonry Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProfiles.map((p, index) => {
          const archetype = p.personality_archetype || p.headline || "Innovator";
          const hobbies = p.hobbies || [];
          const needs = p.needs || [];
          const isAnalyzed = p.status === 'ready' || true;

          return (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.4) }}
              onClick={() => onSelectPerson(p)}
              className="glass-panel glass-panel-hover rounded-2xl p-5 flex flex-col justify-between space-y-4 border border-white/10 cursor-pointer relative group"
            >
              {/* Top row: Avatar + Name + Status */}
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3.5">
                    <div className="relative">
                      <img
                        src={p.avatar}
                        alt={p.name}
                        className="w-14 h-14 rounded-2xl object-cover border-2 border-white/10 group-hover:border-[#E8472A] transition duration-300"
                      />
                      <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#0A0A0F]" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-[#E8472A] transition">
                        {p.name}
                      </h3>
                      <p className="text-xs text-slate-400 truncate max-w-[170px]">{p.role || p.company}</p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Analyzed</span>
                  </span>
                </div>

                {/* Archetype Badge */}
                <div className="mb-3">
                  <span className="text-[11px] font-mono px-3 py-1 rounded-lg bg-gradient-to-r from-[#E8472A]/15 to-[#6C47FF]/15 text-slate-200 border border-white/10 font-semibold inline-block">
                    {archetype}
                  </span>
                </div>

                {/* 3 Hobby Chips */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {hobbies.slice(0, 3).map((h, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 text-[10px] rounded-md bg-[#13131A] border border-white/5 text-slate-300"
                    >
                      {typeof h === 'string' ? h : h.hobby}
                    </span>
                  ))}
                </div>

                {/* Hover Reveal: Top 3 Needs with Source Tags */}
                <div className="pt-3 border-t border-white/5 space-y-1.5">
                  <div className="text-[10px] font-mono text-slate-500 flex items-center justify-between">
                    <span>CORE NEEDS EXTRACTED:</span>
                    <span className="text-[9px] text-[#E8472A]">VERIFIED EVIDENCE</span>
                  </div>
                  {needs.slice(0, 3).map((n, i) => (
                    <div key={i} className="text-[11px] text-slate-300 flex items-start space-x-1.5 leading-snug">
                      <span className="text-[#E8472A] mt-0.5">•</span>
                      <div className="flex-1">
                        <span>{n.need}</span>
                        <span className={`ml-1.5 text-[9px] font-mono uppercase px-1.5 py-0.2 rounded ${
                          n.source === 'linkedin' ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20' : 'bg-pink-500/10 text-pink-400 border border-pink-500/20'
                        }`}>
                          {n.source || 'public'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Actions & Links */}
              <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-2">
                <div className="flex items-center space-x-1.5">
                  <a
                    href={p.linkedinUrl || p.linkedin_url}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="p-1.5 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/20 transition"
                    title="View LinkedIn"
                  >
                    <LinkedinIcon className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href={p.instagramUrl || p.instagram_url}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="p-1.5 rounded-lg bg-pink-500/10 hover:bg-pink-500/20 text-pink-400 border border-pink-500/20 transition"
                    title="View Instagram"
                  >
                    <InstagramIcon className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectPerson(p);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-medium border border-white/10 transition"
                  >
                    Evidence
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onStartDating(p.id);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#E8472A] to-[#6C47FF] text-white text-xs font-bold shadow-glow-spark hover:opacity-95 transition flex items-center space-x-1"
                  >
                    <Radio className="w-3 h-3 animate-pulse" />
                    <span>Date</span>
                  </button>
                </div>
              </div>

            </motion.div>
          );
        })}
      </div>

    </div>
  );
}
