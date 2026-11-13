export type EvolutionaryStageId = 'stage3D' | 'stage4D' | 'stage5D';

export interface EvolutionaryStage {
  id: EvolutionaryStageId;
  name: string;
  subtitle: string;
  description: string;
  cognitiveLoad: number; // 0 - 100%
  resolutionTag: string;
  filterMode: string;
  bandwidthMbps: number;
}

export type SpeciesKey = 'feline' | 'apis' | 'crotalinae' | 'diptera' | 'aves';

export interface SensorChannel {
  key: SpeciesKey;
  species: string;
  commonName: string;
  hardware: string;
  phenomenon: string;
  outputData: string;
  spectrumRange: string;
  biologicalMechanism: string;
  active: boolean;
  gain: number; // 0 - 100
  color: string;
  accentHex: string;
  metricLabel: string;
  currentMetricValue: string;
}

export interface LayerDimension {
  renderType: string;
  geometry: string;
  refreshRate: string;
}

export interface ComparativeVisualizerConfig {
  renderingEngine: string;
  dimensions: {
    humanLayer: LayerDimension;
    integratedLayer: LayerDimension;
  };
  comparativeMatrixMetrics: string[];
}

export interface ExportTelemetryConfig {
  targetFormat: string;
  loggingInterval: string;
  telemetryPayload: {
    fields: string[];
  };
}

export interface VisualMatrixOutput {
  spatialDepthPrecision: string;
  spectralBandwidthNm: string;
  temporalFrameResolution: string;
  geometricVectorContours: string;
  layerRenderingType: string;
  layerGeometry: string;
  layerRefreshRate: string;
  stenopaicSlitAcutance: string;
  uvScalarPolarization: string;
  thermalInfraredFlux: string;
  magneticInclinationVector: string;
  targetTrackingCoherence: string;
}

export interface TelemetryPayloadData {
  sessionTimestamp: string;
  activeSensorsAdhered: string[];
  compressionRatio: string;
  evolutionaryStageStage: string;
  visualMatrixOutput: VisualMatrixOutput;
}

export interface RSGStateInfo {
  mode: string;
  outputType: string;
  dataDensity: string;
}

export interface RSGInteractiveControls {
  rsgSensitivitySlider: {
    range: string;
    default: string;
    states: {
      '100%': RSGStateInfo;
      '50%': RSGStateInfo;
      '0%': RSGStateInfo;
    };
  };
}

export interface SensorLayerMetric {
  depth: string;
  spectrum: string;
  tempo: string;
  geometry: string;
}

export interface ComparativeMetricsVisualization {
  matrixAxes: string[];
  sensorLayers: {
    humanBaseline: SensorLayerMetric;
    felineSlitOptics: SensorLayerMetric;
    apisUVGrid: SensorLayerMetric;
    crotalinaeIR: SensorLayerMetric;
  };
}

export interface MasterCoreData {
  theoryId: string;
  title: string;
  baseline: {
    status: string;
    resolution: string;
    bottleneck: string;
    risk: string;
  };
  interactiveControls: RSGInteractiveControls;
  comparativeMetricsVisualization: ComparativeMetricsVisualization;
  sensorMap: SensorChannel[];
  comparativeVisualizer: ComparativeVisualizerConfig;
  exportTelemetry: ExportTelemetryConfig;
  architecturalFix: {
    mechanism: string;
    compressionMethod: string;
    operationalState: string;
  };
  evolutionaryMatrix: Record<EvolutionaryStageId, EvolutionaryStage>;
  alphaTestProtocol: {
    activity: string;
    purpose: string;
  };
}

export interface ProbeData {
  x: number;
  y: number;
  wavelengthNm: number | null;
  infraredTempC: number | null;
  temporalDeltaMs: number | null;
  magneticDeclinationDeg: number | null;
  slitAcutanceRatio: number | null;
  dominantChannel: string;
  targetProximity: number;
}

export interface AlphaTestState {
  active: boolean;
  targetX: number;
  targetY: number;
  targetSpeed: number;
  crosshairLocked: boolean;
  lockTime: number; // in seconds
  neuralElasticity: number; // 0-100%
  stitchingCoherence: number; // 0-100%
  rsgOverwriteRate: number; // 0-100%
  completedTrials: number;
}
