import assert from "node:assert/strict";
import { readFile, writeFile } from "node:fs/promises";

// StPageFlip 2.0.7 leaves its animation-frame loop running after destroy().
// Apply a small, explicit MIT-licensed maintenance patch to both distributions.
// npm still verifies the original package integrity before this postinstall step.
const root = new URL("../node_modules/page-flip/", import.meta.url);
const metadata = JSON.parse(await readFile(new URL("package.json", root), "utf8"));
assert.equal(metadata.version, "2.0.7", "Reassess the PageFlip cleanup patch when upgrading.");

const originalStart = "start(){this.update();const t=e=>{this.render(e),requestAnimationFrame(t)};requestAnimationFrame(t)}";
const patchedStart = "start(){this.stop();this.update();this.__injessusActive=true;const t=e=>{if(!this.__injessusActive)return;this.render(e);if(this.__injessusActive)this.__injessusFrame=requestAnimationFrame(t)};this.__injessusFrame=requestAnimationFrame(t)}stop(){this.__injessusActive=false;cancelAnimationFrame(this.__injessusFrame);this.animation=null}";
const originalDestroy = "destroy(){this.ui.destroy(),this.block.remove()}";
const patchedDestroy = "destroy(){this.render&&this.render.stop();this.ui&&this.ui.destroy();this.block.remove()}";

for (const file of ["dist/js/page-flip.browser.js", "dist/js/page-flip.module.js"]) {
  const path = new URL(file, root);
  let source = await readFile(path, "utf8");
  if (source.includes(patchedStart) && source.includes(patchedDestroy)) continue;
  assert.equal(source.split(originalStart).length, 2, `Unexpected render loop in ${file}`);
  assert.equal(source.split(originalDestroy).length, 2, `Unexpected destructor in ${file}`);
  source = source.replace(originalStart, patchedStart).replace(originalDestroy, patchedDestroy);
  await writeFile(path, source);
}
console.log("StPageFlip cleanup patch verified: destroy cancels its animation-frame loop.");
