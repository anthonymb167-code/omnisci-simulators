import React, { useState } from 'react';
import CrossSpeciesApp from './apps/cross-species/src/App';
import DimensionalApp from './apps/dimensional-structures/src/App';

export default function App() {
  const [activeTab, setActiveTab] = useState<'sensors' | 'dimensions'>('sensors');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <nav className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur border-b border-slate-800 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="font-bold text-lg tracking-wide text-cyan-400">
          OmniSci Simulators
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('sensors')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
              activeTab === 'sensors'
                ? 'bg-cyan-500 text-slate-950'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            1. Sensor Perception Lab
          </button>
          <button
            onClick={() => setActiveTab('dimensions')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
              activeTab === 'dimensions'
                ? 'bg-cyan-500 text-slate-950'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            2. Dimensional Physics Lab
          </button>
        </div>
      </nav>

      <main className="flex-1">
        {activeTab === 'sensors' && <CrossSpeciesApp />}
        {activeTab === 'dimensions' && <DimensionalApp />}
      </main>
    </div>
  );
}
