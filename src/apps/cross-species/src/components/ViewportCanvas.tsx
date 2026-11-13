import React, { useRef, useEffect, useState, useCallback } from 'react';
import { SensorChannel, EvolutionaryStageId, ProbeData, AlphaTestState } from '../types/sensorMatrix';
import { Maximize2, Split, Crosshair, Pause, Play, Sparkles } from 'lucide-react';

interface ViewportCanvasProps {
  currentStage: EvolutionaryStageId;
  sensors: SensorChannel[];
  alphaState: AlphaTestState;
  onUpdateAlphaState: (updater: (prev: AlphaTestState) => AlphaTestState) => void;
  onProbeUpdate: (data: ProbeData) => void;
  temporalDilation: number; // 0.1 to 1.0 (1 = real-time, 0.1 = 1000fps slow-mo)
  rsgSensitivity: number; // 0 to 100%
}

export const ViewportCanvas: React.FC<ViewportCanvasProps> = ({
  currentStage,
  sensors,
  alphaState,
  onUpdateAlphaState,
  onProbeUpdate,
  temporalDilation,
  rsgSensitivity = 100,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [displayMode, setDisplayMode] = useState<'unified' | 'split' | 'target'>('unified');
  const [showHud, setShowHud] = useState(true);
  const mousePosRef = useRef<{ x: number; y: number }>({ x: 400, y: 250 });
  const animFrameRef = useRef<number | null>(null);
  const timeRef = useRef<number>(0);

  // Sensor state map helper governed by RSG sensitivity
  const isSensorActive = (key: string) => {
    if (rsgSensitivity === 100 || currentStage === 'stage3D') return false; // Human baseline only
    const found = sensors.find((s) => s.key === key);
    return found ? found.active && found.gain > 0 : false;
  };

  const getSensorGain = (key: string) => {
    if (rsgSensitivity === 100 || currentStage === 'stage3D') return 0;
    const found = sensors.find((s) => s.key === key);
    if (!found || !found.active) return 0;
    // As RSG sensitivity scales toward 0%, evolutionary filtering strips away, increasing foreign sensor pass-through
    const passThrough = Math.max(0, Math.min(1, (100 - rsgSensitivity) / 100));
    return (found.gain / 100) * passThrough;
  };

  // Trajectory history for Fly compound eye temporal dilation
  const targetHistoryRef = useRef<Array<{ x: number; y: number; time: number }>>([]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = Math.max(0, Math.min(canvas.width, (e.clientX - rect.left) * (canvas.width / rect.width)));
    const y = Math.max(0, Math.min(canvas.height, (e.clientY - rect.top) * (canvas.height / rect.height)));
    mousePosRef.current = { x, y };

    // Calculate probe data based on cursor location
    const moonCenterX = canvas.width * 0.72;
    const moonCenterY = canvas.height * 0.28;
    const distToMoon = Math.hypot(x - moonCenterX, y - moonCenterY);
    const distToTarget = Math.hypot(x - alphaState.targetX, y - alphaState.targetY);

    const felineGain = getSensorGain('feline');
    const apisGain = getSensorGain('apis');
    const crotalinaeGain = getSensorGain('crotalinae');
    const dipteraGain = getSensorGain('diptera');
    const avesGain = getSensorGain('aves');

    let wavelength: number | null = 550; // human green baseline
    let tempC: number | null = 18.5; // ambient
    let temporalDelta: number | null = 16.6; // 60hz human baseline
    let magneticInc: number | null = 67.2;
    let slitAcutance: number | null = 1.0;
    let dominant = 'Human Trichromacy (400-700nm)';

    if (distToTarget < 60) {
      // Near kinetic target
      tempC = 37.8;
      dominant = 'Biokinetic Target Core';
      wavelength = apisGain > 0.3 ? 365 : 520;
    } else if (distToMoon < 90) {
      dominant = felineGain > 0.4 ? 'Cuboid Moon Geometry' : 'Lunar Celestial Body';
      slitAcutance = felineGain > 0 ? 14.2 : 1.0;
      wavelength = 490;
    } else if (y > canvas.height * 0.65) {
      // Ground flora
      tempC = 21.2;
      dominant = apisGain > 0.4 ? 'Floral UV Landing Vector' : 'Botanical Groundcover';
      wavelength = apisGain > 0.4 ? 340 : 540;
    } else {
      // Sky
      dominant = avesGain > 0.4 ? 'Geomagnetic Dipole Flux' : 'Atmospheric Horizon';
      magneticInc = 62.0 + (x / canvas.width) * 10;
    }

    if (crotalinaeGain > 0 && distToTarget < 80) {
      tempC = 36.5 + (1 - distToTarget / 80) * 3.5;
    }
    if (dipteraGain > 0) {
      temporalDelta = 1.04 * (1 / (temporalDilation || 1));
    }

    onProbeUpdate({
      x: Math.round(x),
      y: Math.round(y),
      wavelengthNm: wavelength,
      infraredTempC: Math.round(tempC * 10) / 10,
      temporalDeltaMs: Math.round(temporalDelta * 100) / 100,
      magneticDeclinationDeg: Math.round(magneticInc * 10) / 10,
      slitAcutanceRatio: slitAcutance,
      dominantChannel: dominant,
      targetProximity: Math.round(distToTarget),
    });

    // Check target mimicking lock
    if (alphaState.active) {
      const isLocked = distToTarget < 45;
      onUpdateAlphaState((prev) => {
        const newLockTime = isLocked ? prev.lockTime + 0.05 : Math.max(0, prev.lockTime - 0.03);
        const newElasticity = Math.min(100, Math.round(newLockTime * 18));
        const newCoherence = Math.min(100, Math.round(newLockTime * 22));
        const newOverwrite = Math.min(100, Math.round(prev.completedTrials * 25 + newLockTime * 8));

        return {
          ...prev,
          crosshairLocked: isLocked,
          lockTime: newLockTime,
          neuralElasticity: newElasticity,
          stitchingCoherence: newCoherence,
          rsgOverwriteRate: newOverwrite,
        };
      });
    }
  }, [canvasRef, currentStage, sensors, alphaState, temporalDilation, onProbeUpdate, onUpdateAlphaState]);

  // Main rendering loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let localTarget = {
      x: alphaState.targetX || 300,
      y: alphaState.targetY || 180,
      vx: 1.8,
      vy: 1.2,
      baseSpeed: alphaState.targetSpeed || 1.6,
    };

    const render = () => {
      timeRef.current += 0.02 * temporalDilation;
      const t = timeRef.current;
      const w = canvas.width;
      const h = canvas.height;

      // Update target movement
      if (isPlaying) {
        localTarget.x += Math.sin(t * 0.8) * localTarget.baseSpeed * 2.2 + Math.cos(t * 0.3) * 1.5;
        localTarget.y += Math.cos(t * 0.6) * localTarget.baseSpeed * 1.8 + Math.sin(t * 0.4) * 1.0;

        // Keep within bounds
        if (localTarget.x < 80) localTarget.x = w - 100;
        if (localTarget.x > w - 80) localTarget.x = 100;
        if (localTarget.y < 60) localTarget.y = 80;
        if (localTarget.y > h * 0.75) localTarget.y = h * 0.7;

        // Push to history for fly compound eye trails
        targetHistoryRef.current.push({ x: localTarget.x, y: localTarget.y, time: t });
        if (targetHistoryRef.current.length > 24) {
          targetHistoryRef.current.shift();
        }
      }

      // Gains
      const felineGain = getSensorGain('feline');
      const apisGain = getSensorGain('apis');
      const crotalinaeGain = getSensorGain('crotalinae');
      const dipteraGain = getSensorGain('diptera');
      const avesGain = getSensorGain('aves');

      // Clear Canvas
      ctx.clearRect(0, 0, w, h);

      if (displayMode === 'split') {
        // Render 4 split-screen quadrants:
        // Top-Left: Human 1% Baseline
        // Top-Right: Feline Slit Aperture (Cuboid Moon)
        // Bottom-Left: Bee UV Grid
        // Bottom-Right: Viper Infrared Thermal
        renderQuadrant(ctx, 0, 0, w / 2, h / 2, 'human', t, localTarget);
        renderQuadrant(ctx, w / 2, 0, w / 2, h / 2, 'feline', t, localTarget);
        renderQuadrant(ctx, 0, h / 2, w / 2, h / 2, 'apis', t, localTarget);
        renderQuadrant(ctx, w / 2, h / 2, w / 2, h / 2, 'crotalinae', t, localTarget);

        // Grid dividers
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(w / 2, 0);
        ctx.lineTo(w / 2, h);
        ctx.moveTo(0, h / 2);
        ctx.lineTo(w, h / 2);
        ctx.stroke();
      } else {
        // UNIFIED OR TARGET MODE
        renderCompleteScene(ctx, w, h, t, localTarget, {
          stage: currentStage,
          felineGain,
          apisGain,
          crotalinaeGain,
          dipteraGain,
          avesGain,
          rsgSensitivity,
          focusTarget: displayMode === 'target',
        });
      }

      // Render Alpha Test lock overlay if active
      if (alphaState.active && showHud) {
        renderAlphaLockHUD(ctx, localTarget, alphaState.crosshairLocked, alphaState.lockTime);
      }

      // HUD crosshairs & telemetry overlay
      if (showHud) {
        renderScreenHUD(ctx, w, h, currentStage, mousePosRef.current);
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [currentStage, sensors, isPlaying, displayMode, showHud, temporalDilation, alphaState.active]);

  // Helper: Render quadrant for split mode
  const renderQuadrant = (
    ctx: CanvasRenderingContext2D,
    ox: number,
    oy: number,
    qw: number,
    qh: number,
    mode: 'human' | 'feline' | 'apis' | 'crotalinae',
    t: number,
    target: { x: number; y: number }
  ) => {
    ctx.save();
    ctx.beginPath();
    ctx.rect(ox, oy, qw, qh);
    ctx.clip();
    ctx.translate(ox, oy);

    const scaleX = qw / 960;
    const scaleY = qh / 540;
    ctx.scale(scaleX, scaleY);

    const scaledTarget = { x: target.x, y: target.y };

    if (mode === 'human') {
      renderCompleteScene(ctx, 960, 540, t, scaledTarget, {
        stage: 'stage3D',
        felineGain: 0,
        apisGain: 0,
        crotalinaeGain: 0,
        dipteraGain: 0,
        avesGain: 0,
        rsgSensitivity: 100,
        focusTarget: false,
      });
      // Label
      drawQuadrantLabel(ctx, '1% Human Baseline (480p Watercolor)', '#94a3b8');
    } else if (mode === 'feline') {
      renderCompleteScene(ctx, 960, 540, t, scaledTarget, {
        stage: 'stage4D',
        felineGain: 1.0,
        apisGain: 0,
        crotalinaeGain: 0,
        dipteraGain: 0,
        avesGain: 0,
        rsgSensitivity: 0,
        focusTarget: false,
      });
      drawQuadrantLabel(ctx, 'Feline Slit-Optics · Cuboid Moon Vectors', '#10b981');
    } else if (mode === 'apis') {
      renderCompleteScene(ctx, 960, 540, t, scaledTarget, {
        stage: 'stage4D',
        felineGain: 0,
        apisGain: 1.0,
        crotalinaeGain: 0,
        dipteraGain: 0,
        avesGain: 0,
        rsgSensitivity: 0,
        focusTarget: false,
      });
      drawQuadrantLabel(ctx, 'Apis (Bee) UV Vision Grid (300-400nm)', '#c084fc');
    } else if (mode === 'crotalinae') {
      renderCompleteScene(ctx, 960, 540, t, scaledTarget, {
        stage: 'stage4D',
        felineGain: 0,
        apisGain: 0,
        crotalinaeGain: 1.0,
        dipteraGain: 0,
        avesGain: 0,
        rsgSensitivity: 0,
        focusTarget: false,
      });
      drawQuadrantLabel(ctx, 'Crotalinae Infrared Pit Organs (TRPA1)', '#fbbf24');
    }

    ctx.restore();
  };

  const drawQuadrantLabel = (ctx: CanvasRenderingContext2D, label: string, color: string) => {
    ctx.save();
    ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
    ctx.fillRect(12, 12, 340, 24);
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.strokeRect(12, 12, 340, 24);
    ctx.fillStyle = color;
    ctx.font = '11px "JetBrains Mono", monospace';
    ctx.fillText(label, 20, 28);
    ctx.restore();
  };

  // Helper: Render complete biome scene with layer passes
  const renderCompleteScene = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    t: number,
    target: { x: number; y: number },
    config: {
      stage: EvolutionaryStageId;
      felineGain: number;
      apisGain: number;
      crotalinaeGain: number;
      dipteraGain: number;
      avesGain: number;
      rsgSensitivity: number;
      focusTarget: boolean;
    }
  ) => {
    const isStage3D = config.stage === 'stage3D' || config.rsgSensitivity === 100;
    const isStage4D = config.stage === 'stage4D' && config.rsgSensitivity < 100 && config.rsgSensitivity > 25;
    const isStage5D = config.stage === 'stage5D' || config.rsgSensitivity <= 25;

    // 1. SKY / HORIZON BACKGROUND
    let skyGradient = ctx.createLinearGradient(0, 0, 0, h);
    if (isStage3D) {
      // Human 480p watercolor dusk: soft dull navy/charcoal
      skyGradient.addColorStop(0, '#0c1322');
      skyGradient.addColorStop(0.6, '#18243b');
      skyGradient.addColorStop(1, '#0f172a');
    } else if (isStage5D) {
      // Compaction: deep high-clarity quantum obsidian with cosmic depth
      skyGradient.addColorStop(0, '#040711');
      skyGradient.addColorStop(0.5, '#070f1e');
      skyGradient.addColorStop(1, '#061324');
    } else {
      // Stage 4D raw adherence: slightly noisy raw indigo
      skyGradient.addColorStop(0, '#090d1a');
      skyGradient.addColorStop(0.6, '#141d33');
      skyGradient.addColorStop(1, '#0d1527');
    }
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, w, h);

    // 2. AVIAN GEOMAGNETIC CRYPTOCHROME FLUX GRID (Channel 5)
    if (config.avesGain > 0) {
      ctx.save();
      ctx.globalAlpha = config.avesGain * (isStage5D ? 0.75 : 0.5);
      ctx.strokeStyle = '#14b8a6';
      ctx.lineWidth = isStage5D ? 1.2 : 1;
      const numLines = 9;
      for (let i = 0; i < numLines; i++) {
        const offset = (i / numLines) * w;
        ctx.beginPath();
        // Curving magnetic dipoles
        ctx.moveTo(offset, 0);
        ctx.bezierCurveTo(
          offset - 40 + Math.sin(t * 0.5 + i) * 15,
          h * 0.35,
          offset + 60 + Math.cos(t * 0.5 + i) * 20,
          h * 0.7,
          offset + 20,
          h
        );
        ctx.stroke();

        // Magnetic inclination angle vectors
        if (i % 2 === 0) {
          const px = offset - 20;
          const py = h * 0.45;
          ctx.beginPath();
          ctx.arc(px, py, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = '#2dd4bf';
          ctx.fill();

          if (isStage4D || isStage5D) {
            ctx.fillStyle = 'rgba(20, 184, 166, 0.6)';
            ctx.font = '8px "JetBrains Mono", monospace';
            ctx.fillText(`67.2°I · B=${(0.48 + i * 0.02).toFixed(2)}G`, px + 6, py - 4);
          }
        }
      }
      ctx.restore();
    }

    // 3. APIS (BEE) SKY POLARIZATION E-VECTORS (Channel 2)
    if (config.apisGain > 0) {
      ctx.save();
      ctx.globalAlpha = config.apisGain * 0.45;
      ctx.strokeStyle = '#c084fc';
      ctx.lineWidth = 1;
      // Polarized ray grid radiating from solar/celestial angle
      const sunX = w * 0.15;
      const sunY = h * 0.18;
      for (let ang = 0; ang < Math.PI * 2; ang += Math.PI / 10) {
        ctx.beginPath();
        ctx.moveTo(sunX + Math.cos(ang) * 40, sunY + Math.sin(ang) * 40);
        ctx.lineTo(sunX + Math.cos(ang) * 260, sunY + Math.sin(ang) * 260);
        ctx.setLineDash([4, 6]);
        ctx.stroke();
      }
      ctx.setLineDash([]);
      ctx.restore();
    }

    // 4. CELESTIAL BODY: THE MOON + FELINE SLIT-APERTURE CUBOID VECTORS (Signature Output)
    const moonX = w * 0.72;
    const moonY = h * 0.28;
    const moonRadius = 42;

    // Draw spherical moon
    ctx.save();
    const moonGrad = ctx.createRadialGradient(moonX - 10, moonY - 10, 4, moonX, moonY, moonRadius);
    moonGrad.addColorStop(0, '#f8fafc');
    moonGrad.addColorStop(0.7, '#cbd5e1');
    moonGrad.addColorStop(1, '#64748b');
    ctx.fillStyle = moonGrad;
    ctx.beginPath();
    ctx.arc(moonX, moonY, moonRadius, 0, Math.PI * 2);
    ctx.fill();

    // Subtle lunar craters
    ctx.fillStyle = 'rgba(71, 85, 105, 0.4)';
    ctx.beginPath();
    ctx.arc(moonX - 12, moonY - 8, 8, 0, Math.PI * 2);
    ctx.arc(moonX + 14, moonY + 6, 12, 0, Math.PI * 2);
    ctx.arc(moonX + 4, moonY + 16, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // --- FELINE APEX PREDATOR HARDWARE: THE CUBOID MOON ---
    // "Spherical body anchored inside a six-sided cuboid ring with hard geometric vectors."
    if (config.felineGain > 0) {
      ctx.save();
      const felineAlpha = config.felineGain;
      ctx.globalAlpha = felineAlpha;

      // Vertical slit astigmatic acutance: hard vertical lines, soft horizontal
      const cuboidW = moonRadius * 2.3;
      const cuboidH = moonRadius * 2.3;
      const rotAngle = t * 0.2; // Slow 3D rotation of the cuboid frame

      // 3D wireframe box math projecting the 6-sided cuboid around the spherical moon
      const d = 48; // depth
      const cx = moonX;
      const cy = moonY;

      // Front 4 vertices
      const p1 = { x: cx - cuboidW * 0.5, y: cy - cuboidH * 0.5 };
      const p2 = { x: cx + cuboidW * 0.5, y: cy - cuboidH * 0.5 };
      const p3 = { x: cx + cuboidW * 0.5, y: cy + cuboidH * 0.5 };
      const p4 = { x: cx - cuboidW * 0.5, y: cy + cuboidH * 0.5 };

      // Back 4 vertices projected with 3D rotation offset
      const ox = Math.cos(rotAngle) * d * 0.5;
      const oy = Math.sin(rotAngle) * d * 0.35 - d * 0.25;

      const p5 = { x: p1.x + ox, y: p1.y + oy };
      const p6 = { x: p2.x + ox, y: p2.y + oy };
      const p7 = { x: p3.x + ox, y: p3.y + oy };
      const p8 = { x: p4.x + ox, y: p4.y + oy };

      // If Stage 5D (Compaction): glowing refined neon vector lines that hug the sphere seamlessly
      // If Stage 4D (Raw Adherence): stark, slightly abrasive geometric vectors
      ctx.strokeStyle = isStage5D ? '#10b981' : '#34d399';
      ctx.lineWidth = isStage5D ? 1.6 : 2;

      // Draw rear edges (dashed for 3D depth)
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(p5.x, p5.y);
      ctx.lineTo(p6.x, p6.y);
      ctx.lineTo(p7.x, p7.y);
      ctx.lineTo(p8.x, p8.y);
      ctx.closePath();
      ctx.stroke();

      // Connecting depth pillars
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y); ctx.lineTo(p5.x, p5.y);
      ctx.moveTo(p2.x, p2.y); ctx.lineTo(p6.x, p6.y);
      ctx.moveTo(p3.x, p3.y); ctx.lineTo(p7.x, p7.y);
      ctx.moveTo(p4.x, p4.y); ctx.lineTo(p8.x, p8.y);
      ctx.stroke();

      // Draw front face (solid)
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.lineTo(p3.x, p3.y);
      ctx.lineTo(p4.x, p4.y);
      ctx.closePath();
      ctx.stroke();

      // Vector anchor lines pointing from cuboid vertices to moon center
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.45)';
      ctx.lineWidth = 1;
      [p1, p2, p3, p4, p5, p6, p7, p8].forEach((pt, idx) => {
        ctx.beginPath();
        ctx.moveTo(pt.x, pt.y);
        ctx.lineTo(cx, cy);
        ctx.stroke();

        // Corner node coordinates
        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 2.5, 0, Math.PI * 2);
        ctx.fill();

        if (idx === 0 || idx === 2) {
          ctx.fillStyle = 'rgba(52, 211, 153, 0.9)';
          ctx.font = '9px "JetBrains Mono", monospace';
          ctx.fillText(`V${idx} [θ=${(rotAngle * 57.3).toFixed(0)}°]`, pt.x - 28, pt.y - 8);
        }
      });

      // Stenopaic slit pupil vertical acutance beam
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.35)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx, 0);
      ctx.lineTo(cx, h);
      ctx.stroke();

      ctx.restore();
    }

    // 5. LANDSCAPE ARCHITECTURE & TERRAIN (Demonstrates Acutance Asymmetry & Structural Vectors)
    // Mountain ridge
    ctx.save();
    ctx.fillStyle = isStage3D ? '#111927' : '#0c1322';
    ctx.beginPath();
    ctx.moveTo(0, h * 0.58);
    ctx.lineTo(w * 0.2, h * 0.52);
    ctx.lineTo(w * 0.45, h * 0.57);
    ctx.lineTo(w * 0.7, h * 0.49);
    ctx.lineTo(w, h * 0.54);
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    ctx.fill();

    // Foreground Architectural Columns (Hard geometric surfaces)
    const columns = [
      { x: w * 0.12, y: h * 0.42, width: 28, height: h * 0.45 },
      { x: w * 0.28, y: h * 0.46, width: 34, height: h * 0.42 },
      { x: w * 0.52, y: h * 0.48, width: 24, height: h * 0.38 },
      { x: w * 0.84, y: h * 0.44, width: 30, height: h * 0.44 },
    ];

    columns.forEach((col, idx) => {
      // Base column
      ctx.fillStyle = isStage3D ? '#1e293b' : '#111827';
      ctx.fillRect(col.x, col.y, col.width, col.height);

      // Feline slit acutance creates hard vertical edge highlights
      if (config.felineGain > 0) {
        ctx.strokeStyle = `rgba(16, 185, 129, ${config.felineGain * 0.8})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(col.x, col.y);
        ctx.lineTo(col.x, col.y + col.height);
        ctx.moveTo(col.x + col.width, col.y);
        ctx.lineTo(col.x + col.width, col.y + col.height);
        ctx.stroke();
      }

      // Crotalinae IR: columns radiate daytime residual heat (thermodynamic glow)
      if (config.crotalinaeGain > 0) {
        const colHeatGrad = ctx.createLinearGradient(col.x, col.y + col.height, col.x, col.y);
        colHeatGrad.addColorStop(0, `rgba(245, 158, 11, ${config.crotalinaeGain * 0.6})`);
        colHeatGrad.addColorStop(0.5, `rgba(239, 68, 68, ${config.crotalinaeGain * 0.35})`);
        colHeatGrad.addColorStop(1, 'rgba(30, 41, 59, 0)');
        ctx.fillStyle = colHeatGrad;
        ctx.fillRect(col.x, col.y, col.width, col.height);

        // Heat shimmer lines above columns
        ctx.strokeStyle = `rgba(251, 191, 36, ${config.crotalinaeGain * 0.4})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let dy = 0; dy < 3; dy++) {
          const sy = col.y - 10 - dy * 8;
          ctx.moveTo(col.x, sy + Math.sin(t * 3 + idx + dy) * 3);
          ctx.lineTo(col.x + col.width, sy + Math.cos(t * 3 + idx + dy) * 3);
        }
        ctx.stroke();
      }
    });

    // 6. BOTANICAL FLORA (APIS UV LANDING VECTORS)
    // Flowers in foreground
    const flowerBeds = [
      { x: w * 0.08, y: h * 0.85, r: 16 },
      { x: w * 0.22, y: h * 0.88, r: 20 },
      { x: w * 0.38, y: h * 0.82, r: 18 },
      { x: w * 0.65, y: h * 0.86, r: 22 },
      { x: w * 0.88, y: h * 0.84, r: 17 },
    ];

    flowerBeds.forEach((flower) => {
      // Petals
      ctx.fillStyle = isStage3D ? '#334155' : '#1e293b';
      for (let p = 0; p < 6; p++) {
        const ang = (p / 6) * Math.PI * 2;
        ctx.beginPath();
        ctx.arc(flower.x + Math.cos(ang) * flower.r, flower.y + Math.sin(ang) * flower.r, flower.r * 0.6, 0, Math.PI * 2);
        ctx.fill();
      }

      // Floral Center
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(flower.x, flower.y, flower.r * 0.45, 0, Math.PI * 2);
      ctx.fill();

      // Apis UV Sensor Array: "Hidden structural landing vectors and scalar light polarization"
      if (config.apisGain > 0) {
        ctx.save();
        ctx.globalAlpha = config.apisGain;

        // Fluorescent UV bullseye in center (340nm reflectance)
        const uvGrad = ctx.createRadialGradient(flower.x, flower.y, 2, flower.x, flower.y, flower.r * 1.5);
        uvGrad.addColorStop(0, '#c084fc');
        uvGrad.addColorStop(0.4, '#a855f7');
        uvGrad.addColorStop(0.8, '#7e22ce');
        uvGrad.addColorStop(1, 'rgba(126, 34, 206, 0)');
        ctx.fillStyle = uvGrad;
        ctx.beginPath();
        ctx.arc(flower.x, flower.y, flower.r * 1.5, 0, Math.PI * 2);
        ctx.fill();

        // Radiating landing guide vectors with chevron arrows toward center
        ctx.strokeStyle = '#e9d5ff';
        ctx.lineWidth = 1.2;
        for (let p = 0; p < 6; p++) {
          const ang = (p / 6) * Math.PI * 2;
          const outerX = flower.x + Math.cos(ang) * (flower.r * 2);
          const outerY = flower.y + Math.sin(ang) * (flower.r * 2);

          ctx.beginPath();
          ctx.moveTo(outerX, outerY);
          ctx.lineTo(flower.x, flower.y);
          ctx.stroke();

          // Inward pointing arrowheads
          const midX = flower.x + Math.cos(ang) * (flower.r * 1.1);
          const midY = flower.y + Math.sin(ang) * (flower.r * 1.1);
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(midX, midY, 1.8, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
    });

    // 7. DIPTERA (FLY) TEMPORAL TRAJECTORY TRAILS (Channel 4)
    if (config.dipteraGain > 0) {
      ctx.save();
      ctx.globalAlpha = config.dipteraGain * 0.8;
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 1.5;

      // Draw multi-frame temporal strobe history
      targetHistoryRef.current.forEach((hist, i) => {
        const alpha = (i / targetHistoryRef.current.length) * 0.7;
        ctx.fillStyle = `rgba(6, 182, 212, ${alpha})`;
        ctx.beginPath();
        ctx.arc(hist.x, hist.y, 3 * (i / targetHistoryRef.current.length), 0, Math.PI * 2);
        ctx.fill();
      });

      // Projected future velocity vector
      if (targetHistoryRef.current.length > 2) {
        const last = targetHistoryRef.current[targetHistoryRef.current.length - 1];
        const prev = targetHistoryRef.current[targetHistoryRef.current.length - 3];
        const dx = (last.x - prev.x) * 4;
        const dy = (last.y - prev.y) * 4;

        ctx.strokeStyle = '#22d3ee';
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(last.x, last.y);
        ctx.lineTo(last.x + dx, last.y + dy);
        ctx.stroke();
        ctx.setLineDash([]);

        // Future target position ring
        ctx.strokeStyle = '#67e8f9';
        ctx.strokeRect(last.x + dx - 6, last.y + dy - 6, 12, 12);
      }

      // Hexagonal compound ommatidia raster grid (subtle)
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.08)';
      ctx.lineWidth = 0.5;
      const hexR = 14;
      for (let hx = 0; hx < w; hx += hexR * 2.8) {
        for (let hy = 0; hy < h; hy += hexR * 2.4) {
          ctx.beginPath();
          ctx.arc(hx, hy, hexR * 0.7, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
      ctx.restore();
    }

    // 8. CROTALINAE (PIT VIPER) THERMAL INFRARED RADIATIVE GLOW ON TARGET (Channel 3)
    if (config.crotalinaeGain > 0) {
      ctx.save();
      const irGain = config.crotalinaeGain;
      // 8-12 μm thermal radiation aura around the kinetic target
      const targetHeat = ctx.createRadialGradient(target.x, target.y, 4, target.x, target.y, 70);
      targetHeat.addColorStop(0, `rgba(255, 255, 255, ${irGain * 0.95})`); // 37.8°C white hot core
      targetHeat.addColorStop(0.2, `rgba(245, 158, 11, ${irGain * 0.85})`); // 36°C amber
      targetHeat.addColorStop(0.5, `rgba(239, 68, 68, ${irGain * 0.5})`); // 31°C red
      targetHeat.addColorStop(0.8, `rgba(147, 51, 234, ${irGain * 0.25})`); // 24°C violet
      targetHeat.addColorStop(1, 'rgba(15, 23, 42, 0)');
      ctx.fillStyle = targetHeat;
      ctx.beginPath();
      ctx.arc(target.x, target.y, 70, 0, Math.PI * 2);
      ctx.fill();

      // Thermal contour lines (isotherms)
      ctx.strokeStyle = `rgba(251, 191, 36, ${irGain * 0.7})`;
      ctx.lineWidth = 1;
      [20, 36, 52].forEach((r, idx) => {
        ctx.beginPath();
        ctx.arc(target.x, target.y, r, 0, Math.PI * 2);
        ctx.stroke();
        if (idx === 0) {
          ctx.fillStyle = '#fbbf24';
          ctx.font = '8px "JetBrains Mono", monospace';
          ctx.fillText('+37.4°C TRPA1', target.x + r + 4, target.y + 3);
        }
      });
      ctx.restore();
    }

    // 9. THE BIOMIMETIC KINETIC TARGET / MOTH ENTITY
    ctx.save();
    // Core body
    ctx.fillStyle = isStage3D ? '#94a3b8' : '#e2e8f0';
    ctx.beginPath();
    ctx.arc(target.x, target.y, 6, 0, Math.PI * 2);
    ctx.fill();

    // Fluttering wings
    const wingFlap = Math.sin(t * 22) * 12;
    ctx.fillStyle = isStage3D ? 'rgba(148, 163, 184, 0.4)' : 'rgba(226, 232, 240, 0.6)';
    ctx.beginPath();
    ctx.ellipse(target.x - 10, target.y, 14, Math.abs(wingFlap), 0.3, 0, Math.PI * 2);
    ctx.ellipse(target.x + 10, target.y, 14, Math.abs(wingFlap), -0.3, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    // 10. POST-PROCESSING FILTER (STAGE 3D WATERCOLOR / STAGE 4D NOISE / STAGE 5D COMPACTION)
    if (isStage3D) {
      // Human 1% baseline: 480p watercolor degradation simulation
      // Chromatic blur wash
      ctx.save();
      ctx.fillStyle = 'rgba(15, 23, 42, 0.18)';
      ctx.fillRect(0, 0, w, h);

      // 480p scanline simulation
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.25)';
      ctx.lineWidth = 1;
      for (let sy = 0; sy < h; sy += 4) {
        ctx.beginPath();
        ctx.moveTo(0, sy);
        ctx.lineTo(w, sy);
        ctx.stroke();
      }
      ctx.restore();
    } else if (isStage4D) {
      // Stage 4D: Raw Adherence / Data Stuffing!
      // Shows sensory collision artifacts & uncompressed buffer jitter
      ctx.save();
      // Random chromatic noise glitch lines
      if (Math.random() > 0.6) {
        const noiseY = Math.random() * h;
        ctx.fillStyle = 'rgba(239, 68, 68, 0.15)';
        ctx.fillRect(0, noiseY, w, 3);
        ctx.fillStyle = 'rgba(6, 182, 212, 0.15)';
        ctx.fillRect(0, noiseY + 4, w, 2);
      }
      ctx.restore();
    } else if (isStage5D) {
      // Stage 5D: Soap Bubble Compaction / Bio-Architectonics Neural Stitching!
      // Smooth hyper-dimensional integration: subtle quantum coherence bloom
      ctx.save();
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.12)';
      ctx.lineWidth = 1;
      // Compaction meridian rings holding all geometric layers together
      ctx.beginPath();
      ctx.ellipse(w * 0.5, h * 0.5, w * 0.42, h * 0.38, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
  };

  // Helper: Alpha Test Protocol Lock HUD
  const renderAlphaLockHUD = (
    ctx: CanvasRenderingContext2D,
    target: { x: number; y: number },
    isLocked: boolean,
    lockTime: number
  ) => {
    ctx.save();
    const ringRadius = 32;

    // Outer Target Reticle
    ctx.strokeStyle = isLocked ? '#10b981' : '#f59e0b';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(target.x, target.y, ringRadius, 0, Math.PI * 2);
    ctx.stroke();

    // Crosshair ticks
    const tickLen = 8;
    ctx.beginPath();
    ctx.moveTo(target.x - ringRadius - tickLen, target.y);
    ctx.lineTo(target.x - ringRadius + 4, target.y);
    ctx.moveTo(target.x + ringRadius - 4, target.y);
    ctx.lineTo(target.x + ringRadius + tickLen, target.y);
    ctx.moveTo(target.x, target.y - ringRadius - tickLen);
    ctx.lineTo(target.x, target.y - ringRadius + 4);
    ctx.moveTo(target.x, target.y + ringRadius - 4);
    ctx.lineTo(target.x, target.y + ringRadius + tickLen);
    ctx.stroke();

    // Progress arc representing neural lock cohesion
    const lockPct = Math.min(1, lockTime / 5);
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(target.x, target.y, ringRadius + 6, -Math.PI / 2, -Math.PI / 2 + lockPct * Math.PI * 2);
    ctx.stroke();

    // Telemetry text beside target
    ctx.fillStyle = isLocked ? '#34d399' : '#f59e0b';
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.fillText(
      isLocked ? `LOCKED: ${(lockPct * 100).toFixed(0)}%` : 'SEEKING TARGET...',
      target.x + ringRadius + 12,
      target.y - 8
    );
    ctx.fillStyle = '#94a3b8';
    ctx.font = '8px "JetBrains Mono", monospace';
    ctx.fillText('TARGET MIMICKING PROTOCOL', target.x + ringRadius + 12, target.y + 6);

    ctx.restore();
  };

  // Helper: Top-level HUD telemetry on canvas
  const renderScreenHUD = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    stage: EvolutionaryStageId,
    mouse: { x: number; y: number }
  ) => {
    ctx.save();
    // Subtle corner framing brackets
    ctx.strokeStyle = 'rgba(51, 65, 85, 0.6)';
    ctx.lineWidth = 1.5;
    const bracketSize = 16;
    const margin = 12;

    // Top-Left
    ctx.beginPath();
    ctx.moveTo(margin, margin + bracketSize);
    ctx.lineTo(margin, margin);
    ctx.lineTo(margin + bracketSize, margin);
    ctx.stroke();

    // Top-Right
    ctx.beginPath();
    ctx.moveTo(w - margin - bracketSize, margin);
    ctx.lineTo(w - margin, margin);
    ctx.lineTo(w - margin, margin + bracketSize);
    ctx.stroke();

    // Bottom-Left
    ctx.beginPath();
    ctx.moveTo(margin, h - margin - bracketSize);
    ctx.lineTo(margin, h - margin);
    ctx.lineTo(margin + bracketSize, h - margin);
    ctx.stroke();

    // Bottom-Right
    ctx.beginPath();
    ctx.moveTo(w - margin - bracketSize, h - margin);
    ctx.lineTo(w - margin, h - margin);
    ctx.lineTo(w - margin, h - margin - bracketSize);
    ctx.stroke();

    // Crosshair at mouse position
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.4)';
    ctx.lineWidth = 0.8;
    ctx.setLineDash([3, 4]);
    ctx.beginPath();
    ctx.moveTo(mouse.x, 0);
    ctx.lineTo(mouse.x, h);
    ctx.moveTo(0, mouse.y);
    ctx.lineTo(w, mouse.y);
    ctx.stroke();
    ctx.setLineDash([]);

    // Small crosshair box
    ctx.strokeStyle = '#06b6d4';
    ctx.strokeRect(mouse.x - 6, mouse.y - 6, 12, 12);

    // Live coordinate readout at mouse
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.fillRect(mouse.x + 10, mouse.y + 10, 110, 20);
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.5)';
    ctx.strokeRect(mouse.x + 10, mouse.y + 10, 110, 20);
    ctx.fillStyle = '#67e8f9';
    ctx.font = '9px "JetBrains Mono", monospace';
    ctx.fillText(`X:${Math.round(mouse.x)} Y:${Math.round(mouse.y)} PROBE`, mouse.x + 16, mouse.y + 24);

    ctx.restore();
  };

  return (
    <div className="relative w-full rounded-xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl flex flex-col">
      {/* Viewport Top Bar Controls */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-800 bg-slate-900/60 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-200">Stage Viewport:</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">
              {currentStage === 'stage3D' && 'Stage 3D: Fragmentation (1% Human Baseline)'}
              {currentStage === 'stage4D' && 'Stage 4D: Adherence (Raw Multi-Sensor Ingestion)'}
              {currentStage === 'stage5D' && 'Stage 5D: Compaction (Soap Bubble Neural Stitch)'}
            </span>
          </div>
          <span className="hidden sm:inline-block text-xs font-mono text-slate-500">·</span>
          <span className="hidden sm:inline-block text-xs font-mono text-slate-400">
            {temporalDilation < 1 ? `Temporal Dilation: ${(temporalDilation * 1000).toFixed(0)}fps (Slow)` : 'Real-Time Dynamic Sweep'}
          </span>
        </div>

        {/* Viewport Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Display Mode Selector */}
          <div className="flex items-center rounded-lg bg-slate-950 p-0.5 border border-slate-800">
            <button
              onClick={() => setDisplayMode('unified')}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                displayMode === 'unified'
                  ? 'bg-slate-800 text-cyan-400 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Unified Stitched Canvas"
            >
              Unified View
            </button>
            <button
              onClick={() => setDisplayMode('split')}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                displayMode === 'split'
                  ? 'bg-slate-800 text-cyan-400 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Split Species Quad-Comparator"
            >
              <span className="flex items-center gap-1">
                <Split className="w-3 h-3" />
                <span>Split Grid</span>
              </span>
            </button>
          </div>

          {/* Pause / Play */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1.5 rounded-lg border border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200 hover:border-slate-700 transition-colors"
            title={isPlaying ? 'Pause Simulation' : 'Resume Simulation'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>

          {/* Toggle HUD */}
          <button
            onClick={() => setShowHud(!showHud)}
            className={`p-1.5 rounded-lg border border-slate-800 bg-slate-950 transition-colors ${
              showHud ? 'text-cyan-400 border-cyan-800/50' : 'text-slate-500 hover:text-slate-300'
            }`}
            title="Toggle Telemetry HUD & Crosshairs"
          >
            <Crosshair className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Canvas Viewport */}
      <div className="relative aspect-[16/9] w-full bg-slate-950 cursor-crosshair overflow-hidden">
        <canvas
          ref={canvasRef}
          width={960}
          height={540}
          onMouseMove={handleMouseMove}
          className="w-full h-full block"
        />

        {/* Watermark/Stage Overlay banner at bottom-left */}
        <div className="absolute bottom-3 left-3 pointer-events-none flex flex-col gap-1">
          <div className="flex items-center gap-2 bg-slate-950/80 backdrop-blur px-2.5 py-1 rounded border border-slate-800 text-xs font-mono text-slate-300">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span>SPECTRO-MATRIX 5TH_HYPOTHESIS</span>
            <span className="text-slate-500">|</span>
            <span className="text-cyan-400 font-bold">RSG: {rsgSensitivity}%</span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-400">
              {rsgSensitivity === 100
                ? 'RSG MAX FILTER (HUMAN 480p)'
                : rsgSensitivity <= 20
                ? 'TOTAL COMPACTION (TRUE PERSPECTIVE)'
                : 'SENSOR ADHERENCE'}
            </span>
          </div>
          {rsgSensitivity === 100 && (
            <div className="bg-slate-900/80 backdrop-blur px-2.5 py-1 rounded border border-slate-700 text-xs font-mono text-slate-300">
              RSG Maximum Filter · Simplified Human Watercolor (Survival Mode)
            </div>
          )}
          {rsgSensitivity > 20 && rsgSensitivity < 80 && (
            <div className="bg-amber-950/80 backdrop-blur px-2.5 py-1 rounded border border-amber-600/50 text-xs font-mono text-amber-300">
              Sensor Adherence · Cross-Species Hybrid Stitched Overlay
            </div>
          )}
          {rsgSensitivity <= 20 && (
            <div className="bg-emerald-950/80 backdrop-blur px-2.5 py-1 rounded border border-emerald-600/50 text-xs font-mono text-emerald-300 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-emerald-400" />
              <span>Total Compaction · Raw Multi-Dimensional Geometry (True Perspective)</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
