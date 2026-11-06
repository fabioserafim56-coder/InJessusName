import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { explorationLandmarks, innFootprint, worldBounds, worldPoints } from "@/content/games3d";
import { createWorldMaterials, type WorldMaterials } from "./art/materials";
import { makeHuman, type HumanRig } from "./art/human-rig";

export { makeHuman, type HumanRig } from "./art/human-rig";
export type CircleObstacle = { x: number; z: number; radius: number };
export type RectObstacle = { minX: number; maxX: number; minZ: number; maxZ: number };
export type WorldArt = {
  player: HumanRig; traveler: HumanRig; keeper: HumanRig; donkey: THREE.Group; rider: HumanRig;
  supplies: THREE.Group; marker: THREE.Group; obstacles: CircleObstacle[];
  architecture: THREE.Group; door: THREE.Group; roof: THREE.Mesh; bed: THREE.Group;
  wallRects: RectObstacle[]; landmarkMarkers: THREE.Group[];
  careTools: Record<"cloth" | "oil-wine" | "bandage", THREE.Object3D>;
  materialsReady: Promise<void>; disposeAssets: () => void;
};

const palette = { sand: 0xc4b18a, limestone: 0xb8a68b, rock: 0xa89879, clay: 0x9a6b4b, wood: 0x7e6649, olive: 0x64735b };
const rng = (seed: number) => { let n = seed; return () => { n = n * 16807 % 2147483647; return (n - 1) / 2147483646; }; };
const material = (color: number | string, extra: THREE.MeshStandardMaterialParameters = {}) => new THREE.MeshStandardMaterial({ color, roughness: .96, metalness: 0, ...extra });
const insideRoom = (x: number, z: number) => x > innFootprint.minX && x < innFootprint.maxX && z > innFootprint.minZ && z < innFootprint.maxZ;

/** The compact road is an authored game route, not a geographical survey. */
export function roadCenter(z: number) {
  const fadeAtBridge = THREE.MathUtils.smoothstep(Math.abs(z + 5), 5, 22);
  return (Math.sin(z * .056) * 3.0 + Math.sin(z * .115) * .6) * fadeAtBridge;
}

export function surfaceHeight(x: number, z: number) {
  const roadDistance = Math.abs(x - roadCenter(z));
  const shoulder = THREE.MathUtils.smoothstep(roadDistance, 3.4, 18);
  const base = .15 * Math.sin(z * .038) + .08 * Math.sin(z * .11);
  const slope = shoulder * Math.max(.35, 1.1 + Math.sin(x * .13 + z * .022) * 1.3 + Math.cos(z * .077) * .6);
  let result = base + slope;
  // A dry wadi makes the bridge a meaningful spatial crossing. The deck is flat.
  const wadi = 1 - THREE.MathUtils.smoothstep(Math.abs(z + 5), 4, 10);
  result -= wadi * 3.5;
  if (Math.abs(x) <= 3.6 && z >= -12.3 && z <= 2.3) result = .34;
  const courtX = Math.max(0, Math.abs(x - 5) - 11), courtZ = Math.max(0, Math.abs(z + 60) - 12);
  const court = 1 - THREE.MathUtils.smoothstep(Math.hypot(courtX, courtZ), 0, 7);
  result = THREE.MathUtils.lerp(result, .06, court);
  const lookout = 1 - THREE.MathUtils.smoothstep(Math.hypot(x + 10, z - 49), 2, 6);
  result = THREE.MathUtils.lerp(result, .65, lookout * .75);
  return result;
}

function addMesh(geo: THREE.BufferGeometry, mat: THREE.Material, parent: THREE.Object3D, xyz: [number, number, number], shadow = true) {
  const mesh = new THREE.Mesh(geo, mat); mesh.position.set(...xyz); mesh.castShadow = shadow; mesh.receiveShadow = true; parent.add(mesh); return mesh;
}
function tintGeometry(geo: THREE.BufferGeometry, color: THREE.Color) {
  const colors = new Float32Array(geo.getAttribute("position").count * 3);
  for (let i = 0; i < colors.length; i += 3) color.toArray(colors, i);
  geo.setAttribute("color", new THREE.BufferAttribute(colors, 3)); return geo;
}
function stoneBatch(parent: THREE.Object3D, mat: THREE.Material, seed: number) {
  const geometries: THREE.BufferGeometry[] = [], random = rng(seed), color = new THREE.Color();
  const add = (width: number, height: number, depth: number, x: number, y: number, z: number, angleX = 0, angleY = 0) => {
    const geo = new THREE.BoxGeometry(width, height, depth); geo.rotateX(angleX); geo.rotateY(angleY); geo.translate(x, y, z);
    color.setHSL(.10 + random() * .015, .13 + random() * .05, .68 + random() * .13); tintGeometry(geo, color);
    const p = geo.getAttribute("position"), n = geo.getAttribute("normal"), uv = new Float32Array(p.count * 2);
    for (let i = 0; i < p.count; i++) { uv[i * 2] = (Math.abs(n.getX(i)) > .6 ? p.getZ(i) : p.getX(i)) / 4; uv[i * 2 + 1] = (Math.abs(n.getY(i)) > .6 ? p.getZ(i) : p.getY(i)) / 4; }
    geo.setAttribute("uv", new THREE.BufferAttribute(uv, 2)); geometries.push(geo);
  };
  return { add, finish() { const merged = mergeGeometries(geometries, false); geometries.forEach(geo => geo.dispose()); return addMesh(merged, mat, parent, [0, 0, 0]); } };
}

function ground(scene: THREE.Scene, materials: WorldMaterials) {
  const sand = new THREE.Color(0xe6d9b8), slopeShade = new THREE.Color(0xc5c4a1), color = new THREE.Color();
  const geo = new THREE.PlaneGeometry(220, 270, 110, 135); geo.rotateX(-Math.PI / 2);
  const positions = geo.getAttribute("position"), colors = new Float32Array(positions.count * 3);
  for (let i = 0; i < positions.count; i++) {
    const x = positions.getX(i), z = positions.getZ(i); positions.setY(i, surfaceHeight(x, z) - .025);
    const variation = (Math.sin(x * .5 + z * .6) + Math.sin(z * .3 - x * .23)) * .035;
    color.copy(sand).lerp(slopeShade, THREE.MathUtils.clamp((Math.abs(x - roadCenter(z)) - 5) / 55 + variation, 0, .5)); color.toArray(colors, i * 3);
  }
  geo.setAttribute("color", new THREE.BufferAttribute(colors, 3)); geo.computeVertexNormals(); addMesh(geo, materials.ground, scene, [0, 0, 0], false);
  const paths: { points: THREE.Vector3[]; width: number }[] = [
    { points: Array.from({ length: 183 }, (_, i) => { const z = 91 - i; return new THREE.Vector3(roadCenter(z), 0, z); }), width: 2.65 },
    { points: [new THREE.Vector3(roadCenter(-43), 0, -43), new THREE.Vector3(2, 0, -47), new THREE.Vector3(5, 0, -51), new THREE.Vector3(5, 0, -56)], width: 2.0 },
    { points: [new THREE.Vector3(roadCenter(49), 0, 49), new THREE.Vector3(-5, 0, 47), new THREE.Vector3(-10, 0, 49)], width: 1.25 },
    { points: [new THREE.Vector3(roadCenter(18), 0, 18), new THREE.Vector3(5, 0, 18), new THREE.Vector3(10, 0, 18)], width: 1.15 },
    { points: [new THREE.Vector3(roadCenter(-44), 0, -44), new THREE.Vector3(-4, 0, -44), new THREE.Vector3(-8, 0, -46)], width: 1.35 },
  ];
  const vertices: number[] = [], indices: number[] = [], uv: number[] = [], rgb: number[] = [];
  paths.forEach(path => {
    const curve = new THREE.CatmullRomCurve3(path.points), samples = Math.max(20, path.points.length * 2), points = curve.getPoints(samples), offset = vertices.length / 3;
    let travelled = 0;
    points.forEach((point, i) => {
      const before = points[Math.max(0, i - 1)], after = points[Math.min(points.length - 1, i + 1)];
      const dx = after.x - before.x, dz = after.z - before.z, distance = Math.hypot(dx, dz) || 1;
      if (i) travelled += point.distanceTo(points[i - 1]);
      for (const side of [-1, 0, 1]) {
        const width = path.width * (1 + Math.sin(point.z * .73) * .045), x = point.x + dz / distance * width * side, z = point.z - dx / distance * width * side;
        vertices.push(x, surfaceHeight(x, z) + .018, z); uv.push((side + 1) / 2, travelled / 20);
        const shade = side === 0 ? 1.0 : .91; rgb.push(shade, shade, shade * .99);
      }
      if (i < points.length - 1) { const a = offset + i * 3; indices.push(a, a + 3, a + 1, a + 1, a + 3, a + 4, a + 1, a + 4, a + 2, a + 2, a + 4, a + 5); }
    });
  });
  // The outdoor road ends at the room rather than drawing through its floor/rug.
  const outdoorIndices: number[] = [];
  for (let i = 0; i < indices.length; i += 3) {
    const triangle = indices.slice(i, i + 3);
    const x = triangle.reduce((sum, index) => sum + vertices[index * 3], 0) / 3;
    const z = triangle.reduce((sum, index) => sum + vertices[index * 3 + 2], 0) / 3;
    if (!insideRoom(x, z)) outdoorIndices.push(...triangle);
  }
  const road = new THREE.BufferGeometry(); road.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3)); road.setAttribute("normal", new THREE.Float32BufferAttribute(vertices.map((_, i) => i % 3 === 1 ? 1 : 0), 3)); road.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2)); road.setAttribute("color", new THREE.Float32BufferAttribute(rgb, 3)); road.setIndex(outdoorIndices); road.computeVertexNormals(); addMesh(road, materials.road, scene, [0, 0, 0], false);
}

function cliffs(scene: THREE.Scene) {
  const random = rng(644), color = new THREE.Color();
  const vertices: number[] = [], indices: number[] = [], colors: number[] = [];
  for (const side of [-1, 1]) {
    const offset = vertices.length / 3, columns = 90, rows = 12;
    for (let iz = 0; iz <= columns; iz++) {
      const z = -140 + iz * 3.1, center = side * (46 + Math.sin(z * .035) * 9 + Math.cos(z * .09) * 3);
      for (let iy = 0; iy <= rows; iy++) {
        const t = iy / rows, height = Math.sin(t * Math.PI / 2) * (24 + Math.sin(z * .025 + side) * 9 + Math.sin(z * .077) * 3);
        const x = center + side * (t * 30 + Math.sin(t * 8 + z * .13) * 1.1), y = height + Math.sin(z * .12 + t * 4) * .7 - 1;
        vertices.push(x, y, z);
        const strata = Math.sin(height * 2.1) * .018 + Math.sin(height * 6.5) * .012;
        color.setHSL(.095 + t * .01, .16 + t * .04, .58 + t * .10 + strata + random() * .018); color.toArray(colors, colors.length);
        if (iz < columns && iy < rows) { const a = offset + iz * (rows + 1) + iy, b = a + rows + 1; if (side < 0) indices.push(a, b, a + 1, a + 1, b, b + 1); else indices.push(a, a + 1, b, a + 1, b + 1, b); }
      }
    }
  }
  const geo = new THREE.BufferGeometry(); geo.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3)); geo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3)); geo.setIndex(indices); geo.computeVertexNormals(); addMesh(geo, material(0xffffff, { vertexColors: true, side: THREE.DoubleSide }), scene, [0, 0, 0], false);
}

function leafTexture() {
  const canvas = document.createElement("canvas"); canvas.width = canvas.height = 128; const context = canvas.getContext("2d");
  if (!context) return null;
  const random = rng(556); context.clearRect(0, 0, 128, 128);
  for (let i = 0; i < 56; i++) {
    const angle = random() * Math.PI * 2, radius = Math.sqrt(random()) * 51, x = 64 + Math.cos(angle) * radius, y = 64 + Math.sin(angle) * radius * .75;
    context.save(); context.translate(x, y); context.rotate(angle); context.fillStyle = `hsl(${80 + random() * 22} 16% ${35 + random() * 22}%)`; context.beginPath(); context.ellipse(0, 0, 4.5 + random() * 3, 1.7 + random(), 0, 0, Math.PI * 2); context.fill(); context.restore();
  }
  const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace; return texture;
}

function landscape(scene: THREE.Scene, obstacles: CircleObstacle[]) {
  const random = rng(1042), dummy = new THREE.Object3D();
  const rocks = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1, 1), material(palette.rock, { flatShading: true }), 170); rocks.castShadow = rocks.receiveShadow = true;
  for (let i = 0; i < 170; i++) {
    const z = -83 + random() * 166, side = random() > .5 ? 1 : -1;
    let x = roadCenter(z) + side * (6.5 + random() * 34);
    const size = .25 + random() * 1.45;
    if ((z < -42 && z > -75 && x > -15 && x < 23) || (z < 8 && z > -18 && Math.abs(x) < 8)) x = side * (25 + random() * 11);
    // Keep observation points and their approaches clear without changing the
    // seeded placement of other rocks or removing their physical collisions.
    if (explorationLandmarks.some(landmark => Math.hypot(x - landmark.point.x, z - landmark.point.z) < landmark.radius + size + 2.5)) x = side * (32 + size * 2);
    dummy.position.set(x, surfaceHeight(x, z) + size * .28, z); dummy.rotation.set(random(), random() * 6, random()); dummy.scale.set(size * (1.2 + random()), size * .65, size); dummy.updateMatrix(); rocks.setMatrixAt(i, dummy.matrix);
    rocks.setColorAt(i, new THREE.Color().setHSL(.095 + random() * .02, .1 + random() * .08, .47 + random() * .17));
    if (size > .85 && Math.abs(x) < 40) obstacles.push({ x, z, radius: size * .80 });
  }
  scene.add(rocks);
  const pebbles = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1, 0), material(0xafa28b), 330);
  for (let i = 0; i < 330; i++) {
    const z = -80 + random() * 160, x = roadCenter(z) + (random() > .5 ? 1 : -1) * (2.8 + random() * 1.0), size = .025 + random() * .075;
    dummy.position.set(x, surfaceHeight(x, z) + size * .25, z); dummy.rotation.set(random(), random() * 6, random()); dummy.scale.set(size * 1.9, size * .7, size); if (insideRoom(x, z)) dummy.scale.setScalar(0); dummy.updateMatrix(); pebbles.setMatrixAt(i, dummy.matrix);
  }
  scene.add(pebbles);
  const treePositions: [number, number][] = [[-10, 61], [13, 57], [-15, 44], [12, 39], [-14, 33], [12, 18], [-13, 15], [-18, 6], [19, 7], [-17, -20], [14, -23], [-15, -31], [-16, -44], [19, -47], [23, -60], [-12, -72], [22, -76], [-30, 64], [30, 43], [-30, 25], [32, -16], [28, -35], [-28, -58], [-26, -76]];
  const trunkGeo = new THREE.CylinderGeometry(.13, .31, 3.0, 8, 4); const trunkPos = trunkGeo.getAttribute("position");
  for (let i = 0; i < trunkPos.count; i++) { const y = trunkPos.getY(i); trunkPos.setX(i, trunkPos.getX(i) + Math.sin(y * 1.4) * .17); trunkPos.setZ(i, trunkPos.getZ(i) + Math.sin(y * 2.1) * .09); } trunkGeo.computeVertexNormals();
  const trunks = new THREE.InstancedMesh(trunkGeo, material(0x71634a), treePositions.length);
  const branches = new THREE.InstancedMesh(new THREE.CylinderGeometry(.045, .115, 1.8, 6), material(0x786b50), treePositions.length * 4);
  const leaves = new THREE.InstancedMesh(new THREE.PlaneGeometry(1.8, 1.4), material(0xd0d8bd, { map: leafTexture(), alphaTest: .35, side: THREE.DoubleSide }), treePositions.length * 26);
  trunks.castShadow = branches.castShadow = leaves.castShadow = true; leaves.receiveShadow = true;
  treePositions.forEach(([x, z], i) => {
    const y = surfaceHeight(x, z), size = .8 + random() * .4; obstacles.push({ x, z, radius: .45 });
    dummy.position.set(x, y + 1.5 * size, z); dummy.rotation.set(0, random() * 6, .04); dummy.scale.setScalar(size); dummy.updateMatrix(); trunks.setMatrixAt(i, dummy.matrix);
    for (let j = 0; j < 4; j++) { const a = j * Math.PI / 2 + i; dummy.position.set(x + Math.sin(a) * .45, y + 2.65 * size, z + Math.cos(a) * .45); dummy.rotation.set(Math.cos(a) * .7, a, Math.sin(a) * .7); dummy.scale.setScalar(size); dummy.updateMatrix(); branches.setMatrixAt(i * 4 + j, dummy.matrix); }
    for (let j = 0; j < 26; j++) { const a = j * 2.39, radius = Math.sqrt((j + .5) / 26) * 1.8 * size; dummy.position.set(x + Math.sin(a) * radius, y + (3.1 + Math.cos(j * 1.73) * .65) * size, z + Math.cos(a) * radius); dummy.rotation.set(Math.sin(a) * .5, a, Math.cos(a) * .45); dummy.scale.setScalar(size * (.8 + random() * .35)); dummy.updateMatrix(); leaves.setMatrixAt(i * 26 + j, dummy.matrix); leaves.setColorAt(i * 26 + j, new THREE.Color().setHSL(.21, .12, .62 + random() * .22)); }
  });
  scene.add(trunks, branches, leaves);
  const grassGeo = new THREE.BufferGeometry(); grassGeo.setAttribute("position", new THREE.Float32BufferAttribute([-.07, 0, 0, -.025, .48, .015, .035, 0, 0, 0, 0, -.06, .015, .35, -.015, 0, 0, .04], 3)); grassGeo.computeVertexNormals();
  const grass = new THREE.InstancedMesh(grassGeo, material(0x909570, { side: THREE.DoubleSide }), 750);
  for (let i = 0; i < 750; i++) { const z = -82 + random() * 164, x = roadCenter(z) + (random() > .5 ? 1 : -1) * (3.6 + random() * 29); dummy.position.set(x, surfaceHeight(x, z), z); dummy.rotation.set(0, random() * 6.3, 0); dummy.scale.setScalar(.55 + random() * .9); if (insideRoom(x, z)) dummy.scale.setScalar(0); dummy.updateMatrix(); grass.setMatrixAt(i, dummy.matrix); grass.setColorAt(i, new THREE.Color().setHSL(.16 + random() * .06, .16, .43 + random() * .16)); } scene.add(grass);
}

function bridge(scene: THREE.Scene, stone: THREE.Material): RectObstacle[] {
  const group = new THREE.Group(); group.name = "bridge-architecture"; scene.add(group);
  const batch = stoneBatch(group, stone, 311);
  batch.add(7.2, .42, 14.6, 0, .14, -5);
  for (const side of [-1, 1]) {
    for (let i = 0; i <= 17; i++) { const z = 2 - i * .82; batch.add(.52, .70, .78, side * 3.62, .70, z); }
    for (const z of [-11.8, 1.8]) batch.add(.8, 3.2, 1.3, side * 3.45, -1.35, z);
    for (let i = 0; i < 17; i++) { const a = (i + .5) / 17 * Math.PI, z = -5 + Math.cos(a) * 6.3, y = -2.35 + Math.sin(a) * 2.45; const tangent = Math.atan2(Math.cos(a) * 2.45, -Math.sin(a) * 6.3); batch.add(.7, .48, .85, side * 3.45, y, z, -tangent); }
  }
  batch.finish();
  return [
    { minX: -4.0, maxX: -3.25, minZ: -12.2, maxZ: 2.2 }, { minX: 3.25, maxX: 4.0, minZ: -12.2, maxZ: 2.2 },
    { minX: worldBounds.minX, maxX: -3.5, minZ: -9, maxZ: -1 }, { minX: 3.5, maxX: worldBounds.maxX, minZ: -9, maxZ: -1 },
  ];
}

function furnitureMesh(geo: THREE.BufferGeometry, mat: THREE.Material, parent: THREE.Object3D, p: [number, number, number]) { return addMesh(geo, mat, parent, p); }
function buildInn(scene: THREE.Scene, materials: WorldMaterials) {
  const architecture = new THREE.Group(); architecture.name = "inn-architecture"; scene.add(architecture);
  const batch = stoneBatch(architecture, materials.stone, 81), h = 4.05, floor = .06;
  const front = innFootprint.maxZ, back = innFootprint.minZ, left = innFootprint.minX, right = innFootprint.maxX;
  for (let row = 0; row < 9; row++) {
    const y = floor + .23 + row * .44;
    for (let col = 0; col < 20; col++) {
      const x = left + .45 + col * .8 + (row % 2 ? .12 : 0), dx = x - 5;
      const archTop = 1.8 + Math.sqrt(Math.max(0, 1.7 ** 2 - dx ** 2));
      if (!(Math.abs(dx) < 1.7 && y < archTop)) batch.add(.78, .42, .62, x, y, front);
      batch.add(.78, .42, .62, x, y, back);
    }
    for (let col = 0; col < 19; col++) { const z = front - .7 - col * .8; for (const x of [left, right]) {
      const window = x === right && z < -58 && z > -61.5 && y > 1.5 && y < 2.8;
      if (!window) batch.add(.62, .42, .78, x, y, z);
    } }
  }
  for (let i = 0; i < 15; i++) { const a = Math.PI * (i + .5) / 15; batch.add(.46, .42, .83, 5 + Math.cos(a) * 1.87, floor + 1.75 + Math.sin(a) * 1.87, front, 0, 0); }
  batch.finish();
  const roof = addMesh(new THREE.BoxGeometry(16.9, .25, 16.9), material(0x9f967c), architecture, [6, h + floor + .15, -61]); roof.name = "inn-roof";
  const roomFloor = addMesh(new THREE.BoxGeometry(15.6, .06, 15.5), material(0xbda98b), architecture, [6, floor - .03, -61]); roomFloor.name = "inn-floor";
  const beams = new THREE.InstancedMesh(new THREE.BoxGeometry(.15, .20, 16), materials.wood, 8), dummy = new THREE.Object3D();
  for (let i = 0; i < 8; i++) { dummy.position.set(left + 1 + i * 2, h - .15, -61); dummy.updateMatrix(); beams.setMatrixAt(i, dummy.matrix); } beams.castShadow = true; architecture.add(beams);
  const door = new THREE.Group(); door.name = "inn-door"; door.position.set(3.3, floor, front); door.rotation.y = -1.2; architecture.add(door);
  const panel = new THREE.InstancedMesh(new THREE.BoxGeometry(.38, 2.85, .08), materials.wood, 8);
  for (let i = 0; i < 8; i++) { dummy.position.set(.19 + i * .38, 1.43, 0); dummy.updateMatrix(); panel.setMatrixAt(i, dummy.matrix); } panel.castShadow = true; door.add(panel);
  for (const y of [.45, 2.35]) furnitureMesh(new THREE.BoxGeometry(3.05, .12, .12), materials.wood, door, [1.52, y, .01]);
  const bed = new THREE.Group(); bed.name = "traveler-bed"; bed.position.set(worldPoints.bed.x, floor, worldPoints.bed.z); scene.add(bed);
  furnitureMesh(new THREE.BoxGeometry(1.75, .16, 2.8), materials.wood, bed, [0, .47, 0]);
  for (const x of [-.68, .68]) for (const z of [-1.1, 1.1]) furnitureMesh(new THREE.BoxGeometry(.14, .47, .14), materials.wood, bed, [x, .22, z]);
  furnitureMesh(new THREE.BoxGeometry(1.68, .18, 2.65), material(0xc8ba91), bed, [0, .62, 0]);
  furnitureMesh(new THREE.BoxGeometry(1.7, .06, 1.75), material(0x718277), bed, [0, .74, .38]);
  const pillow = furnitureMesh(new THREE.SphereGeometry(.45, 12, 8), material(0xddd4b7), bed, [0, .77, -1.0]); pillow.scale.set(1.3, .18, .65);
  const pots = new THREE.InstancedMesh(new THREE.LatheGeometry([new THREE.Vector2(.12, 0), new THREE.Vector2(.31, .08), new THREE.Vector2(.36, .38), new THREE.Vector2(.26, .62), new THREE.Vector2(.14, .72), new THREE.Vector2(.13, .8)], 12), material(palette.clay), 7);
  [[-1,-54.5],[12.8,-55],[12.8,-65],[-.8,-67],[10,-51],[.4,-51.2],[2,-66]].forEach(([x,z], i) => { dummy.position.set(x, floor, z); dummy.scale.setScalar(.65 + i % 3 * .15); dummy.updateMatrix(); pots.setMatrixAt(i, dummy.matrix); }); pots.castShadow = true; scene.add(pots);
  const rug = addMesh(new THREE.PlaneGeometry(4.2, 5.5), material(0x9b6d4e, { side: THREE.DoubleSide }), scene, [3.6, floor + .018, -59]); rug.rotation.x = -Math.PI / 2;
  const table = new THREE.Group(); table.position.set(1.5, floor, -59.5); scene.add(table); furnitureMesh(new THREE.BoxGeometry(1.9, .12, .9), materials.wood, table, [0, .93, 0]); for (const x of [-.7,.7]) furnitureMesh(new THREE.BoxGeometry(.1,.9,.7),materials.wood,table,[x,.43,0]);
  const awning = new THREE.Group(); awning.position.set(5, floor, front + 2.1); scene.add(awning);
  const shadeCloth = furnitureMesh(new THREE.BoxGeometry(8.6, .06, 3.5), material(0xc7b489), awning, [0, 3.13, 0]); shadeCloth.rotation.z = -.045;
  for (const x of [-3.9,3.9]) furnitureMesh(new THREE.CylinderGeometry(.07,.11,3.2,8),materials.wood,awning,[x,1.57,1.25]);
  // Solids are the visible wall footprints. The open arch is a genuine passage.
  const wallRects: RectObstacle[] = [
    {minX:left-.32,maxX:left+.32,minZ:back,maxZ:front}, {minX:right-.32,maxX:right+.32,minZ:back,maxZ:front},
    {minX:left,maxX:right,minZ:back-.32,maxZ:back+.32},
    {minX:left,maxX:3.3,minZ:front-.32,maxZ:front+.32}, {minX:6.7,maxX:right,minZ:front-.32,maxZ:front+.32},
    {minX:worldPoints.bed.x-.95,maxX:worldPoints.bed.x+.95,minZ:worldPoints.bed.z-1.5,maxZ:worldPoints.bed.z+1.5},
    {minX:.5,maxX:2.5,minZ:-60.0,maxZ:-59.0},
  ];
  return { architecture, roof, door, bed, wallRects };
}

function donkey() {
  const root = new THREE.Group(), coat = material(0x8f8a78), dark = material(0x463f33), muzzle = material(0xb4aa93), blanket = material(0x88654b);
  const body = addMesh(new THREE.CapsuleGeometry(.35,.72,6,14),coat,root,[0,.99,0]); body.rotation.x = Math.PI/2;
  for (const [i,[x,z]] of [[-.25,-.44],[-.25,.44],[.25,-.44],[.25,.44]].entries()) { const leg = new THREE.Group(); leg.name=`donkey-leg-${i}`; leg.position.set(x,.73,z); root.add(leg); addMesh(new THREE.CylinderGeometry(.057,.075,.67,8),coat,leg,[0,-.32,0]); const hoof = addMesh(new THREE.SphereGeometry(.09,8,6),dark,leg,[0,-.65,0]); hoof.scale.set(.8,.6,1.15); }
  const neck = addMesh(new THREE.CapsuleGeometry(.18,.45,5,10),coat,root,[0,1.34,-.58]);neck.rotation.x=-.5;
  const head = addMesh(new THREE.SphereGeometry(.23,12,10),coat,root,[0,1.61,-.80]);head.scale.set(.68,.93,1.5);
  const nose = addMesh(new THREE.SphereGeometry(.18,10,8),muzzle,root,[0,1.50,-1.04]);nose.scale.set(.75,.7,1.1);
  for(const side of [-1,1]){const ear=addMesh(new THREE.CapsuleGeometry(.048,.35,5,8),coat,root,[side*.1,1.98,-.72]);ear.rotation.z=side*.12;addMesh(new THREE.SphereGeometry(.018,8,6),dark,root,[side*.153,1.68,-.87]);}
  addMesh(new THREE.BoxGeometry(.53,.08,.71),blanket,root,[0,1.37,.03]);
  const tail=addMesh(new THREE.CylinderGeometry(.018,.029,.55,6),dark,root,[0,.95,.75]);tail.rotation.x=-.55;return root;
}

function bag(scene: THREE.Scene) {
  const root = new THREE.Group(); scene.add(root); root.position.set(worldPoints.supplies.x,surfaceHeight(worldPoints.supplies.x,worldPoints.supplies.z),worldPoints.supplies.z);
  addMesh(new THREE.CapsuleGeometry(.25,.22,5,12),material(0x886446),root,[0,.28,0]);
  addMesh(new THREE.TorusGeometry(.22,.025,5,14,Math.PI),material(0x5d4937),root,[0,.52,0]);
  addMesh(new THREE.CylinderGeometry(.065,.10,.29,10),material(palette.clay),root,[.36,.16,.04]);
  addMesh(new THREE.CylinderGeometry(.055,.085,.25,10),material(0x886a49),root,[-.32,.13,.10]);
  addMesh(new THREE.BoxGeometry(.28,.12,.27),material(0xe7dcc0),root,[0,.56,0]);return root;
}

function landmarkProps(scene: THREE.Scene, stone: THREE.Material, wood: THREE.Material) {
  const markers: THREE.Group[] = [];
  for (const landmark of explorationLandmarks) {
    const group = new THREE.Group();group.position.set(landmark.point.x,surfaceHeight(landmark.point.x,landmark.point.z),landmark.point.z);group.name=`landmark-${landmark.id}`;scene.add(group);
    if(landmark.id === "mirante"){
      const batch=stoneBatch(group,stone,17);for(let i=0;i<8;i++)batch.add(.6,.34,.55,Math.cos(i/8*Math.PI)*1.5,.18,Math.sin(i/8*Math.PI)*1.5);batch.finish();
      const bench = addMesh(new THREE.BoxGeometry(2.2,.16,.54),wood,group,[0,.68,.5]);bench.rotation.y=-.25;for(const x of [-.8,.8])addMesh(new THREE.BoxGeometry(.15,.65,.4),wood,group,[x,.32,.5]);
    } else if(landmark.id === "encontro") {
      const batch=stoneBatch(group,stone,19);batch.add(.65,1.25,.6,0,.6,0);batch.add(.82,.2,.76,0,1.27,0);batch.finish();
      const sign=addMesh(new THREE.BoxGeometry(1.6,.26,.08),wood,group,[0,1.8,0]);sign.rotation.y=.25;addMesh(new THREE.CylinderGeometry(.05,.07,1.9,8),wood,group,[0,.93,0]);
    } else {
      const batch=stoneBatch(group,stone,31);for(let row=0;row<3;row++)for(let i=0;i<14;i++){const angle=i/14*Math.PI*2;batch.add(.44,.28,.40,Math.cos(angle)*.9,row*.3+.15,Math.sin(angle)*.9,0,-angle);}batch.finish();
      const darkness=addMesh(new THREE.CircleGeometry(.70,24),new THREE.MeshBasicMaterial({color:0x302c20}),group,[0,.14,0],false);darkness.rotation.x=-Math.PI/2;
      for(const x of [-1.05,1.05])addMesh(new THREE.CylinderGeometry(.065,.09,2.2,8),wood,group,[x,1.08,0]);addMesh(new THREE.BoxGeometry(2.3,.16,.17),wood,group,[0,2.15,0]);
      addMesh(new THREE.CylinderGeometry(.022,.022,1.2,6),material(0x9e8b62),group,[0,1.55,0]);
    }
    const guide=addMesh(new THREE.TorusGeometry(.42,.018,4,24),new THREE.MeshBasicMaterial({color:0xd6bd7c,transparent:true,opacity:.8}),group,[0,2.35,0],false);guide.name="landmark-guide";markers.push(group);
  }
  return markers;
}

export function buildWorldArt(scene: THREE.Scene): WorldArt {
  const materials=createWorldMaterials(),obstacles:CircleObstacle[]=[];ground(scene,materials);cliffs(scene);landscape(scene,obstacles);
  const bridgeRects=bridge(scene,materials.stone),inn=buildInn(scene,materials);
  const player=makeHuman(0xe1d4b5,0x587868);scene.add(player.root);
  const linen = material(0xeee4cd);
  const cloth = addMesh(new THREE.BoxGeometry(.30, .025, .24), linen, player.rightHand, [0, -.04, .08]);
  const oilWine = new THREE.Group(); player.rightHand.add(oilWine);
  addMesh(new THREE.SphereGeometry(.085, 12, 8), material(palette.clay), oilWine, [0, -.02, .05]);
  addMesh(new THREE.CylinderGeometry(.03, .035, .12, 10), material(palette.clay), oilWine, [0, .08, .05]);
  const bandage = addMesh(new THREE.CylinderGeometry(.072, .072, .13, 12), linen, player.rightHand, [0, -.04, .06]);
  bandage.rotation.z = Math.PI / 2;
  const careTools = { cloth, "oil-wine": oilWine, bandage };
  Object.values(careTools).forEach(tool => { tool.visible = false; });
  const traveler=makeHuman(0xbca78c,0x89725b);traveler.root.rotation.set(0,-.65,-1.45);traveler.root.position.set(worldPoints.traveler.x,surfaceHeight(worldPoints.traveler.x,worldPoints.traveler.z)+.20,worldPoints.traveler.z);scene.add(traveler.root);
  const keeper=makeHuman(0xbca07d,0x6b6751);keeper.root.position.set(worldPoints.keeper.x,surfaceHeight(worldPoints.keeper.x,worldPoints.keeper.z),worldPoints.keeper.z);keeper.root.rotation.y=.7;scene.add(keeper.root);
  const animal=donkey();animal.position.set(worldPoints.donkey.x,surfaceHeight(worldPoints.donkey.x,worldPoints.donkey.z),worldPoints.donkey.z);scene.add(animal);
  const rider=makeHuman(0xbca78c,0x89725b);rider.root.position.set(0,.8,.04);rider.root.rotation.y=Math.PI;rider.leftLeg.rotation.x=-1.1;rider.rightLeg.rotation.x=-1.1;rider.root.visible=false;animal.add(rider.root);
  const supplies=bag(scene),marker=new THREE.Group();scene.add(marker);
  const ring=addMesh(new THREE.RingGeometry(1.05,1.12,48),new THREE.MeshBasicMaterial({color:0xe5cb8b,side:THREE.DoubleSide,transparent:true,opacity:.8,depthWrite:false}),marker,[0,.045,0],false);ring.rotation.x=-Math.PI/2;
  const beacon=addMesh(new THREE.OctahedronGeometry(.13),new THREE.MeshBasicMaterial({color:0xf0d79a}),marker,[0,2.8,0],false);beacon.name="wayfinding-marker";
  return {player,traveler,keeper,donkey:animal,rider,supplies,marker,obstacles,careTools,...inn,wallRects:[...inn.wallRects,...bridgeRects],landmarkMarkers:landmarkProps(scene,materials.stone,materials.wood),materialsReady:materials.ready,disposeAssets:materials.disposeAssets};
}
