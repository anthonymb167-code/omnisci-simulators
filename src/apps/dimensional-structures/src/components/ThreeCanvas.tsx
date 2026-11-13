/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import {
  HypothesisId,
  OverlappingParams,
  ConstrictiveParams,
  EverExpansionParams,
  BigBangCollapseParams,
  MomentumCollisionParams,
} from '../types/dimensions';
import {
  createTesseract,
  create24Cell,
  rotate4D,
  project4Dto3D,
  Vector4D,
} from '../utils/geometry4d';
import { sound } from '../utils/audio';

interface ThreeCanvasProps {
  hypothesis: HypothesisId;
  overlappingParams: OverlappingParams;
  constrictiveParams: ConstrictiveParams;
  everExpansionParams: EverExpansionParams;
  bigBangParams: BigBangCollapseParams;
  momentumParams: MomentumCollisionParams;
  isPaused: boolean;
  theme: 'dark' | 'light';
  onTelemetryUpdate: (telemetry: {
    effectiveDim: number;
    spaceUnits: number;
    netForce: number;
    adherence: number;
  }) => void;
}

// Module-scope reusable math instances for zero GC churn
const _vec3A = new THREE.Vector3();
const _vec3B = new THREE.Vector3();
const _colorA = new THREE.Color();

export const ThreeCanvas: React.FC<ThreeCanvasProps> = ({
  hypothesis,
  overlappingParams,
  constrictiveParams,
  everExpansionParams,
  bigBangParams,
  momentumParams,
  isPaused,
  theme,
  onTelemetryUpdate,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({
    hypothesis,
    overlappingParams,
    constrictiveParams,
    everExpansionParams,
    bigBangParams,
    momentumParams,
    isPaused,
    theme,
  });

  // Keep stateRef in sync
  useEffect(() => {
    stateRef.current = {
      hypothesis,
      overlappingParams,
      constrictiveParams,
      everExpansionParams,
      bigBangParams,
      momentumParams,
      isPaused,
      theme,
    };
  }, [
    hypothesis,
    overlappingParams,
    constrictiveParams,
    everExpansionParams,
    bigBangParams,
    momentumParams,
    isPaused,
    theme,
  ]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect software WebGL
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    // Scene setup
    const scene = new THREE.Scene();
    const bgColor = stateRef.current.theme === 'dark' ? 0x07090e : 0xf8fafc;
    scene.background = new THREE.Color(bgColor);
    scene.fog = new THREE.FogExp2(bgColor, 0.04);

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 3.5, 7.5);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: false,
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // Studio Environment
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 25;
    controls.minDistance = 1.5;
    controls.target.set(0, 0, 0);

    // Lighting rig
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.0);
    keyLight.position.set(6, 10, 6);
    keyLight.castShadow = !isSoftwareGl;
    if (!isSoftwareGl) {
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      keyLight.shadow.bias = -0.0005;
      keyLight.shadow.normalBias = 0.02;
    }
    scene.add(keyLight);

    const fillLight = new THREE.HemisphereLight(0x38bdf8, 0x0f172a, 1.2);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xa855f7, 1.5);
    rimLight.position.set(-6, -4, -6);
    scene.add(rimLight);

    // Ground Grid & Contact Shadow Plane
    const gridHelper = new THREE.GridHelper(20, 40, 0x06b6d4, 0x1e293b);
    gridHelper.position.y = -2;
    gridHelper.material.opacity = 0.25;
    gridHelper.material.transparent = true;
    scene.add(gridHelper);

    // Master Groups for Hypotheses
    const hypothesisGroup = new THREE.Group();
    scene.add(hypothesisGroup);

    // ----------------------------------------------------
    // GEOMETRIES & DATA CACHE
    // ----------------------------------------------------
    const tesseractData = createTesseract();
    const cell24Data = create24Cell();

    // 1. Overlapping Group
    const overlappingGroup = new THREE.Group();
    hypothesisGroup.add(overlappingGroup);

    // 0D Point cloud
    const pointCount0D = 60;
    const points0DGeo = new THREE.BufferGeometry();
    const pos0D = new Float32Array(pointCount0D * 3);
    for (let i = 0; i < pointCount0D; i++) {
      pos0D[i * 3] = (i / pointCount0D - 0.5) * 4;
      pos0D[i * 3 + 1] = 0;
      pos0D[i * 3 + 2] = 0;
    }
    points0DGeo.setAttribute('position', new THREE.BufferAttribute(pos0D, 3));
    const points0DMat = new THREE.PointsMaterial({
      color: 0x06b6d4,
      size: 0.15,
      transparent: true,
      opacity: 0.9,
    });
    const points0DMesh = new THREE.Points(points0DGeo, points0DMat);
    overlappingGroup.add(points0DMesh);

    // 1D Line laser
    const line1DGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-2.5, 0, 0),
      new THREE.Vector3(2.5, 0, 0),
    ]);
    const line1DMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      linewidth: 3,
      transparent: true,
      opacity: 0.9,
    });
    const line1DMesh = new THREE.Line(line1DGeo, line1DMat);
    overlappingGroup.add(line1DMesh);

    // 2D Stacking planes
    const planes2DGroup = new THREE.Group();
    const planeGeo = new THREE.PlaneGeometry(3.2, 3.2, 8, 8);
    const planeMaterials: THREE.MeshStandardMaterial[] = [];
    for (let i = 0; i < 16; i++) {
      const mat = new THREE.MeshStandardMaterial({
        color: new THREE.Color().setHSL(0.55 + i * 0.02, 0.8, 0.5),
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.25,
        wireframe: true,
      });
      planeMaterials.push(mat);
      const mesh = new THREE.Mesh(planeGeo, mat);
      mesh.position.y = (i - 8) * 0.12;
      planes2DGroup.add(mesh);
    }
    overlappingGroup.add(planes2DGroup);

    // 3D Epicentral Radial Planes
    const epicentralGroup = new THREE.Group();
    const radialDiscGeo = new THREE.RingGeometry(0.2, 2.2, 32);
    for (let i = 0; i < 24; i++) {
      const discMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color().setHSL(0.6 + i * 0.015, 0.9, 0.55),
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.18,
      });
      const disc = new THREE.Mesh(radialDiscGeo, discMat);
      disc.rotation.x = (i / 24) * Math.PI;
      disc.rotation.y = (i / 24) * Math.PI * 0.7;
      disc.rotation.z = (i / 24) * Math.PI * 0.3;
      epicentralGroup.add(disc);
    }
    overlappingGroup.add(epicentralGroup);

    // 4D Tesseract projection lines
    const tesseractLinesGeo = new THREE.BufferGeometry();
    const tesseractLinePositions = new Float32Array(tesseractData.edges.length * 2 * 3);
    tesseractLinesGeo.setAttribute('position', new THREE.BufferAttribute(tesseractLinePositions, 3));
    const tesseractLinesMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      linewidth: 2,
      transparent: true,
      opacity: 0.85,
    });
    const tesseractMesh = new THREE.LineSegments(tesseractLinesGeo, tesseractLinesMat);
    overlappingGroup.add(tesseractMesh);

    // 4D Vertices points
    const tesseractPointsGeo = new THREE.BufferGeometry();
    const tesseractPointsPos = new Float32Array(16 * 3);
    tesseractPointsGeo.setAttribute('position', new THREE.BufferAttribute(tesseractPointsPos, 3));
    const tesseractPointsMat = new THREE.PointsMaterial({
      color: 0xf59e0b,
      size: 0.18,
      transparent: true,
      opacity: 0.95,
    });
    const tesseractPointsMesh = new THREE.Points(tesseractPointsGeo, tesseractPointsMat);
    overlappingGroup.add(tesseractPointsMesh);

    // ----------------------------------------------------
    // 2. CONSTRICTIVE FORCE GROUP
    // ----------------------------------------------------
    const constrictiveGroup = new THREE.Group();
    hypothesisGroup.add(constrictiveGroup);

    // Central Core Sphere (Integrity Core)
    const coreGeo = new THREE.IcosahedronGeometry(0.8, 3);
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: 0x06b6d4,
      metalness: 0.2,
      roughness: 0.3,
      transmission: isSoftwareGl ? 0 : 0.6,
      opacity: isSoftwareGl ? 0.6 : 0.9,
      transparent: true,
      clearcoat: 0.8,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    constrictiveGroup.add(coreMesh);

    // Inward Pulling Filament Particles
    const filamentCount = 48;
    const filamentLinesGeo = new THREE.BufferGeometry();
    const filamentLinePos = new Float32Array(filamentCount * 2 * 3);
    filamentLinesGeo.setAttribute('position', new THREE.BufferAttribute(filamentLinePos, 3));
    const filamentLinesMat = new THREE.LineBasicMaterial({
      color: 0xec4899,
      transparent: true,
      opacity: 0.7,
    });
    const filamentMesh = new THREE.LineSegments(filamentLinesGeo, filamentLinesMat);
    constrictiveGroup.add(filamentMesh);

    // Gravity aura rings (Passive accumulation beyond basal point)
    const gravityGroup = new THREE.Group();
    for (let i = 0; i < 6; i++) {
      const ringGeo = new THREE.TorusGeometry(1.4 + i * 0.45, 0.015, 12, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x8b5cf6,
        transparent: true,
        opacity: 0.3 - i * 0.04,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2 + (i % 2) * 0.3;
      ring.rotation.y = (i % 3) * 0.4;
      gravityGroup.add(ring);
    }
    constrictiveGroup.add(gravityGroup);

    // Force Z & Beta 4D Polytope Mesh (24-Cell)
    const forceZLinesGeo = new THREE.BufferGeometry();
    const forceZPositions = new Float32Array(cell24Data.edges.length * 2 * 3);
    forceZLinesGeo.setAttribute('position', new THREE.BufferAttribute(forceZPositions, 3));
    const forceZMat = new THREE.LineBasicMaterial({
      color: 0xf59e0b,
      linewidth: 2,
      transparent: true,
      opacity: 0.9,
    });
    const forceZMesh = new THREE.LineSegments(forceZLinesGeo, forceZMat);
    constrictiveGroup.add(forceZMesh);

    // ----------------------------------------------------
    // 3. EVER EXPANSION GROUP
    // ----------------------------------------------------
    const expansionGroup = new THREE.Group();
    hypothesisGroup.add(expansionGroup);

    // Instanced Voxel Space Units
    const maxSpaceUnits = 512;
    const voxelBoxGeo = new THREE.BoxGeometry(0.35, 0.35, 0.35);
    const voxelEdgeGeo = new THREE.EdgesGeometry(voxelBoxGeo);
    const voxelMat = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      roughness: 0.4,
      metalness: 0.1,
      transparent: true,
      opacity: 0.85,
    });
    const voxelMesh = new THREE.InstancedMesh(voxelBoxGeo, voxelMat, maxSpaceUnits);
    voxelMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    expansionGroup.add(voxelMesh);

    // Wireframe boundary of expanding space
    const boundaryGeo = new THREE.BoxGeometry(4.2, 4.2, 4.2);
    const boundaryMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
    });
    const boundaryMesh = new THREE.Mesh(boundaryGeo, boundaryMat);
    expansionGroup.add(boundaryMesh);

    // ----------------------------------------------------
    // 4. BIG BANG COLLAPSE GROUP
    // ----------------------------------------------------
    const collapseGroup = new THREE.Group();
    hypothesisGroup.add(collapseGroup);

    // Spiral Galaxy Particles (Accumulation of residual collapsing force)
    const galaxyParticleCount = 1400;
    const galaxyGeo = new THREE.BufferGeometry();
    const galaxyPos = new Float32Array(galaxyParticleCount * 3);
    const galaxyColors = new Float32Array(galaxyParticleCount * 3);

    for (let i = 0; i < galaxyParticleCount; i++) {
      // 2-arm spiral distribution
      const r = Math.pow(Math.random(), 1.5) * 3.8;
      const arm = (i % 2) * Math.PI;
      const angle = arm + r * 1.8 + (Math.random() - 0.5) * 0.4;
      const zSpread = (Math.random() - 0.5) * 0.3 * (4.0 - r);

      galaxyPos[i * 3] = Math.cos(angle) * r;
      galaxyPos[i * 3 + 1] = zSpread;
      galaxyPos[i * 3 + 2] = Math.sin(angle) * r;

      // Color from hot core (amber/white) to cool arms (cyan/blue)
      const colorProgress = r / 3.8;
      _colorA.setHSL(0.55 - colorProgress * 0.4, 0.9, 0.5 + (1 - colorProgress) * 0.3);
      galaxyColors[i * 3] = _colorA.r;
      galaxyColors[i * 3 + 1] = _colorA.g;
      galaxyColors[i * 3 + 2] = _colorA.b;
    }
    galaxyGeo.setAttribute('position', new THREE.BufferAttribute(galaxyPos, 3));
    galaxyGeo.setAttribute('color', new THREE.BufferAttribute(galaxyColors, 3));

    const galaxyMat = new THREE.PointsMaterial({
      size: 0.08,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
    });
    const galaxyMesh = new THREE.Points(galaxyGeo, galaxyMat);
    collapseGroup.add(galaxyMesh);

    // High-dimension precursor hull
    const collapseHullGeo = new THREE.IcosahedronGeometry(2.6, 2);
    const collapseHullMat = new THREE.MeshStandardMaterial({
      color: 0xa855f7,
      wireframe: true,
      transparent: true,
      opacity: 0.5,
    });
    const collapseHullMesh = new THREE.Mesh(collapseHullGeo, collapseHullMat);
    collapseGroup.add(collapseHullMesh);

    // ----------------------------------------------------
    // 5. MOMENTUM COLLISION GROUP
    // ----------------------------------------------------
    const momentumGroup = new THREE.Group();
    hypothesisGroup.add(momentumGroup);

    // 8 colliding puzzle cubes (boundary cells of a 4D Tesseract)
    const puzzleCubesGroup = new THREE.Group();
    const cubeGeo = new THREE.BoxGeometry(0.8, 0.8, 0.8);
    const cubeMats: THREE.MeshStandardMaterial[] = [];
    const puzzleCubeMeshes: THREE.Mesh[] = [];

    const cubeColors = [
      0x06b6d4, 0x3b82f6, 0x8b5cf6, 0xec4899,
      0xf59e0b, 0x10b981, 0x6366f1, 0x14b8a6,
    ];

    for (let i = 0; i < 8; i++) {
      const mat = new THREE.MeshStandardMaterial({
        color: cubeColors[i],
        roughness: 0.25,
        metalness: 0.3,
        transparent: true,
        opacity: 0.85,
      });
      cubeMats.push(mat);
      const cube = new THREE.Mesh(cubeGeo, mat);
      puzzleCubesGroup.add(cube);
      puzzleCubeMeshes.push(cube);
    }
    momentumGroup.add(puzzleCubesGroup);

    // Collision impact flash / shockwave ring
    const shockwaveGeo = new THREE.RingGeometry(0.1, 0.4, 32);
    const shockwaveMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0,
    });
    const shockwaveMesh = new THREE.Mesh(shockwaveGeo, shockwaveMat);
    shockwaveMesh.rotation.x = Math.PI / 2;
    momentumGroup.add(shockwaveMesh);

    // Fused 4D result wireframe indicator
    const fusedWireGeo = new THREE.BoxGeometry(1.6, 1.6, 1.6);
    const fusedWireMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0,
    });
    const fusedWireMesh = new THREE.Mesh(fusedWireGeo, fusedWireMat);
    momentumGroup.add(fusedWireMesh);

    // ----------------------------------------------------
    // ANIMATION & TICK LOOP
    // ----------------------------------------------------
    let frameId = 0;
    let clock = new THREE.Clock();
    let shockwaveAlpha = 0;

    // Software WebGL pacing callback
    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    function tick() {
      const dt = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();
      const st = stateRef.current;

      // Toggle group visibility based on active hypothesis
      overlappingGroup.visible = st.hypothesis === 'overlapping';
      constrictiveGroup.visible = st.hypothesis === 'constrictive_force';
      expansionGroup.visible = st.hypothesis === 'ever_expansion';
      collapseGroup.visible = st.hypothesis === 'big_bang_collapse';
      momentumGroup.visible = st.hypothesis === 'momentum_collision';

      // ----------------------------------------------------
      // UPDATE 1: OVERLAPPING HYPOTHESIS
      // ----------------------------------------------------
      if (st.hypothesis === 'overlapping') {
        const { dimensionLevel, overlapCount, epicenterRadius, hyperAngleW } = st.overlappingParams;

        // Sub-states visibility
        points0DMesh.visible = dimensionLevel === '0D_to_1D';
        line1DMesh.visible = dimensionLevel === '0D_to_1D' || dimensionLevel === '1D_to_2D';
        planes2DGroup.visible = dimensionLevel === '1D_to_2D';
        epicentralGroup.visible = dimensionLevel === '2D_to_3D';
        tesseractMesh.visible = dimensionLevel === '3D_to_4D';
        tesseractPointsMesh.visible = dimensionLevel === '3D_to_4D';

        if (dimensionLevel === '0D_to_1D') {
          // Pulse 0D points collapsing into 1D continuous beam
          const pos = points0DGeo.attributes.position.array as Float32Array;
          for (let i = 0; i < pointCount0D; i++) {
            const speed = (i + 1) * 0.15;
            pos[i * 3 + 1] = Math.sin(elapsedTime * 3 + speed) * 0.04 * (1 - overlapCount / 32);
          }
          points0DGeo.attributes.position.needsUpdate = true;
          line1DMat.opacity = Math.min(1, overlapCount / 8);
        } else if (dimensionLevel === '1D_to_2D') {
          // Stack 1D lines into a 2D sheet
          planes2DGroup.children.forEach((child, idx) => {
            child.visible = idx < overlapCount;
            if (child.visible) {
              child.position.y = (idx - overlapCount / 2) * 0.18;
              child.rotation.z = Math.sin(elapsedTime + idx * 0.2) * 0.05;
            }
          });
        } else if (dimensionLevel === '2D_to_3D') {
          // Epicentral all-direction phenomenon
          epicentralGroup.children.forEach((child, idx) => {
            child.visible = idx < overlapCount;
            const mesh = child as THREE.Mesh;
            mesh.scale.setScalar(epicenterRadius * (1 + Math.sin(elapsedTime * 1.5 + idx * 0.4) * 0.06));
          });
          epicentralGroup.rotation.y += 0.006;
          epicentralGroup.rotation.x += 0.003;
        } else if (dimensionLevel === '3D_to_4D') {
          // 4D Tesseract projection with hyper-rotation in XW and YW
          const rotAngle = elapsedTime * 0.6 + hyperAngleW;
          const posArr = tesseractLinesGeo.attributes.position.array as Float32Array;
          const pointPosArr = tesseractPointsGeo.attributes.position.array as Float32Array;

          // Projected vertices cache
          const projectedVertices: [number, number, number][] = [];
          for (let i = 0; i < tesseractData.vertices.length; i++) {
            const rotated = rotate4D(
              tesseractData.vertices[i],
              rotAngle * 0.8,
              rotAngle * 0.5,
              rotAngle * 0.3
            );
            const p3 = project4Dto3D(rotated, 2.6);
            projectedVertices.push(p3);
            pointPosArr[i * 3] = p3[0];
            pointPosArr[i * 3 + 1] = p3[1];
            pointPosArr[i * 3 + 2] = p3[2];
          }
          tesseractPointsGeo.attributes.position.needsUpdate = true;

          // Update edge lines
          let lineIdx = 0;
          for (let i = 0; i < tesseractData.edges.length; i++) {
            const edge = tesseractData.edges[i];
            const pStart = projectedVertices[edge.start];
            const pEnd = projectedVertices[edge.end];

            posArr[lineIdx++] = pStart[0];
            posArr[lineIdx++] = pStart[1];
            posArr[lineIdx++] = pStart[2];

            posArr[lineIdx++] = pEnd[0];
            posArr[lineIdx++] = pEnd[1];
            posArr[lineIdx++] = pEnd[2];
          }
          tesseractLinesGeo.attributes.position.needsUpdate = true;
        }
      }

      // ----------------------------------------------------
      // UPDATE 2: CONSTRICTIVE FORCE & EQUILIBRIUM
      // ----------------------------------------------------
      if (st.hypothesis === 'constrictive_force') {
        const { inwardForce, basalPoint, extraLength, is4DActive, forceZ } = st.constrictiveParams;

        // Core radius depends on constriction vs basal lock
        // At inwardForce < basalPoint, structure is actively contracting
        // At inwardForce >= basalPoint, active counter force halts further constriction
        const isLocked = inwardForce >= basalPoint;
        const currentRadius = isLocked
          ? basalPoint * 0.85
          : Math.max(0.3, 1.8 - (inwardForce / basalPoint) * 0.95);

        coreMesh.scale.setScalar(currentRadius);
        // Change material color to indicate integrity force locked
        coreMat.color.setHex(isLocked ? 0x10b981 : 0x06b6d4);

        // Update filament lines pulling towards center
        const linePos = filamentLinesGeo.attributes.position.array as Float32Array;
        let lIdx = 0;
        for (let i = 0; i < filamentCount; i++) {
          const theta = (i / filamentCount) * Math.PI * 2;
          const phi = (i % 6) * (Math.PI / 6);
          const outerR = 2.4 + Math.sin(elapsedTime * 2 + i) * 0.2;

          const x0 = Math.sin(phi) * Math.cos(theta) * outerR;
          const y0 = Math.cos(phi) * outerR * 0.7;
          const z0 = Math.sin(phi) * Math.sin(theta) * outerR;

          const x1 = Math.sin(phi) * Math.cos(theta) * currentRadius;
          const y1 = Math.cos(phi) * currentRadius * 0.7;
          const z1 = Math.sin(phi) * Math.sin(theta) * currentRadius;

          linePos[lIdx++] = x0;
          linePos[lIdx++] = y0;
          linePos[lIdx++] = z0;
          linePos[lIdx++] = x1;
          linePos[lIdx++] = y1;
          linePos[lIdx++] = z1;
        }
        filamentLinesGeo.attributes.position.needsUpdate = true;

        // Passive Gravity rings beyond basal point
        gravityGroup.visible = isLocked && extraLength > 0.05;
        gravityGroup.children.forEach((ring, idx) => {
          ring.scale.setScalar(1 + extraLength * 0.4);
          ring.rotation.z += 0.005 * (idx + 1);
        });

        // 4D Force Z Polytope (24-Cell)
        forceZMesh.visible = is4DActive;
        if (is4DActive) {
          const fzScale = Math.max(0.4, 1.4 - forceZ * 0.3);
          const rotAngle = elapsedTime * 0.7;
          const posArr = forceZLinesGeo.attributes.position.array as Float32Array;

          const proj24: [number, number, number][] = [];
          for (let i = 0; i < cell24Data.vertices.length; i++) {
            const v = cell24Data.vertices[i];
            const rot = rotate4D(
              { x: v.x * fzScale, y: v.y * fzScale, z: v.z * fzScale, w: v.w * fzScale },
              rotAngle * 0.7,
              rotAngle * 0.4,
              rotAngle * 0.5
            );
            proj24.push(project4Dto3D(rot, 2.5));
          }

          let pIdx = 0;
          for (let i = 0; i < cell24Data.edges.length; i++) {
            const edge = cell24Data.edges[i];
            const pA = proj24[edge.start];
            const pB = proj24[edge.end];
            posArr[pIdx++] = pA[0];
            posArr[pIdx++] = pA[1];
            posArr[pIdx++] = pA[2];
            posArr[pIdx++] = pB[0];
            posArr[pIdx++] = pB[1];
            posArr[pIdx++] = pB[2];
          }
          forceZLinesGeo.attributes.position.needsUpdate = true;
        }
      }

      // ----------------------------------------------------
      // UPDATE 3: EVER EXPANSION & SPACE UNITS
      // ----------------------------------------------------
      if (st.hypothesis === 'ever_expansion') {
        const { spaceUnits, isTippedTo3D, isTippedTo4D } = st.everExpansionParams;

        voxelMesh.count = Math.min(spaceUnits, maxSpaceUnits);
        const side = Math.ceil(Math.cbrt(voxelMesh.count));
        const spacing = 0.42;

        let instIdx = 0;
        for (let x = 0; x < side; x++) {
          for (let y = 0; y < side; y++) {
            for (let z = 0; z < side; z++) {
              if (instIdx >= voxelMesh.count) break;

              // If not tipped to 3D, keep flat in Y=0 plane
              const posX = (x - side / 2) * spacing;
              const posY = isTippedTo3D ? (y - side / 2) * spacing : 0;
              const posZ = (z - side / 2) * spacing;

              _vec3A.set(posX, posY, posZ);
              if (isTippedTo4D) {
                // Add hyper-pulsation in spatial positions
                _vec3A.multiplyScalar(1 + Math.sin(elapsedTime * 2 + instIdx * 0.1) * 0.12);
              }

              const mat4 = new THREE.Matrix4().setPosition(_vec3A);
              voxelMesh.setMatrixAt(instIdx, mat4);

              // Tint based on tipping state
              if (isTippedTo4D) {
                _colorA.setHex(0xa855f7); // Purple for 4D
              } else if (isTippedTo3D) {
                _colorA.setHex(0x06b6d4); // Cyan for 3D
              } else {
                _colorA.setHex(0x38bdf8); // Light blue for 2D
              }
              voxelMesh.setColorAt(instIdx, _colorA);

              instIdx++;
            }
          }
        }
        voxelMesh.instanceMatrix.needsUpdate = true;
        if (voxelMesh.instanceColor) voxelMesh.instanceColor.needsUpdate = true;

        boundaryMesh.scale.setScalar(1 + (spaceUnits / 500) * 0.8);
        boundaryMesh.rotation.y = elapsedTime * 0.15;
      }

      // ----------------------------------------------------
      // UPDATE 4: BIG BANG COLLAPSE
      // ----------------------------------------------------
      if (st.hypothesis === 'big_bang_collapse') {
        const { collapseProgress, residualForce } = st.bigBangParams;

        // Precursor 4D hull decays as collapse progresses
        collapseHullMesh.scale.setScalar(Math.max(0.1, 2.6 * (1 - collapseProgress * 0.9)));
        collapseHullMat.opacity = Math.max(0.05, 0.6 * (1 - collapseProgress));
        collapseHullMesh.rotation.y = elapsedTime * 0.4;
        collapseHullMesh.rotation.x = elapsedTime * 0.2;

        // Galaxy accumulation flourishes in mid-to-late collapse
        galaxyMesh.visible = collapseProgress > 0.15;
        if (galaxyMesh.visible) {
          galaxyMesh.rotation.y = elapsedTime * (0.2 + residualForce * 0.3);
          const spreadFactor = 0.5 + collapseProgress * 0.8;
          galaxyMesh.scale.set(spreadFactor, 1, spreadFactor);
        }
      }

      // ----------------------------------------------------
      // UPDATE 5: TIME & HIGH-MOMENTUM COLLISION
      // ----------------------------------------------------
      if (st.hypothesis === 'momentum_collision') {
        const { timeState, momentumIntensity } = st.momentumParams;
        const isTimeActive = timeState === 'active';

        // Collision threshold: 450 momentum required for puzzle-piece lock
        const adheres = momentumIntensity >= 450;

        if (isTimeActive) {
          const speed = (momentumIntensity / 500) * 2.5;
          const cycle = (elapsedTime * speed) % 2.0; // 0 to 2 seconds loop

          // Move 8 cubes inward towards (0,0,0)
          const cubeOffsets = [
            [-1, -1, -1], [1, -1, -1], [-1, 1, -1], [1, 1, -1],
            [-1, -1, 1], [1, -1, 1], [-1, 1, 1], [1, 1, 1],
          ];

          cubeOffsets.forEach(([dx, dy, dz], idx) => {
            const cube = puzzleCubeMeshes[idx];
            if (adheres && cycle > 1.4) {
              // Locked in contact (puzzle piece adherence)
              cube.position.set(dx * 0.45, dy * 0.45, dz * 0.45);
              cube.rotation.set(0, 0, 0);
            } else {
              // Flying inward
              const dist = Math.max(0.45, 2.8 - cycle * 1.5);
              cube.position.set(dx * dist, dy * dist, dz * dist);
              cube.rotation.x = cycle * 3;
              cube.rotation.y = cycle * 2;
            }
          });

          // Impact shockwave ring
          if (cycle > 1.35 && cycle < 1.6) {
            shockwaveAlpha = Math.min(1, shockwaveAlpha + 0.1);
            shockwaveMesh.scale.setScalar(1 + (cycle - 1.35) * 8);
          } else {
            shockwaveAlpha = Math.max(0, shockwaveAlpha - 0.05);
          }
          shockwaveMat.opacity = shockwaveAlpha;

          // Fused 4D Tesseract wireframe indicator
          fusedWireMesh.visible = adheres && cycle > 1.4;
          if (fusedWireMesh.visible) {
            fusedWireMat.opacity = Math.min(0.8, (cycle - 1.4) * 2);
            fusedWireMesh.rotation.y = elapsedTime * 0.8;
          }
        } else {
          // Frozen Time: structures suspended motionless
          shockwaveMat.opacity = 0;
          fusedWireMesh.visible = false;
        }
      }

      // Telemetry update broadcast (throttled to every 10 frames)
      if (Math.floor(elapsedTime * 60) % 10 === 0) {
        let effDim = 3.0;
        let netF = 0;
        let adh = 0;
        let su = st.everExpansionParams.spaceUnits;

        if (st.hypothesis === 'overlapping') {
          if (st.overlappingParams.dimensionLevel === '0D_to_1D') effDim = 1.0;
          else if (st.overlappingParams.dimensionLevel === '1D_to_2D') effDim = 2.0;
          else if (st.overlappingParams.dimensionLevel === '2D_to_3D') effDim = 3.0;
          else effDim = 4.0;
        } else if (st.hypothesis === 'constrictive_force') {
          effDim = st.constrictiveParams.is4DActive ? 4.0 : 3.0;
          netF = Math.abs(st.constrictiveParams.inwardForce - st.constrictiveParams.basalPoint);
        } else if (st.hypothesis === 'ever_expansion') {
          if (st.everExpansionParams.isTippedTo4D) effDim = 4.0;
          else if (st.everExpansionParams.isTippedTo3D) effDim = 3.0;
          else effDim = 2.0;
        } else if (st.hypothesis === 'big_bang_collapse') {
          effDim = 4.0 - st.bigBangParams.collapseProgress * 3.0;
        } else if (st.hypothesis === 'momentum_collision') {
          adh = st.momentumParams.momentumIntensity >= 450 ? 100 : Math.round((st.momentumParams.momentumIntensity / 450) * 85);
          effDim = adh === 100 ? 4.0 : 3.0;
        }

        onTelemetryUpdate({
          effectiveDim: parseFloat(effDim.toFixed(2)),
          spaceUnits: su,
          netForce: parseFloat(netF.toFixed(3)),
          adherence: adh,
        });

        sound.updateAmbientPitch(effDim);
      }

      controls.update();
      renderer.render(scene, camera);

      if (isSoftwareGl) afterDraw(tick);
      else frameId = requestAnimationFrame(tick);
    }

    // Start loop
    if (isSoftwareGl) afterDraw(tick);
    else frameId = requestAnimationFrame(tick);

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []); // Run once on mount

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing overflow-hidden"
    />
  );
};
