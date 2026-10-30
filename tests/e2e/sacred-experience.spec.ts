import { test, expect, type Locator, type Page } from "@playwright/test";
import corpus from "../../src/content/bible/blivre-tr-2018.json";
import historyPhotos from "../../src/content/church-history/photos.json";
import { curriculumStages } from "../../src/content/curriculum";
import { biblicalStories } from "../../src/content/stories";

function verseText(bookId: string, chapter: number, verse: number) {
  const text = corpus.books.find(book => book.id === bookId)?.chapters[chapter - 1]?.[verse - 1];
  if (!text) throw new Error(`Referência inexistente: ${bookId} ${chapter}:${verse}`);
  return text;
}

async function noOverflow(page: Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
}

async function memoryOnly(page: Page) {
  expect(await page.evaluate(() => ({ local: Object.keys(localStorage), session: Object.keys(sessionStorage) }))).toEqual({ local: [], session: [] });
}

async function imageLoaded(image: Locator) {
  await expect.poll(() => image.evaluate(element => {
    const picture = element as HTMLImageElement;
    return picture.complete && picture.naturalWidth > 0;
  })).toBe(true);
}

test("lugar de estudo explica seu propósito e oferece oração escolhida sem marcar uma aula concluída", async ({ page }) => {
  const errors: string[] = [];
  const writes: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("request", request => {
    if (["POST", "PUT", "PATCH", "DELETE"].includes(request.method()) && new URL(request.url()).pathname.startsWith("/api/")) writes.push(request.method());
  });
  await page.goto("/aprender");
  const sanctuary = page.locator("[data-learning-sanctuary]");
  await expect(sanctuary.getByRole("heading", { level: 1, name: "Prepare o coração. Abra a Palavra.", exact: true })).toBeVisible();
  await expect(sanctuary.locator("[data-sanctuary-lesson]")).toHaveCount(6);
  await expect(sanctuary.locator("[data-guided-lessons-completed]")).toHaveCount(0);
  await sanctuary.locator(".ls-orientation summary").click();
  await expect(sanctuary.locator(".ls-orientation details")).toContainText("Depois, o mapa bíblico começa em Gênesis");
  await expect(sanctuary.locator(".ls-orientation details a")).toHaveAttribute("href", /livro=ACT&capitulo=17&versiculo=11/);
  await sanctuary.locator('[data-sanctuary-lesson="orar-com-sentido"] > button').click();
  const selected = sanctuary.locator("[data-selected-lesson]");
  await expect(selected).toHaveAttribute("data-selected-lesson", "orar-com-sentido");
  await expect(selected.locator(".ls-outcomes li")).toHaveCount(3);
  await expect(selected.locator(".ls-selected-purpose")).toContainText("A oração é encontro com Deus");
  await expect(selected.getByRole("link", { name: "Abrir este encontro", exact: true })).toHaveAttribute("href", "/aprender/orar-com-sentido");

  const prayer = page.locator(".study-prayer-audio");
  const audio = prayer.getByLabel("Ouvir oração antes do estudo, voz sintética", { exact: true });
  await expect(audio).toHaveAttribute("preload", "none");
  await expect(audio).not.toHaveAttribute("autoplay");
  expect(await audio.evaluate(element => ({ paused: (element as HTMLAudioElement).paused, time: (element as HTMLAudioElement).currentTime }))).toEqual({ paused: true, time: 0 });
  await prayer.getByText("Ler a oração", { exact: true }).click();
  await expect(prayer.locator("details")).toContainText("Senhor");
  await expect(prayer).toContainText("voz sintética brasileira");
  await audio.focus();
  await audio.press("Space");
  await expect.poll(() => audio.evaluate(element => (element as HTMLAudioElement).currentTime)).toBeGreaterThan(.2);
  const duration = await audio.evaluate(element => (element as HTMLAudioElement).duration);
  expect(duration).toBeGreaterThan(18);
  expect(duration).toBeLessThan(22);
  await audio.press("Space");
  await expect.poll(() => audio.evaluate(element => (element as HTMLAudioElement).paused)).toBe(true);
  const preparation = sanctuary.locator(".ls-preparation-options > button");
  await preparation.last().click();
  await expect(sanctuary.locator(".ls-preparation-feedback")).toContainText("Não precisamos correr");
  await preparation.first().click();
  await expect(sanctuary.locator(".ls-preparation-feedback")).toContainText("É um bom começo");
  await expect(sanctuary.locator("[data-guided-lessons-completed]")).toHaveCount(0);
  expect(writes).toEqual([]);
  expect(errors).toEqual([]);
  await memoryOnly(page);
  await noOverflow(page);
});

test("preferências opcionais acompanham a jornada visual sem definir fé nem gravar um perfil", async ({ page, isMobile }) => {
  const writes: string[] = [];
  const hydrationErrors: string[] = [];
  page.on("console", message => {
    if (message.type() === "error" && /hydrat|server rendered|react\.dev\/errors\/(418|425)/i.test(message.text())) hydrationErrors.push(message.text());
  });
  page.on("pageerror", error => hydrationErrors.push(error.message));
  page.on("request", request => {
    if (["POST", "PUT", "PATCH", "DELETE"].includes(request.method()) && new URL(request.url()).pathname.startsWith("/api/")) writes.push(request.method());
  });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/comecar");
  const preferences = page.locator("details.onboarding-visual-preferences");
  await expect(preferences).not.toHaveAttribute("open", "");
  await preferences.locator("summary").click();
  await preferences.getByRole("radio", { name: "Já estudo e quero aprofundar", exact: true }).check();
  await preferences.getByRole("radio", { name: "Representação feminina", exact: true }).check();
  const navigation = page.getByRole("navigation", { name: isMobile ? "Navegação no celular" : "Navegação principal", exact: true });
  await navigation.getByRole("link", { name: "Aprender", exact: true }).click();
  await expect(page.locator("[data-study-recommendation]")).toHaveAttribute("data-study-recommendation", "experienced");
  await navigation.getByRole("link", { name: "Meu percurso", exact: true }).click();
  const world = page.locator("[data-faith-world]");
  await expect(world).toHaveAttribute("data-faith-world-appearance", "feminine");
  await expect(world).toHaveAttribute("data-faith-world-company", "alone");
  await expect(world.locator("[data-faith-land]")).toHaveCount(6);
  await expect(world.locator(".fw-world-stop")).toHaveCount(24);
  await expect(world.locator("[data-world-avatar]")).toHaveAttribute("data-avatar-practices", "0");
  const customize = world.locator("details.fw-customize").first();
  await customize.locator("summary").click();
  await customize.getByRole("radio", { name: "Com minha família", exact: true }).check();
  await expect(world).toHaveAttribute("data-faith-world-company", "family");
  await expect(customize).toContainText("O amor a Deus não é uma sequência obrigatória de estados de vida");
  await world.getByRole("button", { name: "Caminhar para a próxima etapa", exact: true }).click();
  await expect(world).toHaveAttribute("data-faith-world-selected", curriculumStages[1].id);
  await world.getByRole("button", { name: "Ver todo o caminho", exact: true }).click();
  await expect(world).toHaveAttribute("data-faith-world-mode", "overview");
  await world.locator(".fw-world-stop").nth(8).focus();
  await world.locator(".fw-world-stop").nth(8).press("Enter");
  await expect(world).toHaveAttribute("data-faith-world-selected", curriculumStages[8].id);
  const viewport = world.getByLabel("Caminho ilustrado: use as setas para escolher uma etapa", { exact: true });
  await viewport.focus();
  await viewport.press("End");
  await expect(world).toHaveAttribute("data-faith-world-selected", curriculumStages[23].id);
  await viewport.press("Home");
  await expect(world).toHaveAttribute("data-faith-world-selected", curriculumStages[0].id);
  const bounds = await world.locator("svg.fw-world-art").boundingBox();
  expect(bounds!.width).toBeGreaterThan(200);
  expect(bounds!.height).toBeGreaterThan(250);
  await expect(page.locator('[data-journey-session-summary] strong')).toHaveText("0");
  await customize.getByRole("radio", { name: "Caminhada pessoal", exact: true }).check();
  await expect(world).toHaveAttribute("data-faith-world-company", "alone");
  expect(writes).toEqual([]);
  await memoryOnly(page);
  await noOverflow(page);
  await page.reload();
  await expect(world).toHaveAttribute("data-faith-world-appearance", "neutral");
  await expect(world).toHaveAttribute("data-faith-world-company", "alone");
  await expect(world.locator("[data-world-avatar]")).toHaveAttribute("data-avatar-practices", "0");
  expect(hydrationErrors).toEqual([]);
});

test("modo igreja troca a referência dentro do livro e preserva tema, fonte e texto completo", async ({ page, browser, baseURL, isMobile }) => {
  test.setTimeout(60000);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/biblia?modo=igreja&livro=MAT&capitulo=3&versiculo=13&fonte=36&tema=sepia");
  await expect(page.locator(".app-shell")).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Mateus 3", exact: true })).toBeVisible();
  await expect(page.locator(".br-verses > li")).toHaveCount(17);
  const trigger = page.getByRole("button", { name: "Abrir minha Bíblia", exact: true });
  await trigger.click();
  const book = page.getByRole("dialog", { name: "Sua Bíblia aberta", exact: true });
  await expect(book.locator("[data-book-ready]")).toHaveAttribute("data-book-ready", "true", { timeout: 15000 });
  await expect(book.locator("[data-reading-size]")).toHaveAttribute("data-reading-size", "36");
  await book.getByRole("button", { name: "Aumentar letra do livro", exact: true }).click();
  await expect(book.locator("[data-reading-size]")).toHaveAttribute("data-reading-size", "38");
  await book.getByRole("button", { name: "Tema noturno", exact: true }).click();
  await expect(book).toHaveAttribute("data-bible-theme", "noturno");
  await book.getByRole("button", { name: "Escolher livro, capítulo e versículo", exact: true }).click();
  const passage = page.getByRole("dialog", { name: "Encontre sua passagem.", exact: true });
  await passage.getByRole("searchbox", { name: "Procurar um livro", exact: true }).fill("Salmos");
  await expect(passage.locator(".br-passage-books > button")).toHaveCount(1);
  await passage.locator(".br-passage-books > button").click();
  await passage.getByRole("button", { name: "Salmos, capítulo 23", exact: true }).click();
  await passage.getByRole("link", { name: "Abrir Salmos 23:1", exact: true }).click();
  await expect(page).toHaveURL(url => url.searchParams.get("livro") === "PSA" && url.searchParams.get("capitulo") === "23" && url.searchParams.get("versiculo") === "1" && url.searchParams.get("modo") === "igreja" && url.searchParams.get("fonte") === "38" && url.searchParams.get("tema") === "noturno" && url.searchParams.get("livroaberto") === "1");
  await expect(book).toBeVisible();
  await expect(book.locator("[data-book-ready]")).toHaveAttribute("data-book-ready", "true", { timeout: 15000 });
  await expect(book.locator("[data-reading-size]")).toHaveAttribute("data-reading-size", "38");
  await expect(book.locator("[data-verse-count]")).toHaveAttribute("data-verse-count", "6");
  await expect(book).toHaveAttribute("data-bible-theme", "noturno");
  await page.keyboard.press("Escape");
  await expect(book).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await expect(page.locator(".br-verses > li")).toHaveCount(6);
  for (let verse = 1; verse <= 6; verse++) await expect(page.locator(`#versiculo-${verse} > span`)).toHaveText(verseText("PSA", 23, verse));
  await noOverflow(page);

  const context = await browser.newContext({ baseURL, javaScriptEnabled: false, serviceWorkers: "block", viewport: page.viewportSize()!, isMobile, hasTouch: isMobile });
  try {
    const plain = await context.newPage();
    await plain.goto("/biblia?modo=igreja&fonte=36&tema=sepia");
    const form = plain.locator("form.br-nojs-form");
    await form.getByRole("combobox", { name: "Livro", exact: true }).selectOption("ACT");
    await form.getByLabel("Capítulo", { exact: true }).fill("17");
    await form.getByLabel("Versículo", { exact: true }).fill("11");
    await form.getByRole("button", { name: "Abrir passagem", exact: true }).click();
    await expect(plain).toHaveURL(url => url.searchParams.get("modo") === "igreja" && url.searchParams.get("tema") === "sepia" && url.searchParams.get("fonte") === "36" && url.searchParams.get("livro") === "ACT" && url.searchParams.get("capitulo") === "17" && url.searchParams.get("versiculo") === "11");
    await expect(plain.locator(".br-verses > li")).toHaveCount(34);
    await expect(plain.locator("#versiculo-11 > span")).toHaveText(verseText("ACT", 17, 11));
    await expect(plain.locator(".app-shell")).toHaveCount(0);
    await noOverflow(plain);
  } finally { await context.close(); }
});

test("histórias dos sinais de Jesus abrem a arte original com foco e retornam à passagem", async ({ page }) => {
  const ids = ["multiplicacao-dos-paes", "jesus-acalma-a-tempestade", "lazaro"];
  for (const id of ids) {
    const story = biblicalStories.find(item => item.id === id)!;
    expect(story.scenes).toHaveLength(4);
    expect((await page.goto(`/historias/${id}`))?.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(story.title);
    await expect(page.locator("[data-story-scene]")).toHaveCount(4);
    const artwork = page.locator("figure.story-original-art > a");
    await expect(artwork).toHaveAttribute("href", story.image!);
    const image = artwork.getByRole("img");
    await image.scrollIntoViewIfNeeded();
    await imageLoaded(image);
    expect(new URL((await image.getAttribute("src"))!, "https://example.test").searchParams.get("q")).toBe("100");
    await artwork.focus();
    await artwork.press("Enter");
    const viewer = page.locator(".pswp.pswp--open");
    await expect(viewer).toBeVisible();
    const original = viewer.locator("img.pswp__img").last();
    await imageLoaded(original);
    expect(await original.evaluate(element => new URL((element as HTMLImageElement).currentSrc).pathname)).toBe(story.image);
    expect(await original.evaluate(element => (element as HTMLImageElement).naturalWidth)).toBe(Number(await artwork.getAttribute("data-pswp-width")));
    await page.keyboard.press("Escape");
    await expect(viewer).not.toBeVisible();
    await expect(artwork).toBeFocused();
    const reference = story.scenes[0].reference;
    const firstPassage = page.locator('[data-story-scene="0"] a[href^="/biblia?"]');
    await expect(firstPassage).toHaveAttribute("href", new RegExp(`livro=${reference.book}&capitulo=${reference.chapter}`));
    await noOverflow(page);
  }
});

test("fotografia histórica preserva autoria, licença, arquivo original e ampliação acessível", async ({ page, request }) => {
  const photo = historyPhotos.find(item => item.id === "padre-zezinho-2012")!;
  expect(photo.kind).toBe("photograph");
  await page.goto("/igrejas/padre-zezinho");
  const figure = page.locator(`[data-history-photo="${photo.id}"]`);
  await expect(figure).toBeVisible();
  await imageLoaded(figure.getByRole("img"));
  await expect(figure.locator(".hp-credit")).toContainText(photo.creator);
  await expect(figure.locator(".hp-credit a")).toHaveAttribute("href", photo.licenseUrl);
  const provenance = figure.locator("details.hp-provenance");
  await provenance.locator("summary").click();
  await expect(provenance).toContainText(photo.rightsEvidence);
  await expect(provenance.locator(`a[href="${photo.sourceUrl}"]`)).toBeVisible();
  await expect(provenance.locator(`a[href="${photo.src}"]`)).toBeVisible();
  const response = await request.get(photo.src);
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toMatch(/^image\//);
  const trigger = figure.getByRole("link", { name: `Ampliar imagem: ${photo.title}`, exact: true });
  await trigger.focus();
  await trigger.press("Enter");
  const viewer = page.locator(".pswp.pswp--open");
  await expect(viewer).toBeVisible();
  const original = viewer.locator("img.pswp__img").last();
  await imageLoaded(original);
  expect(await original.evaluate(element => (element as HTMLImageElement).naturalWidth)).toBe(photo.width);
  await page.keyboard.press("Escape");
  await expect(viewer).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await noOverflow(page);
});
