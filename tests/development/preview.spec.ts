import { test, expect } from "@playwright/test";

test("a prévia de desenvolvimento pode renderizar dentro de um iframe", async ({ page, request, baseURL }) => {
  const response = await request.get("/");
  expect(response.status()).toBe(200);
  expect(response.headers()["x-frame-options"]).toBeUndefined();

  await page.setContent(`<iframe title="Prévia do InJessusName" src="${baseURL}/" width="1100" height="800"></iframe>`);
  const preview = page.frameLocator('iframe[title="Prévia do InJessusName"]');
  await expect(preview.getByRole("main").getByRole("heading", { level: 1 })).toBeVisible();
  await expect(preview.getByRole("link", { name: "Começar a primeira aula", exact: true })).toBeVisible();
});

test("o desenvolvimento remove o worker antigo do app e preserva caches e registros alheios", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await page.waitForLoadState("networkidle");

  await page.evaluate(async () => {
    // Outra identidade e outro escopo simulam uma instalação independente no mesmo origin.
    // Usamos o script real servido pelo app, sem mocks de APIs de Service Worker ou CacheStorage.
    const unrelated = await navigator.serviceWorker.register("/sw.js?fixture=other-app", {
      scope: "/other-app/",
      updateViaCache: "none"
    });
    if (!unrelated.active) {
      const worker = unrelated.installing || unrelated.waiting;
      if (!worker) throw new Error("O worker independente não iniciou a instalação.");
      await new Promise<void>((resolve, reject) => {
        const check = () => {
          if (worker.state === "activated") resolve();
          else if (worker.state === "redundant") reject(new Error("O worker independente falhou."));
        };
        worker.addEventListener("statechange", check);
        check();
      });
    }

    await navigator.serviceWorker.register("/sw.js", { updateViaCache: "none" });
    await navigator.serviceWorker.ready;
  });
  await page.waitForFunction(() =>
    navigator.serviceWorker.controller?.scriptURL === new URL("/sw.js", location.origin).href
  );

  await page.evaluate(async () => {
    const unrelated = await caches.open("other-app-preserve");
    await unrelated.put("/other-app/fixture", new Response("preservado"));
    const stale = await caches.open("injessusname-public-legacy-fixture");
    await stale.put("/legacy-fixture", new Response("cache antigo"));
  });
  expect(await page.evaluate(async () => (await caches.keys())
    .includes("injessusname-public-legacy-fixture"))).toBe(true);

  // A próxima montagem do app deve remover sua instalação anterior e recarregar a home.
  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(async () => {
    const state = await page.evaluate(async () => {
      const registrations = await navigator.serviceWorker.getRegistrations();
      const ownURL = new URL("/sw.js", location.origin).href;
      return {
        ownWorkers: registrations.filter((registration) =>
          [registration.active, registration.waiting, registration.installing]
            .some((worker) => worker?.scriptURL === ownURL)
        ).length,
        ownCaches: (await caches.keys()).filter((key) => key.startsWith("injessusname-public-")),
        controlledByOldWorker: navigator.serviceWorker.controller?.scriptURL === ownURL
      };
    });
    expect(state).toEqual({ ownWorkers: 0, ownCaches: [], controlledByOldWorker: false });
  }).toPass({ timeout: 10000 });

  await expect(page.getByRole("link", { name: "Começar a primeira aula", exact: true })).toBeVisible();
  const preserved = await page.evaluate(async () => ({
    content: await (await (await caches.open("other-app-preserve")).match("/other-app/fixture"))?.text(),
    unrelatedWorkers: (await navigator.serviceWorker.getRegistrations()).filter((registration) =>
      registration.scope === new URL("/other-app/", location.origin).href
    ).length
  }));
  expect(preserved).toEqual({ content: "preservado", unrelatedWorkers: 1 });
});
