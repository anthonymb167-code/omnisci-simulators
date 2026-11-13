import React from 'react';
import { Eye, Target, Layers, Smartphone, Sliders } from 'lucide-react';

export type ActiveNavTab = 'matrix' | 'rsg' | 'visualizer' | 'mimicry' | 'export';

interface HeaderProps {
  activeTab: ActiveNavTab;
  onSelectTab: (tab: ActiveNavTab) => void;
  onRunCalibration: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, onSelectTab, onRunCalibration }) => {
  return (
    <header className="flex items-center justify-between gap-8 px-6 py-3.5 border-b border-slate-800 bg-slate-950/90 backdrop-blur sticky top-0 z-40">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-3 shrink-0">
        <a 
          href="#home" 
          onClick={(e) => { e.preventDefault(); onSelectTab('matrix'); }}
          className="text-lg font-bold tracking-tight text-white hover:text-cyan-300 transition-colors whitespace-nowrap shrink-0"
        >
          OmniSci Foundry
        </a>
        <span className="hidden sm:inline-block text-xs font-mono text-slate-500 uppercase tracking-wider">
          Sensor Stitching &amp; RSG Calibration Matrix
        </span>
      </div>

      {/* Zone 2: 4–5 concise single-line text navigation links */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
        <button
          onClick={() => onSelectTab('matrix')}
          className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            activeTab === 'matrix' ? 'text-cyan-400 font-semibold' : 'hover:text-slate-200'
          }`}
        >
          <Eye className="w-4 h-4" />
          <span>Sensor Matrix</span>
        </button>

        <button
          onClick={() => onSelectTab('rsg')}
          className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            activeTab === 'rsg' ? 'text-cyan-400 font-semibold' : 'hover:text-slate-200'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>RSG Calibration</span>
        </button>

        <button
          onClick={() => onSelectTab('visualizer')}
          className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            activeTab === 'visualizer' ? 'text-cyan-400 font-semibold' : 'hover:text-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Comparative Visualizer</span>
        </button>

        <button
          onClick={() => onSelectTab('mimicry')}
          className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            activeTab === 'mimicry' ? 'text-cyan-400 font-semibold' : 'hover:text-slate-200'
          }`}
        >
          <Target className="w-4 h-4" />
          <span>Target Mimicking</span>
        </button>

        <button
          onClick={() => onSelectTab('export')}
          className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            activeTab === 'export' ? 'text-cyan-400 font-semibold' : 'hover:text-slate-200'
          }`}
        >
          <Smartphone className="w-4 h-4" />
          <span>Export Telemetry</span>
        </button>
      </nav>

      {/* Zone 3: 1 primary action */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onRunCalibration}
          className="px-3.5 py-1.5 text-xs font-medium text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded transition-colors whitespace-nowrap shrink-0 font-mono tracking-tight shadow-sm hover:shadow-cyan-500/20"
        >
          Calibrate Sensors
        </button>
      </div>
    </header>
  );
};
