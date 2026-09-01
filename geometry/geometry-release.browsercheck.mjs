import { spawnSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const baseUrl = (process.env.GFIELD_BASE_URL || "http://127.0.0.1:8765").replace(/\/$/, "");
const checks = [
  "geometry/games/net-observatory/net-observatory.selftest.mjs",
  "geometry/games/dice-roll/dice-roll.selftest.mjs",
  "geometry/games/soma-cube/soma-cube.selftest.mjs",
  "geometry/games/geoboard/geoboard-content-audit.mjs",
  "geometry/games/geoboard/geoboard.selftest.mjs",
  "geometry/games/net-observatory/net-observatory.browsercheck.mjs",
  "geometry/games/dice-roll/dice-roll.browsercheck.mjs",
  "geometry/games/soma-cube/soma-cube.browsercheck.mjs",
  "geometry/games/geoboard/geoboard.browsercheck.mjs",
  "geometry/worksheet/net-observatory/net-observatory-sheet.browsercheck.mjs",
  "geometry/worksheet/dice-roll/dice-roll-sheet.browsercheck.mjs",
  "geometry/worksheet/geoboard/geoboard-sheet.browsercheck.mjs"
];

for (const check of checks) {
  console.log(`\n[geometry-release] ${check}`);
  const result = spawnSync(process.execPath, [check], {
    cwd: root,
    env: { ...process.env, GFIELD_BASE_URL: baseUrl },
    encoding: "utf8"
  });
  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);
  if (result.status !== 0) process.exit(result.status || 1);
}

console.log(`\nGeometry release checks passed against ${baseUrl}: ${checks.length} checks.`);
