import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { worldPoints } from "@/content/games3d";

export type CircleObstacle = { x: number; z: number; radius: number };
export type HumanRig = { root: THREE.Group; body: THREE.Group; leftArm: THREE.Group; rightArm: THREE.Group; leftLeg: THREE.Group; rightLeg: THREE.Group; bandage: THREE.Mesh };
export type WorldArt = { player: HumanRig; traveler: HumanRig; keeper: HumanRig; donkey: THREE.Group; rider: HumanRig; supplies: THREE.Group; marker: THREE.Group; obstacles: CircleObstacle[] };

const palette = { limestone: 0xc4ad83, robe: 0xe5d8b3, skin: 0x9e6746, hair: 0x322a22, leather: 0x574230, olive: 0x68715a, clay: 0x9e6646 };
const rng = (seed: number) => { let n = seed; return () => { n = (n * 16807) % 2147483647; return (n - 1) / 2147483646; }; };

export function roadCenter(z: number) { return Math.sin(z * .071) * 2.3; }

/** Broad enough for a readable path, uneven away from it, always deterministic. */
export function surfaceHeight(x: number, z: number) {
  const shoulder = THREE.MathUtils.smoothstep(Math.abs(x - roadCenter(z)), 3.6, 16);
  const low = Math.sin(z * .045) * .13;
  const hill = .9 + Math.sin(x * .13 + z * .028) * 1.25 + Math.cos(z * .12 - x * .07) * .65;
  const naturalHeight = low + shoulder * Math.max(.15, hill);
  // A graded forecourt makes the inn sit on its foundations and the last
  // approach readable, rather than letting masonry cut a rolling hillside.
  const forecourtDistance = Math.max(Math.abs(x - 5) / 9.5, Math.abs(z + 32) / 10.5);
  const forecourtBlend = 1 - THREE.MathUtils.smoothstep(forecourtDistance, .8, 1.25);
  return THREE.MathUtils.lerp(naturalHeight, -.08, forecourtBlend);
}

function material(color: number | string, extra: Partial<THREE.MeshStandardMaterialParameters> = {}) {
  return new THREE.MeshStandardMaterial({ color, roughness: .92, metalness: 0, ...extra });
}

function mesh(geometry: THREE.BufferGeometry, mat: THREE.Material, parent: THREE.Object3D, position: [number, number, number], shadow = true) {
  const result = new THREE.Mesh(geometry, mat);
  result.position.set(...position); result.castShadow = shadow; result.receiveShadow = true; parent.add(result); return result;
}

function proceduralGroundTexture() {
  const canvas = document.createElement("canvas"); canvas.width = canvas.height = 128;
  const context = canvas.getContext("2d");
  if (!context) return null;
  const data = context.createImageData(128, 128), random = rng(818);
  for (let i = 0; i < data.data.length; i += 4) {
    const value = 224 + Math.floor(random() * 30);
    data.data[i] = value; data.data[i + 1] = value; data.data[i + 2] = value - 4; data.data[i + 3] = 255;
  }
  context.putImageData(data, 0, 0);
  const texture = new THREE.CanvasTexture(canvas); texture.wrapS = texture.wrapT = THREE.RepeatWrapping; texture.repeat.set(30, 42); texture.colorSpace = THREE.SRGBColorSpace; return texture;
}

function ground(scene: THREE.Scene) {
  const geo = new THREE.PlaneGeometry(160, 200, 100, 120); geo.rotateX(-Math.PI / 2);
  const positions = geo.getAttribute("position"), colors = new Float32Array(positions.count * 3);
  const sand = new THREE.Color(0xb5a280), shade = new THREE.Color(0x8f9370), color = new THREE.Color();
  for (let i = 0; i < positions.count; i++) {
    const x = positions.getX(i), z = positions.getZ(i), h = surfaceHeight(x, z);
    positions.setY(i, h - .035);
    const variation = (Math.sin(x * 1.34 + z * .64) + Math.cos(z * .83 - x * .4)) * .035;
    color.copy(sand).lerp(shade, THREE.MathUtils.clamp((Math.abs(x - roadCenter(z)) - 4) / 38 + variation, 0, .55));
    color.toArray(colors, i * 3);
  }
  geo.setAttribute("color", new THREE.BufferAttribute(colors, 3)); geo.computeVertexNormals();
  mesh(geo, material(0xffffff, { vertexColors: true, map: proceduralGroundTexture() }), scene, [0, 0, 0], false);

  const vertices: number[] = [], indices: number[] = [], uvs: number[] = [];
  for (let i = 0; i <= 150; i++) {
    const z = -70 + i * 1.0, center = roadCenter(z), halfWidth = 3.25 + Math.sin(z * .11) * .22;
    for (const side of [-1, 1]) { const x = center + halfWidth * side; vertices.push(x, surfaceHeight(x, z) + .015, z); uvs.push((side + 1) / 2, i / 18); }
    if (i < 150) { const a = i * 2; indices.push(a, a + 2, a + 1, a + 1, a + 2, a + 3); }
  }
  // The lodging is beside the main road; this short forecourt approach gives
  // the destination a visible connection instead of an arbitrary patch of sand.
  const approach = [[roadCenter(-19), -19], [-1.1, -21], [1.1, -23], [3.4, -25], [5, -28.5]];
  const approachOffset = vertices.length / 3;
  approach.forEach(([x, z], i) => {
    const before = approach[Math.max(0, i - 1)], after = approach[Math.min(approach.length - 1, i + 1)];
    const dx = after[0] - before[0], dz = after[1] - before[1], length = Math.hypot(dx, dz) || 1;
    for (const side of [-1, 1]) {
      const px = x + dz / length * 1.6 * side, pz = z - dx / length * 1.6 * side;
      vertices.push(px, surfaceHeight(px, pz) + .016, pz); uvs.push((side + 1) / 2, i / 5);
    }
    if (i < approach.length - 1) { const a = approachOffset + i * 2; indices.push(a, a + 2, a + 1, a + 1, a + 2, a + 3); }
  });
  const road = new THREE.BufferGeometry(); road.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3)); road.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2)); road.setIndex(indices); road.computeVertexNormals();
  mesh(road, material(0xd6c299), scene, [0, 0, 0], false);
}

function landscape(scene: THREE.Scene, obstacles: CircleObstacle[]) {
  const random = rng(1042), dummy = new THREE.Object3D();
  const rocks = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1, 1), material(0x9e977d, { flatShading: true }), 150);
  rocks.receiveShadow = true; rocks.castShadow = true;
  for (let i = 0; i < 150; i++) {
    const z = -55 + random() * 110, side = random() > .5 ? 1 : -1;
    let x = roadCenter(z) + side * (5.8 + random() * 28);
    const size = .2 + random() * 1.25;
    // Keep the inn foundations, approach and canonical care destinations clear.
    if (z > -43 && z < -16 && x > -4 && x < 16) x = (x < 5 ? -1 : 1) * (18 + random() * 10);
    dummy.position.set(x, surfaceHeight(x, z) + size * .28, z); dummy.rotation.set(random(), random() * 6, random() * .4); dummy.scale.set(size * (1 + random()), size * .75, size); dummy.updateMatrix(); rocks.setMatrixAt(i, dummy.matrix);
    rocks.setColorAt(i, new THREE.Color().setHSL(.105 + random() * .025, .12, .43 + random() * .18));
    if (size > .65 && Math.abs(x) < 24 && Math.abs(z) < 44) obstacles.push({ x, z, radius: size * .85 });
  }
  scene.add(rocks);

  const mountains = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1, 1), material(0xa69779, { flatShading: true }), 23);
  mountains.receiveShadow = true;
  for (let i = 0; i < 23; i++) {
    const side = i % 2 ? 1 : -1, z = -100 + (i / 2) * 17;
    dummy.position.set(side * (40 + random() * 18), 4 + random() * 3, z); dummy.rotation.set(0, random() * 5, random() * .15); dummy.scale.set(14 + random() * 12, 10 + random() * 13, 15 + random() * 15); dummy.updateMatrix(); mountains.setMatrixAt(i, dummy.matrix);
    mountains.setColorAt(i, new THREE.Color().setHSL(.10, .12, .5 + random() * .14));
  }
  scene.add(mountains);

  const treePositions: [number, number][] = [[-7, 25], [10, 20], [-9, 9], [9, -5], [-9, -13], [-12, -24], [16, -26], [18, -39], [-19, -37], [-15, 37], [18, 34], [21, 8], [-20, 1], [16, -18], [-22, 19], [22, -7]];
  const trunks = new THREE.InstancedMesh(new THREE.CylinderGeometry(.15, .3, 2.4, 7), material(0x594c37), treePositions.length);
  const branches = new THREE.InstancedMesh(new THREE.CylinderGeometry(.065, .13, 1.6, 6), material(0x63533b), treePositions.length * 3);
  const crowns = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1, 1), material(palette.olive, { flatShading: true }), treePositions.length * 7);
  trunks.castShadow = crowns.castShadow = true; crowns.receiveShadow = true;
  treePositions.forEach(([x, z], index) => {
    const y = surfaceHeight(x, z), size = .85 + random() * .3; obstacles.push({ x, z, radius: .5 });
    dummy.position.set(x, y + 1.2 * size, z); dummy.rotation.set(0, random() * 6, .08); dummy.scale.setScalar(size); dummy.updateMatrix(); trunks.setMatrixAt(index, dummy.matrix);
    for (let j = 0; j < 3; j++) {
      const angle = j * Math.PI * 2 / 3 + index;
      dummy.position.set(x + Math.sin(angle) * .45, y + 2.3, z + Math.cos(angle) * .45); dummy.rotation.set(Math.sin(angle) * .6, angle, Math.cos(angle) * .6); dummy.scale.setScalar(size); dummy.updateMatrix(); branches.setMatrixAt(index * 3 + j, dummy.matrix);
    }
    for (let j = 0; j < 7; j++) {
      const angle = j * Math.PI * 2 / 6, outer = j === 6 ? 0 : 1.15;
      dummy.position.set(x + Math.sin(angle) * outer, y + (j === 6 ? 3.8 : 3.1) * size, z + Math.cos(angle) * outer); dummy.rotation.set(random(), random() * 6, random()); dummy.scale.set((1.15 + random() * .4) * size, (.75 + random() * .3) * size, (1.1 + random() * .3) * size); dummy.updateMatrix(); crowns.setMatrixAt(index * 7 + j, dummy.matrix);
      crowns.setColorAt(index * 7 + j, new THREE.Color().setHSL(.20 + random() * .03, .15, .32 + random() * .16));
    }
  });
  scene.add(trunks, branches, crowns);

  const grassGeometry = new THREE.BufferGeometry(); grassGeometry.setAttribute("position", new THREE.Float32BufferAttribute([-.18, 0, 0, 0, .6, .07, .14, 0, 0, 0, 0, -.18, .06, .43, 0, 0, 0, .15], 3)); grassGeometry.computeVertexNormals();
  const grasses = new THREE.InstancedMesh(grassGeometry, material(0x8b9068, { side: THREE.DoubleSide }), 380);
  for (let i = 0; i < 380; i++) {
    const z = -48 + random() * 96, x = roadCenter(z) + (random() > .5 ? 1 : -1) * (3.8 + random() * 19);
    dummy.position.set(x, surfaceHeight(x, z), z); dummy.rotation.set(0, random() * 6, 0); dummy.scale.setScalar(.5 + random() * .8); dummy.updateMatrix(); grasses.setMatrixAt(i, dummy.matrix);
    grasses.setColorAt(i, new THREE.Color().setHSL(.16 + random() * .08, .18, .36 + random() * .14));
  }
  scene.add(grasses);
}

export function makeHuman(robeColor = palette.robe, shawlColor = 0x8c573a): HumanRig {
  const root = new THREE.Group(), body = new THREE.Group(); root.add(body);
  const skin = material(palette.skin), cloth = material(robeColor), shawl = material(shawlColor), hair = material(palette.hair), shoes = material(palette.leather);
  mesh(new THREE.CylinderGeometry(.30, .39, .86, 10), cloth, body, [0, .99, 0]);
  mesh(new THREE.CylinderGeometry(.39, .49, .45, 10), cloth, body, [0, .43, 0]);
  mesh(new THREE.CylinderGeometry(.335, .34, .075, 10), shoes, body, [0, .77, 0]);
  const faceParts = [
    new THREE.SphereGeometry(.18, 12, 10).scale(.96, 1.08, .94).translate(0, 1.65, 0),
    new THREE.SphereGeometry(.042, 8, 6).scale(.8, 1.2, 1.2).translate(0, 1.63, .174),
    new THREE.CylinderGeometry(.075, .09, .17, 8).translate(0, 1.43, 0),
  ];
  mesh(mergeGeometries(faceParts, false), skin, body, [0, 0, 0]); faceParts.forEach(part => part.dispose());
  const hairParts = [
    new THREE.SphereGeometry(.189, 12, 7, 0, Math.PI * 2, 0, 1.10),
    new THREE.SphereGeometry(.187, 12, 7, Math.PI, Math.PI, .85, 1.40),
  ];
  const hairCap = mesh(mergeGeometries(hairParts, false), hair, body, [0, 1.68, -.013]); hairParts.forEach(part => part.dispose()); hairCap.scale.set(.98, 1.08, .98); hairCap.rotation.x = -.1;
  const beard = mesh(new THREE.SphereGeometry(.132, 10, 7), hair, body, [0, 1.51, .062]); beard.scale.set(1, .85, .85);
  const eyeParts = [-1, 1].map(side => new THREE.SphereGeometry(.012, 6, 5).scale(1.2, .65, .6).translate(side * .066, 1.675, .158));
  mesh(mergeGeometries(eyeParts, false), hair, body, [0, 0, 0]); eyeParts.forEach(part => part.dispose());
  // One folded strip follows the shoulder and hangs naturally on both sides.
  const fold = [[-.36, .78], [-.30, 1.36], [0, 1.46], [.30, 1.35], [.375, .58]];
  const clothVertices: number[] = [], clothIndices: number[] = [];
  fold.forEach(([z, y], i) => {
    clothVertices.push(-.37, y + .012, z, -.15, y - .012, z + .014);
    if (i < fold.length - 1) { const a = i * 2; clothIndices.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
  });
  const drape = new THREE.BufferGeometry(); drape.setAttribute("position", new THREE.Float32BufferAttribute(clothVertices, 3)); drape.setIndex(clothIndices); drape.computeVertexNormals(); shawl.side = THREE.DoubleSide;
  mesh(drape, shawl, body, [0, 0, 0]);
  const arm = (side: number) => {
    const group = new THREE.Group(); group.position.set(side * .36, 1.28, 0); body.add(group);
    mesh(new THREE.CylinderGeometry(.11, .095, .40, 8), cloth, group, [side * .045, -.16, 0]);
    mesh(new THREE.CylinderGeometry(.075, .062, .34, 8), skin, group, [side * .065, -.49, .025]);
    mesh(new THREE.SphereGeometry(.075, 8, 6), skin, group, [side * .065, -.68, .025]); return group;
  };
  const leg = (side: number) => {
    const group = new THREE.Group(); group.position.set(side * .16, .49, 0); body.add(group);
    mesh(new THREE.CylinderGeometry(.085, .065, .43, 8), cloth, group, [0, -.19, 0]);
    const shoe = mesh(new THREE.BoxGeometry(.18, .10, .3), shoes, group, [0, -.43, .055]); shoe.rotation.x = -.03; return group;
  };
  const leftArm = arm(-1), rightArm = arm(1), leftLeg = leg(-1), rightLeg = leg(1);
  const bandage = mesh(new THREE.CylinderGeometry(.085, .083, .15, 8), material(0xeee4c7), leftArm, [-.065, -.48, .025]); bandage.visible = false;
  return { root, body, leftArm, rightArm, leftLeg, rightLeg, bandage };
}

function makeDonkey() {
  const root = new THREE.Group(), coat = material(0x8e8877), dark = material(0x484337), light = material(0xb3aa91), blanket = material(0x8a5c42);
  const barrel = mesh(new THREE.CapsuleGeometry(.39, .72, 5, 10), coat, root, [0, .96, 0]); barrel.rotation.x = Math.PI / 2;
  let legIndex = 0;
  for (const x of [-.27, .27]) for (const z of [-.43, .43]) {
    const leg = new THREE.Group(); leg.name = `donkey-leg-${legIndex++}`; leg.position.set(x, .70, z); root.add(leg);
    mesh(new THREE.CylinderGeometry(.065, .085, .65, 7), coat, leg, [0, -.32, 0]);
    mesh(new THREE.BoxGeometry(.13, .12, .17), dark, leg, [0, -.61, 0]);
  }
  const neck = mesh(new THREE.CapsuleGeometry(.20, .52, 4, 8), coat, root, [0, 1.32, -.58]); neck.rotation.x = -.5;
  const head = mesh(new THREE.BoxGeometry(.29, .34, .54), light, root, [0, 1.62, -.85]); head.rotation.x = -.13;
  for (const x of [-.1, .1]) { const ear = mesh(new THREE.CapsuleGeometry(.06, .38, 4, 6), coat, root, [x, 1.99, -.76]); ear.rotation.z = x * 1.2; }
  mesh(new THREE.BoxGeometry(.42, .12, .63), blanket, root, [0, 1.38, .03]);
  const tail = mesh(new THREE.CylinderGeometry(.025, .035, .58, 5), dark, root, [0, .94, .76]); tail.rotation.x = -.5;
  return root;
}

function buildInn(scene: THREE.Scene) {
  const pieces: THREE.BufferGeometry[] = [], random = rng(81), color = new THREE.Color();
  const addStone = (x: number, y: number, z: number, width: number, depth: number, angle = 0) => {
    const geo = new THREE.BoxGeometry(width, .41, depth); geo.rotateZ(angle); geo.translate(x, y, z);
    const rgb = new Float32Array(geo.getAttribute("position").count * 3); color.setHSL(.105, .21, .56 + random() * .12); for (let i = 0; i < rgb.length; i += 3) color.toArray(rgb, i);
    geo.setAttribute("color", new THREE.BufferAttribute(rgb, 3)); pieces.push(geo);
  };
  const baseY = surfaceHeight(5, -32);
  for (let row = 0; row < 9; row++) {
    const y = baseY + .22 + row * .43;
    for (let col = 0; col < 15; col++) {
      const x = -.6 + col * .8 + (row % 2 ? .15 : 0), dx = x - 5;
      const opening = Math.abs(dx) < 1.45 && y - baseY < 1.85 + Math.sqrt(Math.max(0, 1.45 ** 2 - dx ** 2));
      if (!opening) addStone(x, y, -29.2, .77, .78);
      addStone(x, y, -38.7, .77, .78);
    }
    for (let col = 0; col < 12; col++) { const z = -29.6 - col * .8; addStone(-.85, y, z, .8, .77); addStone(10.8, y, z, .8, .77); }
  }
  for (let i = 0; i < 11; i++) { const a = Math.PI * i / 10; addStone(5 + Math.cos(a) * 1.5, baseY + 1.75 + Math.sin(a) * 1.5, -29.16, .47, .92, a - Math.PI / 2); }
  const merged = mergeGeometries(pieces, false); pieces.forEach(piece => piece.dispose());
  mesh(merged, material(0xffffff, { vertexColors: true }), scene, [0, 0, 0]);
  const timber = material(0x685039), roof = material(0x9c8765), shade = material(0x202c26);
  mesh(new THREE.BoxGeometry(12.5, .26, 10.6), roof, scene, [5, baseY + 4.0, -34]);
  mesh(new THREE.PlaneGeometry(2.65, 2.95), shade, scene, [5, baseY + 1.5, -29.62], false);
  const curtain = mesh(new THREE.BoxGeometry(.8, 2.5, .08), material(0x8a644a), scene, [4.08, baseY + 1.3, -29.45]); curtain.rotation.z = -.12;
  mesh(new THREE.BoxGeometry(8.4, .12, 2.8), timber, scene, [5, baseY + 3.12, -27.8]);
  for (const x of [1.1, 8.9]) mesh(new THREE.CylinderGeometry(.10, .13, 3.15, 7), timber, scene, [x, baseY + 1.54, -26.5]);
  const awningSlats = new THREE.InstancedMesh(new THREE.BoxGeometry(.10, .06, 2.85), material(0xbcaa7a), 15), slat = new THREE.Object3D();
  awningSlats.receiveShadow = true;
  for (let i = 0; i < 15; i++) { slat.position.set(1 + i * .57, baseY + 3.2, -27.8); slat.updateMatrix(); awningSlats.setMatrixAt(i, slat.matrix); }
  scene.add(awningSlats);
  const bench = new THREE.Group(); scene.add(bench); bench.position.set(7.2, surfaceHeight(7.2, -27), -27); mesh(new THREE.BoxGeometry(2.1, .17, .7), timber, bench, [0, .65, 0]); for (const x of [-.75, .75]) mesh(new THREE.BoxGeometry(.15, .65, .5), timber, bench, [x, .32, 0]);
  for (const [x, z, size] of [[.2, -26.3, .5], [1.0, -25.7, .34], [9.8, -27, .47]]) {
    const points = [new THREE.Vector2(.18, 0), new THREE.Vector2(.4, .12), new THREE.Vector2(.45, .55), new THREE.Vector2(.25, .82), new THREE.Vector2(.22, 1.0)];
    const pot = mesh(new THREE.LatheGeometry(points, 12), material(palette.clay), scene, [x, surfaceHeight(x, z), z]); pot.scale.setScalar(size * 1.5);
  }
  for (const x of [3.0, 7]) {
    mesh(new THREE.BoxGeometry(.16, .40, .17), material(0x644d2f), scene, [x, baseY + 2.0, -28.65]);
    mesh(new THREE.BoxGeometry(.12, .23, .13), material(0xeac176, { emissive: 0xd99a43, emissiveIntensity: .5 }), scene, [x, baseY + 2.03, -28.54], false);
  }
}

export function buildWorldArt(scene: THREE.Scene): WorldArt {
  const obstacles: CircleObstacle[] = []; ground(scene); landscape(scene, obstacles); buildInn(scene);
  const player = makeHuman(0xdfcfaa, 0x526c60); scene.add(player.root);
  const traveler = makeHuman(0xb8a387, 0x786350); traveler.root.rotation.set(0, -.65, -1.45); traveler.leftArm.rotation.x = -.6; traveler.rightArm.rotation.x = -.5; traveler.leftLeg.rotation.x = .23;
  traveler.root.position.set(worldPoints.traveler.x, surfaceHeight(worldPoints.traveler.x, worldPoints.traveler.z) + .22, worldPoints.traveler.z); scene.add(traveler.root);
  const keeper = makeHuman(0xd0b783, 0x76513a); keeper.root.position.set(worldPoints.keeper.x, surfaceHeight(worldPoints.keeper.x, worldPoints.keeper.z), worldPoints.keeper.z); scene.add(keeper.root);
  const donkey = makeDonkey(); donkey.position.set(worldPoints.donkey.x, surfaceHeight(worldPoints.donkey.x, worldPoints.donkey.z), worldPoints.donkey.z); scene.add(donkey);
  const rider = makeHuman(0xb8a387, 0x786350); rider.root.scale.setScalar(.78); rider.root.position.set(0, 1.1, .05); rider.root.rotation.y = Math.PI; rider.leftLeg.rotation.x = rider.rightLeg.rotation.x = -1.25; rider.leftLeg.rotation.z = .4; rider.rightLeg.rotation.z = -.4; rider.leftArm.rotation.x = rider.rightArm.rotation.x = -.9; rider.bandage.visible = true; rider.root.visible = false; donkey.add(rider.root);
  const supplies = new THREE.Group(); supplies.position.set(worldPoints.supplies.x, surfaceHeight(worldPoints.supplies.x, worldPoints.supplies.z), worldPoints.supplies.z); scene.add(supplies);
  mesh(new THREE.BoxGeometry(.64, .45, .45), material(0x805c3d), supplies, [0, .25, 0]);
  mesh(new THREE.TorusGeometry(.22, .035, 5, 12, Math.PI), material(0x5b4834), supplies, [0, .48, 0]);
  mesh(new THREE.CylinderGeometry(.08, .13, .30, 8), material(0xa26f4f), supplies, [.47, .16, 0]);
  mesh(new THREE.BoxGeometry(.26, .12, .3), material(0xe8dcc2), supplies, [-.12, .52, .04]);
  const marker = new THREE.Group(); scene.add(marker);
  const ring = mesh(new THREE.RingGeometry(1.17, 1.25, 48), new THREE.MeshBasicMaterial({ color: 0xe5cb8b, side: THREE.DoubleSide, transparent: true, opacity: .8, depthWrite: false }), marker, [0, .045, 0], false); ring.rotation.x = -Math.PI / 2;
  const beacon = mesh(new THREE.OctahedronGeometry(.15), new THREE.MeshBasicMaterial({ color: 0xf0d79a }), marker, [0, 2.9, 0], false); beacon.name = "wayfinding-marker";
  return { player, traveler, keeper, donkey, rider, supplies, marker, obstacles };
}
