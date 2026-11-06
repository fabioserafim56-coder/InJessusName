import { test, expect, type Locator, type Page } from "@playwright/test";
import { existsSync } from "node:fs";
import { careSteps, explorationLandmarks, missionStages, worldNavigationWaypoints, worldPoints, type CareStepId, type WorldPosition } from "../../src/content/games3d";
import corpus from "../../src/content/bible/blivre-tr-2018.json";

test.use({ trace: { mode: "retain-on-failure", screenshots: false, snapshots: false, sources: true } });

const route = "/jogos/caminho-da-compaixao";
const game = (page: Page) => page.locator("[data-game3d]");
const canvas = (page: Page) => page.locator("[data-game-world] canvas");
const chapter = corpus.books.find(book => book.id === "LUK")!.chapters[9];
const reading = chapter.slice(24, 37).map((text, index) => ({ number: index + 25, text }));

async function position(page: Page): Promise<WorldPosition> {
  return page.evaluate(() => {
    const element = document.querySelector<HTMLElement>("[data-game3d]");
    if (!element) throw new Error("The game is not mounted.");
    return { x: Number(element.dataset.playerX), z: Number(element.dataset.playerZ) };
  });
}

async function enter(page: Page, quality?: "low") {
  await page.goto(route);
  await expect(game(page)).toHaveAttribute("data-game-state", "intro");
  if (quality) await page.locator("#j3-intro-quality").selectOption(quality);
  await page.getByRole("button", { name: "Entrar na jornada 3D", exact: true }).click();
  await expect(game(page)).toHaveAttribute("data-game-state", "playing", { timeout: 30000 });
  await expect(canvas(page)).toBeVisible();
}

async function noOverflow(page: Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
}

/** Steer through the real input handlers; never writes position or mission state. */
async function walkTo(page: Page, target: WorldPosition, touch: boolean, tolerance = 1.2) {
  if (!touch) await canvas(page).focus();
  for (const axis of ["x", "z"] as const) {
    const start = await position(page);
    const maximumPulses = Math.ceil(Math.abs(target[axis] - start[axis]) / .3) + 12;
    let pulses = 0, stationary = 0;
    const trail: WorldPosition[] = [start];
    let current = start;
    while (true) {
      const delta = target[axis] - current[axis];
      if (Math.abs(delta) < tolerance) break;
      if (pulses++ >= maximumPulses || stationary >= 4) throw new Error(`Physical movement did not reach ${axis}=${target[axis]}; trail=${JSON.stringify(trail.slice(-8))}`);
      const direction = Math.sign(delta);
      const holdMilliseconds = Math.min(600, Math.max(120, Math.abs(delta) / 4.2 * 450));
      let release: () => Promise<unknown>;
      if (touch) {
        const bounds = await page.locator("[data-game-joystick]").boundingBox();
        if (!bounds) throw new Error("The mobile movement control is not visible.");
        const center = { x: bounds.x + bounds.width / 2, y: bounds.y + bounds.height / 2 };
        const session = await page.context().newCDPSession(page);
        await session.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ id: 13, ...center }] });
        await session.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ id: 13, x: center.x + (axis === "x" ? direction * bounds.width * .42 : 0), y: center.y + (axis === "z" ? direction * bounds.height * .42 : 0) }] });
        release = async () => { await session.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] }); await session.detach(); };
      } else {
        const key = axis === "x" ? direction > 0 ? "d" : "a" : direction > 0 ? "s" : "w";
        await page.keyboard.down(key);
        release = () => page.keyboard.up(key);
      }
      try { await page.waitForTimeout(holdMilliseconds); }
      finally { await release(); }
      // Release before reading, so a slow browser/debugger cannot run a held key past the destination.
      await page.waitForTimeout(130);
      const previous = current;
      current = await position(page);
      stationary = Math.hypot(current.x - previous.x, current.z - previous.z) < .02 ? stationary + 1 : 0;
      trail.push(current);
    }
  }
  const arrived = await position(page);
  expect(Math.hypot(arrived.x - target.x, arrived.z - target.z)).toBeLessThan(Math.SQRT2 * tolerance + .1);
}

async function simultaneousTouch(page: Page) {
  const joystick = await page.locator("[data-game-joystick]").boundingBox();
  const scene = await canvas(page).boundingBox();
  if (!joystick || !scene) throw new Error("The touch controls are not visible.");
  const walking = { id: 13, x: joystick.x + joystick.width / 2, y: joystick.y + joystick.height * .08 };
  const looking = { id: 29, x: scene.x + scene.width * .58, y: scene.y + scene.height * .55 };
  const session = await page.context().newCDPSession(page);
  try {
    await session.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ ...walking, y: joystick.y + joystick.height / 2 }] });
    await session.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [walking] });
    await session.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [walking, looking] });
    await session.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [walking, { ...looking, x: looking.x + 34 }] });
    const before = await position(page);
    await page.waitForTimeout(550);
    const after = await position(page);
    expect(Math.hypot(after.x - before.x, after.z - before.z)).toBeGreaterThan(.15);
    await test.info().attach("simultaneous-touch-movement.json", { body: JSON.stringify({ before, after }, null, 2), contentType: "application/json" });
  } finally {
    await session.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    await session.detach();
  }
  // Smooth deceleration may finish the last step after releasing the joystick.
  await page.waitForTimeout(500);
  const released = await position(page);
  await page.waitForTimeout(300);
  const stopped = await position(page);
  expect(Math.hypot(stopped.x - released.x, stopped.z - released.z)).toBeLessThan(.1);
}

async function activate(control: Locator, touch: boolean) {
  if (touch) await control.tap();
  else await control.click();
}

/** Hold the visible control until the game itself acknowledges the gesture. */
async function completeCareGesture(page: Page, step: CareStepId, touch: boolean) {
  const control = page.locator(`[data-care-action="${step}"]`);
  await expect(control).toBeVisible();
  await expect(control).toBeEnabled();
  let release: () => Promise<unknown>;
  if (touch) {
    const bounds = await control.boundingBox();
    if (!bounds) throw new Error(`The care control ${step} is not visible.`);
    const session = await page.context().newCDPSession(page);
    await session.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ id: 41, x: bounds.x + bounds.width / 2, y: bounds.y + bounds.height / 2 }] });
    release = async () => { await session.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] }); await session.detach(); };
  } else {
    await control.focus();
    await page.keyboard.down("Space");
    release = () => page.keyboard.up("Space");
  }
  try {
    await expect.poll(async () => (await game(page).getAttribute("data-care-completed"))?.split(",") ?? [], { timeout: 15000 }).toContain(step);
  } finally { await release(); }
}

async function rotateCamera(page: Page, touch: boolean) {
  const bounds = await canvas(page).boundingBox();
  if (!bounds) throw new Error("The 3D camera surface is not visible.");
  const point = { x: bounds.x + bounds.width * .61, y: bounds.y + bounds.height * .52 };
  if (touch) {
    const session = await page.context().newCDPSession(page);
    try {
      await session.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ id: 29, ...point }] });
      await session.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ id: 29, x: point.x + 42, y: point.y + 8 }] });
    } finally { await session.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] }); await session.detach(); }
  } else {
    await page.mouse.move(point.x, point.y);
    await page.mouse.down();
    try { await page.mouse.move(point.x + 60, point.y + 8, { steps: 4 }); }
    finally { await page.mouse.up(); }
  }
}

async function sprintForward(page: Page, touch: boolean) {
  if (touch) {
    const joystick = await page.locator("[data-game-joystick]").boundingBox();
    const sprint = await page.locator("[data-sprint-button]").boundingBox();
    if (!joystick || !sprint) throw new Error("The walking and sprint controls must both be visible.");
    const walking = { id: 13, x: joystick.x + joystick.width / 2, y: joystick.y + joystick.height * .08 };
    const running = { id: 31, x: sprint.x + sprint.width / 2, y: sprint.y + sprint.height / 2 };
    const session = await page.context().newCDPSession(page);
    try {
      await session.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ ...walking, y: joystick.y + joystick.height / 2 }] });
      await session.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [walking] });
      await session.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [walking, running] });
      await expect(canvas(page)).toHaveAttribute("data-sprinting", "true");
      await page.waitForTimeout(400);
    } finally { await session.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] }); await session.detach(); }
  } else {
    await canvas(page).focus();
    await page.keyboard.down("Shift");
    await page.keyboard.down("w");
    try { await expect(canvas(page)).toHaveAttribute("data-sprinting", "true"); await page.waitForTimeout(400); }
    finally { await page.keyboard.up("w"); await page.keyboard.up("Shift"); }
  }
  await expect(canvas(page)).toHaveAttribute("data-sprinting", "false");
}

test("3D loads only by choice, renders a real world and accepts movement without paid or private inputs", async ({ page, isMobile }) => {
  test.setTimeout(90000);
  const errors: string[] = [];
  const sensitive: string[] = [];
  const loaded3D: string[] = [];
  const scripts: Promise<void>[] = [];
  page.on("response", response => {
    if (response.request().resourceType() !== "script") return;
    scripts.push(response.body().then(body => { const source = body.toString("utf8"); if (source.includes("game3dCanvas") || source.includes("__THREE__")) loaded3D.push(response.url()); }).catch(() => {}));
  });
  page.on("pageerror", error => errors.push(error.message));
  page.on("request", request => {
    if (request.method() !== "GET" || /huggingface\.co|\.onnx(?:\?|$)|api\.openai|generativelanguage/.test(request.url())) sensitive.push(`${request.method()} ${request.url()}`);
  });
  await page.goto(route);
  await expect(game(page)).toHaveAttribute("data-game-state", "intro");
  await expect(canvas(page)).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Entrar na jornada 3D", exact: true })).toBeEnabled();
  await Promise.all([...scripts]);
  expect(loaded3D).toEqual([]);
  await noOverflow(page);
  await page.getByRole("button", { name: "Entrar na jornada 3D", exact: true }).click();
  await expect(game(page)).toHaveAttribute("data-game-state", "playing", { timeout: 30000 });
  await expect(canvas(page)).toBeVisible();
  const hardware = await canvas(page).evaluate(element => {
    const surface = element as HTMLCanvasElement;
    const gl = surface.getContext("webgl2");
    const debug = gl?.getExtension("WEBGL_debug_renderer_info");
    return { unmaskedRenderer: debug && gl?.getParameter(debug.UNMASKED_RENDERER_WEBGL), webgl2: !!gl, lost: gl?.isContextLost(), width: surface.width, height: surface.height, renderer: gl?.getParameter(gl.RENDERER) };
  });
  expect(hardware.webgl2).toBe(true);
  expect(hardware.lost).toBe(false);
  expect(hardware.width).toBeGreaterThan(200);
  expect(hardware.height).toBeGreaterThan(200);
  const start = await position(page);
  await walkTo(page, { x: start.x + 3, z: start.z - 3 }, isMobile);
  expect((await position(page)).z).toBeLessThan(start.z - 1);
  if (isMobile) await simultaneousTouch(page);
  await expect(game(page)).toHaveAttribute("data-mission-stage", "encontro");
  await expect(page.getByRole("radio")).toHaveCount(0);
  await expect(game(page)).toHaveAttribute("data-draw-calls", /\d+/);
  await page.getByRole("button", { name: "Pausar jornada", exact: true }).click();
  const performance = page.locator(".j3-settings details");
  await expect(performance).toBeVisible();
  await performance.locator("summary").click();
  const measured = await performance.locator("dl>div").evaluateAll(rows => Object.fromEntries(rows.map(row => [row.querySelector("dt")?.textContent ?? "", row.querySelector("dd")?.textContent ?? ""])));
  expect(Number(measured["Chamadas de desenho"])).toBeGreaterThan(0);
  expect(Number(measured["Chamadas de desenho"])).toBeLessThanOrEqual(200);
  expect(Number(measured["Triângulos"])).toBeGreaterThan(1000);
  expect(Number(measured["Triângulos"])).toBeLessThan(200000);
  expect(Number(measured["Escala de resolução"])).toBeLessThanOrEqual(1.8);
  await test.info().attach("actual-renderer-sample.json", { body: JSON.stringify({ ...measured, environment: "Chromium in this execution environment; mobile viewport emulation is not a physical-phone benchmark." }, null, 2), contentType: "application/json" });
  await noOverflow(page);
  expect((await page.context().storageState()).origins).toEqual([]);
  expect(sensitive).toEqual([]);
  expect(errors).toEqual([]);
  await test.info().attach("actual-webgl-context.json", { body: JSON.stringify(hardware, null, 2), contentType: "application/json" });
});

test("three care gestures, the bridge and an interior arrival complete the journey through real controls", async ({ page, isMobile }) => {
  // The expanded road is over twice the previous route and adds three held
  // gestures plus a real bridge/interior crossing. Input/stall bounds remain.
  test.setTimeout(420000);
  await enter(page, "low");
  await expect(game(page)).toHaveAttribute("data-mission-stage", "encontro");
  await expect(page.locator("[data-mission-action]")).toBeDisabled();
  await canvas(page).focus();
  await page.keyboard.press("e");
  await expect(game(page)).toHaveAttribute("data-mission-stage", "encontro");
  for (const [index, objective] of missionStages.entries()) {
    if (objective.id === "encontro") await walkTo(page, { x: 0, z: worldPoints.traveler.z + 3 }, isMobile);
    if (objective.id === "acolhida") {
      await expect(game(page)).toHaveAttribute("data-bridge-crossed", "false");
      await expect(page.locator("[data-mission-action]")).toBeDisabled();
      await walkTo(page, worldNavigationWaypoints.bridgeApproach, isMobile);
      await walkTo(page, worldNavigationWaypoints.bridgeExit, isMobile);
      await expect(game(page)).toHaveAttribute("data-bridge-crossed", "true", { timeout: 15000 });
      const companionZ = Number(await game(page).getAttribute("data-companion-z"));
      expect(companionZ).toBeLessThan(worldNavigationWaypoints.bridgeExit.z + 4.6);
      await expect(game(page)).toHaveAttribute("data-mission-stage", "acolhida");
      // Follow the road before turning through the actual doorway, rather than
      // cutting through a wall or writing positions directly into game state.
      await walkTo(page, { x: 0, z: worldNavigationWaypoints.innEntrance.z + 3 }, isMobile);
      await walkTo(page, worldNavigationWaypoints.innEntrance, isMobile);
      await walkTo(page, worldNavigationWaypoints.innInterior, isMobile);
    }
    if (objective.id === "continuidade") await walkTo(page, worldNavigationWaypoints.innInterior, isMobile);
    await walkTo(page, objective.id === "acolhida" ? worldNavigationWaypoints.innBedside : worldPoints[objective.target], isMobile, objective.id === "acolhida" ? .4 : 1.2);
    await expect(page.locator("[data-mission-action]")).toBeEnabled({ timeout: 15000 });
    const action = page.locator(`[data-mission-action="${objective.target}"]`);
    await expect(action).toContainText(objective.action);
    if (objective.id === "cuidado") {
      await activate(action, isMobile);
      await expect(page.locator("[data-care-panel]")).toBeVisible();
      await expect(game(page)).toHaveAttribute("data-mission-stage", "cuidado");
      await expect(game(page)).toHaveAttribute("data-care-completed", "");
      // Generic E/click opens the care station but cannot skip its three actions.
      await canvas(page).focus();
      await page.keyboard.press("e");
      await expect(game(page)).toHaveAttribute("data-care-completed", "");
      // Releasing early cancels only the gesture, without consuming its resource.
      await page.locator('[data-care-action="panos"]').focus();
      await page.keyboard.down("Space");
      try { await page.waitForTimeout(180); }
      finally { await page.keyboard.up("Space"); }
      await expect(game(page)).toHaveAttribute("data-care-completed", "");
      for (const step of careSteps) {
        await completeCareGesture(page, step.id, isMobile);
        await expect(game(page)).toHaveAttribute("data-care-completed", careSteps.slice(0, careSteps.indexOf(step) + 1).map(item => item.id).join(","));
      }
      await expect(page.locator("[data-care-panel]")).not.toBeVisible();
    } else await activate(action, isMobile);
    await expect(game(page)).toHaveAttribute("data-mission-stage", missionStages.at(index + 1)?.id ?? "concluido");
    if (objective.id === "transporte") {
      await expect(game(page)).toHaveAttribute("data-traveler-aboard", "true");
      await expect(page.locator("[data-sprint-button]")).toBeDisabled();
    }
    if (objective.id === "acolhida") {
      await expect(game(page)).toHaveAttribute("data-traveler-aboard", "false");
      expect(Number(await game(page).getAttribute("data-escort-distance"))).toBeGreaterThanOrEqual(64);
      const arrived = await position(page);
      expect(arrived.z).toBeLessThan(worldNavigationWaypoints.innInterior.z - 1);
      await page.screenshot({ path: test.info().outputPath("actual-inn-arrival.png") });
    }
  }
  await expect(game(page)).toHaveAttribute("data-game-state", "complete");
  await expect(page.getByRole("dialog", { name: "Um cuidado que continua", exact: true })).toBeVisible();
  await expect(page.getByRole("radio")).toHaveCount(0);
  await expect(game(page)).toHaveAttribute("data-discoveries", "");
  await noOverflow(page);
  await page.reload();
  await expect(game(page)).toHaveAttribute("data-mission-stage", "encontro");
  await expect(game(page)).toHaveAttribute("data-game-state", "intro");
  expect((await page.context().storageState()).origins).toEqual([]);
});

test("camera controls, a faster solitary pace and optional discoveries extend exploration without advancing the mission", async ({ page, isMobile }) => {
  test.setTimeout(180000);
  await enter(page, "low");
  const initial = await position(page);
  if (isMobile) {
    const guidance = page.getByRole("button", { name: "Mostrar ou recolher orientação", exact: true });
    await expect(guidance).toHaveAttribute("aria-expanded", "false");
    await expect(page.locator(".j3-objective-instruction")).not.toBeVisible();
    await guidance.tap();
    await expect(page.locator(".j3-objective-instruction")).toBeVisible();
    await guidance.tap();
    await expect(page.locator(".j3-objective-instruction")).not.toBeVisible();
  }
  await sprintForward(page, isMobile);
  expect((await position(page)).z).toBeLessThan(initial.z - .15);
  await rotateCamera(page, isMobile);
  await expect.poll(async () => Math.abs(Number(await canvas(page).getAttribute("data-camera-yaw")))).toBeGreaterThan(.08);
  await page.getByRole("button", { name: "Centralizar câmera", exact: true }).click();
  await expect.poll(async () => Math.abs(Number(await canvas(page).getAttribute("data-camera-yaw")))).toBeLessThan(.04);
  const distance = Number(await canvas(page).getAttribute("data-camera-distance"));
  await page.getByRole("button", { name: "Aproximar câmera", exact: true }).click();
  await expect.poll(async () => Number(await canvas(page).getAttribute("data-camera-distance"))).toBeLessThan(distance - .1);
  const near = Number(await canvas(page).getAttribute("data-camera-distance"));
  await page.getByRole("button", { name: "Afastar câmera", exact: true }).click();
  await expect.poll(async () => Number(await canvas(page).getAttribute("data-camera-distance"))).toBeGreaterThan(near + .1);
  const landmark = explorationLandmarks.find(item => item.id === "mirante")!;
  await walkTo(page, { x: 0, z: landmark.point.z }, isMobile);
  await walkTo(page, landmark.point, isMobile);
  await activate(page.locator(`[data-landmark-action="${landmark.id}"]`), isMobile);
  const explanation = page.locator(`[data-landmark-panel="${landmark.id}"]`);
  await expect(explanation).toHaveCount(1);
  await expect(explanation).toBeVisible();
  await expect(page.getByRole("dialog", { name: landmark.title, exact: true })).toBeVisible();
  await expect(explanation).toContainText(landmark.subtitle);
  await expect(explanation).toContainText(landmark.reference.label);
  await expect(game(page)).toHaveAttribute("data-discoveries", landmark.id);
  await expect(game(page)).toHaveAttribute("data-mission-stage", "encontro");
  await expect(game(page)).toHaveAttribute("data-care-completed", "");
  await noOverflow(page);
});

test("pause, Scripture and RAM resume preserve the journey while leaving releases the actual WebGL context", async ({ page, isMobile }) => {
  test.setTimeout(120000);
  await enter(page, "low");
  const initial = await position(page);
  await walkTo(page, { x: initial.x + 2, z: initial.z - 2 }, isMobile);
  const context = await canvas(page).evaluateHandle(element => (element as HTMLCanvasElement).getContext("webgl2"));
  await page.getByRole("button", { name: "Pausar jornada", exact: true }).click();
  await expect(page.getByRole("dialog", { name: "Jornada pausada", exact: true })).toBeVisible();
  await expect(game(page)).toHaveAttribute("data-game-state", "paused");
  const before = await position(page);
  await page.keyboard.down("w");
  await page.waitForTimeout(350);
  await page.keyboard.up("w");
  expect(await position(page)).toEqual(before);
  await page.getByRole("button", { name: "Continuar jornada", exact: true }).click();
  await expect(game(page)).toHaveAttribute("data-game-state", "playing");
  await page.getByRole("button", { name: "Consultar a Bíblia da jornada", exact: true }).click();
  const scripture = page.getByRole("dialog", { name: "A Palavra que acompanha este caminho", exact: true });
  await expect(scripture).toBeVisible();
  await expect(scripture.locator("[data-game-scripture-verse]")).toHaveCount(13);
  for (const verse of reading) await expect(scripture.locator(`[data-game-scripture-verse="${verse.number}"] span`)).toHaveText(verse.text);
  const readingPosition = await position(page);
  await page.keyboard.down("w");
  await page.waitForTimeout(300);
  await page.keyboard.up("w");
  expect(await position(page)).toEqual(readingPosition);
  await page.keyboard.press("Escape");
  await expect(scripture).not.toBeVisible();
  await expect(canvas(page)).toBeFocused();
  await expect(game(page)).toHaveAttribute("data-game-state", "playing");
  await page.getByRole("button", { name: "Pausar jornada", exact: true }).click();
  await page.getByRole("button", { name: "Sair do cenário", exact: true }).click();
  await expect(game(page)).toHaveAttribute("data-game-state", "intro");
  await expect(canvas(page)).toHaveCount(0);
  await expect.poll(() => context.evaluate(gl => gl?.isContextLost()), { timeout: 5000 }).toBe(true);
  await context.dispose();
  const resume = page.getByRole("button", { name: "Retomar jornada", exact: true });
  await expect(resume).toBeFocused();
  await resume.click();
  await expect(game(page)).toHaveAttribute("data-game-state", "playing", { timeout: 30000 });
  await expect(game(page)).toHaveAttribute("data-mission-stage", "encontro");
  await expect(canvas(page)).toHaveCount(1);
  const resumed = await position(page);
  expect(Math.hypot(resumed.x - before.x, resumed.z - before.z)).toBeLessThan(.2);
});

test("the full Scripture remains readable without JavaScript or a working WebGL renderer", async ({ browser, baseURL }) => {
  test.setTimeout(90000);
  const noScript = await browser.newContext({ javaScriptEnabled: false, baseURL });
  try {
    const plain = await noScript.newPage();
    await plain.goto(route);
    await expect(plain.locator("[data-game-world] canvas")).toHaveCount(0);
    await plain.locator(".j3-context details > summary").click();
    const rows = plain.locator("[data-game-scripture-verse]");
    await expect(rows).toHaveCount(13);
    await expect(rows.last()).toBeVisible();
    for (const verse of reading) await expect(plain.locator(`[data-game-scripture-verse="${verse.number}"]`)).toContainText(verse.text);
    await expect(plain.locator('a[href="/biblia?livro=LUK&capitulo=10&versiculo=25#versiculo-25"]').first()).toHaveAttribute("href", "/biblia?livro=LUK&capitulo=10&versiculo=25#versiculo-25");
  } finally { await noScript.close(); }
  const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || (existsSync("/usr/bin/chromium") ? "/usr/bin/chromium" : undefined);
  const disabled = await browser.browserType().launch({ executablePath, args: ["--disable-webgl"] });
  try {
    const context = await disabled.newContext({ baseURL });
    const unsupported = await context.newPage();
    await unsupported.goto(route);
    await unsupported.getByRole("button", { name: "Entrar na jornada 3D", exact: true }).click();
    await expect(game(unsupported)).toHaveAttribute("data-game-state", "error", { timeout: 30000 });
    await expect(unsupported.locator('a[href="/jogos?jogo=caminho"]').first()).toBeVisible();
    await expect(unsupported.locator("[data-game-scripture-verse]")).toHaveCount(13);
  } finally { await disabled.close(); }
});
