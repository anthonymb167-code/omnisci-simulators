/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, BookOpen, HelpCircle, Sparkles, Compass, Atom } from 'lucide-react';
import { HYPOTHESES, THEORETICAL_DEEP_DIVES } from '../data/hypothesesData';
import { HypothesisId } from '../types/dimensions';

interface TheoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeHypothesis: HypothesisId;
  onSelectHypothesis: (id: HypothesisId) => void;
}

export const TheoryModal: React.FC<TheoryModalProps> = ({
  isOpen,
  onClose,
  activeHypothesis,
  onSelectHypothesis,
}) => {
  const [activeTab, setActiveTab] = useState<'hypotheses' | 'questions'>('questions');
  const [selectedQuestion, setSelectedQuestion] = useState<string>('q1_1d_origin');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[88vh] flex flex-col bg-[#0b0e17] border border-slate-800 rounded-xl shadow-2xl text-slate-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#07090e]">
          <div className="flex items-center gap-3">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Theoretical Treatise & Physical Answers
              </h2>
              <p className="text-xs text-slate-400">
                Rigorous mathematical formulations and answers to foundational dimensional questions
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-slate-800 bg-[#0b0e17]">
          <button
            onClick={() => setActiveTab('questions')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-medium border-b-2 transition-colors cursor-pointer ${
              activeTab === 'questions'
                ? 'border-cyan-400 text-cyan-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Answers to Your Questions</span>
          </button>
          <button
            onClick={() => setActiveTab('hypotheses')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-medium border-b-2 transition-colors cursor-pointer ${
              activeTab === 'hypotheses'
                ? 'border-cyan-400 text-cyan-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Atom className="w-4 h-4" />
            <span>The 5 Hypotheses Compared</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-slate-300">
          {activeTab === 'questions' && (
            <div className="space-y-6">
              {/* Question Switcher Pills */}
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'q1_1d_origin', label: '1. What Overlaps to Form 1D?' },
                  { id: 'q2_4d_directions', label: '2. What Directions Form 4D?' },
                  { id: 'q3_collision_count', label: '3. How Many Structures Form 4D?' },
                ].map((q) => (
                  <button
                    key={q.id}
                    onClick={() => setSelectedQuestion(q.id)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md cursor-pointer transition-colors ${
                      selectedQuestion === q.id
                        ? 'bg-cyan-500 text-black font-semibold'
                        : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                    }`}
                  >
                    {q.label}
                  </button>
                ))}
              </div>

              {/* Selected Question Details */}
              {THEORETICAL_DEEP_DIVES[selectedQuestion] && (
                <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-5 space-y-4">
                  <div>
                    <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider block mb-1">
                      {THEORETICAL_DEEP_DIVES[selectedQuestion].context}
                    </span>
                    <h3 className="text-sm font-bold text-white">
                      "{THEORETICAL_DEEP_DIVES[selectedQuestion].question}"
                    </h3>
                  </div>

                  <div className="space-y-3 leading-relaxed">
                    <p className="text-slate-300">
                      {THEORETICAL_DEEP_DIVES[selectedQuestion].theoreticalAnswer}
                    </p>

                    <div className="p-3 bg-black/60 border border-slate-800 rounded-md font-mono text-cyan-300 text-[11px]">
                      <span className="text-slate-500 block text-[10px] uppercase mb-1">
                        Mathematical Formalism:
                      </span>
                      <code>{THEORETICAL_DEEP_DIVES[selectedQuestion].mathematicalModel}</code>
                    </div>

                    <div className="p-3 bg-cyan-950/20 border border-cyan-800/40 rounded-md text-[11px] text-cyan-200">
                      <span className="font-semibold text-cyan-400 block mb-0.5">
                        Interactive Simulation Equivalent:
                      </span>
                      {THEORETICAL_DEEP_DIVES[selectedQuestion].simulatorBehavior}
                    </div>
                  </div>
                </div>
              )}

              {/* Additional Context on Constrictive Force and Basal Lock */}
              <div className="bg-slate-900/40 border border-slate-800/80 rounded-lg p-4 space-y-2">
                <h4 className="text-xs font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>The Integrity Force & Basal Point Phenomenon</span>
                </h4>
                <p className="text-slate-400 leading-relaxed">
                  In your 2nd hypothesis, you proposed an extraordinary model for matter and gravity:
                  constriction draws lengths inward until internal contact creates an active equal counter-force.
                  This equilibrium seals the <strong className="text-slate-200">Basal Point</strong>, forming the internal
                  "Integrity Force" (the immutable chemical and nuclear shell structure of atoms). Any additional length
                  or mass accumulated beyond the basal point cannot breach this sealed integrity barrier and instead
                  manifests outward into surrounding space as <strong className="text-slate-200">Gravity</strong>!
                  For 4D matter, a super-constrictive force ("Force Z") crushes inward until an ultra-dense counter-force
                  ("Beta Force") creates a 4D hyper-crystalline state.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'hypotheses' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {HYPOTHESES.map((hypo) => {
                const isCurrent = hypo.id === activeHypothesis;
                return (
                  <div
                    key={hypo.id}
                    className={`p-4 rounded-lg border transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-cyan-950/30 border-cyan-500/50 shadow-lg'
                        : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                    }`}
                    onClick={() => {
                      onSelectHypothesis(hypo.id);
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-cyan-400 font-bold">{hypo.index}.</span>
                      <span className="text-[10px] font-mono text-slate-400 px-2 py-0.5 bg-slate-800 rounded">
                        {hypo.dimensionTransition}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-white mb-1.5">{hypo.title}</h3>
                    <p className="text-xs text-slate-300 leading-relaxed mb-3">{hypo.coreMechanism}</p>
                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                      <span className="text-cyan-400 font-medium">Click to Load Simulation</span>
                      {isCurrent && <span className="font-mono text-emerald-400">● Currently Active</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-slate-800 bg-[#07090e] text-xs">
          <span className="text-slate-400 font-mono">
            Observation Chamber: Dimensional Physics Sandbox
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-black bg-cyan-400 hover:bg-cyan-300 rounded-md transition-colors cursor-pointer"
          >
            Return to 3D Viewport
          </button>
        </div>
      </div>
    </div>
  );
};
