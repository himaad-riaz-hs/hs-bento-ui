#!/usr/bin/env node
/**
 * Fails if duplicated UI font stack literals appear outside `src/tokens/`
 * (use `HS_FONT_FAMILY` from `src/lib/hs-font-family.ts` or `var(--hs-typeface-*)`).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const srcDir = path.join(root, "src");

const BANNED = /Source\s+Sans/i;

function walk(dir, files = []) {
  for (const name of fs.readdirSync(dir)) {
    if (name === "tokens") continue;
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) walk(p, files);
    else if (/\.tsx?$/.test(name) && !name.endsWith(".d.ts")) files.push(p);
  }
  return files;
}

function stripComments(line) {
  return line.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/, "");
}

let failed = false;
for (const file of walk(srcDir)) {
  const lines = fs.readFileSync(file, "utf8").split("\n");
  lines.forEach((line, i) => {
    if (line.trim().startsWith("//")) return;
    const code = stripComments(line);
    if (BANNED.test(code)) {
      console.error(
        `${path.relative(root, file)}:${i + 1}: use HS_FONT_FAMILY from src/lib/hs-font-family.ts or CSS vars — do not duplicate the Source Sans stack`
      );
      failed = true;
    }
    BANNED.lastIndex = 0;
  });
}

if (failed) process.exit(1);
