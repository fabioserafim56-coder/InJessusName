import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

export type HumanRig = {
  root: THREE.Group; body: THREE.Group; head: THREE.Group;
  leftArm: THREE.Group; rightArm: THREE.Group; leftForearm: THREE.Group; rightForearm: THREE.Group;
  leftHand: THREE.Group; rightHand: THREE.Group; leftLeg: THREE.Group; rightLeg: THREE.Group;
  bandage: THREE.Mesh;
};

const material = (color: number, extra: THREE.MeshStandardMaterialParameters = {}) => new THREE.MeshStandardMaterial({ color, roughness: .94, ...extra });
function combined(parts: THREE.BufferGeometry[], mat: THREE.Material, parent: THREE.Object3D) {
  const geo = mergeGeometries(parts, false); parts.forEach(part => part.dispose());
  const mesh = new THREE.Mesh(geo, mat); mesh.castShadow = mesh.receiveShadow = true; parent.add(mesh); return mesh;
}
function shape(geo: THREE.BufferGeometry, xyz: [number, number, number], scale?: [number, number, number]) {
  if (scale) geo.scale(...scale); geo.translate(...xyz); return geo;
}
function foldedCloth(rings: [number, number, number][], count = 28) {
  const vertices: number[] = [], uv: number[] = [], indices: number[] = [];
  rings.forEach(([y, rx, rz], row) => {
    for (let i = 0; i <= count; i++) {
      const angle = i / count * Math.PI * 2;
      const fold = Math.sin(angle * 9 + row * .35) * .010 + Math.sin(angle * 5) * .006;
      vertices.push(Math.cos(angle) * (rx + fold), y + Math.sin(angle * 4) * .006, Math.sin(angle) * (rz + fold));
      uv.push(i / count, row / (rings.length - 1));
      if (row && i < count) { const a = row * (count + 1) + i, b = a - count - 1; indices.push(a, b, a + 1, a + 1, b, b + 1); }
    }
  });
  const geo = new THREE.BufferGeometry(); geo.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3)); geo.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2)); geo.setIndex(indices); geo.computeVertexNormals(); return geo;
}

/** Adult proportions and articulated arms keep gestures quiet, readable and dignified. */
export function makeHuman(robeColor = 0xdfd0b0, shawlColor = 0x647563): HumanRig {
  const root = new THREE.Group(), body = new THREE.Group(), head = new THREE.Group(); root.add(body); body.add(head);
  const skin = material(0xa77050), cloth = material(robeColor, { side: THREE.DoubleSide }), hair = material(0x30291f), leather = material(0x584632);
  const tunic = foldedCloth([[.39, .34, .20], [.49, .35, .21], [.72, .30, .19], [.88, .265, .17], [1.10, .29, .17], [1.32, .325, .16], [1.43, .31, .145], [1.49, .12, .105]]);
  combined([tunic], cloth, body);
  combined([shape(new THREE.CylinderGeometry(.28, .283, .052, 24), [0, .88, 0], [1, 1, .65]), shape(new THREE.BoxGeometry(.07, .065, .025), [.06, .88, .178])], leather, body);
  const face = [shape(new THREE.SphereGeometry(.132, 16, 12), [0, 1.70, 0], [.92, 1.10, .91]), shape(new THREE.SphereGeometry(.035, 10, 8), [0, 1.69, .120], [.6, 1.25, 1]), shape(new THREE.CylinderGeometry(.067, .078, .18, 12), [0, 1.49, 0])];
  for (const side of [-1, 1]) face.push(shape(new THREE.SphereGeometry(.032, 8, 6), [side * .124, 1.69, -.006], [.6, 1.2, .75]));
  combined(face, skin, head);
  const hairParts = [shape(new THREE.SphereGeometry(.137, 16, 10, 0, Math.PI * 2, 0, 1.18), [0, 1.727, -.012], [.98, 1.10, .99]), shape(new THREE.SphereGeometry(.10, 12, 8, 0, Math.PI * 2, .5, 1.8), [0, 1.624, .027], [1, .7, 1])];
  for (const side of [-1, 1]) {
    hairParts.push(shape(new THREE.SphereGeometry(.009, 8, 6), [side * .047, 1.72, .116], [1.25, .65, .65]));
    hairParts.push(shape(new THREE.BoxGeometry(.035, .008, .009), [side * .047, 1.745, .114]));
  }
  combined(hairParts, hair, head);
  // A volumetric folded shawl, rather than a single stiff rectangular strip.
  const shawlVertices: number[] = [], shawlUV: number[] = [], shawlIndices: number[] = [];
  const drape: [number, number, number][] = [[-.20, .66, .215], [-.22, .93, .195], [-.24, 1.23, .185], [-.25, 1.44, .125], [-.23, 1.48, -.02], [-.20, 1.36, -.19], [-.18, 1.03, -.205], [-.16, .71, -.22]];
  drape.forEach(([x, y, z], row) => {
    for (let i = 0; i <= 4; i++) { shawlVertices.push(x + i * .058, y + Math.sin(i * Math.PI / 2) * .012, z + Math.sin(i * Math.PI / 2 + row) * .009); shawlUV.push(i / 4, row / 7); if (row && i < 4) { const a = row * 5 + i, b = a - 5; shawlIndices.push(a, b, a + 1, a + 1, b, b + 1); } }
  });
  const shawlGeo = new THREE.BufferGeometry(); shawlGeo.setAttribute("position", new THREE.Float32BufferAttribute(shawlVertices, 3)); shawlGeo.setAttribute("uv", new THREE.Float32BufferAttribute(shawlUV, 2)); shawlGeo.setIndex(shawlIndices); shawlGeo.computeVertexNormals();
  combined([shawlGeo], material(shawlColor, { side: THREE.DoubleSide }), body);
  function arm(side: number) {
    const arm = new THREE.Group(), forearm = new THREE.Group(), hand = new THREE.Group(); arm.position.set(side * .32, 1.40, 0); body.add(arm);
    combined([shape(new THREE.CapsuleGeometry(.092, .23, 5, 10), [side * .025, -.16, 0])], cloth, arm);
    forearm.position.set(side * .025, -.36, 0); arm.add(forearm);
    combined([shape(new THREE.CylinderGeometry(.063, .049, .29, 10), [0, -.135, .012]), shape(new THREE.SphereGeometry(.054, 10, 8), [0, -.315, .02], [.8, 1.3, .53]), shape(new THREE.CapsuleGeometry(.017, .045, 3, 6), [-side * .042, -.292, .022])], skin, forearm);
    hand.position.set(0, -.31, .02); forearm.add(hand); return { arm, forearm, hand };
  }
  const left = arm(-1), right = arm(1);
  function leg(side: number) {
    const leg = new THREE.Group(); leg.position.set(side * .145, .76, 0); body.add(leg);
    const calf = shape(new THREE.CylinderGeometry(.070, .048, .63, 10), [0, -.33, 0]);
    const sandal = shape(new THREE.SphereGeometry(.1, 10, 6), [0, -.72, .045], [.8, .30, 1.5]);
    const geometryParts = [calf, sandal];
    const colors = [new THREE.Color(robeColor).multiplyScalar(.88), new THREE.Color(0x634b31)];
    geometryParts.forEach((geo, index) => { const color = new Float32Array(geo.getAttribute("position").count * 3); for (let i = 0; i < color.length; i += 3) colors[index].toArray(color, i); geo.setAttribute("color", new THREE.BufferAttribute(color, 3)); });
    combined(geometryParts, material(0xffffff, { vertexColors: true }), leg); return leg;
  }
  const leftLeg = leg(-1), rightLeg = leg(1);
  const bandage = new THREE.Mesh(new THREE.CylinderGeometry(.065, .064, .11, 12), material(0xf0e6ce)); bandage.position.set(0, -.18, .014); left.forearm.add(bandage); bandage.visible = false;
  return { root, body, head, leftArm: left.arm, rightArm: right.arm, leftForearm: left.forearm, rightForearm: right.forearm, leftHand: left.hand, rightHand: right.hand, leftLeg, rightLeg, bandage };
}
