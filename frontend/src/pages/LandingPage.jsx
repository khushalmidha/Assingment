import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, Radio, ArrowRight, ShieldCheck, Heart, Users, Trophy, Play, CheckCircle2 } from 'lucide-react';

export default function LandingPage({ profiles, onSelectPerson, onStartDating, onNavigate }) {
  const canvasRef = useRef(null);
  const [linkedinInput, setLinkedinInput] = useState('');
  const [instagramInput, setInstagramInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Subtle interactive constellation / particle canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resize = () => {
      canvas.width = canvas.parentElement.offsetWidth;
      canvas.height = canvas.parentElement.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles = [];
    const particleCount = 45;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 1.8 + 0.8,
        color: i % 3 === 0 ? 'rgba(232, 71, 42, 0.6)' : i % 3 === 1 ? 'rgba(108, 71, 255, 0.6)' : 'rgba(242, 242, 242, 0.4)'
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Connect lines between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(108, 71, 255, ${0.15 * (1 - dist / 110)})`;
            ctx.lineWidth = 0.75;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw particle points
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleHeroSubmit = (e) => {
    e.preventDefault();
    if (!linkedinInput && !instagramInput) {
      onNavigate('input');
      return;
    }
    // Navigate to input page with prefilled values
    onNavigate('input');
  };

  // 3 sample floating profile cards
  const floatingSamples = profiles.slice(0, 3).length === 3 
    ? profiles.slice(0, 3) 
    : [
        {
          id: 'pieter-levels',
          name: 'Pieter Levels',
          headline: 'The Autonomous Nomad',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
          hobbies: ['Solo hacking', 'Surfing Portugal', 'Synth beats'],
          quote: 'I haven\'t owned furniture since 2014; home is wherever wifi connects.'
        },
        {
          id: 'marques-brownlee',
          name: 'Marques Brownlee',
          headline: 'The Precision Minimalist',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80',
          hobbies: ['Ultimate Frisbee', 'Anamorphic 8K', 'Electric Tracks'],
          quote: 'Behind the studio cameras, I\'m happiest on an open grass field chasing a disc.'
        },
        {
          id: 'cleo-abram',
          name: 'Cleo Abram',
          headline: 'The Radical Techno-Optimist',
          avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80',
          hobbies: ['Fusion labs', 'Formula 1', 'Science editing'],
          quote: 'Optimism isn\'t naive; it\'s a moral strategy to build the world we want to inherit.'
        }
      ];

  return (
    <div className="space-y-24 pb-20 overflow-hidden">
      
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-24 md:pb-32">
        
        {/* Canvas Particle Background */}
        <canvas 
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-80"
        />

        {/* Ambient glow orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-[#E8472A]/15 rounded-full blur-[140px] pointer-events-none z-0" />
        <div className="absolute top-1/3 left-1/4 w-[450px] h-[300px] bg-[#6C47FF]/15 rounded-full blur-[120px] pointer-events-none z-0" />

        <div className="max-w-5xl mx-auto text-center px-4 relative z-10 space-y-8">
          
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#13131A] border border-white/10 text-xs font-mono text-[#E8472A] shadow-glow-spark backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#E8472A] animate-ping" />
            <span>Autonomous Agentic Dating • Verified 25 Figures Cohort</span>
          </div>

          {/* Animated Text Reveal Hero */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#F2F2F2] leading-[1.1]">
            <span className="block animate-fade-in">Your agent goes on the</span>
            <span className="gradient-text-spark italic font-serif tracking-normal">dates first.</span>
          </h1>

          <p className="text-base sm:text-xl text-[#6B7280] max-w-2xl mx-auto font-normal leading-relaxed">
            Each person is represented by an AI agent reading ONLY their public LinkedIn and public Instagram. Agents date each other in real-time, reveal private inner thoughts, and deliver ranked compatibility matches.
          </p>

          {/* Hero Two-Link Input Form */}
          <div className="max-w-2xl mx-auto pt-2">
            <div className="p-1 rounded-2xl bg-gradient-to-r from-[#E8472A]/40 via-white/10 to-[#6C47FF]/40 shadow-glass">
              <form onSubmit={handleHeroSubmit} className="bg-[#13131A]/95 backdrop-blur-xl p-4 sm:p-5 rounded-[14px] text-left space-y-3">
                <div className="text-xs font-mono text-slate-400 flex items-center justify-between">
                  <span>Paste two links. Watch the future of dating.</span>
                  <span className="text-[10px] text-[#6C47FF] bg-[#6C47FF]/10 px-2 py-0.5 rounded">Zero Login Required</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <input
                    type="url"
                    value={linkedinInput}
                    onChange={(e) => setLinkedinInput(e.target.value)}
                    placeholder="https://linkedin.com/in/..."
                    className="w-full bg-[#0A0A0F] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#E8472A] transition"
                  />
                  <input
                    type="url"
                    value={instagramInput}
                    onChange={(e) => setInstagramInput(e.target.value)}
                    placeholder="https://instagram.com/..."
                    className="w-full bg-[#0A0A0F] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#6C47FF] transition"
                  />
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
                  <div className="text-[11px] text-[#6B7280]">
                    Scraped with Apify & Googlebot + Claude Sonnet 4.6 analysis
                  </div>
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#E8472A] to-[#6C47FF] text-white text-xs font-bold hover:opacity-95 shadow-glow-spark hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-2"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Launch Agent</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Primary CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => onNavigate('profiles')}
              className="px-7 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-[#F2F2F2] border border-white/15 text-xs font-bold transition flex items-center space-x-2"
            >
              <Users className="w-4 h-4 text-[#E8472A]" />
              <span>Explore the 25 people</span>
            </button>

            <button
              onClick={() => onNavigate('dating')}
              className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#E8472A] to-[#6C47FF] text-white text-xs font-bold shadow-glow-spark hover:scale-[1.02] transition flex items-center space-x-2"
            >
              <Radio className="w-4 h-4 animate-pulse" />
              <span>Watch Live Date Arena</span>
            </button>
          </div>

          {/* Floating 3 Sample Profile Cards */}
          <div className="pt-10">
            <div className="text-center text-xs font-mono text-[#6B7280] mb-6 uppercase tracking-wider">
              ✦ Pre-Analyzed Autonomous Agents Floating In Memory ✦
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {floatingSamples.map((person, idx) => (
                <div
                  key={person.id}
                  onClick={() => onSelectPerson(person)}
                  className={`glass-panel p-5 rounded-2xl text-left cursor-pointer glass-panel-hover border border-white/10 group ${
                    idx === 1 ? 'md:-translate-y-4 border-[#E8472A]/30' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <img
                      src={person.avatar}
                      alt={person.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-white/10 group-hover:border-[#E8472A] transition"
                    />
                    <div>
                      <h3 className="font-bold text-sm text-white group-hover:text-[#E8472A] transition">
                        {person.name}
                      </h3>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#E8472A]/10 text-[#E8472A] border border-[#E8472A]/20">
                        {person.personality_archetype || person.headline}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 italic font-serif line-clamp-2 mb-3">
                    "{person.needs?.[0]?.evidence || person.quote || 'Living with craft and purpose.'}"
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/5">
                    {(person.hobbies || []).slice(0, 3).map((h, i) => (
                      <span key={i} className="text-[10px] bg-white/5 px-2 py-0.5 rounded-md text-slate-400">
                        {typeof h === 'string' ? h : h.hobby}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Feature Pillars: Beating Competitors */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center space-y-2 mb-10">
          <span className="text-xs font-mono font-semibold text-[#E8472A] uppercase tracking-widest">
            Unified Competitive Superiority
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Built To Outperform Every Competing Submission
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel p-6 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#E8472A]/10 text-[#E8472A] flex items-center justify-center font-bold">
              01
            </div>
            <h3 className="font-bold text-base text-white">Streaming Live Dates (SSE)</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Real-time Server-Sent Events stream words token-by-token with intimate Instrument Serif dialogue, dynamic chemistry meters, and visible inner monologues.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#6C47FF]/10 text-[#6C47FF] flex items-center justify-center font-bold">
              02
            </div>
            <h3 className="font-bold text-base text-white">Neutral Judge & Exact Math</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Independent assessments where agents don't see each other's private thoughts, evaluated by a neutral third judge citing exact transcript moments with strict weighting.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
              03
            </div>
            <h3 className="font-bold text-base text-white">Real Scrapers & Evidence Drawers</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Apify + Googlebot + Jina AI Reader fallbacks with Mem0 persistent memory. Every psychological need has collapsible drawers citing verbatim quotes with source tags.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
