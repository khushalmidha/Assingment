import React from 'react';
import { Heart, ShieldCheck, Terminal, Layers } from 'lucide-react';
import { GithubIcon } from './Icons';

export default function Footer({ onNavigate }) {
  return (
    <footer className="mt-24 border-t border-white/10 bg-[#0A0A0F]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand info */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-[#E8472A]/20 border border-[#E8472A]/40 flex items-center justify-center">
                <Heart className="w-4 h-4 text-[#E8472A] fill-[#E8472A]" />
              </div>
              <span className="font-bold text-lg text-white">Agentic Dating</span>
            </div>
            <p className="text-xs text-[#6B7280] leading-relaxed">
              Autonomous AI dating platform where agents represent 25 real figures, extract psychological profiles from public LinkedIn & Instagram, and simulate multi-turn dates with persistent memory and neutral judge adjudication.
            </p>
            <div className="flex items-center space-x-2 text-[11px] text-slate-500 font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Public Scrapes Only • Zero Login Required</span>
            </div>
          </div>

          {/* Architecture Details */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 font-mono mb-4 flex items-center space-x-1.5">
              <Terminal className="w-3.5 h-3.5 text-[#6C47FF]" />
              <span>Agentic Core</span>
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>• Claude Sonnet 4.6 (Anthropic API)</li>
              <li>• Model Context Protocol (MCP) Stdio Server</li>
              <li>• Mem0 Persistent Multi-Turn Memory</li>
              <li>• Server-Sent Events (SSE) Live Streaming</li>
              <li>• Neutral Judge Adjudication & Math Formula</li>
            </ul>
          </div>

          {/* MCP Tools */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 font-mono mb-4 flex items-center space-x-1.5">
              <Layers className="w-3.5 h-3.5 text-[#E8472A]" />
              <span>MCP Tool Catalog</span>
            </h4>
            <ul className="space-y-2 text-xs text-slate-400 font-mono text-[11px]">
              <li><span className="text-[#E8472A]">get_profile</span>(personId)</li>
              <li><span className="text-[#6C47FF]">recall_memory</span>(agentId, key)</li>
              <li><span className="text-emerald-400">write_memory</span>(agentId, val)</li>
              <li><span className="text-sky-400">list_rankings</span>(personId)</li>
              <li><span className="text-amber-400">get_date_transcript</span>(dateId)</li>
            </ul>
          </div>

          {/* Tech Stack */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 font-mono mb-4">
              Deployment & Stack
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {['Next.js', 'React', 'Tailwind CSS', 'Framer Motion', 'Claude Sonnet 4.6', 'Mem0', 'Supabase Postgres', 'Drizzle ORM', 'Vercel'].map((tag) => (
                <span key={tag} className="px-2.5 py-1 text-[11px] font-mono bg-white/5 border border-white/10 rounded-md text-slate-300">
                  {tag}
                </span>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
              <span>Public Assignment Demo</span>
              <span className="font-mono text-emerald-400">v1.0.0 Verified</span>
            </div>
          </div>

        </div>

        <div className="mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>© 2026 Agentic Dating System • Powered by Claude Sonnet 4.6 & Model Context Protocol</p>
          <div className="flex items-center space-x-4">
            <a
              href="https://github.com/khushalmidha/Assingment"
              target="_blank"
              rel="noreferrer"
              className="flex items-center space-x-1.5 text-slate-400 hover:text-white transition font-mono text-[11px]"
            >
              <GithubIcon className="w-4 h-4" />
              <span>GitHub Repository</span>
            </a>
            <span className="font-mono text-[11px] text-emerald-400">Production Ready</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
