import React, { useRef, useEffect, useState } from 'react';
import { MasterCoreData, SensorChannel, EvolutionaryStageId } from '../types/sensorMatrix';
import { Layers, Sliders, Eye, Zap, Sparkles, Columns2, Maximize2, RefreshCw } from 'lucide-react';

interface ComparativeVisualizerProps {
  masterData: MasterCoreData;
  sensors: SensorChannel[];
  currentStage: EvolutionaryStageId;
  onNavigateToExport: () => void;
}

export const ComparativeVisualizer: React.FC<ComparativeVisualizerProps> = ({
  masterData,
  sensors,
  currentStage,
  onNavigateToExport,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [splitPosition, setSplitPosition] = useState(50); // 0 to 100%
  const [activeViewMode, setActiveViewMode] = useState<'split' | 'blend' | 'sideBySide'>('split');
  const [blendAlpha, setBlendAlpha] = useState(80); // 0 = 100% human, 100 = 100% integrated
  const animFrameRef = useRef<number | null>(null);
  const timeRef = useRef<number>(0);

  const visualizerConfig = masterData.comparativeVisualizer;
  const humanDim = visualizerConfig.dimensions.humanLayer;
  const integratedDim = visualizerConfig.dimensions.integratedLayer;

  // Real-time canvas rendering for Comparative Visualizer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      timeRef.current += 0.025;
      const t = timeRef.current;
      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      if (activeViewMode === 'split') {
        const splitX = (splitPosition / 100) * w;

        // 1. Draw Left Side: Human Layer (Soft Bloom, Amorphous/Circular, 60Hz)
        ctx.save();
        ctx.beginPath();
        ctx.rect(0, 0, splitX, h);
        ctx.clip();
        drawHumanLayer(ctx, w, h, t);
        ctx.restore();

        // 2. Draw Right Side: Integrated Layer (Hard Edge, Six-Sided Cuboid Matrix, 1000Hz)
        ctx.save();
        ctx.beginPath();
        ctx.rect(splitX, 0, w - splitX, h);
        ctx.clip();
        drawIntegratedLayer(ctx, w, h, t);
        ctx.restore();

        // 3. Draw Split Line Divider
        ctx.strokeStyle = '#06b6d4';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(splitX, 0);
        ctx.lineTo(splitX, h);
        ctx.stroke();

        // Split handle icon
        ctx.fillStyle = '#06b6d4';
        ctx.beginPath();
        ctx.arc(splitX, h / 2, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.arc(splitX, h / 2, 11, 0, Math.PI * 2);
        ctx.fill();

        // Left & Right in-canvas label tags
        drawCanvasTag(ctx, 20, 24, 'HUMAN LAYER · Soft Bloom (60Hz)', '#94a3b8');
        drawCanvasTag(ctx, w - 320, 24, 'INTEGRATED LAYER · Six-Sided Cuboid Matrix (1000Hz)', '#38bdf8');
      } else if (activeViewMode === 'blend') {
        // Blended Overlay: Human base with integrated layer layered on top with alpha
        drawHumanLayer(ctx, w, h, t);
        ctx.save();
        ctx.globalAlpha = blendAlpha / 100;
        drawIntegratedLayer(ctx, w, h, t);
        ctx.restore();

        drawCanvasTag(ctx, 20, 24, `MULTI-LAYER BLEND · ${blendAlpha}% Integrated Matrix`, '#38bdf8');
      } else {
        // Side-by-side dual tile
        const halfW = w / 2;
        ctx.save();
        ctx.beginPath();
        ctx.rect(0, 0, halfW, h);
        ctx.clip();
        ctx.scale(0.5, 0.5);
        ctx.translate(0, h * 0.5);
        drawHumanLayer(ctx, w, h, t);
        ctx.restore();

        ctx.save();
        ctx.beginPath();
        ctx.rect(halfW, 0, halfW, h);
        ctx.clip();
        ctx.scale(0.5, 0.5);
        ctx.translate(w, h * 0.5);
        drawIntegratedLayer(ctx, w, h, t);
        ctx.restore();

        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(halfW, 0);
        ctx.lineTo(halfW, h);
        ctx.stroke();

        drawCanvasTag(ctx, 16, 20, 'Human Layer (Soft Bloom)', '#94a3b8');
        drawCanvasTag(ctx, halfW + 16, 20, 'Integrated Cuboid Layer', '#38bdf8');
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [splitPosition, activeViewMode, blendAlpha]);

  const drawCanvasTag = (ctx: CanvasRenderingContext2D, x: number, y: number, text: string, color: string) => {
    ctx.save();
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.fillRect(x - 6, y - 14, text.length * 7.5, 20);
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.strokeRect(x - 6, y - 14, text.length * 7.5, 20);
    ctx.fillStyle = color;
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.fillText(text, x, y);
    ctx.restore();
  };

  // Human Layer: Soft Bloom, Amorphous/Circular, 60Hz
  const drawHumanLayer = (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => {
    // Soft blurred twilight background
    const bg = ctx.createLinearGradient(0, 0, 0, h);
    bg.addColorStop(0, '#0c1322');
    bg.addColorStop(0.7, '#1e293b');
    bg.addColorStop(1, '#0f172a');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    // Human Moon: Soft, circular, amorphous bloom with chromatic fuzziness
    const moonX = w * 0.72;
    const moonY = h * 0.3;
    const moonRadius = 40;

    // Diffuse fuzzy bloom ring (amorphous circular)
    const bloom = ctx.createRadialGradient(moonX, moonY, 10, moonX, moonY, 80);
    bloom.addColorStop(0, 'rgba(255, 255, 255, 0.85)');
    bloom.addColorStop(0.3, 'rgba(226, 232, 240, 0.4)');
    bloom.addColorStop(0.7, 'rgba(148, 163, 184, 0.15)');
    bloom.addColorStop(1, 'rgba(15, 23, 42, 0)');
    ctx.fillStyle = bloom;
    ctx.beginPath();
    ctx.arc(moonX, moonY, 80, 0, Math.PI * 2);
    ctx.fill();

    // Core moon
    ctx.fillStyle = '#cbd5e1';
    ctx.beginPath();
    ctx.arc(moonX, moonY, moonRadius, 0, Math.PI * 2);
    ctx.fill();

    // Amorphous soft terrain
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.arc(w * 0.3, h * 0.9, 220, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(w * 0.75, h * 0.95, 260, 0, Math.PI * 2);
    ctx.fill();

    // Moving target in human view: blurred circular dot
    const targetX = w * 0.35 + Math.sin(t * 0.8) * 80;
    const targetY = h * 0.38 + Math.cos(t * 0.6) * 45;
    ctx.fillStyle = 'rgba(241, 245, 249, 0.6)';
    ctx.beginPath();
    ctx.arc(targetX, targetY, 8, 0, Math.PI * 2);
    ctx.fill();

    // Scanline & 60Hz blur wash
    ctx.fillStyle = 'rgba(15, 23, 42, 0.15)';
    ctx.fillRect(0, 0, w, h);
  };

  // Integrated Layer: Hard Edge, Six-Sided Cuboid Matrix, 1000Hz
  const drawIntegratedLayer = (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => {
    // Deep crystal obsidian background
    const bg = ctx.createLinearGradient(0, 0, 0, h);
    bg.addColorStop(0, '#040711');
    bg.addColorStop(0.6, '#06101e');
    bg.addColorStop(1, '#08172c');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    // Cryptochrome magnetic inclination field grid
    ctx.strokeStyle = 'rgba(20, 184, 166, 0.4)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 7; i++) {
      const lx = (i / 7) * w;
      ctx.beginPath();
      ctx.moveTo(lx, 0);
      ctx.bezierCurveTo(lx - 30, h * 0.4, lx + 40, h * 0.7, lx + 10, h);
      ctx.stroke();
    }

    // THE CUBOID MOON: Six-Sided Cuboid Matrix (Verbatim Core Data)
    const moonX = w * 0.72;
    const moonY = h * 0.3;
    const moonRadius = 40;

    // Hard sphere
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.arc(moonX, moonY, moonRadius, 0, Math.PI * 2);
    ctx.fill();

    // 3D Six-Sided Cuboid Wireframe Frame
    const cuboidW = moonRadius * 2.4;
    const cuboidH = moonRadius * 2.4;
    const rot = t * 0.25;
    const d = 46;

    const p1 = { x: moonX - cuboidW * 0.5, y: moonY - cuboidH * 0.5 };
    const p2 = { x: moonX + cuboidW * 0.5, y: moonY - cuboidH * 0.5 };
    const p3 = { x: moonX + cuboidW * 0.5, y: moonY + cuboidH * 0.5 };
    const p4 = { x: moonX - cuboidW * 0.5, y: moonY + cuboidH * 0.5 };

    const ox = Math.cos(rot) * d * 0.5;
    const oy = Math.sin(rot) * d * 0.35 - d * 0.25;

    const p5 = { x: p1.x + ox, y: p1.y + oy };
    const p6 = { x: p2.x + ox, y: p2.y + oy };
    const p7 = { x: p3.x + ox, y: p3.y + oy };
    const p8 = { x: p4.x + ox, y: p4.y + oy };

    // Hard Edge lines
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2;

    // Front box
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y);
    ctx.lineTo(p3.x, p3.y); ctx.lineTo(p4.x, p4.y);
    ctx.closePath();
    ctx.stroke();

    // Rear box (dashed)
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(p5.x, p5.y); ctx.lineTo(p6.x, p6.y);
    ctx.lineTo(p7.x, p7.y); ctx.lineTo(p8.x, p8.y);
    ctx.closePath();
    ctx.stroke();
    ctx.setLineDash([]);

    // Connecting pillars
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y); ctx.lineTo(p5.x, p5.y);
    ctx.moveTo(p2.x, p2.y); ctx.lineTo(p6.x, p6.y);
    ctx.moveTo(p3.x, p3.y); ctx.lineTo(p7.x, p7.y);
    ctx.moveTo(p4.x, p4.y); ctx.lineTo(p8.x, p8.y);
    ctx.stroke();

    // Corner anchor nodes
    [p1, p2, p3, p4, p5, p6, p7, p8].forEach((pt) => {
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 3, 0, Math.PI * 2);
      ctx.fill();
    });

    // UV Honey Bee Floral Guides in foreground
    const flowerBedX = w * 0.3;
    const flowerBedY = h * 0.85;
    ctx.fillStyle = '#a855f7';
    ctx.beginPath();
    ctx.arc(flowerBedX, flowerBedY, 26, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#f3e8ff';
    ctx.lineWidth = 1.5;
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 4) {
      ctx.beginPath();
      ctx.moveTo(flowerBedX + Math.cos(a) * 45, flowerBedY + Math.sin(a) * 45);
      ctx.lineTo(flowerBedX, flowerBedY);
      ctx.stroke();
    }

    // 1000Hz Kinetic Target with Strobe History & Thermal Pit Glow
    const targetX = w * 0.35 + Math.sin(t * 0.8) * 80;
    const targetY = h * 0.38 + Math.cos(t * 0.6) * 45;

    // Viper Thermal Glow (8-12μm)
    const heat = ctx.createRadialGradient(targetX, targetY, 2, targetX, targetY, 45);
    heat.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
    heat.addColorStop(0.3, 'rgba(245, 158, 11, 0.8)');
    heat.addColorStop(0.7, 'rgba(239, 68, 68, 0.4)');
    heat.addColorStop(1, 'rgba(15, 23, 42, 0)');
    ctx.fillStyle = heat;
    ctx.beginPath();
    ctx.arc(targetX, targetY, 45, 0, Math.PI * 2);
    ctx.fill();

    // Diptera 1000Hz strobe frame ticks
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 1.2;
    for (let st = 1; st <= 6; st++) {
      const sx = targetX - Math.sin(t * 0.8 - st * 0.08) * 18;
      const sy = targetY - Math.cos(t * 0.6 - st * 0.08) * 12;
      ctx.fillStyle = `rgba(6, 182, 212, ${0.8 - st * 0.12})`;
      ctx.beginPath();
      ctx.arc(sx, sy, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    // Hard Edge Crosshair Box
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(targetX - 10, targetY - 10, 20, 20);
    ctx.fillStyle = '#38bdf8';
    ctx.font = '9px "JetBrains Mono", monospace';
    ctx.fillText('1000Hz LOCK · ±0.04m', targetX + 14, targetY + 3);
  };

  return (
    <div className="w-full rounded-xl border border-slate-800 bg-slate-900/40 p-5 backdrop-blur flex flex-col gap-5">
      {/* Module Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5" />
            <span>Comparative Visualizer Engine · Multi-Layer Sensory Overlay</span>
          </div>
          <h2 className="text-base font-semibold text-white mt-1">
            Comparative Matrix: Human Layer vs Integrated Six-Sided Cuboid Matrix
          </h2>
        </div>

        {/* View Mode Tabs */}
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-lg bg-slate-950 p-0.5 border border-slate-800">
            <button
              onClick={() => setActiveViewMode('split')}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                activeViewMode === 'split'
                  ? 'bg-slate-800 text-cyan-300 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Split Curtain
            </button>
            <button
              onClick={() => setActiveViewMode('blend')}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                activeViewMode === 'blend'
                  ? 'bg-slate-800 text-cyan-300 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Layer Blend
            </button>
            <button
              onClick={() => setActiveViewMode('sideBySide')}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                activeViewMode === 'sideBySide'
                  ? 'bg-slate-800 text-cyan-300 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Side-by-Side
            </button>
          </div>

          <button
            onClick={onNavigateToExport}
            className="px-3 py-1 text-xs font-mono rounded border border-slate-700 bg-slate-800 text-cyan-300 hover:bg-slate-700 transition-colors"
          >
            Export Telemetry →
          </button>
        </div>
      </div>

      {/* Canvas Viewport with interactive split scrubber */}
      <div className="relative aspect-[16/9] w-full rounded-lg border border-slate-800 bg-slate-950 overflow-hidden shadow-inner">
        <canvas
          ref={canvasRef}
          width={960}
          height={540}
          className="w-full h-full block"
        />

        {/* Split Curtain Position Scrubber Overlay */}
        {activeViewMode === 'split' && (
          <div className="absolute bottom-3 left-4 right-4 bg-slate-950/80 backdrop-blur px-4 py-2 rounded-lg border border-slate-800 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-300 shrink-0">
              <Columns2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Split Curtain:</span>
              <span className="text-cyan-300 font-bold tabular-nums">{splitPosition}% Integrated</span>
            </div>
            <input
              type="range"
              min="5"
              max="95"
              value={splitPosition}
              onChange={(e) => setSplitPosition(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <div className="text-[11px] font-mono text-slate-400 shrink-0">
              Drag to compare
            </div>
          </div>
        )}

        {/* Blend Alpha Scrubber */}
        {activeViewMode === 'blend' && (
          <div className="absolute bottom-3 left-4 right-4 bg-slate-950/80 backdrop-blur px-4 py-2 rounded-lg border border-slate-800 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-300 shrink-0">
              <Sliders className="w-3.5 h-3.5 text-cyan-400" />
              <span>Layer Blend Opacity:</span>
              <span className="text-cyan-300 font-bold tabular-nums">{blendAlpha}% Integrated Matrix</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={blendAlpha}
              onChange={(e) => setBlendAlpha(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
          </div>
        )}
      </div>

      {/* Comparative Matrix Metrics Grid (Required by masterCoreData) */}
      <div>
        <div className="text-xs font-mono uppercase text-slate-400 mb-2.5">
          Comparative Matrix Metrics · Systematic Channel Contrast
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Metric 1: Spatial Depth Precision */}
          <div className="rounded-lg border border-slate-800 bg-slate-950 p-3.5 flex flex-col justify-between">
            <div className="text-[11px] font-mono text-slate-400 mb-1">
              Spatial Depth Precision
            </div>
            <div className="space-y-1.5 my-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Human Baseline:</span>
                <span className="font-mono text-slate-300">±3.20m (Planar)</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-cyan-400 font-medium">Integrated Layer:</span>
                <span className="font-mono font-bold text-emerald-400">±0.04m (Slit Lock)</span>
              </div>
            </div>
            <div className="text-[10px] text-slate-500 font-mono mt-1 pt-2 border-t border-slate-900">
              80x stereoscopic depth resolution enhancement
            </div>
          </div>

          {/* Metric 2: Spectral Bandwidth (nm) */}
          <div className="rounded-lg border border-slate-800 bg-slate-950 p-3.5 flex flex-col justify-between">
            <div className="text-[11px] font-mono text-slate-400 mb-1">
              Spectral Bandwidth (nm)
            </div>
            <div className="space-y-1.5 my-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Human Baseline:</span>
                <span className="font-mono text-slate-300">400 - 700 nm</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-cyan-400 font-medium">Integrated Layer:</span>
                <span className="font-mono font-bold text-violet-400">300 - 12,000 nm</span>
              </div>
            </div>
            <div className="text-[10px] text-slate-500 font-mono mt-1 pt-2 border-t border-slate-900">
              UV (300nm) + Visible + Thermal IR (12μm)
            </div>
          </div>

          {/* Metric 3: Temporal Frame Resolution */}
          <div className="rounded-lg border border-slate-800 bg-slate-950 p-3.5 flex flex-col justify-between">
            <div className="text-[11px] font-mono text-slate-400 mb-1">
              Temporal Frame Resolution
            </div>
            <div className="space-y-1.5 my-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Human Baseline:</span>
                <span className="font-mono text-slate-300">60 Hz (16.6 ms)</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-cyan-400 font-medium">Integrated Layer:</span>
                <span className="font-mono font-bold text-cyan-400">1000 Hz (1.04 ms)</span>
              </div>
            </div>
            <div className="text-[10px] text-slate-500 font-mono mt-1 pt-2 border-t border-slate-900">
              Diptera compound eye temporal dilation
            </div>
          </div>

          {/* Metric 4: Geometric Vector Contours */}
          <div className="rounded-lg border border-slate-800 bg-slate-950 p-3.5 flex flex-col justify-between">
            <div className="text-[11px] font-mono text-slate-400 mb-1">
              Geometric Vector Contours
            </div>
            <div className="space-y-1.5 my-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Human Baseline:</span>
                <span className="font-mono text-slate-300">Amorphous / Soft</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-cyan-400 font-medium">Integrated Layer:</span>
                <span className="font-mono font-bold text-teal-400">Six-Sided Cuboid</span>
              </div>
            </div>
            <div className="text-[10px] text-slate-500 font-mono mt-1 pt-2 border-t border-slate-900">
              The Cuboid Moon coordinate ring vectors
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
