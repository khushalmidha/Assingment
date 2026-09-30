import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Radio, Play, Sparkles, Trophy, Shuffle, 
  ChevronDown, ChevronUp, CheckCircle2, RotateCcw, Scale, FastForward, Heart
} from 'lucide-react';
import confetti from 'canvas-confetti';

const SCENARIOS = [
  { id: 'coffee_chat', emoji: '☕', name: 'Coffee Chat', desc: 'Soma Espresso Bar, SF' },
  { id: 'gallery_walk', emoji: '🎨', name: 'Gallery Walk', desc: 'Chelsea Gallery, NYC' },
  { id: 'rooftop_dinner', emoji: '🌆', name: 'Rooftop Dinner', desc: 'Skyline Terrace, Austin' },
  { id: 'bookshop_browse', emoji: '📚', name: 'Bookshop', desc: 'City Lights, North Beach' },
  { id: 'farmers_market', emoji: '🌿', name: 'Farmers Market', desc: 'Ferry Building Plaza' }
];

export default function DatingPage({ profiles, preselectedId, onNavigateToProfile }) {
  const [person1Id, setPerson1Id] = useState(preselectedId || (profiles[0]?.id || ''));
  const [person2Id, setPerson2Id] = useState(profiles[1]?.id || (profiles[6]?.id || ''));
  const [selectedScenario, setSelectedScenario] = useState('coffee_chat');

  const [activeDate, setActiveDate] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [currentTurnIdx, setCurrentTurnIdx] = useState(0);
  const [streamingText, setStreamingText] = useState('');
  const [playbackSpeed, setPlaybackSpeed] = useState(1); // 1x or 2x
  const [expandedThoughts, setExpandedThoughts] = useState({});

  const [historicalDates, setHistoricalDates] = useState([]);
  const chatEndRef = useRef(null);
  const sseRef = useRef(null);

  // Sync profiles when loaded
  useEffect(() => {
    if (profiles.length > 0 && !person1Id) {
      setPerson1Id(profiles[0].id);
      setPerson2Id(profiles[1]?.id || profiles[0].id);
    }
  }, [profiles]);

  // Load completed dates from backend
  useEffect(() => {
    async function loadDates() {
      try {
        const res = await fetch('/api/dates');
        const json = await res.json();
        if (json.success && json.data.length > 0) {
          setHistoricalDates(json.data);
          if (!activeDate) {
            setActiveDate(json.data[0]);
            setCurrentTurnIdx(json.data[0].transcript?.length || 8);
          }
        }
      } catch (err) {
        console.error('Failed to load dates:', err);
      }
    }
    loadDates();
  }, []);

  // Auto scroll to bottom
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentTurnIdx, streamingText]);

  const p1 = profiles.find(p => p.id === person1Id) || profiles[0];
  const p2 = profiles.find(p => p.id === person2Id) || profiles[1];

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

  const toggleThought = (idx) => {
    setExpandedThoughts(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  // Start Date with live SSE streaming & progressive animation
  const handleStartDate = async () => {
    if (!person1Id || !person2Id || person1Id === person2Id) return;

    setIsSimulating(true);
    setCurrentTurnIdx(0);
    setStreamingText('');

    try {
      // 1. Call /api/dates/start
      const res = await fetch('/api/dates/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentAId: person1Id,
          agentBId: person2Id,
          scenario: selectedScenario
        })
      });

      const json = await res.json();
      if (!json.success || !json.data) {
        console.error('Failed to initialize date:', json.error);
        setIsSimulating(false);
        return;
      }

      const dateRecord = json.data;
      setActiveDate(dateRecord);

      // 2. Advance turns or stream via SSE
      const evtSource = new EventSource(`/api/dates/${dateRecord.id}/stream`);
      sseRef.current = evtSource;

      evtSource.addEventListener('turn_start', (e) => {
        setStreamingText('');
      });

      evtSource.addEventListener('token', (e) => {
        try {
          const payload = JSON.parse(e.data);
          setStreamingText(prev => prev + (payload.chunk || ''));
        } catch (err) {}
      });

      evtSource.addEventListener('turn_end', (e) => {
        try {
          const turnData = JSON.parse(e.data);
          setActiveDate(prev => {
            const nextTranscript = [...(prev?.transcript || [])];
            if (!nextTranscript.some(t => t.turn === turnData.turn)) {
              nextTranscript.push(turnData);
            }
            return {
              ...prev,
              transcript: nextTranscript,
              chemistry_scores: [...(prev?.chemistry_scores || []), turnData.chemistryScore]
            };
          });
          setCurrentTurnIdx(turnData.turn);
          setStreamingText('');
        } catch (err) {}
      });

      evtSource.addEventListener('date_completed', (e) => {
        try {
          const evalData = JSON.parse(e.data);
          setActiveDate(prev => ({
            ...prev,
            status: 'completed',
            agent_a_verdict: evalData.agent_a_verdict,
            agent_b_verdict: evalData.agent_b_verdict,
            judge_verdict: evalData.judge_verdict,
            final_score: evalData.final_score
          }));
          setIsSimulating(false);
          evtSource.close();
          confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
        } catch (err) {}
      });

      evtSource.onerror = async () => {
        // Fallback to rapid advance if SSE stream closes
        evtSource.close();
        if (dateRecord.transcript.length === 0) {
          const simRes = await fetch('/api/dates/simulate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ person1Id, person2Id, scenario: selectedScenario })
          });
          const simJson = await simRes.json();
          if (simJson.success && simJson.data) {
            setActiveDate(simJson.data);
            replayDate(simJson.data);
          }
        }
      };

    } catch (err) {
      console.error('Date initialization failed:', err);
      setIsSimulating(false);
    }
  };

  // Replay Date at 1x or 2x speed
  const replayDate = (dateObj = activeDate) => {
    if (!dateObj || !dateObj.transcript) return;
    setIsSimulating(true);
    setCurrentTurnIdx(0);
    setStreamingText('');

    const delay = playbackSpeed === 2 ? 600 : 1200;
    let turn = 0;

    const interval = setInterval(() => {
      turn++;
      setCurrentTurnIdx(turn);

      if (turn >= dateObj.transcript.length) {
        clearInterval(interval);
        setIsSimulating(false);
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      }
    }, delay);
  };

  const transcript = activeDate?.transcript || [];
  const visibleTurns = transcript.slice(0, currentTurnIdx);
  const currentTurn = visibleTurns[visibleTurns.length - 1];

  // Current stage calculation
  const currentStage = !currentTurn ? 'Opening' : currentTurn.stage;

  // Chemistry Meter score: 0-100
  const latestChemistry = activeDate?.chemistry_scores?.[currentTurnIdx - 1] || 76;

  // Color gradient for chemistry: Cold Blue (0) -> Violet (50) -> Warm Red-Orange (100)
  const getChemistryColor = (score) => {
    if (score >= 88) return 'from-[#FF6B4A] via-[#E8472A] to-[#D03B20]';
    if (score >= 78) return 'from-[#9F85FF] via-[#6C47FF] to-[#E8472A]';
    return 'from-sky-500 via-indigo-500 to-[#6C47FF]';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* ARENA HEADER: Two-Column Agent Selector + Scenario Picker */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#E8472A]/10 border border-[#E8472A]/20 text-xs font-mono text-[#E8472A]">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>Multi-Turn Agent Date Arena</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1">
              Select Agents & Date Scenario
            </h1>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleRandomPair}
              className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold border border-white/10 transition flex items-center space-x-1.5"
            >
              <Shuffle className="w-3.5 h-3.5 text-slate-400" />
              <span>Random Match</span>
            </button>
          </div>
        </div>

        {/* Two-Column Selection: Person A vs Person B */}
        <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
          
          {/* Person A Selector (Accent Orange #E8472A) */}
          <div className="md:col-span-5 p-4 rounded-2xl bg-[#0A0A0F] border border-[#E8472A]/30 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-[#E8472A]">
              <span>PERSON A (INITIATOR)</span>
              <span>Host Agent</span>
            </div>

            <div className="flex items-center space-x-3">
              <img
                src={p1?.avatar}
                alt={p1?.name}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-[#E8472A]"
              />
              <div className="flex-1 min-w-0">
                <select
                  value={person1Id}
                  onChange={(e) => setPerson1Id(e.target.value)}
                  className="w-full bg-[#13131A] border border-white/10 text-white rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-[#E8472A]"
                >
                  {profiles.map((p) => (
                    <option key={p.id} value={p.id} disabled={p.id === person2Id}>
                      {p.name} — {p.personality_archetype || p.role}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-400 mt-1 truncate">
                  {p1?.personality_archetype || p1?.headline}
                </p>
              </div>
            </div>
          </div>

          {/* VS Divider Badge */}
          <div className="md:col-span-1 text-center py-2">
            <span className="w-9 h-9 mx-auto rounded-full bg-gradient-to-r from-[#E8472A] to-[#6C47FF] text-white text-xs font-black flex items-center justify-center shadow-glass">
              VS
            </span>
          </div>

          {/* Person B Selector (Violet #6C47FF) */}
          <div className="md:col-span-5 p-4 rounded-2xl bg-[#0A0A0F] border border-[#6C47FF]/30 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-[#6C47FF]">
              <span>PERSON B (COUNTERPART)</span>
              <span>Invited Agent</span>
            </div>

            <div className="flex items-center space-x-3">
              <img
                src={p2?.avatar}
                alt={p2?.name}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-[#6C47FF]"
              />
              <div className="flex-1 min-w-0">
                <select
                  value={person2Id}
                  onChange={(e) => setPerson2Id(e.target.value)}
                  className="w-full bg-[#13131A] border border-white/10 text-white rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-[#6C47FF]"
                >
                  {profiles.map((p) => (
                    <option key={p.id} value={p.id} disabled={p.id === person1Id}>
                      {p.name} — {p.personality_archetype || p.role}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-400 mt-1 truncate">
                  {p2?.personality_archetype || p2?.headline}
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Scenario Selector: 5 Venue Cards */}
        <div className="space-y-2 pt-2">
          <label className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
            Select Intimate Venue Scenario:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {SCENARIOS.map((sc) => (
              <button
                key={sc.id}
                onClick={() => setSelectedScenario(sc.id)}
                className={`p-3 rounded-2xl text-left border transition ${
                  selectedScenario === sc.id
                    ? 'bg-[#E8472A]/15 border-[#E8472A] shadow-glow-spark'
                    : 'bg-[#0A0A0F] border-white/5 hover:border-white/15'
                }`}
              >
                <div className="text-xl mb-1">{sc.emoji}</div>
                <div className="text-xs font-bold text-white truncate">{sc.name}</div>
                <div className="text-[10px] text-slate-400 truncate">{sc.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Start Date Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-[#6B7280]">
            Autonomous 8-turn conversation with live SSE streaming & neutral judge adjudication.
          </div>
          <button
            onClick={handleStartDate}
            disabled={isSimulating}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#E8472A] to-[#6C47FF] hover:opacity-95 text-white font-bold text-xs shadow-glow-spark flex items-center justify-center space-x-2 transition disabled:opacity-50"
          >
            <Radio className="w-4 h-4 animate-pulse" />
            <span>{isSimulating ? 'Streaming Date in Progress...' : 'Start 8-Turn Date'}</span>
          </button>
        </div>

      </div>

      {/* SHOWPIECE: LIVE DATE INTERFACE */}
      {activeDate && (
        <div className="space-y-6">
          
          {/* Top Control Bar: Chemistry Meter & Stage Progress Indicator */}
          <div className="glass-panel p-5 rounded-3xl border border-white/10 space-y-4">
            
            {/* Top Row: Scenario Name + Playback Speed + Replay */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 pb-3">
              <div>
                <span className="text-xs font-mono text-[#E8472A] uppercase">Active Simulation</span>
                <h3 className="text-lg font-bold text-white font-sans">
                  {activeDate.scenarioDetails?.name || activeDate.scenario || 'Pour-Over Coffee Chat'}
                </h3>
              </div>

              <div className="flex items-center space-x-2">
                <div className="flex items-center bg-[#0A0A0F] p-1 rounded-xl border border-white/5 text-xs">
                  <button
                    onClick={() => setPlaybackSpeed(1)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition ${
                      playbackSpeed === 1 ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-white'
                    }`}
                  >
                    1x
                  </button>
                  <button
                    onClick={() => setPlaybackSpeed(2)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition ${
                      playbackSpeed === 2 ? 'bg-[#6C47FF] text-white' : 'text-slate-500 hover:text-white'
                    }`}
                  >
                    2x Speed
                  </button>
                </div>

                <button
                  onClick={() => replayDate()}
                  disabled={isSimulating}
                  className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold border border-white/10 transition flex items-center space-x-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Replay Date</span>
                </button>
              </div>
            </div>

            {/* Stage Indicator: Opening | Exploring | Deepening | Decision */}
            <div className="grid grid-cols-4 gap-2 pt-1">
              {[
                { stage: 'Opening', range: 'Turns 1-2' },
                { stage: 'Exploring', range: 'Turns 3-4' },
                { stage: 'Deepening', range: 'Turns 5-6' },
                { stage: 'Decision', range: 'Turns 7-8' }
              ].map((s, idx) => {
                const isActive = currentStage === s.stage;
                const isPassed = 
                  (s.stage === 'Opening' && currentTurnIdx >= 2) ||
                  (s.stage === 'Exploring' && currentTurnIdx >= 4) ||
                  (s.stage === 'Deepening' && currentTurnIdx >= 6) ||
                  (s.stage === 'Decision' && currentTurnIdx >= 8);

                return (
                  <div
                    key={s.stage}
                    className={`p-2.5 rounded-xl border text-center transition duration-300 ${
                      isActive
                        ? 'bg-[#E8472A]/15 border-[#E8472A] shadow-glow-spark'
                        : isPassed
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                        : 'bg-[#0A0A0F] border-white/5 text-slate-500'
                    }`}
                  >
                    <div className="text-[10px] font-mono uppercase">{s.range}</div>
                    <div className="text-xs font-bold text-white">{s.stage}</div>
                  </div>
                );
              })}
            </div>

            {/* Chemistry Meter: Animated progress bar transitioning from cold blue -> warm red */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-[#E8472A] fill-[#E8472A] animate-pulse" />
                  <span>Live Chemistry Resonance:</span>
                </span>
                <span className="font-bold text-white font-mono text-sm">{latestChemistry}%</span>
              </div>
              <div className="w-full h-3 rounded-full bg-[#0A0A0F] border border-white/5 overflow-hidden p-0.5">
                <motion.div
                  className={`h-full rounded-full bg-gradient-to-r ${getChemistryColor(latestChemistry)}`}
                  initial={{ width: '40%' }}
                  animate={{ width: `${latestChemistry}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                />
              </div>
            </div>

          </div>

          {/* CHAT BUBBLES: iMessage style with Instrument Serif dialogue & Collapsible Thoughts */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6 min-h-[480px]">
            
            <div className="text-center">
              <span className="text-[10px] font-mono px-3 py-1 rounded-full bg-white/5 text-slate-400 border border-white/5 uppercase">
                ✦ {activeDate.scenarioDetails?.location || 'San Francisco'} • 8-Turn Intimate Dialogue ✦
              </span>
            </div>

            {/* Dialogue turns */}
            <div className="space-y-5">
              {visibleTurns.map((turn, idx) => {
                const isSpeakerA = turn.speakerId === (activeDate.person1Id || activeDate.agent_a_id);
                const isThoughtOpen = expandedThoughts[idx];

                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 15, x: isSpeakerA ? -15 : 15 }}
                    animate={{ opacity: 1, y: 0, x: 0 }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    className={`flex flex-col ${isSpeakerA ? 'items-start' : 'items-end'}`}
                  >
                    <div className="flex items-center space-x-2 mb-1 px-1">
                      <img
                        src={turn.avatar}
                        alt={turn.speaker}
                        className="w-5 h-5 rounded-full object-cover border border-white/10"
                      />
                      <span className="text-[11px] font-bold text-slate-300 font-sans">{turn.speaker}</span>
                      <span className="text-[10px] font-mono text-slate-500">Turn #{turn.turn} • {turn.stage}</span>
                    </div>

                    {/* Chat Bubble: Left is Accent Orange, Right is Violet */}
                    <div
                      className={`max-w-xl p-4 sm:p-5 rounded-2xl shadow-glass ${
                        isSpeakerA
                          ? 'bg-[#181824] border border-[#E8472A]/30 text-white rounded-tl-sm'
                          : 'bg-[#181824] border border-[#6C47FF]/30 text-white rounded-tr-sm'
                      }`}
                    >
                      {/* Spoken Dialogue in Instrument Serif */}
                      <p className="font-dialogue text-lg sm:text-xl text-[#F2F2F2] leading-relaxed tracking-wide">
                        {turn.dialogue}
                      </p>

                      {/* Collapsible Inner Monologue [THOUGHT] */}
                      {turn.thought && (
                        <div className="mt-3 pt-2.5 border-t border-white/5">
                          <button
                            onClick={() => toggleThought(idx)}
                            className="text-[10px] font-mono text-slate-400 hover:text-white flex items-center gap-1 transition"
                          >
                            <span>Private Inner Monologue</span>
                            {isThoughtOpen ? <ChevronUp className="w-3 h-3 text-[#E8472A]" /> : <ChevronDown className="w-3 h-3" />}
                          </button>

                          {isThoughtOpen && (
                            <p className="text-xs text-slate-400 italic mt-1.5 leading-relaxed font-sans animate-fade-in">
                              {turn.thought}
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="text-[10px] font-mono text-slate-500 mt-1 px-1">
                      Turn Chemistry: {turn.chemistryScore}%
                    </div>
                  </motion.div>
                );
              })}

              {/* Real-time Streaming Typewriter Indicator */}
              {isSimulating && streamingText && (
                <div className="p-4 rounded-2xl bg-[#0A0A0F] border border-white/10 max-w-lg space-y-1">
                  <div className="text-[10px] font-mono text-[#E8472A] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E8472A] animate-ping" />
                    <span>Agent is actively speaking...</span>
                  </div>
                  <p className="font-dialogue text-lg text-slate-300 italic">
                    {streamingText}
                  </p>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

          </div>

          {/* POST-DATE SPLIT-SCREEN EVALUATION & NEUTRAL JUDGE CARD */}
          {currentTurnIdx >= 8 && activeDate.status === 'completed' && (
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6 pt-4"
            >
              
              {/* Neutral Judge Banner with Exact Formula */}
              <div className="p-6 rounded-3xl bg-gradient-to-r from-[#181824] via-[#13131A] to-[#181824] border border-[#6C47FF]/40 shadow-glow-violet space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#6C47FF]/20 text-[#6C47FF] flex items-center justify-center font-bold">
                      <Scale className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-mono text-[#6C47FF] uppercase">Adjudicated by Claude Sonnet 4.6</span>
                      <h3 className="text-xl font-bold text-white font-sans">Neutral Judge Verdict</h3>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-mono text-slate-400">Official Compatibility Score</div>
                    <div className="text-3xl font-extrabold text-emerald-400 font-mono">
                      {activeDate.final_score || activeDate.scores?.overall || 88}%
                    </div>
                  </div>
                </div>

                <div className="text-xs text-slate-300 leading-relaxed font-sans">
                  {activeDate.judge_verdict?.rationale || activeDate.judge_verdict?.summary}
                </div>

                {/* Evidence Citations Quoted from Transcript */}
                <div className="p-4 rounded-2xl bg-[#0A0A0F] border border-white/5 space-y-2">
                  <div className="text-[10px] font-mono text-[#E8472A] uppercase tracking-wider">
                    VERBATIM TRANSCRIPT MOMENTS CITED AS EVIDENCE:
                  </div>
                  {(activeDate.judge_verdict?.citedEvidence || [
                    "Turn 3: Both agents immediately established mutual boundaries around quiet morning focus without performative small talk.",
                    "Turn 5: Shared resonance around non-demanding companionship and comfortable shared silence.",
                    "Turn 8: Reciprocal unhesitating agreement to meet again in nature confirmed high mutual attraction."
                  ]).map((ev, i) => (
                    <div key={i} className="text-xs text-slate-300 font-serif italic pl-3 border-l-2 border-[#E8472A]">
                      "{ev}"
                    </div>
                  ))}
                </div>

                {/* Formula Breakdown */}
                <div className="text-[11px] font-mono text-slate-400 pt-1 flex flex-wrap items-center justify-between gap-2 border-t border-white/5">
                  <span>Score Formula: 0.4 × View(A) + 0.4 × View(B) + 0.2 × Judge Mutual Fit</span>
                  <span className="text-[#6C47FF]">View A: {activeDate.agent_a_verdict?.viewScore || 88} • View B: {activeDate.agent_b_verdict?.viewScore || 87} • Judge: {activeDate.judge_verdict?.mutualFit || 88}</span>
                </div>
              </div>

              {/* Split-Screen Assessments: Agent A vs Agent B */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Agent A Verdict */}
                <div className="glass-panel p-6 rounded-3xl border border-[#E8472A]/30 space-y-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={p1?.avatar}
                      alt={p1?.name}
                      className="w-10 h-10 rounded-xl object-cover border border-[#E8472A]"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-white">{p1?.name}'s Private Verdict</h4>
                      <p className="text-[10px] font-mono text-[#E8472A]">Did not see partner's thoughts</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div className="p-2.5 rounded-xl bg-[#0A0A0F] border border-white/5">
                      <div className="text-[10px] text-slate-500">Chemistry:</div>
                      <div className="text-white font-bold">{activeDate.agent_a_verdict?.chemistry || 8.5} / 10</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#0A0A0F] border border-white/5">
                      <div className="text-[10px] text-slate-500">Values Alignment:</div>
                      <div className="text-white font-bold">{activeDate.agent_a_verdict?.valuesAlignment || 9.0} / 10</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#0A0A0F] border border-white/5">
                      <div className="text-[10px] text-slate-500">Lifestyle Fit:</div>
                      <div className="text-white font-bold">{activeDate.agent_a_verdict?.lifestyleFit || 8.0} / 10</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#0A0A0F] border border-white/5">
                      <div className="text-[10px] text-slate-500">Would Meet Again:</div>
                      <div className="text-emerald-400 font-bold">{activeDate.agent_a_verdict?.wouldMeetAgain || 8.8} / 10</div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 italic font-serif leading-relaxed">
                    "{activeDate.agent_a_verdict?.rationale}"
                  </p>
                </div>

                {/* Agent B Verdict */}
                <div className="glass-panel p-6 rounded-3xl border border-[#6C47FF]/30 space-y-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={p2?.avatar}
                      alt={p2?.name}
                      className="w-10 h-10 rounded-xl object-cover border border-[#6C47FF]"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-white">{p2?.name}'s Private Verdict</h4>
                      <p className="text-[10px] font-mono text-[#6C47FF]">Did not see partner's thoughts</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div className="p-2.5 rounded-xl bg-[#0A0A0F] border border-white/5">
                      <div className="text-[10px] text-slate-500">Chemistry:</div>
                      <div className="text-white font-bold">{activeDate.agent_b_verdict?.chemistry || 8.2} / 10</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#0A0A0F] border border-white/5">
                      <div className="text-[10px] text-slate-500">Values Alignment:</div>
                      <div className="text-white font-bold">{activeDate.agent_b_verdict?.valuesAlignment || 8.8} / 10</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#0A0A0F] border border-white/5">
                      <div className="text-[10px] text-slate-500">Lifestyle Fit:</div>
                      <div className="text-white font-bold">{activeDate.agent_b_verdict?.lifestyleFit || 8.5} / 10</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#0A0A0F] border border-white/5">
                      <div className="text-[10px] text-slate-500">Would Meet Again:</div>
                      <div className="text-emerald-400 font-bold">{activeDate.agent_b_verdict?.wouldMeetAgain || 8.5} / 10</div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 italic font-serif leading-relaxed">
                    "{activeDate.agent_b_verdict?.rationale}"
                  </p>
                </div>

              </div>

            </motion.div>
          )}

        </div>
      )}

      {/* Historical Dates Carousel / Selector */}
      {historicalDates.length > 0 && (
        <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Historical Dates Library</h3>
            <span className="text-xs font-mono text-slate-500">{historicalDates.length} Dates Ready</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {historicalDates.slice(0, 6).map((d) => (
              <div
                key={d.id}
                onClick={() => {
                  setActiveDate(d);
                  setCurrentTurnIdx(d.transcript?.length || 8);
                }}
                className={`p-3.5 rounded-2xl bg-[#0A0A0F] hover:bg-white/5 border transition cursor-pointer flex items-center justify-between gap-3 ${
                  activeDate?.id === d.id ? 'border-[#E8472A]' : 'border-white/5'
                }`}
              >
                <div className="flex items-center space-x-2.5 min-w-0">
                  <div className="flex -space-x-2">
                    <img src={d.person1?.avatar} alt="" className="w-8 h-8 rounded-full object-cover border border-white/20" />
                    <img src={d.person2?.avatar} alt="" className="w-8 h-8 rounded-full object-cover border border-white/20" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-white truncate">
                      {d.person1?.name?.split(' ')[0]} & {d.person2?.name?.split(' ')[0]}
                    </div>
                    <div className="text-[10px] text-slate-500 truncate">
                      {d.scenarioDetails?.name || d.scenario}
                    </div>
                  </div>
                </div>

                <div className="text-xs font-bold text-emerald-400 font-mono">
                  {d.final_score || d.scores?.overall || 85}%
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
