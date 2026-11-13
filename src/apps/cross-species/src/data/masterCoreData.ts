import { MasterCoreData, SensorChannel, TelemetryPayloadData, EvolutionaryStageId, ProbeData, AlphaTestState } from '../types/sensorMatrix';

export const INITIAL_SENSOR_CHANNELS: SensorChannel[] = [
  {
    key: 'feline',
    species: 'Feline (Apex Predator)',
    commonName: 'Feline Slit-Optics',
    hardware: 'Vertical Slit-Aperture Optics',
    phenomenon: 'Acutance Asymmetry',
    outputData: 'The Cuboid Moon: Spherical body anchored inside a six-sided cuboid ring with hard geometric vectors.',
    spectrumRange: '450 - 680 nm (Astigmatic Vertical Focus)',
    biologicalMechanism: 'Vertical stenopaic pupil + tapetum lucidum reflective cell layer; eliminates vertical spherical aberration while horizontal blur produces hyper-sensitive depth parallax.',
    active: true,
    gain: 85,
    color: 'emerald',
    accentHex: '#10b981',
    metricLabel: 'Vector Acutance',
    currentMetricValue: '14.2:1 Ratio',
  },
  {
    key: 'apis',
    species: 'Apis (Bee)',
    commonName: 'Apis UV Grid',
    hardware: 'UV Sensor Array',
    phenomenon: 'Ultraviolet Vision Grid',
    outputData: 'Hidden structural landing vectors and scalar light polarization.',
    spectrumRange: '300 - 400 nm (Near UV & Rayleigh Polarization)',
    biologicalMechanism: 'Compound eye ommatidia with UV-rhodopsin and dorsal rim ommatidia detecting e-vector celestial skylight polarization angles.',
    active: true,
    gain: 75,
    color: 'violet',
    accentHex: '#a855f7',
    metricLabel: 'UV Scalar Flux',
    currentMetricValue: '348 nm / 0.89 P',
  },
  {
    key: 'crotalinae',
    species: 'Crotalinae (Pit Viper)',
    commonName: 'Crotalinae Thermal Pit',
    hardware: 'Infrared Pit Organs',
    phenomenon: 'Thermal Dynamic Glow',
    outputData: 'Real-time thermal radiation fields overlaying physical architecture.',
    spectrumRange: '8.0 - 12.0 μm (Long-Wave Thermal IR)',
    biologicalMechanism: 'Pinhole infrared pit organs with suspended 15μm vascular membrane packed with heat-activated TRPA1 ion channels detecting 0.003°C micro-fluxes.',
    active: true,
    gain: 80,
    color: 'amber',
    accentHex: '#f59e0b',
    metricLabel: 'Radiative Temp',
    currentMetricValue: '+37.4 °C Body Peak',
  },
  {
    key: 'diptera',
    species: 'Diptera (Fly)',
    commonName: 'Diptera Temporal Dilation',
    hardware: 'High Temporal Frequency Compound Eyes',
    phenomenon: 'High Frame Rate Processing',
    outputData: 'Temporal dilation (1000fps biological refresh slowing human kinetic movement to 360p slow-motion).',
    spectrumRange: '250 - 1000 Hz (CFF - Critical Flicker Fusion)',
    biologicalMechanism: 'Ultra-fast rhabdomere photoreceptors with histamine neurotransmission enabling sub-millisecond motion detection and projectile avoidance vectors.',
    active: true,
    gain: 70,
    color: 'cyan',
    accentHex: '#06b6d4',
    metricLabel: 'Temporal Refresh',
    currentMetricValue: '960 fps (1.04 ms)',
  },
  {
    key: 'aves',
    species: 'Migratory Aves (Bird)',
    commonName: 'Avian Magneto-Grid',
    hardware: 'Geomagnetic Cryptochromes',
    phenomenon: 'Magnetoreception Overlay',
    outputData: "Earth's magnetic flux lines rendered as a transparent, contextual navigation grid.",
    spectrumRange: '0.25 - 0.65 Gauss (Radical Pair Quantum Resonance)',
    biologicalMechanism: 'Cryptochrome-4 (Cry4) flavoproteins in retinal ganglion cells forming quantum-entangled radical pairs sensitive to geomagnetic inclination vectors.',
    active: true,
    gain: 65,
    color: 'teal',
    accentHex: '#14b8a6',
    metricLabel: 'Field Inclination',
    currentMetricValue: '67.2° Inclination',
  },
];

export const MASTER_CORE_DATA: MasterCoreData = {
  theoryId: '5TH_HYPOTHESIS_CORE',
  title: 'Cross-Species Data Integration & Sensor Stitching Blueprint',
  baseline: {
    status: '1% Simulation',
    resolution: '480p Watercolor',
    bottleneck: 'Ruthless Simulator Genome (RSG) Efficiency Filter',
    risk: 'Total Data Stuffing (Cognitive Overload if uncompressed)',
  },
  interactiveControls: {
    rsgSensitivitySlider: {
      range: '0% to 100%',
      default: '100%',
      states: {
        '100%': {
          mode: 'RSG Maximum Filter',
          outputType: 'Simplified Human Watercolor (Survival Mode)',
          dataDensity: 'Low Bandwidth',
        },
        '50%': {
          mode: 'Sensor Adherence',
          outputType: 'Cross-Species Hybrid Stitched Overlay',
          dataDensity: 'Moderate Uncompressed Bandwidth',
        },
        '0%': {
          mode: 'Total Compaction',
          outputType: 'Raw Multi-Dimensional Geometry (True Perspective)',
          dataDensity: 'Maximum Sensor Influx (High Overload Risk)',
        },
      },
    },
  },
  comparativeMetricsVisualization: {
    matrixAxes: [
      'Spatial Depth Precision',
      'Spectral Bandwidth (nm)',
      'Temporal Processing Frame Rate',
      'Geometric Contour Rigidity',
    ],
    sensorLayers: {
      humanBaseline: {
        depth: 'Low (Soft Bloom)',
        spectrum: '380-700nm',
        tempo: '60Hz',
        geometry: 'Amorphous/Circular',
      },
      felineSlitOptics: {
        depth: 'High (Acutance Asymmetry)',
        spectrum: 'Variable',
        tempo: 'Fluid Tracking',
        geometry: '6-Sided Cuboid Vector',
      },
      apisUVGrid: {
        depth: 'Scalar Polarized',
        spectrum: '300-400nm (UV)',
        tempo: 'High',
        geometry: 'Linear Arrays',
      },
      crotalinaeIR: {
        depth: 'Thermal Gradient Mapping',
        spectrum: '700nm-1mm (Infrared)',
        tempo: 'Real-time Overlay',
        geometry: 'Fluid Heat Geometries',
      },
    },
  },
  sensorMap: INITIAL_SENSOR_CHANNELS,
  comparativeVisualizer: {
    renderingEngine: 'Multi-Layer Sensory Overlay',
    dimensions: {
      humanLayer: {
        renderType: 'Soft Bloom',
        geometry: 'Amorphous/Circular',
        refreshRate: '60Hz',
      },
      integratedLayer: {
        renderType: 'Hard Edge',
        geometry: 'Six-Sided Cuboid Matrix',
        refreshRate: '1000Hz',
      },
    },
    comparativeMatrixMetrics: [
      'Spatial Depth Precision',
      'Spectral Bandwidth (nm)',
      'Temporal Frame Resolution',
      'Geometric Vector Contours',
    ],
  },
  exportTelemetry: {
    targetFormat: 'Samsung Notes Mobile Markdown / Clean JSON String',
    loggingInterval: 'Per Simulation Run',
    telemetryPayload: {
      fields: [
        'sessionTimestamp',
        'activeSensorsAdhered',
        'compressionRatio',
        'evolutionaryStageStage',
        'visualMatrixOutput',
      ],
    },
  },
  architecturalFix: {
    mechanism: 'Bio-Architectonics Neural Stitching',
    compressionMethod: 'Soap Bubble Compaction',
    operationalState: 'Instead of separate disjointed screens, the engine compresses geometric cuboid edges, thermal fields, and UV vectors into a single, intuitive, multi-dimensional truth.',
  },
  evolutionaryMatrix: {
    stage3D: {
      id: 'stage3D',
      name: 'Stage 3D: Fragmentation',
      subtitle: 'Isolated Human Baseline',
      description: 'Watercolor simulation constrained by evolutionary filters. Minimal bandwidth (480p equivalent) to conserve biological glucose. Excludes 99% of environmental electromagnetic reality.',
      cognitiveLoad: 12,
      resolutionTag: '480p Watercolor',
      filterMode: 'RSG Glucose-Saving Bottleneck',
      bandwidthMbps: 18,
    },
    stage4D: {
      id: 'stage4D',
      name: 'Stage 4D: Adherence',
      subtitle: 'Raw Multi-Sensor Ingestion (Data Stuffing)',
      description: 'Intensive attachment of external sensors. Human sight + Feline Cuboid Geometry + Non-human data strings. High risk of cognitive sensory collision and cognitive overload without compaction.',
      cognitiveLoad: 88,
      resolutionTag: 'Raw Hyper-Data Feed',
      filterMode: 'Uncompressed Multi-Sensor Stream',
      bandwidthMbps: 4200,
    },
    stage5D: {
      id: 'stage5D',
      name: 'Stage 5D: Compaction',
      subtitle: 'Universal Sensor State (Soap Bubble Compaction)',
      description: 'Universal Sensor State. Total data field compressed and processed at maximum operational momentum. Dissolution of individual architectural boundaries into a single coherent truth.',
      cognitiveLoad: 24,
      resolutionTag: 'Multi-Dimensional Stitched Core',
      filterMode: 'Bio-Architectonics Neural Stitching',
      bandwidthMbps: 1240,
    },
  },
  alphaTestProtocol: {
    activity: 'Target Mimicking Behavior',
    purpose: 'Systematic overwriting of natural biological code to prove structural elasticity of the internal intelligence.',
  },
};

export interface SensorPreset {
  id: string;
  name: string;
  stage: 'stage3D' | 'stage4D' | 'stage5D';
  description: string;
  activeSensors: Record<string, boolean>;
  gains: Record<string, number>;
}

export const PRESETS: SensorPreset[] = [
  {
    id: 'stage5d_compaction',
    name: 'Universal Compaction (Recommended)',
    stage: 'stage5D',
    description: 'All 5 species channels active, perfectly compressed via Soap Bubble Compaction with optimal cognitive load.',
    activeSensors: { feline: true, apis: true, crotalinae: true, diptera: true, aves: true },
    gains: { feline: 85, apis: 80, crotalinae: 80, diptera: 75, aves: 70 },
  },
  {
    id: 'feline_cuboid_moon',
    name: 'The Cuboid Moon Analysis',
    stage: 'stage4D',
    description: 'Slit-aperture astigmatic acutance isolating the geometric cuboid wireframe around the celestial moon.',
    activeSensors: { feline: true, apis: false, crotalinae: false, diptera: false, aves: false },
    gains: { feline: 100, apis: 0, crotalinae: 0, diptera: 0, aves: 0 },
  },
  {
    id: 'pollinator_navigation',
    name: 'Pollinator Guidance Array',
    stage: 'stage5D',
    description: 'Bee UV floral landing vectors + Avian geomagnetic flux mesh + Fly high-temporal dilation.',
    activeSensors: { feline: false, apis: true, crotalinae: false, diptera: true, aves: true },
    gains: { feline: 0, apis: 95, crotalinae: 0, diptera: 85, aves: 90 },
  },
  {
    id: 'predator_thermal_night',
    name: 'Apex Night Stalker',
    stage: 'stage4D',
    description: 'Feline slit acutance coupled with Pit Viper TRPA1 infrared thermal radiation glow.',
    activeSensors: { feline: true, apis: false, crotalinae: true, diptera: false, aves: false },
    gains: { feline: 90, apis: 0, crotalinae: 95, diptera: 0, aves: 0 },
  },
  {
    id: 'human_baseline_1pct',
    name: 'Human 1% Baseline (Fragmentation)',
    stage: 'stage3D',
    description: 'The standard evolutionary 480p watercolor simulation constrained by human metabolic energy limits.',
    activeSensors: { feline: false, apis: false, crotalinae: false, diptera: false, aves: false },
    gains: { feline: 0, apis: 0, crotalinae: 0, diptera: 0, aves: 0 },
  },
];

/**
 * Generates the formal telemetry payload object strictly following the exportTelemetry specification.
 */
export function buildTelemetryPayload(
  currentStage: EvolutionaryStageId,
  sensors: SensorChannel[],
  probe: ProbeData,
  alphaState: AlphaTestState,
  rsgSensitivity: number = 100
): TelemetryPayloadData {
  const stage = MASTER_CORE_DATA.evolutionaryMatrix[currentStage];
  const activeSensors = sensors.filter((s) => s.active);

  // Compression ratio computation
  let compressionRatio = '1.0:1 (Uncompressed Baseline)';
  if (rsgSensitivity <= 15 || currentStage === 'stage5D') {
    compressionRatio = '14.8:1 (Soap Bubble Compaction Optimal)';
  } else if (rsgSensitivity <= 65 || currentStage === 'stage4D') {
    compressionRatio = '0.29:1 (Uncompressed Hyper-Data / Data Stuffing Collision)';
  }

  // Determine RSG label
  let rsgMode = 'RSG Maximum Filter · Simplified Human Watercolor (Survival Mode)';
  if (rsgSensitivity <= 20) {
    rsgMode = 'Total Compaction · Raw Multi-Dimensional Geometry (True Perspective)';
  } else if (rsgSensitivity <= 70) {
    rsgMode = 'Sensor Adherence · Cross-Species Hybrid Stitched Overlay';
  }

  return {
    sessionTimestamp: new Date().toISOString(),
    activeSensorsAdhered: activeSensors.map((s) => `${s.species} [${s.hardware}]`),
    compressionRatio: `${compressionRatio} | RSG Sensitivity: ${rsgSensitivity}% (${rsgMode})`,
    evolutionaryStageStage: stage.name,
    visualMatrixOutput: {
      spatialDepthPrecision: rsgSensitivity > 80 ? '±3.20m (Binocular Planar / Soft Bloom)' : '±0.04m (Slit Parallax Six-Sided Cuboid Lock)',
      spectralBandwidthNm: rsgSensitivity > 80 ? '380 - 700 nm (Human Baseline)' : '300 - 12,000 nm (Multi-Species Gamut)',
      temporalFrameResolution: rsgSensitivity > 80 ? '60 Hz (16.6 ms Flicker Fusion)' : '1000 Hz (1.04 ms Diptera Compound Dilation)',
      geometricVectorContours: rsgSensitivity > 80 ? 'Amorphous / Circular Soft Bloom' : 'Rigid Six-Sided Cuboid Vector Matrix · The Cuboid Moon',
      layerRenderingType: rsgSensitivity > 80 ? 'Soft Bloom (Human Survival Mode)' : 'Hard Edge (Integrated Cross-Species Matrix)',
      layerGeometry: rsgSensitivity > 80 ? 'Amorphous/Circular' : 'Six-Sided Cuboid Matrix',
      layerRefreshRate: rsgSensitivity > 80 ? '60Hz' : '1000Hz',
      stenopaicSlitAcutance: `${probe.slitAcutanceRatio || 1.0}:1 Ratio`,
      uvScalarPolarization: `${probe.wavelengthNm || 348} nm · 0.89 Rayleigh P-Vector`,
      thermalInfraredFlux: `${probe.infraredTempC || 18.5} °C (TRPA1 Radiative Field)`,
      magneticInclinationVector: `${probe.magneticDeclinationDeg || 67.2}° Geomagnetic Dip`,
      targetTrackingCoherence: `${alphaState.stitchingCoherence}% Phase Alignment`,
    },
  };
}

/**
 * Formats telemetry payload into clean, high-readability Samsung Notes Mobile Markdown.
 * Tailored for mobile screens with clean headers, badges, metric tables, and callout blocks.
 */
export function formatSamsungNotesMarkdown(payload: TelemetryPayloadData): string {
  const ts = new Date(payload.sessionTimestamp).toLocaleString();
  return `# 🌌 OmniSci Foundry: Cross-Species Sensor Matrix
**Theory ID:** 5TH_HYPOTHESIS_CORE  
**Session Log:** ${ts}  
**Evolutionary Stage:** ${payload.evolutionaryStageStage}  
**Compression Ratio:** ${payload.compressionRatio}  

---

### 📋 Active Sensor Adherence
${payload.activeSensorsAdhered.length === 0 ? '- [x] None (Isolated Human 1% Baseline)' : payload.activeSensorsAdhered.map((s) => `- [x] **${s}**`).join('\n')}

---

### 🔬 Comparative Visualizer Matrix Metrics
| Dimension Metric | Measured Sensor Output | Target Parameter |
| :--- | :--- | :--- |
| **Spatial Depth Precision** | \`${payload.visualMatrixOutput.spatialDepthPrecision}\` | Cuboid Moon Parallax |
| **Spectral Bandwidth** | \`${payload.visualMatrixOutput.spectralBandwidthNm}\` | UV (300nm) to Thermal IR (12μm) |
| **Temporal Frame Resolution** | \`${payload.visualMatrixOutput.temporalFrameResolution}\` | Diptera 1000Hz CFF |
| **Geometric Vector Contours** | \`${payload.visualMatrixOutput.geometricVectorContours}\` | Six-Sided Cuboid Matrix |
| **Layer Rendering Mode** | \`${payload.visualMatrixOutput.layerRenderingType}\` | Multi-Layer Overlay |
| **Layer Dynamic Refresh** | \`${payload.visualMatrixOutput.layerRefreshRate}\` | Hardware Sampling |

---

### ⚡ Live Physics Probe Telemetry
- **Slit Acutance Ratio:** \`${payload.visualMatrixOutput.stenopaicSlitAcutance}\`
- **UV Scalar Polarization:** \`${payload.visualMatrixOutput.uvScalarPolarization}\`
- **Thermal Infrared Flux:** \`${payload.visualMatrixOutput.thermalInfraredFlux}\`
- **Geomagnetic Inclination:** \`${payload.visualMatrixOutput.magneticInclinationVector}\`
- **Stitching Coherence:** \`${payload.visualMatrixOutput.targetTrackingCoherence}\`

---

> 🧠 **Bio-Architectonics Architectural Note:**  
> *Soap Bubble Compaction* actively folds high-dimensional foreign sensory vectors into an intuitive, topologically unified truth vector. This prevents the cognitive buffer failure of raw *Data Stuffing* while breaking past the RSG evolutionary glucose bottleneck.

*Exported via OmniSci Foundry Research Simulator v1.1.0*
`;
}
