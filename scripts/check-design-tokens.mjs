#!/usr/bin/env node
/**
 * Fails if raw color literals appear outside the token layer:
 * - Hex (#rgb, #rrggbb, #rrggbbaa)
 * - Functional rgba(, rgb(, hsl(, hsla( — use var(--hs-…) from src/tokens/index.css)
 *
 * Scans all src .ts and .tsx files except the src/tokens directory.
 * Skips full-line // comments; strips end-of-line // and block comments per line.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const srcDir = path.join(root, "src");

const HEX = /#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b/g;
/** Functional notation — token CSS may use rgba in index.css only */
const RAW_RGB = /\b(?:rgba?|hsla?)\(/g;

function walk(dir, files = []) {
  for (const name of fs.readdirSync(dir)) {
    if (name === "tokens") continue;
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) walk(p, files);
    else if (/\.tsx?$/.test(name) && !name.endsWith(".d.ts")) files.push(p);
  }
  return files;
}

function stripCommentsForCheck(line) {
  return line
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\/\/.*$/, "");
}

let failed = false;
const files = walk(srcDir);

for (const file of files) {
  const lines = fs.readFileSync(file, "utf8").split("\n");
  lines.forEach((line, i) => {
    const t = line.trim();
    if (t.startsWith("//")) return;
    const code = stripCommentsForCheck(line);
    if (HEX.test(code)) {
      console.error(
        `${path.relative(root, file)}:${i + 1}: raw hex — use var(--hs-…) from src/tokens/index.css`
      );
      failed = true;
    }
    HEX.lastIndex = 0;
    if (RAW_RGB.test(code)) {
      console.error(
        `${path.relative(root, file)}:${i + 1}: raw rgb/rgba/hsl — use var(--hs-…) tokens`
      );
      failed = true;
    }
    RAW_RGB.lastIndex = 0;
  });
}

if (failed) process.exit(1);
