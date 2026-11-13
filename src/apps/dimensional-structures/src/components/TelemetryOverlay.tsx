/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { HypothesisId } from '../types/dimensions';

interface TelemetryOverlayProps {
  hypothesis: HypothesisId;
  effectiveDim: number;
  spaceUnits: number;
  netForce: number;
  adherence: number;
  isPaused: boolean;
  onTogglePause: () => void;
  onResetView: () => void;
}

export const TelemetryOverlay: React.FC<TelemetryOverlayProps> = ({
  hypothesis,
  effectiveDim,
  spaceUnits,
  netForce,
  adherence,
  isPaused,
  onTogglePause,
  onResetView,
}) => {
  return (
    <div className="absolute top-16 left-6 z-20 pointer-events-none flex flex-col gap-3">
      {/* Primary Dimensional State Box */}
      <div className="pointer-events-auto bg-slate-900/80 border border-slate-800/80 rounded-lg p-3.5 shadow-xl max-w-xs text-xs">
        <div className="flex items-center justify-between gap-4 mb-2">
          <span className="font-mono text-slate-400 uppercase tracking-wider text-[10px]">
            Active Dimension Index
          </span>
          <span className="font-mono font-bold text-cyan-400 text-sm tabular-nums">
            D = {effectiveDim.toFixed(2)}
          </span>
        </div>

        {/* Dynamic Metric per Hypothesis */}
        {hypothesis === 'overlapping' && (
          <div className="space-y-1.5 pt-2 border-t border-slate-800">
            <div className="flex justify-between font-mono text-slate-300">
              <span className="text-slate-400">Stacking Vector:</span>
              <span className="tabular-nums text-cyan-300">
                {effectiveDim <= 1 ? '0D Singularity' : effectiveDim <= 2 ? '1D Linear' : effectiveDim <= 3 ? '2D Epicentral' : '4D Hyper-Radial (Ana/Kata)'}
              </span>
            </div>
            <div className="flex justify-between font-mono text-slate-300">
              <span className="text-slate-400">Manifold Geometry:</span>
              <span className="text-slate-200">
                {effectiveDim >= 3.5 ? 'Tesseract (8-Cell)' : effectiveDim >= 2.5 ? 'Volumetric Sphere' : 'Planar Sheet'}
              </span>
            </div>
          </div>
        )}

        {hypothesis === 'constrictive_force' && (
          <div className="space-y-1.5 pt-2 border-t border-slate-800">
            <div className="flex justify-between font-mono text-slate-300">
              <span className="text-slate-400">Equilibrium Balance:</span>
              <span className={`tabular-nums ${netForce <= 0.05 ? 'text-emerald-400 font-semibold' : 'text-amber-400'}`}>
                {netForce <= 0.05 ? 'Basal Point Locked' : `ΔF = ${netForce.toFixed(3)} N`}
              </span>
            </div>
            <div className="flex justify-between font-mono text-slate-300">
              <span className="text-slate-400">Passive Gravity:</span>
              <span className="text-purple-400 tabular-nums">Active Field (L &gt; B₀)</span>
            </div>
          </div>
        )}

        {hypothesis === 'ever_expansion' && (
          <div className="space-y-1.5 pt-2 border-t border-slate-800">
            <div className="flex justify-between font-mono text-slate-300">
              <span className="text-slate-400">Occupied Space Units:</span>
              <span className="tabular-nums text-cyan-400 font-semibold">{spaceUnits} Su</span>
            </div>
            <div className="flex justify-between font-mono text-slate-300">
              <span className="text-slate-400">Tipping Threshold (Sc):</span>
              <span className="text-slate-200">{spaceUnits >= 240 ? '3D/4D Saturation' : '2D Sub-Critical'}</span>
            </div>
          </div>
        )}

        {hypothesis === 'big_bang_collapse' && (
          <div className="space-y-1.5 pt-2 border-t border-slate-800">
            <div className="flex justify-between font-mono text-slate-300">
              <span className="text-slate-400">Collapse Cascade:</span>
              <span className="text-amber-300 tabular-nums">4D → {effectiveDim.toFixed(1)}D Breakdown</span>
            </div>
            <div className="flex justify-between font-mono text-slate-300">
              <span className="text-slate-400">Residual Cluster:</span>
              <span className="text-cyan-300">Spiral Core / Galaxies</span>
            </div>
          </div>
        )}

        {hypothesis === 'momentum_collision' && (
          <div className="space-y-1.5 pt-2 border-t border-slate-800">
            <div className="flex justify-between font-mono text-slate-300">
              <span className="text-slate-400">Kinetic Adherence:</span>
              <span className={`tabular-nums font-semibold ${adherence >= 90 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {adherence}% {adherence >= 90 ? '(Puzzle Locked)' : '(Fragmenting)'}
              </span>
            </div>
            <div className="flex justify-between font-mono text-slate-300">
              <span className="text-slate-400">Structures Bonded:</span>
              <span className="text-slate-200">{adherence >= 90 ? '8 Cubes → 1 Tesseract' : 'Unbound Elements'}</span>
            </div>
          </div>
        )}

        {/* Quick simulation pause/reset affordance */}
        <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between gap-2">
          <button
            onClick={onTogglePause}
            className="text-[11px] font-mono px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
          >
            {isPaused ? 'Resume Sim' : 'Pause Sim'}
          </button>
          <button
            onClick={onResetView}
            className="text-[11px] font-mono px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
          >
            Reset Orbit
          </button>
        </div>
      </div>
    </div>
  );
};
