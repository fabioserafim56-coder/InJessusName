import { test, expect, type Locator, type Page } from "@playwright/test";
import { additionalLessons, type CourseActivity } from "../../src/content/courses/introductory-course";

test("catálogo oferece seis estudos reais e mantém a navegação disponível no celular", async ({ page, request, isMobile }) => {
  await page.goto("/aprender");
  const expectedPaths = ["/aprender/primeiros-passos", ...additionalLessons.map((lesson) => `/aprender/${lesson.id}`)].sort();
  expect(expectedPaths).toHaveLength(6);
  const offeredPaths = await page.getByRole("main").locator('a[href^="/aprender/"]').evaluateAll((links) =>
    [...new Set(links.map((link) => link.getAttribute("href") || ""))].sort()
  );
  expect(offeredPaths).toEqual(expectedPaths);
  for (const lesson of additionalLessons) {
    const response = await request.get(`/aprender/${lesson.id}`);
    expect(response.status()).toBe(200);
    expect(await response.text()).toContain(lesson.title);
  }
  expect((await request.get("/aprender/aula-que-nao-existe")).status()).toBe(404);

  const navigation = page.getByRole("navigation", { name: isMobile ? "Navegação no celular" : "Navegação principal", exact: true });
  await expect(navigation.getByRole("link", { name: "Aprender", exact: true })).toHaveAttribute("aria-current", "page");
  if (isMobile) {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await expect(navigation).toBeInViewport();
    const bounds = await navigation.boundingBox();
    expect(bounds).not.toBeNull();
    expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(page.viewportSize()!.height + 1);
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("leitura usa texto amplo e contrastante com atribuição completa em painel sob demanda", async ({ page }) => {
  await page.goto("/biblia?livro=ACT&capitulo=17");
  const source = page.locator("#br-source");
  await expect(source).not.toBeVisible();
  const reading = page.locator(".br-verses > li span").first();
  const style = await reading.evaluate((element) => {
    const css = getComputedStyle(element);
    let ancestor: Element | null = element;
    let background = "rgb(255, 255, 255)";
    while (ancestor) {
      const candidate = getComputedStyle(ancestor).backgroundColor;
      if (candidate !== "transparent" && candidate !== "rgba(0, 0, 0, 0)") { background = candidate; break; }
      ancestor = ancestor.parentElement;
    }
    const luminance = (color: string) => {
      const rgb = color.match(/[\d.]+/g)!.slice(0, 3).map(Number).map((channel) => {
        const value = channel / 255;
        return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
      });
      return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
    };
    const foregroundLuminance = luminance(css.color);
    const backgroundLuminance = luminance(background);
    return {
      fontSize: parseFloat(css.fontSize),
      lineHeight: parseFloat(css.lineHeight),
      contrast: (Math.max(foregroundLuminance, backgroundLuminance) + 0.05) / (Math.min(foregroundLuminance, backgroundLuminance) + 0.05),
      bodyFontSize: parseFloat(getComputedStyle(document.body).fontSize)
    };
  });
  expect(style.bodyFontSize).toBeGreaterThanOrEqual(17);
  expect(style.fontSize).toBeGreaterThanOrEqual(19);
  expect(style.lineHeight / style.fontSize).toBeGreaterThanOrEqual(1.5);
  expect(style.contrast).toBeGreaterThanOrEqual(7);
  await page.getByRole("button", { name: "Leitura corrida", exact: true }).click();
  await expect(page.getByRole("button", { name: "Leitura corrida", exact: true })).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(".br-verses > li")).toHaveCount(34);
  await page.getByRole("button", { name: "Edição e fontes", exact: true }).click();
  await expect(source).toBeVisible();
  await expect(source).toContainText("Diego Santos");
  await expect(source).toContainText("Creative Commons Atribuição 3.0 Brasil");
  await expect(source).toContainText("deuterocanônicos");
  await expect(source.getByRole("link", { name: "Ler a licença completa", exact: true })).toHaveAttribute("href", "https://creativecommons.org/licenses/by/3.0/br/");
  await page.keyboard.press("Escape");
  await expect(source).not.toBeVisible();
  await expect(page.getByRole("button", { name: "Edição e fontes", exact: true })).toBeFocused();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

async function advanceToActivity(page: Page, activityId: string) {
  const activity = page.locator(`[data-activity-id="${activityId}"]`);
  for (let step = 0; step < 30; step++) {
    if (await activity.isVisible()) return activity;
    const reveal = page.getByRole("button", { name: "Acompanhar o próximo passo", exact: true });
    if (await reveal.isVisible()) await reveal.click();
    else await page.locator("[data-course-next]").click();
  }
  throw new Error(`O percurso não chegou à atividade ${activityId}.`);
}

async function putItemsInOrder(activity: Locator, desired: readonly string[]) {
  for (const [targetIndex, itemId] of desired.entries()) {
    for (let move = 0; move < desired.length; move++) {
      const current = await activity.locator("[data-order-item-id]").evaluateAll((items) => items.map((item) => item.getAttribute("data-order-item-id")));
      if (current.indexOf(itemId) === targetIndex) break;
      const up = activity.locator(`button[data-move-id="${itemId}"][data-direction="up"]`);
      await up.focus();
      await up.press("Enter");
    }
  }
  const result = await activity.locator("[data-order-item-id]").evaluateAll((items) => items.map((item) => item.getAttribute("data-order-item-id")));
  expect(result).toEqual(desired);
}

async function prepareActivity(activity: Locator) {
  const open = activity.getByRole("button", { name: "Estou pronto para conversar", exact: true });
  if (await open.isVisible()) await open.click();
}

async function answerActivity(activity: Locator, question: CourseActivity, correct: boolean) {
  if (question.kind === "choice") {
    const selected = correct ? question.correctOptionId : question.options.find((option) => option.id !== question.correctOptionId)!.id;
    await activity.locator(`input[value="${selected}"]`).check();
  } else if (question.kind === "classify") {
    for (const item of question.items) {
      const selected = correct ? item.categoryId : question.categories.find((category) => category.id !== item.categoryId)!.id;
      await activity.locator(`select[data-classify-item-id="${item.id}"]`).selectOption(selected);
    }
  } else {
    const desired = [...question.correctOrder];
    if (!correct) [desired[0], desired[1]] = [desired[1], desired[0]];
    await putItemsInOrder(activity, desired);
  }
  await activity.getByRole("button", { name: "Vamos conferir juntos", exact: true }).click();
}

test("novo estudo ensina em etapas e combina escolha, classificação e ordenação com correção", async ({ page, isMobile }) => {
  test.setTimeout(90000);
  const lesson = additionalLessons.find((item) => item.id === "panorama-biblico");
  if (!lesson) throw new Error("O bloco introdutório precisa conter a aula Panorama Bíblico.");
  expect(lesson.activities.map((activity) => activity.kind).sort()).toEqual(["choice", "classify", "order"]);
  const writes: string[] = [];
  page.on("request", (request) => {
    if (request.method() === "POST" && new URL(request.url()).pathname === "/api/study-progress") writes.push(request.method());
  });
  await page.goto(`/aprender/${lesson.id}`);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(lesson.title);
  await expect(page.locator("[data-study-purpose]")).toContainText("Ao terminar, você terá praticado");
  await expect(page.locator("[data-study-evidence], [data-study-keepsake]")).toHaveCount(0);
  await page.locator('.cl-topline a[href="/aprender"]').click();
  await expect(page.locator("[data-guided-lessons-completed]")).toHaveCount(0);
  await page.locator(`[data-sanctuary-lesson="${lesson.id}"] .ls-direct-lesson`).click();
  await page.getByRole("button", { name: "Vamos abrir a Palavra", exact: true }).click();
  for (const question of lesson.activities) {
    const activity = await advanceToActivity(page, question.id);
    await prepareActivity(activity);
    if (question.kind !== "classify") {
      await answerActivity(activity, question, false);
      await expect(activity.getByRole("heading", { name: "Vamos reler com calma.", exact: true })).toBeVisible();
      await activity.getByRole("button", { name: "Olhar outra vez", exact: true }).click();
    }
    await answerActivity(activity, question, true);
    await expect(activity.getByRole("heading", { name: "Vamos guardar esse cuidado.", exact: true })).toBeVisible();
    await activity.locator("[data-course-next]").click();
  }
  for (let step = 0; step < 8 && !(await page.getByRole("heading", { name: "A leitura continua na vida.", exact: true }).isVisible()); step++) {
    await page.locator("[data-course-next]").click();
  }
  await expect(page.getByRole("heading", { name: "A leitura continua na vida.", exact: true })).toBeVisible();
  await expect(page.locator("[data-study-evidence] li")).toHaveCount(3);
  await expect(page.locator('[data-study-evidence] [data-evidence-status="independent"]')).toHaveCount(1);
  await expect(page.locator('[data-study-evidence] [data-evidence-status="supported"]')).toHaveCount(2);
  await expect(page.locator("[data-study-keepsake]")).toBeVisible();
  const learningPath = page.locator("details.cl-learning-path");
  await expect(learningPath).not.toHaveAttribute("open", "");
  await learningPath.getByText("Meu caminho neste estudo", { exact: true }).click();
  const result = (label: string) => page.locator(".cl-results > div")
    .filter({ has: page.getByText(label, { exact: true }) }).locator("dd");
  await expect(result("Primeira tentativa sem ajuda")).toHaveText("1 / 3");
  await expect(result("Corrigidas ou com apoio")).toHaveText("2");
  const resultsBeforeCelebration = await page.locator(".cl-results").innerText();
  await page.getByRole("button", { name: "Celebrar este encontro", exact: true }).click();
  await expect(page.getByRole("button", { name: "Encontro celebrado com carinho", exact: true })).toBeDisabled();
  await expect(page.locator(".study-celebration-message"))
    .toHaveText("Que o cuidado desta leitura acompanhe seus passos.");
  await expect(page.locator(".cl-results")).toHaveText(resultsBeforeCelebration, { useInnerText: true });
  expect(writes).toEqual([]);
  expect(await page.evaluate(() => ({ local: Object.keys(localStorage), session: Object.keys(sessionStorage) }))).toEqual({ local: [], session: [] });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.locator('.cl-topline a[href="/aprender"]').click();
  await expect(page.locator("[data-guided-lessons-completed]")).toHaveAttribute("data-guided-lessons-completed", "1");
  await expect(page.locator(`[data-sanctuary-lesson="${lesson.id}"] .ls-lesson-practiced`)).toBeVisible();
  await expect(page.locator('[data-sanctuary-lesson="primeiros-passos"] .ls-lesson-practiced')).toHaveCount(0);
  const navigation = page.getByRole("navigation", { name: isMobile ? "Navegação no celular" : "Navegação principal", exact: true });
  await navigation.getByRole("link", { name: "Meu percurso", exact: true }).click();
  await expect(page.locator("[data-world-avatar]")).toHaveAttribute("data-avatar-lessons", "1");
  await expect(page.locator("[data-world-avatar]")).toHaveAttribute("data-avatar-practices", "0");
  await page.locator("details.fw-marks > summary").click();
  await expect(page.locator("details.fw-marks")).toContainText("Uma luz para o caminho");
  await page.reload();
  await expect(page.locator("[data-world-avatar]")).toHaveAttribute("data-avatar-lessons", "0");
  await navigation.getByRole("link", { name: "Aprender", exact: true }).click();
  await expect(page.locator("[data-guided-lessons-completed]")).toHaveCount(0);
  await page.locator(`[data-sanctuary-lesson="${lesson.id}"] .ls-direct-lesson`).click();
  await expect(page.getByRole("button", { name: "Vamos abrir a Palavra", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "A leitura continua na vida.", exact: true })).toHaveCount(0);
});
