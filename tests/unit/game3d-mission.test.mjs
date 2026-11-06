import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";

// Real editorial content and reducer, not renderer fixtures or replacement Bible text.
// These accepted coordinate events test the model. Browser tests exercise the physics.
const root = new URL("../../", import.meta.url);
const source = readFileSync(new URL("src/content/games3d/index.ts", root), "utf8");
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
const loaded = { exports: {} };
new Function("module", "exports", compiled)(loaded, loaded.exports);
const {
  createMissionState, missionReducer, getCurrentObjective, getAvailableInteraction,
  missionStages, careSteps, getCurrentCareStep, explorationLandmarks, getNearbyLandmark,
  missionIntroduction, missionReference, missionBibleLink, worldBounds, worldPoints,
  worldNavigationWaypoints, bridgeCrossingBounds, innFootprint, interactionRadius, minimumEscortDistance,
  distanceBetween, getWorldArea,
} = loaded.exports;
const corpus = JSON.parse(readFileSync(new URL("src/content/bible/blivre-tr-2018.json", root), "utf8"));
const luke = corpus.books.find(book => book.id === "LUK").chapters[9];

function walk(state, target, companion = false, step = .4) {
  const origin = state.position;
  const count = Math.max(1, Math.ceil(distanceBetween(origin, target) / step));
  for (let index = 1; index <= count; index++) {
    const position = { x: origin.x + (target.x - origin.x) * index / count, z: origin.z + (target.z - origin.z) * index / count };
    state = missionReducer(state, { type: "position", position });
    if (companion) state = missionReducer(state, { type: "companion-position", position: { x: position.x, z: position.z + 1.8 } });
  }
  return state;
}
function doObjective(state) {
  const objective = getCurrentObjective(state);
  if (objective.id === "acolhida") {
    state = walk(state, worldNavigationWaypoints.bridgeApproach, true);
    state = walk(state, worldNavigationWaypoints.bridgeExit, true);
    state = walk(state, worldNavigationWaypoints.innEntrance, true);
    state = walk(state, worldNavigationWaypoints.innInterior, true);
  }
  state = walk(state, worldPoints[objective.target], state.travelerAboard);
  assert.equal(getAvailableInteraction(state).available, true, objective.id);
  if (objective.id === "cuidado") {
    for (const step of careSteps) state = missionReducer(state, { type: "care", step: step.id });
    return state;
  }
  return missionReducer(state, { type: "interact", target: objective.target });
}
function readyToEscort() {
  let state = createMissionState();
  for (let index = 0; index < 4; index++) state = doObjective(state);
  return state;
}

test("main actions, care gestures and optional readings remain grounded in Luke's parable", () => {
  assert.equal(missionStages.length, 6);
  assert.equal(new Set(missionStages.map(stage => stage.id)).size, 6);
  assert.deepEqual(missionStages.map(stage => stage.number), [1, 2, 3, 4, 5, 6]);
  assert.deepEqual(missionStages.map(stage => stage.reference.start), [33, 34, 34, 34, 34, 35]);
  assert.equal(missionStages.at(-1).reference.end, 37);
  assert.equal(careSteps.length, 3);
  assert.equal(explorationLandmarks.length, 3);
  for (const reference of [missionReference, ...missionStages.map(stage => stage.reference), ...careSteps.map(step => step.reference), ...explorationLandmarks.map(landmark => landmark.reference)]) {
    assert.equal(reference.bookId, "LUK"); assert.equal(reference.chapter, 10);
    assert.ok(reference.start >= 25 && reference.end <= 37 && reference.end >= reference.start);
    for (let number = reference.start; number <= reference.end; number++) assert.ok(luke[number - 1].trim());
    const url = new URL(missionBibleLink(reference), "https://example.test");
    assert.equal(url.pathname, "/biblia"); assert.equal(url.searchParams.get("livro"), "LUK");
    assert.equal(url.searchParams.get("capitulo"), "10"); assert.equal(url.searchParams.get("versiculo"), String(reference.start));
    assert.equal(url.hash, `#versiculo-${reference.start}`);
  }
  assert.match(missionIntroduction.literaryContext, /parábola/);
  assert.match(missionIntroduction.adaptation, /ponte.*recursos do jogo/);
  assert.match(missionStages.find(stage => stage.id === "transporte").lesson, /Lucas não especifica sua espécie/);
  assert.match(careSteps.at(-1).instruction, /sequência visual.*jogo/);
  assert.match(luke[34], /no outro dia.*dois dinheiros/);
  assert.match(missionStages.at(-1).instruction, /No dia seguinte.*dois dinheiros/);
});

test("clicking from afar, selecting another target and repeating an action do not advance the mission", () => {
  let state = createMissionState();
  assert.equal(getAvailableInteraction(state).available, false);
  const afar = missionReducer(state, { type: "interact", target: "traveler" });
  assert.equal(afar.stage, "encontro"); assert.deepEqual(afar.completed, []);
  assert.equal(afar.feedback.kind, "guidance");
  state = walk(state, worldPoints.keeper);
  const wrong = missionReducer(state, { type: "interact", target: "keeper" });
  assert.equal(wrong.stage, "encontro"); assert.deepEqual(wrong.completed, []);
  state = doObjective(state);
  const duplicate = missionReducer(state, { type: "interact", target: "traveler" });
  assert.equal(duplicate.stage, "preparo"); assert.deepEqual(duplicate.completed, ["encontro"]);
  assert.equal(duplicate.inventory.careKit, false);
  assert.ok(distanceBetween(worldPoints.traveler, worldPoints.supplies) > interactionRadius);
});

test("care requires returning with resources and performing all three gestures in order, not an E-click", () => {
  let state = doObjective(doObjective(createMissionState()));
  assert.equal(state.stage, "cuidado"); assert.equal(state.inventory.careKit, true);
  assert.deepEqual(careSteps.map(step => step.resource), ["cloth", "oilWine", "bandage"]);
  assert.equal(getAvailableInteraction(state).available, false, "The bag must be carried back to the person");
  const distant = missionReducer(state, { type: "care", step: careSteps[0].id });
  assert.equal(distant.stage, "cuidado"); assert.deepEqual(distant.careCompleted, []);
  assert.equal(distant.inventory.cloth, true);
  state = walk(state, worldPoints.traveler);
  const clicked = missionReducer(state, { type: "interact", target: "traveler" });
  assert.equal(clicked.stage, "cuidado"); assert.deepEqual(clicked.careCompleted, []);
  const wrong = missionReducer(state, { type: "care", step: "faixas" });
  assert.deepEqual(wrong.careCompleted, []); assert.equal(wrong.inventory.bandage, true);
  const unavailable = { ...state, inventory: { ...state.inventory, cloth: false } };
  assert.equal(getAvailableInteraction(unavailable).available, false);
  assert.deepEqual(missionReducer(unavailable, { type: "care", step: "panos" }).careCompleted, []);
  for (const [index, step] of careSteps.entries()) {
    const previous = state;
    assert.equal(getCurrentCareStep(state).id, step.id);
    state = missionReducer(state, { type: "care", step: step.id });
    assert.equal(previous.inventory[step.resource], true, "Earlier states remain intact");
    assert.equal(state.inventory[step.resource], false);
    assert.equal(state.careCompleted.length, index + 1);
    if (index < 2) {
      assert.equal(state.stage, "cuidado"); assert.equal(state.travelerCared, false);
      const repeat = missionReducer(state, { type: "care", step: step.id });
      assert.deepEqual(repeat.careCompleted, state.careCompleted);
    }
  }
  assert.equal(state.stage, "transporte"); assert.equal(state.travelerCared, true);
  assert.equal(state.inventory.careKit, false); assert.equal(getCurrentCareStep(state), null);
  for (const step of careSteps) assert.equal(state.inventory[step.resource], false);
  assert.strictEqual(missionReducer(state, { type: "care", step: "faixas" }), state);
  const unassisted = { ...walk(state, worldPoints.donkey), travelerCared: false };
  assert.equal(getAvailableInteraction(unassisted).available, false);
  state = doObjective(state);
  assert.equal(state.stage, "acolhida"); assert.equal(state.travelerAboard, true);
  assert.deepEqual(state.companionPosition, worldPoints.donkey);
});

test("the renderer's companion position is required; player distance alone cannot cross the bridge", () => {
  const start = readyToEscort();
  assert.strictEqual(missionReducer(start, { type: "position", position: start.position }), start);
  assert.equal(start.bridgeEntered, false); assert.deepEqual(start.escortCheckpoints, []);
  let state = walk(start, worldNavigationWaypoints.bridgeApproach);
  state = walk(state, worldNavigationWaypoints.bridgeExit);
  state = walk(state, worldPoints.inn);
  assert.ok(state.escortDistance > minimumEscortDistance);
  assert.deepEqual(state.companionPosition, worldPoints.donkey, "Player events cannot move the animal through walls");
  assert.equal(state.bridgeEntered, false); assert.deepEqual(state.escortCheckpoints, []);
  state = missionReducer(state, { type: "companion-position", position: worldPoints.inn });
  assert.equal(getAvailableInteraction(state).available, false, "Arriving by a shortcut does not replace the accompanied crossing");
  assert.equal(missionReducer(state, { type: "interact", target: "inn" }).travelerDelivered, false);
});

test("both companions cross the bridge before arrival at the interior bed can complete welcome", () => {
  let state = readyToEscort();
  state = walk(state, worldNavigationWaypoints.bridgeApproach, true);
  assert.equal(state.bridgeEntered, true); assert.deepEqual(state.escortCheckpoints, []);
  assert.deepEqual(getAvailableInteraction(state).point, worldNavigationWaypoints.bridgeExit);
  state = walk(state, { x: 0, z: bridgeCrossingBounds.endZ }, true);
  assert.deepEqual(state.escortCheckpoints, [], "Player reaching the exit is insufficient while the animal is still on the bridge");
  const outsideCorridor = missionReducer({ ...state, position: { x: 8, z: -16 } }, { type: "companion-position", position: { x: 8, z: -14 } });
  assert.deepEqual(outsideCorridor.escortCheckpoints, [], "Both participants must cross in the bridge corridor");
  state = walk(state, worldNavigationWaypoints.bridgeExit, true);
  assert.deepEqual(state.escortCheckpoints, ["ponte"]);
  assert.deepEqual(getAvailableInteraction(state).point, worldPoints.inn);
  assert.match(state.feedback.text, /atravessaram juntos/);
  state = walk(state, worldNavigationWaypoints.innEntrance, true);
  assert.equal(getAvailableInteraction(state).available, false, "The front entrance is not the bed inside the inn");
  state = walk(state, worldNavigationWaypoints.innInterior, true);
  state = walk(state, worldPoints.inn, true);
  assert.ok(state.escortDistance >= minimumEscortDistance);
  assert.equal(getAvailableInteraction(state).available, true);
  assert.ok(state.position.z < innFootprint.maxZ);
  const absent = { ...state, companionPosition: worldPoints.innEntrance };
  assert.equal(getAvailableInteraction(absent).available, false);
  const tooShort = { ...state, escortDistance: 0 };
  assert.equal(getAvailableInteraction(tooShort).available, false);
  state = missionReducer(state, { type: "interact", target: "inn" });
  assert.equal(state.stage, "continuidade"); assert.equal(state.travelerDelivered, true);
  assert.equal(state.travelerAboard, false); assert.equal(state.companionPosition, null);
  assert.match(state.feedback.text, /dia seguinte/);
  assert.equal(state.inventory.coins, 2);
});

test("the journey ends after welcome and the next day's support, with exactly two dinheiros", () => {
  let state = doObjective(readyToEscort());
  const arrived = state;
  state = walk(state, worldPoints.keeper);
  const noSupport = { ...state, inventory: { ...state.inventory, coins: 0 } };
  assert.equal(getAvailableInteraction(noSupport).available, false);
  assert.equal(missionReducer(noSupport, { type: "interact" }).stage, "continuidade");
  const notWelcomed = { ...state, travelerDelivered: false };
  assert.equal(getAvailableInteraction(notWelcomed).available, false);
  state = missionReducer(state, { type: "interact", target: "keeper" });
  assert.equal(state.stage, "concluido"); assert.equal(state.completed.length, 6);
  assert.deepEqual(state.completed, missionStages.map(stage => stage.id));
  assert.equal(state.feedback.kind, "complete"); assert.equal(state.inventory.coins, 0);
  assert.equal(getAvailableInteraction(state), null); assert.equal(getCurrentObjective(state), null);
  assert.strictEqual(missionReducer(state, { type: "interact", target: "keeper" }), state);
  assert.equal(arrived.inventory.coins, 2);
});

test("three optional observations preserve their own readings without gating or scoring the mission", () => {
  let state = createMissionState();
  const first = explorationLandmarks[0];
  assert.strictEqual(missionReducer(state, { type: "inspect", landmark: first.id }), state);
  assert.equal(getNearbyLandmark(state), null);
  state = walk(state, first.point);
  assert.equal(getNearbyLandmark(state).id, first.id);
  state = missionReducer(state, { type: "inspect", landmark: first.id });
  assert.deepEqual(state.discoveries, [first.id]); assert.equal(state.stage, "encontro");
  assert.deepEqual(state.completed, []); assert.equal(state.inventory.coins, 2);
  assert.strictEqual(missionReducer(state, { type: "inspect", landmark: first.id }), state);
  assert.strictEqual(missionReducer(state, { type: "inspect", landmark: "inexistente" }), state);
  let finished = createMissionState();
  for (let index = 0; index < 6; index++) finished = doObjective(finished);
  assert.equal(finished.stage, "concluido"); assert.deepEqual(finished.discoveries, [], "Optional reading is never an obligation to win");
  const last = explorationLandmarks.at(-1);
  finished = walk(finished, last.point);
  finished = missionReducer(finished, { type: "inspect", landmark: last.id });
  assert.deepEqual(finished.discoveries, [last.id]); assert.equal(finished.stage, "concluido");
});

test("positions remain finite and bounded for both participants, and areas describe the enlarged world", () => {
  const original = createMissionState();
  for (const position of [{ x: NaN, z: 0 }, { x: 0, z: Infinity }, { x: -Infinity, z: 0 }]) assert.strictEqual(missionReducer(original, { type: "position", position }), original);
  const bounded = missionReducer(original, { type: "position", position: { x: 1000, z: -1000 } });
  assert.deepEqual(bounded.position, { x: worldBounds.maxX, z: worldBounds.minZ });
  assert.equal(bounded.stage, "encontro"); assert.deepEqual(bounded.completed, []);
  assert.strictEqual(missionReducer(original, { type: "companion-position", position: worldPoints.bridge }), original);
  const escort = readyToEscort();
  assert.strictEqual(missionReducer(escort, { type: "companion-position", position: { x: NaN, z: 0 } }), escort);
  const companionClamped = missionReducer(escort, { type: "companion-position", position: { x: 999, z: -999 } });
  assert.deepEqual(companionClamped.companionPosition, { x: worldBounds.maxX, z: worldBounds.minZ });
  assert.equal(getWorldArea(worldPoints.spawn), "Caminho de Jerusalém");
  assert.equal(getWorldArea(worldPoints.bridge), "Vale da travessia");
  assert.equal(getWorldArea(worldPoints.inn), "Casa de acolhimento");
  for (const point of [...Object.values(worldPoints), ...explorationLandmarks.map(landmark => landmark.point)]) {
    assert.ok(point.x >= worldBounds.minX && point.x <= worldBounds.maxX && point.z >= worldBounds.minZ && point.z <= worldBounds.maxZ);
  }
});

test("restart and independent visits clear resources, care gestures, crossings and discoveries", () => {
  let complete = createMissionState();
  for (let index = 0; index < 6; index++) complete = doObjective(complete);
  const clean = missionReducer(complete, { type: "restart" });
  assert.deepEqual(clean, createMissionState());
  assert.notStrictEqual(clean.inventory, createMissionState().inventory);
  assert.notStrictEqual(clean.position, createMissionState().position);
  assert.notStrictEqual(clean.careCompleted, createMissionState().careCompleted);
  assert.notStrictEqual(clean.escortCheckpoints, createMissionState().escortCheckpoints);
  assert.notStrictEqual(clean.discoveries, createMissionState().discoveries);
  const separate = createMissionState();
  assert.equal(separate.stage, "encontro"); assert.equal(separate.travelerDelivered, false);
  const feedback = missionReducer(separate, { type: "interact" });
  const cleared = missionReducer(feedback, { type: "clear-feedback" });
  assert.equal(cleared.feedback, null); assert.equal(cleared.stage, feedback.stage);
});
