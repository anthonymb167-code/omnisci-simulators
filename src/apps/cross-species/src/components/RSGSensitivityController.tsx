import React from 'react';
import { MasterCoreData } from '../types/sensorMatrix';
import { Sliders, Shield, Zap, Sparkles, AlertTriangle, Eye } from 'lucide-react';

interface RSGSensitivityControllerProps {
  rsgSensitivity: number; // 0 to 100%
  onChangeRSG: (val: number) => void;
  masterData: MasterCoreData;
}

export const RSGSensitivityController: React.FC<RSGSensitivityControllerProps> = ({
  rsgSensitivity,
  onChangeRSG,
  masterData,
}) => {
  // Determine active state description
  let activeStateKey: '100%' | '50%' | '0%' = '100%';
  let stateTitle = 'RSG Maximum Filter';
  let outputDescription = 'Simplified Human Watercolor (Survival Mode)';
  let bandwidthLabel = 'Low Bandwidth (18 Mbps)';
  let filterColor = 'text-slate-300';
  let badgeTone = 'border-slate-700 bg-slate-900 text-slate-300';

  if (rsgSensitivity <= 20) {
    activeStateKey = '0%';
    stateTitle = 'Total Compaction';
    outputDescription = 'Raw Multi-Dimensional Geometry (True Perspective)';
    bandwidthLabel = 'Maximum Sensor Influx (4,200 Mbps / High Density)';
    filterColor = 'text-cyan-300';
    badgeTone = 'border-cyan-500/50 bg-cyan-950/40 text-cyan-300';
  } else if (rsgSensitivity <= 70) {
    activeStateKey = '50%';
    stateTitle = 'Sensor Adherence';
    outputDescription = 'Cross-Species Hybrid Stitched Overlay';
    bandwidthLabel = 'Moderate Uncompressed Bandwidth (2,100 Mbps)';
    filterColor = 'text-amber-300';
    badgeTone = 'border-amber-500/50 bg-amber-950/40 text-amber-300';
  }

  // Calculate geometric rigidity and attenuation indices
  const geometricRigidity = 100 - rsgSensitivity;
  const evolutionaryFiltering = rsgSensitivity;

  return (
    <div className="w-full rounded-xl border border-slate-800 bg-slate-900/50 p-5 backdrop-blur shadow-xl flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider">
            <Sliders className="w-3.5 h-3.5" />
            <span>Operational Logic Governance</span>
            <span className="text-slate-600">·</span>
            <span className="text-slate-400">Ruthless Simulator Genome (RSG)</span>
          </div>
          <h2 className="text-base font-semibold text-white mt-1">
            Interactive RSG Sensitivity Slider
          </h2>
        </div>

        {/* State Badge */}
        <div className="flex items-center gap-2">
          <span className={`text-xs font-mono px-3 py-1 rounded border font-semibold ${badgeTone}`}>
            {stateTitle} · {rsgSensitivity}% Sensitivity
          </span>
        </div>
      </div>

      {/* Main Slider Scrubber Rail */}
      <div className="space-y-2 py-1">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-slate-400 flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-cyan-400" />
            <span>RSG Filter Attenuation Level</span>
          </span>
          <span className="font-bold text-lg tabular-nums text-cyan-300">
            {rsgSensitivity}%
          </span>
        </div>

        <input
          type="range"
          min="0"
          max="100"
          step="1"
          value={rsgSensitivity}
          onChange={(e) => onChangeRSG(Number(e.target.value))}
          className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 transition-all"
        />

        {/* Axis Ticks */}
        <div className="flex justify-between text-[11px] font-mono text-slate-500 pt-1">
          <button
            onClick={() => onChangeRSG(0)}
            className={`hover:text-cyan-300 transition-colors cursor-pointer ${
              rsgSensitivity === 0 ? 'text-cyan-400 font-bold' : ''
            }`}
          >
            0% (Total Compaction / Raw Geometry)
          </button>
          <button
            onClick={() => onChangeRSG(50)}
            className={`hover:text-amber-300 transition-colors cursor-pointer ${
              rsgSensitivity === 50 ? 'text-amber-400 font-bold' : ''
            }`}
          >
            50% (Sensor Adherence)
          </button>
          <button
            onClick={() => onChangeRSG(100)}
            className={`hover:text-slate-200 transition-colors cursor-pointer ${
              rsgSensitivity === 100 ? 'text-slate-200 font-bold' : ''
            }`}
          >
            100% (RSG Max Filter / Human 480p)
          </button>
        </div>
      </div>

      {/* Preset State Snap Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-1">
        <button
          onClick={() => onChangeRSG(100)}
          className={`text-left p-3 rounded-lg border transition-all cursor-pointer ${
            rsgSensitivity > 70
              ? 'border-slate-500 bg-slate-800 text-white ring-1 ring-slate-400/40'
              : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
          }`}
        >
          <div className="text-[11px] font-mono text-slate-400 mb-0.5">100% RSG SENSITIVITY</div>
          <div className="text-xs font-semibold text-slate-100 mb-1">RSG Maximum Filter</div>
          <div className="text-[11px] text-slate-400 leading-snug">
            Restricts outputs to simplified human 480p watercolor simulation (survival mode).
          </div>
        </button>

        <button
          onClick={() => onChangeRSG(50)}
          className={`text-left p-3 rounded-lg border transition-all cursor-pointer ${
            rsgSensitivity > 20 && rsgSensitivity <= 70
              ? 'border-amber-500 bg-slate-800 text-white ring-1 ring-amber-400/40'
              : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
          }`}
        >
          <div className="text-[11px] font-mono text-amber-400 mb-0.5">50% RSG SENSITIVITY</div>
          <div className="text-xs font-semibold text-slate-100 mb-1">Sensor Adherence</div>
          <div className="text-[11px] text-slate-400 leading-snug">
            Cross-species hybrid stitched overlay. Moderate uncompressed bandwidth influx.
          </div>
        </button>

        <button
          onClick={() => onChangeRSG(0)}
          className={`text-left p-3 rounded-lg border transition-all cursor-pointer ${
            rsgSensitivity <= 20
              ? 'border-cyan-500 bg-slate-800 text-white ring-1 ring-cyan-400/40'
              : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
          }`}
        >
          <div className="text-[11px] font-mono text-cyan-400 mb-0.5">0% RSG SENSITIVITY</div>
          <div className="text-xs font-semibold text-slate-100 mb-1">Total Compaction</div>
          <div className="text-[11px] text-slate-400 leading-snug">
            Raw multi-dimensional geometry (true perspective). Maximum sensor influx without overload.
          </div>
        </button>
      </div>

      {/* Operational State Readout Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-slate-800 pt-3">
        <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
          <div className="text-[10px] font-mono uppercase text-slate-500">Output Characteristic</div>
          <div className="text-xs font-semibold text-slate-200 truncate mt-0.5">
            {outputDescription}
          </div>
        </div>

        <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
          <div className="text-[10px] font-mono uppercase text-slate-500">Geometric Rigidity</div>
          <div className="text-xs font-mono font-bold text-cyan-300 mt-0.5 tabular-nums">
            {geometricRigidity}% Rigidity
          </div>
        </div>

        <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
          <div className="text-[10px] font-mono uppercase text-slate-500">Evolutionary Filter</div>
          <div className="text-xs font-mono font-bold text-slate-300 mt-0.5 tabular-nums">
            {evolutionaryFiltering}% Active
          </div>
        </div>

        <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
          <div className="text-[10px] font-mono uppercase text-slate-500">Data Density Profile</div>
          <div className="text-xs font-mono font-medium text-slate-200 truncate mt-0.5">
            {bandwidthLabel}
          </div>
        </div>
      </div>
    </div>
  );
};
