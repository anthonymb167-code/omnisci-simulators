import React from 'react';
import { SensorChannel, SpeciesKey } from '../types/sensorMatrix';
import { Sliders, Check, Power, ChevronRight, Eye, Sun, Flame, Zap, Compass } from 'lucide-react';

interface SensorChannelPanelProps {
  sensors: SensorChannel[];
  onToggleSensor: (key: SpeciesKey) => void;
  onUpdateGain: (key: SpeciesKey, gain: number) => void;
  onSelectPreset: (presetId: string) => void;
}

export const SensorChannelPanel: React.FC<SensorChannelPanelProps> = ({
  sensors,
  onToggleSensor,
  onUpdateGain,
  onSelectPreset,
}) => {
  const getSpeciesIcon = (key: SpeciesKey) => {
    switch (key) {
      case 'feline':
        return <Eye className="w-4 h-4 text-emerald-400" />;
      case 'apis':
        return <Sun className="w-4 h-4 text-violet-400" />;
      case 'crotalinae':
        return <Flame className="w-4 h-4 text-amber-400" />;
      case 'diptera':
        return <Zap className="w-4 h-4 text-cyan-400" />;
      case 'aves':
        return <Compass className="w-4 h-4 text-teal-400" />;
    }
  };

  return (
    <div className="w-full rounded-xl border border-slate-800 bg-slate-900/40 p-5 backdrop-blur flex flex-col gap-5">
      {/* Panel Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider">
            <Sliders className="w-3.5 h-3.5" />
            <span>Biological Sensor Mapping Matrix</span>
          </div>
          <h2 className="text-base font-semibold text-white mt-1">
            Cross-Species Sensory Array Stitching
          </h2>
        </div>

        {/* Quick Presets */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs text-slate-400 font-mono mr-1">Presets:</span>
          <button
            onClick={() => onSelectPreset('stage5d_compaction')}
            className="px-2.5 py-1 text-xs rounded border border-slate-700 bg-slate-800/80 text-cyan-300 hover:bg-slate-700 transition-colors font-mono cursor-pointer"
          >
            Universal Stitch
          </button>
          <button
            onClick={() => onSelectPreset('feline_cuboid_moon')}
            className="px-2.5 py-1 text-xs rounded border border-slate-700 bg-slate-800/80 text-emerald-300 hover:bg-slate-700 transition-colors font-mono cursor-pointer"
          >
            Cuboid Moon
          </button>
          <button
            onClick={() => onSelectPreset('pollinator_navigation')}
            className="px-2.5 py-1 text-xs rounded border border-slate-700 bg-slate-800/80 text-violet-300 hover:bg-slate-700 transition-colors font-mono cursor-pointer"
          >
            Pollinator UV
          </button>
          <button
            onClick={() => onSelectPreset('predator_thermal_night')}
            className="px-2.5 py-1 text-xs rounded border border-slate-700 bg-slate-800/80 text-amber-300 hover:bg-slate-700 transition-colors font-mono cursor-pointer"
          >
            Thermal Ambush
          </button>
        </div>
      </div>

      {/* Sensor Channel Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {sensors.map((sensor) => {
          const isActive = sensor.active;

          return (
            <div
              key={sensor.key}
              className={`rounded-lg border p-4 transition-all flex flex-col justify-between ${
                isActive
                  ? 'border-slate-700 bg-slate-900/90 shadow-md shadow-slate-950/40'
                  : 'border-slate-800/80 bg-slate-950/50 opacity-60'
              }`}
            >
              <div>
                {/* Species Header & Power Toggle */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getSpeciesIcon(sensor.key)}
                    <div>
                      <div className="text-xs font-mono text-slate-400">
                        {sensor.species}
                      </div>
                      <div className="text-sm font-semibold text-slate-100">
                        {sensor.commonName}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onToggleSensor(sensor.key)}
                    className={`p-1.5 rounded transition-colors cursor-pointer border ${
                      isActive
                        ? 'bg-cyan-950/40 border-cyan-500/50 text-cyan-400 hover:bg-cyan-900/40'
                        : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
                    }`}
                    title={isActive ? 'Deactivate Sensor Channel' : 'Activate Sensor Channel'}
                  >
                    <Power className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Hardware & Phenomenon */}
                <div className="space-y-1 my-2.5 text-xs">
                  <div className="flex items-baseline justify-between text-slate-300">
                    <span className="text-slate-400 font-mono">Hardware:</span>
                    <span className="font-medium text-slate-200 text-right">{sensor.hardware}</span>
                  </div>
                  <div className="flex items-baseline justify-between text-slate-300">
                    <span className="text-slate-400 font-mono">Phenomenon:</span>
                    <span className="font-medium text-cyan-300 text-right">{sensor.phenomenon}</span>
                  </div>
                </div>

                {/* Output Data Quote (Core Data verbatim) */}
                <div className="p-2.5 rounded bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed my-2">
                  <span className="text-[10px] font-mono uppercase text-slate-400 block mb-0.5">
                    Sensor Output Data:
                  </span>
                  &ldquo;{sensor.outputData}&rdquo;
                </div>

                {/* Biological Mechanism note */}
                <div className="text-[11px] text-slate-400 mb-3 leading-relaxed">
                  <span className="text-slate-500 font-mono">Mechanism:</span> {sensor.biologicalMechanism}
                </div>
              </div>

              {/* Live Metric & Gain Scrubber */}
              <div className="border-t border-slate-800/80 pt-3">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-slate-400 font-mono">{sensor.metricLabel}:</span>
                  <span className="font-mono font-semibold text-slate-100 tabular-nums">
                    {sensor.currentMetricValue}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span>Gain / Signal Amplification</span>
                    <span className="tabular-nums text-cyan-300">{sensor.gain}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={sensor.gain}
                    disabled={!isActive}
                    onChange={(e) => onUpdateGain(sensor.key, Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 disabled:opacity-40"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
