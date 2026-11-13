/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { ThreeCanvas } from './components/ThreeCanvas';
import { TopNav } from './components/TopNav';
import { BottomDock } from './components/BottomDock';
import { TelemetryOverlay } from './components/TelemetryOverlay';
import { TheoryModal } from './components/TheoryModal';
import {
  HypothesisId,
  OverlappingParams,
  ConstrictiveParams,
  EverExpansionParams,
  BigBangCollapseParams,
  MomentumCollisionParams,
} from './types/dimensions';
import { HYPOTHESES } from './data/hypothesesData';
import { sound } from './utils/audio';

export default function App() {
  const [activeHypothesis, setActiveHypothesis] = useState<HypothesisId>('overlapping');
  const [isTheoryOpen, setIsTheoryOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [isPaused, setIsPaused] = useState(false);

  // Telemetry state
  const [telemetry, setTelemetry] = useState({
    effectiveDim: 3.0,
    spaceUnits: 120,
    netForce: 0,
    adherence: 0,
  });

  // Hypothesis 1: Overlapping Params
  const [overlappingParams, setOverlappingParams] = useState<OverlappingParams>({
    dimensionLevel: '2D_to_3D',
    overlapCount: 16,
    epicenterRadius: 1.0,
    hyperAngleW: 0.0,
    directionDispersion: 'all_direction_radial',
  });

  // Hypothesis 2: Constrictive Force Params
  const [constrictiveParams, setConstrictiveParams] = useState<ConstrictiveParams>({
    lesserForce: 0.4,
    inwardForce: 1.2,
    basalPoint: 1.1,
    extraLength: 0.5,
    forceZ: 1.5,
    betaCounterForce: 1.5,
    is4DActive: false,
  });

  // Hypothesis 3: Ever Expansion Params
  const [everExpansionParams, setEverExpansionParams] = useState<EverExpansionParams>({
    expansionMode: 'unidirectional_intersect',
    spaceUnits: 160,
    tippingThreshold3D: 140,
    tippingThreshold4D: 360,
    expansionSpeed: 1.0,
    isTippedTo3D: true,
    isTippedTo4D: false,
  });

  // Hypothesis 4: Big Bang Collapse Params
  const [bigBangParams, setBigBangParams] = useState<BigBangCollapseParams>({
    collapseProgress: 0.35,
    startingDimension: 4,
    residualForce: 0.65,
    clusterType: 'spiral_galaxy',
    existentialTimes: {
      dim4: 1000,
      dim3Star: 10,
      dim3Human: 0.00000008,
      dim2: 0.1,
      dim1: 0.001,
    },
  });

  // Hypothesis 5: Momentum Collision Params
  const [momentumParams, setMomentumParams] = useState<MomentumCollisionParams>({
    timeState: 'active',
    momentumIntensity: 550,
    similarityTolerance: 0.85,
    collidingDimensions: '3D_polyhedra',
    adherenceCount: 8,
    structuresRequiredFor4D: 8,
  });

  // Start ambient audio on first interaction
  const handleInteraction = useCallback(() => {
    sound.startAmbient();
  }, []);

  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    sound.setMuted(nextMuted);
  };

  const handleToggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleSelectHypothesis = (id: HypothesisId) => {
    setActiveHypothesis(id);
    const idx = HYPOTHESES.findIndex((h) => h.id === id);
    sound.playDimensionalChime(idx + 1);
  };

  const triggerChime = () => {
    sound.playDimensionalChime(3);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        setIsPaused((prev) => !prev);
      } else if (e.key === 't' || e.key === 'T') {
        setIsTheoryOpen((prev) => !prev);
      } else if (e.key === 'm' || e.key === 'M') {
        handleToggleMute();
      } else if (e.key >= '1' && e.key <= '5') {
        const idx = parseInt(e.key) - 1;
        if (HYPOTHESES[idx]) {
          handleSelectHypothesis(HYPOTHESES[idx].id);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMuted]);

  return (
    <div
      onClick={handleInteraction}
      className={`relative w-screen h-screen overflow-hidden select-none ${
        theme === 'dark' ? 'bg-[#07090e] text-slate-100' : 'bg-[#f8fafc] text-slate-900'
      }`}
    >
      {/* 3-Zone Top Bar Navigation */}
      <TopNav
        activeHypothesis={activeHypothesis}
        onSelectHypothesis={handleSelectHypothesis}
        onOpenTheory={() => setIsTheoryOpen(true)}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      {/* Floating Precision Telemetry HUD */}
      <TelemetryOverlay
        hypothesis={activeHypothesis}
        effectiveDim={telemetry.effectiveDim}
        spaceUnits={telemetry.spaceUnits}
        netForce={telemetry.netForce}
        adherence={telemetry.adherence}
        isPaused={isPaused}
        onTogglePause={() => setIsPaused(!isPaused)}
        onResetView={() => {
          // Triggers canvas resize reset
          window.dispatchEvent(new Event('resize'));
        }}
      />

      {/* 3D Scene Viewport (100% Unobstructed Center) */}
      <div className="absolute inset-0 z-0">
        <ThreeCanvas
          hypothesis={activeHypothesis}
          overlappingParams={overlappingParams}
          constrictiveParams={constrictiveParams}
          everExpansionParams={everExpansionParams}
          bigBangParams={bigBangParams}
          momentumParams={momentumParams}
          isPaused={isPaused}
          theme={theme}
          onTelemetryUpdate={setTelemetry}
        />
      </div>

      {/* Collapsible Unified Bottom Control Dock */}
      <BottomDock
        activeHypothesis={activeHypothesis}
        onSelectHypothesis={handleSelectHypothesis}
        overlappingParams={overlappingParams}
        setOverlappingParams={setOverlappingParams}
        constrictiveParams={constrictiveParams}
        setConstrictiveParams={setConstrictiveParams}
        everExpansionParams={everExpansionParams}
        setEverExpansionParams={setEverExpansionParams}
        bigBangParams={bigBangParams}
        setBigBangParams={setBigBangParams}
        momentumParams={momentumParams}
        setMomentumParams={setMomentumParams}
        onTriggerChime={triggerChime}
      />

      {/* Comprehensive Theoretical Q&A and Hypotheses Modal */}
      <TheoryModal
        isOpen={isTheoryOpen}
        onClose={() => setIsTheoryOpen(false)}
        activeHypothesis={activeHypothesis}
        onSelectHypothesis={handleSelectHypothesis}
      />
    </div>
  );
}
