/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { HypothesisInfo } from '../types/dimensions';

export const HYPOTHESES: HypothesisInfo[] = [
  {
    id: 'overlapping',
    index: '01',
    title: 'Overlapping Hypothesis',
    shortName: 'Overlapping',
    tagline: 'Dimensional emergence through directional stacking and epicentral all-direction distribution.',
    coreMechanism: '1D overlaps along a single vector to form 2D length/width; 2D overlaps radially around an epicenter in all directions to forge 3D volume; 3D overlaps across hyper-radial Ana/Kata vectors to form 4D structures.',
    dimensionTransition: '0D → 1D → 2D → 3D → 4D',
  },
  {
    id: 'constrictive_force',
    index: '02',
    title: 'Constrictive Force & Equilibrium',
    shortName: 'Constrictive Force',
    tagline: 'Internal structure as an integrity force barrier; passive residual accumulation as Gravity.',
    coreMechanism: 'A lesser force pulls 1D into 2D; random inward constriction pulls 2D until contact creates an equal counter-force (Integrity Force). Beyond this basal point, accumulation continues as Gravity. For 4D, hyper-force Z crushes inward against Beta Force.',
    dimensionTransition: 'Constriction → Basal Lock → Residual Gravity → Hyper-Force Z / Beta (4D)',
  },
  {
    id: 'ever_expansion',
    index: '03',
    title: 'Universal Ever Expansion & Space Units',
    shortName: 'Ever Expansion',
    tagline: 'Discrete volumetric space unit saturation triggering dimensional tipping thresholds.',
    coreMechanism: 'Continuous unidirectional and radial expansion consumes quantized Space Units. Once a critical space unit threshold (Sc) is filled, the geometric manifold buckles and elevates into the next dimension.',
    dimensionTransition: 'Expansion Vector → Intersections → Space Unit Saturation → Dimensional Tipping',
  },
  {
    id: 'big_bang_collapse',
    index: '04',
    title: 'Big Bang Origin Phenomenon',
    shortName: 'Dimensional Collapse',
    tagline: 'Top-down collapse from higher dimensions into lower dimensions and existential lifespan limits.',
    coreMechanism: 'The Big Bang is a top-down collapse of 4D hyper-space into 3D, 2D, and 1D. As collapsing force dissipates, residual force forms matter clusters (spiral galaxies, stars, atoms). Existential lifespan obeys 4D > 3D > 2D > 1D.',
    dimensionTransition: '4D Hyper-State → Cascade Breakdown → Energy Clustering → Existential Half-Life',
  },
  {
    id: 'momentum_collision',
    index: '05',
    title: 'Time & High-Momentum Collision',
    shortName: 'Momentum Adherence',
    tagline: 'Kinetic adherence and puzzle-piece crystallisation under active temporal flow.',
    coreMechanism: 'Time enables motion and momentum. High-intensity collisions cause intense mechanical adherence between matching structures like puzzle pieces. Ultra-high momentum collisions of 3D polyhedra lock into 4D polychora.',
    dimensionTransition: 'Temporal Metric → High-p Impact → Puzzle-Piece Adherence → Hyper-Crystal Fusion',
  },
];

export interface QuestionAnswer {
  question: string;
  context: string;
  theoreticalAnswer: string;
  mathematicalModel: string;
  simulatorBehavior: string;
}

export const THEORETICAL_DEEP_DIVES: Record<string, QuestionAnswer> = {
  q1_1d_origin: {
    question: "The 1st dimension comes from overlapping of what dimensions?",
    context: "Raised in Hypothesis 1 (Overlapping)",
    theoreticalAnswer: "In this hypothesis, the 1st dimension arises from the overlapping of 0-Dimensional (0D) dimensionless point singularities or quantum state excitations. When infinitely dense 0D points overlap along a continuous phase gradient, the cumulative density resolves the directional indeterminacy of isolated points into a single unbroken trajectory—the 1D line vector.",
    mathematicalModel: "L_{1D} = \\lim_{N \\to \\infty} \\sum_{i=1}^{N} \\delta(x - x_i) \\quad \\text{where overlapping 0D point states integrate into a continuous linear metric } ds^2 = dx^2.",
    simulatorBehavior: "In the 0D → 1D mode, watch discrete pulsing Planck points stack along a directional beam until a solid luminous 1D line is manifested.",
  },
  q2_4d_directions: {
    question: "4th Dimension structure from overlapping 3rd dimensions: the overlapping uses what directions?",
    context: "Raised in Hypothesis 1 (Overlapping)",
    theoreticalAnswer: "Just as 3D was born from 2D overlapping radially outward from an epicenter in all planar angles (θ, φ), the 4th dimension requires an epicentral hyper-radial distribution across the orthogonal 'Ana' and 'Kata' axis (w-axis). 3D volumes overlap along hyper-spherical angular coordinates (ψ, θ, φ) around a central 3D volumetric core, folding through hyper-rotational planes (XW, YW, ZW).",
    mathematicalModel: "V_{4D} = \\int_{0}^{\\pi} \\int_{0}^{2\\pi} \\int_{0}^{\\pi} R^3 \\sin^2(\\psi) \\sin(\\theta) \\, d\\psi \\, d\\theta \\, d\\phi \\quad \\text{orthogonal to all 3 spatial Cartesian axes}.",
    simulatorBehavior: "In 3D → 4D mode, observe 3D cubic cells rotate and overlap into hyper-radial shells, forming the nested wireframe and projection of a Tesseract (8-cell).",
  },
  q3_collision_count: {
    question: "For the 4th dimension, how many 3rd dimension structures must collide to form a 4D structure?",
    context: "Raised in Hypothesis 5 (Time and Momentum)",
    theoreticalAnswer: "Geometric boundary topology dictates that to form the fundamental regular 4D hypercube (Tesseract), exactly 8 identical 3D cubic structures must adhere along their 24 square faces. Alternatively, to form a 24-cell (the most symmetric 4D polytope unique to four dimensions), 24 octahedral 3D structures must collide at ultra-high momentum and lock into a hyper-diamond lattice.",
    mathematicalModel: "N_{\\text{cells}}(Tesseract) = 2 \\times 4 = 8 \\text{ cubes}; \\quad N_{\\text{cells}}(24\\text{-cell}) = 24 \\text{ regular octahedra}.",
    simulatorBehavior: "In Hypothesis 5, adjust the collision momentum past the adherence threshold to see 8 cubic polyhedra fuse edge-to-edge into a spinning 4D Tesseract.",
  },
};
