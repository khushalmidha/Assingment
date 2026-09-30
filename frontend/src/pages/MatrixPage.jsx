import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, Download, X, Play, Radio, Sparkles, Scale, ExternalLink } from 'lucide-react';

export default function MatrixPage({ profiles, onStartDating, onWatchDate }) {
  const [matrixData, setMatrixData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCell, setSelectedCell] = useState(null);
  const [drawerDate, setDrawerDate] = useState(null);
  const [drawerLoading, setDrawerLoading] = useState(false);

  useEffect(() => {
    async function loadMatrix() {
      setLoading(true);
      try {
        const res = await fetch('/api/rankings/matrix');
        const json = await res.json();
        if (json.success && json.data) {
          setMatrixData(json.data);
        }
      } catch (err) {
        console.error('Failed to load matrix:', err);
      } finally {
        setLoading(false);
      }
    }
    loadMatrix();
  }, []);

  // When a cell is clicked, open drawer with full transcript
  const handleCellClick = async (cell) => {
    if (cell.isSelf) return;
    setSelectedCell(cell);

    if (cell.dateId) {
      setDrawerLoading(true);
      try {
        const res = await fetch(`/api/dates/${cell.dateId}`);
        const json = await res.json();
        if (json.success) {
          setDrawerDate(json.data);
        }
      } catch (err) {
        console.error('Failed to load date details:', err);
      } finally {
        setDrawerLoading(false);
      }
    } else {
      setDrawerDate(null);
    }
  };

  // Export Rankings CSV
  const handleExportCSV = () => {
    if (!matrixData) return;
    const { people, matrix } = matrixData;
    let csvContent = 'data:text/csv;charset=utf-8,Person,' + people.map(p => `"${p.name}"`).join(',') + '\n';

    matrix.forEach((row, i) => {
      const rowName = `"${people[i].name}"`;
      const scores = row.map(cell => cell.isSelf ? '100' : cell.score).join(',');
      csvContent += `${rowName},${scores}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `agentic_dating_25x25_matrix_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Heatmap Color scale: cold (blue) -> violet -> warm spark (red-orange)
  const getCellBg = (score, isSelf) => {
    if (isSelf) return 'bg-white/5 text-slate-600';
    if (score >= 90) return 'bg-[#E8472A] text-white font-bold';
    if (score >= 85) return 'bg-[#FF6B4A]/90 text-white font-bold';
    if (score >= 80) return 'bg-[#6C47FF] text-white';
    if (score >= 75) return 'bg-[#8B5CF6]/70 text-white';
    return 'bg-sky-900/60 text-sky-200';
  };

  const people = matrixData?.people || [];
  const matrix = matrixData?.matrix || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fade-in">
      
      {/* Title & Export CSV Button */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#6C47FF]/10 border border-[#6C47FF]/20 text-xs font-mono text-[#6C47FF]">
            <Layers className="w-3.5 h-3.5" />
            <span>25×25 Full Cohort Compatibility Heatmap</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1">
            Global Compatibility Matrix
          </h1>
          <p className="text-xs text-[#6B7280] mt-1">
            NxN matrix mapping all 600+ cross-agent compatibility pairs. Click any cell to inspect date transcript.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#E8472A] to-[#6C47FF] hover:opacity-95 text-white text-xs font-bold shadow-glow-spark flex items-center space-x-2 transition self-start md:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Download Rankings CSV</span>
        </button>
      </div>

      {/* Heatmap Legend */}
      <div className="flex items-center space-x-3 text-xs font-mono text-slate-400">
        <span>Score Legend:</span>
        <div className="flex items-center space-x-1.5">
          <span className="w-3 h-3 rounded bg-sky-900/60 inline-block" />
          <span className="text-[10px]">&lt;75% (Low)</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-3 h-3 rounded bg-[#8B5CF6]/70 inline-block" />
          <span className="text-[10px]">75-80%</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-3 h-3 rounded bg-[#6C47FF] inline-block" />
          <span className="text-[10px]">80-85%</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-3 h-3 rounded bg-[#FF6B4A]/90 inline-block" />
          <span className="text-[10px]">85-90%</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-3 h-3 rounded bg-[#E8472A] inline-block" />
          <span className="text-[10px]">90%+ (Resonant)</span>
        </div>
      </div>

      {/* NxN Heatmap Table */}
      {loading ? (
        <div className="max-w-4xl mx-auto py-24 text-center space-y-4">
          <div className="w-10 h-10 border-4 border-[#6C47FF] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-mono text-slate-400">Rendering 25×25 compatibility heatmap matrix...</p>
        </div>
      ) : (
        <div className="glass-panel p-4 sm:p-6 rounded-3xl border border-white/10 overflow-x-auto scrollbar-none">
          <div className="min-w-[950px]">
            
            {/* Header row: Person B column labels */}
            <div className="grid grid-cols-[160px_repeat(25,1fr)] gap-1 pb-1 border-b border-white/5">
              <div className="text-[10px] font-mono text-slate-500 font-bold p-1">PERSON A \ B</div>
              {people.map((p, i) => (
                <div key={p.id} className="text-center p-1" title={p.name}>
                  <img
                    src={p.avatar}
                    alt={p.name}
                    className="w-6 h-6 rounded-full mx-auto object-cover border border-white/10"
                  />
                  <div className="text-[9px] font-mono text-slate-400 truncate mt-0.5 max-w-[32px] mx-auto">
                    {p.name.split(' ')[0]}
                  </div>
                </div>
              ))}
            </div>

            {/* Matrix rows */}
            <div className="space-y-1 pt-1">
              {matrix.map((row, i) => {
                const rowPerson = people[i];
                return (
                  <div key={rowPerson.id} className="grid grid-cols-[160px_repeat(25,1fr)] gap-1 items-center">
                    {/* Row Header */}
                    <div className="flex items-center space-x-2 p-1 truncate" title={rowPerson.name}>
                      <img
                        src={rowPerson.avatar}
                        alt=""
                        className="w-5 h-5 rounded-full object-cover border border-white/10 flex-shrink-0"
                      />
                      <span className="text-[11px] font-bold text-white truncate">{rowPerson.name}</span>
                    </div>

                    {/* Row Cells */}
                    {row.map((cell, j) => {
                      const isSelected = selectedCell?.person1Id === cell.person1Id && selectedCell?.person2Id === cell.person2Id;
                      return (
                        <button
                          key={`${cell.person1Id}-${cell.person2Id}`}
                          onClick={() => handleCellClick(cell)}
                          disabled={cell.isSelf}
                          className={`h-7 rounded-md text-[10px] font-mono transition flex items-center justify-center ${
                            getCellBg(cell.score, cell.isSelf)
                          } ${
                            isSelected ? 'ring-2 ring-white scale-110 z-10' : 'hover:scale-105'
                          }`}
                          title={`${cell.person1Name || rowPerson.name} & ${cell.person2Name || people[j]?.name}: ${cell.score}%`}
                        >
                          {cell.isSelf ? '—' : cell.score}
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      )}

      {/* TRANSCRIPT DRAWER / MODAL ON CELL CLICK */}
      <AnimatePresence>
        {selectedCell && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-panel w-full max-w-2xl max-h-[85vh] rounded-3xl border border-white/15 overflow-hidden flex flex-col shadow-2xl"
            >
              {/* Drawer Header */}
              <div className="p-5 border-b border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-[#E8472A] uppercase">Compatibility Inspection</span>
                  <h3 className="text-base font-bold text-white font-sans">
                    {selectedCell.person1Name} & {selectedCell.person2Name}
                  </h3>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="text-lg font-bold text-emerald-400 font-mono">
                    {selectedCell.score}% Match
                  </span>
                  <button
                    onClick={() => setSelectedCell(null)}
                    className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Drawer Content */}
              <div className="p-6 overflow-y-auto space-y-5 text-left">
                {drawerLoading ? (
                  <div className="py-12 text-center text-xs font-mono text-slate-400 space-y-2">
                    <div className="w-8 h-8 border-2 border-[#E8472A] border-t-transparent rounded-full animate-spin mx-auto" />
                    <p>Loading full conversation transcript...</p>
                  </div>
                ) : drawerDate ? (
                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-[#0A0A0F] border border-white/5 space-y-2">
                      <div className="flex items-center justify-between text-xs font-mono text-[#6C47FF]">
                        <span>VENUE: {drawerDate.scenarioDetails?.name || drawerDate.scenario}</span>
                        <span>Turn 1 to 8 Completed</span>
                      </div>
                      <p className="text-xs text-slate-300 font-serif italic">
                        "{drawerDate.judge_verdict?.rationale || 'High conversational reciprocity and values alignment.'}"
                      </p>
                    </div>

                    <div className="space-y-3">
                      <span className="text-xs font-mono text-slate-400 block uppercase">
                        Conversation Excerpts:
                      </span>
                      {(drawerDate.transcript || []).slice(0, 4).map((t, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-[#0A0A0F] border border-white/5 space-y-1">
                          <div className="flex items-center justify-between text-[11px] font-bold text-slate-300">
                            <span>{t.speaker}</span>
                            <span className="text-[10px] font-mono text-slate-500">{t.stage}</span>
                          </div>
                          <p className="font-dialogue text-sm text-[#F2F2F2]">
                            "{t.dialogue}"
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={() => {
                          setSelectedCell(null);
                          onWatchDate && onWatchDate(drawerDate.id);
                        }}
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#E8472A] to-[#6C47FF] text-white text-xs font-bold shadow-glow-spark flex items-center space-x-2"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Watch Full 8-Turn Date</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="py-8 text-center space-y-3">
                    <p className="text-xs text-slate-400">
                      Algorithmic compatibility estimate: {selectedCell.score}%. No historical date on record yet.
                    </p>
                    <button
                      onClick={() => {
                        setSelectedCell(null);
                        onStartDating(selectedCell.person1Id, selectedCell.person2Id);
                      }}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#E8472A] to-[#6C47FF] text-white text-xs font-bold shadow-glow-spark inline-flex items-center space-x-2"
                    >
                      <Radio className="w-3.5 h-3.5 animate-pulse" />
                      <span>Simulate Date Now</span>
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
