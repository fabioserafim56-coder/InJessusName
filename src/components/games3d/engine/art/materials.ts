import * as THREE from "three";

export type WorldMaterials = {
  ground: THREE.MeshStandardMaterial;
  road: THREE.MeshStandardMaterial;
  stone: THREE.MeshStandardMaterial;
  wood: THREE.MeshStandardMaterial;
  ready: Promise<void>;
  disposeAssets: () => void;
};

/** Local CC0 maps are requested only while constructing the chosen game world. */
export function createWorldMaterials(): WorldMaterials {
  let active = true;
  const loader = new THREE.TextureLoader();
  const ground = new THREE.MeshStandardMaterial({ color: 0xc2b18f, roughness: .98, vertexColors: true });
  const road = new THREE.MeshStandardMaterial({ color: 0xd7c49b, roughness: 1, vertexColors: true });
  const stone = new THREE.MeshStandardMaterial({ color: 0xd4c8ab, roughness: .95, vertexColors: true });
  const wood = new THREE.MeshStandardMaterial({ color: 0x9f8a69, roughness: .96 });
  const textures = new Set<THREE.Texture>();
  async function attach(mat: THREE.MeshStandardMaterial, name: string, repeat: [number, number], normalStrength: number) {
    await Promise.allSettled(["color", "normal"].map(async kind => {
      const texture = await loader.loadAsync(`/games3d/materials/${name}-${kind}.webp`);
      if (!active) { texture.dispose(); return; }
      textures.add(texture); texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(...repeat); texture.anisotropy = 2;
      if (kind === "color") { texture.colorSpace = THREE.SRGBColorSpace; mat.map = texture; }
      else { mat.normalMap = texture; mat.normalScale.setScalar(normalStrength); }
      mat.needsUpdate = true;
    }));
  }
  const ready = Promise.allSettled([
    attach(ground, "ground", [62, 76], .22),
    attach(road, "ground", [1.3, 10], .1),
    attach(stone, "stone", [1, 1], .35),
    attach(wood, "wood", [1.7, 2.2], .25),
  ]).then(() => {});
  return { ground, road, stone, wood, ready, disposeAssets() {
    active = false;
    // Attached maps are also collected by engine disposal; Texture.dispose is idempotent.
    textures.forEach(texture => texture.dispose()); textures.clear();
  } };
}
