import { expect, test, type Page } from "@playwright/test";
import edition from "../../src/content/bible/edition.json";

async function openGame(page: Page, game: "caminho" | "conexoes" | "sinais") {
  await page.goto(`/jogos?jogo=${game}`);
  await expect(page.locator('[data-games-ready="true"]')).toBeVisible();
  await expect(page.locator(`[data-active-game="${game}"]`)).toBeVisible();
  await expect(page.locator(".g-visit-progress")).toContainText("0");
}

async function keyboardClick(page: Page, selector: string) {
  await page.locator(selector).focus();
  await page.keyboard.press("Enter");
}

async function assertNoOverflow(page: Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
}

test("the Samaritan path explains a retry and completes only in the biblical sequence, using a keyboard", async ({ page }) => {
  const writes: string[] = [];
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("request", request => { if (request.method() !== "GET" && new URL(request.url()).pathname.startsWith("/api/")) writes.push(request.url()); });
  await openGame(page, "caminho");
  for (const [index, id] of ["levou", "viu", "confiou", "tratou"].entries()) {
    await page.locator(`[data-game-step="${id}"]`).click();
    await page.locator(`[data-route-slot="${index + 1}"]`).click();
  }
  await page.getByRole("button", { name: "Conferir o caminho", exact: true }).click();
  await expect(page.locator(".g-feedback")).toContainText("versículo 33");
  await expect(page.locator(".g-completion")).toHaveCount(0);
  await expect(page.locator(".g-visit-progress")).toContainText("0");
  await page.getByRole("button", { name: "Recomeçar esta prática", exact: true }).click();
  for (const [index, id] of ["viu", "tratou", "levou", "confiou"].entries()) {
    await keyboardClick(page, `[data-game-step="${id}"]`);
    await keyboardClick(page, `[data-route-slot="${index + 1}"]`);
  }
  await page.getByRole("button", { name: "Conferir o caminho", exact: true }).click();
  await expect(page.locator(".g-completion")).toContainText("sequência do cuidado");
  await expect(page.locator(".g-visit-progress")).toContainText("1");
  await page.locator(".g-reading-columns .g-scripture summary").click();
  await expect(page.locator(".g-verse").first()).toContainText("Porém um certo samaritano");
  await expect(page.locator('a[href="/biblia?livro=LUK&capitulo=10&versiculo=33#versiculo-33"]')).toBeVisible();
  const credits = page.locator(".g-footer details");
  await credits.locator("summary").click();
  await expect(credits).toContainText(edition.attribution);
  await expect(credits.getByRole("link", { name: "Fonte da edição", exact: false })).toHaveAttribute("href", edition.sourceUrl);
  await expect(credits.getByRole("link", { name: "Licença de uso da Bíblia", exact: false })).toHaveAttribute("href", edition.licenseUrl);
  await assertNoOverflow(page);
  await page.reload();
  await expect(page.locator('[data-games-ready="true"]')).toBeVisible();
  await expect(page.locator(".g-visit-progress")).toContainText("0");
  expect((await page.context().storageState()).origins).toEqual([]);
  expect(errors).toEqual([]);
  expect(writes).toEqual([]);
});

test("passage connections distinguish a parable, a psalm and Jesus' sign with explained retries", async ({ page }) => {
  await openGame(page, "conexoes");
  for (const [id, category] of [["proximo", "salmo"], ["pastor", "sinal"], ["multidao", "parabola"]]) {
    await page.locator(`[data-passage="${id}"]`).click();
    await page.locator(`[data-category="${category}"]`).click();
  }
  await page.getByRole("button", { name: "Conferir as conexões", exact: true }).click();
  await expect(page.locator(".g-feedback")).toContainText("mais atenção");
  await expect(page.locator(".g-connection-explanations article")).toHaveCount(3);
  await expect(page.locator(".g-completion")).toHaveCount(0);
  await expect(page.locator(".g-visit-progress")).toContainText("0");
  for (const [id, category] of [["proximo", "parabola"], ["pastor", "salmo"], ["multidao", "sinal"]]) {
    await keyboardClick(page, `[data-passage="${id}"]`);
    await keyboardClick(page, `[data-category="${category}"]`);
  }
  await page.getByRole("button", { name: "Conferir as conexões", exact: true }).click();
  await expect(page.locator(".g-completion")).toContainText("fios agora fazem sentido");
  await expect(page.locator(".g-visit-progress")).toContainText("1");
  await expect(page.locator(".g-connection-explanations")).toContainText("versículo 14 o chama de sinal");
  await assertNoOverflow(page);
});

test("John 6 investigation needs all clues and a grounded conclusion before completion", async ({ page }) => {
  await openGame(page, "sinais");
  await expect(page.locator("[data-conclusion]")).toHaveCount(0);
  await page.locator('[data-clue-answer="dois-cinco"]').click();
  await expect(page.locator(".g-clue-panel .g-feedback")).toContainText("cinco pães de cevada e dois peixinhos");
  await expect(page.locator(".g-clue-progress")).toContainText("0/3");
  await page.locator('[data-clue-answer="cinco-dois"]').click();
  await page.locator('[data-clue="jesus"]').click();
  await page.locator('[data-clue-answer="filipe"]').click();
  await expect(page.locator(".g-clue-panel .g-feedback")).toContainText("Jesus");
  await page.locator('[data-clue-answer="jesus"]').click();
  await keyboardClick(page, '[data-clue="cestos"]');
  await page.locator('[data-clue-answer="sete"]').click();
  await expect(page.locator(".g-clue-panel .g-feedback")).toContainText("Marcos 8:8");
  await keyboardClick(page, '[data-clue-answer="doze"]');
  await expect(page.locator(".g-clue-progress")).toContainText("3/3");
  await page.locator('[data-conclusion="promessa"]').click();
  await expect(page.locator(".g-conclusion .g-feedback")).toContainText("sem culpar quem está em necessidade");
  await expect(page.locator(".g-completion")).toHaveCount(0);
  await expect(page.locator(".g-visit-progress")).toContainText("0");
  await page.locator('[data-conclusion="sinal"]').click();
  await expect(page.locator(".g-completion")).toContainText("Bíblia aberta");
  await expect(page.locator(".g-visit-progress")).toContainText("1");
  await expect(page.locator(".g-clue-panel .g-verse").last()).toContainText("encheram doze cestos");
  await assertNoOverflow(page);
});
