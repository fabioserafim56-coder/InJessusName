import * as THREE from "three";
import { createMissionState, getCurrentObjective, innFootprint, worldBounds, worldPoints, type MissionState, type WorldPosition } from "@/content/games3d";
import { buildWorldArt, surfaceHeight } from "./world-art";

export type RenderQuality = "auto" | "low" | "high";
export type WorldStats = Readonly<{ fps: number; drawCalls: number; triangles: number; pixelRatio: number; quality: RenderQuality; geometries: number; textures: number }>;
export type GameWorldOptions = Readonly<{
  reducedMotion?: boolean;
  quality?: RenderQuality;
  onReady?: () => void;
  onPosition?: (position: WorldPosition) => void;
  onInteract?: () => void;
  onError?: (message: string) => void;
  onStats?: (stats: WorldStats) => void;
}>;
export type GameWorld = Readonly<{
  canvas: HTMLCanvasElement;
  getPosition: () => WorldPosition;
  setInput: (input: WorldPosition) => void;
  setMissionState: (state: MissionState) => void;
  setPaused: (paused: boolean) => void;
  setQuality: (quality: RenderQuality) => void;
  focus: () => void;
  dispose: () => void;
}>;

const WALK_SPEED = 4.2;
const PLAYER_RADIUS = .43;

/** Created only after an explicit user action; no assets, models or API calls. */
export function createGameWorld(container: HTMLElement, options: GameWorldOptions = {}): GameWorld {
  const canvas = document.createElement("canvas");
  canvas.tabIndex = 0;
  canvas.setAttribute("role", "img");
  canvas.setAttribute("aria-label", "Cenário 3D controlável do caminho da compaixão. Use W A S D ou as setas para caminhar e E para interagir.");
  canvas.dataset.game3dCanvas = "true";
  Object.assign(canvas.style, { display: "block", width: "100%", height: "100%", touchAction: "none" });
  const mobile = () => container.clientWidth < 760 || matchMedia("(pointer: coarse)").matches;
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: !mobile(), alpha: false, powerPreference: "high-performance", stencil: false, preserveDrawingBuffer: false });
  } catch {
    throw new Error("Este navegador não conseguiu preparar os gráficos WebGL2. A leitura da passagem continua disponível; tente outro navegador ou aparelho para entrar no cenário.");
  }
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.18;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.setClearColor(0xd2dce0, 1);
  container.appendChild(canvas);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xd2dce0);
  scene.fog = new THREE.Fog(0xd0d0bd, 48, 130);
  const camera = new THREE.PerspectiveCamera(51, 1, .15, 190);
  const hemisphere = new THREE.HemisphereLight(0xe3edf0, 0x6d7153, 2.0); scene.add(hemisphere);
  const sun = new THREE.DirectionalLight(0xffe5b1, 3.2); sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  Object.assign(sun.shadow.camera, { left: -19, right: 19, top: 19, bottom: -19, near: .5, far: 80 });
  sun.shadow.normalBias = .045; sun.shadow.bias = -.00015; sun.shadow.radius = 2;
  scene.add(sun, sun.target);
  let art: ReturnType<typeof buildWorldArt>;
  try { art = buildWorldArt(scene); }
  catch (error) { renderer.dispose(); renderer.forceContextLoss(); canvas.remove(); throw error; }

  let mission = createMissionState(), externalStateReceived = false;
  const player = art.player.root;
  player.position.set(worldPoints.spawn.x, surfaceHeight(worldPoints.spawn.x, worldPoints.spawn.z), worldPoints.spawn.z);
  player.rotation.y = Math.PI;
  let previousStage = mission.stage;
  let disposed = false, failed = false, manuallyPaused = false, intersecting = true;
  let raf = 0, lastTime = 0, statsStart = 0, statsFrames = 0, lastPositionAt = 0;
  let quality: RenderQuality = options.quality ?? "auto";
  let readyAt = 0;
  let pixelRatio = 1, adaptiveSteps = 0, lastAdaptation = 0, ready = false;
  let touchInput = { x: 0, z: 0 }, walkCycle = 0, donkeyStride = 0;
  const donkeyLegs = [0, 1, 2, 3].map(index => art.donkey.getObjectByName(`donkey-leg-${index}`));
  let yaw = 0, pitch = .28, pointer: { id: number; x: number; y: number } | null = null;
  const keys = new Set<string>();
  const desiredCamera = new THREE.Vector3(), lookTarget = new THREE.Vector3(), movement = new THREE.Vector3();
  const donkeyTarget = new THREE.Vector3();
  const getPosition = (): WorldPosition => ({ x: player.position.x, z: player.position.z });

  function resize() {
    if (disposed) return;
    const width = Math.max(1, container.clientWidth), height = Math.max(1, container.clientHeight);
    camera.aspect = width / height; camera.updateProjectionMatrix(); renderer.setSize(width, height, false);
  }
  function applyQuality(next: RenderQuality) {
    quality = next; adaptiveSteps = 0;
    const native = window.devicePixelRatio || 1;
    pixelRatio = next === "low" ? Math.min(native, .75) : next === "high" ? Math.min(native, mobile() ? 1.5 : 1.75) : Math.min(native, mobile() ? 1.25 : 1.5);
    renderer.setPixelRatio(pixelRatio); renderer.shadowMap.enabled = next !== "low";
    if (sun.shadow.map) { sun.shadow.map.dispose(); sun.shadow.map = null; }
    sun.shadow.mapSize.set(next === "low" ? 512 : 1024, next === "low" ? 512 : 1024);
    sun.shadow.needsUpdate = true; canvas.dataset.renderQuality = next; resize();
  }
  applyQuality(quality);

  function isBlocked(x: number, z: number) {
    if (x < worldBounds.minX + PLAYER_RADIUS || x > worldBounds.maxX - PLAYER_RADIUS || z < worldBounds.minZ + PLAYER_RADIUS || z > worldBounds.maxZ - PLAYER_RADIUS) return true;
    if (x > innFootprint.minX - PLAYER_RADIUS && x < innFootprint.maxX + PLAYER_RADIUS && z > innFootprint.minZ - PLAYER_RADIUS && z < innFootprint.maxZ + PLAYER_RADIUS) return true;
    for (const obstacle of art.obstacles) if (Math.hypot(x - obstacle.x, z - obstacle.z) < obstacle.radius + PLAYER_RADIUS) return true;
    if (!mission.travelerAboard && !mission.travelerDelivered && Math.hypot(x - worldPoints.traveler.x, z - worldPoints.traveler.z) < 1.05) return true;
    if (Math.hypot(x - worldPoints.keeper.x, z - worldPoints.keeper.z) < .72) return true;
    return false;
  }
  function updateMovement(delta: number) {
    const x = touchInput.x + Number(keys.has("d") || keys.has("arrowright")) - Number(keys.has("a") || keys.has("arrowleft"));
    const z = touchInput.z + Number(keys.has("s") || keys.has("arrowdown")) - Number(keys.has("w") || keys.has("arrowup"));
    movement.set(x, 0, z);
    if (movement.lengthSq() > 1) movement.normalize();
    const speed = movement.length();
    const dx = (movement.x * Math.cos(yaw) + movement.z * Math.sin(yaw)) * WALK_SPEED * delta;
    const dz = (movement.z * Math.cos(yaw) - movement.x * Math.sin(yaw)) * WALK_SPEED * delta;
    const oldX = player.position.x, oldZ = player.position.z;
    if (!isBlocked(player.position.x + dx, player.position.z)) player.position.x += dx;
    if (!isBlocked(player.position.x, player.position.z + dz)) player.position.z += dz;
    const moving = Math.hypot(player.position.x - oldX, player.position.z - oldZ) > .0001;
    if (moving) {
      const angle = Math.atan2(dx, dz);
      const difference = Math.atan2(Math.sin(angle - player.rotation.y), Math.cos(angle - player.rotation.y));
      player.rotation.y += difference * Math.min(1, delta * 12); walkCycle += delta * 8.5 * speed;
    }
    const amplitude = moving ? (options.reducedMotion ? .22 : .36) : 0;
    const step = Math.sin(walkCycle) * amplitude;
    art.player.leftLeg.rotation.x = step; art.player.rightLeg.rotation.x = -step;
    art.player.leftArm.rotation.x = -step * .65; art.player.rightArm.rotation.x = step * .65;
    art.player.body.position.y = moving && !options.reducedMotion ? Math.abs(Math.sin(walkCycle * 2)) * .022 : 0;
    player.position.y = surfaceHeight(player.position.x, player.position.z);
  }
  function updateScene(delta: number, time: number) {
    art.traveler.root.visible = !mission.travelerAboard;
    art.traveler.bandage.visible = mission.travelerCared;
    art.rider.root.visible = mission.travelerAboard;
    art.supplies.visible = !mission.completed.includes("preparo");
    if (mission.travelerDelivered) {
      art.traveler.root.position.set(6.8, surfaceHeight(7.2, -27) + .8, -27);
      art.traveler.root.rotation.set(0, -.25, -1.45);
      donkeyTarget.set(8, surfaceHeight(8, -24), -24);
    } else {
      art.traveler.root.position.set(worldPoints.traveler.x, surfaceHeight(worldPoints.traveler.x, worldPoints.traveler.z) + .22, worldPoints.traveler.z);
      art.traveler.root.rotation.set(0, -.65, -1.45);
      const target = mission.travelerAboard && mission.companionPosition ? mission.companionPosition : worldPoints.donkey;
      donkeyTarget.set(target.x, surfaceHeight(target.x, target.z), target.z);
    }
    const differenceX = donkeyTarget.x - art.donkey.position.x, differenceZ = donkeyTarget.z - art.donkey.position.z;
    const donkeyMoving = Math.hypot(differenceX, differenceZ) > .03;
    if (donkeyMoving) donkeyStride += delta * 7;
    donkeyLegs.forEach((leg, index) => { if (leg) leg.rotation.x = donkeyMoving ? Math.sin(donkeyStride + [0, Math.PI, Math.PI / 2, Math.PI * 1.5][index]) * (options.reducedMotion ? .12 : .22) : 0; });
    if (donkeyMoving) {
      const rotation = Math.atan2(-differenceX, -differenceZ);
      art.donkey.rotation.y += Math.atan2(Math.sin(rotation - art.donkey.rotation.y), Math.cos(rotation - art.donkey.rotation.y)) * Math.min(1, delta * 7);
    }
    art.donkey.position.lerp(donkeyTarget, 1 - Math.exp(-7 * delta));
    const objective = getCurrentObjective(mission);
    art.marker.visible = Boolean(objective);
    if (objective) {
      const point = worldPoints[objective.target];
      art.marker.position.set(point.x, surfaceHeight(point.x, point.z), point.z);
      const beacon = art.marker.getObjectByName("wayfinding-marker");
      if (beacon) { beacon.rotation.y = options.reducedMotion ? 0 : time * .0006; beacon.position.y = options.reducedMotion ? 2.9 : 2.9 + Math.sin(time * .0018) * .1; }
    }
    const follow = options.reducedMotion ? 1 : 1 - Math.exp(-8 * delta);
    const distance = mobile() ? 10.5 : 11.5;
    desiredCamera.set(player.position.x + Math.sin(yaw) * Math.cos(pitch) * distance, player.position.y + 1.1 + Math.sin(pitch) * distance, player.position.z + Math.cos(yaw) * Math.cos(pitch) * distance);
    desiredCamera.y = Math.max(desiredCamera.y, surfaceHeight(desiredCamera.x, desiredCamera.z) + 1.7);
    if (desiredCamera.x > -2 && desiredCamera.x < 12 && desiredCamera.z < -28 && desiredCamera.z > -40) desiredCamera.y = Math.max(desiredCamera.y, 7.7);
    camera.position.lerp(desiredCamera, follow);
    lookTarget.set(player.position.x, player.position.y + 1.1, player.position.z); camera.lookAt(lookTarget);
    const lightX = Math.round(player.position.x * 2) / 2, lightZ = Math.round(player.position.z * 2) / 2;
    sun.position.set(lightX - 18, 26, lightZ + 12); sun.target.position.set(lightX, 0, lightZ - 3);
    if (previousStage !== mission.stage) { previousStage = mission.stage; canvas.dataset.missionStage = mission.stage; }
  }

  const active = () => !disposed && !failed && !manuallyPaused && !document.hidden && intersecting;
  function schedule() { if (active() && !raf) raf = requestAnimationFrame(frame); }
  function resetClock() { lastTime = 0; statsStart = 0; statsFrames = 0; }
  function stop() { if (raf) cancelAnimationFrame(raf); raf = 0; keys.clear(); touchInput = { x: 0, z: 0 }; resetClock(); }
  function frame(time: number) {
    raf = 0; if (!active()) return;
    const delta = lastTime ? Math.min(.15, (time - lastTime) / 1000) : 1 / 60; lastTime = time;
    if (!statsStart) statsStart = time;
    try {
      // Small physics steps preserve wall collisions without slowing walking on a busy frame.
      for (let remaining = delta; remaining > .00001;) { const step = Math.min(.03, remaining); updateMovement(step); remaining -= step; }
      updateScene(delta, time); renderer.render(scene, camera); statsFrames++;
      if (!ready) { ready = true; readyAt = performance.now(); canvas.dataset.rendererReady = "true"; options.onReady?.(); }
      if (time - lastPositionAt >= 100) { lastPositionAt = time; options.onPosition?.(getPosition()); }
      if (time - statsStart >= 1400) {
        const fps = Math.round(statsFrames * 1000 / (time - statsStart));
        options.onStats?.({ fps, drawCalls: renderer.info.render.calls, triangles: renderer.info.render.triangles, pixelRatio, quality, geometries: renderer.info.memory.geometries, textures: renderer.info.memory.textures });
        if (quality === "auto" && fps < 28 && time - readyAt > 4500 && time - lastAdaptation > 3500 && adaptiveSteps < 3) {
          lastAdaptation = time; adaptiveSteps++;
          pixelRatio = Math.max(.85, pixelRatio - .15); renderer.setPixelRatio(pixelRatio); resize();
          if (adaptiveSteps >= 2) renderer.shadowMap.enabled = false;
        }
        statsStart = time; statsFrames = 0;
      }
    } catch {
      failed = true; stop(); options.onError?.("O cenário encontrou uma dificuldade gráfica. Você pode reiniciar a experiência ou continuar pela passagem bíblica."); return;
    }
    schedule();
  }

  function keyDown(event: KeyboardEvent) {
    if (event.target !== canvas || !active()) return;
    const key = event.key.toLowerCase();
    if (["w", "a", "s", "d", "arrowup", "arrowdown", "arrowleft", "arrowright"].includes(key)) { keys.add(key); event.preventDefault(); }
    if (key === "e" && !event.repeat) { event.preventDefault(); options.onPosition?.(getPosition()); options.onInteract?.(); }
  }
  function keyUp(event: KeyboardEvent) { keys.delete(event.key.toLowerCase()); }
  function pointerDown(event: PointerEvent) {
    if (!active() || event.button !== 0) return;
    canvas.focus({ preventScroll: true }); pointer = { id: event.pointerId, x: event.clientX, y: event.clientY };
    canvas.setPointerCapture(event.pointerId);
  }
  function pointerMove(event: PointerEvent) {
    if (!pointer || pointer.id !== event.pointerId || !active()) return;
    yaw -= (event.clientX - pointer.x) * .006; pitch = THREE.MathUtils.clamp(pitch + (event.clientY - pointer.y) * .003, .15, .82);
    pointer.x = event.clientX; pointer.y = event.clientY;
  }
  function pointerEnd(event: PointerEvent) { if (pointer?.id === event.pointerId) pointer = null; if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId); }
  function clearKeys() { keys.clear(); }
  function visibility() { if (active()) { resetClock(); schedule(); } else stop(); }
  function contextLost(event: Event) { event.preventDefault(); failed = true; stop(); options.onError?.("O navegador interrompeu os gráficos para liberar recursos. Reinicie o cenário quando desejar; a leitura bíblica permanece disponível."); }
  canvas.addEventListener("keydown", keyDown); window.addEventListener("keyup", keyUp); canvas.addEventListener("blur", clearKeys); window.addEventListener("blur", clearKeys);
  canvas.addEventListener("pointerdown", pointerDown); canvas.addEventListener("pointermove", pointerMove); canvas.addEventListener("pointerup", pointerEnd); canvas.addEventListener("pointercancel", pointerEnd);
  canvas.addEventListener("webglcontextlost", contextLost); document.addEventListener("visibilitychange", visibility);
  const resizeObserver = new ResizeObserver(resize); resizeObserver.observe(container);
  const intersection = typeof IntersectionObserver !== "undefined" ? new IntersectionObserver(entries => { intersecting = entries[0]?.isIntersecting ?? true; visibility(); }, { threshold: .01 }) : null;
  intersection?.observe(container);
  // The first image already has a valid camera; the user never sees an origin flash.
  updateScene(1, performance.now()); camera.position.copy(desiredCamera); camera.lookAt(lookTarget); resize(); schedule();

  return {
    canvas, getPosition,
    focus() { if (!disposed) canvas.focus({ preventScroll: true }); },
    setInput(input) { if (disposed) return; touchInput = { x: Number.isFinite(input.x) ? THREE.MathUtils.clamp(input.x, -1, 1) : 0, z: Number.isFinite(input.z) ? THREE.MathUtils.clamp(input.z, -1, 1) : 0 }; },
    setMissionState(state) {
      if (disposed) return;
      const restart = state.stage === "encontro" && state.completed.length === 0 && Math.hypot(state.position.x - worldPoints.spawn.x, state.position.z - worldPoints.spawn.z) < .01 && Math.hypot(mission.position.x - worldPoints.spawn.x, mission.position.z - worldPoints.spawn.z) > .1;
      if (!externalStateReceived || restart) {
        player.position.set(state.position.x, surfaceHeight(state.position.x, state.position.z), state.position.z);
        if (restart) { yaw = 0; pitch = .28; player.rotation.y = Math.PI; art.donkey.position.set(worldPoints.donkey.x, surfaceHeight(worldPoints.donkey.x, worldPoints.donkey.z), worldPoints.donkey.z); }
        externalStateReceived = true;
      }
      mission = state;
    },
    setPaused(paused) { if (disposed) return; manuallyPaused = paused; if (paused) stop(); else { resetClock(); schedule(); } },
    setQuality(next) { if (!disposed) applyQuality(next); },
    dispose() {
      if (disposed) return;
      disposed = true; stop(); resizeObserver.disconnect(); intersection?.disconnect();
      canvas.removeEventListener("keydown", keyDown); window.removeEventListener("keyup", keyUp); canvas.removeEventListener("blur", clearKeys); window.removeEventListener("blur", clearKeys);
      canvas.removeEventListener("pointerdown", pointerDown); canvas.removeEventListener("pointermove", pointerMove); canvas.removeEventListener("pointerup", pointerEnd); canvas.removeEventListener("pointercancel", pointerEnd); canvas.removeEventListener("webglcontextlost", contextLost); document.removeEventListener("visibilitychange", visibility);
      const geometries = new Set<THREE.BufferGeometry>(), materials = new Set<THREE.Material>(), textures = new Set<THREE.Texture>();
      scene.traverse(object => {
        if (object instanceof THREE.Mesh) {
          geometries.add(object.geometry);
          for (const mat of Array.isArray(object.material) ? object.material : [object.material]) { materials.add(mat); for (const value of Object.values(mat)) if (value instanceof THREE.Texture) textures.add(value); }
        }
      });
      geometries.forEach(geo => geo.dispose()); materials.forEach(mat => mat.dispose()); textures.forEach(texture => texture.dispose()); sun.shadow.dispose(); scene.clear(); renderer.renderLists.dispose(); renderer.dispose(); renderer.forceContextLoss(); canvas.remove();
    },
  };
}
