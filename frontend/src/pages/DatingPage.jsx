import React, { useState, useEffect, useRef } from 'react';
import { 
  Heart, Radio, Play, Sparkles, Terminal, Volume2, 
  CheckCircle2, ArrowRight, RefreshCw, Trophy, Shuffle, Send, Layers, Flame
} from 'lucide-react';
import confetti from 'canvas-confetti';
import NotificationModal from '../components/NotificationModal';

export default function DatingPage({ profiles, preselectedId, onNavigateToProfile }) {
  const [person1Id, setPerson1Id] = useState(preselectedId || (profiles[0]?.id || ''));
  const [person2Id, setPerson2Id] = useState(profiles[6]?.id || (profiles[1]?.id || ''));
  const [simulating, setSimulating] = useState(false);
  const [speed, setSpeed] = useState('normal'); // 'normal' | 'fast' | 'instant'
  const [activeDate, setActiveDate] = useState(null);
  const [visibleTurnsCount, setVisibleTurnsCount] = useState(0);
  const [selectedHistoricalDate, setSelectedHistoricalDate] = useState(null);
  const [historicalDates, setHistoricalDates] = useState([]);
  const [showNotifyModal, setShowNotifyModal] = useState(false);
  const [activeTab, setActiveTab] = useState('conversation'); // 'conversation' | 'mcp' | 'memory'

  const chatEndRef = useRef(null);

  // Fetch historical pre-seeded or prior dates
  useEffect(() => {
    async function loadDates() {
      try {
        const res = await fetch('/api/dating/dates');
        const json = await res.json();
        if (json.success && json.data.length > 0) {
          setHistoricalDates(json.data);
          // Default to the first date if none active
          if (!activeDate) {
            setActiveDate(json.data[0]);
            setVisibleTurnsCount(json.data[0].turns?.length || 0);
          }
        }
      } catch (err) {
        console.error('Failed to load dates:', err);
      }
    }
    loadDates();
  }, []);

  // Sync preselected ID if passed from profile page
  useEffect(() => {
    if (preselectedId) {
      setPerson1Id(preselectedId);
      // Pick a different person for person2
      const other = profiles.find(p => p.id !== preselectedId);
      if (other) setPerson2Id(other.id);
    }
  }, [preselectedId, profiles]);

  // Scroll to bottom of chat
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [visibleTurnsCount]);

  const p1 = profiles.find(p => p.id === person1Id);
  const p2 = profiles.find(p => p.id === person2Id);

  const handleRandomPair = () => {
    if (profiles.length < 2) return;
    const r1 = Math.floor(Math.random() * profiles.length);
    let r2 = Math.floor(Math.random() * profiles.length);
    while (r2 === r1) {
      r2 = Math.floor(Math.random() * profiles.length);
    }
    setPerson1Id(profiles[r1].id);
    setPerson2Id(profiles[r2].id);
  };

  const handleStartSimulatedDate = async () => {
    if (!person1Id || !person2Id || person1Id === person2Id) return;

    setSimulating(true);
    setVisibleTurnsCount(0);

    try {
      const res = await fetch('/api/dating/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ person1Id, person2Id })
      });

      const json = await res.json();
      if (json.success && json.data) {
        setActiveDate(json.data);
        
        // Progressive reveal of turns with typing delay to feel like a real date
        const totalTurns = json.data.turns.length;

        if (speed === 'instant') {
          setVisibleTurnsCount(totalTurns);
          setSimulating(false);
          confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
        } else {
          let current = 0;
          const delayMs = speed === 'fast' ? 500 : 1300;
          
          const turnInterval = setInterval(() => {
            current += 1;
            setVisibleTurnsCount(current);
            if (current >= totalTurns) {
              clearInterval(turnInterval);
              setSimulating(false);
              confetti({
                particleCount: 80,
                spread: 70,
                origin: { y: 0.6 }
              });
            }
          }, delayMs);
        }
      } else {
        setSimulating(false);
      }
    } catch (err) {
      console.error('Date simulation error:', err);
      setSimulating(false);
    }
  };

  const handleSelectHistoricalDate = (date) => {
    setActiveDate(date);
    setPerson1Id(date.person1Id);
    setPerson2Id(date.person2Id);
    setVisibleTurnsCount(date.turns?.length || 0);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-roseNeon-500/10 border border-roseNeon-500/20 text-xs font-mono text-rose-300">
            <Radio className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
            <span>Step 4 • Model Context Protocol Multi-Agent Date Arena</span>
          </div>
          <h1 className="text-3xl font-display font-extrabold text-white mt-2">
            Simulated Agent Dating Session
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Two autonomous agents converse in their authentic personas, invoke MCP tools, record Mem0 memories, and submit independent compatibility scores.
          </p>
        </div>

        {/* Quick actions */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleRandomPair}
            className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 flex items-center space-x-1.5 transition"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>Random Pair</span>
          </button>
        </div>
      </div>

      {/* Agent Selector Matchup Card */}
      <div className="glass-panel p-6 rounded-3xl border border-white/10 relative overflow-hidden space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-center">
          
          {/* Agent 1 Selector */}
          <div className="md:col-span-2 space-y-3">
            <label className="text-[11px] font-mono text-slate-400 font-semibold uppercase tracking-wider block">
              Agent 1 (Initiator)
            </label>
            <select
              value={person1Id}
              onChange={(e) => setPerson1Id(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-midnight-900 border border-white/10 text-white text-xs font-semibold focus:outline-none focus:border-roseNeon-500"
            >
              {profiles.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} — {p.company || p.currentRole}
                </option>
              ))}
            </select>

            {p1 && (
              <div className="flex items-center space-x-3 p-3 rounded-2xl bg-midnight-950 border border-white/5">
                <img src={p1.avatar} alt={p1.name} className="w-12 h-12 rounded-xl object-cover" />
                <div className="min-w-0">
                  <div className="text-sm font-bold text-white truncate">{p1.name}</div>
                  <div className="text-xs text-rose-400 truncate">{p1.headline}</div>
                  <div className="text-[10px] text-slate-500 font-mono">Tone: {p1.voicePersona?.tone}</div>
                </div>
              </div>
            )}
          </div>

          {/* VS Match Center */}
          <div className="md:col-span-1 text-center flex flex-col items-center justify-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-roseNeon-500 to-violetNeon-500 flex items-center justify-center shadow-glow-rose font-display font-extrabold text-white text-sm">
              VS
            </div>
            <button
              onClick={handleStartSimulatedDate}
              disabled={simulating || person1Id === person2Id}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-roseNeon-500 via-roseNeon-600 to-violetNeon-500 text-white text-xs font-bold shadow-glow-rose hover:opacity-95 disabled:opacity-50 transition flex items-center justify-center space-x-1.5"
            >
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>{simulating ? 'Dating Live...' : 'Start Date'}</span>
            </button>

            {/* Playback speed toggle */}
            <div className="flex items-center space-x-1 pt-1">
              {[
                { id: 'normal', label: '1x' },
                { id: 'fast', label: '2x' },
                { id: 'instant', label: '⚡ Fast' }
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSpeed(s.id)}
                  className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold border transition ${
                    speed === s.id
                      ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                      : 'bg-white/5 border-white/5 text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Agent 2 Selector */}
          <div className="md:col-span-2 space-y-3">
            <label className="text-[11px] font-mono text-slate-400 font-semibold uppercase tracking-wider block">
              Agent 2 (Candidate)
            </label>
            <select
              value={person2Id}
              onChange={(e) => setPerson2Id(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-midnight-900 border border-white/10 text-white text-xs font-semibold focus:outline-none focus:border-violetNeon-500"
            >
              {profiles.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} — {p.company || p.currentRole}
                </option>
              ))}
            </select>

            {p2 && (
              <div className="flex items-center space-x-3 p-3 rounded-2xl bg-midnight-950 border border-white/5">
                <img src={p2.avatar} alt={p2.name} className="w-12 h-12 rounded-xl object-cover" />
                <div className="min-w-0">
                  <div className="text-sm font-bold text-white truncate">{p2.name}</div>
                  <div className="text-xs text-violet-400 truncate">{p2.headline}</div>
                  <div className="text-[10px] text-slate-500 font-mono">Tone: {p2.voicePersona?.tone}</div>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Quick Preloaded Date Switcher */}
        <div className="pt-4 border-t border-white/5 flex items-center space-x-2 overflow-x-auto text-xs pb-1">
          <span className="font-mono text-slate-500 text-[11px] whitespace-nowrap">Preloaded Real Dates:</span>
          {historicalDates.slice(0, 6).map((d) => (
            <button
              key={d.id}
              onClick={() => handleSelectHistoricalDate(d)}
              className={`px-3 py-1 rounded-lg text-[11px] whitespace-nowrap border transition ${
                activeDate?.id === d.id
                  ? 'bg-roseNeon-500/20 border-roseNeon-500 text-rose-300'
                  : 'bg-white/5 border-white/5 text-slate-400 hover:text-white'
              }`}
            >
              {d.person1Name.split(' ')[0]} & {d.person2Name.split(' ')[0]} ({d.scores?.overall}%)
            </button>
          ))}
        </div>

      </div>

      {/* Main Dating Arena: Chat & MCP Sidebar */}
      {activeDate && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Chat Transcript Area (2 cols) */}
          <div className="lg:col-span-2 glass-panel rounded-3xl border border-white/10 flex flex-col h-[650px] overflow-hidden">
            
            {/* Chat header */}
            <div className="p-4 bg-midnight-950 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex -space-x-2">
                  <img src={activeDate.person1Avatar} alt="p1" className="w-8 h-8 rounded-full border-2 border-midnight-950 object-cover" />
                  <img src={activeDate.person2Avatar} alt="p2" className="w-8 h-8 rounded-full border-2 border-midnight-950 object-cover" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white">
                    {activeDate.person1Name} & {activeDate.person2Name}
                  </h3>
                  <div className="flex items-center space-x-1.5 text-[10px] text-slate-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    <span>Multi-turn simulated dialogue • {visibleTurnsCount} of {activeDate.turns?.length || 0} turns</span>
                  </div>
                </div>
              </div>

              {activeDate.scores && (
                <div className="flex items-center space-x-2 bg-roseNeon-500/10 border border-roseNeon-500/30 px-3 py-1 rounded-xl">
                  <Flame className="w-3.5 h-3.5 text-rose-400" />
                  <span className="font-display font-extrabold text-sm text-rose-300">
                    {activeDate.scores.overall}% Match
                  </span>
                </div>
              )}
            </div>

            {/* Conversation Bubbles */}
            <div className="flex-1 p-5 overflow-y-auto space-y-4">
              {(activeDate.turns || []).slice(0, visibleTurnsCount).map((turn, i) => {
                const isP1 = turn.speakerId === activeDate.person1Id;

                return (
                  <div
                    key={i}
                    className={`flex items-start space-x-3 ${isP1 ? 'flex-row' : 'flex-row-reverse space-x-reverse'} animate-fade-in`}
                  >
                    <img
                      src={turn.avatar || (isP1 ? activeDate.person1Avatar : activeDate.person2Avatar)}
                      alt={turn.speaker}
                      className="w-10 h-10 rounded-2xl object-cover border border-white/10 flex-shrink-0 shadow-md"
                    />

                    <div className={`max-w-[80%] space-y-1.5 ${isP1 ? 'items-start' : 'items-end'}`}>
                      <div className={`flex items-center space-x-2 text-[10px] ${isP1 ? 'justify-start' : 'justify-end'}`}>
                        <span className="font-bold text-white">{turn.speaker}</span>
                        <span className="px-2 py-0.5 rounded-full bg-white/5 text-slate-400 font-mono">
                          {turn.tone || 'Conversational'}
                        </span>
                      </div>

                      <div
                        className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                          isP1
                            ? 'bg-midnight-900 border border-white/10 text-slate-100 rounded-tl-sm'
                            : 'bg-gradient-to-br from-rose-950/40 via-violet-950/40 to-midnight-900 border border-rose-500/30 text-white rounded-tr-sm'
                        }`}
                      >
                        {turn.text}
                      </div>

                      {/* MCP action badge */}
                      {turn.mcpAction && (
                        <div className={`flex items-center space-x-1.5 text-[10px] font-mono ${isP1 ? 'justify-start text-cyan-400' : 'justify-end text-violet-400'}`}>
                          <Layers className="w-3 h-3" />
                          <span>MCP: {turn.mcpAction.tool}()</span>
                          <span className="text-slate-500">• {turn.mcpAction.result}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {simulating && visibleTurnsCount < (activeDate.turns?.length || 0) && (
                <div className="flex items-center space-x-2 text-xs text-rose-400 font-mono animate-pulse p-2">
                  <div className="flex space-x-1">
                    <span className="w-2 h-2 rounded-full bg-rose-400 animate-bounce" />
                    <span className="w-2 h-2 rounded-full bg-rose-400 animate-bounce [animation-delay:0.2s]" />
                    <span className="w-2 h-2 rounded-full bg-rose-400 animate-bounce [animation-delay:0.4s]" />
                  </div>
                  <span>Agent is composing response in authentic voice...</span>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Date Summary footer */}
            {visibleTurnsCount >= (activeDate.turns?.length || 0) && activeDate.summary && (
              <div className="p-4 bg-midnight-950/90 border-t border-white/10 text-xs text-slate-300 flex items-center justify-between gap-4">
                <div className="line-clamp-2">
                  <span className="font-semibold text-rose-400">Date Synthesis: </span>
                  {activeDate.summary}
                </div>
                <button
                  onClick={() => setShowNotifyModal(true)}
                  className="px-3 py-1.5 rounded-xl bg-violetNeon-500/20 hover:bg-violetNeon-500/30 border border-violetNeon-500/40 text-violet-300 text-xs font-semibold whitespace-nowrap flex items-center space-x-1"
                >
                  <Send className="w-3 h-3" />
                  <span>Send Summary</span>
                </button>
              </div>
            )}

          </div>

          {/* Right Sidebar: MCP Logs & Scorecard (1 col) */}
          <div className="space-y-6">
            
            {/* Scorecard Widget */}
            {activeDate.scores && (
              <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                    <Trophy className="w-4 h-4" />
                    <span>Mutual Date Scorecard</span>
                  </div>
                  <span className="text-xl font-display font-black text-rose-400">
                    {activeDate.scores.overall}%
                  </span>
                </div>

                <div className="space-y-3 pt-2">
                  {[
                    { label: 'Chemistry', val: activeDate.scores.chemistry, color: 'bg-rose-500' },
                    { label: 'Shared Interests', val: activeDate.scores.sharedInterests, color: 'bg-cyan-500' },
                    { label: 'Lifestyle Alignment', val: activeDate.scores.lifestyle, color: 'bg-violet-500' },
                    { label: 'Conversation Quality', val: activeDate.scores.conversation, color: 'bg-emerald-500' }
                  ].map((metric, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-300">{metric.label}</span>
                        <span className="font-mono text-white font-bold">{metric.val}/10</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${metric.color}`}
                          style={{ width: `${(metric.val / 10) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* MCP & Mem0 Inspector */}
            <div className="glass-panel p-5 rounded-3xl border border-white/10 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center space-x-2 text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                  <Terminal className="w-4 h-4" />
                  <span>MCP & Mem0 Live State</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  PERSISTENT
                </span>
              </div>

              {/* Memories Formed during this date */}
              <div className="space-y-2">
                <span className="text-[11px] font-semibold text-slate-300">Memories Formed (Mem0 Store):</span>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {(activeDate.memoriesFormed || []).map((m, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-midnight-950 border border-white/5 text-[11px] font-mono space-y-0.5">
                      <div className="text-rose-400 font-semibold">{m.key}</div>
                      <div className="text-slate-300 text-[10px]">{m.value}</div>
                    </div>
                  ))}
                  {(!activeDate.memoriesFormed || activeDate.memoriesFormed.length === 0) && (
                    <div className="text-xs text-slate-500 italic">No memories committed yet.</div>
                  )}
                </div>
              </div>

              {/* MCP Tool Registry */}
              <div className="pt-3 border-t border-white/5 space-y-2">
                <span className="text-[11px] font-semibold text-slate-300">Model Context Protocol Registry:</span>
                <div className="space-y-1 text-[11px] font-mono text-slate-400">
                  <div className="flex items-center space-x-2">
                    <span className="text-emerald-400">✓</span>
                    <span>get_partner_profile(person_id)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-emerald-400">✓</span>
                    <span>store_memory(key, val)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-emerald-400">✓</span>
                    <span>recall_memory(key)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-emerald-400">✓</span>
                    <span>score_date(metrics)</span>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* Notification Modal */}
      {p1 && (
        <NotificationModal
          person={p1}
          isOpen={showNotifyModal}
          onClose={() => setShowNotifyModal(false)}
        />
      )}

    </div>
  );
}
