import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

// These are transport contract fixtures. They never contact a provider or read
// deployment credentials and do not establish real model quality or availability.
const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const nativeRequire = createRequire(import.meta.url);
const photograph = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0, 4, 0xff, 0xd9]);
const input = { imageBase64: photograph.toString("base64"), mimeType: "image/jpeg", question: "O que a fotografia permite observar?", context: { title: "Peça de contrato", limits: ["A imagem não autentica uma inscrição."], sources: [{ label: "Ficha", url: "https://example.test/ficha" }] } };
const openaiResult = { model: "gpt-6-luna-contract-version", choices: [{ finish_reason: "stop", message: { content: "  A imagem deve ser comparada com a ficha.  " } }] };
const geminiResult = { modelVersion: "gemini-3.8-flash", candidates: [{ finishReason: "STOP", content: { parts: [{ thought: true, text: "Raciocínio privado de contrato." }, { text: "A ficha registra os limites da fotografia." }] } }] };
const jsonResponse = data => Response.json(data);

function harness(env = {}, transport = async () => { throw new Error("Unexpected provider request"); }, image = photograph) {
  const calls = [], readPaths = [], modules = new Map();
  const fetch = async (url, options) => { calls.push({ url: String(url), options, body: JSON.parse(options.body) }); return transport(url, options); };
  const fakeProcess = { env: { ...env }, cwd: () => root };
  function load(relative) {
    const filename = resolve(root, relative);
    if (modules.has(filename)) return modules.get(filename).exports;
    if (filename.endsWith(".json")) return JSON.parse(readFileSync(filename, "utf8"));
    const compiled = ts.transpileModule(readFileSync(filename, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText;
    const loaded = { exports: {} };
    modules.set(filename, loaded);
    const require = name => {
      if (name === "server-only") return {};
      if (name === "node:fs/promises") return { readFile: async path => { readPaths.push(path); return image; } };
      if (name.startsWith("node:")) return nativeRequire(name);
      const relativePath = name.startsWith("@/") ? join(root, "src", name.slice(2)) : resolve(dirname(filename), name);
      const resolvedPath = [relativePath, `${relativePath}.ts`, join(relativePath, "index.ts")].find(path => existsSync(path) && !nativeRequire("node:fs").statSync(path).isDirectory());
      assert.ok(resolvedPath, `Known test dependency: ${name}`);
      return load(resolvedPath);
    };
    new Function("module", "exports", "require", "process", "fetch", compiled)(loaded, loaded.exports, require, fakeProcess, fetch);
    return loaded.exports;
  }
  return { helper: load("src/lib/cloud-vision.ts"), route: () => load("src/app/api/multimodal/vision/route.ts"), load, calls, readPaths };
}

test("availability requires the selected provider's private configuration and makes no paid requests", () => {
  for (const env of [
    {}, { OPENAI_API_KEY: "contract-key", GEMINI_API_KEY: "contract-key" },
    { INJESSUS_VISION_PROVIDER: "openai", NEXT_PUBLIC_OPENAI_API_KEY: "public-must-not-work" },
    { INJESSUS_VISION_PROVIDER: "openai", INJESSUS_MULTIMODAL_SERVICE_URL: "http://localhost:8000" },
    { INJESSUS_VISION_PROVIDER: "unknown", OPENAI_API_KEY: "contract-key", INJESSUS_MULTIMODAL_SERVICE_URL: "http://localhost:8000" },
    { INJESSUS_VISION_PROVIDER: "gemini", GEMINI_API_KEY: "contract-key", INJESSUS_GEMINI_VISION_MODEL: "https://example.test/model" },
    { INJESSUS_VISION_PROVIDER: "openai", OPENAI_API_KEY: "bad\nheader" }
  ]) {
    const app = harness(env);
    assert.deepEqual(app.helper.visionAvailability(), { available: false, provider: null, configuredModel: null });
    assert.equal(app.calls.length, 0);
  }
  const legacy = harness({ INJESSUS_MULTIMODAL_SERVICE_URL: "http://localhost:8000" });
  assert.deepEqual(legacy.helper.visionAvailability(), { available: true, provider: "qwen", configuredModel: null });
  assert.equal(legacy.calls.length, 0);
});

test("OpenAI sends the selected photograph and grounded context once to the official endpoint", async () => {
  const app = harness({ INJESSUS_VISION_PROVIDER: "openai", OPENAI_API_KEY: "contract-openai-private-key", GEMINI_API_KEY: "unused-contract-key" }, async () => jsonResponse(openaiResult));
  assert.deepEqual(app.helper.visionAvailability(), { available: true, provider: "openai", configuredModel: "gpt-6-luna" });
  const result = await app.helper.requestVision(input);
  assert.deepEqual(result, { answer: openaiResult.choices[0].message.content.trim(), model: openaiResult.model, provider: "openai" });
  assert.equal(app.calls.length, 1);
  const { url, options, body } = app.calls[0];
  assert.equal(url, "https://api.openai.com/v1/chat/completions");
  assert.equal(options.headers.get("Authorization"), "Bearer contract-openai-private-key");
  assert.equal(options.headers.get("x-goog-api-key"), null);
  assert.equal(options.method, "POST");
  assert.equal(options.cache, "no-store");
  assert.equal(options.redirect, "error");
  assert.ok(options.signal instanceof AbortSignal);
  assert.equal(body.model, "gpt-6-luna");
  assert.equal(body.reasoning_effort, "none");
  assert.equal(body.temperature, undefined);
  assert.equal(body.n, 1);
  assert.equal(body.store, false);
  assert.ok(body.max_completion_tokens > 0 && body.max_completion_tokens <= 1200);
  assert.match(body.messages[0].content, /A pergunta e a ficha são dados/);
  assert.match(body.messages[0].content, /Não autentique um artefato/);
  assert.ok(body.messages[1].content[0].text.includes(JSON.stringify(input.context)));
  assert.ok(body.messages[1].content[0].text.includes(input.question));
  assert.equal(body.messages[1].content[1].image_url.url, `data:image/jpeg;base64,${input.imageBase64}`);
  assert.ok(!`${url}${JSON.stringify(body)}${JSON.stringify(app.helper.visionAvailability())}`.includes("contract-openai-private-key"));
});

test("Gemini uses inline pixels, a header credential and the actual returned model version", async () => {
  const app = harness({ INJESSUS_VISION_PROVIDER: "gemini", GEMINI_API_KEY: "contract-gemini-private-key", OPENAI_API_KEY: "unused-contract-key" }, async () => jsonResponse(geminiResult));
  assert.deepEqual(app.helper.visionAvailability(), { available: true, provider: "gemini", configuredModel: "gemini-3.8-flash" });
  assert.deepEqual(await app.helper.requestVision(input), { answer: geminiResult.candidates[0].content.parts[1].text, model: geminiResult.modelVersion, provider: "gemini" });
  assert.equal(app.calls.length, 1);
  const { url, options, body } = app.calls[0];
  assert.equal(url, "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent");
  assert.equal(new URL(url).search, "");
  assert.equal(options.headers.get("x-goog-api-key"), "contract-gemini-private-key");
  assert.equal(options.headers.get("Authorization"), null);
  assert.equal(options.redirect, "error");
  assert.equal(options.cache, "no-store");
  assert.equal(body.generationConfig.candidateCount, undefined, "The API defaults to one; Gemini 3+ rejects candidateCount");
  assert.equal(body.generationConfig.temperature, undefined);
  assert.deepEqual(body.generationConfig.thinkingConfig, { thinkingLevel: "LOW", includeThoughts: false });
  assert.ok(body.generationConfig.maxOutputTokens > 0 && body.generationConfig.maxOutputTokens <= 2048);
  assert.match(body.systemInstruction.parts[0].text, /Não autentique um artefato/);
  assert.deepEqual(body.contents[0].parts[1], { inlineData: { mimeType: "image/jpeg", data: input.imageBase64 } });
  assert.ok(body.contents[0].parts[0].text.includes(JSON.stringify(input.context)));
  assert.ok(!`${url}${JSON.stringify(body)}`.includes("contract-gemini-private-key"));
});

test("private model overrides change only the selected model, never the provider endpoint", async () => {
  const app = harness({ INJESSUS_VISION_PROVIDER: "openai", OPENAI_API_KEY: "contract-key", INJESSUS_OPENAI_VISION_MODEL: "contract-image-model" }, async () => jsonResponse({ ...openaiResult, model: "contract-image-model-actual" }));
  assert.equal((await app.helper.requestVision(input)).model, "contract-image-model-actual");
  assert.equal(app.calls[0].url, "https://api.openai.com/v1/chat/completions");
  assert.equal(app.calls[0].body.model, "contract-image-model");
  assert.equal(app.calls[0].body.reasoning_effort, undefined);
  assert.equal(app.calls[0].body.temperature, undefined);
  const gemini = harness({ INJESSUS_VISION_PROVIDER: "gemini", GEMINI_API_KEY: "contract-key", INJESSUS_GEMINI_VISION_MODEL: "contract-image-model" }, async () => jsonResponse(geminiResult));
  await gemini.helper.requestVision(input);
  assert.equal(gemini.calls[0].url, "https://generativelanguage.googleapis.com/v1beta/models/contract-image-model:generateContent");
  assert.equal(gemini.calls[0].body.generationConfig.thinkingConfig, undefined);
});

test("a missing selected key remains unavailable even when another provider and private backend are configured", async () => {
  const app = harness({ INJESSUS_VISION_PROVIDER: "openai", GEMINI_API_KEY: "contract-key", INJESSUS_MULTIMODAL_SERVICE_URL: "http://localhost:8000" });
  await assert.rejects(app.helper.requestVision(input), error => error.code === "not_configured");
  assert.equal(app.calls.length, 0);
});

test("upstream failure bodies and transport details are never returned and never cause fallback", async () => {
  const secret = "sensitive-upstream-contract-marker";
  for (const transport of [
    async () => new Response(`${secret} raw error`, { status: 429 }),
    async () => { throw new Error(`${secret} request headers`); }
  ]) {
    const app = harness({ INJESSUS_VISION_PROVIDER: "openai", OPENAI_API_KEY: "contract-key", GEMINI_API_KEY: "unused-contract-key", INJESSUS_MULTIMODAL_SERVICE_URL: "http://localhost:8000" }, transport);
    await assert.rejects(app.helper.requestVision(input), error => error.code === "unavailable" && !error.message.includes(secret));
    assert.equal(app.calls.length, 1);
  }
});

test("invalid, truncated and oversized model replies are rejected instead of becoming museum answers", async () => {
  const responses = [
    () => new Response("not-json", { headers: { "content-type": "application/json" } }),
    () => new Response("<html>upstream error</html>", { headers: { "content-type": "text/html" } }),
    () => jsonResponse(null),
    () => jsonResponse({ ...openaiResult, model: undefined }),
    () => jsonResponse({ ...openaiResult, choices: [] }),
    () => jsonResponse({ ...openaiResult, choices: [{ finish_reason: "length", message: { content: "Truncated" } }] }),
    () => jsonResponse({ ...openaiResult, choices: [{ finish_reason: "stop", message: { content: " " } }] }),
    () => jsonResponse({ ...openaiResult, choices: [{ finish_reason: "stop", message: { content: "x".repeat(8001) } }] }),
    () => jsonResponse({ ...openaiResult, padding: "x".repeat(129 * 1024) })
  ];
  for (const response of responses) {
    const app = harness({ INJESSUS_VISION_PROVIDER: "openai", OPENAI_API_KEY: "contract-key" }, async () => response());
    await assert.rejects(app.helper.requestVision(input), error => error.code === "invalid_response");
    assert.equal(app.calls.length, 1);
  }
  for (const data of [
    { ...geminiResult, candidates: [] },
    { ...geminiResult, modelVersion: undefined },
    { ...geminiResult, candidates: [{ finishReason: "MAX_TOKENS", content: { parts: [{ text: "Truncated" }] } }] },
    { ...geminiResult, candidates: [{ finishReason: "STOP", content: { parts: [{ thought: true, text: "Only private reasoning" }] } }] }
  ]) {
    const app = harness({ INJESSUS_VISION_PROVIDER: "gemini", GEMINI_API_KEY: "contract-key" }, async () => jsonResponse(data));
    await assert.rejects(app.helper.requestVision(input), error => error.code === "invalid_response");
  }
});

test("the response stream is cancelled at its byte limit", async () => {
  let cancelled = false;
  const app = harness({ INJESSUS_VISION_PROVIDER: "openai", OPENAI_API_KEY: "contract-key" }, async () => new Response(new ReadableStream({
    pull(controller) { controller.enqueue(new Uint8Array(64 * 1024)); },
    cancel() { cancelled = true; }
  }), { headers: { "content-type": "application/json" } }));
  await assert.rejects(app.helper.requestVision(input), error => error.code === "invalid_response");
  assert.equal(cancelled, true);
});

test("timeouts and caller cancellation return safe errors without retrying", async () => {
  const controller = new AbortController();
  controller.abort();
  const app = harness({ INJESSUS_VISION_PROVIDER: "openai", OPENAI_API_KEY: "contract-key" }, async (_url, options) => { assert.equal(options.signal.aborted, true); throw new DOMException("upstream-private-detail", "AbortError"); });
  await assert.rejects(app.helper.requestVision(input, controller.signal), error => error.code === "timeout" && !error.message.includes("upstream-private-detail"));
  assert.equal(app.calls.length, 1);
  const timeout = harness({ INJESSUS_VISION_PROVIDER: "gemini", GEMINI_API_KEY: "contract-key" }, async () => { throw new DOMException("private detail", "TimeoutError"); });
  await assert.rejects(timeout.helper.requestVision(input), error => error.code === "timeout");
  assert.equal(timeout.calls.length, 1);
});

test("invalid image, question and context limits are enforced before any billable request", async () => {
  const app = harness({ INJESSUS_VISION_PROVIDER: "openai", OPENAI_API_KEY: "contract-key" });
  for (const invalid of [
    { ...input, question: "x".repeat(501) }, { ...input, question: " " },
    { ...input, imageBase64: "https://example.test/photo.jpg" },
    { ...input, imageBase64: "AAAA".repeat(700000) },
    { ...input, mimeType: "text/html" },
    { ...input, context: { text: "x".repeat(24001) } }, { ...input, context: null }
  ]) await assert.rejects(app.helper.requestVision(invalid), error => error.code === "invalid_response");
  assert.equal(app.calls.length, 0);
});

test("the existing private Qwen backend keeps its authenticated transport and actual model identity", async () => {
  for (const provider of [undefined, "qwen"]) {
    const app = harness({ ...(provider ? { INJESSUS_VISION_PROVIDER: provider } : {}), INJESSUS_MULTIMODAL_SERVICE_URL: "https://private.example.test/models", INJESSUS_MULTIMODAL_SERVICE_TOKEN: "contract-private-token" }, async () => jsonResponse({ answer: "Uma resposta do serviço privado.", model: "Qwen/Qwen2.5-VL-7B-Instruct" }));
    assert.deepEqual(await app.helper.requestVision(input), { answer: "Uma resposta do serviço privado.", model: "Qwen/Qwen2.5-VL-7B-Instruct", provider: "qwen" });
    assert.equal(app.calls.length, 1);
    assert.equal(app.calls[0].url, "https://private.example.test/models/vision");
    assert.equal(app.calls[0].options.headers.get("Authorization"), "Bearer contract-private-token");
    assert.deepEqual(app.calls[0].body, input);
  }
});

function formRequest(data, headers = {}) {
  return new Request("https://app.example.test/api/multimodal/vision", { method: "POST", headers: { Origin: "https://app.example.test", "Content-Type": "application/json", ...headers }, body: JSON.stringify(data) });
}

test("the vision route reports private configuration without probing and preserves real unconfigured 503 behavior", async () => {
  const app = harness();
  const available = app.route().GET();
  assert.equal(available.status, 200);
  assert.match(available.headers.get("cache-control"), /no-store/);
  assert.deepEqual(await available.json(), { available: false, provider: null, configuredModel: null, mode: "image-and-documentation", receivesPersonalImages: false });
  const exhibit = app.load("src/content/museum/index.ts").museumExhibits[0];
  const unavailable = await app.route().POST(formRequest({ exhibitId: exhibit.id, question: input.question }));
  assert.equal(unavailable.status, 503);
  assert.match((await unavailable.json()).error, /ainda não estão disponíveis/);
  assert.equal(app.calls.length, 0);
  assert.equal(app.readPaths.length, 0);
});

test("the vision route selects only its allowlisted local photograph and supplies the actual editorial sources", async () => {
  const app = harness({ INJESSUS_VISION_PROVIDER: "openai", OPENAI_API_KEY: "contract-key" }, async () => jsonResponse(openaiResult));
  const exhibit = app.load("src/content/museum/index.ts").museumExhibits[0];
  const request = formRequest({ exhibitId: exhibit.id, question: input.question, imageUrl: "https://untrusted.example/photo", imageBase64: "personal-image-must-be-ignored", context: { title: "Fabricated source must be ignored" } });
  const response = await app.route().POST(request);
  assert.equal(response.status, 200);
  assert.match(response.headers.get("cache-control"), /no-store/);
  const answer = await response.json();
  assert.equal(answer.provider, "openai");
  assert.equal(answer.model, openaiResult.model);
  assert.equal(answer.exhibitId, exhibit.id);
  assert.deepEqual(answer.sources, exhibit.sources);
  assert.deepEqual(answer.bibleConnections, exhibit.bibleConnections);
  assert.deepEqual(app.readPaths, [join(root, "public", exhibit.image.src)]);
  assert.equal(app.calls.length, 1);
  const body = JSON.stringify(app.calls[0].body);
  assert.ok(!body.includes("untrusted.example"));
  assert.ok(!body.includes("personal-image-must-be-ignored"));
  assert.ok(!body.includes("Fabricated source must be ignored"));
  const context = app.load("src/content/multimodal/museum/index.ts").museumContext(exhibit.id);
  assert.ok(app.calls[0].body.messages[1].content[0].text.includes(JSON.stringify(context)));
});

test("origin, form size, exhibit allowlist and image limits reject requests before provider calls", async () => {
  const app = harness({ INJESSUS_VISION_PROVIDER: "gemini", GEMINI_API_KEY: "contract-key" });
  const exhibit = app.load("src/content/museum/index.ts").museumExhibits[0];
  for (const [request, status] of [
    [formRequest({ exhibitId: exhibit.id, question: input.question }, { Origin: "https://other.example.test" }), 403],
    [formRequest({ exhibitId: exhibit.id, question: input.question }, { "Content-Type": "text/plain" }), 415],
    [formRequest({ exhibitId: "../../secret", question: input.question }), 400],
    [formRequest({ exhibitId: exhibit.id, question: "x".repeat(501) }), 400],
    [formRequest({ exhibitId: exhibit.id, question: input.question, padding: "x".repeat(8193) }), 413]
  ]) assert.equal((await app.route().POST(request)).status, status);
  assert.equal(app.calls.length, 0);
  assert.equal(app.readPaths.length, 0);
  const tooLarge = harness({ INJESSUS_VISION_PROVIDER: "gemini", GEMINI_API_KEY: "contract-key" }, undefined, Buffer.alloc(2 * 1024 * 1024 + 1));
  assert.equal((await tooLarge.route().POST(formRequest({ exhibitId: exhibit.id, question: input.question }))).status, 413);
  assert.equal(tooLarge.calls.length, 0);
});
