import { statSync } from "node:fs";
import { globSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const cli = fileURLToPath(
  new URL("../node_modules/.bin/gltf-transform", import.meta.url),
);
const modelsDir = fileURLToPath(new URL("../public/models", import.meta.url));

const glbs = globSync("**/*.glb", { cwd: modelsDir }).filter(
  (file) => !file.endsWith(".draco.glb"),
);

if (glbs.length === 0) {
  console.log("No .glb files found — nothing to compress.");
  process.exit(0);
}

let compressed = 0;
let skipped = 0;
let totalBefore = 0;
let totalAfter = 0;

for (const file of glbs) {
  const input = `${modelsDir}/${file}`;
  const output = input.replace(/\.glb$/, ".draco.glb");
  const size = (path) => statSync(path).size;

  if (size(input) === 0) continue;

  if (fileExists(output)) {
    totalBefore += size(input);
    totalAfter += size(output);
    skipped += 1;
    continue;
  }

  const result = spawnSync(cli, ["draco", input, output], {
    stdio: "pipe",
    encoding: "utf8",
  });

  if (result.status !== 0) {
    console.error(`FAILED: ${file}\n${result.stderr}`);
    process.exitCode = 1;
    continue;
  }

  totalBefore += size(input);
  totalAfter += size(output);
  compressed += 1;
  const info = result.stdout.trim().split("\n").pop() || "";
  console.log(info);
}

const savedMb = (totalBefore - totalAfter) / 1024 / 1024;
const pct =
  totalBefore > 0 ? ((totalBefore - totalAfter) / totalBefore) * 100 : 0;
console.log(
  `\nDone: ${compressed} compressed, ${skipped} already present; ${savedMb.toFixed(1)} MB (${pct.toFixed(1)}%) smaller.`,
);

function fileExists(path) {
  try {
    statSync(path);
    return true;
  } catch {
    return false;
  }
}
