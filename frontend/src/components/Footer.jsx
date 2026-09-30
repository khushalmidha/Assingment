import React from 'react';
import { Heart, ExternalLink, ShieldCheck, Terminal, Layers } from 'lucide-react';
import { GithubIcon } from './Icons';

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-white/10 bg-midnight-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand info */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-roseNeon-500/20 border border-roseNeon-500/40 flex items-center justify-center">
                <Heart className="w-4 h-4 text-roseNeon-500 fill-roseNeon-500" />
              </div>
              <span className="font-display font-bold text-lg text-white">Agentic Dating</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Autonomous AI dating platform where agents represent real people, extract psychological profiles from public LinkedIn & Instagram, and simulate multi-turn dates using MCP tool harnesses.
            </p>
            <div className="flex items-center space-x-2 text-[11px] text-slate-500 font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Public Profile Scrapes Only • Zero Login Required</span>
            </div>
          </div>

          {/* Architecture Details */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 font-mono mb-4 flex items-center space-x-1.5">
              <Terminal className="w-3.5 h-3.5 text-violet-400" />
              <span>Agentic Core</span>
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>• Claude Sonnet 4.6 (Anthropic API)</li>
              <li>• Model Context Protocol (MCP)</li>
              <li>• Mem0 Persistent Conversation Store</li>
              <li>• Playwright Stealth Browser Automation</li>
              <li>• Natural Voice Persona Synthesis</li>
            </ul>
          </div>

          {/* MCP Tools */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 font-mono mb-4 flex items-center space-x-1.5">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>MCP Tool Harness</span>
            </h4>
            <ul className="space-y-2 text-xs text-slate-400 font-mono text-[11px]">
              <li><span className="text-rose-400">get_partner_profile</span>(id)</li>
              <li><span className="text-cyan-400">store_memory</span>(key, val)</li>
              <li><span className="text-violet-400">recall_memory</span>(key)</li>
              <li><span className="text-emerald-400">score_date</span>(metrics)</li>
            </ul>
          </div>

          {/* Tech Stack */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 font-mono mb-4">
              Deployment & Stack
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {['React', 'Tailwind CSS', 'Node.js', 'Express', 'Playwright', 'Claude Sonnet 4.6', 'Mem0', 'Postgres', 'Vercel', 'Railway'].map((tag) => (
                <span key={tag} className="px-2.5 py-1 text-[11px] font-mono bg-white/5 border border-white/10 rounded-md text-slate-300">
                  {tag}
                </span>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
              <span>Public Assignment Demo</span>
              <span className="font-mono text-emerald-400">v1.0.0 Ready</span>
            </div>
          </div>

        </div>

        <div className="mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© 2026 Agentic Dating System • Powered by Claude Sonnet 4.6 & Model Context Protocol</p>
          <p className="mt-2 sm:mt-0 font-mono text-[11px]">Autonomous Multi-Agent Simulation Engine</p>
        </div>
      </div>
    </footer>
  );
}
