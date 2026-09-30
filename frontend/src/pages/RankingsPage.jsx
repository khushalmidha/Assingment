import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Radio, ArrowRight, Play, Filter, Sparkles, Heart } from 'lucide-react';

export default function RankingsPage({ profiles, onSelectPerson, onStartDating, onWatchDate }) {
  const [selectedPersonId, setSelectedPersonId] = useState(profiles[0]?.id || '');
  const [rankingsData, setRankingsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('score'); // 'score' | 'chemistry' | 'values' | 'lifestyle'

  // Sync initial selection
  useEffect(() => {
    if (!selectedPersonId && profiles.length > 0) {
      setSelectedPersonId(profiles[0].id);
    }
  }, [profiles, selectedPersonId]);

  // Fetch rankings for selected person
  useEffect(() => {
    async function fetchRankings() {
      if (!selectedPersonId) return;
      setLoading(true);
      try {
        const res = await fetch(`/api/rankings/${selectedPersonId}`);
        const json = await res.json();
        if (json.success && json.rankings) {
          setRankingsData(json.rankings);
        }
      } catch (err) {
        console.error('Error fetching rankings:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchRankings();
  }, [selectedPersonId]);

  const currentPerson = profiles.find(p => p.id === selectedPersonId) || profiles[0];

  // Sorting by chosen dimension
  const sortedRankings = useMemo(() => {
    const list = [...rankingsData];
    if (sortBy === 'chemistry') {
      list.sort((a, b) => (b.score_breakdown?.chemistry || b.scores?.chemistry || 0) - (a.score_breakdown?.chemistry || a.scores?.chemistry || 0));
    } else if (sortBy === 'values') {
      list.sort((a, b) => (b.score_breakdown?.valuesAlignment || b.scores?.sharedInterests || 0) - (a.score_breakdown?.valuesAlignment || a.scores?.sharedInterests || 0));
    } else if (sortBy === 'lifestyle') {
      list.sort((a, b) => (b.score_breakdown?.lifestyleFit || b.scores?.lifestyle || 0) - (a.score_breakdown?.lifestyleFit || a.scores?.lifestyle || 0));
    } else {
      list.sort((a, b) => (b.score || b.scores?.overall || 0) - (a.score || a.scores?.overall || 0));
    }
    return list;
  }, [rankingsData, sortBy]);

  // Circular Score Ring Component
  const ScoreRing = ({ score }) => {
    const radius = 24;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    return (
      <div className="relative w-16 h-16 flex items-center justify-center flex-shrink-0">
        <svg className="w-16 h-16 transform -rotate-90">
          <circle
            cx="32"
            cy="32"
            r={radius}
            stroke="currentColor"
            strokeWidth="4"
            className="text-white/10"
            fill="transparent"
          />
          <circle
            cx="32"
            cy="32"
            r={radius}
            stroke="currentColor"
            strokeWidth="4"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={score >= 88 ? 'text-[#E8472A]' : score >= 78 ? 'text-[#6C47FF]' : 'text-sky-400'}
            fill="transparent"
          />
        </svg>
        <span className="absolute font-mono font-black text-sm text-white">{score}%</span>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fade-in">
      
      {/* Title & Target Person Selector */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-5">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#E8472A]/10 border border-[#E8472A]/20 text-xs font-mono text-[#E8472A]">
              <Trophy className="w-3.5 h-3.5" />
              <span>Ranked Compatibility Matches</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1">
              Compatibility Match Rankings
            </h1>
          </div>

          {/* Person Selector Dropdown */}
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono text-slate-400">Target Agent:</span>
            <select
              value={selectedPersonId}
              onChange={(e) => setSelectedPersonId(e.target.value)}
              className="bg-[#0A0A0F] border border-white/10 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-[#E8472A]"
            >
              {profiles.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Current Person Banner */}
        {currentPerson && (
          <div className="flex items-center space-x-4 p-4 rounded-2xl bg-[#0A0A0F] border border-white/5">
            <img
              src={currentPerson.avatar}
              alt={currentPerson.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-[#E8472A]"
            />
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-bold text-white">{currentPerson.name}</h2>
                <span className="px-2.5 py-0.5 rounded-full bg-[#E8472A]/15 text-[#E8472A] border border-[#E8472A]/30 text-[10px] font-mono font-semibold">
                  {currentPerson.personality_archetype || currentPerson.headline}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{currentPerson.role || currentPerson.company}</p>
              <p className="text-xs text-slate-300 italic font-serif mt-1">
                "{currentPerson.needs?.[0]?.evidence || 'Seeking authentic alignment and deep craft.'}"
              </p>
            </div>
          </div>
        )}

        {/* Filter / Sort by Dimension */}
        <div className="flex items-center justify-between flex-wrap gap-3 pt-1">
          <div className="text-xs font-mono text-slate-400">
            Ranked Matches across all 24 potential partners:
          </div>

          <div className="flex items-center space-x-1.5 bg-[#0A0A0F] p-1 rounded-xl border border-white/5 text-xs">
            <span className="text-[10px] font-mono text-slate-500 px-2 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Sort by:
            </span>
            {[
              { id: 'score', label: 'Overall Score' },
              { id: 'chemistry', label: 'Chemistry' },
              { id: 'values', label: 'Values Alignment' },
              { id: 'lifestyle', label: 'Lifestyle Fit' }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setSortBy(f.id)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition ${
                  sortBy === f.id
                    ? 'bg-[#E8472A] text-white shadow-glow-spark font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Numbered Cards #1 through #24 */}
      {loading ? (
        <div className="max-w-4xl mx-auto py-24 text-center space-y-4">
          <div className="w-10 h-10 border-4 border-[#E8472A] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-mono text-slate-400">Calculating multi-factor compatibility matrices...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedRankings.map((item, index) => {
            const partner = item.person;
            const score = item.score || item.scores?.overall || 85;
            const breakdown = item.score_breakdown || {
              chemistry: (item.scores?.chemistry || 8) * 10,
              valuesAlignment: (item.scores?.sharedInterests || 8) * 10,
              lifestyleFit: (item.scores?.lifestyle || 8) * 10,
              wouldMeetAgain: (item.scores?.conversation || 8) * 10
            };

            return (
              <motion.div
                key={partner.id || index}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: Math.min(index * 0.03, 0.4) }}
                className="glass-panel glass-panel-hover p-5 sm:p-6 rounded-3xl border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 group"
              >
                {/* Left: Rank Badge + Partner Photo + Name + Archetype */}
                <div className="flex items-start sm:items-center space-x-4 min-w-0 md:w-1/3">
                  <span className={`w-8 h-8 rounded-xl font-mono font-black text-xs flex items-center justify-center flex-shrink-0 ${
                    index === 0
                      ? 'bg-[#E8472A] text-white shadow-glow-spark'
                      : index === 1
                      ? 'bg-[#6C47FF] text-white shadow-glow-violet'
                      : index === 2
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'bg-white/5 text-slate-400'
                  }`}>
                    #{index + 1}
                  </span>

                  <img
                    src={partner.avatar}
                    alt={partner.name}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-white/10 group-hover:border-[#E8472A] transition"
                  />

                  <div className="min-w-0">
                    <h3 className="text-base font-bold text-white group-hover:text-[#E8472A] transition truncate">
                      {partner.name}
                    </h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#6C47FF]/10 text-[#6C47FF] border border-[#6C47FF]/20 truncate block mt-0.5">
                      {partner.personality_archetype || partner.headline}
                    </span>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">{partner.role || partner.company}</p>
                  </div>
                </div>

                {/* Center: 2-Sentence Explanation + 4 Sub-Score Mini Bars */}
                <div className="flex-1 space-y-3 w-full md:w-auto">
                  <p className="text-xs text-slate-300 font-serif italic leading-relaxed">
                    "{item.explanation || item.reasons || 'You matched because of strong creative synergy. The date revealed high conversational reciprocity and values alignment.'}"
                  </p>

                  {/* 4 Sub-Scores as Mini Bars */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                    <div>
                      <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1">
                        <span>Chemistry</span>
                        <span>{breakdown.chemistry}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-[#0A0A0F] overflow-hidden">
                        <div className="h-full bg-[#E8472A] rounded-full" style={{ width: `${breakdown.chemistry}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1">
                        <span>Values</span>
                        <span>{breakdown.valuesAlignment}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-[#0A0A0F] overflow-hidden">
                        <div className="h-full bg-[#6C47FF] rounded-full" style={{ width: `${breakdown.valuesAlignment}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1">
                        <span>Lifestyle</span>
                        <span>{breakdown.lifestyleFit}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-[#0A0A0F] overflow-hidden">
                        <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${breakdown.lifestyleFit}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1">
                        <span>Would Meet</span>
                        <span>{breakdown.wouldMeetAgain}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-[#0A0A0F] overflow-hidden">
                        <div className="h-full bg-amber-400 rounded-full" style={{ width: `${breakdown.wouldMeetAgain}%` }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Circular Score Ring + "Watch their date →" Button */}
                <div className="flex items-center space-x-4 self-end md:self-center flex-shrink-0">
                  <ScoreRing score={score} />

                  <button
                    onClick={() => {
                      if (item.date_id || item.dateTranscriptId) {
                        onWatchDate && onWatchDate(item.date_id || item.dateTranscriptId);
                      } else {
                        onStartDating(currentPerson.id, partner.id);
                      }
                    }}
                    className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-gradient-to-r hover:from-[#E8472A] hover:to-[#6C47FF] text-white text-xs font-bold border border-white/10 hover:border-transparent transition flex items-center space-x-1.5 group-hover:shadow-glow-spark"
                  >
                    <span>Watch their date</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>

              </motion.div>
            );
          })}
        </div>
      )}

    </div>
  );
}
