/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Vector4D {
  x: number;
  y: number;
  z: number;
  w: number;
}

export interface Edge4D {
  start: number;
  end: number;
}

export interface Cell4D {
  indices: number[];
  color?: string;
}

/**
 * Rotates a 4D vector in the XW, YW, and ZW planes
 */
export function rotate4D(
  v: Vector4D,
  angleXW: number,
  angleYW: number,
  angleZW: number,
  angleXY: number = 0
): Vector4D {
  let { x, y, z, w } = v;

  // XY Rotation
  if (angleXY !== 0) {
    const c = Math.cos(angleXY);
    const s = Math.sin(angleXY);
    const newX = x * c - y * s;
    const newY = x * s + y * c;
    x = newX;
    y = newY;
  }

  // XW Rotation
  if (angleXW !== 0) {
    const c = Math.cos(angleXW);
    const s = Math.sin(angleXW);
    const newX = x * c - w * s;
    const newW = x * s + w * c;
    x = newX;
    w = newW;
  }

  // YW Rotation
  if (angleYW !== 0) {
    const c = Math.cos(angleYW);
    const s = Math.sin(angleYW);
    const newY = y * c - w * s;
    const newW = y * s + w * c;
    y = newY;
    w = newW;
  }

  // ZW Rotation
  if (angleZW !== 0) {
    const c = Math.cos(angleZW);
    const s = Math.sin(angleZW);
    const newZ = z * c - w * s;
    const newW = z * s + w * c;
    z = newZ;
    w = newW;
  }

  return { x, y, z, w };
}

/**
 * Projects a 4D point to 3D with perspective distance d
 */
export function project4Dto3D(
  v: Vector4D,
  cameraDistance4D: number = 2.4
): [number, number, number] {
  const factor = cameraDistance4D / Math.max(0.1, cameraDistance4D - v.w);
  return [v.x * factor, v.y * factor, v.z * factor];
}

/**
 * Generates vertices and edges for a Tesseract (8-Cell / 4D Hypercube)
 * Size normalized to range [-1, 1]
 */
export function createTesseract(): { vertices: Vector4D[]; edges: Edge4D[] } {
  const vertices: Vector4D[] = [];
  for (let i = 0; i < 16; i++) {
    vertices.push({
      x: (i & 1 ? 1 : -1) * 0.75,
      y: (i & 2 ? 1 : -1) * 0.75,
      z: (i & 4 ? 1 : -1) * 0.75,
      w: (i & 8 ? 1 : -1) * 0.75,
    });
  }

  const edges: Edge4D[] = [];
  for (let i = 0; i < 16; i++) {
    for (let bit = 0; bit < 4; bit++) {
      const neighbor = i ^ (1 << bit);
      if (neighbor > i) {
        edges.push({ start: i, end: neighbor });
      }
    }
  }

  return { vertices, edges };
}

/**
 * Generates vertices and edges for a 24-Cell (Octaplex / Hyper-diamond)
 * A unique 4D regular polytope with 24 octahedral cells
 */
export function create24Cell(): { vertices: Vector4D[]; edges: Edge4D[] } {
  const vertices: Vector4D[] = [];

  // Permutations of (±1, ±1, 0, 0)
  const coords = [
    [1, 1, 0, 0], [1, -1, 0, 0], [-1, 1, 0, 0], [-1, -1, 0, 0],
    [1, 0, 1, 0], [1, 0, -1, 0], [-1, 0, 1, 0], [-1, 0, -1, 0],
    [1, 0, 0, 1], [1, 0, 0, -1], [-1, 0, 0, 1], [-1, 0, 0, -1],
    [0, 1, 1, 0], [0, 1, -1, 0], [0, -1, 1, 0], [0, -1, -1, 0],
    [0, 1, 0, 1], [0, 1, 0, -1], [0, -1, 0, 1], [0, -1, 0, -1],
    [0, 0, 1, 1], [0, 0, 1, -1], [0, 0, -1, 1], [0, 0, -1, -1],
  ];

  coords.forEach(([x, y, z, w]) => {
    vertices.push({ x: x * 0.8, y: y * 0.8, z: z * 0.8, w: w * 0.8 });
  });

  const edges: Edge4D[] = [];
  // Distance squared between adjacent vertices in standard 24-cell is 2 (or (sqrt(2)*0.8)^2 = 1.28)
  for (let i = 0; i < vertices.length; i++) {
    for (let j = i + 1; j < vertices.length; j++) {
      const dx = vertices[i].x - vertices[j].x;
      const dy = vertices[i].y - vertices[j].y;
      const dz = vertices[i].z - vertices[j].z;
      const dw = vertices[i].w - vertices[j].w;
      const distSq = dx * dx + dy * dy + dz * dz + dw * dw;
      if (Math.abs(distSq - 1.28) < 0.05) {
        edges.push({ start: i, end: j });
      }
    }
  }

  return { vertices, edges };
}

/**
 * Generates sample points on a 4D Hypersphere (Glome)
 * Uniformly distributed across 3-sphere manifold
 */
export function createHyperspherePoints(count: number = 300, radius: number = 1.0): Vector4D[] {
  const points: Vector4D[] = [];
  for (let i = 0; i < count; i++) {
    // Marsaglia / Muller method for uniform distribution on S^3
    const u1 = Math.random() * 2 - 1;
    const u2 = Math.random() * 2 - 1;
    const s1 = u1 * u1 + u2 * u2;
    if (s1 >= 1) continue;

    const u3 = Math.random() * 2 - 1;
    const u4 = Math.random() * 2 - 1;
    const s2 = u3 * u3 + u4 * u4;
    if (s2 >= 1) continue;

    const factor = Math.sqrt((1 - s1) / s2);
    const x = u1;
    const y = u2;
    const z = u3 * factor;
    const w = u4 * factor;

    const len = Math.sqrt(x * x + y * y + z * z + w * w);
    points.push({
      x: (x / len) * radius,
      y: (y / len) * radius,
      z: (z / len) * radius,
      w: (w / len) * radius,
    });
  }
  return points;
}
