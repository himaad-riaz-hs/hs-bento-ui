#!/usr/bin/env node
/**
 * Extracts `--name: value` declarations from :root in `src/tokens/index.css`
 * and writes `packages/tokens/tokens.json` for tooling (Figma plugins, linters, docs).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const cssPath = path.join(root, "src/tokens/index.css");
const outDir = path.join(root, "packages/tokens");
const outFile = path.join(outDir, "tokens.json");

const css = fs.readFileSync(cssPath, "utf8");

const vars = {};
const re = /--(hs-[\w-]+)\s*:\s*([^;]+);/g;
let m;
while ((m = re.exec(css))) {
  vars[m[1]] = m[2].trim();
}

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(outFile, JSON.stringify({ $schema: "./tokens.schema.json", tokens: vars }, null, 2) + "\n");
console.log(`Wrote ${path.relative(root, outFile)} (${Object.keys(vars).length} tokens)`);
