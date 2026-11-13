import React, { useState } from 'react';
import { AlphaTestState, MasterCoreData } from '../types/sensorMatrix';
import { Target, Play, Pause, RotateCcw, CheckCircle, Award, Gauge, Sparkles } from 'lucide-react';

interface TargetMimickingLabProps {
  alphaState: AlphaTestState;
  onUpdateAlphaState: (updater: (prev: AlphaTestState) => AlphaTestState) => void;
  temporalDilation: number;
  onChangeTemporalDilation: (val: number) => void;
  masterData: MasterCoreData;
}

export const TargetMimickingLab: React.FC<TargetMimickingLabProps> = ({
  alphaState,
  onUpdateAlphaState,
  temporalDilation,
  onChangeTemporalDilation,
  masterData,
}) => {
  const [trialLog, setTrialLog] = useState<Array<{ id: number; timestamp: string; score: number; status: string }>>([
    { id: 1, timestamp: 'Trial 01 · Baseline', score: 64, status: 'Calibrated' },
    { id: 2, timestamp: 'Trial 02 · Slit + UV Merge', score: 82, status: 'Optimal' },
  ]);

  const toggleProtocol = () => {
    onUpdateAlphaState((prev) => ({
      ...prev,
      active: !prev.active,
    }));
  };

  const resetProtocol = () => {
    onUpdateAlphaState((prev) => ({
      ...prev,
      active: false,
      lockTime: 0,
      neuralElasticity: 0,
      stitchingCoherence: 0,
      rsgOverwriteRate: 0,
      crosshairLocked: false,
    }));
  };

  const recordTrialCompletion = () => {
    if (alphaState.stitchingCoherence < 20) return;
    const newId = trialLog.length + 1;
    const now = new Date().toLocaleTimeString();
    setTrialLog((prev) => [
      {
        id: newId,
        timestamp: `Trial 0${newId} · ${now}`,
        score: Math.round((alphaState.neuralElasticity + alphaState.stitchingCoherence) / 2),
        status: alphaState.stitchingCoherence > 80 ? 'Mastery' : 'Calibrated',
      },
      ...prev.slice(0, 4),
    ]);

    onUpdateAlphaState((prev) => ({
      ...prev,
      completedTrials: prev.completedTrials + 1,
      lockTime: 0,
    }));
  };

  return (
    <div className="w-full rounded-xl border border-slate-800 bg-slate-900/40 p-5 backdrop-blur flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider">
            <Target className="w-3.5 h-3.5" />
            <span>Alpha Test Protocol · {masterData.alphaTestProtocol.activity}</span>
          </div>
          <h2 className="text-base font-semibold text-white mt-1">
            Neural Plasticity & Target Mimicking Sandbox
          </h2>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleProtocol}
            className={`px-3.5 py-1.5 text-xs font-medium rounded transition-colors flex items-center gap-1.5 cursor-pointer font-mono ${
              alphaState.active
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/50 hover:bg-rose-500/30'
                : 'bg-cyan-500 text-slate-950 hover:bg-cyan-400 font-semibold shadow-sm'
            }`}
          >
            {alphaState.active ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Halt Protocol</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Engage Target Mimicking</span>
              </>
            )}
          </button>

          <button
            onClick={resetProtocol}
            className="p-1.5 rounded border border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200 transition-colors"
            title="Reset Protocol Metrics"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Purpose Banner from Core Data */}
      <div className="p-3 rounded-lg border border-slate-800 bg-slate-950/70 text-xs text-slate-300 leading-relaxed flex items-start gap-2.5">
        <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-mono text-cyan-300 uppercase block mb-0.5">Protocol Directive:</span>
          &ldquo;{masterData.alphaTestProtocol.purpose}&rdquo;
          <div className="mt-1 text-slate-400">
            Track the kinetic target across the viewport with your cursor to calibrate multi-species sensor coherence, proving structural elasticity against baseline biological filtering.
          </div>
        </div>
      </div>

      {/* Telemetry Gauge Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {/* Metric 1: Neural Elasticity */}
        <div className="rounded-lg border border-slate-800 bg-slate-950 p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
            <span>Neural Elasticity</span>
            <Gauge className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-1.5 my-1">
            <span className="text-3xl font-bold font-mono text-white tabular-nums">
              {alphaState.neuralElasticity}%
            </span>
            <span className="text-xs font-mono text-slate-400">adaptive flex</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2">
            <div
              className="bg-cyan-400 h-full transition-all duration-300"
              style={{ width: `${alphaState.neuralElasticity}%` }}
            />
          </div>
          <div className="text-[11px] text-slate-400 mt-2">
            Measures capacity to absorb non-human geometries without cognitive rejection.
          </div>
        </div>

        {/* Metric 2: Sensor Stitching Coherence */}
        <div className="rounded-lg border border-slate-800 bg-slate-950 p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
            <span>Stitching Coherence</span>
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-1.5 my-1">
            <span className="text-3xl font-bold font-mono text-emerald-300 tabular-nums">
              {alphaState.stitchingCoherence}%
            </span>
            <span className="text-xs font-mono text-slate-400">phase lock</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2">
            <div
              className="bg-emerald-400 h-full transition-all duration-300"
              style={{ width: `${alphaState.stitchingCoherence}%` }}
            />
          </div>
          <div className="text-[11px] text-slate-400 mt-2">
            Synchronization between Cuboid Moon vectors, UV grids, and thermal plumes.
          </div>
        </div>

        {/* Metric 3: RSG Overwrite Rate */}
        <div className="rounded-lg border border-slate-800 bg-slate-950 p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
            <span>RSG Overwrite Progress</span>
            <Award className="w-3.5 h-3.5 text-violet-400" />
          </div>
          <div className="flex items-baseline gap-1.5 my-1">
            <span className="text-3xl font-bold font-mono text-violet-300 tabular-nums">
              {alphaState.rsgOverwriteRate}%
            </span>
            <span className="text-xs font-mono text-slate-400">filter rewrite</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2">
            <div
              className="bg-violet-400 h-full transition-all duration-300"
              style={{ width: `${alphaState.rsgOverwriteRate}%` }}
            />
          </div>
          <div className="text-[11px] text-slate-400 mt-2">
            Overcomes default 1% human glucose-saving bottleneck.
          </div>
        </div>
      </div>

      {/* Temporal Dilation Scrub & Calibration Action */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-800 pt-3">
        {/* Fly Compound Eye Temporal Dilation Control */}
        <div className="p-3 rounded-lg border border-slate-800 bg-slate-950">
          <div className="flex items-center justify-between text-xs font-mono text-slate-300 mb-1">
            <span>Diptera Temporal Dilation Scrubber</span>
            <span className="text-cyan-400 font-bold tabular-nums">
              {(temporalDilation * 1000).toFixed(0)} Hz / {temporalDilation < 1 ? 'Slow Motion' : 'Real-Time'}
            </span>
          </div>
          <input
            type="range"
            min="0.1"
            max="1.0"
            step="0.05"
            value={temporalDilation}
            onChange={(e) => onChangeTemporalDilation(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 my-2"
          />
          <div className="flex justify-between text-[10px] font-mono text-slate-500">
            <span>1000fps (Biological Dilated Refresh)</span>
            <span>60fps (Human Refresh)</span>
          </div>
        </div>

        {/* Trial Log & Record Button */}
        <div className="p-3 rounded-lg border border-slate-800 bg-slate-950 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-mono text-slate-300 mb-2">
            <span>Trial Registry & Calibration Record</span>
            <button
              onClick={recordTrialCompletion}
              disabled={alphaState.stitchingCoherence < 20}
              className="px-2 py-0.5 text-[11px] font-mono rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 disabled:opacity-40 cursor-pointer"
            >
              Record Trial Benchmark
            </button>
          </div>

          <div className="space-y-1.5 overflow-y-auto max-h-20">
            {trialLog.map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between text-xs py-1 px-2 rounded bg-slate-900 border border-slate-800/80"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3 h-3 text-emerald-400" />
                  <span className="text-slate-300 font-mono">{t.timestamp}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-cyan-300 tabular-nums">{t.score}% Score</span>
                  <span className="text-[10px] font-mono text-slate-400 px-1.5 rounded bg-slate-800">
                    {t.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
