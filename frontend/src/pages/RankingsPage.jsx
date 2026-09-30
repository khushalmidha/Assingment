import React, { useState, useEffect } from 'react';
import { Trophy, Flame, Sparkles, Radio, ArrowRight, Send, Layers, Filter } from 'lucide-react';
import NotificationModal from '../components/NotificationModal';

export default function RankingsPage({ profiles, onSelectPerson, onStartDating }) {
  const [selectedPersonId, setSelectedPersonId] = useState(profiles[0]?.id || '');
  const [rankingsData, setRankingsData] = useState(null);
  const [globalLeaderboard, setGlobalLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState('individual'); // 'individual' | 'global'
  const [showNotifyModal, setShowNotifyModal] = useState(false);

  // Sync initial selection
  useEffect(() => {
    if (!selectedPersonId && profiles.length > 0) {
      setSelectedPersonId(profiles[0].id);
    }
  }, [profiles, selectedPersonId]);

  // Fetch individual rankings for selected person
  useEffect(() => {
    async function fetchRankings() {
      if (!selectedPersonId) return;
      setLoading(true);
      try {
        const res = await fetch(`/api/rankings/${selectedPersonId}`);
        const json = await res.json();
        if (json.success) {
          setRankingsData(json);
        }
      } catch (err) {
        console.error('Error fetching rankings:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchRankings();
  }, [selectedPersonId]);

  // Fetch global leaderboard
  useEffect(() => {
    async function fetchGlobal() {
      try {
        const res = await fetch('/api/rankings');
        const json = await res.json();
        if (json.success && json.leaderboard) {
          setGlobalLeaderboard(json.leaderboard);
        }
      } catch (err) {
        console.error('Error fetching global leaderboard:', err);
      }
    }
    fetchGlobal();
  }, []);

  const currentPerson = profiles.find(p => p.id === selectedPersonId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Title & View Switcher */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-mono text-amber-300">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>Step 5 • Compatibility Rankings & Explanations</span>
          </div>
          <h1 className="text-3xl font-display font-extrabold text-white mt-2">
            AI Compatibility Rankings
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Aggregated scores across all dates with detailed AI reasoning explaining why pairs match or clash.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center glass-pill p-1.5 rounded-full space-x-1">
          <button
            onClick={() => setActiveView('individual')}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition ${
              activeView === 'individual'
                ? 'bg-gradient-to-r from-roseNeon-500 to-violetNeon-500 text-white shadow-glow-rose'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Per-Person Rankings
          </button>
          <button
            onClick={() => setActiveView('global')}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition ${
              activeView === 'global'
                ? 'bg-gradient-to-r from-roseNeon-500 to-violetNeon-500 text-white shadow-glow-rose'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Global Top Couples
          </button>
        </div>
      </div>

      {/* INDIVIDUAL RANKINGS VIEW */}
      {activeView === 'individual' && (
        <div className="space-y-6">
          
          {/* Person Selector Header */}
          <div className="glass-panel p-6 rounded-3xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            
            <div className="space-y-2 flex-1">
              <label className="text-xs font-mono text-slate-400 font-semibold uppercase tracking-wider block">
                Select a person to view their ranked matches:
              </label>
              <select
                value={selectedPersonId}
                onChange={(e) => setSelectedPersonId(e.target.value)}
                className="w-full md:max-w-md px-4 py-3 rounded-2xl bg-midnight-900 border border-white/10 text-white text-sm font-semibold focus:outline-none focus:border-roseNeon-500"
              >
                {profiles.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.company || p.currentRole})
                  </option>
                ))}
              </select>
            </div>

            {currentPerson && (
              <div className="flex items-center space-x-4">
                <img
                  src={currentPerson.avatar}
                  alt={currentPerson.name}
                  className="w-14 h-14 rounded-2xl object-cover border border-white/20 shadow-lg"
                />
                <div className="min-w-0">
                  <h3 className="text-base font-bold text-white truncate">{currentPerson.name}</h3>
                  <p className="text-xs text-rose-400 truncate">{currentPerson.headline}</p>
                  <button
                    onClick={() => setShowNotifyModal(true)}
                    className="mt-1 text-[11px] text-violet-400 hover:text-violet-300 font-mono flex items-center space-x-1"
                  >
                    <Send className="w-3 h-3" />
                    <span>Send Telegram Summary</span>
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Rankings List */}
          {loading ? (
            <div className="p-16 text-center space-y-3">
              <div className="w-10 h-10 border-4 border-roseNeon-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs font-mono text-slate-400">Computing aggregated date scores & compatibility vectors...</p>
            </div>
          ) : rankingsData ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400 px-2">
                <span>Ranked from Best Match to Least Compatible ({rankingsData.rankings?.length} candidates)</span>
                <span className="font-mono text-emerald-400">AI Compatibility Engine Active</span>
              </div>

              {rankingsData.rankings?.map((match, idx) => {
                const isTop = idx === 0;
                const isRunnerUp = idx === 1 || idx === 2;

                return (
                  <div
                    key={match.person.id}
                    className={`glass-panel p-5 rounded-2xl border transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                      isTop
                        ? 'border-amber-400/40 bg-gradient-to-r from-amber-950/20 via-midnight-950 to-midnight-950'
                        : isRunnerUp
                        ? 'border-white/20'
                        : 'border-white/5 opacity-90'
                    }`}
                  >
                    <div className="flex items-start sm:items-center space-x-4">
                      
                      {/* Rank badge */}
                      <span
                        className={`w-9 h-9 rounded-2xl flex items-center justify-center font-display font-extrabold text-sm flex-shrink-0 ${
                          idx === 0
                            ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20'
                            : idx === 1
                            ? 'bg-slate-300 text-black'
                            : idx === 2
                            ? 'bg-amber-700 text-white'
                            : 'bg-white/5 text-slate-400 border border-white/10'
                        }`}
                      >
                        #{idx + 1}
                      </span>

                      {/* Avatar */}
                      <img
                        src={match.person.avatar}
                        alt={match.person.name}
                        className="w-14 h-14 rounded-2xl object-cover border border-white/15 shadow-md flex-shrink-0"
                      />

                      {/* Info & Reason */}
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="text-base font-bold text-white font-display">
                            {match.person.name}
                          </h4>
                          {isTop && (
                            <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-mono font-bold border border-amber-400/30">
                              BEST MATCH
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-rose-400 font-medium">
                          {match.person.company || match.person.headline}
                        </p>

                        {/* Match Reason (Step 5 Requirement) */}
                        <div className="text-xs text-slate-300 leading-relaxed bg-white/5 p-3 rounded-xl border border-white/5 mt-1 max-w-2xl">
                          <span className="font-semibold text-rose-300 mr-1">Match Reason:</span>
                          {match.reasons}
                        </div>
                      </div>

                    </div>

                    {/* Scores & CTAs */}
                    <div className="flex items-center space-x-6 justify-between md:justify-end pt-2 md:pt-0 border-t md:border-t-0 border-white/5">
                      
                      {/* Score metrics */}
                      <div className="text-right">
                        <div className="flex items-center space-x-1.5 justify-end">
                          <Flame className="w-4 h-4 text-rose-400" />
                          <span className="text-2xl font-display font-extrabold text-white">
                            {match.scores.overall}%
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 text-[10px] text-slate-400 font-mono mt-0.5">
                          <span>Chem: {match.scores.chemistry}</span>
                          <span>•</span>
                          <span>Interests: {match.scores.sharedInterests}</span>
                          <span>•</span>
                          <span>Life: {match.scores.lifestyle}</span>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => onStartDating(match.person.id)}
                          className="px-3.5 py-2 rounded-xl bg-roseNeon-500/20 hover:bg-roseNeon-500/30 text-rose-300 text-xs font-semibold border border-roseNeon-500/40 transition flex items-center space-x-1"
                        >
                          <Radio className="w-3.5 h-3.5 text-rose-400" />
                          <span>Simulate Date</span>
                        </button>
                      </div>

                    </div>

                  </div>
                );
              })}
            </div>
          ) : null}

        </div>
      )}

      {/* GLOBAL LEADERBOARD VIEW */}
      {activeView === 'global' && (
        <div className="space-y-4">
          <div className="text-xs text-slate-400">
            Top compatible pairings across the entire autonomous network of 26 public figures:
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {globalLeaderboard.map((item, idx) => (
              <div
                key={idx}
                className="glass-panel p-5 rounded-2xl border border-white/10 flex flex-col justify-between space-y-4 hover:border-roseNeon-500/30 transition"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex -space-x-3">
                      <img src={item.person1.avatar} alt="p1" className="w-12 h-12 rounded-2xl object-cover border-2 border-midnight-950" />
                      <img src={item.person2.avatar} alt="p2" className="w-12 h-12 rounded-2xl object-cover border-2 border-midnight-950" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">
                        {item.person1.name} & {item.person2.name}
                      </h4>
                      <p className="text-[11px] text-slate-400 font-mono">
                        Rank #{idx + 1} Power Match
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xl font-display font-extrabold text-rose-400">
                      {item.scores?.overall}%
                    </span>
                    <div className="text-[10px] text-slate-500 font-mono">Synergy</div>
                  </div>
                </div>

                <div className="text-xs text-slate-300 bg-white/5 p-3 rounded-xl border border-white/5 leading-relaxed">
                  💡 {item.reasons}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
                  <div className="flex space-x-2 text-[11px] font-mono text-slate-400">
                    <span>Chemistry: {item.scores?.chemistry}/10</span>
                    <span>•</span>
                    <span>Interests: {item.scores?.sharedInterests}/10</span>
                  </div>
                  <button
                    onClick={() => onStartDating(item.person1.id)}
                    className="text-xs font-semibold text-rose-400 hover:text-rose-300 flex items-center space-x-1"
                  >
                    <span>Launch Date</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notification Modal */}
      {currentPerson && (
        <NotificationModal
          person={currentPerson}
          isOpen={showNotifyModal}
          onClose={() => setShowNotifyModal(false)}
        />
      )}

    </div>
  );
}
