import React, { useState, useEffect } from 'react';
import { 
  Heart, Sparkles, ExternalLink, ArrowLeft, 
  Copy, Check, Radio, Trophy, ShieldAlert, Compass, MessageCircle, Send, Volume2
} from 'lucide-react';
import { LinkedinIcon, InstagramIcon } from '../components/Icons';
import NotificationModal from '../components/NotificationModal';

export default function ProfileDetailPage({ personId, onBack, onStartDating }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copiedIdx, setCopiedIdx] = useState(null);
  const [showNotifyModal, setShowNotifyModal] = useState(false);
  const [activeTab, setActiveTab] = useState('analysis'); // 'analysis' | 'scraped' | 'matches'

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
      <div className="max-w-5xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-roseNeon-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm font-mono text-slate-400">Loading persona and compatibility data...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Profile Not Found</h2>
        <button onClick={onBack} className="text-rose-400 text-xs hover:underline">
          Return to directory
        </button>
      </div>
    );
  }

  const analysis = profile.analysis || {};
  const voice = profile.voicePersona || {};

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Back navigation & Actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Agents</span>
        </button>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowNotifyModal(true)}
            className="px-3.5 py-2 rounded-xl bg-violetNeon-500/20 hover:bg-violetNeon-500/30 border border-violetNeon-500/40 text-violet-300 text-xs font-semibold flex items-center space-x-1.5 transition"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Notify via Telegram/WhatsApp</span>
          </button>

          <button
            onClick={() => onStartDating(profile.id)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-roseNeon-500 to-roseNeon-600 hover:opacity-95 text-white text-xs font-bold shadow-glow-rose flex items-center space-x-1.5 transition"
          >
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>Start Simulated Date</span>
          </button>
        </div>
      </div>

      {/* Header Profile Hero Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-roseNeon-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 relative z-10 text-center sm:text-left">
          
          <div className="relative">
            <img
              src={profile.avatar}
              alt={profile.name}
              className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl object-cover border-2 border-white/20 shadow-2xl"
            />
            <span className="absolute bottom-1 right-1 px-2 py-0.5 rounded-full bg-emerald-500 text-[10px] font-mono font-bold text-black border-2 border-midnight-950">
              AGENT ACTIVE
            </span>
          </div>

          <div className="flex-1 space-y-3">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 gap-1">
                <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white">
                  {profile.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-roseNeon-500/20 text-rose-300 border border-roseNeon-500/30 self-center sm:self-auto">
                  Claude Sonnet 4.6 Persona
                </span>
              </div>
              <p className="text-sm font-semibold text-rose-400 mt-1">{profile.headline}</p>
              <p className="text-xs text-slate-400 mt-0.5">{profile.company} • {profile.education}</p>
            </div>

            {/* Official Social Links (scraped) */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
              <a
                href={profile.linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-sky-300 text-xs font-medium flex items-center space-x-1.5 transition"
              >
                <LinkedinIcon className="w-3.5 h-3.5 text-sky-400" />
                <span>Public LinkedIn</span>
                <ExternalLink className="w-3 h-3 text-sky-400" />
              </a>

              <a
                href={profile.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-xl bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/30 text-pink-300 text-xs font-medium flex items-center space-x-1.5 transition"
              >
                <InstagramIcon className="w-3.5 h-3.5 text-pink-400" />
                <span>Public Instagram</span>
                <ExternalLink className="w-3 h-3 text-pink-400" />
              </a>

              <span className="text-xs text-slate-500 font-mono">
                {profile.datesCount || 0} dates completed
              </span>
            </div>

          </div>

        </div>

        {/* Voice Persona Bar */}
        <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-1 md:grid-cols-3 gap-4 bg-midnight-950/60 p-4 rounded-2xl">
          <div className="space-y-1">
            <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
              <Volume2 className="w-3.5 h-3.5 text-violet-400" />
              <span>Voice & Tone Calibration</span>
            </div>
            <div className="text-xs text-white font-semibold">{voice.tone || 'Thoughtful and warm'}</div>
            <div className="text-[11px] text-slate-400">Pacing: {voice.pacing || 'Deliberate'}</div>
          </div>

          <div className="space-y-1 md:col-span-2">
            <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center space-x-2">
              <span>Conversational Cadence:</span>
              <div className="flex items-center space-x-0.5">
                <span className="wave-bar w-1 bg-rose-400 rounded-full inline-block" />
                <span className="wave-bar w-1 bg-rose-400 rounded-full inline-block" />
                <span className="wave-bar w-1 bg-violet-400 rounded-full inline-block" />
                <span className="wave-bar w-1 bg-cyan-400 rounded-full inline-block" />
                <span className="wave-bar w-1 bg-emerald-400 rounded-full inline-block" />
              </div>
            </div>
            <p className="text-xs text-slate-300 italic">
              "{voice.styleSummary || 'Speaks with authenticity, drawing on life experience and thoughtful reflection.'}"
            </p>
          </div>
        </div>

      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10 space-x-6 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('analysis')}
          className={`pb-3 border-b-2 transition ${
            activeTab === 'analysis'
              ? 'border-roseNeon-500 text-rose-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          Agent Analysis (Needs, Hobbies, Traits)
        </button>

        <button
          onClick={() => setActiveTab('openers')}
          className={`pb-3 border-b-2 transition ${
            activeTab === 'openers'
              ? 'border-roseNeon-500 text-rose-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          3 AI Conversation Starters
        </button>

        <button
          onClick={() => setActiveTab('matches')}
          className={`pb-3 border-b-2 transition ${
            activeTab === 'matches'
              ? 'border-roseNeon-500 text-rose-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          Compatibility Rankings ({profile.topMatches?.length || 0})
        </button>

        <button
          onClick={() => setActiveTab('scraped')}
          className={`pb-3 border-b-2 transition ${
            activeTab === 'scraped'
              ? 'border-roseNeon-500 text-rose-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          Raw Scraped Data
        </button>
      </div>

      {/* TAB CONTENT: Analysis */}
      {activeTab === 'analysis' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Core Needs */}
          <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-3">
            <div className="flex items-center space-x-2 text-rose-400 text-xs font-mono font-bold uppercase tracking-wider">
              <Heart className="w-4 h-4 fill-rose-400" />
              <span>(1) Core Needs in a Partner</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed bg-white/5 p-4 rounded-xl border border-white/5">
              {analysis.coreNeeds || 'Values an intellectual peer with emotional stability and shared commitment to purposeful life.'}
            </p>
          </div>

          {/* Hobbies & Passions */}
          <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-3">
            <div className="flex items-center space-x-2 text-violet-400 text-xs font-mono font-bold uppercase tracking-wider">
              <Compass className="w-4 h-4" />
              <span>(2) Hobbies & Passions</span>
            </div>
            <div className="space-y-2">
              {(analysis.hobbies || []).map((h, i) => (
                <div key={i} className="flex items-start space-x-2 text-xs text-slate-300 bg-white/5 p-2.5 rounded-lg border border-white/5">
                  <span className="text-violet-400 font-bold">•</span>
                  <span>{h}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Personality Traits */}
          <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-3">
            <div className="flex items-center space-x-2 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>(3) Personality Traits</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {(analysis.personalityTraits || []).map((trait, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold"
                >
                  {trait}
                </span>
              ))}
            </div>
          </div>

          {/* Lifestyle Signals */}
          <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-3">
            <div className="flex items-center space-x-2 text-amber-400 text-xs font-mono font-bold uppercase tracking-wider">
              <Compass className="w-4 h-4" />
              <span>(4) Lifestyle Signals</span>
            </div>
            <div className="space-y-2">
              {(analysis.lifestyleSignals || []).map((signal, i) => (
                <div key={i} className="flex items-start space-x-2 text-xs text-slate-300 bg-white/5 p-2.5 rounded-lg border border-white/5">
                  <span className="text-amber-400 font-bold">✓</span>
                  <span>{signal}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Dealbreakers */}
          <div className="md:col-span-2 glass-panel p-6 rounded-2xl border border-rose-500/20 bg-rose-950/10 space-y-3">
            <div className="flex items-center space-x-2 text-rose-400 text-xs font-mono font-bold uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4" />
              <span>(5) Inferred Dealbreakers</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(analysis.dealbreakers || []).map((db, i) => (
                <div key={i} className="p-3 rounded-xl bg-midnight-950 border border-rose-500/20 text-xs text-rose-200/90 leading-relaxed">
                  <span className="text-rose-500 font-bold mr-1">✕</span>
                  {db}
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* TAB CONTENT: Conversation Starters */}
      {activeTab === 'openers' && (
        <div className="space-y-4">
          <div className="text-xs text-slate-400">
            Claude Sonnet 4.6 synthesized 3 unique conversation starters tailored specifically to {profile.name}'s public passions and writing tone:
          </div>

          <div className="space-y-3">
            {(analysis.conversationStarters || []).map((starter, idx) => (
              <div
                key={idx}
                className="glass-panel p-5 rounded-2xl border border-white/10 flex items-start justify-between space-x-4 group hover:border-roseNeon-500/40 transition"
              >
                <div className="flex items-start space-x-3">
                  <span className="w-6 h-6 rounded-full bg-roseNeon-500/20 text-roseNeon-500 flex items-center justify-center font-mono text-xs font-bold flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                    "{starter}"
                  </p>
                </div>

                <button
                  onClick={() => handleCopyOpener(starter, idx)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition flex-shrink-0 flex items-center space-x-1"
                >
                  {copiedIdx === idx ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span className="text-[10px] text-emerald-400 font-mono">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span className="text-[10px] font-mono">Copy</span>
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>

          <div className="pt-4 text-center">
            <button
              onClick={() => onStartDating(profile.id)}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-roseNeon-500 to-violetNeon-500 text-white font-bold text-xs shadow-glow-rose hover:opacity-95 transition inline-flex items-center space-x-2"
            >
              <Radio className="w-4 h-4 animate-pulse" />
              <span>Launch Live Date Using These Starters</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB CONTENT: Compatibility Matches */}
      {activeTab === 'matches' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Ranked matches computed from round-robin dates and psychological scoring:</span>
            <span className="font-mono text-emerald-400">Aggregated Compatibility</span>
          </div>

          <div className="space-y-3">
            {(profile.topMatches || []).map((match, idx) => (
              <div
                key={idx}
                className="glass-panel p-5 rounded-2xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-center space-x-4">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center font-display font-bold text-sm ${
                    idx === 0 ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40' :
                    idx === 1 ? 'bg-slate-300/20 text-slate-200 border border-slate-300/40' :
                    idx === 2 ? 'bg-amber-700/20 text-amber-500 border border-amber-700/40' :
                    'bg-white/5 text-slate-400 border border-white/10'
                  }`}>
                    #{idx + 1}
                  </span>

                  <img
                    src={match.person.avatar}
                    alt={match.person.name}
                    className="w-12 h-12 rounded-xl object-cover border border-white/10"
                  />

                  <div>
                    <h4 className="text-sm font-bold text-white">{match.person.name}</h4>
                    <p className="text-xs text-slate-400">{match.person.company || match.person.headline}</p>
                    <p className="text-[11px] text-slate-300 mt-1 italic max-w-xl">
                      💡 {match.reasons}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 justify-between md:justify-end">
                  <div className="text-right">
                    <div className="text-lg font-display font-extrabold text-rose-400">
                      {match.scores.overall}%
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">Match Score</div>
                  </div>

                  <button
                    onClick={() => onStartDating(match.person.id)}
                    className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 hover:text-white transition flex items-center space-x-1"
                  >
                    <Radio className="w-3 h-3 text-rose-400" />
                    <span>Date</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: Raw Scraped Data */}
      {activeTab === 'scraped' && (
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
            <h3 className="text-xs font-mono font-bold text-sky-400 uppercase tracking-wider flex items-center space-x-2">
              <LinkedinIcon className="w-4 h-4" />
              <span>Scraped LinkedIn Data</span>
            </h3>
            <div className="space-y-2 text-xs text-slate-300 font-mono bg-midnight-950 p-4 rounded-xl border border-white/5">
              <div><strong className="text-white">Role:</strong> {profile.currentRole || profile.headline}</div>
              <div><strong className="text-white">Company:</strong> {profile.company}</div>
              <div><strong className="text-white">Education:</strong> {profile.education}</div>
              <div><strong className="text-white">Skills:</strong> {(profile.skills || []).join(', ')}</div>
              <div><strong className="text-white">Bio:</strong> {profile.bio}</div>
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-300 mb-2">Recent LinkedIn Activity/Posts:</div>
              <div className="space-y-1.5">
                {(profile.recentPosts || []).map((post, i) => (
                  <div key={i} className="text-xs text-slate-400 p-2.5 rounded-lg bg-white/5 border border-white/5">
                    "{post}"
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
            <h3 className="text-xs font-mono font-bold text-pink-400 uppercase tracking-wider flex items-center space-x-2">
              <InstagramIcon className="w-4 h-4" />
              <span>Scraped Instagram Data</span>
            </h3>
            <div className="space-y-2 text-xs text-slate-300 font-mono bg-midnight-950 p-4 rounded-xl border border-white/5">
              <div><strong className="text-white">Instagram Bio:</strong> {profile.instagramBio}</div>
              <div><strong className="text-white">Hashtags:</strong> {(profile.hashtags || []).join(' ')}</div>
              <div><strong className="text-white">Key Topics:</strong> {(profile.topics || []).join(', ')}</div>
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-300 mb-2">Recent Captions:</div>
              <div className="space-y-1.5">
                {(profile.instagramCaptions || []).map((caption, i) => (
                  <div key={i} className="text-xs text-slate-400 p-2.5 rounded-lg bg-white/5 border border-white/5">
                    "{caption}"
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notification Modal */}
      <NotificationModal
        person={profile}
        isOpen={showNotifyModal}
        onClose={() => setShowNotifyModal(false)}
      />

    </div>
  );
}
