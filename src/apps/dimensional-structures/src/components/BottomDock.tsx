/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Sliders, Layers, Compass, Zap, Hourglass } from 'lucide-react';
import {
  HypothesisId,
  OverlappingParams,
  ConstrictiveParams,
  EverExpansionParams,
  BigBangCollapseParams,
  MomentumCollisionParams,
} from '../types/dimensions';
import { HYPOTHESES } from '../data/hypothesesData';
import { sound } from '../utils/audio';

interface BottomDockProps {
  activeHypothesis: HypothesisId;
  onSelectHypothesis: (id: HypothesisId) => void;
  overlappingParams: OverlappingParams;
  setOverlappingParams: React.Dispatch<React.SetStateAction<OverlappingParams>>;
  constrictiveParams: ConstrictiveParams;
  setConstrictiveParams: React.Dispatch<React.SetStateAction<ConstrictiveParams>>;
  everExpansionParams: EverExpansionParams;
  setEverExpansionParams: React.Dispatch<React.SetStateAction<EverExpansionParams>>;
  bigBangParams: BigBangCollapseParams;
  setBigBangParams: React.Dispatch<React.SetStateAction<BigBangCollapseParams>>;
  momentumParams: MomentumCollisionParams;
  setMomentumParams: React.Dispatch<React.SetStateAction<MomentumCollisionParams>>;
  onTriggerChime: () => void;
}

export const BottomDock: React.FC<BottomDockProps> = ({
  activeHypothesis,
  onSelectHypothesis,
  overlappingParams,
  setOverlappingParams,
  constrictiveParams,
  setConstrictiveParams,
  everExpansionParams,
  setEverExpansionParams,
  bigBangParams,
  setBigBangParams,
  momentumParams,
  setMomentumParams,
  onTriggerChime,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const currentHypothesis = HYPOTHESES.find((h) => h.id === activeHypothesis) || HYPOTHESES[0];

  return (
    <div
      className={`fixed bottom-5 left-1/2 -translate-x-1/2 z-30 w-full max-w-[940px] px-4 transition-transform duration-300 ${
        isCollapsed ? 'translate-y-[calc(100%-42px)]' : 'translate-y-0'
      }`}
    >
      {/* Collapse/Expand Toggle Header */}
      <div className="flex justify-center mb-1">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-mono text-slate-300 hover:text-white bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 rounded-t-lg shadow-lg cursor-pointer transition-colors"
        >
          {isCollapsed ? <ChevronUp className="w-3.5 h-3.5 text-cyan-400" /> : <ChevronDown className="w-3.5 h-3.5 text-cyan-400" />}
          <span>{isCollapsed ? 'Show Controls (H)' : 'Hide Controls (H)'}</span>
        </button>
      </div>

      {/* Main Glassmorphic Control Dock */}
      <div className="bg-[#0b0e17]/95 border border-slate-800 rounded-xl p-4 shadow-2xl text-slate-200">
        {/* Top Dock Header & Hypothesis Selector Pills */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-cyan-400 font-semibold">{currentHypothesis.index}.</span>
              <h2 className="text-sm font-bold text-white tracking-tight">{currentHypothesis.title}</h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{currentHypothesis.tagline}</p>
          </div>

          {/* Quick Hypothesis Tab Switcher */}
          <div className="flex items-center gap-1 p-1 bg-slate-950/80 border border-slate-800/80 rounded-lg overflow-x-auto">
            {HYPOTHESES.map((h) => (
              <button
                key={h.id}
                onClick={() => {
                  onSelectHypothesis(h.id);
                  sound.playDimensionalChime(parseInt(h.index));
                }}
                className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap cursor-pointer transition-colors ${
                  h.id === activeHypothesis
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                {h.shortName}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Parameter Sliders & Interactive Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* ================= HYPOTHESIS 1: OVERLAPPING ================= */}
          {activeHypothesis === 'overlapping' && (
            <>
              {/* Transition Level */}
              <div>
                <label className="text-slate-400 font-mono text-[11px] block mb-1.5">
                  Overlapping Phase Transition
                </label>
                <div className="grid grid-cols-2 gap-1">
                  {[
                    { id: '0D_to_1D', label: '0D → 1D (Points)' },
                    { id: '1D_to_2D', label: '1D → 2D (Unidirect)' },
                    { id: '2D_to_3D', label: '2D → 3D (Epicenter)' },
                    { id: '3D_to_4D', label: '3D → 4D (Ana/Kata)' },
                  ].map((lvl) => (
                    <button
                      key={lvl.id}
                      onClick={() => {
                        setOverlappingParams((prev) => ({
                          ...prev,
                          dimensionLevel: lvl.id as OverlappingParams['dimensionLevel'],
                        }));
                        onTriggerChime();
                      }}
                      className={`px-2 py-1.5 text-[11px] font-mono rounded cursor-pointer transition-colors ${
                        overlappingParams.dimensionLevel === lvl.id
                          ? 'bg-cyan-500 text-black font-semibold'
                          : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                      }`}
                    >
                      {lvl.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Overlap Count */}
              <div>
                <div className="flex justify-between font-mono text-[11px] text-slate-400 mb-1">
                  <span>Overlap Density (N):</span>
                  <span className="text-cyan-400 tabular-nums">{overlappingParams.overlapCount} layers</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="24"
                  value={overlappingParams.overlapCount}
                  onChange={(e) =>
                    setOverlappingParams((prev) => ({ ...prev, overlapCount: Number(e.target.value) }))
                  }
                  className="w-full accent-cyan-400 cursor-pointer"
                />
                <div className="flex justify-between font-mono text-[10px] text-slate-500 mt-1">
                  <span>Sparse</span>
                  <span>Epicentral Envelopment</span>
                </div>
              </div>

              {/* Epicenter / Hyper-W Angle */}
              <div>
                <div className="flex justify-between font-mono text-[11px] text-slate-400 mb-1">
                  <span>
                    {overlappingParams.dimensionLevel === '3D_to_4D'
                      ? '4D Hyper-Angle (W-Rotation):'
                      : 'Epicenter Radial Dispersion:'}
                  </span>
                  <span className="text-cyan-400 tabular-nums">
                    {overlappingParams.dimensionLevel === '3D_to_4D'
                      ? `${(overlappingParams.hyperAngleW * (180 / Math.PI)).toFixed(0)}°`
                      : `${overlappingParams.epicenterRadius.toFixed(2)}x`}
                  </span>
                </div>
                <input
                  type="range"
                  min={overlappingParams.dimensionLevel === '3D_to_4D' ? '0' : '0.4'}
                  max={overlappingParams.dimensionLevel === '3D_to_4D' ? (Math.PI * 2).toString() : '2.5'}
                  step="0.05"
                  value={
                    overlappingParams.dimensionLevel === '3D_to_4D'
                      ? overlappingParams.hyperAngleW
                      : overlappingParams.epicenterRadius
                  }
                  onChange={(e) =>
                    setOverlappingParams((prev) => ({
                      ...prev,
                      [overlappingParams.dimensionLevel === '3D_to_4D' ? 'hyperAngleW' : 'epicenterRadius']:
                        Number(e.target.value),
                    }))
                  }
                  className="w-full accent-cyan-400 cursor-pointer"
                />
                <span className="text-[10px] text-slate-400 block mt-1">
                  {overlappingParams.dimensionLevel === '3D_to_4D'
                    ? 'Ana/Kata orthogonal vector projection'
                    : 'Epicentral all-direction phenomenon'}
                </span>
              </div>
            </>
          )}

          {/* ================= HYPOTHESIS 2: CONSTRICTIVE FORCE ================= */}
          {activeHypothesis === 'constrictive_force' && (
            <>
              {/* Inward Constriction vs Basal Point */}
              <div>
                <div className="flex justify-between font-mono text-[11px] text-slate-400 mb-1">
                  <span>Inward Constrictive Force:</span>
                  <span className="text-cyan-400 tabular-nums">
                    {constrictiveParams.inwardForce.toFixed(2)} N
                  </span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="2.5"
                  step="0.05"
                  value={constrictiveParams.inwardForce}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setConstrictiveParams((prev) => ({ ...prev, inwardForce: val }));
                    if (val >= constrictiveParams.basalPoint) {
                      sound.playEquilibriumLock();
                    }
                  }}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
                <div className="flex items-center justify-between mt-1 text-[10px] font-mono">
                  <span className="text-slate-500">Basal Limit: {constrictiveParams.basalPoint.toFixed(2)} N</span>
                  <span
                    className={
                      constrictiveParams.inwardForce >= constrictiveParams.basalPoint
                        ? 'text-emerald-400 font-semibold'
                        : 'text-amber-400'
                    }
                  >
                    {constrictiveParams.inwardForce >= constrictiveParams.basalPoint
                      ? 'Integrity Locked'
                      : 'Constricting...'}
                  </span>
                </div>
              </div>

              {/* Passive Accumulation (Gravity) */}
              <div>
                <div className="flex justify-between font-mono text-[11px] text-slate-400 mb-1">
                  <span>Extra Length (Passive Gravity):</span>
                  <span className="text-purple-400 tabular-nums">
                    +{constrictiveParams.extraLength.toFixed(2)} Mass Eq
                  </span>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="2.0"
                  step="0.05"
                  value={constrictiveParams.extraLength}
                  onChange={(e) =>
                    setConstrictiveParams((prev) => ({ ...prev, extraLength: Number(e.target.value) }))
                  }
                  className="w-full accent-purple-400 cursor-pointer"
                />
                <span className="text-[10px] text-slate-400 block mt-1">
                  Residual force past basal point accumulates as external 3D Gravity.
                </span>
              </div>

              {/* 4D Force Z & Beta Counter Force */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono text-[11px] text-amber-400 font-semibold">
                    4D Genesis: Force Z vs Beta
                  </span>
                  <button
                    onClick={() => {
                      setConstrictiveParams((prev) => ({ ...prev, is4DActive: !prev.is4DActive }));
                      onTriggerChime();
                    }}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono cursor-pointer transition-colors ${
                      constrictiveParams.is4DActive
                        ? 'bg-amber-400 text-black font-semibold'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {constrictiveParams.is4DActive ? 'Force Z Active' : 'Activate Force Z'}
                  </button>
                </div>
                {constrictiveParams.is4DActive && (
                  <div>
                    <input
                      type="range"
                      min="0.5"
                      max="3.0"
                      step="0.1"
                      value={constrictiveParams.forceZ}
                      onChange={(e) =>
                        setConstrictiveParams((prev) => ({ ...prev, forceZ: Number(e.target.value) }))
                      }
                      className="w-full accent-amber-400 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] font-mono text-amber-300 mt-1">
                      <span>Compression: {constrictiveParams.forceZ.toFixed(1)}x</span>
                      <span>Beta Equilibrium: 1.00</span>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* ================= HYPOTHESIS 3: EVER EXPANSION ================= */}
          {activeHypothesis === 'ever_expansion' && (
            <>
              {/* Space Units Slider */}
              <div className="md:col-span-2">
                <div className="flex justify-between font-mono text-[11px] text-slate-400 mb-1">
                  <span>Occupied Space Units (Su):</span>
                  <span className="text-cyan-400 font-bold tabular-nums">
                    {everExpansionParams.spaceUnits} / 500 Su
                  </span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="500"
                  step="5"
                  value={everExpansionParams.spaceUnits}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    const tipped3D = val >= everExpansionParams.tippingThreshold3D;
                    const tipped4D = val >= everExpansionParams.tippingThreshold4D;
                    setEverExpansionParams((prev) => ({
                      ...prev,
                      spaceUnits: val,
                      isTippedTo3D: tipped3D,
                      isTippedTo4D: tipped4D,
                    }));
                    if (tipped3D || tipped4D) {
                      sound.playEquilibriumLock();
                    }
                  }}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
                <div className="flex justify-between font-mono text-[10px] text-slate-400 mt-1.5">
                  <span className="text-slate-500">2D Linear Sheet (20 Su)</span>
                  <span className={everExpansionParams.isTippedTo3D ? 'text-cyan-400 font-semibold' : 'text-slate-500'}>
                    3D Threshold ({everExpansionParams.tippingThreshold3D} Su)
                  </span>
                  <span className={everExpansionParams.isTippedTo4D ? 'text-purple-400 font-semibold' : 'text-slate-500'}>
                    4D Tipping ({everExpansionParams.tippingThreshold4D} Su)
                  </span>
                </div>
              </div>

              {/* Expansion Mode */}
              <div>
                <label className="text-slate-400 font-mono text-[11px] block mb-1.5">
                  Expansion Pattern
                </label>
                <div className="flex flex-col gap-1.5">
                  <button
                    onClick={() =>
                      setEverExpansionParams((prev) => ({
                        ...prev,
                        expansionMode: 'unidirectional_intersect',
                      }))
                    }
                    className={`px-2.5 py-1 text-[11px] font-mono text-left rounded cursor-pointer transition-colors ${
                      everExpansionParams.expansionMode === 'unidirectional_intersect'
                        ? 'bg-cyan-500 text-black font-semibold'
                        : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                    }`}
                  >
                    Intersecting Linear Tracks
                  </button>
                  <button
                    onClick={() =>
                      setEverExpansionParams((prev) => ({
                        ...prev,
                        expansionMode: 'uniform_radial',
                      }))
                    }
                    className={`px-2.5 py-1 text-[11px] font-mono text-left rounded cursor-pointer transition-colors ${
                      everExpansionParams.expansionMode === 'uniform_radial'
                        ? 'bg-cyan-500 text-black font-semibold'
                        : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                    }`}
                  >
                    Uniform Radial Outwards
                  </button>
                </div>
              </div>
            </>
          )}

          {/* ================= HYPOTHESIS 4: BIG BANG COLLAPSE ================= */}
          {activeHypothesis === 'big_bang_collapse' && (
            <>
              {/* Collapse Progress Scrubber */}
              <div>
                <div className="flex justify-between font-mono text-[11px] text-slate-400 mb-1">
                  <span>Top-Down Collapse Progress:</span>
                  <span className="text-amber-400 font-bold tabular-nums">
                    {(bigBangParams.collapseProgress * 100).toFixed(0)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={bigBangParams.collapseProgress}
                  onChange={(e) =>
                    setBigBangParams((prev) => ({ ...prev, collapseProgress: Number(e.target.value) }))
                  }
                  className="w-full accent-amber-400 cursor-pointer"
                />
                <div className="flex justify-between font-mono text-[10px] text-slate-400 mt-1">
                  <span>Pristine 4D Polytope</span>
                  <span>3D/2D Cascade Debris</span>
                </div>
              </div>

              {/* Residual Force & Clustered Matter */}
              <div>
                <div className="flex justify-between font-mono text-[11px] text-slate-400 mb-1">
                  <span>Residual Collapsing Force (Galactic Seeds):</span>
                  <span className="text-cyan-400 tabular-nums">
                    {bigBangParams.residualForce.toFixed(2)} G-res
                  </span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.05"
                  value={bigBangParams.residualForce}
                  onChange={(e) =>
                    setBigBangParams((prev) => ({ ...prev, residualForce: Number(e.target.value) }))
                  }
                  className="w-full accent-cyan-400 cursor-pointer"
                />
                <span className="text-[10px] text-slate-400 block mt-1">
                  Weak remaining force pulls lower dimensions into stars & spiral galaxies.
                </span>
              </div>

              {/* Existential Lifespan Ratios */}
              <div>
                <label className="text-slate-400 font-mono text-[11px] block mb-1">
                  Existential Lifespan: 4D &gt; 3D &gt; 2D &gt; 1D
                </label>
                <div className="space-y-1 font-mono text-[10px] bg-slate-950 p-2 rounded border border-slate-800">
                  <div className="flex justify-between text-purple-300">
                    <span>4D Hyperstructure:</span>
                    <span className="tabular-nums">1,000 Gyr (Longest)</span>
                  </div>
                  <div className="flex justify-between text-cyan-300">
                    <span>3D Stellar Core:</span>
                    <span className="tabular-nums">10 Gyr (Matter-dense)</span>
                  </div>
                  <div className="flex justify-between text-emerald-300">
                    <span>3D Organic Human:</span>
                    <span className="tabular-nums">80 Years (Compositional)</span>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ================= HYPOTHESIS 5: MOMENTUM COLLISION ================= */}
          {activeHypothesis === 'momentum_collision' && (
            <>
              {/* Time Flow Toggle */}
              <div>
                <label className="text-slate-400 font-mono text-[11px] block mb-1.5">
                  Temporal Metric State
                </label>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      setMomentumParams((prev) => ({ ...prev, timeState: 'active' }));
                      onTriggerChime();
                    }}
                    className={`flex-1 py-1.5 text-xs font-mono rounded cursor-pointer transition-colors ${
                      momentumParams.timeState === 'active'
                        ? 'bg-emerald-500 text-black font-semibold'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    Active Time (t &gt; 0)
                  </button>
                  <button
                    onClick={() => setMomentumParams((prev) => ({ ...prev, timeState: 'frozen' }))}
                    className={`flex-1 py-1.5 text-xs font-mono rounded cursor-pointer transition-colors ${
                      momentumParams.timeState === 'frozen'
                        ? 'bg-cyan-500 text-black font-semibold'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    Frozen Time (t = 0)
                  </button>
                </div>
                <span className="text-[10px] text-slate-400 block mt-1.5">
                  {momentumParams.timeState === 'active'
                    ? 'Momentum and kinetic collision enabled.'
                    : 'Absence of time: all kinetic adherence halts.'}
                </span>
              </div>

              {/* Momentum Intensity Slider */}
              <div>
                <div className="flex justify-between font-mono text-[11px] text-slate-400 mb-1">
                  <span>Collision Momentum (p):</span>
                  <span className="text-cyan-400 font-bold tabular-nums">
                    {momentumParams.momentumIntensity} GeV/c
                  </span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="1000"
                  step="25"
                  value={momentumParams.momentumIntensity}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setMomentumParams((prev) => ({ ...prev, momentumIntensity: val }));
                    sound.playCollisionImpact(val);
                  }}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
                <div className="flex justify-between font-mono text-[10px] mt-1">
                  <span className="text-slate-500">Elastic Bounce</span>
                  <span className={momentumParams.momentumIntensity >= 450 ? 'text-emerald-400 font-semibold' : 'text-slate-400'}>
                    Puzzle Adherence Threshold (450 GeV)
                  </span>
                </div>
              </div>

              {/* Puzzle Piece Adherence & 4D Requirements */}
              <div>
                <label className="text-slate-400 font-mono text-[11px] block mb-1">
                  4D Formation: 8 Cubes → 1 Tesseract
                </label>
                <div className="bg-slate-950 p-2 rounded border border-slate-800 text-[10px] font-mono space-y-1">
                  <div className="flex justify-between text-slate-300">
                    <span>Adherence Status:</span>
                    <span className={momentumParams.momentumIntensity >= 450 ? 'text-emerald-400 font-semibold' : 'text-amber-400'}>
                      {momentumParams.momentumIntensity >= 450 ? 'Permanently Stuck' : 'Elastic Dispersion'}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Components Locked:</span>
                    <span className="text-cyan-300">
                      {momentumParams.momentumIntensity >= 450 ? '8 / 8 Cubes Fused' : '0 / 8 Fused'}
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
