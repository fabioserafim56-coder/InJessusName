import { test as base, expect, type APIRequestContext, type Page } from "@playwright/test";
import { createLocalAuthHarness, isLocalAuthTarget, type LocalAuthHarness, type SyntheticAccount } from "../helpers/local-auth";

const test = base.extend<{ accounts: LocalAuthHarness }>({
  accounts: async ({ baseURL }, provide) => {
    if (!baseURL || !["127.0.0.1", "localhost", "[::1]"].includes(new URL(baseURL).hostname)) {
      throw new Error("A integração de contas exige um servidor de aplicativo em loopback.");
    }
    test.skip(!isLocalAuthTarget(), "Contas sintéticas não são criadas em um Supabase remoto; execute a integração com o ambiente local.");
    const accounts = createLocalAuthHarness();
    try { await provide(accounts); }
    finally { await accounts.cleanup(); }
  }
});

// Authentication requests and Set-Cookie responses must not be retained in traces.
test.use({ trace: "off" });

const adultProfile = {
  ageBand: "18_plus",
  traditionCode: "ccb",
  baptismStatus: "not_baptized",
  goal: "christian_service"
};

async function choose(page: Page, title: string) {
  const option = page.getByRole("radio", { name: title });
  await option.check();
  await expect(option).toBeChecked();
  await page.getByRole("button", { name: "Continuar", exact: true }).click();
}

async function fillAdultInterview(page: Page, perspective: "ccb" | "catholic") {
  await choose(page, "18 anos ou mais");
  await choose(page, perspective === "ccb" ? "Congregação Cristã no Brasil" : "Igreja Católica");
  await choose(page, perspective === "ccb" ? "Ainda não fui batizado(a)" : "Prefiro não informar");
  await choose(page, perspective === "ccb" ? "Aprofundar a fé e servir com cuidado" : "Estudar teologia e história");
  const consent = page.getByRole("checkbox", { name: /^Autorizo o uso destas respostas/ });
  await expect(consent).not.toBeChecked();
  await expect(page.getByRole("button", { name: "Salvar meu percurso", exact: true })).toBeDisabled();
  await consent.check();
  await page.getByRole("button", { name: "Salvar meu percurso", exact: true }).click();
  await expect(page).toHaveURL(/\/meu-percurso$/);
}

async function signUpViaApi(request: APIRequestContext, account: SyntheticAccount, origin: string) {
  const response = await request.post("/api/auth", {
    headers: { Origin: origin },
    data: { mode: "signup", ...account, adultConfirmation: true, next: "/comecar" }
  });
  expect(response.status()).toBe(200);
  const result = await response.json();
  expect(result.redirect).toBe("/comecar");
  expect(result.access_token).toBeUndefined();
  expect(result.refresh_token).toBeUndefined();
}

test("visitante de 10 a 12 anos chega à trilha Ponte sem fornecer informações religiosas", async ({ page }) => {
  const writes: string[] = [];
  page.on("request", (request) => {
    if (new URL(request.url()).pathname === "/api/onboarding" && request.method() !== "GET") {
      writes.push(request.method());
    }
  });

  await page.goto("/comecar");
  await expect(page.getByRole("button", { name: "Continuar", exact: true })).toBeDisabled();
  await choose(page, "10 a 12 anos");
  await expect(page.getByRole("heading", { name: "Há um caminho para a sua fase da vida." })).toBeVisible();
  await expect(page.getByRole("radio")).toHaveCount(0);
  await expect(page.locator('input[name="traditionCode"], input[name="baptismStatus"], input[name="goal"]')).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Conhecer a trilha Ponte" })).toHaveAttribute("href", "/jornada/ponte");
  expect(await page.evaluate(() => ({ local: Object.keys(localStorage), session: Object.keys(sessionStorage) })))
    .toEqual({ local: [], session: [] });

  await page.getByRole("link", { name: "Conhecer a trilha Ponte" }).click();
  await expect(page).toHaveURL(/\/jornada\/ponte$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Investigar. Encontrar. Compreender.");
  await expect(page.getByRole("main")).toContainText("10 a 12 anos");
  await expect(page.getByRole("main")).toContainText("Aulas em preparação");
  expect(writes).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("adulto cria conta, salva, revisa e revoga seu percurso com persistência real", async ({ page, context, accounts }) => {
  test.setTimeout(60000);
  const account = accounts.account();
  await page.goto("/entrar?next=/comecar");
  await page.getByRole("button", { name: "Criar conta", exact: true }).click();
  await page.getByLabel("E-mail", { exact: true }).fill(account.email);
  await page.getByLabel("Senha", { exact: true }).fill(account.password);
  await expect(page.getByRole("button", { name: "Criar minha conta", exact: true })).toBeDisabled();
  await page.getByRole("checkbox", { name: "Declaro que tenho 18 anos ou mais." }).check();
  await page.getByRole("button", { name: "Criar minha conta", exact: true }).click();
  await expect(page).toHaveURL(/\/comecar$/);
  await expect(page.getByRole("link", { name: "Meu percurso", exact: true })).toBeVisible();

  const sessionCookies = (await context.cookies()).filter((cookie) => cookie.name.startsWith("sb-"));
  expect(sessionCookies.length).toBeGreaterThan(0);
  expect(sessionCookies.every((cookie) => cookie.httpOnly)).toBe(true);
  expect(await page.evaluate(() => document.cookie.includes("sb-"))).toBe(false);

  await fillAdultInterview(page, "ccb");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Conhecer para servir com cuidado.");
  await expect(page.getByRole("heading", { name: "Perspectiva CCB", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Guia de Zelo Doutrinário, Bom Testemunho e Conhecimento dos Santos Serviços", exact: true })).toBeVisible();
  let response = await page.request.get("/api/onboarding");
  expect(response.status()).toBe(200);
  expect(response.headers()["cache-control"]).toContain("no-store");
  expect(await response.json()).toEqual({ profile: adultProfile });

  await page.reload();
  await expect(page.getByRole("heading", { name: "Perspectiva CCB", exact: true })).toBeVisible();
  await page.getByRole("link", { name: "Rever minhas escolhas", exact: true }).first().click();
  await fillAdultInterview(page, "catholic");
  await expect(page.getByRole("heading", { name: "Perspectiva católica", exact: true })).toBeVisible();
  response = await page.request.get("/api/onboarding");
  expect(await response.json()).toEqual({
    profile: { ageBand: "18_plus", traditionCode: "roman_catholic", baptismStatus: "not_informed", goal: "theology_history" }
  });
  await page.reload();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Conhecer as raízes. Entender os caminhos.");

  await page.getByRole("button", { name: "Revogar personalização e apagar respostas", exact: true }).click();
  await expect(page).toHaveURL(/\/jornada\/adultos$/);
  response = await page.request.get("/api/onboarding");
  expect(response.status()).toBe(200);
  expect(await response.json()).toEqual({ profile: null });

  await page.goto("/meu-percurso");
  await expect(page.getByRole("main")).toContainText("Você ainda não tem uma personalização salva.");
  await page.getByRole("button", { name: "Sair da conta", exact: true }).click();
  await expect(page).toHaveURL(/\/$/);
  expect((await page.request.get("/api/onboarding")).status()).toBe(401);

  // A conta permanece utilizável depois da revogação dos dados religiosos.
  await page.goto("/entrar?next=/meu-percurso");
  await page.getByLabel("E-mail", { exact: true }).fill(account.email);
  await page.getByLabel("Senha", { exact: true }).fill(account.password);
  await page.getByRole("button", { name: "Entrar", exact: true }).click();
  await expect(page).toHaveURL(/\/meu-percurso$/);
  await expect(page.getByRole("main")).toContainText("Você ainda não tem uma personalização salva.");
  await page.getByRole("button", { name: "Sair da conta", exact: true }).click();
  await expect(page).toHaveURL(/\/$/);
});

test("APIs exigem identidade, origem e consentimento e isolam duas contas reais", async ({ page, browser, baseURL, accounts }) => {
  test.setTimeout(60000);
  if (!baseURL) throw new Error("A URL local do aplicativo precisa estar configurada no Playwright.");
  const origin = new URL(baseURL).origin;
  const api = page.request;
  expect((await api.get("/api/onboarding")).status()).toBe(401);
  expect((await api.post("/api/onboarding", { headers: { Origin: origin }, data: { ...adultProfile, consent: true } })).status()).toBe(401);

  await signUpViaApi(api, accounts.account(), origin);
  const payloads = [
    { data: { ...adultProfile, consent: false }, status: 422 },
    { data: { ...adultProfile, ageBand: "10_12", consent: true }, status: 403 },
    { data: { ...adultProfile, consent: true, userId: "10000000-0000-0000-0000-000000000999" }, status: 400 }
  ];
  for (const payload of payloads) {
    const response = await api.post("/api/onboarding", { headers: { Origin: origin }, data: payload.data });
    expect(response.status()).toBe(payload.status);
    expect(await (await api.get("/api/onboarding")).json()).toEqual({ profile: null });
  }
  const foreignOrigin = await api.post("/api/onboarding", {
    headers: { Origin: "https://example.invalid" }, data: { ...adultProfile, consent: true }
  });
  expect(foreignOrigin.status()).toBe(403);
  const firstSave = await api.post("/api/onboarding", { headers: { Origin: origin }, data: { ...adultProfile, consent: true } });
  expect(firstSave.status()).toBe(200);
  expect(await (await api.get("/api/onboarding")).json()).toEqual({ profile: adultProfile });

  const other = await browser.newContext({ baseURL });
  try {
    expect((await other.request.get("/api/onboarding")).status()).toBe(401);
    await signUpViaApi(other.request, accounts.account(), origin);
    expect(await (await other.request.get("/api/onboarding")).json()).toEqual({ profile: null });
    const secondProfile = { ageBand: "18_plus", traditionCode: "roman_catholic", baptismStatus: "baptized", goal: "theology_history" };
    expect((await other.request.post("/api/onboarding", {
      headers: { Origin: origin }, data: { ...secondProfile, consent: true }
    })).status()).toBe(200);
    expect(await (await other.request.get("/api/onboarding")).json()).toEqual({ profile: secondProfile });
    expect(await (await api.get("/api/onboarding")).json()).toEqual({ profile: adultProfile });

    expect((await other.request.post("/api/auth/signout", { headers: { Origin: origin }, data: {} })).status()).toBe(200);
    expect((await other.request.get("/api/onboarding")).status()).toBe(401);
    expect(await (await api.get("/api/onboarding")).json()).toEqual({ profile: adultProfile });
  } finally { await other.close(); }
});
