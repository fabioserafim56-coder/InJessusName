import { test, expect } from "@playwright/test";

test("painel de estudo carrega com navegação e entrada real na primeira aula", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  const response = await page.goto("/");
  expect(response?.status()).toBe(200);
  expect(response?.headers()["x-frame-options"]).toBe("DENY");
  await expect(page.locator("html")).toHaveAttribute("lang", "pt-BR");
  await expect(page.getByRole("main").getByRole("heading", { level: 1 })).toBeVisible();
  const startLesson = page.getByRole("link", { name: "Começar a primeira aula", exact: true });
  await expect(startLesson).toHaveAttribute("href", "/aprender/primeiros-passos");

  const invalidLinks = await page.locator('a[href^="#"]').evaluateAll((links) =>
    links.map((link) => link.getAttribute("href") || "")
      .filter((href) => href.length < 2 || !document.getElementById(decodeURIComponent(href.slice(1))))
  );
  expect(invalidLinks).toEqual([]);
  await startLesson.click();
  await expect(page).toHaveURL(/\/aprender\/primeiros-passos$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Encontrar o texto");
  expect(pageErrors).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("navegação de app funciona por teclado e mantém a área atual identificada", async ({ page, isMobile }) => {
  await page.goto("/");
  const navigation = page.getByRole("navigation", { name: isMobile ? "Navegação no celular" : "Navegação principal", exact: true });
  const learn = navigation.getByRole("link", { name: "Aprender", exact: true });
  await expect(navigation).toBeVisible();
  await expect(navigation.getByRole("link", { name: "Início", exact: true })).toHaveAttribute("aria-current", "page");
  await learn.focus();
  await expect(learn).toBeFocused();
  await learn.press("Enter");
  await expect(page).toHaveURL(/\/aprender$/);
  await expect(learn).toHaveAttribute("aria-current", "page");
  await navigation.getByRole("link", { name: "Bíblia", exact: true }).click();
  await expect(page).toHaveURL(/\/biblia$/);
  await expect(navigation.getByRole("link", { name: "Bíblia", exact: true })).toHaveAttribute("aria-current", "page");
  await expect(page.getByLabel("Livro", { exact: true })).toHaveValue("JHN");
  await expect(page.getByRole("heading", { name: "João 1", exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("manifesto, ícones e fallback offline estão funcionais", async ({ page, context, request }) => {
  const manifestResponse = await request.get("/manifest.webmanifest");
  expect(manifestResponse.ok()).toBe(true);
  const manifest = await manifestResponse.json();
  expect(manifest.start_url).toBe("/");
  expect(manifest.display).toBe("standalone");
  for (const icon of manifest.icons) {
    const response = await request.get(icon.src);
    expect(response.ok()).toBe(true);
    expect(response.headers()["content-type"]).toContain("image/png");
    expect((await response.body()).subarray(0, 8).toString("hex")).toBe("89504e470d0a1a0a");
  }

  await page.goto("/");
  await page.waitForFunction(() => Boolean(navigator.serviceWorker.controller));
  await context.setOffline(true);
  await page.goto("/estudo-sem-conexao");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Vamos retomar o seu caminho.");
  await page.getByRole("button", { name: "Tentar novamente" }).click();
  await expect(page.getByRole("status")).toContainText("Ainda não conseguimos acessar o aplicativo.");
  await context.setOffline(false);
  await expect(page).toHaveURL(/\/$/, { timeout: 20000 });
  await expect(page.getByRole("link", { name: "Começar a primeira aula", exact: true })).toBeVisible();
});
