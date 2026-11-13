/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Volume2, VolumeX, BookOpen, Sun, Moon } from 'lucide-react';
import { HypothesisId } from '../types/dimensions';
import { HYPOTHESES } from '../data/hypothesesData';

interface TopNavProps {
  activeHypothesis: HypothesisId;
  onSelectHypothesis: (id: HypothesisId) => void;
  onOpenTheory: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  activeHypothesis,
  onSelectHypothesis,
  onOpenTheory,
  isMuted,
  onToggleMute,
  theme,
  onToggleTheme,
}) => {
  return (
    <header className="relative z-30 flex items-center justify-between gap-8 px-6 py-3.5 border-b border-slate-800/80 bg-[#07090e]/90 text-slate-200">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-3 shrink-0">
        <span className="text-base font-bold tracking-tight text-white whitespace-nowrap">
          Dimensional Structures Lab
        </span>
        <span className="hidden sm:inline-block text-xs font-mono text-cyan-400/80">
          Hypothesis Engine
        </span>
      </div>

      {/* Zone 2: 5 single-line clean navigation links */}
      <nav className="hidden lg:flex items-center gap-6 text-xs font-medium">
        {HYPOTHESES.map((h) => {
          const isActive = h.id === activeHypothesis;
          return (
            <button
              key={h.id}
              onClick={() => onSelectHypothesis(h.id)}
              className={`whitespace-nowrap transition-colors cursor-pointer py-1 ${
                isActive
                  ? 'text-cyan-400 font-semibold border-b-2 border-cyan-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="font-mono text-slate-500 mr-1.5">{h.index}.</span>
              {h.shortName}
            </button>
          );
        })}
      </nav>

      {/* Zone 3: 1 primary action button and utility toggles */}
      <div className="flex items-center gap-2.5 shrink-0">
        <button
          onClick={onToggleMute}
          aria-label={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-slate-800/60 rounded-md transition-colors cursor-pointer"
          title={isMuted ? 'Unmute procedural audio' : 'Mute procedural audio'}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
        </button>

        <button
          onClick={onToggleTheme}
          aria-label="Toggle Theme"
          className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-slate-800/60 rounded-md transition-colors cursor-pointer"
          title="Toggle UI theme"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        <button
          onClick={onOpenTheory}
          className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium text-black bg-cyan-400 hover:bg-cyan-300 rounded-md shadow-sm transition-colors cursor-pointer whitespace-nowrap"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Theory & Answers</span>
        </button>
      </div>
    </header>
  );
};
