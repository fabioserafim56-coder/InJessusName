"use client";

import { useEffect } from "react";

export function ServiceWorker() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    if (process.env.NODE_ENV !== "production") {
      const isOurWorker = (worker: ServiceWorker | null) =>
        worker?.scriptURL === new URL("/sw.js", window.location.origin).href;

      void (async () => {
        const registrations = await navigator.serviceWorker.getRegistrations();
        const controlledByOurWorker = isOurWorker(navigator.serviceWorker.controller);
        const removed = await Promise.all(registrations
          .filter((registration) => isOurWorker(registration.active)
            || isOurWorker(registration.waiting) || isOurWorker(registration.installing))
          .map((registration) => registration.unregister()));
        if ("caches" in window) {
          const keys = await caches.keys();
          await Promise.all(keys.filter((key) => key.startsWith("injessusname-public-"))
            .map((key) => caches.delete(key)));
        }
        if (controlledByOurWorker && removed.some(Boolean)) window.location.reload();
      })().catch(() => {
        // Uma falha na limpeza não impede o carregamento online.
      });
      return;
    }

    navigator.serviceWorker.register("/sw.js", { updateViaCache: "none" }).catch(() => {
      // O aplicativo online continua disponível se o navegador recusar o registro.
    });
  }, []);

  return null;
}
