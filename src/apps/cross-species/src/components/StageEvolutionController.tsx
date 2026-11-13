import React from 'react';
import { EvolutionaryStageId, MasterCoreData } from '../types/sensorMatrix';
import { Layers, ShieldAlert, Cpu, Sparkles, Zap } from 'lucide-react';

interface StageEvolutionControllerProps {
  masterData: MasterCoreData;
  currentStage: EvolutionaryStageId;
  onSelectStage: (stage: EvolutionaryStageId) => void;
}

export const StageEvolutionController: React.FC<StageEvolutionControllerProps> = ({
  masterData,
  currentStage,
  onSelectStage,
}) => {
  const stage = masterData.evolutionaryMatrix[currentStage];
  const stages: EvolutionaryStageId[] = ['stage3D', 'stage4D', 'stage5D'];

  // Cognitive load color computation
  const getCognitiveColor = (load: number) => {
    if (load > 70) return 'text-amber-400 border-amber-500/40 bg-amber-950/20';
    if (load > 40) return 'text-cyan-400 border-cyan-500/40 bg-cyan-950/20';
    return 'text-emerald-400 border-emerald-500/40 bg-emerald-950/20';
  };

  return (
    <div className="w-full rounded-xl border border-slate-800 bg-slate-900/40 p-5 backdrop-blur flex flex-col gap-5">
      {/* Header & Concept Identity */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5" />
            <span>The 5th Hypothesis Framework</span>
            <span className="text-slate-600">·</span>
            <span className="text-slate-400">Fragmentation to Compaction</span>
          </div>
          <h2 className="text-lg font-semibold text-white mt-1">
            Evolutionary Sensory Matrix Controller
          </h2>
        </div>

        {/* Cognitive Load Telemetry Box */}
        <div className="flex items-center gap-4 bg-slate-950 px-4 py-2 rounded-lg border border-slate-800 shrink-0">
          <div>
            <div className="text-[11px] font-mono uppercase text-slate-400">
              Cognitive Buffer Load
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className={`text-2xl font-bold font-mono tabular-nums ${
                stage.cognitiveLoad > 70 ? 'text-rose-400' : stage.cognitiveLoad > 30 ? 'text-amber-400' : 'text-emerald-400'
              }`}>
                {stage.cognitiveLoad}%
              </span>
              <span className="text-xs font-mono text-slate-500">
                {stage.cognitiveLoad > 70 ? 'CRITICAL SPIKE' : stage.cognitiveLoad > 30 ? 'NOMINAL' : 'REST'}
              </span>
            </div>
          </div>
          <div className="h-8 w-px bg-slate-800" />
          <div>
            <div className="text-[11px] font-mono uppercase text-slate-400">
              Neural Bandwidth
            </div>
            <div className="text-sm font-bold font-mono text-slate-200 tabular-nums">
              {stage.bandwidthMbps} <span className="text-xs font-normal text-slate-400 font-mono">Mbps</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stage Progression Buttons (Interactive Segmented Timeline) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {stages.map((stgKey, idx) => {
          const item = masterData.evolutionaryMatrix[stgKey];
          const isSelected = currentStage === stgKey;

          return (
            <button
              key={stgKey}
              onClick={() => onSelectStage(stgKey)}
              className={`text-left p-3.5 rounded-lg border transition-all cursor-pointer relative overflow-hidden ${
                isSelected
                  ? 'border-cyan-500 bg-slate-900/90 shadow-lg shadow-cyan-950/40 ring-1 ring-cyan-500/50'
                  : 'border-slate-800 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-900/50'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-mono text-slate-400">
                  Phase 0{idx + 1}
                </span>
                <span
                  className={`text-[11px] font-mono px-2 py-0.5 rounded border ${getCognitiveColor(
                    item.cognitiveLoad
                  )}`}
                >
                  {item.cognitiveLoad}% Load
                </span>
              </div>

              <div className="text-sm font-semibold text-slate-100 mb-1">
                {item.name}
              </div>

              <div className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                {item.subtitle}
              </div>

              {isSelected && (
                <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-cyan-400">
                  <span>ACTIVE PARADIGM</span>
                  <span>{item.resolutionTag}</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Active Stage Deep-Dive Banner */}
      <div className="rounded-lg border border-slate-800/80 bg-slate-950/80 p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-1">
              <span>Filter Mode:</span>
              <span className="text-cyan-300 font-semibold">{stage.filterMode}</span>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              {stage.description}
            </p>
          </div>

          <div className="rounded border border-slate-800 bg-slate-900/60 p-3 flex flex-col justify-between">
            <div className="text-xs font-mono text-slate-400 uppercase flex items-center gap-1.5 mb-1">
              {currentStage === 'stage3D' && <Cpu className="w-3.5 h-3.5 text-slate-400" />}
              {currentStage === 'stage4D' && <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />}
              {currentStage === 'stage5D' && <Sparkles className="w-3.5 h-3.5 text-emerald-400" />}
              <span>Architectural Diagnostic</span>
            </div>

            <div className="text-xs text-slate-300 mt-1">
              {currentStage === 'stage3D' && (
                <span>
                  <strong className="text-slate-100">RSG Bottleneck Active:</strong> Biological vision restricted to narrow 400-700nm band to prevent metabolic exhaustion.
                </span>
              )}
              {currentStage === 'stage4D' && (
                <span className="text-amber-300">
                  <strong>Data Stuffing Hazard:</strong> Multiple uncompressed feeds compete for neural priority. Risk of sensory fragmentation without compaction.
                </span>
              )}
              {currentStage === 'stage5D' && (
                <span className="text-emerald-300">
                  <strong>Soap Bubble Compaction:</strong> High-dimensional sensor tensors folded into an intuitive, topologically unified truth vector.
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
