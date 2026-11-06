import { test, expect, type Locator, type Page } from "@playwright/test";
import { existsSync } from "node:fs";
import { missionStages, worldPoints, type WorldPosition } from "../../src/content/games3d";
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
async function walkTo(page: Page, target: WorldPosition, touch: boolean) {
  if (!touch) await canvas(page).focus();
  for (const axis of ["x", "z"] as const) {
    const start = await position(page);
    const maximumPulses = Math.ceil(Math.abs(target[axis] - start[axis]) / .3) + 12;
    let pulses = 0, stationary = 0;
    const trail: WorldPosition[] = [start];
    let current = start;
    while (true) {
      const delta = target[axis] - current[axis];
      if (Math.abs(delta) < 1.2) break;
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
  expect(Math.hypot(arrived.x - target.x, arrived.z - target.z)).toBeLessThan(2.2);
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
  await page.waitForTimeout(150);
  const released = await position(page);
  await page.waitForTimeout(350);
  const stopped = await position(page);
  expect(Math.hypot(stopped.x - released.x, stopped.z - released.z)).toBeLessThan(.15);
}

async function activate(control: Locator, touch: boolean) {
  if (touch) await control.tap();
  else await control.click();
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

test("walking, care, escort and next-day provision complete six connected actions through real controls", async ({ page, isMobile }) => {
  test.setTimeout(180000);
  await enter(page, "low");
  await expect(game(page)).toHaveAttribute("data-mission-stage", "encontro");
  await expect(page.locator("[data-mission-action]")).toBeDisabled();
  await canvas(page).focus();
  await page.keyboard.press("e");
  await expect(game(page)).toHaveAttribute("data-mission-stage", "encontro");
  for (const [index, objective] of missionStages.entries()) {
    if (objective.id === "encontro") await walkTo(page, { x: 0, z: 7 }, isMobile);
    if (objective.id === "acolhida") await walkTo(page, { x: 0, z: -23 }, isMobile);
    await walkTo(page, worldPoints[objective.target], isMobile);
    await expect(page.locator("[data-mission-action]")).toBeEnabled({ timeout: 10000 });
    const action = page.locator(`[data-mission-action="${objective.target}"]`);
    await expect(action).toContainText(objective.action);
    await activate(action, isMobile);
    await expect(game(page)).toHaveAttribute("data-mission-stage", missionStages[index + 1]?.id ?? "concluido");
    if (objective.id === "transporte") await expect(game(page)).toHaveAttribute("data-traveler-aboard", "true");
    if (objective.id === "acolhida") {
      await expect(game(page)).toHaveAttribute("data-traveler-aboard", "false");
      expect(Number(await game(page).getAttribute("data-escort-distance"))).toBeGreaterThanOrEqual(24);
    }
  }
  await expect(game(page)).toHaveAttribute("data-game-state", "complete");
  await expect(page.getByRole("dialog", { name: "Um cuidado que continua", exact: true })).toBeVisible();
  await expect(page.getByRole("radio")).toHaveCount(0);
  await noOverflow(page);
  await page.reload();
  await expect(game(page)).toHaveAttribute("data-mission-stage", "encontro");
  await expect(game(page)).toHaveAttribute("data-game-state", "intro");
  expect((await page.context().storageState()).origins).toEqual([]);
});

test("pause and Scripture stop movement, while leaving releases the actual WebGL context", async ({ page }) => {
  test.setTimeout(90000);
  await enter(page);
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
  await page.getByRole("button", { name: "Entrar na jornada 3D", exact: true }).click();
  await expect(game(page)).toHaveAttribute("data-game-state", "playing", { timeout: 30000 });
  await expect(game(page)).toHaveAttribute("data-mission-stage", "encontro");
  await expect(canvas(page)).toHaveCount(1);
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
