# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start the Vite dev server with HMR
- `npm run build` — type-check with `tsc -b` then produce a production build with Vite
- `npm run preview` — serve the built `dist/`
- `npm run lint` — run ESLint
- `npm run format` / `npm run format:check` — Prettier (write / check-only)
- `npm test` — run the Vitest suite once
- `npm run test:coverage` — run with v8 coverage; fails if any of statements/branches/functions/lines drop below 100%
- `npx vitest <file>` — run a single test file in watch mode

## Architecture

The app has two views — URL input and QR result — driven by a single `url: string | null` state in `src/App.tsx`. When non-null, `QRDisplay` is rendered; otherwise `UrlForm`. The `Header` re-renders with `compact` to swap between full and small logos. `ThemeToggle` is a fixed top-right button that writes `data-theme="dark"|"light"` onto `<html>` and persists to `localStorage` under `qr-theme`.

Components follow the folder-per-component convention required by the brief:

```
src/components/<Name>/
  <Name>.tsx
  <Name>.css
  <Name>.test.tsx
```

`QRDisplay` paints the QR onto a `<canvas>` via the `qrcode` npm package (the brief suggested `qrcodejs`; the modern `qrcode` package is used for ESM + canvas + clipboard ergonomics). The canvas's dark/light colors are read from the `--color-dark` / `--color-paper` CSS variables via `getComputedStyle` so the QR follows the design tokens. **Download** exports the canvas as `qr-code.png` by creating an anchor with `canvas.toDataURL(...)` and clicking it. **Share** copies the original URL with `navigator.clipboard.writeText` and surfaces a 2-second status message.

## Styling & theming

- Design tokens live in `src/index.css` as CSS custom properties (`--color-light`, `--color-primary`, `--color-primary-hover`, `--color-dark`, `--color-paper`, `--color-overlay`, `--button-glow`, `--card-shadow`) and are remapped per theme via `[data-theme='dark']` / `[data-theme='light']` blocks. Components consume the semantic aliases (`--bg`, `--text`, `--button-bg`, etc.), so theme switches flow automatically — no per-component theme code.
- **No literal colors in component CSS or TSX.** All colors must go through tokens in `src/index.css`. Hover / glow / shadow values that vary between themes have their own theme-scoped tokens (`--toggle-bg-hover`, `--card-shadow`, etc.).
- Font: `Outfit` loaded from Google Fonts in `index.html`.
- Assets in `public/` (Logo.svg, Logo-small.svg, icon-download.svg, icon-link.svg, qa-bg.jpg, favicon.ico) are referenced by absolute path.

## Tests & coverage

Vitest + jsdom + Testing Library. Config lives inline in `vite.config.ts` (imported from `vitest/config` so the `test` field type-checks). Setup in `src/test/setup.ts` registers `@testing-library/jest-dom` matchers and calls `cleanup()` between cases. Test files are excluded from `tsconfig.app.json`'s `include` so `npm run build` doesn't try to compile them as app code.

Coverage thresholds are set to 100% across statements / branches / functions / lines. To preserve that, two non-obvious patterns are used in `QRDisplay.tsx`:

- The `.catch(...)` for `QRCode.toCanvas` references a module-level `ignore = () => undefined` rather than an inline empty arrow. v8 coverage will not credit an arrow whose body is just a comment, so inline noops bleed function coverage.
- The `setTimeout` reset callback is hoisted to a named `resetStatus` for the same reason and so it can be exercised by `vi.advanceTimersByTimeAsync(2000)` in the share test.

jsdom logs a benign warning about `HTMLCanvasElement.getContext` not being implemented — the `QRDisplay` tests assert on buttons and clipboard side effects, so the canvas no-op is harmless. If pixel-level assertions are ever needed, install the `canvas` package.

## Code style

- Prettier config: no semicolons, single quotes, trailing commas everywhere, 80-col print width, LF line endings (`.prettierrc.json`).
- `.prettierignore` excludes `public/`, SVGs, `coverage/`, the lockfile, etc.
- `verbatimModuleSyntax` is on in `tsconfig.app.json`, so use `import { type Foo }` (or `import type`) for type-only specifiers.
