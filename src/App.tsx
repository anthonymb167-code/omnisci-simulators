import React, { useState } from 'react';
import CrossSpeciesApp from './apps/cross-species/src/App';
import DimensionalApp from './apps/dimensional-structures/src/App';
import EcosystemFooter from './components/EcosystemFooter';

const TAB_GUIDES = {
  sensors: {
    title: 'How to Use: 1. Sensor Perception Lab',
    what: 'A visual simulator comparing normal human eyesight against animal senses—including cat night vision, bee UV patterns, snake heat detection, and bird magnetic fields.',
    start: 'Drag the "Interactive RSG Sensitivity Slider" near the top from 100% down toward 0%, or click preset buttons like "Cuboid Moon" and "Thermal Ambush" to watch the image transform.',
  },
  dimensions: {
    title: 'How to Use: 2. Dimensional Physics Lab',
    what: 'An interactive 3D and 4D geometry sandbox showing how gravity, collisions, and expansion build shapes from flat 2D planes up to 4D hypercubes.',
    start: 'Tap the four tabs at the bottom ("Overlapping", "Constrictive Force", "Ever Expansion", "Dimensional Collapse") and drag the sliders below them to test each physics model live.',
  },
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'sensors' | 'dimensions'>('sensors');
  const [showGuide, setShowGuide] = useState(true);

  const guide = TAB_GUIDES[activeTab];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <nav className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur border-b border-slate-800 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="font-bold text-lg tracking-wide text-cyan-400">
            OmniSci Simulators
          </span>
          <button
            onClick={() => setShowGuide(!showGuide)}
            className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-800 text-cyan-300 border border-cyan-500/30 hover:bg-slate-700 transition"
          >
            {showGuide ? 'Hide Guide' : '? How to Use'}
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
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

      {showGuide && (
        <div className="bg-cyan-950/40 border-b border-cyan-500/30 px-4 py-3 text-sm">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="font-semibold text-cyan-300">{guide.title}</div>
              <p className="text-slate-300">
                <span className="font-medium text-white">What it is:</span> {guide.what}
              </p>
              <p className="text-slate-300">
                <span className="font-medium text-cyan-400">Where to start:</span> {guide.start}
              </p>
            </div>
            <button
              onClick={() => setShowGuide(false)}
              className="self-start sm:self-center shrink-0 px-3 py-1.5 rounded-lg bg-slate-900 text-slate-300 hover:text-white border border-slate-700 text-xs"
            >
              Got it ✕
            </button>
          </div>
        </div>
      )}

      <main className="flex-1">
        {activeTab === 'sensors' && <CrossSpeciesApp />}
        {activeTab === 'dimensions' && <DimensionalApp />}
      </main>

      <EcosystemFooter currentApp="OmniSci Simulators" />
    </div>
  );
}
