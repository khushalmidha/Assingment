import React, { useState, useEffect } from 'react';
import { 
  Heart, Sparkles, ExternalLink, ArrowLeft, 
  Copy, Check, Radio, Trophy, ShieldAlert, ChevronDown, ChevronUp, MessageCircle, Play
} from 'lucide-react';
import { LinkedinIcon, InstagramIcon } from '../components/Icons';

export default function ProfileDetailPage({ personId, onBack, onStartDating, onNavigateToRankings, onWatchDate }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [centerTab, setCenterTab] = useState('needs'); // 'needs' | 'hobbies' | 'interests' | 'voice'
  const [openDrawerIdx, setOpenDrawerIdx] = useState(0); // Index of opened collapsible evidence drawer
  const [copiedIdx, setCopiedIdx] = useState(null);

  useEffect(() => {
    async function fetchDetail() {
      setLoading(true);
      try {
        const res = await fetch(`/api/profiles/${personId}`);
        const json = await res.json();
        if (json.success) {
          setProfile(json.data);
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    }
    if (personId) {
      fetchDetail();
    }
  }, [personId]);

  const handleCopyOpener = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-28 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-[#E8472A] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm font-mono text-slate-400">Loading psychological profile & evidence drawers...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Profile Not Found</h2>
        <button onClick={onBack} className="text-[#E8472A] text-xs hover:underline">
          Return to roster
        </button>
      </div>
    );
  }

  const needs = profile.needs || [];
  const hobbies = profile.hobbies || [];
  const interests = profile.interests || [];
  const voiceProfile = profile.voice_profile || profile.voicePersona?.styleSummary || "Speaks with quiet confidence and authentic conviction.";
  const conversationStarters = profile.conversation_starters || profile.analysis?.conversationStarters || [];
  const topMatches = profile.topMatches || [];
  const recentDates = profile.recentDates || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Top Bar: Back & Date action */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to People Grid</span>
        </button>

        <button
          onClick={() => onStartDating(profile.id)}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#E8472A] to-[#6C47FF] hover:opacity-95 text-white text-xs font-bold shadow-glow-spark flex items-center space-x-2 transition"
        >
          <Radio className="w-3.5 h-3.5 animate-pulse" />
          <span>Launch Date Arena</span>
        </button>
      </div>

      {/* 3-Column Layout: Left (Profile), Center (Tabs & Evidence Drawers), Right (Top 5 Matches) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT PANEL: Photo, Name, Archetype, Source Links */}
        <div className="lg:col-span-3 space-y-5">
          <div className="glass-panel p-6 rounded-3xl border border-white/10 text-center space-y-4">
            <div className="relative mx-auto w-32 h-32">
              <img
                src={profile.avatar}
                alt={profile.name}
                className="w-full h-full rounded-2xl object-cover border-2 border-white/10 shadow-xl"
              />
              <span className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full bg-emerald-500 text-[10px] font-mono font-bold text-white border-2 border-[#0A0A0F]">
                Active Agent
              </span>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white font-sans">{profile.name}</h2>
              <p className="text-xs text-[#E8472A] font-mono mt-1 font-semibold">
                {profile.personality_archetype || profile.headline}
              </p>
              <p className="text-xs text-slate-400 mt-1">{profile.role || profile.company}</p>
            </div>

            {/* Official Source Links */}
            <div className="pt-3 border-t border-white/5 space-y-2">
              <span className="text-[10px] font-mono text-slate-500 block uppercase">Only Verified Sources:</span>
              <div className="flex flex-col gap-2">
                <a
                  href={profile.linkedinUrl || profile.linkedin_url}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2 px-3 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/20 text-sky-400 text-xs font-medium flex items-center justify-between transition"
                >
                  <span className="flex items-center gap-2">
                    <LinkedinIcon className="w-4 h-4" />
                    <span>Public LinkedIn</span>
                  </span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>

                <a
                  href={profile.instagramUrl || profile.instagram_url}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2 px-3 rounded-xl bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/20 text-pink-400 text-xs font-medium flex items-center justify-between transition"
                >
                  <span className="flex items-center gap-2">
                    <InstagramIcon className="w-4 h-4" />
                    <span>Public Instagram</span>
                  </span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </div>
            </div>

            {/* Quick Agent Status */}
            <div className="p-3 rounded-xl bg-[#0A0A0F]/80 border border-white/5 text-[11px] text-left text-slate-400 space-y-1">
              <div className="flex items-center justify-between">
                <span>Memory Engine:</span>
                <span className="text-emerald-400 font-mono font-semibold">Mem0 Synced</span>
              </div>
              <div className="flex items-center justify-between">
                <span>LLM Model:</span>
                <span className="text-[#6C47FF] font-mono font-semibold">Sonnet 4.6</span>
              </div>
            </div>
          </div>
        </div>

        {/* CENTER PANEL: Tabbed Sections (Needs / Hobbies / Interests / Voice Card) with Evidence Drawers */}
        <div className="lg:col-span-6 space-y-5">
          <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-5">
            
            {/* Center Tabs */}
            <div className="flex items-center space-x-1.5 p-1 rounded-2xl bg-[#0A0A0F] border border-white/5">
              {[
                { id: 'needs', label: `Core Needs (${needs.length})` },
                { id: 'hobbies', label: `Hobbies (${hobbies.length})` },
                { id: 'interests', label: `Interests (${interests.length})` },
                { id: 'voice', label: 'Voice Card' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setCenterTab(tab.id)}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold transition ${
                    centerTab === tab.id
                      ? 'bg-gradient-to-r from-[#E8472A] to-[#6C47FF] text-white shadow-glow-spark'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* TAB 1: NEEDS WITH COLLAPSIBLE EVIDENCE DRAWERS */}
            {centerTab === 'needs' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400 pb-1">
                  <span>Psychological needs with verbatim cited quotes:</span>
                  <span className="text-[10px] font-mono text-[#E8472A]">Click to inspect citation</span>
                </div>

                {needs.map((item, idx) => {
                  const isOpen = openDrawerIdx === idx;
                  const type = item.type || 'emotional';
                  const typeColor = 
                    type === 'emotional' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                    type === 'relational' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                    'bg-amber-500/10 text-amber-400 border-amber-500/20';

                  return (
                    <div 
                      key={idx}
                      className="rounded-2xl bg-[#0A0A0F] border border-white/10 overflow-hidden transition"
                    >
                      <button
                        onClick={() => setOpenDrawerIdx(isOpen ? null : idx)}
                        className="w-full p-4 text-left flex items-start justify-between gap-3 hover:bg-white/5 transition"
                      >
                        <div className="space-y-1.5 flex-1">
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full border ${typeColor}`}>
                              {type}
                            </span>
                            <span className="text-[10px] font-mono text-slate-500">
                              Confidence: {item.confidence || 'high'}
                            </span>
                          </div>
                          <p className="text-sm font-semibold text-white">
                            {item.need}
                          </p>
                        </div>
                        <div className="mt-1 text-slate-400">
                          {isOpen ? <ChevronUp className="w-4 h-4 text-[#E8472A]" /> : <ChevronDown className="w-4 h-4" />}
                        </div>
                      </button>

                      {/* Collapsible Evidence Drawer */}
                      {isOpen && (
                        <div className="px-4 pb-4 pt-2 border-t border-white/5 bg-[#13131A]/70 space-y-2 animate-fade-in">
                          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                            <span>VERBATIM SOURCE EVIDENCE:</span>
                            <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-semibold ${
                              item.source === 'linkedin' ? 'bg-sky-500/20 text-sky-400' : 'bg-pink-500/20 text-pink-400'
                            }`}>
                              Source: {item.source}
                            </span>
                          </div>
                          <blockquote className="p-3 rounded-xl bg-[#0A0A0F] border border-white/5 text-xs text-slate-200 italic font-serif leading-relaxed">
                            "{item.evidence}"
                          </blockquote>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* TAB 2: HOBBIES WITH EVIDENCE */}
            {centerTab === 'hobbies' && (
              <div className="space-y-3">
                {hobbies.map((h, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-[#0A0A0F] border border-white/10 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-white">{typeof h === 'string' ? h : h.hobby}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-400">
                        {h.source || 'instagram'}
                      </span>
                    </div>
                    {h.evidence && (
                      <p className="text-xs text-slate-400 italic font-serif">
                        "{h.evidence}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* TAB 3: INTERESTS WITH EVIDENCE */}
            {centerTab === 'interests' && (
              <div className="space-y-3">
                {interests.map((i, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-[#0A0A0F] border border-white/10 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-white">{typeof i === 'string' ? i : i.interest}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-400">
                        {i.source || 'linkedin'}
                      </span>
                    </div>
                    {i.evidence && (
                      <p className="text-xs text-slate-400 italic font-serif">
                        "{i.evidence}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* TAB 4: VOICE CARD & CONVERSATION OPENERS */}
            {centerTab === 'voice' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-[#0A0A0F] border border-[#6C47FF]/20 space-y-2">
                  <div className="text-xs font-mono text-[#6C47FF] flex items-center justify-between">
                    <span>HOW THIS PERSON SPEAKS & ENGAGES:</span>
                    <span>Mem0 Voice Profile</span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed font-sans">
                    {voiceProfile}
                  </p>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-mono text-slate-400 uppercase block">
                    3 Tailored Conversation Starters:
                  </span>
                  {conversationStarters.map((starter, idx) => (
                    <div 
                      key={idx}
                      className="p-3.5 rounded-xl bg-[#0A0A0F] border border-white/10 flex items-center justify-between gap-3 text-xs text-slate-300"
                    >
                      <span className="italic font-serif leading-relaxed">"{starter}"</span>
                      <button
                        onClick={() => handleCopyOpener(starter, idx)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition flex-shrink-0"
                        title="Copy to clipboard"
                      >
                        {copiedIdx === idx ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>

        {/* RIGHT PANEL: Top 5 Matches (Mini Cards with Scores) + Full Rankings Link */}
        <div className="lg:col-span-3 space-y-5">
          <div className="glass-panel p-5 rounded-3xl border border-white/10 space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center space-x-2">
                <Trophy className="w-4 h-4 text-[#E8472A]" />
                <h3 className="font-bold text-sm text-white">Top 5 Matches</h3>
              </div>
              <button
                onClick={() => onNavigateToRankings && onNavigateToRankings(profile.id)}
                className="text-[11px] text-[#6C47FF] hover:underline font-mono"
              >
                All 24 →
              </button>
            </div>

            <div className="space-y-2.5">
              {topMatches.slice(0, 5).map((match, idx) => {
                const matchPerson = match.person;
                const score = match.score || match.scores?.overall || 85;

                return (
                  <div
                    key={matchPerson.id || idx}
                    onClick={() => onStartDating(profile.id, matchPerson.id)}
                    className="p-3 rounded-2xl bg-[#0A0A0F] hover:bg-white/5 border border-white/5 hover:border-[#E8472A]/40 transition cursor-pointer flex items-center justify-between gap-3 group"
                  >
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <span className="text-[11px] font-mono text-slate-500 w-4">#{idx + 1}</span>
                      <img
                        src={matchPerson.avatar}
                        alt={matchPerson.name}
                        className="w-9 h-9 rounded-xl object-cover border border-white/10"
                      />
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-white group-hover:text-[#E8472A] truncate transition">
                          {matchPerson.name}
                        </div>
                        <div className="text-[10px] text-slate-500 truncate">
                          {matchPerson.role || matchPerson.headline}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1">
                      <span className="text-xs font-bold text-emerald-400 font-mono">{score}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>

      {/* BOTTOM SECTION: "Watch a date" (Completed Dates for this Person) */}
      <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Radio className="w-4 h-4 text-[#E8472A]" />
            <h3 className="font-bold text-base text-white">Completed Dates in Memory</h3>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {recentDates.length} Transcripts Recorded
          </span>
        </div>

        {recentDates.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-[#0A0A0F] text-xs text-slate-500 font-mono">
            No simulated dates on record yet. Click "Launch Date Arena" to generate an authentic 8-turn date.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentDates.map((date) => {
              const other = date.person1Id === profile.id ? date.person2 : date.person1;
              const finalScore = date.final_score || date.scores?.overall || 86;

              return (
                <div
                  key={date.id}
                  onClick={() => onWatchDate && onWatchDate(date.id)}
                  className="p-4 rounded-2xl bg-[#0A0A0F] hover:bg-white/5 border border-white/5 hover:border-[#6C47FF]/40 transition cursor-pointer flex items-center justify-between gap-4 group"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <img
                      src={other?.avatar}
                      alt={other?.name}
                      className="w-12 h-12 rounded-xl object-cover border border-white/10"
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-mono text-[#6C47FF] uppercase">
                        {date.scenarioDetails?.name || date.scenario || 'Coffee Chat'}
                      </div>
                      <div className="text-sm font-bold text-white group-hover:text-[#E8472A] transition">
                        With {other?.name}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate">
                        {date.transcript?.length || 8} turns completed • Neutral Judge evaluated
                      </div>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0 space-y-1">
                    <span className="text-sm font-extrabold text-emerald-400 font-mono">{finalScore}%</span>
                    <div className="text-[10px] text-slate-500 flex items-center gap-1 group-hover:text-white transition">
                      <Play className="w-3 h-3 fill-current" /> Watch
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
