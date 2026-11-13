import React, { useState } from 'react';
import { SensorChannel, EvolutionaryStageId, MasterCoreData, ProbeData } from '../types/sensorMatrix';
import { Activity, Download, Check, Sparkles } from 'lucide-react';

interface TelemetryDrawerProps {
  sensors: SensorChannel[];
  currentStage: EvolutionaryStageId;
  masterData: MasterCoreData;
  probe: ProbeData;
}

export const TelemetryDrawer: React.FC<TelemetryDrawerProps> = ({
  sensors,
  currentStage,
  masterData,
  probe,
}) => {
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const stage = masterData.evolutionaryMatrix[currentStage];

  const handleExportTelemetry = () => {
    const reportData = {
      applet: 'OmniSci Foundry: Cross-Species Sensor Matrix',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      evolutionaryStage: {
        id: currentStage,
        name: stage.name,
        cognitiveLoadPercent: stage.cognitiveLoad,
        bandwidthMbps: stage.bandwidthMbps,
        filterMode: stage.filterMode,
      },
      sensorMapStatus: sensors.map((s) => ({
        species: s.species,
        hardware: s.hardware,
        phenomenon: s.phenomenon,
        active: s.active,
        gainPercent: s.gain,
        currentMetric: s.currentMetricValue,
      })),
      probeSample: probe,
      architecturalMethod: masterData.architecturalFix.compressionMethod,
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `omnisci_matrix_telemetry_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  return (
    <div className="w-full rounded-xl border border-slate-800 bg-slate-900/40 p-5 backdrop-blur flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider">
            <Activity className="w-3.5 h-3.5" />
            <span>Biometric & Spectral Stream Monitor</span>
          </div>
          <h2 className="text-base font-semibold text-white mt-0.5">
            Real-Time Multi-Sensor Telemetry
          </h2>
        </div>

        <button
          onClick={handleExportTelemetry}
          className="px-3.5 py-1.5 text-xs font-mono font-medium rounded border border-slate-700 bg-slate-800 text-slate-100 hover:bg-slate-700 transition-colors flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          {downloadSuccess ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>Report Downloaded</span>
            </>
          ) : (
            <>
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>Export Telemetry JSON</span>
            </>
          )}
        </button>
      </div>

      {/* Stream Metrics Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 font-mono">
              <th className="py-2 px-3 font-normal">Sensor Channel</th>
              <th className="py-2 px-3 font-normal">Hardware Interface</th>
              <th className="py-2 px-3 font-normal">Status</th>
              <th className="py-2 px-3 font-normal">Gain</th>
              <th className="py-2 px-3 font-normal">Live Phenomenon Metric</th>
              <th className="py-2 px-3 font-normal">Bandwidth</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono">
            {sensors.map((s) => {
              const estBandwidth = s.active ? (s.gain * 8.4).toFixed(1) : '0.0';
              return (
                <tr key={s.key} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-2.5 px-3 font-sans font-medium text-slate-200">
                    {s.species}
                  </td>
                  <td className="py-2.5 px-3 text-slate-400">{s.hardware}</td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] ${
                        s.active
                          ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/50'
                          : 'bg-slate-900 text-slate-500 border border-slate-800'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          s.active ? 'bg-emerald-400' : 'bg-slate-600'
                        }`}
                      />
                      {s.active ? 'STREAMING' : 'OFFLINE'}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 tabular-nums text-slate-200">
                    {s.active ? `${s.gain}%` : '0%'}
                  </td>
                  <td className="py-2.5 px-3 tabular-nums text-cyan-300">
                    {s.currentMetricValue}
                  </td>
                  <td className="py-2.5 px-3 tabular-nums text-slate-300">
                    {estBandwidth} Mbps
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
