import React, { useState } from 'react';
import { MessageSquare, Send, CheckCircle2, X, Smartphone, Sparkles } from 'lucide-react';

export default function NotificationModal({ person, isOpen, onClose }) {
  const [channel, setChannel] = useState('telegram');
  const [sending, setSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);
  const [previewData, setPreviewData] = useState(null);

  if (!isOpen || !person) return null;

  const handleFetchPreview = async (selectedChannel) => {
    setChannel(selectedChannel);
    try {
      const res = await fetch('/api/notify/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ personId: person.id, channel: selectedChannel })
      });
      const json = await res.json();
      if (json.success) {
        setPreviewData(json);
      }
    } catch (err) {
      console.error('Failed to get notification preview:', err);
    }
  };

  const handleSend = () => {
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSentSuccess(true);
      setTimeout(() => {
        setSentSuccess(false);
        onClose();
      }, 2500);
    }, 1200);
  };

  // Initial load
  if (!previewData && isOpen) {
    handleFetchPreview('telegram');
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="glass-panel w-full max-w-lg rounded-2xl border border-white/15 overflow-hidden shadow-2xl bg-midnight-950">
        
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-violetNeon-500/20 border border-violetNeon-500/40 flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-violetNeon-500" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <span>Natural Voice Match Summary</span>
                <Sparkles className="w-4 h-4 text-amber-400" />
              </h3>
              <p className="text-xs text-slate-400">Automated dispatch to {person.name}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Channel Selector */}
        <div className="p-6 space-y-5">
          <div className="flex space-x-2">
            <button
              onClick={() => handleFetchPreview('telegram')}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 border transition ${
                channel === 'telegram'
                  ? 'bg-sky-500/20 border-sky-500 text-sky-400'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>Telegram Bot Agent</span>
            </button>
            <button
              onClick={() => handleFetchPreview('whatsapp')}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 border transition ${
                channel === 'whatsapp'
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp Agent</span>
            </button>
          </div>

          {/* Message Preview Box */}
          <div className="rounded-xl border border-white/10 bg-midnight-900 p-4 space-y-3 font-sans text-xs">
            <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-white/5 pb-2">
              <span className="font-mono">Sender: Agentic Concierge AI</span>
              <span className="text-emerald-400">Natural Human Tone</span>
            </div>
            <div className="text-slate-200 whitespace-pre-line leading-relaxed max-h-60 overflow-y-auto pr-1">
              {previewData?.message || 'Generating personalized match synthesis in conversational voice...'}
            </div>
          </div>

          {/* Action button */}
          <div>
            {sentSuccess ? (
              <div className="w-full py-3 rounded-xl bg-emerald-500/20 border border-emerald-500 text-emerald-400 text-xs font-bold flex items-center justify-center space-x-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Summary Dispatched via {channel.toUpperCase()}!</span>
              </div>
            ) : (
              <button
                onClick={handleSend}
                disabled={sending}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-roseNeon-500 to-violetNeon-500 text-white text-xs font-bold shadow-glow-rose hover:opacity-95 transition flex items-center justify-center space-x-2"
              >
                {sending ? (
                  <span>Transmitting message...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Notification to {person.name.split(' ')[0]}</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
