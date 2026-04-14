# HS-Bento UI

React component library and Storybook for the **HS-Bento** design system: tokens, primitives, and feature flows (Tag Management, Composer Tagging) your team can run locally for reviews and concept work.

## What teammates need

- **Node.js** `>= 18.18` (LTS **20** is recommended; this repo includes an `.nvmrc` with `20`).
- **npm** (comes with Node).

Optional: [fnm](https://github.com/Schniz/fnm) or [nvm](https://github.com/nvm-sh/nvm) to match the Node version via `nvm use` / `fnm use`.

## Get it running (first time)

From the `hs-bento-ui` folder:

```bash
npm install
npm run dev
```

Storybook opens at **http://localhost:6007** (default port in `package.json`). Browse component stories under the sidebar and the **Features** flows (Tag Management, Composer).

## Scripts

| Command | Purpose |
|--------|---------|
| `npm run dev` | Start Storybook in dev mode (hot reload). |
| `npm run lint` | Typecheck with `tsc` (no emit). |
| `npm run build` | Build the publishable library (`dist/`: ESM, CJS, types, `styles.css`). |
| `npm run build:storybook` | Produce a static Storybook site in `storybook-static/` (shareable HTML). |

## Share the design system with others

**Option A — Source repo (best for ongoing collaboration)**  
Put the `hs-bento-ui` project in Git. Teammates clone, `cd hs-bento-ui`, `npm install`, `npm run dev`.

**Option B — Static Storybook only**  
Run `npm install` once, then `npm run build:storybook`. Zip or upload the `storybook-static` folder. Anyone can open it with any static server, for example:

```bash
npx serve storybook-static
```

Or open `storybook-static/index.html` from a local server (some browsers block file URLs for ES modules).

**Option C — Use as an npm package in apps**  
After `npm run build`, publish or link the package. In consuming apps:

1. Install: `npm install hs-bento-ui` (or `npm link` from this folder during development).
2. Import components from `hs-bento-ui`.
3. Import styles once (path matches `package.json` `exports`):

   ```ts
   import "hs-bento-ui/styles.css";
   ```

4. Ensure Tailwind in the app does not strip this library’s classes, or rely on the prebuilt `styles.css` which already includes Tailwind utilities used by the components.

## Project layout (short)

- `src/components/` — Design system primitives.
- `src/features/` — Full-page flows (Tag Management, Post Composer).
- `src/tokens/index.css` — Design tokens and Tailwind entry for the library CSS build.

## Troubleshooting

- **`npm install` fails or Node not found:** Install Node 18+ or use nvm/fnm and run `nvm use` / `fnm use` in this directory.
- **Port 6007 in use:** Run `npx storybook dev -p 6006` (or another free port) or edit the `-p` flag in `package.json` `dev` / `dev:clean`.
