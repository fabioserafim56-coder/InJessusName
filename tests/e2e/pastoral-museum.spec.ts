import { test, expect } from "@playwright/test";

test("entrada na Palavra acolhe uma oração opcional sem impor espera ou recolher anotações", async ({ page }) => {
  const writes: string[] = [];
  page.on("request", (request) => {
    if (["POST", "PUT", "PATCH"].includes(request.method()) && new URL(request.url()).pathname.startsWith("/api/")) {
      writes.push(request.method());
    }
  });
  await page.goto("/aprender/panorama-biblico");
  const start = page.getByRole("button", { name: "Vamos abrir a Palavra", exact: true });
  await expect(start).toBeEnabled();
  const quietMoment = page.getByRole("region", { name: "Um momento de recolhimento", exact: true });
  const invitation = quietMoment.getByRole("button", { name: /Um momento com Deus, se desejar/ });
  await expect(invitation).toHaveAttribute("aria-expanded", "false");
  await expect(quietMoment.locator(".cl-quiet-content")).not.toBeVisible();
  await invitation.click();
  await expect(invitation).toHaveAttribute("aria-expanded", "true");
  await expect(quietMoment.locator("blockquote")).toContainText("Amém");
  await expect(quietMoment).toContainText("Ore com suas próprias palavras");
  // Opening this space does not lock study behind a timer, mandatory prayer or text submission.
  await expect(start).toBeEnabled();
  await expect(page.locator("textarea")).toHaveCount(0);
  await start.click();
  await expect(page.getByRole("heading", { name: "Vamos ouvir a Palavra", exact: true })).toBeFocused();
  expect(writes).toEqual([]);
  expect(await page.evaluate(() => ({ local: Object.keys(localStorage), session: Object.keys(sessionStorage) })))
    .toEqual({ local: [], session: [] });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("museu apresenta fotografias reais que carregam e permite encontrar uma peça pelos filtros", async ({ page, request, isMobile }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const response = await page.goto("/museu");
  expect(response?.status()).toBe(200);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Museu da história bíblica", { useInnerText: true });
  const navigation = page.getByRole("navigation", { name: isMobile ? "Navegação no celular" : "Navegação principal", exact: true });
  if (isMobile) await navigation.getByLabel("Mais áreas do aplicativo", { exact: true }).click();
  await expect(navigation.getByRole("link", { name: "Museu", exact: true })).toHaveAttribute("aria-current", "page");
  if (isMobile) await navigation.getByLabel("Mais áreas do aplicativo", { exact: true }).click();

  const cards = page.locator(".museum-exhibit-card");
  const count = await cards.count();
  expect(count).toBeGreaterThanOrEqual(4);
  const firstTitle = (await cards.first().getByRole("heading").innerText()).trim();
  const firstHref = await cards.first().getAttribute("href");
  expect(firstHref).toMatch(/^\/museu\/[a-z0-9-]+$/);
  for (let index = 0; index < count; index++) {
    const image = cards.nth(index).getByRole("img");
    await image.scrollIntoViewIfNeeded();
    await expect(image).toHaveAttribute("alt", /\S+/);
    await expect.poll(() => image.evaluate((element) => {
      const picture = element as HTMLImageElement;
      return picture.complete && picture.naturalWidth > 0 && picture.naturalHeight > 0;
    })).toBe(true);
    const source = await image.getAttribute("src");
    expect(source).toBeTruthy();
    const imageResponse = await request.get(source!);
    expect(imageResponse.ok()).toBe(true);
    expect(imageResponse.headers()["content-type"]).toMatch(/^image\//);
  }

  const period = page.getByRole("combobox", { name: "Período histórico", exact: true });
  await period.selectOption({ index: 1 });
  await expect.poll(() => cards.count()).toBeGreaterThan(0);
  expect(await cards.count()).toBeLessThanOrEqual(count);
  await period.selectOption({ index: 0 });
  const objectType = page.getByRole("combobox", { name: "Tipo de peça", exact: true });
  await objectType.selectOption({ index: 1 });
  await expect.poll(() => cards.count()).toBeGreaterThan(0);
  expect(await cards.count()).toBeLessThanOrEqual(count);
  await objectType.selectOption({ index: 0 });

  const search = page.getByRole("searchbox", { name: "Buscar no museu", exact: true });
  // One omitted letter exercises tolerant search rather than relying on a copied exact title.
  const middle = Math.floor(firstTitle.length / 2);
  await search.fill(`${firstTitle.slice(0, middle)}${firstTitle.slice(middle + 1)}`);
  await expect(page.locator(`.museum-exhibit-card[href="${firstHref}"]`)).toBeVisible();
  await search.fill("objeto-que-nao-existe-92741");
  await expect(cards).toHaveCount(0);
  await search.fill("");
  await expect(cards).toHaveCount(count);
  expect(errors).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("visita à peça oferece zoom acessível, conexão bíblica e fontes históricas e de imagem", async ({ page, request }) => {
  await page.goto("/museu");
  const card = page.locator(".museum-exhibit-card").first();
  const title = (await card.getByRole("heading").innerText()).trim();
  await card.click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(title);
  await page.waitForLoadState("networkidle");
  const zoom = page.getByRole("link", { name: `Ampliar imagem: ${title}`, exact: true });
  await zoom.click();
  const lightbox = page.locator(".pswp.pswp--open");
  await expect(lightbox).toBeVisible();
  await expect(lightbox.getByRole("button", { name: "Fechar imagem", exact: true })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(lightbox).not.toBeVisible();
  await expect(zoom).toBeFocused();

  await expect(page.getByRole("heading", { name: "O que esta peça nos permite conhecer", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Onde a pesquisa pede cuidado", exact: true })).toBeVisible();
  await expect(page.locator(".museum-limits li").first()).not.toBeEmpty();

  const provenance = page.locator("details.museum-provenance");
  await expect(provenance).not.toHaveAttribute("open", "");
  await provenance.getByText("Imagem e fontes", { exact: true }).click();
  await expect(provenance).toHaveAttribute("open", "");
  await expect(provenance).toContainText(/CC0|CC BY|domínio público/i);
  const sourceLinks = provenance.getByRole("link");
  expect(await sourceLinks.count()).toBeGreaterThanOrEqual(2);
  for (const link of await sourceLinks.all()) await expect(link).toHaveAttribute("href", /^https:\/\//);

  const bibleLink = page.getByRole("main").locator('a[href^="/biblia?"]').first();
  await expect(bibleLink).toBeVisible();
  const referenceHref = await bibleLink.getAttribute("href");
  const reference = new URL(referenceHref!, "https://example.test");
  expect(reference.searchParams.get("livro")).toMatch(/^[A-Z0-9]{3}$/);
  expect(Number(reference.searchParams.get("capitulo"))).toBeGreaterThan(0);
  expect(Number(reference.searchParams.get("versiculo"))).toBeGreaterThan(0);
  expect((await request.get(referenceHref!)).status()).toBe(200);
  expect((await request.get("/museu/peca-que-nao-existe")).status()).toBe(404);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
