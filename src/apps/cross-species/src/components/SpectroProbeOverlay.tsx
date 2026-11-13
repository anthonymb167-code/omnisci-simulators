import React from 'react';
import { ProbeData } from '../types/sensorMatrix';
import { Crosshair, Radio, Thermometer, Clock, Compass, Activity } from 'lucide-react';

interface SpectroProbeOverlayProps {
  probe: ProbeData;
}

export const SpectroProbeOverlay: React.FC<SpectroProbeOverlayProps> = ({ probe }) => {
  return (
    <div className="w-full rounded-xl border border-slate-800 bg-slate-900/40 p-4 backdrop-blur">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 mb-3">
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider">
          <Crosshair className="w-3.5 h-3.5" />
          <span>Real-Time Spectro-Spatial Probe</span>
        </div>
        <div className="text-xs font-mono text-slate-400">
          X: <span className="text-slate-100 tabular-nums">{probe.x}</span> · Y:{' '}
          <span className="text-slate-100 tabular-nums">{probe.y}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Metric 1: Wavelength */}
        <div className="rounded border border-slate-800/80 bg-slate-950/80 p-2.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
            <span>Wavelength</span>
            <Radio className="w-3 h-3 text-violet-400" />
          </div>
          <div className="text-lg font-bold font-mono text-slate-100 tabular-nums">
            {probe.wavelengthNm ?? '—'}{' '}
            <span className="text-[11px] font-normal text-slate-400">nm</span>
          </div>
          <div className="text-[10px] text-slate-500 font-mono mt-1 truncate">
            {probe.wavelengthNm && probe.wavelengthNm < 400 ? 'UV A-Band' : 'Visible Gamut'}
          </div>
        </div>

        {/* Metric 2: Thermal Temp */}
        <div className="rounded border border-slate-800/80 bg-slate-950/80 p-2.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
            <span>Thermal Flux</span>
            <Thermometer className="w-3 h-3 text-amber-400" />
          </div>
          <div className="text-lg font-bold font-mono text-amber-300 tabular-nums">
            {probe.infraredTempC ?? '—'}{' '}
            <span className="text-[11px] font-normal text-slate-400">°C</span>
          </div>
          <div className="text-[10px] text-slate-500 font-mono mt-1 truncate">
            TRPA1 Pit Channel
          </div>
        </div>

        {/* Metric 3: Temporal Delta */}
        <div className="rounded border border-slate-800/80 bg-slate-950/80 p-2.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
            <span>Temporal Delta</span>
            <Clock className="w-3 h-3 text-cyan-400" />
          </div>
          <div className="text-lg font-bold font-mono text-cyan-300 tabular-nums">
            {probe.temporalDeltaMs ?? '—'}{' '}
            <span className="text-[11px] font-normal text-slate-400">ms</span>
          </div>
          <div className="text-[10px] text-slate-500 font-mono mt-1 truncate">
            Compound Refresh
          </div>
        </div>

        {/* Metric 4: Magnetic Inclination */}
        <div className="rounded border border-slate-800/80 bg-slate-950/80 p-2.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
            <span>Dip Angle</span>
            <Compass className="w-3 h-3 text-teal-400" />
          </div>
          <div className="text-lg font-bold font-mono text-teal-300 tabular-nums">
            {probe.magneticDeclinationDeg ?? '—'}
            <span className="text-[11px] font-normal text-slate-400">°</span>
          </div>
          <div className="text-[10px] text-slate-500 font-mono mt-1 truncate">
            Cry4 Geomagnetic
          </div>
        </div>

        {/* Metric 5: Slit Acutance */}
        <div className="rounded border border-slate-800/80 bg-slate-950/80 p-2.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
            <span>Slit Acutance</span>
            <Activity className="w-3 h-3 text-emerald-400" />
          </div>
          <div className="text-lg font-bold font-mono text-emerald-300 tabular-nums">
            {probe.slitAcutanceRatio ? `${probe.slitAcutanceRatio}:1` : '1.0:1'}
          </div>
          <div className="text-[10px] text-slate-500 font-mono mt-1 truncate">
            Vertical Stenopaic
          </div>
        </div>

        {/* Metric 6: Dominant Region */}
        <div className="rounded border border-slate-800/80 bg-slate-950/80 p-2.5 flex flex-col justify-between">
          <div className="text-[11px] font-mono text-slate-400 mb-1">
            Dominant Field
          </div>
          <div className="text-xs font-semibold text-slate-200 line-clamp-1">
            {probe.dominantChannel}
          </div>
          <div className="text-[10px] font-mono text-cyan-400 mt-1">
            Proximity: {probe.targetProximity}px
          </div>
        </div>
      </div>
    </div>
  );
};
