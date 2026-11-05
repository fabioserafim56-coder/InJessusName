import { test, expect } from "@playwright/test";
import { museumExhibits } from "../../src/content/museum";

test("consulta documentada encontra data, recusa ausência e funciona sem chamar IA paga", async ({ page }) => {
  const remoteCalls: string[] = [];
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("request", request => {
    if (request.method() === "POST" && /multimodal\/vision|api\.openai|generativelanguage/.test(request.url())) remoteCalls.push(request.url());
  });
  await page.goto("/explorar?modo=museu");
  await expect(page.locator("[data-multimodal-hub]")).toHaveAttribute("data-multimodal-ready", "true");
  const catalogue = page.locator(".mm-catalogue-search");
  const query = catalogue.getByRole("searchbox");
  await query.fill("Qual é a data desta peça?");
  await catalogue.getByRole("button", { name: "Consultar a ficha", exact: true }).click();
  const results = catalogue.locator("[data-catalogue-results]");
  await expect(results).toContainText(museumExhibits[0].approxDate);
  await expect(results).toContainText("sem resposta gerada por IA");
  await expect(results.locator("article a").first()).toHaveAttribute("href", museumExhibits[0].sources[0].url);
  await query.fill("Israel");
  await catalogue.getByRole("button", { name: "Consultar a ficha", exact: true }).click();
  await expect(results.locator("article").first()).toContainText("Israel");
  await query.fill("qzxqzxqzxqzx");
  await catalogue.getByRole("button", { name: "Consultar a ficha", exact: true }).click();
  await expect(results).toContainText("Não encontramos um trecho");
  await expect(results.locator("article")).toHaveCount(0);
  await page.getByRole("group", { name: "Escolher uma peça para explorar", exact: true }).getByRole("button", { name: museumExhibits[1].title, exact: true }).click();
  await expect(query).toHaveValue("");
  await expect(results).toHaveCount(0);
  expect(remoteCalls).toEqual([]);
  expect(errors).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("menu é recolhível, devolve o foco e dá acesso aos jogos sem ocupar uma barra lateral", async ({ page }) => {
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "Abrir menu do aplicativo", exact: true });
  const menu = page.getByRole("dialog", { name: "Menu do aplicativo", exact: true });
  await expect(page.locator(".app-sidebar")).toHaveCount(0);
  await trigger.click();
  await expect(menu).toBeVisible();
  await expect(menu.getByRole("link", { name: "Jogos da Palavra", exact: true })).toHaveAttribute("href", "/jogos");
  await page.keyboard.press("Escape");
  await expect(menu).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await expect(page.getByRole("link", { name: "Entrar nos jogos da Palavra", exact: true })).toHaveAttribute("href", "/jogos");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
