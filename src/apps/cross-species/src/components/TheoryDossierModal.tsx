import React, { useState } from 'react';
import { MasterCoreData } from '../types/sensorMatrix';
import { BookOpen, Layers, ShieldCheck, Cpu, Zap, X, ChevronRight, Eye } from 'lucide-react';

interface TheoryDossierModalProps {
  isOpen: boolean;
  onClose: () => void;
  masterData: MasterCoreData;
}

export const TheoryDossierModal: React.FC<TheoryDossierModalProps> = ({
  isOpen,
  onClose,
  masterData,
}) => {
  const [activeSection, setActiveSection] = useState<'hypothesis' | 'rsg' | 'hardware' | 'compaction'>('hypothesis');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-3">
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <div>
              <h3 className="text-base font-semibold text-white">
                Bio-Architectonics Research Dossier
              </h3>
              <div className="text-xs font-mono text-slate-400">
                Core ID: {masterData.theoryId} · {masterData.title}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex items-center gap-1 px-6 py-2 border-b border-slate-800 bg-slate-950/60 overflow-x-auto">
          <button
            onClick={() => setActiveSection('hypothesis')}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
              activeSection === 'hypothesis'
                ? 'bg-slate-800 text-cyan-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            01. The 5th Hypothesis Framework
          </button>
          <button
            onClick={() => setActiveSection('rsg')}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
              activeSection === 'rsg'
                ? 'bg-slate-800 text-cyan-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            02. Ruthless Simulator Genome (RSG)
          </button>
          <button
            onClick={() => setActiveSection('compaction')}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
              activeSection === 'compaction'
                ? 'bg-slate-800 text-cyan-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            03. Soap Bubble Compaction vs Data Stuffing
          </button>
          <button
            onClick={() => setActiveSection('hardware')}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
              activeSection === 'hardware'
                ? 'bg-slate-800 text-cyan-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            04. Multi-Species Receptor Hardware
          </button>
        </div>

        {/* Dossier Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-300 text-sm leading-relaxed">
          {activeSection === 'hypothesis' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-base font-semibold text-white mb-1">
                  The Evolutionary Trajectory: Fragmentation to Compaction
                </h4>
                <p className="text-slate-400 text-xs">
                  A foundational analysis comparing biological evolutionary filtering against engineered sensor fusion.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-lg border border-slate-800 bg-slate-950">
                  <div className="text-xs font-mono text-cyan-400 mb-1">STAGE 3D</div>
                  <div className="text-sm font-semibold text-slate-100 mb-1">Fragmentation</div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    The baseline human state. Perception is compressed down to a ~1% bandwidth &quot;watercolor&quot; simulation to prevent metabolic exhaustion. The physical world is experienced through rigid evolutionary filters.
                  </p>
                </div>

                <div className="p-3.5 rounded-lg border border-amber-900/40 bg-slate-950">
                  <div className="text-xs font-mono text-amber-400 mb-1">STAGE 4D</div>
                  <div className="text-sm font-semibold text-slate-100 mb-1">Adherence (Data Stuffing)</div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Raw integration of foreign sensory hardware (feline slit-optics, bee UV, pit viper IR). High cognitive buffer collisions occur when multiple disparate channels are ingested without topological compaction.
                  </p>
                </div>

                <div className="p-3.5 rounded-lg border border-emerald-900/40 bg-slate-950">
                  <div className="text-xs font-mono text-emerald-400 mb-1">STAGE 5D</div>
                  <div className="text-sm font-semibold text-slate-100 mb-1">Compaction</div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Universal Sensor State achieved via Bio-Architectonics Neural Stitching. Geometric cuboid vectors, thermal gradients, and UV vectors merge into a single, intuitive multi-dimensional truth vector.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'rsg' && (
            <div className="space-y-4">
              <h4 className="text-base font-semibold text-white">
                The Ruthless Simulator Genome (RSG) Bottleneck
              </h4>
              <p>
                Natural biological organisms did not evolve to perceive the unfiltered physical reality; they evolved to survive with minimum metabolic energy expenditure. The human brain accounts for ~20% of resting glucose consumption despite representing only ~2% of body mass.
              </p>
              <div className="p-4 rounded-lg border border-slate-800 bg-slate-950 space-y-2">
                <div className="text-xs font-mono text-cyan-300 uppercase">
                  RSG Efficiency Formula &amp; Filtering:
                </div>
                <div className="text-xs font-mono text-slate-300">
                  {'Perceptual Pass-Through ≈ Survival Relevance / Metabolic ATP Cost ≈ 0.012 (1.2% Bandwidth)'}
                </div>
                <p className="text-xs text-slate-400">
                  By discarding 99% of ambient electromagnetic frequencies (UV, IR, magnetic dipoles, polarization vectors), the RSG maintains stable homeostasis at the expense of sensory truth.
                </p>
              </div>
            </div>
          )}

          {activeSection === 'compaction' && (
            <div className="space-y-4">
              <h4 className="text-base font-semibold text-white">
                &quot;Data Stuffing&quot; vs. &quot;Soap Bubble Compaction&quot;
              </h4>
              <p>
                A core architectural insight of Bio-Architectonics: simply attaching more sensors (&quot;Data Stuffing&quot;) does not produce enlightenment or enhanced intelligence. Instead, it leads to sensory cacophony, cognitive collision, and disorientation.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border border-rose-900/40 bg-slate-950">
                  <div className="text-xs font-mono text-rose-400 uppercase mb-1">
                    The Failure of Data Stuffing
                  </div>
                  <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside">
                    <li>Disjointed split-screens and sensory dissonance</li>
                    <li>Cognitive buffer saturation (&gt;85% load)</li>
                    <li>Unfiltered noise competing for attention vectors</li>
                    <li>Paralysis through hyper-informational friction</li>
                  </ul>
                </div>

                <div className="p-4 rounded-lg border border-emerald-900/40 bg-slate-950">
                  <div className="text-xs font-mono text-emerald-400 uppercase mb-1">
                    Soap Bubble Compaction
                  </div>
                  <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside">
                    <li>Topological folding inspired by minimal-surface physics</li>
                    <li>Geometric vectors, thermal glows, and UV lines fuse intuitively</li>
                    <li>Cognitive buffer stabilizes at 24% with 10x spatial clarity</li>
                    <li>Instant perceptual momentum with zero friction</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'hardware' && (
            <div className="space-y-4">
              <h4 className="text-base font-semibold text-white">
                Comparative Sensory Biophysics
              </h4>
              <div className="space-y-3">
                {masterData.sensorMap.map((sensor) => (
                  <div
                    key={sensor.key}
                    className="p-3.5 rounded-lg border border-slate-800 bg-slate-950 flex flex-col gap-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-200">
                        {sensor.species}
                      </span>
                      <span className="text-[11px] font-mono text-cyan-400">
                        {sensor.hardware}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400">
                      <strong className="text-slate-300">Biophysical Basis:</strong> {sensor.biologicalMechanism}
                    </div>
                    <div className="text-xs text-slate-400">
                      <strong className="text-slate-300">Matrix Signature:</strong> &ldquo;{sensor.outputData}&rdquo;
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
          <span className="text-xs font-mono text-slate-500">
            OmniSci Foundry · Theoretical Compendium v1.0.0
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-slate-900 bg-cyan-400 hover:bg-cyan-300 rounded transition-colors"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
};
