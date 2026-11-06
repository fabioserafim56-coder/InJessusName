import * as THREE from "three";
import { createMissionState, getAvailableInteraction, innFootprint, worldBounds, worldPoints, type MissionState, type WorldPosition } from "@/content/games3d";
import { buildWorldArt, surfaceHeight } from "./world-art";
import { createInnWalls, createTrailFollower, moveWithCollisions, type SolidRect } from "./navigation";

export type RenderQuality = "auto" | "low" | "high";
export type ActionActivity = Readonly<{ kind: "cloth" | "oil-wine" | "bandage"; progress: number }>;
export type WorldStats = Readonly<{ fps: number; drawCalls: number; triangles: number; pixelRatio: number; quality: RenderQuality; geometries: number; textures: number }>;
export type GameWorldOptions = Readonly<{
  reducedMotion?: boolean;
  quality?: RenderQuality;
  onReady?: () => void;
  onPosition?: (position: WorldPosition) => void;
  onCompanionPosition?: (position: WorldPosition) => void;
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
  setSprint: (sprint: boolean) => void;
  setCameraZoom: (delta: number) => void;
  recenterCamera: () => void;
  setActionActivity: (activity: ActionActivity | null) => void;
  focus: () => void;
  dispose: () => void;
}>;

type EnhancedArt = ReturnType<typeof buildWorldArt> & Partial<{
  architecture: THREE.Group;
  door: THREE.Group;
  bed: THREE.Group;
  wallRects: SolidRect[];
  solidRects: SolidRect[];
  materialsReady: Promise<void>;
  disposeAssets: () => void;
}>;

const WALK_SPEED = 4.7;
const RUN_SPEED = 7.3;
const ESCORT_SPEED = 3.65;
const PLAYER_RADIUS = .43;
const DEFAULT_PITCH = .28;
const finite = (value: number, fallback = 0) => Number.isFinite(value) ? value : fallback;
const approachAngle = (current: number, target: number, amount: number) => current + Math.atan2(Math.sin(target - current), Math.cos(target - current)) * amount;

/** One original world, loaded after choosing to enter; all per-frame work stays here. */
export function createGameWorld(container: HTMLElement, options: GameWorldOptions = {}): GameWorld {
  const canvas = document.createElement("canvas");
  canvas.tabIndex = 0;
  canvas.setAttribute("role", "img");
  canvas.setAttribute("aria-label", "Cenário 3D controlável. Use W A S D ou as setas para caminhar, Shift para correr quando estiver sozinho e E para interagir. Arraste para olhar ao redor.");
  canvas.dataset.game3dCanvas = "true";
  Object.assign(canvas.style, { display: "block", width: "100%", height: "100%", touchAction: "none" });
  const mobile = () => container.clientWidth < 760 || matchMedia("(pointer: coarse)").matches;
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: !mobile() && options.quality !== "low", alpha: false, powerPreference: "high-performance", stencil: false, preserveDrawingBuffer: false });
  } catch {
    throw new Error("Este navegador não conseguiu preparar os gráficos WebGL2. A leitura da passagem permanece disponível; tente outro navegador para explorar o cenário.");
  }
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.14;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.setClearColor(0xc4d6df, 1);
  container.appendChild(canvas);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xc4d6df);
  scene.fog = new THREE.Fog(0xd1d4c1, 72, 195);
  const camera = new THREE.PerspectiveCamera(54, 1, .12, 260);
  scene.add(new THREE.HemisphereLight(0xe3eff5, 0x7d785a, 1.9));
  const sun = new THREE.DirectionalLight(0xffdfaa, 3.05);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  Object.assign(sun.shadow.camera, { left: -20, right: 20, top: 20, bottom: -20, near: .5, far: 85 });
  sun.shadow.normalBias = .045; sun.shadow.bias = -.00015; sun.shadow.radius = 2;
  scene.add(sun, sun.target);
  let art: EnhancedArt;
  try { art = buildWorldArt(scene); }
  catch (error) { renderer.dispose(); renderer.forceContextLoss(); canvas.remove(); throw error; }

  let disposed = false, failed = false, manuallyPaused = false, intersecting = true;
  let mission = createMissionState(), externalStateReceived = false;
  let activity: ActionActivity | null = null, careBlend = 0, sprintRequested = false;
  let raf = 0, lastTime = 0, statsStart = 0, statsFrames = 0, lastPositionAt = 0;
  let quality: RenderQuality = options.quality ?? "auto", readyAt = 0;
  let pixelRatio = 1, adaptiveSteps = 0, lastAdaptation = 0, ready = false;
  let walkCycle = 0, donkeyStride = 0, previousStage = mission.stage;
  let input = { x: 0, z: 0 }, velocity = { x: 0, z: 0 };
  let yaw = 0, targetYaw = 0, pitch = DEFAULT_PITCH, targetPitch = DEFAULT_PITCH, zoom = 0, cameraDistance = 11;
  let pointer: { id: number; x: number; y: number } | null = null;
  const keys = new Set<string>();
  const player = art.player.root;
  player.position.set(worldPoints.spawn.x, surfaceHeight(worldPoints.spawn.x, worldPoints.spawn.z), worldPoints.spawn.z);
  player.rotation.y = Math.PI;
  const trail = createTrailFollower({ ...worldPoints.donkey }, 1.85);
  let companionPosition: WorldPosition = { ...worldPoints.donkey };
  const innDoorX = 5;
  const wallRects = art.solidRects ?? art.wallRects ?? [
    ...createInnWalls(innFootprint, innDoorX, 3.3, .6),
    { minX: worldBounds.minX, maxX: -3.5, minZ: -9, maxZ: -1 },
    { minX: 3.5, maxX: worldBounds.maxX, minZ: -9, maxZ: -1 },
    { minX: -3.95, maxX: -3.13, minZ: -12, maxZ: 2 },
    { minX: 3.13, maxX: 3.95, minZ: -12, maxZ: 2 },
  ];
  const desiredCamera = new THREE.Vector3(), lookTarget = new THREE.Vector3(), castDirection = new THREE.Vector3();
  const cameraRay = new THREE.Raycaster();
  const architecture = art.architecture ?? null;
  const donkeyLegs = [0, 1, 2, 3].map(index => art.donkey.getObjectByName(`donkey-leg-${index}`));
  const getPosition = (): WorldPosition => ({ x: player.position.x, z: player.position.z });
  const insideInn = (point: WorldPosition) => point.x > innFootprint.minX + .6 && point.x < innFootprint.maxX - .6 && point.z < innFootprint.maxZ + .35 && point.z > innFootprint.minZ + .6;

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

  function collisionCircles() {
    return [
      ...art.obstacles,
      ...(!mission.travelerAboard && !mission.travelerDelivered ? [{ x: worldPoints.traveler.x, z: worldPoints.traveler.z, radius: .68 }] : []),
      { x: worldPoints.keeper.x, z: worldPoints.keeper.z, radius: .36 },
    ];
  }
  // Static objects are reused; dynamic NPC exclusion changes only on a mission transition.
  let circles = collisionCircles();
  function updateMovement(delta: number) {
    const rawX = activity ? 0 : input.x + Number(keys.has("d") || keys.has("arrowright")) - Number(keys.has("a") || keys.has("arrowleft"));
    const rawZ = activity ? 0 : input.z + Number(keys.has("s") || keys.has("arrowdown")) - Number(keys.has("w") || keys.has("arrowup"));
    const length = Math.hypot(rawX, rawZ), magnitude = length < .09 ? 0 : Math.min(1, length);
    const sprinting = !activity && !mission.travelerAboard && !insideInn(getPosition()) && (sprintRequested || keys.has("shift"));
    const speed = mission.travelerAboard ? ESCORT_SPEED : sprinting ? RUN_SPEED : WALK_SPEED;
    const normalX = length ? rawX / length * magnitude : 0, normalZ = length ? rawZ / length * magnitude : 0;
    const wantedX = (normalX * Math.cos(yaw) + normalZ * Math.sin(yaw)) * speed;
    const wantedZ = (normalZ * Math.cos(yaw) - normalX * Math.sin(yaw)) * speed;
    const blend = 1 - Math.exp(-(magnitude ? 10 : 18) * delta);
    velocity.x = THREE.MathUtils.lerp(velocity.x, wantedX, blend);
    velocity.z = THREE.MathUtils.lerp(velocity.z, wantedZ, blend);
    if (activity || Math.hypot(velocity.x, velocity.z) < .015) velocity = { x: 0, z: 0 };
    const old = getPosition();
    const next = moveWithCollisions(old, { x: velocity.x * delta, z: velocity.z * delta }, PLAYER_RADIUS, worldBounds, wallRects, circles);
    player.position.set(next.x, surfaceHeight(next.x, next.z), next.z);
    const actualSpeed = Math.hypot(next.x - old.x, next.z - old.z) / Math.max(delta, .001);
    if (actualSpeed > .04) {
      const angle = Math.atan2(next.x - old.x, next.z - old.z);
      player.rotation.y = approachAngle(player.rotation.y, angle, 1 - Math.exp(-12 * delta));
      walkCycle += actualSpeed * delta * 2.05;
    }
    const swing = Math.min(.58, actualSpeed * .075) * (options.reducedMotion ? .6 : 1);
    const step = Math.sin(walkCycle) * swing;
    careBlend = THREE.MathUtils.lerp(careBlend, activity ? 1 : 0, 1 - Math.exp(-9 * delta));
    art.player.leftLeg.rotation.x = THREE.MathUtils.lerp(step, -.68, careBlend);
    art.player.rightLeg.rotation.x = THREE.MathUtils.lerp(-step, .5, careBlend);
    art.player.leftArm.rotation.x = THREE.MathUtils.lerp(-step * .65, -.95, careBlend);
    art.player.rightArm.rotation.x = THREE.MathUtils.lerp(step * .65, -1.13 + Math.sin((activity?.progress ?? 0) * Math.PI * 4) * .1, careBlend);
    art.player.rightForearm.rotation.x = careBlend * (activity?.kind === "oil-wine" ? -.65 : -.25);
    art.player.rightHand.rotation.z = activity?.kind === "oil-wine" ? Math.sin(activity.progress * Math.PI) * .8 : 0;
    Object.entries(art.careTools).forEach(([kind, tool]) => { tool.visible = activity?.kind === kind; });
    art.player.body.position.y = (actualSpeed > .04 && !options.reducedMotion ? Math.abs(Math.sin(walkCycle * 2)) * .025 : 0) - careBlend * .25;
    art.player.body.rotation.x = careBlend * .14;
    if (activity) player.rotation.y = approachAngle(player.rotation.y, Math.atan2(worldPoints.traveler.x - next.x, worldPoints.traveler.z - next.z), 1 - Math.exp(-10 * delta));
    return actualSpeed;
  }

  function updateScene(delta: number, time: number) {
    art.traveler.root.visible = !mission.travelerAboard;
    art.traveler.bandage.visible = mission.travelerCared;
    art.rider.root.visible = mission.travelerAboard;
    art.supplies.visible = !mission.completed.includes("preparo");
    if (mission.travelerDelivered) {
      art.traveler.root.position.set(worldPoints.inn.x, surfaceHeight(worldPoints.inn.x, worldPoints.inn.z) + .63, worldPoints.inn.z + 1.0);
      art.traveler.root.rotation.set(0, Math.PI / 2, -Math.PI / 2);
      companionPosition = { x: worldPoints.inn.x - 2.2, z: innFootprint.maxZ + 2.2 };
    } else {
      art.traveler.root.position.set(worldPoints.traveler.x, surfaceHeight(worldPoints.traveler.x, worldPoints.traveler.z) + .22, worldPoints.traveler.z);
      art.traveler.root.rotation.set(0, -.65, -1.45);
      companionPosition = mission.travelerAboard ? trail.update(getPosition()) : { ...worldPoints.donkey };
    }
    const dx = companionPosition.x - art.donkey.position.x, dz = companionPosition.z - art.donkey.position.z;
    const donkeyMoved = Math.hypot(dx, dz);
    if (donkeyMoved > .001) donkeyStride += donkeyMoved * 2.25;
    donkeyLegs.forEach((leg, index) => { if (leg) leg.rotation.x = donkeyMoved > .001 ? Math.sin(donkeyStride + [0, Math.PI, Math.PI / 2, Math.PI * 1.5][index]) * (options.reducedMotion ? .12 : .25) : 0; });
    if (donkeyMoved > .004) art.donkey.rotation.y = approachAngle(art.donkey.rotation.y, Math.atan2(-dx, -dz), 1 - Math.exp(-9 * delta));
    art.donkey.position.set(companionPosition.x, surfaceHeight(companionPosition.x, companionPosition.z), companionPosition.z);
    const interaction = getAvailableInteraction(mission);
    art.marker.visible = Boolean(interaction);
    if (interaction) {
      art.marker.position.set(interaction.point.x, surfaceHeight(interaction.point.x, interaction.point.z), interaction.point.z);
      const beacon = art.marker.getObjectByName("wayfinding-marker");
      if (beacon) { beacon.rotation.y = options.reducedMotion ? 0 : time * .0005; beacon.position.y = 2.7 + (options.reducedMotion ? 0 : Math.sin(time * .0015) * .08); }
    }
    const indoors = insideInn(getPosition());
    yaw = approachAngle(yaw, targetYaw, options.reducedMotion ? 1 : 1 - Math.exp(-12 * delta));
    pitch = THREE.MathUtils.lerp(pitch, targetPitch, options.reducedMotion ? 1 : 1 - Math.exp(-12 * delta));
    const baseDistance = indoors ? 4.7 : mobile() ? 10.1 : 11.5;
    const distance = THREE.MathUtils.lerp(baseDistance, 6.3, careBlend) * THREE.MathUtils.clamp(1 + zoom * .11, .58, 1.65);
    desiredCamera.set(player.position.x + Math.sin(yaw) * Math.cos(pitch) * distance, player.position.y + 1.15 + Math.sin(pitch) * distance, player.position.z + Math.cos(yaw) * Math.cos(pitch) * distance);
    // A shoulder view keeps the follower from hiding the person leading it.
    const shoulder = mission.travelerAboard ? indoors ? 1.1 : 2.2 : 0;
    desiredCamera.x += Math.cos(yaw) * shoulder;
    desiredCamera.z -= Math.sin(yaw) * shoulder;
    desiredCamera.y = Math.max(desiredCamera.y, surfaceHeight(desiredCamera.x, desiredCamera.z) + 1.25);
    if (indoors) desiredCamera.y = Math.min(desiredCamera.y, player.position.y + 3.35);
    lookTarget.set(player.position.x, player.position.y + 1.15 - careBlend * .18, player.position.z);
    if (architecture) {
      architecture.updateMatrixWorld(true);
      castDirection.copy(desiredCamera).sub(lookTarget); const length = castDirection.length(); castDirection.normalize();
      cameraRay.set(lookTarget, castDirection); cameraRay.far = length;
      const nearest = cameraRay.intersectObject(architecture, true).find(hit => hit.distance > .3 && (hit.object as THREE.Mesh).isMesh);
      if (nearest) desiredCamera.copy(lookTarget).addScaledVector(castDirection, Math.max(.75, nearest.distance - .25));
    }
    cameraDistance = desiredCamera.distanceTo(lookTarget);
    camera.position.lerp(desiredCamera, options.reducedMotion ? 1 : 1 - Math.exp(-9 * delta)); camera.lookAt(lookTarget);
    const lightX = Math.round(player.position.x), lightZ = Math.round(player.position.z);
    sun.position.set(lightX - 18, 28, lightZ + 12); sun.target.position.set(lightX, 0, lightZ - 3);
    if (previousStage !== mission.stage) { previousStage = mission.stage; canvas.dataset.missionStage = mission.stage; }
  }

  const active = () => !disposed && !failed && !manuallyPaused && !document.hidden && intersecting;
  function schedule() { if (active() && !raf) raf = requestAnimationFrame(frame); }
  function resetClock() { lastTime = 0; statsStart = 0; statsFrames = 0; }
  function clearInput() { keys.clear(); input = { x: 0, z: 0 }; velocity = { x: 0, z: 0 }; sprintRequested = false; pointer = null; }
  function stop() { if (raf) cancelAnimationFrame(raf); raf = 0; clearInput(); resetClock(); }
  function frame(time: number) {
    raf = 0; if (!active()) return;
    const delta = lastTime ? Math.min(.18, (time - lastTime) / 1000) : 1 / 60; lastTime = time;
    if (!statsStart) statsStart = time;
    try {
      let speed = 0;
      for (let remaining = delta; remaining > .00001;) { const step = Math.min(.03, remaining); speed = updateMovement(step); remaining -= step; }
      updateScene(delta, time); renderer.render(scene, camera); statsFrames++;
      if (!ready) { ready = true; readyAt = performance.now(); canvas.dataset.rendererReady = "true"; options.onReady?.(); }
      if (time - lastPositionAt >= 100) {
        lastPositionAt = time; options.onPosition?.(getPosition());
        if (mission.travelerAboard) options.onCompanionPosition?.({ ...companionPosition });
        canvas.dataset.cameraYaw = yaw.toFixed(3); canvas.dataset.cameraPitch = pitch.toFixed(3); canvas.dataset.cameraDistance = cameraDistance.toFixed(2); canvas.dataset.cameraZoom = zoom.toFixed(2);
        canvas.dataset.moving = String(speed > .04); canvas.dataset.speed = speed.toFixed(2); canvas.dataset.sprinting = String(speed > WALK_SPEED + .5);
      }
      if (time - statsStart >= 1400) {
        const fps = Math.round(statsFrames * 1000 / (time - statsStart));
        options.onStats?.({ fps, drawCalls: renderer.info.render.calls, triangles: renderer.info.render.triangles, pixelRatio, quality, geometries: renderer.info.memory.geometries, textures: renderer.info.memory.textures });
        if (quality === "auto" && fps < 28 && time - readyAt > 4500 && time - lastAdaptation > 3500 && adaptiveSteps < 3) {
          lastAdaptation = time; adaptiveSteps++; pixelRatio = Math.max(.85, pixelRatio - .15); renderer.setPixelRatio(pixelRatio); resize();
          if (adaptiveSteps >= 2) renderer.shadowMap.enabled = false;
        }
        statsStart = time; statsFrames = 0;
      }
    } catch {
      failed = true; stop(); options.onError?.("O cenário encontrou uma dificuldade gráfica. Você pode retomar a jornada ou continuar pela passagem bíblica."); return;
    }
    schedule();
  }

  function keyDown(event: KeyboardEvent) {
    if (event.target !== canvas || !active()) return;
    const key = event.key.toLowerCase();
    if (["w", "a", "s", "d", "arrowup", "arrowdown", "arrowleft", "arrowright", "shift"].includes(key)) { keys.add(key); event.preventDefault(); }
    if (key === "e" && !event.repeat) { event.preventDefault(); options.onPosition?.(getPosition()); options.onInteract?.(); }
    if (key === "c" && !event.repeat) { event.preventDefault(); recenterCamera(); }
  }
  function keyUp(event: KeyboardEvent) { keys.delete(event.key.toLowerCase()); }
  function pointerDown(event: PointerEvent) {
    if (!active() || event.button !== 0) return;
    canvas.focus({ preventScroll: true }); pointer = { id: event.pointerId, x: event.clientX, y: event.clientY }; canvas.setPointerCapture(event.pointerId);
  }
  function pointerMove(event: PointerEvent) {
    if (!pointer || pointer.id !== event.pointerId || !active()) return;
    targetYaw -= (event.clientX - pointer.x) * .005; targetPitch = THREE.MathUtils.clamp(targetPitch + (event.clientY - pointer.y) * .003, .14, .86);
    pointer.x = event.clientX; pointer.y = event.clientY;
  }
  function pointerEnd(event: PointerEvent) { if (pointer?.id === event.pointerId) pointer = null; if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId); }
  function clearKeys() { keys.clear(); }
  function wheel(event: WheelEvent) { if (!active()) return; event.preventDefault(); setCameraZoom(event.deltaY * .008); }
  function visibility() { if (active()) { resetClock(); schedule(); } else stop(); }
  function contextLost(event: Event) { event.preventDefault(); failed = true; stop(); options.onError?.("O navegador interrompeu os gráficos para liberar recursos. Retome o cenário quando desejar; a leitura bíblica permanece disponível."); }
  function setCameraZoom(delta: number) { if (!disposed && Number.isFinite(delta)) zoom = THREE.MathUtils.clamp(zoom + delta, -3.8, 5); }
  function recenterCamera() { if (disposed) return; targetYaw = player.rotation.y + Math.PI; targetPitch = DEFAULT_PITCH; zoom = 0; }
  canvas.addEventListener("keydown", keyDown); window.addEventListener("keyup", keyUp); canvas.addEventListener("blur", clearKeys); window.addEventListener("blur", clearKeys);
  canvas.addEventListener("pointerdown", pointerDown); canvas.addEventListener("pointermove", pointerMove); canvas.addEventListener("pointerup", pointerEnd); canvas.addEventListener("pointercancel", pointerEnd); canvas.addEventListener("wheel", wheel, { passive: false });
  canvas.addEventListener("webglcontextlost", contextLost); document.addEventListener("visibilitychange", visibility);
  const resizeObserver = new ResizeObserver(resize); resizeObserver.observe(container);
  const intersection = typeof IntersectionObserver !== "undefined" ? new IntersectionObserver(entries => { intersecting = entries[0]?.isIntersecting ?? true; visibility(); }, { threshold: .01 }) : null;
  intersection?.observe(container);
  canvas.dataset.materialsReady = String(!art.materialsReady);
  void art.materialsReady?.then(() => { if (!disposed) canvas.dataset.materialsReady = "true"; }).catch(() => { if (!disposed) canvas.dataset.materialsReady = "fallback"; });
  updateScene(1, performance.now()); camera.position.copy(desiredCamera); camera.lookAt(lookTarget); resize(); schedule();

  return {
    canvas, getPosition,
    focus() { if (!disposed) canvas.focus({ preventScroll: true }); },
    setInput(next) { if (!disposed) input = { x: THREE.MathUtils.clamp(finite(next.x), -1, 1), z: THREE.MathUtils.clamp(finite(next.z), -1, 1) }; },
    setSprint(next) { if (!disposed) sprintRequested = next; },
    setCameraZoom, recenterCamera,
    setActionActivity(next) { if (disposed) return; activity = next ? { kind: next.kind, progress: THREE.MathUtils.clamp(finite(next.progress), 0, 1) } : null; if (activity) { keys.clear(); input = { x: 0, z: 0 }; velocity = { x: 0, z: 0 }; sprintRequested = false; } },
    setMissionState(state) {
      if (disposed) return;
      const initializing = !externalStateReceived;
      const restarting = state.stage === "encontro" && state.completed.length === 0 && Math.hypot(state.position.x - worldPoints.spawn.x, state.position.z - worldPoints.spawn.z) < .01 && Math.hypot(mission.position.x - worldPoints.spawn.x, mission.position.z - worldPoints.spawn.z) > .1;
      const boarded = state.travelerAboard && !mission.travelerAboard;
      if (!externalStateReceived || restarting) {
        player.position.set(state.position.x, surfaceHeight(state.position.x, state.position.z), state.position.z);
        companionPosition = state.companionPosition ? { ...state.companionPosition } : { ...worldPoints.donkey };
        trail.reset(companionPosition);
        clearInput(); activity = null;
        if (restarting) { yaw = targetYaw = 0; pitch = targetPitch = DEFAULT_PITCH; zoom = 0; player.rotation.y = Math.PI; }
        externalStateReceived = true;
      } else if (boarded) { companionPosition = { ...worldPoints.donkey }; trail.reset(companionPosition); }
      if (mission.travelerAboard !== state.travelerAboard || mission.travelerDelivered !== state.travelerDelivered) circles = collisionCirclesFor(state);
      mission = state;
      if (initializing || restarting) { updateScene(1, performance.now()); camera.position.copy(desiredCamera); camera.lookAt(lookTarget); }
    },
    setPaused(paused) { if (disposed) return; manuallyPaused = paused; if (paused) stop(); else { resetClock(); schedule(); } },
    setQuality(next) { if (!disposed) applyQuality(next); },
    dispose() {
      if (disposed) return;
      disposed = true; stop(); trail.dispose(); resizeObserver.disconnect(); intersection?.disconnect(); art.disposeAssets?.();
      canvas.removeEventListener("keydown", keyDown); window.removeEventListener("keyup", keyUp); canvas.removeEventListener("blur", clearKeys); window.removeEventListener("blur", clearKeys);
      canvas.removeEventListener("pointerdown", pointerDown); canvas.removeEventListener("pointermove", pointerMove); canvas.removeEventListener("pointerup", pointerEnd); canvas.removeEventListener("pointercancel", pointerEnd); canvas.removeEventListener("wheel", wheel); canvas.removeEventListener("webglcontextlost", contextLost); document.removeEventListener("visibilitychange", visibility);
      const geometries = new Set<THREE.BufferGeometry>(), materials = new Set<THREE.Material>(), textures = new Set<THREE.Texture>();
      scene.traverse(object => { if (object instanceof THREE.Mesh) { geometries.add(object.geometry); for (const mat of Array.isArray(object.material) ? object.material : [object.material]) { materials.add(mat); for (const value of Object.values(mat)) if (value instanceof THREE.Texture) textures.add(value); } } });
      geometries.forEach(geo => geo.dispose()); materials.forEach(mat => mat.dispose()); textures.forEach(texture => texture.dispose()); sun.shadow.dispose(); scene.clear(); renderer.renderLists.dispose(); renderer.dispose(); renderer.forceContextLoss(); canvas.remove();
    },
  };

  function collisionCirclesFor(state: MissionState) {
    return [...art.obstacles,
      ...(!state.travelerAboard && !state.travelerDelivered ? [{ x: worldPoints.traveler.x, z: worldPoints.traveler.z, radius: .68 }] : []),
      { x: worldPoints.keeper.x, z: worldPoints.keeper.z, radius: .36 },
    ];
  }
}
