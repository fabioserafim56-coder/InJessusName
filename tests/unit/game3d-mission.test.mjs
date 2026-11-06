import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";

// The real editorial reducer is compiled as-is. Movement physics is tested in
// the renderer/browser suite; these tests exercise mission order and evidence.
const root = new URL("../../", import.meta.url);
const source = readFileSync(new URL("src/content/games3d/index.ts", root), "utf8");
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
const loaded = { exports: {} };
new Function("module", "exports", compiled)(loaded, loaded.exports);
const { createMissionState, missionReducer, getCurrentObjective, getAvailableInteraction, missionStages, missionIntroduction, missionReference, missionBibleLink, worldBounds, worldPoints, interactionRadius, minimumEscortDistance, distanceBetween } = loaded.exports;
const corpus = JSON.parse(readFileSync(new URL("src/content/bible/blivre-tr-2018.json", root), "utf8"));
const luke = corpus.books.find(book => book.id === "LUK").chapters[9];

function walk(state, target, step = .4) {
  const origin = state.position;
  const count = Math.max(1, Math.ceil(distanceBetween(origin, target) / step));
  for (let index = 1; index <= count; index++) state = missionReducer(state, { type: "position", position: { x: origin.x + (target.x - origin.x) * index / count, z: origin.z + (target.z - origin.z) * index / count } });
  return state;
}
function doObjective(state) {
  const objective = getCurrentObjective(state);
  state = walk(state, worldPoints[objective.target]);
  assert.equal(getAvailableInteraction(state).available, true, objective.id);
  return missionReducer(state, { type: "interact", target: objective.target });
}
function readyToEscort() {
  let state = createMissionState();
  for (let index = 0; index < 4; index++) state = doObjective(state);
  return state;
}

test("six playable objectives stay inside Luke's parable and identify interpretation separately", () => {
  assert.equal(missionStages.length, 6);
  assert.equal(new Set(missionStages.map(stage => stage.id)).size, 6);
  assert.deepEqual(missionStages.map(stage => stage.number), [1, 2, 3, 4, 5, 6]);
  assert.deepEqual(missionStages.map(stage => stage.reference.start), [33, 34, 34, 34, 34, 35]);
  assert.equal(missionStages.at(-1).reference.end, 37);
  for (const reference of [missionReference, ...missionStages.map(stage => stage.reference)]) {
    assert.equal(reference.bookId, "LUK"); assert.equal(reference.chapter, 10);
    assert.ok(reference.start >= 25 && reference.end <= 37 && reference.end >= reference.start);
    for (let number = reference.start; number <= reference.end; number++) assert.ok(luke[number - 1].trim());
    const url = new URL(missionBibleLink(reference), "https://example.test");
    assert.equal(url.pathname, "/biblia"); assert.equal(url.searchParams.get("livro"), "LUK");
    assert.equal(url.searchParams.get("capitulo"), "10"); assert.equal(url.searchParams.get("versiculo"), String(reference.start));
    assert.equal(url.hash, `#versiculo-${reference.start}`);
  }
  assert.match(missionIntroduction.literaryContext, /parábola/);
  assert.match(missionIntroduction.adaptation, /recursos do jogo/);
  assert.match(missionStages.find(stage => stage.id === "transporte").lesson, /Lucas não especifica sua espécie/);
  assert.match(luke[34], /no outro dia.*dois dinheiros/);
  assert.match(missionStages.find(stage => stage.id === "continuidade").instruction, /No dia seguinte.*dois dinheiros/);
});

test("clicking from afar, selecting another target and repeated actions never complete an objective", () => {
  let state = createMissionState();
  assert.equal(getAvailableInteraction(state).available, false);
  const afar = missionReducer(state, { type: "interact", target: "traveler" });
  assert.equal(afar.stage, "encontro"); assert.deepEqual(afar.completed, []);
  assert.equal(afar.feedback.kind, "guidance");
  state = walk(state, worldPoints.keeper);
  const wrong = missionReducer(state, { type: "interact", target: "keeper" });
  assert.equal(wrong.stage, "encontro"); assert.deepEqual(wrong.completed, []);
  state = doObjective(state);
  assert.equal(state.stage, "preparo");
  const duplicate = missionReducer(state, { type: "interact", target: "traveler" });
  assert.equal(duplicate.stage, "preparo"); assert.deepEqual(duplicate.completed, ["encontro"]);
  assert.equal(duplicate.inventory.careKit, false);
  assert.ok(distanceBetween(worldPoints.traveler, worldPoints.supplies) > interactionRadius, "Collecting supplies requires movement to a different point");
});

test("the care kit must be picked up, carried back and used before the traveler can ride", () => {
  let state = doObjective(createMissionState());
  state = doObjective(state);
  assert.equal(state.stage, "cuidado"); assert.equal(state.inventory.careKit, true);
  assert.equal(getAvailableInteraction(state).available, false, "The player is still at the bag and must return to the person");
  const withoutKit = { ...walk(state, worldPoints.traveler), inventory: { ...state.inventory, careKit: false } };
  assert.equal(getAvailableInteraction(withoutKit).available, false);
  assert.equal(missionReducer(withoutKit, { type: "interact" }).stage, "cuidado");
  state = doObjective(state);
  assert.equal(state.stage, "transporte"); assert.equal(state.travelerCared, true); assert.equal(state.inventory.careKit, false);
  assert.equal(state.travelerAboard, false);
  const unassisted = { ...walk(state, worldPoints.donkey), travelerCared: false };
  assert.equal(getAvailableInteraction(unassisted).available, false);
  state = doObjective(state);
  assert.equal(state.stage, "acolhida"); assert.equal(state.travelerAboard, true);
  assert.deepEqual(state.companionPosition, worldPoints.donkey);
  assert.equal(state.travelerDelivered, false); assert.equal(state.escortDistance, 0);
});

test("escort follows actual accepted movement and requires the companion to reach the inn", () => {
  const start = readyToEscort();
  let state = missionReducer(start, { type: "position", position: start.position });
  assert.strictEqual(state, start, "Standing still does not generate distance");
  assert.equal(missionReducer(state, { type: "interact", target: "inn" }).stage, "acolhida");
  state = walk(state, { x: 5, z: -10 });
  assert.ok(state.escortDistance > 10); assert.ok(state.escortDistance < minimumEscortDistance);
  assert.ok(distanceBetween(state.position, state.companionPosition) <= 1.8000001);
  assert.equal(state.stage, "acolhida"); assert.equal(state.travelerDelivered, false);
  assert.equal(getAvailableInteraction(state).available, false);
  state = walk(state, worldPoints.inn);
  assert.ok(state.escortDistance >= minimumEscortDistance);
  assert.equal(getAvailableInteraction(state).available, true);
  const absentCompanion = { ...state, companionPosition: { ...worldPoints.donkey } };
  assert.equal(getAvailableInteraction(absentCompanion).available, false);
  assert.equal(missionReducer(absentCompanion, { type: "interact" }).travelerDelivered, false);
  const noJourney = { ...state, escortDistance: 0 };
  assert.equal(getAvailableInteraction(noJourney).available, false);
  state = missionReducer(state, { type: "interact", target: "inn" });
  assert.equal(state.stage, "continuidade"); assert.equal(state.travelerDelivered, true);
  assert.equal(state.travelerAboard, false); assert.equal(state.companionPosition, null);
  assert.match(state.feedback.text, /dia seguinte/);
  assert.equal(state.inventory.coins, 2, "Arrival alone does not spend the support for later care");
});

test("the journey concludes only after arrival and arranging the next day's continued care", () => {
  let state = readyToEscort();
  state = doObjective(state);
  const arrived = state;
  assert.equal(arrived.completed.length, 5); assert.equal(arrived.stage, "continuidade");
  state = walk(state, worldPoints.keeper);
  const noSupport = { ...state, inventory: { ...state.inventory, coins: 0 } };
  assert.equal(getAvailableInteraction(noSupport).available, false);
  assert.equal(missionReducer(noSupport, { type: "interact" }).stage, "continuidade");
  const notArrived = { ...state, travelerDelivered: false };
  assert.equal(getAvailableInteraction(notArrived).available, false);
  state = missionReducer(state, { type: "interact", target: "keeper" });
  assert.equal(state.stage, "concluido"); assert.equal(state.completed.length, 6);
  assert.deepEqual(state.completed, missionStages.map(stage => stage.id));
  assert.equal(state.feedback.kind, "complete"); assert.equal(state.inventory.coins, 0);
  assert.equal(getAvailableInteraction(state), null); assert.equal(getCurrentObjective(state), null);
  assert.strictEqual(missionReducer(state, { type: "interact", target: "keeper" }), state, "Repeated completion cannot duplicate progress or subtract resources");
  assert.equal(arrived.inventory.coins, 2, "Previous states are not mutated");
});

test("non-finite positions are rejected and finite coordinates remain in the small world", () => {
  const original = createMissionState();
  for (const position of [{ x: NaN, z: 0 }, { x: 0, z: Infinity }, { x: -Infinity, z: 0 }]) assert.strictEqual(missionReducer(original, { type: "position", position }), original);
  const bounded = missionReducer(original, { type: "position", position: { x: 1000, z: -1000 } });
  assert.deepEqual(bounded.position, { x: worldBounds.maxX, z: worldBounds.minZ });
  assert.deepEqual(original.position, worldPoints.spawn);
  assert.equal(bounded.stage, "encontro"); assert.deepEqual(bounded.completed, []);
});

test("restart and independent visits contain no shared progress or lingering inventory", () => {
  let complete = createMissionState();
  for (let index = 0; index < 6; index++) complete = doObjective(complete);
  const clean = missionReducer(complete, { type: "restart" });
  assert.deepEqual(clean, createMissionState());
  assert.notStrictEqual(clean.inventory, createMissionState().inventory);
  assert.notStrictEqual(clean.position, createMissionState().position);
  assert.notStrictEqual(clean.completed, createMissionState().completed);
  const separate = createMissionState();
  assert.equal(separate.stage, "encontro"); assert.equal(separate.travelerDelivered, false);
  const feedback = missionReducer(separate, { type: "interact" });
  const cleared = missionReducer(feedback, { type: "clear-feedback" });
  assert.equal(cleared.feedback, null); assert.equal(cleared.stage, feedback.stage);
  assert.deepEqual(cleared.completed, []);
});
