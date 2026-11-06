import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";

const source = readFileSync(new URL("../../src/components/games3d/engine/navigation.ts", import.meta.url), "utf8");
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
const loaded = { exports: {} };
new Function("module", "exports", compiled)(loaded, loaded.exports);
const { createInnWalls, isPositionBlocked, moveWithCollisions, createTrailFollower } = loaded.exports;
const bounds = { minX: -42, maxX: 42, minZ: -85, maxZ: 85 };
const inn = { minX: -2, maxX: 14, minZ: -69, maxZ: -53 };
const walls = createInnWalls(inn);
const radius = .43;
const close = (actual, expected) => assert.ok(Math.abs(actual - expected) < 1e-7, `${actual} ≈ ${expected}`);

test("the inn has solid walls and a genuinely traversable front doorway", () => {
  assert.equal(isPositionBlocked({ x: 5, z: -53 }, radius, bounds, walls), false);
  assert.equal(isPositionBlocked({ x: 1, z: -53 }, radius, bounds, walls), true);
  assert.equal(isPositionBlocked({ x: -2, z: -61 }, radius, bounds, walls), true);
  assert.equal(isPositionBlocked({ x: 8, z: -69 }, radius, bounds, walls), true);
  assert.equal(isPositionBlocked({ x: 8, z: -61 }, radius, bounds, walls), false);
  const entered = moveWithCollisions({ x: 5, z: -50 }, { x: 0, z: -8 }, radius, bounds, walls);
  close(entered.x, 5); close(entered.z, -58);
  const returned = moveWithCollisions(entered, { x: 0, z: 8 }, radius, bounds, walls);
  close(returned.z, -50);
});

test("a long movement cannot tunnel through masonry or a circle obstacle", () => {
  const stopped = moveWithCollisions({ x: 1, z: -50 }, { x: 0, z: -15 }, radius, bounds, walls);
  assert.ok(stopped.z >= -53 + radius);
  const rock = [{ x: 0, z: 0, radius: 1 }];
  const beforeRock = moveWithCollisions({ x: 0, z: 5 }, { x: 0, z: -10 }, radius, bounds, [], rock);
  assert.ok(beforeRock.z >= 1 + radius);
  assert.equal(isPositionBlocked(beforeRock, radius, bounds, [], rock), false);
});

test("diagonal input slides along a wall and world boundaries remain solid", () => {
  const wall = [{ minX: 0, maxX: 1, minZ: -5, maxZ: 5 }];
  const moved = moveWithCollisions({ x: -1, z: 0 }, { x: 2, z: -2 }, radius, bounds, wall);
  assert.ok(moved.x <= -radius); close(moved.z, -2);
  const edge = moveWithCollisions({ x: 41, z: 0 }, { x: 4, z: 2 }, radius, bounds);
  assert.ok(edge.x <= bounds.maxX - radius); close(edge.z, 2);
  assert.equal(isPositionBlocked({ x: NaN, z: 0 }, radius, bounds), true);
  assert.deepEqual(moveWithCollisions({ x: 1, z: 2 }, { x: Infinity, z: 0 }, radius, bounds), { x: 1, z: 2 });
});

test("the companion follows a corner in the player's trail instead of cutting across it", () => {
  const follower = createTrailFollower({ x: -2, z: 2 }, 1);
  assert.deepEqual(follower.update({ x: -2, z: 0 }), { x: -2, z: 1 });
  assert.deepEqual(follower.update({ x: -1.5, z: 0 }), { x: -2, z: .5 });
  assert.deepEqual(follower.update({ x: -1, z: 0 }), { x: -2, z: 0 });
  assert.deepEqual(follower.update({ x: -.5, z: 0 }), { x: -1.5, z: 0 });
  assert.deepEqual(follower.update({ x: 0, z: 0 }), { x: -1, z: 0 });
});

test("the companion can follow through the actual doorway while staying clear of the walls", () => {
  const follower = createTrailFollower({ x: 5, z: -48 }, 1.8);
  const route = [];
  for (let z = -48; z >= -58; z -= .2) route.push({ x: 5, z });
  for (let x = 5; x <= 8; x += .2) route.push({ x, z: -58 });
  for (const point of route) assert.equal(isPositionBlocked(follower.update(point), .35, bounds, walls), false);
  assert.ok(follower.getPosition().z < -56, "The animal actually enters instead of remaining outside");
});

test("the trail stays bounded and reset/disposal do not retain another journey", () => {
  const follower = createTrailFollower({ x: 0, z: 0 });
  for (let i = 0; i < 20000; i++) follower.update({ x: Math.sin(i * .03) * 2, z: -i * .01 });
  assert.ok(follower.getRetainedPointCount() < 365);
  follower.reset({ x: 2, z: 28 });
  assert.deepEqual(follower.getPosition(), { x: 2, z: 28 });
  assert.equal(follower.getRetainedPointCount(), 1);
  assert.deepEqual(follower.update({ x: NaN, z: 0 }), { x: 2, z: 28 });
  assert.deepEqual(follower.update({ x: 2, z: -60 }), { x: 2, z: 28 }, "A discontinuity does not teleport the animal through the world");
  const other = createTrailFollower({ x: 9, z: 9 });
  follower.dispose(); follower.dispose();
  assert.equal(follower.getRetainedPointCount(), 0);
  assert.deepEqual(follower.update({ x: 20, z: 20 }), { x: 2, z: 28 });
  assert.deepEqual(other.getPosition(), { x: 9, z: 9 });
});
