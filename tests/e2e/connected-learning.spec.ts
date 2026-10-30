import { test, expect, type Locator, type Page } from "@playwright/test";
import corpus from "../../src/content/bible/blivre-tr-2018.json";
import { biblicalStories } from "../../src/content/stories";
import { curriculumStages } from "../../src/content/curriculum";
import { churches, people, relationships, historySources } from "../../src/content/church-history";

type Verse = { number: number; text: string };

function scripture(bookId: string, chapter: number, verse: number): string {
  const text = corpus.books.find((book) => book.id === bookId)?.chapters[chapter - 1]?.[verse - 1];
  if (!text) throw new Error(`Referência bíblica inexistente: ${bookId} ${chapter}:${verse}`);
  return text;
}

function validReference(href: string) {
  const url = new URL(href, "https://example.test");
  const bookId = url.searchParams.get("livro") ?? "";
  const chapter = Number(url.searchParams.get("capitulo"));
  const verse = Number(url.searchParams.get("versiculo") ?? "1");
  return { bookId, chapter, verse, text: scripture(bookId, chapter, verse) };
}

async function noHorizontalOverflow(page: Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
}

async function exactPhysicalChapter(host: Locator, expected: Verse[]) {
  const actual = await host.evaluate((element) => {
    const leaves = new Map<number, { number: number; text: string }[]>();
    for (const leaf of element.querySelectorAll<HTMLElement>("[data-book-page]")) {
      const fragments = [...leaf.querySelectorAll<HTMLElement>("[data-verse]")].map((part) => ({
        number: Number(part.dataset.verse), text: part.querySelector("[data-verse-text]")?.textContent ?? ""
      }));
      const page = Number(leaf.dataset.bookPage);
      const existing = leaves.get(page);
      if (existing && JSON.stringify(existing) !== JSON.stringify(fragments)) throw new Error("Folhas duplicadas contêm textos diferentes.");
      leaves.set(page, fragments);
    }
    const verses = new Map<number, string>();
    for (const [, fragments] of [...leaves].sort(([a], [b]) => a - b)) {
      for (const fragment of fragments) verses.set(fragment.number, (verses.get(fragment.number) ?? "") + fragment.text);
    }
    return [...verses].map(([number, text]) => ({ number, text }));
  });
  expect(actual).toEqual(expected);
  const clipped = await host.locator(".sb-paper-text").evaluateAll((elements) => elements
    .filter((element) => element.clientWidth > 0 && element.clientHeight > 0)
    .filter((element) => element.scrollWidth > element.clientWidth + 2 || element.scrollHeight > element.clientHeight + 2)
    .map((element) => ({ width: element.clientWidth, scrollWidth: element.scrollWidth, height: element.clientHeight, scrollHeight: element.scrollHeight })));
  expect(clipped).toEqual([]);
}

test("livro em tela estreita repagina letra maior sem perder uma palavra do Salmo 119", async ({ page }) => {
  test.setTimeout(60000);
  await page.setViewportSize({ width: 320, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/biblia?livro=PSA&capitulo=119&versiculo=176");
  const chapter = corpus.books.find((book) => book.id === "PSA")!.chapters[118];
  const expected = chapter.map((text, index) => ({ number: index + 1, text }));
  expect(expected).toHaveLength(176);
  const trigger = page.getByRole("button", { name: "Abrir minha Bíblia", exact: true });
  await trigger.click();
  const dialog = page.getByRole("dialog", { name: "Sua Bíblia aberta", exact: true });
  const book = dialog.locator(".scripture-book");
  const host = dialog.locator("[data-book-ready]");
  await expect(host).toHaveAttribute("data-book-ready", "true", { timeout: 15000 });
  const before = Number(await book.getAttribute("data-reading-size"));
  expect(before).toBeGreaterThanOrEqual(24);
  await exactPhysicalChapter(host, expected);
  await dialog.getByRole("button", { name: "Aumentar letra do livro", exact: true }).click();
  await expect(book).toHaveAttribute("data-reading-size", String(before + 2));
  await expect(host).toHaveAttribute("data-book-ready", "true", { timeout: 15000 });
  await expect(host).toHaveAttribute("data-book-state", "read");
  await exactPhysicalChapter(host, expected);
  const visibleVerse = host.locator('[data-book-page][aria-hidden="false"] [data-verse-text]').first();
  expect(await visibleVerse.evaluate((element) => parseFloat(getComputedStyle(element).fontSize))).toBeGreaterThanOrEqual(before + 2);
  const current = await host.getAttribute("data-current-page");
  await dialog.getByRole("button", { name: "Virar página para trás", exact: true }).click();
  await expect(host).not.toHaveAttribute("data-current-page", current!);
  await expect(host).toHaveAttribute("data-book-state", "read");
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await noHorizontalOverflow(page);
  expect(errors).toEqual([]);
});

test("versículo diário mantém o texto da edição e renova uma página aberta na mudança de dia", async ({ page, request }) => {
  const response = await request.get("/api/daily-verse");
  expect(response.status()).toBe(200);
  expect(response.headers()["cache-control"]).toContain("no-store");
  const daily = await response.json();
  const reference = validReference(daily.href);
  expect(daily.text).toBe(reference.text);
  expect(daily.timeZone).toBe("America/Sao_Paulo");
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Sao_Paulo", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
  expect(daily.date).toBe(today);
  expect(daily.context.length).toBeGreaterThan(60);

  // Only the browser clock changes. The mocked next-day response tests the real
  // refresh mechanism without changing the production server's clock or corpus.
  await page.clock.install({ time: new Date() });
  await page.goto("/");
  const card = page.locator(".daily-verse");
  await expect(card).toHaveAttribute("data-daily-date", daily.date);
  await expect(card.locator("blockquote")).toHaveText(daily.text);
  await expect(card.getByRole("link", { name: "Ler no contexto", exact: true })).toHaveAttribute("href", daily.href);
  const nextDay = new Date(Date.parse(`${daily.date}T03:00:00Z`) + 86_400_000 + 1000);
  const nextDate = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Sao_Paulo", year: "numeric", month: "2-digit", day: "2-digit" }).format(nextDay);
  const next = { ...daily, date: nextDate, text: scripture("GEN", 1, 1), reference: "Gênesis 1:1", href: "/biblia?livro=GEN&capitulo=1&versiculo=1#versiculo-1" };
  let refreshes = 0;
  await page.route("**/api/daily-verse", async (route) => {
    refreshes++;
    await route.fulfill({ json: next, headers: { "Cache-Control": "no-store" } });
  });
  await page.clock.setSystemTime(nextDay);
  await page.clock.fastForward(15_001);
  await expect(card).toHaveAttribute("data-daily-date", nextDate);
  await expect(card.locator("blockquote")).toHaveText(next.text);
  expect(refreshes).toBe(1);
  await noHorizontalOverflow(page);
});

test("buscar batismo separa a seleção temática do texto bíblico e abre a passagem completa", async ({ page }) => {
  const errors: string[] = [];
  const writes: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("request", (request) => { if (["POST", "PUT", "PATCH", "DELETE"].includes(request.method())) writes.push(request.method()); });
  await page.goto("/biblia");
  const form = page.getByRole("search", { name: "Buscar palavras ou temas na Bíblia", exact: true });
  await form.getByRole("searchbox", { name: "Palavra, expressão ou tema", exact: true }).fill("batismo");
  await form.getByRole("button", { name: "Buscar na Bíblia", exact: true }).click();
  await expect(page).toHaveURL(/busca=batismo/);
  const topic = page.locator('[data-search-topic="batismo"]');
  await expect(topic).toBeVisible();
  await expect(page.locator("[data-search-topics]")).toContainText("Seleção editorial por assunto");
  await expect(page.locator("[data-search-literal]")).toContainText("Palavras encontradas no texto");
  const readings = topic.locator("details.bsearch-reading");
  expect(await readings.count()).toBeGreaterThanOrEqual(4);
  await readings.first().locator("summary").click();
  const bibleLink = readings.first().getByRole("link", { name: /Abrir o capítulo e ler o contexto/ });
  const reference = validReference((await bibleLink.getAttribute("href"))!);
  expect(reference).toMatchObject({ bookId: "MAT", chapter: 3, verse: 13 });
  const quoted = await readings.first().locator("blockquote p").evaluateAll((paragraphs) => paragraphs.map((paragraph) => ({
    number: Number(paragraph.querySelector("sup")?.textContent),
    text: [...paragraph.childNodes].filter((node) => node.nodeName !== "SUP").map((node) => node.textContent).join("").trim()
  })));
  expect(quoted).toEqual([13, 14, 15, 16, 17].map((number) => ({ number, text: scripture("MAT", 3, number) })));
  for (const item of await page.locator("[data-search-verse]").all()) {
    const [book, chapter, verse] = (await item.getAttribute("data-search-verse"))!.split(".");
    const text = scripture(book, Number(chapter), Number(verse));
    await expect(item.locator(".bsearch-verse-text")).toHaveText(text);
    expect(text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()).toMatch(/\bbatismo\b/);
  }
  await bibleLink.click();
  await expect(page.locator("#versiculo-13")).toHaveClass("br-verse-highlighted");
  await expect(page.locator("#versiculo-13 > span")).toHaveText(scripture("MAT", 3, 13));
  await expect(page.locator(".br-verses > li")).toHaveCount(17);
  expect(writes).toEqual([]);
  expect(errors).toEqual([]);
  await noHorizontalOverflow(page);
});

test("busca livre aceita acentos, expressão exata e páginas de resultados reais", async ({ page }) => {
  const resultIds = () => page.locator("[data-search-verse]").evaluateAll((elements) => elements.map((element) => element.getAttribute("data-search-verse")));
  await page.goto("/biblia?busca=compaix%C3%A3o");
  const accented = await resultIds();
  expect(accented.length).toBeGreaterThan(0);
  const total = await page.locator("[data-search-literal]").getAttribute("data-search-total");
  await page.goto("/biblia?busca=COMPAIXAO");
  expect(await resultIds()).toEqual(accented);
  await expect(page.locator("[data-search-literal]")).toHaveAttribute("data-search-total", total!);
  await page.goto('/biblia?busca=%22Jesus%20chorou%22');
  await expect(page.locator('[data-search-verse="JHN.11.35"] .bsearch-verse-text')).toHaveText(scripture("JHN", 11, 35));

  await page.goto("/biblia?busca=amor");
  const first = await resultIds();
  expect(first).toHaveLength(20);
  const navigation = page.getByRole("navigation", { name: "Páginas de resultados bíblicos", exact: true });
  await navigation.getByRole("link", { name: "Próximos resultados", exact: true }).click();
  await expect(page).toHaveURL(/busca=amor&pagina=2/);
  const second = await resultIds();
  expect(second).toHaveLength(20);
  expect(second.some((id) => first.includes(id))).toBe(false);
  for (const item of await page.locator("[data-search-verse]").all()) {
    const reference = validReference((await item.getByRole("link").getAttribute("href"))!);
    await expect(item.locator(".bsearch-verse-text")).toHaveText(reference.text);
    expect(reference.text.toLowerCase()).toMatch(/\bamor\b/);
  }
  await page.goto("/biblia?busca=palavrainexistente927401");
  await expect(page.locator("[data-search-literal]")).toHaveAttribute("data-search-total", "0");
  await expect(page.locator(".bsearch-empty")).toBeVisible();
  expect(await page.evaluate(() => ({ local: Object.keys(localStorage), session: Object.keys(sessionStorage) }))).toEqual({ local: [], session: [] });
  await noHorizontalOverflow(page);
});

test("histórias conectam cenas, contexto e reflexão à passagem bíblica sem reproduzir automaticamente", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/historias");
  const cards = page.locator("a.story-card");
  await expect(cards).toHaveCount(15);
  expect(new Set(await cards.evaluateAll((links) => links.map((link) => link.getAttribute("href")))).size).toBe(15);
  for (const story of biblicalStories) {
    expect(story.scenes).toHaveLength(4);
    for (const scene of story.scenes) scripture(scene.reference.book, scene.reference.chapter, scene.reference.verse ?? 1);
  }
  await page.locator('a.story-card[href="/historias/exodo"]').click();
  const scenes = page.getByRole("region", { name: "Quatro cenas para acompanhar a passagem", exact: true });
  await expect(scenes.locator("article[data-story-scene]")).toHaveCount(4);
  await expect(scenes).toHaveAttribute("data-story-position", "0");
  await scenes.getByRole("button", { name: "Próxima cena", exact: true }).click();
  await expect(scenes).toHaveAttribute("data-story-position", "1");
  const viewport = scenes.locator(".story-scenes-viewport");
  await viewport.focus();
  await viewport.press("ArrowRight");
  await expect(scenes).toHaveAttribute("data-story-position", "2");
  const lastPassage = scenes.locator('[data-story-scene="3"] a[href^="/biblia?"]');
  await lastPassage.focus();
  await expect(scenes).toHaveAttribute("data-story-position", "3");
  await expect(lastPassage).toBeInViewport({ ratio: .9 });
  for (const link of await scenes.locator('a[href^="/biblia?"]').all()) validReference((await link.getAttribute("href"))!);
  const reflection = page.locator(".story-reflection");
  const options = reflection.locator(".story-reflection-options > button");
  await options.first().click();
  await expect(options.first()).toHaveAttribute("aria-pressed", "true");
  const firstExplanation = await reflection.getByRole("status").innerText();
  expect(firstExplanation.length).toBeGreaterThan(60);
  await options.last().click();
  await expect(reflection.getByRole("status")).not.toHaveText(firstExplanation);
  await page.locator(".story-neighbor-nav > a").last().click();
  await expect(page).toHaveURL(/\/historias\/rute$/);
  await expect(page.locator("[data-story-position]")).toHaveAttribute("data-story-position", "0");
  await expect(page.locator(".story-reflection-feedback")).toBeEmpty();
  await expect(page.locator("audio[autoplay], video[autoplay]")).toHaveCount(0);
  expect(await page.evaluate(() => ({ local: Object.keys(localStorage), session: Object.keys(sessionStorage) }))).toEqual({ local: [], session: [] });
  await noHorizontalOverflow(page);
  expect(errors).toEqual([]);
});

test("percurso público conecta 24 etapas aos 66 livros e oferece explicação ao rever uma resposta", async ({ page }) => {
  const writes: string[] = [];
  page.on("request", (request) => { if (["POST", "PUT", "PATCH", "DELETE"].includes(request.method())) writes.push(request.method()); });
  await page.goto("/meu-percurso");
  await expect(page).toHaveURL(/\/meu-percurso$/);
  const map = page.locator("[data-journey-map]");
  await expect(map.locator("ol.jm-stages > li")).toHaveCount(24);
  const stages = map.locator("a.jm-stage-link");
  await expect(map.locator("[data-journey-session-summary] strong")).toHaveText("0");
  await expect(map.locator('.jm-stage-link[data-practiced="true"]')).toHaveCount(0);
  const destinations = await stages.evaluateAll((links) => links.map((link) => link.getAttribute("href")));
  expect(new Set(destinations).size).toBe(24);
  await map.locator("details.jm-library > summary").click();
  const books = map.locator("[data-book-index] a[data-book-id]");
  await expect(books).toHaveCount(66);
  const ids = await books.evaluateAll((links) => links.map((link) => link.getAttribute("data-book-id")));
  expect([...ids].sort()).toEqual(corpus.books.map((book) => book.id).sort());
  for (const stage of curriculumStages) for (const passage of stage.passages) scripture(passage.book, passage.chapter, passage.verse);
  await noHorizontalOverflow(page);
  await stages.first().click();
  const stage = curriculumStages[0];
  await expect(page.locator("[data-curriculum-stage]")).toHaveAttribute("data-stage-id", stage.id);
  await expect(page.locator(".cr-teaching > article")).toHaveCount(3);
  for (const passage of await page.locator(".cr-scripture-grid > article").all()) {
    const reference = validReference((await passage.getByRole("link").getAttribute("href"))!);
    const text = await passage.locator("blockquote").evaluate((element) => [...element.childNodes].filter((node) => node.nodeName !== "SUP").map((node) => node.textContent).join("").trim());
    expect(text).toBe(reference.text);
  }
  const practice = page.locator(".cr-check");
  const submit = practice.getByRole("button", { name: /Conferir minha compreensão/ });
  await expect(submit).toBeDisabled();
  const wrong = stage.question.options.find((option) => !option.correct)!;
  const correct = stage.question.options.find((option) => option.correct)!;
  await practice.getByRole("radio", { name: wrong.text, exact: true }).check();
  await submit.click();
  await expect(practice.locator("[data-curriculum-feedback]")).toContainText(wrong.feedback);
  await expect(practice.getByRole("link", { name: "Voltar às passagens e conferir", exact: true })).toHaveAttribute("href", "#cr-passages");
  await page.locator(".cr-back").click();
  const firstStage = page.locator(`.jm-stage-link[href="/percurso/${stage.id}"]`);
  await expect(firstStage).toHaveAttribute("data-practiced", "false");
  await expect(page.locator("[data-journey-session-summary] strong")).toHaveText("0");
  await firstStage.click();
  await practice.getByRole("radio", { name: correct.text, exact: true }).check();
  await expect(practice.locator("[data-curriculum-feedback]")).toHaveCount(0);
  await submit.click();
  await expect(practice.locator("[data-curriculum-feedback]")).toContainText(correct.feedback);
  await practice.getByRole("link", { name: "Ver meu marco no mapa", exact: true }).click();
  await expect(firstStage).toHaveAttribute("data-practiced", "true");
  await expect(page.locator("[data-journey-session-summary] strong")).toHaveText("1");
  await page.reload();
  await expect(firstStage).toHaveAttribute("data-practiced", "false");
  await expect(page.locator("[data-journey-session-summary] strong")).toHaveText("0");
  await firstStage.click();
  await expect(page.locator("[data-curriculum-feedback]")).toHaveCount(0);
  await page.locator(".cr-next-link").click();
  await expect(page.locator("[data-curriculum-stage]")).toHaveAttribute("data-stage-id", curriculumStages[1].id);
  await expect(page.locator("[data-curriculum-feedback]")).toHaveCount(0);
  await expect(page.locator(".cr-check").getByRole("button", { name: /Conferir minha compreensão/ })).toBeDisabled();
  expect(writes).toEqual([]);
  expect(await page.evaluate(() => ({ local: Object.keys(localStorage), session: Object.keys(sessionStorage) }))).toEqual({ local: [], session: [] });
  await noHorizontalOverflow(page);
});

test("rede histórica distingue música de fundação e leva da pessoa às fontes documentadas", async ({ page, isMobile }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const nodes = new Set([...churches, ...people].map((node) => node.id));
  const sources = new Set(historySources.map((source) => source.id));
  expect(nodes.size).toBe(churches.length + people.length);
  for (const relation of relationships) {
    expect(nodes.has(relation.from) && nodes.has(relation.to)).toBe(true);
    expect(relation.sourceIds.length).toBeGreaterThan(0);
    for (const source of relation.sourceIds) expect(sources.has(source)).toBe(true);
  }
  await page.goto("/igrejas");
  const network = page.getByRole("region", { name: "Rede de conexões históricas", exact: true });
  if (!isMobile) {
    const canvas = await network.locator(".history-network-board").evaluate((element) => ({
      width: element.clientWidth,
      lines: element.querySelector("svg.history-network-lines")?.getBoundingClientRect().width ?? 0
    }));
    // A global icon rule previously shrank the actual relationship canvas to
    // 24px. The branches must occupy the board, not just exist in its DOM.
    expect(canvas.width).toBeGreaterThan(300);
    expect(Math.abs(canvas.width - canvas.lines)).toBeLessThanOrEqual(2);
  }
  expect(await network.locator("button[data-church-id]").count()).toBeGreaterThanOrEqual(10);
  await network.getByRole("searchbox", { name: "Pesquisar igrejas e personalidades", exact: true }).fill("Frida");
  await expect(network.locator("button[data-church-id]")).toHaveCount(1);
  const assemblies = network.locator('button[data-church-id="assembleias"]');
  await assemblies.click();
  await expect(assemblies).toHaveAttribute("aria-pressed", "true");
  await network.getByRole("combobox", { name: "Tipo de conexão", exact: true }).selectOption("musica");
  const frida = network.locator('button[data-person-id="frida-vingren"]');
  await expect(frida).toHaveAttribute("data-relationship-kind", "musica");
  await expect(network.locator('button[data-person-id="daniel-berg"]')).toHaveCount(0);
  await expect(network.locator('[data-history-edge="assembleias:frida-vingren"]')).toHaveAttribute("data-kind", "musica");
  await frida.focus();
  await frida.press("Enter");
  await expect(frida).toHaveAttribute("aria-pressed", "true");
  const detail = page.locator("#history-connection-detail");
  await expect(detail.getByRole("heading", { name: "Frida Vingren", exact: true })).toBeVisible();
  await expect(detail).toContainText("1917");
  await expect(detail.locator(".history-connection-proof")).toContainText("Por que estes dois pontos estão ligados?");
  await detail.getByRole("link", { name: /Abrir biografia e fontes/ }).click();
  await expect(page).toHaveURL(/\/igrejas\/frida-vingren$/);
  const sourceNotes = page.locator("details.history-sources");
  await sourceNotes.locator("summary").click();
  expect(await sourceNotes.getByRole("link").count()).toBeGreaterThan(0);
  for (const link of await sourceNotes.getByRole("link").all()) await expect(link).toHaveAttribute("href", /^https:\/\//);
  await noHorizontalOverflow(page);
  expect(errors).toEqual([]);
});

test("biblioteca dá acesso aos 66 guias e liga poesia, profecia e carta às passagens originais", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto("/biblioteca");
  const library = page.getByRole("region", { name: "Guias dos livros bíblicos", exact: true });
  const books = library.locator("[data-book-guide]");
  await expect(books).toHaveCount(66);
  const ids = await books.evaluateAll(elements => elements.map(element => element.getAttribute("data-book-guide")));
  expect([...ids].sort()).toEqual(corpus.books.map(book => book.id).sort());
  for (const book of await books.all()) {
    await expect(book.getByRole("link")).toHaveAttribute("href", `/biblioteca/${await book.getAttribute("data-book-guide")}`);
  }
  await library.getByRole("combobox", { name: "Filtrar testamento", exact: true }).selectOption("Novo Testamento");
  await expect(books).toHaveCount(27);
  await library.getByRole("searchbox", { name: "Procurar um livro ou tema nesta biblioteca", exact: true }).fill("filemom");
  await expect(books).toHaveCount(1);
  await expect(books.first()).toHaveAttribute("data-book-guide", "PHM");
  await noHorizontalOverflow(page);

  const stageLinks = new Set(curriculumStages.map(stage => `/percurso/${stage.id}`));
  for (const bookId of ["PSA", "OBA", "PHM"]) {
    expect((await page.goto(`/biblioteca/${bookId}`))?.status()).toBe(200);
    const guide = page.locator(`[data-book-guide-detail="${bookId}"]`);
    await expect(guide.locator(".bgr-overview > p:not(.bgl-eyebrow)")).toHaveCount(2);
    const connection = guide.locator('.bgr-connection a[href^="/percurso/"]');
    expect(stageLinks.has((await connection.getAttribute("href"))!)).toBe(true);
    await expect(guide.locator(".bgr-readings > article")).toHaveCount(2);
    for (const reading of await guide.locator(".bgr-readings > article").all()) {
      const link = reading.getByRole("link", { name: /Abrir o capítulo e conferir o contexto/ });
      const reference = validReference((await link.getAttribute("href"))!);
      expect(reference.bookId).toBe(bookId);
      const firstVerse = await reading.locator("blockquote").evaluate(element => [...element.childNodes].filter(node => node.nodeName !== "SUP").map(node => node.textContent).join("").trim());
      expect(firstVerse).toBe(reference.text);
      await reading.locator("details > summary").click();
      for (const verse of await reading.locator("[data-guide-verse]").all()) {
        const [id, chapter, number] = (await verse.getAttribute("data-guide-verse"))!.split(".");
        await expect(verse).toHaveText(scripture(id, Number(chapter), Number(number)));
      }
    }
    const reflection = guide.locator(".bgr-question details");
    await reflection.getByText("Conferir uma explicação", { exact: true }).click();
    await expect(reflection.locator("p")).not.toBeEmpty();
    await noHorizontalOverflow(page);
  }
  expect(errors).toEqual([]);
});

test("mapa, busca, histórias e fichas continuam disponíveis sem JavaScript", async ({ browser, baseURL, page, isMobile }) => {
  const context = await browser.newContext({ baseURL, javaScriptEnabled: false, serviceWorkers: "block", viewport: page.viewportSize()!, isMobile, hasTouch: isMobile });
  try {
    const plain = await context.newPage();
    expect((await plain.goto("/meu-percurso"))?.status()).toBe(200);
    await expect(plain.locator(".jm-stage-link")).toHaveCount(24);
    await plain.locator("details.jm-library > summary").click();
    await expect(plain.locator("[data-book-index] a[data-book-id]")).toHaveCount(66);
    await noHorizontalOverflow(plain);

    await plain.goto("/biblioteca");
    await expect(plain.locator("[data-book-guide] a")).toHaveCount(66);
    await plain.locator('[data-book-guide="OBA"] a').click();
    await expect(plain.locator('[data-book-guide-detail="OBA"]')).toBeVisible();
    const answer = plain.locator(".bgr-question details");
    await answer.locator("summary").click();
    await expect(answer.locator("p")).toBeVisible();
    await noHorizontalOverflow(plain);

    await plain.goto("/biblia?busca=batismo");
    const reading = plain.locator('[data-search-topic="batismo"] details.bsearch-reading').first();
    await reading.locator("summary").click();
    await expect(reading.locator("blockquote")).toContainText(scripture("MAT", 3, 13));
    await noHorizontalOverflow(plain);

    await plain.goto("/historias/exodo");
    await expect(plain.locator("article[data-story-scene]")).toHaveCount(4);
    expect(await plain.locator(".story-scenes-viewport").evaluate((element) => getComputedStyle(element).overflowX)).toBe("auto");
    const reflection = plain.locator("details.story-reflection-context");
    await reflection.locator("summary").click();
    await expect(reflection).toContainText(biblicalStories.find((story) => story.id === "exodo")!.question.options[0].feedback);
    await noHorizontalOverflow(plain);

    await plain.goto("/igrejas");
    const peopleIndex = plain.locator(".history-reading-index details").last();
    await peopleIndex.locator("summary").click();
    await peopleIndex.getByRole("link", { name: /Frida Vingren/ }).click();
    await expect(plain).toHaveURL(/\/igrejas\/frida-vingren$/);
    await plain.locator("details.history-sources > summary").click();
    expect(await plain.locator("details.history-sources a[href^='https://']").count()).toBeGreaterThan(0);
    await noHorizontalOverflow(plain);
  } finally { await context.close(); }
});
