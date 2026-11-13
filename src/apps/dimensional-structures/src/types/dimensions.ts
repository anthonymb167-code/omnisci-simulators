/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type HypothesisId = 
  | 'overlapping' 
  | 'constrictive_force' 
  | 'ever_expansion' 
  | 'big_bang_collapse' 
  | 'momentum_collision';

export interface HypothesisInfo {
  id: HypothesisId;
  index: string;
  title: string;
  shortName: string;
  tagline: string;
  coreMechanism: string;
  dimensionTransition: string;
}

export interface OverlappingParams {
  dimensionLevel: '0D_to_1D' | '1D_to_2D' | '2D_to_3D' | '3D_to_4D';
  overlapCount: number; // 2 to 32
  epicenterRadius: number; // 0.1 to 3.0
  hyperAngleW: number; // 0 to 2*PI for 4D rotation
  directionDispersion: 'unidirectional' | 'all_direction_radial' | 'hyper_axial';
}

export interface ConstrictiveParams {
  lesserForce: number; // pulls 1D into 2D
  inwardForce: number; // pulls 2D toward center
  basalPoint: number; // contact threshold where counter-force triggers
  extraLength: number; // passive accumulation past basal point (Gravity)
  forceZ: number; // Hyper-constrictive force for 4D
  betaCounterForce: number; // 4D counter-force
  is4DActive: boolean;
}

export interface EverExpansionParams {
  expansionMode: 'unidirectional_intersect' | 'uniform_radial';
  spaceUnits: number; // 10 to 500
  tippingThreshold3D: number; // space units required to fold 2D -> 3D
  tippingThreshold4D: number; // space units required to fold 3D -> 4D
  expansionSpeed: number; // 0.1 to 3.0
  isTippedTo3D: boolean;
  isTippedTo4D: boolean;
}

export interface BigBangCollapseParams {
  collapseProgress: number; // 0.0 (pristine 4D) to 1.0 (fully collapsed into lower dimensions & clusters)
  startingDimension: 4;
  residualForce: number; // 0.0 to 1.0 (remaining cluster forming force)
  clusterType: 'spiral_galaxy' | 'stellar_core' | 'planetary_disc' | 'atomic_cloud';
  existentialTimes: {
    dim4: number; // e.g. 1000 Gyr
    dim3Star: number; // e.g. 10 Gyr
    dim3Human: number; // e.g. 0.00000008 Gyr (80 yrs)
    dim2: number; // e.g. 100 Myr
    dim1: number; // e.g. 1 Myr
  };
}

export interface MomentumCollisionParams {
  timeState: 'frozen' | 'active'; // presence or absence of time
  momentumIntensity: number; // 10 to 1000
  similarityTolerance: number; // 0.1 to 1.0 (puzzle-piece resonance)
  collidingDimensions: '1D_filaments' | '2D_plates' | '3D_polyhedra';
  adherenceCount: number;
  structuresRequiredFor4D: number; // e.g. 8 cubes or 24 octahedra
}

export interface SimulationTelemetry {
  effectiveDimension: number; // e.g. 1.0, 2.0, 2.7, 3.0, 3.8, 4.0
  forceEquilibrium: {
    constrictive: number;
    counter: number;
    net: number;
    gravityField: number;
  };
  spaceUnitsCount: number;
  entropy: number;
  adherencePercentage: number;
  existentialTimeRemaining: string;
}
