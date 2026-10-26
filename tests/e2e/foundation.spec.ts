import { test, expect } from "@playwright/test";

test("apresentação cristã carrega e todas as âncoras levam a seções existentes", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  const response = await page.goto("/");
  expect(response?.status()).toBe(200);
  expect(response?.headers()["x-frame-options"]).toBe("DENY");
  await expect(page.locator("html")).toHaveAttribute("lang", "pt-BR");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Conhecer a Palavra.");
  await expect(page.getByRole("heading", { name: /Congregação Cristã/ })).toBeVisible();
  await expect(page.getByRole("main")).toContainText("Aulas planejadas para 15–20 minutos");

  const invalidLinks = await page.locator('a[href^="#"]').evaluateAll((links) =>
    links.map((link) => link.getAttribute("href") || "")
      .filter((href) => href.length < 2 || !document.getElementById(decodeURIComponent(href.slice(1))))
  );
  expect(invalidLinks).toEqual([]);

  const firstJourneyLink = page.locator('main a[href^="#"]').first();
  const target = await firstJourneyLink.getAttribute("href");
  await firstJourneyLink.click();
  await expect(page).toHaveURL(new RegExp(`${target}$`));
  expect(pageErrors).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test("jornada permite explorar temas e navegar com o teclado", async ({ page }) => {
  await page.goto("/#jornada");
  const first = page.getByRole("tab", { name: /O princípio/ });
  const last = page.getByRole("tab", { name: /A fé através do tempo/ });
  await expect(page.getByRole("tab")).toHaveCount(6);
  expect(await page.getByRole("tab").evaluateAll((tabs) => tabs.every((tab) =>
    Boolean(document.getElementById(tab.getAttribute("aria-controls") || ""))
  ))).toBe(true);
  await last.click();
  await expect(last).toHaveAttribute("aria-selected", "true");
  await expect(page.getByRole("tabpanel")).toContainText("história do Cristianismo");
  await last.press("Home");
  await expect(first).toBeFocused();
  await expect(first).toHaveAttribute("aria-selected", "true");
  await expect(page.getByRole("tabpanel")).toContainText("Abraão e a promessa");
  await first.press("ArrowRight");
  await expect(page.getByRole("tab", { name: /Um povo em caminho/ })).toBeFocused();
  await expect(page.getByRole("tabpanel")).toContainText("Libertação e aliança");
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
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Conhecer a Palavra.", { timeout: 20000 });
});
