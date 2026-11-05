import { test, expect, type Page } from "@playwright/test";
import { narratedPassages } from "../../src/content/narration";
import { museumExhibits } from "../../src/content/museum";
import { getMuseumObservations } from "../../src/content/multimodal/museum";

test.use({ reducedMotion: "reduce" });

const experiences = [
  { mode: "ouvir", name: "Ler e ouvir", selector: "[data-narrated-reading]" },
  { mode: "perguntar", name: "Trazer minha pergunta", selector: "[data-semantic-search]" },
  { mode: "camera", name: "Abrir pela câmera", selector: "[data-passage-camera]" },
  { mode: "contar", name: "Contar o que aprendi", selector: "[data-oral-practice]" },
  { mode: "historias", name: "Caminhar na história", selector: "[data-story-world]" },
  { mode: "museu", name: "Olhar a história de perto", selector: "[data-multimodal-museum]" }
] as const;

async function openExperience(page: Page, mode: string) {
  await page.goto(`/explorar?modo=${mode}`);
  await expect(page.locator("[data-multimodal-hub]")).toHaveAttribute("data-multimodal-ready", "true");
  await expect(page.locator("[data-multimodal-hub]")).toHaveAttribute("data-exploration-mode", mode);
}

async function noHorizontalOverflow(page: Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
}

test("as seis experiências abrem por referência direta e só preparam modelos após uma escolha explícita", async ({ page }) => {
  const modelRequests: string[] = [];
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("request", request => {
    if (/huggingface\.co|cdn-lfs\.|hf\.co|\.(?:onnx|wasm|traineddata)(?:[.?/]|$)|\/models\/runtime\/|\/semantic\/(?:index|embeddings)/i.test(request.url())) {
      modelRequests.push(request.url());
    }
  });
  for (const [index, experience] of experiences.entries()) {
    await openExperience(page, experience.mode);
    await expect(page.locator(experience.selector)).toBeVisible();
    const choices = page.getByRole("group", { name: "Escolher uma experiência de estudo", exact: true });
    await expect(choices.getByRole("button")).toHaveCount(6);
    await expect(choices.getByRole("button", { name: new RegExp(experience.name) })).toHaveAttribute("aria-pressed", "true");
    await noHorizontalOverflow(page);

    const next = experiences[(index + 1) % experiences.length];
    await choices.getByRole("button", { name: new RegExp(next.name) }).click();
    await expect(page).toHaveURL(url => url.searchParams.get("modo") === next.mode);
    await expect(page.locator(next.selector)).toBeVisible();
    await expect(page.locator(".mh-panel")).toBeFocused();
  }
  expect(modelRequests).toEqual([]);
  expect(errors).toEqual([]);
});

test("a narração reproduz MP3 real, acompanha o fim nativo e mantém texto e referência do versículo", async ({ page }) => {
  const passage = narratedPassages[0];
  const mediaRequests: string[] = [];
  page.on("request", request => {
    if (/\/audio\/scripture\/.*\.mp3(?:\?|$)/.test(request.url())) mediaRequests.push(request.url());
  });
  await openExperience(page, "ouvir");
  const player = page.locator("[data-narrated-reading]");
  const audio = player.locator("audio");
  await expect(player).toHaveAttribute("data-narration-ready", "true");
  await expect(player).toHaveAttribute("data-narrated-reading", passage.id);
  await expect(audio).toHaveAttribute("preload", "none");
  await expect(audio).toHaveAttribute("src", passage.verses[0].src);
  expect(await audio.evaluate((element: HTMLAudioElement) => ({ paused: element.paused, time: element.currentTime }))).toEqual({ paused: true, time: 0 });
  expect(mediaRequests).toEqual([]);
  await expect(player.locator("[data-narrated-current-text]")).toHaveText(passage.verses[0].text);

  await player.getByRole("button", { name: "Ouvir versículo", exact: true }).click();
  await expect.poll(() => audio.evaluate((element: HTMLAudioElement) => !element.paused && element.currentTime > .1)).toBe(true);
  const duration = await audio.evaluate((element: HTMLAudioElement) => element.duration);
  expect(Math.abs(duration - passage.verses[0].durationSeconds)).toBeLessThan(.1);
  // Seeking close to the end lets the native media decoder fire ended; no synthetic event or audio stub is used.
  await audio.evaluate((element: HTMLAudioElement) => { element.currentTime = Math.max(0, element.duration - .15); });
  await expect(player).toHaveAttribute("data-narrated-verse", String(passage.verses[1].number));
  await expect.poll(() => audio.evaluate((element: HTMLAudioElement) => !element.paused && element.currentTime > .1)).toBe(true);
  await expect(player.locator("[data-narrated-current-text]")).toHaveText(passage.verses[1].text);
  await player.getByRole("button", { name: "Pausar leitura", exact: true }).click();
  await expect.poll(() => audio.evaluate((element: HTMLAudioElement) => element.paused)).toBe(true);

  await player.locator(".nr-transcript > summary").click();
  const chosen = passage.verses[2];
  await player.getByRole("button", { name: `Ouvir ${passage.bookName} ${passage.chapter}:${chosen.number}`, exact: true }).click();
  await expect(player).toHaveAttribute("data-narrated-verse", String(chosen.number));
  await expect(player.locator(`[data-narrated-transcript-verse="${chosen.number}"]`)).toHaveAttribute("aria-current", "true");
  await expect(player.locator("[data-narrated-current-text]")).toHaveText(chosen.text);
  await expect(player.getByRole("link", { name: "Abrir o capítulo e conferir o contexto" })).toHaveAttribute("href", `/biblia?livro=${passage.bookId}&capitulo=${passage.chapter}&versiculo=${chosen.number}#versiculo-${chosen.number}`);
  await expect.poll(() => audio.evaluate((element: HTMLAudioElement) => !element.paused && element.currentTime > .1)).toBe(true);
  await player.getByRole("checkbox", { name: "Continuar pelos próximos versículos enquanto escuto", exact: true }).uncheck();
  await audio.evaluate((element: HTMLAudioElement) => { element.currentTime = Math.max(0, element.duration - .15); });
  await expect.poll(() => audio.evaluate((element: HTMLAudioElement) => element.ended && element.paused)).toBe(true);
  await expect(player).toHaveAttribute("data-narrated-verse", String(chosen.number));
  expect(mediaRequests.length).toBeGreaterThan(0);
  await noHorizontalOverflow(page);
});

test("a recordação escrita oferece conferência pessoal explícita sem enviar a resposta para avaliação", async ({ page }) => {
  const submissions: string[] = [];
  page.on("request", request => {
    if (["POST", "PUT", "PATCH"].includes(request.method()) && new URL(request.url()).pathname.startsWith("/api/")) submissions.push(request.url());
  });
  await openExperience(page, "contar");
  const practice = page.locator("[data-oral-practice]");
  const response = practice.getByRole("textbox", { name: "O que permaneceu com você?", exact: true });
  const review = practice.getByRole("button", { name: "Conferir minha recordação com a Palavra", exact: true });
  await expect(review).toBeDisabled();
  await response.fill("O samaritano se aproximou e cuidou do homem ferido. Quero ajudar meu próximo com uma atitude concreta.");
  await expect(practice).toContainText("Sua resposta fica somente nesta página");
  await review.click();
  const selfReview = practice.locator("[data-oral-review]");
  await expect(selfReview).toContainText("Essa conferência é feita por você; não é uma nota automática.");
  await expect(selfReview.getByRole("checkbox")).toHaveCount(3);
  for (const check of await selfReview.getByRole("checkbox").all()) await check.check();
  await expect(selfReview.getByRole("status")).toContainText("Você acompanhou os três pontos desta conferência");
  await selfReview.getByText("Abrir o texto para conferir", { exact: true }).click();
  await expect(selfReview.locator("details ol li").first()).toContainText(narratedPassages.find(item => item.id === "samaritano-lc10")!.verses[0].text);
  await practice.getByRole("button", { name: "Nas mãos de Jesus", exact: true }).click();
  await expect(response).toHaveValue("");
  await expect(selfReview).toHaveCount(0);
  await expect(review).toBeDisabled();
  expect(submissions).toEqual([]);
  await noHorizontalOverflow(page);
});

test("a referência conferida localiza João 3:16 no endpoint real e nunca inventa uma correspondência", async ({ page }) => {
  await openExperience(page, "camera");
  const camera = page.locator("[data-passage-camera]");
  await expect(camera).toHaveAttribute("data-ocr-ready", "true");
  const text = camera.getByRole("textbox", { name: "O que sua página nos mostrou?", exact: true });
  const find = camera.getByRole("button", { name: "Encontrar na Bíblia", exact: true });
  await expect(find).toBeDisabled();
  await text.fill("João 3:16");
  const located = page.waitForResponse(response => response.url().endsWith("/api/multimodal/locate") && response.request().method() === "POST");
  await find.click();
  const response = await located;
  expect(response.status()).toBe(200);
  expect(response.request().postDataJSON()).toEqual({ text: "João 3:16" });
  const body = await response.json();
  expect(body.candidates[0]).toMatchObject({ bookId: "JHN", chapter: 3, verse: 16 });
  const match = camera.locator('[data-ocr-passage="JHN.3.16"]');
  await expect(match.getByRole("heading")).toHaveText("João 3:16");
  await expect(match.locator("blockquote")).toContainText(body.candidates[0].verses[0].text);
  await expect(match.getByRole("link", { name: "Abrir e conferir o contexto" })).toHaveAttribute("href", "/biblia?livro=JHN&capitulo=3&versiculo=16#versiculo-16");
  await text.fill("qzxqzx qzxqzx qzxqzx");
  await find.click();
  await expect(camera.locator(".pc-matches")).toBeVisible();
  await expect(camera.locator("[data-ocr-passage]")).toHaveCount(0);
  await noHorizontalOverflow(page);
});

test("a visita guiada mantém cada ponto ligado à fotografia, à explicação editorial e às fontes corretas", async ({ page }) => {
  await openExperience(page, "museu");
  const museum = page.locator("[data-multimodal-museum]");
  for (const exhibit of museumExhibits) {
    await museum.getByRole("group", { name: "Escolher uma peça para explorar", exact: true }).getByRole("button", { name: exhibit.title, exact: true }).click();
    await expect(museum.locator("[data-museum-guide-exhibit]")).toHaveAttribute("data-museum-guide-exhibit", exhibit.id);
    const image = museum.locator(".mm-photo img");
    await image.scrollIntoViewIfNeeded();
    await expect(image).toHaveAttribute("src", exhibit.image.src);
    await expect.poll(() => image.evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth > 0)).toBe(true);
    for (const point of getMuseumObservations(exhibit.id)) {
      const hotspot = museum.locator(`[data-museum-hotspot="${point.id}"]`);
      await hotspot.click();
      await expect(hotspot).toHaveAttribute("aria-pressed", "true");
      const observation = museum.locator("[data-museum-observation]");
      await expect(observation).toHaveAttribute("data-museum-observation", point.id);
      await expect(observation.getByRole("heading", { level: 4 })).toHaveText(point.label);
      await expect(observation.locator(".mm-editorial-answer")).not.toBeVisible();
      await observation.locator("[data-museum-question]").click();
      await expect(observation.locator(".mm-editorial-answer p")).toHaveText(point.answer);
      await expect(observation.locator(".mm-editorial-answer")).toContainText("Comentário editorial da visita");
      const sources = observation.locator(".mm-point-sources");
      if (!await sources.evaluate(element => element.hasAttribute("open"))) await sources.locator("summary").click();
      expect(await sources.locator("a").evaluateAll(links => links.map(link => link.getAttribute("href"))))
        .toEqual(point.sourceIndexes.map(index => exhibit.sources[index].url));
    }
    await expect(museum.getByRole("link", { name: "Abrir a ficha completa da peça", exact: true })).toHaveAttribute("href", `/museu/${exhibit.id}`);
    await noHorizontalOverflow(page);
  }
});

test("os serviços visuais sem configuração respondem 503 de verdade e deixam a visita documentada disponível", async ({ page, request, baseURL }) => {
  const visionAvailability = await request.get("/api/multimodal/vision");
  const ocrAvailability = await request.get("/api/multimodal/ocr");
  const visionState = await visionAvailability.json();
  const ocrState = await ocrAvailability.json();
  test.skip(visionState.available || ocrState.available, "Este cenário verifica a instalação sem serviço remoto configurado.");
  expect(visionState.available).toBe(false);
  expect(ocrState.available).toBe(false);
  const headers = { Origin: new URL(baseURL!).origin };
  const vision = await request.post("/api/multimodal/vision", { headers, data: { exhibitId: museumExhibits[0].id, question: "O que esta imagem permite observar?" } });
  expect(vision.status()).toBe(503);
  const visionBody = await vision.json();
  expect(visionBody.answer).toBeUndefined();
  expect(visionBody.error).toContain("ainda não estão disponíveis");
  const ocr = await request.post("/api/multimodal/ocr", { headers, multipart: { image: { name: "pagina.png", mimeType: "image/png", buffer: Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/1ioAAAAASUVORK5CYII=", "base64") } } });
  expect(ocr.status()).toBe(503);
  expect((await ocr.json()).text).toBeUndefined();
  await openExperience(page, "museu");
  await page.locator(".mm-visual-questions > summary").click();
  await expect(page.locator(".mm-visual-question-body")).toContainText("A análise automática de imagem está desligada");
  await expect(page.getByRole("button", { name: "Analisar minha pergunta", exact: true })).toHaveCount(0);
  await expect(page.locator("[data-museum-hotspot]")).toHaveCount(3);
});

test("a cena Pixi abre por escolha, desenha e acompanha os passos, e remove o canvas ao trocar de experiência", async ({ page }) => {
  await openExperience(page, "historias");
  const world = page.locator("[data-story-world]");
  await expect(world).toHaveAttribute("data-story-hydrated", "true");
  await expect(world.locator("canvas")).toHaveCount(0);
  await world.getByRole("button", { name: "Entrar na história", exact: true }).click();
  await expect(world.locator(".sw-canvas-host")).toHaveAttribute("data-ready", "true", { timeout: 20000 });
  const canvas = world.locator("canvas[data-pixi-story-canvas]");
  await expect(canvas).toHaveCount(1);
  const size = await canvas.evaluate((element: HTMLCanvasElement) => ({ width: element.width, height: element.height }));
  expect(size.width).toBeGreaterThan(0);
  expect(size.height).toBeGreaterThan(0);
  const before = await canvas.screenshot({ caret: "initial" });
  expect(before.byteLength).toBeGreaterThan(5000);
  await world.getByRole("button", { name: "Ir para o próximo momento", exact: true }).click();
  await expect(world).toHaveAttribute("data-story-world-selected", "filipe");
  const after = await canvas.screenshot({ caret: "initial" });
  expect(after.equals(before)).toBe(false);
  const oldCanvas = await canvas.elementHandle();
  await page.getByRole("group", { name: "Escolher uma experiência de estudo", exact: true }).getByRole("button", { name: /Contar o que aprendi/ }).click();
  await expect(page.locator("[data-oral-practice]")).toBeVisible();
  await expect(page.locator("canvas[data-pixi-story-canvas]")).toHaveCount(0);
  expect(await oldCanvas!.evaluate(element => element.isConnected)).toBe(false);
  await page.getByRole("group", { name: "Escolher uma experiência de estudo", exact: true }).getByRole("button", { name: /Caminhar na história/ }).click();
  await expect(world).toHaveAttribute("data-story-hydrated", "true");
  await expect(world.locator("canvas")).toHaveCount(0);
  await world.getByRole("button", { name: "Entrar na história", exact: true }).click();
  await expect(world.locator(".sw-canvas-host")).toHaveAttribute("data-ready", "true");
  await expect(canvas).toHaveCount(1);
  await world.getByRole("button", { name: "Fechar cena", exact: true }).click();
  await expect(canvas).toHaveCount(0);
  await expect(world.getByRole("button", { name: "Entrar na história", exact: true })).toBeFocused();
  await noHorizontalOverflow(page);
});
