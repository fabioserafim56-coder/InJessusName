import { test as base, expect, type APIRequestContext } from "@playwright/test";
import { firstLesson } from "../../src/content/lessons/primeiros-passos";
import { createLocalAuthHarness, isLocalAuthTarget, type LocalAuthHarness, type SyntheticAccount } from "../helpers/local-auth";

const test = base.extend<{ accounts: LocalAuthHarness }>({
  accounts: async ({ baseURL }, provide) => {
    if (!baseURL || !["127.0.0.1", "localhost", "[::1]"].includes(new URL(baseURL).hostname)) {
      throw new Error("O teste de progresso exige um servidor de aplicativo em loopback.");
    }
    test.skip(!isLocalAuthTarget(), "Execute a integração de contas sintéticas somente com o Supabase local.");
    const accounts = createLocalAuthHarness();
    try { await provide(accounts); }
    finally { await accounts.cleanup(); }
  }
});

// Authentication cookies and requests must never be retained in traces.
test.use({ trace: "off" });

const adultProfile = {
  ageBand: "18_plus", traditionCode: null,
  baptismStatus: "not_informed", goal: "bible_foundations", consent: true
};

async function createAdultSession(request: APIRequestContext, account: SyntheticAccount, origin: string) {
  const response = await request.post("/api/auth", {
    headers: { Origin: origin },
    data: { mode: "signup", ...account, adultConfirmation: true, next: "/comecar" }
  });
  expect(response.status()).toBe(200);
}

const scoredQuestions = [
  ...firstLesson.game.missions,
  ...firstLesson.retrievalQuestions,
  firstLesson.transferQuestion
];

function completedAnswers() {
  return scoredQuestions.flatMap((question, index) => {
    const answer = {
      questionId: question.id, selectedOptionId: question.correctOptionId,
      attempt: 1, usedHint: index === 7, consultedText: index === 8
    };
    if (index !== 0) return [answer];
    const wrongOption = question.options.find((option) => option.id !== question.correctOptionId);
    if (!wrongOption) throw new Error("A atividade deve oferecer uma alternativa incorreta para testar a correção.");
    return [
      { ...answer, selectedOptionId: wrongOption.id },
      { ...answer, attempt: 2 }
    ];
  });
}

test("leitor abre livros e capítulos reais, destaca uma referência e oferece leitura acessível", async ({ page, request }) => {
  const response = await page.goto("/biblia");
  expect(response?.status()).toBe(200);
  await expect(page.getByLabel("Livro", { exact: true })).toHaveValue("JHN");
  await expect(page.getByLabel("Capítulo", { exact: true })).toHaveValue("1");
  await expect(page.locator(".br-verses > li")).toHaveCount(51);
  await page.getByLabel("Livro", { exact: true }).selectOption("ACT");
  await page.getByLabel("Capítulo", { exact: true }).selectOption("17");
  await page.getByRole("button", { name: "Abrir capítulo" }).click();
  await expect(page).toHaveURL(/\/biblia\?livro=ACT&capitulo=17$/);
  await expect(page.getByRole("heading", { name: "Atos 17", exact: true })).toBeVisible();
  await expect(page.locator(".br-verses > li")).toHaveCount(34);
  await page.getByRole("link", { name: "Atos 17:11, destacar versículo" }).click();
  await expect(page.locator("#versiculo-11")).toHaveClass("br-verse-highlighted");
  await expect(page.getByText("Versículo 11 destacado.", { exact: false })).toBeVisible();
  await expect(page.locator("#versiculo-10 span")).not.toBeEmpty();
  await expect(page.locator("#versiculo-12 span")).not.toBeEmpty();
  await page.getByRole("button", { name: "Aumentar tamanho do texto" }).click();
  await expect(page.getByRole("group", { name: "Tamanho do texto bíblico" })).toContainText("23 px");
  await expect(page.locator("#br-source")).not.toBeVisible();
  await page.getByRole("button", { name: "Edição e fontes", exact: true }).click();
  await expect(page.locator("#br-source")).toBeVisible();
  await expect(page.locator("#br-source")).toContainText("Licença:");
  await expect(page.locator("#br-source")).toContainText("deuterocanônicos");
  await page.getByRole("button", { name: "Voltar à leitura", exact: true }).click();
  await expect(page.locator("#br-source")).not.toBeVisible();
  await expect(page.getByRole("link", { name: /Consultar a fonte da edição/ })).toHaveAttribute("href", /^https:\/\//);
  await page.getByRole("link", { name: "Próximo capítulo" }).click();
  await expect(page.getByRole("heading", { name: "Atos 18", exact: true })).toBeVisible();
  await page.getByRole("link", { name: "Capítulo anterior" }).click();
  await expect(page.getByRole("heading", { name: "Atos 17", exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);

  for (const query of [
    "livro=ACT&capitulo=0", "livro=ACT&capitulo=1.5", "livro=ACT&capitulo=999",
    "livro=INVALID&capitulo=1", "livro=ACT&capitulo=17&versiculo=99",
    "livro=ACT&livro=LUK&capitulo=1"
  ]) {
    expect((await request.get(`/biblia?${query}`)).status()).toBe(404);
  }
});

test("aula oferece exemplo, correção e retomada sem confundir ajuda com lembrança independente", async ({ page }) => {
  test.setTimeout(90000);
  const saves: string[] = [];
  page.on("request", (request) => {
    if (new URL(request.url()).pathname === "/api/study-progress" && request.method() === "POST") {
      saves.push(request.method());
    }
  });
  await page.goto("/aprender/primeiros-passos");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(firstLesson.title);
  await page.getByRole("button", { name: "Preparar minha mesa", exact: true }).click();
  const preparation = page.getByRole("dialog", { name: "Vamos preparar este momento?" });
  await expect(preparation).toBeVisible();
  await expect(preparation).toContainText("Bíblia");
  await expect(preparation).toContainText("caderno");
  await preparation.getByRole("button", { name: "Começar a aula", exact: true }).click();
  await expect(preparation).not.toBeVisible();

  const diagnostic = firstLesson.preparation.diagnostic;
  const diagnosticCard = page.locator(`[data-question-id="${diagnostic.id}"]`);
  await expect(diagnosticCard).toBeVisible();
  await expect(page.locator(".study-lead")).toContainText("sem nota ou cobrança");
  await diagnosticCard.locator(`input[value="${diagnostic.correctOptionId}"]`).check();
  await diagnosticCard.getByRole("button", { name: "Vamos conferir juntos", exact: true }).click();
  await diagnosticCard.getByRole("button", { name: "Seguimos juntos", exact: true }).click();
  await page.getByRole("button", { name: "Vamos abrir este trecho", exact: true }).click();
  await page.getByText("Seis maneiras de olhar para esta passagem", { exact: true }).click();
  await page.getByRole("button", { name: "Histórica", exact: true }).click();
  await expect(page.getByRole("button", { name: "Histórica", exact: true })).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByText(firstLesson.lenses[2].limit, { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Acompanhar esta leitura", exact: true }).click();
  await expect(page.getByRole("heading", { name: firstLesson.workedExample.title, exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Pensar juntos sobre a passagem", exact: true }).click();
  await page.getByRole("button", { name: "Conversar sobre esta Palavra", exact: true }).click();

  const answerPositions: number[] = [];
  for (const [index, question] of scoredQuestions.entries()) {
    const card = page.locator(`[data-question-id="${question.id}"]`);
    await expect(card).toBeVisible();
    if (question.evidenceMode === "without-looking") {
      await expect(card.locator('input[type="radio"]')).toHaveCount(0);
      await card.getByRole("button", { name: "Já pensei; vamos conversar", exact: true }).click();
    }
    await expect(card.getByRole("button", { name: "Vamos conferir juntos", exact: true })).toBeDisabled();
    const optionIds = await card.locator('input[type="radio"]').evaluateAll((inputs) =>
      inputs.map((input) => (input as HTMLInputElement).value)
    );
    answerPositions.push(optionIds.indexOf(question.correctOptionId));
    if (index === 0) {
      const wrong = question.options.find((option) => option.id !== question.correctOptionId)!;
      await card.locator(`input[value="${wrong.id}"]`).check();
      await card.getByRole("button", { name: "Vamos conferir juntos", exact: true }).click();
      await expect(card.getByRole("heading", { name: "Vamos olhar juntos outra vez.", exact: true })).toBeVisible();
      await expect(card).toContainText(wrong.explanation);
      // Revisiting teaching must preserve the failed attempt and its feedback.
      await page.getByRole("button", { name: /2.*Ouvir/ }).click();
      await page.getByRole("button", { name: /3.*Conversar/ }).click();
      await expect(card).toContainText(wrong.explanation);
      await card.getByRole("button", { name: "Olhar outra vez", exact: true }).click();
      await expect(card.locator(`input[value="${wrong.id}"]`)).toBeDisabled();
    }
    if (question.evidenceMode === "without-looking") {
      // Both the question and the adjacent reader must hide the passage initially.
      await expect(page.locator(".study-passage")).toHaveCount(0);
      if (index === 6) {
        await card.getByRole("button", { name: "Reler a passagem", exact: true }).click();
        await expect(card.locator(".study-passage")).toHaveCount(1);
      }
      if (index === 8) {
        await card.getByRole("button", { name: "Preciso de uma dica", exact: true }).click();
        await expect(card.getByRole("status")).toContainText(question.hint);
        await expect(page.locator(".study-passage")).toHaveCount(0);
      }
    }
    if (question.kind === "transfer") {
      await expect(card.locator(".study-passage")).toContainText(firstLesson.passages.transfer.label);
    }
    await card.locator(`input[value="${question.correctOptionId}"]`).check();
    await card.getByRole("button", { name: "Vamos conferir juntos", exact: true }).click();
    await expect(card.getByRole("heading", { name: "Vamos guardar essa descoberta.", exact: true })).toBeVisible();
    await card.getByRole("button", { name: index === scoredQuestions.length - 1 ? "Levar esta Palavra comigo" : "Seguir com nossa conversa", exact: true }).click();
  }
  expect(new Set(answerPositions).size).toBeGreaterThan(1);
  await expect(page.getByRole("heading", { name: "Antes de seguir, guarde um cuidado.", exact: true })).toBeVisible();
  const learningPath = page.locator("details.study-results-details");
  await expect(learningPath).not.toHaveAttribute("open", "");
  await expect(page.locator(".study-results")).not.toBeVisible();
  await learningPath.getByText("Meu caminho neste estudo", { exact: true }).click();
  await expect(page.getByRole("heading", { name: "Como foi nosso caminho na leitura", exact: true })).toBeVisible();
  const result = (title: string) => page.locator(".study-results dl > div")
    .filter({ has: page.getByText(title, { exact: true }) }).locator("dd");
  await expect(result("Prática: acertos na primeira tentativa")).toHaveText("5 / 6");
  await expect(result("Lembrança: primeira tentativa sem ajuda")).toHaveText("1 / 3");
  await expect(result("Respostas que precisaram de nova tentativa")).toHaveText("1");
  await expect(result("Aplicação em outra passagem")).toHaveText("Primeira tentativa");
  await expect(page.locator(".study-results")).toContainText("não mede sua fé");
  await expect(page.locator("textarea")).toHaveCount(0);
  expect(saves).toEqual([]);
  const consent = page.getByRole("checkbox", { name: /^Quero guardar o progresso/ });
  const save = page.getByRole("button", { name: "Salvar meu progresso", exact: true });
  await expect(consent).not.toBeChecked();
  await expect(save).toBeDisabled();
  await consent.check();
  await save.click();
  await expect(page.getByRole("status")).toContainText("Entre na sua conta para guardar ou consultar o progresso.");
  expect(saves).toEqual(["POST"]);
  expect(await page.evaluate(() => ({ local: Object.keys(localStorage), session: Object.keys(sessionStorage) })))
    .toEqual({ local: [], session: [] });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.reload();
  await expect(page.getByRole("button", { name: "Preparar minha mesa", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Como foi nosso caminho na leitura", exact: true })).toHaveCount(0);
});

test("progresso recalcula evidências, preserva erros e fica restrito ao próprio adulto que autorizou", async ({ page, browser, baseURL, accounts }) => {
  test.setTimeout(60000);
  if (!baseURL) throw new Error("Configure a URL local do aplicativo para testar o progresso.");
  const origin = new URL(baseURL).origin;
  const api = page.request;
  const body = { lessonId: "primeiros-passos-v1", answers: completedAnswers(), completed: true };
  expect((await api.get("/api/study-progress")).status()).toBe(401);
  expect((await api.post("/api/study-progress", { headers: { Origin: origin }, data: body })).status()).toBe(401);

  await createAdultSession(api, accounts.account(), origin);
  expect((await api.post("/api/study-progress", { headers: { Origin: origin }, data: body })).status()).toBe(403);
  expect((await api.post("/api/onboarding", { headers: { Origin: origin }, data: adultProfile })).status()).toBe(200);
  expect(await (await api.get("/api/study-progress")).json()).toEqual({ progress: null });
  expect((await api.post("/api/study-progress", { headers: { Origin: "https://example.invalid" }, data: body })).status()).toBe(403);
  expect((await api.post("/api/study-progress", { headers: { Origin: origin }, data: { ...body, firstAttemptCorrect: 10 } })).status()).toBe(422);
  expect((await api.post("/api/study-progress", { headers: { Origin: origin }, data: { ...body, answers: [] } })).status()).toBe(422);
  expect((await api.post("/api/study-progress", {
    headers: { Origin: origin }, data: { ...body, answers: [{ ...body.answers[0], questionId: "invented-question" }], completed: false }
  })).status()).toBe(422);

  const initial = { ...body, answers: [body.answers[0]], completed: false };
  expect((await api.post("/api/study-progress", { headers: { Origin: origin }, data: initial })).status()).toBe(200);
  const started = await (await api.get("/api/study-progress")).json();
  expect(started.progress.completed).toBe(false);
  expect(started.progress.firstAttemptCorrect).toBe(0);
  expect(started.progress.nextReviewAt).toBeNull();

  const beforeSave = Date.now();
  const save = await api.post("/api/study-progress", { headers: { Origin: origin }, data: body });
  expect(save.status()).toBe(200);
  const savedResponse = await api.get("/api/study-progress");
  expect(savedResponse.headers()["cache-control"]).toContain("no-store");
  const saved = (await savedResponse.json()).progress;
  expect(saved).toMatchObject({
    lessonId: "primeiros-passos-v1", completed: true,
    firstAttemptCorrect: 9, totalQuestions: 10, retryCorrect: 1, assistedCorrect: 3,
    guidedFirstAttemptCorrect: 5, guidedTotal: 6,
    retrievalFirstAttemptCorrect: 1, retrievalTotal: 3,
    transferCorrect: true, transferFirstAttemptCorrect: true
  });
  const completedAt = new Date(saved.completedAt).getTime();
  expect(completedAt).toBeGreaterThanOrEqual(beforeSave - 2000);
  expect(completedAt).toBeLessThanOrEqual(Date.now() + 2000);
  expect(saved.reviewDates).toHaveLength(2);
  expect(new Date(saved.nextReviewAt).getTime() - completedAt).toBe(86400000);
  expect(new Date(saved.reviewDates[1]).getTime() - completedAt).toBe(7 * 86400000);

  // A replacement payload cannot erase the earlier error to inflate a first-try result.
  const rewritten = body.answers.filter((answer) => answer.attempt !== 2)
    .map((answer, index) => index === 0 ? { ...answer, selectedOptionId: scoredQuestions[0].correctOptionId } : answer);
  expect((await api.post("/api/study-progress", {
    headers: { Origin: origin }, data: { ...body, answers: rewritten }
  })).status()).toBe(422);
  expect((await (await api.get("/api/study-progress")).json()).progress.firstAttemptCorrect).toBe(9);

  const other = await browser.newContext({ baseURL });
  try {
    await createAdultSession(other.request, accounts.account(), origin);
    expect((await other.request.post("/api/onboarding", { headers: { Origin: origin }, data: adultProfile })).status()).toBe(200);
    expect(await (await other.request.get("/api/study-progress")).json()).toEqual({ progress: null });
    expect((await other.request.delete("/api/study-progress", { headers: { Origin: origin } })).status()).toBe(200);
    expect((await (await api.get("/api/study-progress")).json()).progress.completed).toBe(true);
    expect((await api.delete("/api/study-progress", { headers: { Origin: "https://example.invalid" } })).status()).toBe(403);

    expect((await api.delete("/api/onboarding", { headers: { Origin: origin } })).status()).toBe(200);
    expect(await (await api.get("/api/study-progress")).json()).toEqual({ progress: null });
    // Revoking then reauthorizing must not revive the previous religious study history.
    expect((await api.post("/api/onboarding", { headers: { Origin: origin }, data: adultProfile })).status()).toBe(200);
    expect(await (await api.get("/api/study-progress")).json()).toEqual({ progress: null });
  } finally { await other.close(); }
});
