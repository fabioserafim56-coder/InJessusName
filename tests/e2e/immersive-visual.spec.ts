import { test, expect, type Locator, type Page } from "@playwright/test";

type VerseText = { number: number; text: string };

async function originalVerses(page: Page): Promise<VerseText[]> {
  return page.locator(".br-verses > li").evaluateAll((items) => items.map((item) => ({
    number: Number(item.getAttribute("value")),
    text: item.querySelector(":scope > span")?.textContent ?? ""
  })));
}

async function expectCompleteChapter(host: Locator, expected: VerseText[]) {
  const actual = await host.evaluate((element) => {
    // A renderer may temporarily copy a leaf while turning it. Read the stable
    // physical page order once; duplicate leaves must contain the same text.
    const pages = new Map<number, { verse: number; text: string }[]>();
    for (const leaf of element.querySelectorAll<HTMLElement>("[data-book-page]")) {
      const index = Number(leaf.dataset.bookPage);
      const fragments = [...leaf.querySelectorAll<HTMLElement>("[data-verse]")].map((fragment) => ({
        verse: Number(fragment.dataset.verse),
        text: fragment.querySelector("span[data-verse-text]")?.textContent ?? ""
      }));
      const previous = pages.get(index);
      if (previous && JSON.stringify(previous) !== JSON.stringify(fragments)) {
        throw new Error("Duas representações da mesma folha têm textos diferentes.");
      }
      pages.set(index, fragments);
    }
    const verses = new Map<number, string>();
    for (const [, fragments] of [...pages.entries()].sort(([a], [b]) => a - b)) {
      for (const fragment of fragments) verses.set(fragment.verse, (verses.get(fragment.verse) ?? "") + fragment.text);
    }
    return [...verses.entries()].map(([number, text]) => ({ number, text }));
  });
  expect(actual).toEqual(expected);
  await expect(host).toHaveAttribute("data-verse-count", String(expected.length));
  expect(await host.locator("[data-book-page]").count()).toBeGreaterThan(1);
}

async function expectPaperFits(host: Locator) {
  const overflowing = await host.locator(".sb-paper-text").evaluateAll((papers) => papers
    .filter((paper) => paper.clientHeight > 0 && paper.clientWidth > 0)
    .filter((paper) => paper.scrollHeight > paper.clientHeight + 2 || paper.scrollWidth > paper.clientWidth + 2)
    .map((paper) => ({ height: paper.clientHeight, scrollHeight: paper.scrollHeight, width: paper.clientWidth, scrollWidth: paper.scrollWidth })));
  expect(overflowing).toEqual([]);
}

async function openBook(page: Page) {
  const trigger = page.getByRole("button", { name: "Abrir minha Bíblia", exact: true });
  await trigger.click();
  const dialog = page.getByRole("dialog", { name: "Sua Bíblia aberta", exact: true });
  await expect(dialog).toBeVisible();
  const host = dialog.locator("[data-book-ready]");
  await expect(host).toHaveAttribute("data-book-ready", "true", { timeout: 15000 });
  await expect(host).toHaveAttribute("data-book-state", "read");
  return { trigger, dialog, host };
}

test("nova entrada carrega artes reais e permite percorrer os seis estudos por botões e teclado", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  expect((await page.goto("/"))?.status()).toBe(200);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Vamos abrir a Palavra juntos.");
  const artwork = page.locator("img[data-visual-art]");
  expect(await artwork.count()).toBeGreaterThanOrEqual(2);
  for (const image of await artwork.all()) {
    await image.scrollIntoViewIfNeeded();
    await expect.poll(() => image.evaluate((element) => {
      const picture = element as HTMLImageElement;
      return picture.complete && picture.naturalWidth > 0 && picture.naturalHeight > 0;
    })).toBe(true);
  }

  const journey = page.getByRole("region", { name: "Cada encontro, uma nova descoberta.", exact: true });
  const viewport = journey.locator(".journey-viewport");
  await expect(viewport).toHaveClass(/journey-enhanced/);
  const lessons = journey.locator('a[href^="/aprender/"]');
  await expect(lessons).toHaveCount(6);
  const before = await journey.getAttribute("data-journey-position");
  await journey.getByRole("button", { name: "Próximos estudos", exact: true }).click();
  await expect(journey).not.toHaveAttribute("data-journey-position", before!);
  const afterButton = await journey.getAttribute("data-journey-position");
  await viewport.focus();
  await viewport.press("ArrowRight");
  await expect(journey).not.toHaveAttribute("data-journey-position", afterButton!);
  await lessons.last().focus();
  await expect(lessons.last()).toBeFocused();
  await expect(lessons.last()).toBeInViewport({ ratio: .95 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(await page.locator("audio[autoplay], video[autoplay]").count()).toBe(0);
  expect(errors).toEqual([]);
});

test("narração autoral toca apenas por escolha e oferece transcrição sem consultar modelos externos", async ({ page, request }) => {
  const modelRequests: string[] = [];
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("request", (outgoing) => {
    const url = new URL(outgoing.url());
    if (url.hostname === "huggingface.co" || url.hostname.endsWith(".huggingface.co")
      || url.hostname === "hf.co" || url.hostname.endsWith(".hf.co")
      || /\.(?:onnx|safetensors)(?:$|\?)/i.test(url.pathname)) modelRequests.push(outgoing.url());
  });
  await page.goto("/");
  const welcome = page.getByRole("region", { name: "Há lugar para você nesta caminhada.", exact: true });
  const audio = welcome.locator("audio");
  await expect(audio).toHaveAttribute("controls", "");
  await expect(audio).toHaveAttribute("preload", "none");
  await expect(audio).not.toHaveAttribute("autoplay");
  expect(await audio.evaluate((element: HTMLAudioElement) => ({ paused: element.paused, position: element.currentTime })))
    .toEqual({ paused: true, position: 0 });
  await expect(welcome).toContainText("voz sintética em português");
  const source = await audio.locator("source").getAttribute("src");
  expect(source).toBe("/audio/bem-vindo-kokoro-ptbr.mp3");
  const mp3 = await request.get(source!);
  expect(mp3.status()).toBe(200);
  expect(mp3.headers()["content-type"]).toContain("audio/mpeg");
  expect((await mp3.body()).length).toBeGreaterThan(100000);

  const provenanceResponse = await request.get("/audio/bem-vindo-proveniencia.json");
  expect(provenanceResponse.status()).toBe(200);
  const provenance = await provenanceResponse.json();
  expect(provenance.syntheticVoice).toBe(true);
  expect(provenance.language).toBe("pt-BR");
  const transcript = welcome.locator("details");
  await expect(transcript).not.toHaveAttribute("open", "");
  await transcript.getByText("Ler a mensagem e conhecer a narração", { exact: true }).click();
  await expect(transcript).toHaveAttribute("open", "");
  await expect(transcript).toContainText(provenance.transcript);
  await expect(transcript).toContainText("Texto autoral do InJessusName.");
  await expect(transcript.getByRole("link", { name: "Origem e detalhes do áudio", exact: true }))
    .toHaveAttribute("href", "/audio/bem-vindo-proveniencia.json");

  // Use Chromium's native media keyboard control, preserving the real user gesture.
  // A direct call to play() would skip testing the control exposed to the visitor.
  await audio.focus();
  await audio.press("Space");
  await expect.poll(() => audio.evaluate((element: HTMLAudioElement) => element.paused)).toBe(false);
  await expect.poll(() => audio.evaluate((element: HTMLAudioElement) => element.currentTime)).toBeGreaterThan(.25);
  const duration = await audio.evaluate((element: HTMLAudioElement) => element.duration);
  expect(duration).toBeGreaterThan(24);
  expect(duration).toBeLessThan(27);
  expect(Math.abs(duration - provenance.durationSeconds)).toBeLessThan(.3);
  await audio.press("Space");
  await expect.poll(() => audio.evaluate((element: HTMLAudioElement) => element.paused)).toBe(true);
  expect(modelRequests).toEqual([]);
  expect(errors).toEqual([]);
});

test("Bíblia abre o capítulo integral como livro, vira páginas e devolve o foco ao fechar", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.addInitScript(() => {
    const request = window.requestAnimationFrame.bind(window);
    const cancel = window.cancelAnimationFrame.bind(window);
    const pending = new Set<number>();
    window.requestAnimationFrame = (callback: FrameRequestCallback) => {
      const handle = request((time) => {
        pending.delete(handle);
        callback(time);
      });
      pending.add(handle);
      return handle;
    };
    window.cancelAnimationFrame = (handle: number) => {
      pending.delete(handle);
      cancel(handle);
    };
    Object.defineProperty(window, "__injessusPendingAnimationFrames", { value: () => pending.size });
  });
  await page.goto("/biblia?livro=ACT&capitulo=17");
  const pendingFrames = () => page.evaluate(() => (
    window as typeof window & { __injessusPendingAnimationFrames: () => number }
  ).__injessusPendingAnimationFrames());
  // The plain reader has no running animation loop. Wait for actual queued work
  // to finish rather than introducing a fixed delay around renderer disposal.
  await expect.poll(pendingFrames).toBe(0);
  const baselineFrames = await pendingFrames();
  const expected = await originalVerses(page);
  expect(expected).toHaveLength(34);
  const { trigger, dialog, host } = await openBook(page);
  await expect.poll(pendingFrames).toBeGreaterThan(baselineFrames);
  await expectCompleteChapter(host, expected);
  await expectPaperFits(host);
  const forward = dialog.getByRole("button", { name: "Virar página para frente", exact: true });
  await expect(forward).toBeEnabled();
  const before = await host.getAttribute("data-current-page");
  await forward.click();
  await expect(host).not.toHaveAttribute("data-current-page", before!);
  await expect(host).toHaveAttribute("data-book-state", "read");
  await expectPaperFits(host);
  const after = await host.getAttribute("data-current-page");
  await forward.focus();
  await forward.press("ArrowRight");
  await expect(host).not.toHaveAttribute("data-current-page", after!);
  await expect(host).toHaveAttribute("data-book-state", "read");
  expect(await dialog.evaluate((element) => element.scrollWidth <= element.clientWidth + 1)).toBe(true);
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await expect(page.getByRole("heading", { name: "Atos 17", exact: true })).toBeVisible();
  await expect.poll(pendingFrames).toBe(baselineFrames);
  // Reopening exercises disposal of the imperative page renderer without removing
  // React-owned nodes or leaving duplicate keyboard listeners behind.
  await trigger.click();
  await expect(host).toHaveAttribute("data-book-ready", "true", { timeout: 15000 });
  await dialog.getByRole("button", { name: "Fechar modo livro", exact: true }).click();
  await expect(dialog).not.toBeVisible();
  await expect.poll(pendingFrames).toBe(baselineFrames);
  expect(errors).toEqual([]);
});

test("capítulo longo mantém todo o texto e a leitura simples com movimento reduzido", async ({ page }) => {
  test.setTimeout(60000);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/biblia?livro=PSA&capitulo=119&versiculo=176");
  const expected = await originalVerses(page);
  expect(expected).toHaveLength(176);
  for (let index = 0; index < 4; index++) await page.getByRole("button", { name: "Aumentar tamanho do texto", exact: true }).click();
  await expect(page.getByRole("group", { name: "Tamanho do texto bíblico", exact: true })).toContainText("29 px");
  const { dialog, host } = await openBook(page);
  await expectCompleteChapter(host, expected);
  await expectPaperFits(host);
  await expect(host.locator('[data-verse="176"]').first()).toHaveClass(/sb-highlight/);
  const backward = dialog.getByRole("button", { name: "Virar página para trás", exact: true });
  await expect(backward).toBeEnabled();
  const before = await host.getAttribute("data-current-page");
  await backward.click();
  await expect(host).not.toHaveAttribute("data-current-page", before!);
  await expect(host).toHaveAttribute("data-book-state", "read");
  await dialog.getByRole("button", { name: "Prefiro a leitura simples", exact: true }).click();
  await expect(dialog).not.toBeVisible();
  await expect(page.locator("#bible-chapter")).toBeFocused();
  await expect(page.locator(".br-verses > li")).toHaveCount(176);
  await expect(page.locator("#versiculo-176")).toHaveClass("br-verse-highlighted");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("início e leitor permanecem utilizáveis sem JavaScript", async ({ browser, baseURL, page, isMobile }) => {
  const context = await browser.newContext({
    baseURL, javaScriptEnabled: false, serviceWorkers: "block",
    viewport: page.viewportSize()!, isMobile, hasTouch: isMobile
  });
  try {
    const plain = await context.newPage();
    expect((await plain.goto("/"))?.status()).toBe(200);
    await expect(plain.getByRole("heading", { level: 1 })).toHaveText("Vamos abrir a Palavra juntos.");
    const journey = plain.getByRole("region", { name: "Cada encontro, uma nova descoberta.", exact: true });
    const links = journey.locator('a[href^="/aprender/"]');
    await expect(links).toHaveCount(6);
    expect(await journey.locator(".journey-viewport").evaluate((element) => getComputedStyle(element).overflowX)).toBe("auto");
    await links.last().click();
    await expect(plain).toHaveURL(/\/aprender\/compartilhar-com-respeito$/);
    await expect(plain.getByRole("heading", { level: 1 })).not.toBeEmpty();

    await plain.goto("/biblia?livro=ACT&capitulo=17&versiculo=11");
    await expect(plain.getByRole("heading", { name: "Atos 17", exact: true })).toBeVisible();
    await expect(plain.locator(".br-verses > li")).toHaveCount(34);
    await expect(plain.locator("#versiculo-11")).toHaveClass("br-verse-highlighted");
    await plain.getByLabel("Livro", { exact: true }).selectOption("LUK");
    await plain.getByLabel("Capítulo", { exact: true }).selectOption("1");
    await plain.getByRole("button", { name: "Abrir capítulo", exact: true }).click();
    await expect(plain).toHaveURL(/\/biblia\?livro=LUK&capitulo=1$/);
    await expect(plain.getByRole("heading", { name: "Lucas 1", exact: true })).toBeVisible();
    await expect(plain.locator(".br-verses > li")).toHaveCount(80);
    expect(await plain.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  } finally { await context.close(); }
});
