import React, { useState } from 'react';
import { MasterCoreData } from '../types/sensorMatrix';
import { BarChart3, Eye, Sun, Flame, Sparkles } from 'lucide-react';

interface ComparativeMetricsPanelProps {
  masterData: MasterCoreData;
  rsgSensitivity: number;
}

export const ComparativeMetricsPanel: React.FC<ComparativeMetricsPanelProps> = ({
  masterData,
  rsgSensitivity,
}) => {
  const [selectedLayer, setSelectedLayer] = useState<string | null>(null);
  const { matrixAxes, sensorLayers } = masterData.comparativeMetricsVisualization;

  const layers = [
    {
      key: 'humanBaseline',
      name: 'Human Baseline',
      subtitle: 'Survival Watercolor Baseline',
      icon: <Eye className="w-4 h-4 text-slate-400" />,
      color: 'slate',
      data: sensorLayers.humanBaseline,
      activeAtRSG: rsgSensitivity > 50,
    },
    {
      key: 'felineSlitOptics',
      name: 'Feline Slit-Optics',
      subtitle: 'Vertical Stenopaic Aperture',
      icon: <Eye className="w-4 h-4 text-emerald-400" />,
      color: 'emerald',
      data: sensorLayers.felineSlitOptics,
      activeAtRSG: rsgSensitivity < 90,
    },
    {
      key: 'apisUVGrid',
      name: 'Apis UV Grid',
      subtitle: 'Ultraviolet & Sky Polarization',
      icon: <Sun className="w-4 h-4 text-violet-400" />,
      color: 'violet',
      data: sensorLayers.apisUVGrid,
      activeAtRSG: rsgSensitivity < 90,
    },
    {
      key: 'crotalinaeIR',
      name: 'Crotalinae Infrared Pit',
      subtitle: 'Thermal Radiation Fields',
      icon: <Flame className="w-4 h-4 text-amber-400" />,
      color: 'amber',
      data: sensorLayers.crotalinaeIR,
      activeAtRSG: rsgSensitivity < 90,
    },
  ];

  return (
    <div className="w-full rounded-xl border border-slate-800 bg-slate-900/40 p-5 backdrop-blur flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Comparative Metrics Visualization</span>
            <span className="text-slate-600">·</span>
            <span className="text-slate-400">4-Layer Quad-Axis Sensor Grid</span>
          </div>
          <h2 className="text-base font-semibold text-white mt-1">
            Sensor Layers vs. Universal Matrix Axes
          </h2>
        </div>

        <div className="text-xs font-mono text-slate-400">
          RSG Filter State:{' '}
          <span className="text-cyan-300 font-bold tabular-nums">
            {rsgSensitivity}% Sensitivity
          </span>
        </div>
      </div>

      {/* Layer Selection Pill Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setSelectedLayer(null)}
          className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
            selectedLayer === null
              ? 'bg-slate-800 text-cyan-300 border border-slate-700'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          All 4 Layers (Matrix View)
        </button>
        {layers.map((l) => (
          <button
            key={l.key}
            onClick={() => setSelectedLayer(l.key === selectedLayer ? null : l.key)}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              selectedLayer === l.key
                ? 'bg-slate-800 text-cyan-300 border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {l.icon}
            <span>{l.name}</span>
          </button>
        ))}
      </div>

      {/* Comparative Matrix Table */}
      <div className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-950">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 font-mono bg-slate-900/60">
              <th className="py-3 px-4 font-normal">Sensor Layer</th>
              <th className="py-3 px-4 font-normal">Spatial Depth Precision</th>
              <th className="py-3 px-4 font-normal">Spectral Bandwidth (nm)</th>
              <th className="py-3 px-4 font-normal">Temporal Frame Rate</th>
              <th className="py-3 px-4 font-normal">Geometric Contour Rigidity</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80 font-mono">
            {layers
              .filter((l) => selectedLayer === null || l.key === selectedLayer)
              .map((layer) => {
                const isFilteredOut = rsgSensitivity === 100 && layer.key !== 'humanBaseline';

                return (
                  <tr
                    key={layer.key}
                    className={`transition-colors ${
                      isFilteredOut
                        ? 'opacity-40 bg-slate-950/40'
                        : 'hover:bg-slate-900/50 bg-slate-950/80'
                    }`}
                  >
                    {/* Layer Header */}
                    <td className="py-3.5 px-4 font-sans font-medium text-slate-200">
                      <div className="flex items-center gap-2">
                        {layer.icon}
                        <div>
                          <div className="text-xs font-bold text-slate-100">{layer.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            {layer.subtitle}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Axis 1: Depth */}
                    <td className="py-3.5 px-4 text-slate-300">
                      <div className="font-semibold text-slate-100">{layer.data.depth}</div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        {layer.key === 'humanBaseline' ? 'Planar Saccadic' : 'Stereoscopic Acutance'}
                      </div>
                    </td>

                    {/* Axis 2: Spectrum */}
                    <td className="py-3.5 px-4 text-cyan-300">
                      <div className="font-semibold">{layer.data.spectrum}</div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        {layer.key === 'humanBaseline' ? '320nm Visible Window' : 'Expanded Bio-Gamut'}
                      </div>
                    </td>

                    {/* Axis 3: Tempo */}
                    <td className="py-3.5 px-4 text-teal-300">
                      <div className="font-semibold">{layer.data.tempo}</div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        {layer.key === 'humanBaseline' ? 'Biological 60Hz' : 'Sub-Millisecond Tracking'}
                      </div>
                    </td>

                    {/* Axis 4: Geometry */}
                    <td className="py-3.5 px-4 text-amber-300">
                      <div className="font-semibold">{layer.data.geometry}</div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        {layer.key === 'humanBaseline' ? 'Evolutionary Filtered' : 'Rigid Geometric Lock'}
                      </div>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      {/* Explanatory Footer Note */}
      <div className="text-xs text-slate-400 flex items-center justify-between pt-1">
        <span>
          Rigid geometric contours replace soft bloom as RSG sensitivity approaches 0% (Total Compaction).
        </span>
        <span className="font-mono text-cyan-400">
          True Perspective Vector Matrix v1.2.0
        </span>
      </div>
    </div>
  );
};
