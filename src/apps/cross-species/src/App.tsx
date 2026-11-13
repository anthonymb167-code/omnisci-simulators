import React, { useState, useCallback } from 'react';
import { MASTER_CORE_DATA, PRESETS, INITIAL_SENSOR_CHANNELS } from './data/masterCoreData';
import { EvolutionaryStageId, SensorChannel, SpeciesKey, ProbeData, AlphaTestState } from './types/sensorMatrix';
import { Header, ActiveNavTab } from './components/Header';
import { ViewportCanvas } from './components/ViewportCanvas';
import { RSGSensitivityController } from './components/RSGSensitivityController';
import { ComparativeMetricsPanel } from './components/ComparativeMetricsPanel';
import { StageEvolutionController } from './components/StageEvolutionController';
import { SensorChannelPanel } from './components/SensorChannelPanel';
import { ComparativeVisualizer } from './components/ComparativeVisualizer';
import { TargetMimickingLab } from './components/TargetMimickingLab';
import { ExportTelemetryModule } from './components/ExportTelemetryModule';
import { SpectroProbeOverlay } from './components/SpectroProbeOverlay';
import { TheoryDossierModal } from './components/TheoryDossierModal';
import { Check, Sliders, BookOpen } from 'lucide-react';

export default function App() {
  // Operational logic governed by Interactive RSG Sensitivity Slider (default 100%)
  const [rsgSensitivity, setRsgSensitivity] = useState<number>(100);
  const [currentStage, setCurrentStage] = useState<EvolutionaryStageId>('stage3D');
  const [sensors, setSensors] = useState<SensorChannel[]>(INITIAL_SENSOR_CHANNELS);
  const [activeTab, setActiveTab] = useState<ActiveNavTab>('matrix');
  const [isTheoryModalOpen, setIsTheoryModalOpen] = useState(false);
  const [temporalDilation, setTemporalDilation] = useState(0.85);
  const [calibrationNotice, setCalibrationNotice] = useState<string | null>(null);

  // Spectro-spatial probe telemetry
  const [probeData, setProbeData] = useState<ProbeData>({
    x: 480,
    y: 270,
    wavelengthNm: 520,
    infraredTempC: 18.5,
    temporalDeltaMs: 16.6,
    magneticDeclinationDeg: 67.2,
    slitAcutanceRatio: 1.0,
    dominantChannel: 'Human Trichromatic Baseline (400-700nm)',
    targetProximity: 120,
  });

  // Alpha Test State
  const [alphaState, setAlphaState] = useState<AlphaTestState>({
    active: false,
    targetX: 340,
    targetY: 190,
    targetSpeed: 1.6,
    crosshairLocked: false,
    lockTime: 0,
    neuralElasticity: 45,
    stitchingCoherence: 78,
    rsgOverwriteRate: 62,
    completedTrials: 2,
  });

  // Update RSG Sensitivity and sync evolutionary stage
  const handleUpdateRSG = useCallback((val: number) => {
    setRsgSensitivity(val);
    if (val >= 80) {
      setCurrentStage('stage3D');
    } else if (val <= 25) {
      setCurrentStage('stage5D');
    } else {
      setCurrentStage('stage4D');
    }
  }, []);

  // Update stage and sync RSG Sensitivity
  const handleSelectStage = useCallback((stg: EvolutionaryStageId) => {
    setCurrentStage(stg);
    if (stg === 'stage3D') setRsgSensitivity(100);
    else if (stg === 'stage4D') setRsgSensitivity(50);
    else if (stg === 'stage5D') setRsgSensitivity(0);
  }, []);

  // Toggle individual sensor channel
  const handleToggleSensor = useCallback((key: SpeciesKey) => {
    setSensors((prev) =>
      prev.map((s) => (s.key === key ? { ...s, active: !s.active } : s))
    );
  }, []);

  // Update sensor gain
  const handleUpdateGain = useCallback((key: SpeciesKey, gain: number) => {
    setSensors((prev) =>
      prev.map((s) => (s.key === key ? { ...s, gain } : s))
    );
  }, []);

  // Preset selector
  const handleSelectPreset = useCallback((presetId: string) => {
    const preset = PRESETS.find((p) => p.id === presetId);
    if (!preset) return;

    setCurrentStage(preset.stage);
    if (preset.stage === 'stage3D') setRsgSensitivity(100);
    else if (preset.stage === 'stage4D') setRsgSensitivity(50);
    else if (preset.stage === 'stage5D') setRsgSensitivity(0);

    setSensors((prev) =>
      prev.map((s) => {
        const isActive = preset.activeSensors[s.key] ?? false;
        const gainVal = preset.gains[s.key] ?? s.gain;
        return {
          ...s,
          active: isActive,
          gain: gainVal,
        };
      })
    );

    setCalibrationNotice(`Applied Preset: ${preset.name}`);
    setTimeout(() => setCalibrationNotice(null), 3000);
  }, []);

  // Run full system sensor calibration (Total Compaction at 0% RSG)
  const handleRunCalibration = useCallback(() => {
    setRsgSensitivity(0);
    setCurrentStage('stage5D');
    setSensors((prev) =>
      prev.map((s) => ({
        ...s,
        active: true,
        gain: Math.max(75, s.gain),
      }))
    );
    setCalibrationNotice('Full RSG Attenuation Applied: 0% Sensitivity · Total Compaction Active');
    setTimeout(() => setCalibrationNotice(null), 3000);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Bar Contract compliant navigation */}
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onRunCalibration={handleRunCalibration}
      />

      {/* Calibration Notification Banner */}
      {calibrationNotice && (
        <div className="bg-cyan-950/90 border-b border-cyan-800/80 px-6 py-2 flex items-center justify-between text-xs font-mono text-cyan-200">
          <div className="flex items-center gap-2">
            <Check className="w-3.5 h-3.5 text-cyan-400" />
            <span>{calibrationNotice}</span>
          </div>
          <button
            onClick={() => setCalibrationNotice(null)}
            className="text-cyan-400 hover:text-white cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Workspace Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 flex flex-col gap-6">
        {/* Hero Orientation & Research Mandate */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800/80 pb-5">
          <div className="space-y-1.5 max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
              <span className="text-slate-400">OmniSci Bio-Architectonics Engine</span>
              <span>·</span>
              <span>5th Hypothesis Architecture</span>
              <span>·</span>
              <span className="text-slate-500">v1.2.0</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white text-balance">
              Sensor Stitching &amp; RSG Calibration Matrix
            </h1>
            <p className="text-sm text-slate-400 leading-relaxed">
              Operational logic is governed by the Interactive RSG Sensitivity Slider. At 100% RSG, all outputs are restricted to the human baseline 480p soft watercolor simulation. As you scale toward 0%, strip away evolutionary filtering to render raw universal datasets via rigid cross-species metrics without cognitive overload.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => setIsTheoryModalOpen(true)}
              className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
              <span>5th Hypothesis Dossier</span>
            </button>
            <button
              onClick={() => setActiveTab('rsg')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'rsg'
                  ? 'border-cyan-500 bg-cyan-950/50 text-cyan-300'
                  : 'border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>RSG Slider ({rsgSensitivity}%)</span>
            </button>
          </div>
        </div>

        {/* PRIMARY GOVERNING CONTROL: Interactive RSG Sensitivity Slider */}
        <section aria-label="RSG Sensitivity Controller">
          <RSGSensitivityController
            rsgSensitivity={rsgSensitivity}
            onChangeRSG={handleUpdateRSG}
            masterData={MASTER_CORE_DATA}
          />
        </section>

        {/* Primary Viewport Canvas & Real-time Spectro-Spatial Engine */}
        <section aria-label="Visual Sensor Stage">
          <ViewportCanvas
            currentStage={currentStage}
            sensors={sensors}
            alphaState={alphaState}
            onUpdateAlphaState={setAlphaState}
            onProbeUpdate={setProbeData}
            temporalDilation={temporalDilation}
            rsgSensitivity={rsgSensitivity}
          />
        </section>

        {/* Real-time Spectro Probe HUD */}
        <section aria-label="Spectrographic Inspection Probe">
          <SpectroProbeOverlay probe={probeData} />
        </section>

        {/* Comparative Metrics Visualization (The 4 Layers vs 4 Matrix Axes) */}
        <section aria-label="Comparative Metrics Visualization">
          <ComparativeMetricsPanel
            masterData={MASTER_CORE_DATA}
            rsgSensitivity={rsgSensitivity}
          />
        </section>

        {/* Evolutionary Stage Matrix Controller (Stage 3D -> 4D -> 5D) */}
        <section aria-label="Evolutionary Stage Controller">
          <StageEvolutionController
            masterData={MASTER_CORE_DATA}
            currentStage={currentStage}
            onSelectStage={handleSelectStage}
          />
        </section>

        {/* Tab-driven Secondary Modules */}
        {activeTab === 'matrix' && (
          <section aria-label="Sensor Channel Arrays">
            <SensorChannelPanel
              sensors={sensors}
              onToggleSensor={handleToggleSensor}
              onUpdateGain={handleUpdateGain}
              onSelectPreset={handleSelectPreset}
            />
          </section>
        )}

        {activeTab === 'rsg' && (
          <section aria-label="RSG Sensor Calibration Focus">
            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-mono uppercase text-cyan-400">
                  RSG Filter Attenuation &amp; Biological Bandwidth Audit
                </span>
                <span className="text-xs font-mono text-slate-400">
                  Active Mode: {rsgSensitivity === 100 ? 'RSG Max Filter' : rsgSensitivity <= 20 ? 'Total Compaction' : 'Sensor Adherence'}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                As the RSG Sensitivity slider scales from 100% to 0%, the Ruthless Simulator Genome&apos;s evolutionary energy-saving filter is gradually deactivated. Non-human sensory channels (feline slit acutance, bee UV scalar polarization, viper TRPA1 thermography, fly compound eye temporal dilation, and avian magnetoreception) are admitted into perception with rigid geometric vector contours replacing the default human soft bloom.
              </p>
            </div>
          </section>
        )}

        {activeTab === 'visualizer' && (
          <section aria-label="Comparative Visualizer Module">
            <ComparativeVisualizer
              masterData={MASTER_CORE_DATA}
              sensors={sensors}
              currentStage={currentStage}
              onNavigateToExport={() => setActiveTab('export')}
            />
          </section>
        )}

        {activeTab === 'mimicry' && (
          <section aria-label="Target Mimicking Protocol">
            <TargetMimickingLab
              alphaState={alphaState}
              onUpdateAlphaState={setAlphaState}
              temporalDilation={temporalDilation}
              onChangeTemporalDilation={setTemporalDilation}
              masterData={MASTER_CORE_DATA}
            />
          </section>
        )}

        {activeTab === 'export' && (
          <section aria-label="Telemetry Export Module">
            <ExportTelemetryModule
              masterData={MASTER_CORE_DATA}
              sensors={sensors}
              currentStage={currentStage}
              probe={probeData}
              alphaState={alphaState}
              rsgSensitivity={rsgSensitivity}
            />
          </section>
        )}

        {/* Quick Biological Mechanism Summary Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-2">
          <div className="p-3.5 rounded-lg border border-slate-800 bg-slate-900/30">
            <div className="text-[11px] font-mono uppercase text-slate-400 mb-1">
              Apex Slit Optics
            </div>
            <div className="text-xs font-semibold text-slate-200">
              The Cuboid Moon Anchor
            </div>
            <div className="text-[11px] text-slate-400 mt-1 leading-relaxed">
              Vertical stenopaic pupil creates 14.2:1 acutance asymmetry, encasing lunar sphere in a 6-sided coordinate wireframe.
            </div>
          </div>

          <div className="p-3.5 rounded-lg border border-slate-800 bg-slate-900/30">
            <div className="text-[11px] font-mono uppercase text-slate-400 mb-1">
              UV Scalar Polarization
            </div>
            <div className="text-xs font-semibold text-slate-200">
              Apis Nectar Guidance Grid
            </div>
            <div className="text-[11px] text-slate-400 mt-1 leading-relaxed">
              Dorsal rim ommatidia detect Rayleigh atmospheric E-vectors and hidden floral bullseye landing strips.
            </div>
          </div>

          <div className="p-3.5 rounded-lg border border-slate-800 bg-slate-900/30">
            <div className="text-[11px] font-mono uppercase text-slate-400 mb-1">
              TRPA1 Thermoreception
            </div>
            <div className="text-xs font-semibold text-slate-200">
              Crotalinae Infrared Pit Organs
            </div>
            <div className="text-[11px] text-slate-400 mt-1 leading-relaxed">
              Suspended 15μm vascular membrane resolves 0.003°C micro-fluxes, painting 8-12μm radiative heat fields.
            </div>
          </div>

          <div className="p-3.5 rounded-lg border border-slate-800 bg-slate-900/30">
            <div className="text-[11px] font-mono uppercase text-slate-400 mb-1">
              Quantum Radical Pairs
            </div>
            <div className="text-xs font-semibold text-slate-200">
              Avian Geomagnetic Cryptochromes
            </div>
            <div className="text-[11px] text-slate-400 mt-1 leading-relaxed">
              Cry4 flavoproteins sense Earth&apos;s magnetic dip angle as a transparent contextual navigation mesh.
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-950 py-4 px-6 text-xs text-slate-500 font-mono flex flex-col sm:flex-row items-center justify-between gap-3">
        <div>
          <span>OmniSci Foundry · Sensor Stitching &amp; RSG Calibration Matrix</span>
          <span className="mx-2 text-slate-700">·</span>
          <span>5th Hypothesis Architecture Core</span>
        </div>
        <div className="flex items-center gap-4 text-slate-400">
          <span>RSG Sensitivity: {rsgSensitivity}%</span>
          <span>·</span>
          <span>Compression: Soap Bubble Compaction</span>
          <span>·</span>
          <span>v1.2.0</span>
        </div>
      </footer>

      {/* Theory & Research Dossier Modal */}
      <TheoryDossierModal
        isOpen={isTheoryModalOpen}
        onClose={() => setIsTheoryModalOpen(false)}
        masterData={MASTER_CORE_DATA}
      />
    </div>
  );
}
