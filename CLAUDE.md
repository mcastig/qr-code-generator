# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start the Vite dev server with HMR
- `npm run build` — type-check with `tsc -b` then produce a production build with Vite
- `npm run lint` — run ESLint
- `npm run preview` — serve the built `dist/`
- `npm test` — run the Vitest suite once
- `npx vitest <file>` — run a single test file in watch mode

## Architecture

The app has two views — URL input and QR result — driven by a single `url: string | null` state in `src/App.tsx`. When non-null, `QRDisplay` is rendered; otherwise `UrlForm`. The `Header` re-renders with `compact` to swap between full and small logos. `ThemeToggle` is a fixed top-right button that writes `data-theme="dark"|"light"` onto `<html>` and persists to localStorage under `qr-theme`.

Components follow the folder-per-component convention requested by the task:

```
src/components/<Name>/
  <Name>.tsx
  <Name>.css
  <Name>.test.tsx
```

`QRDisplay` paints the QR onto a `<canvas>` via the `qrcode` npm package (note: the brief mentioned `qrcodejs`; we use the modern equivalent for ESM + canvas/download/clipboard ergonomics). Download exports the canvas as a PNG; Share copies the URL via `navigator.clipboard.writeText`.

## Styling & theming

- Design tokens live in `src/index.css` as CSS variables (`--color-light`, `--color-primary`, `--color-dark`, `--color-paper`, `--color-overlay`) and are remapped per theme via `[data-theme='dark']` / `[data-theme='light']` blocks. Components consume the semantic aliases (`--bg`, `--text`, `--button-bg`, etc.), so theme switches flow automatically.
- Font: `Outfit` loaded from Google Fonts in `index.html`.
- Assets in `public/` (Logo.svg, Logo-small.svg, icon-download.svg, icon-link.svg, qa-bg.jpg, favicon.ico) are referenced by absolute path.

## Tests

Vitest + jsdom + Testing Library. Config lives inline in `vite.config.ts` (imported from `vitest/config` so the `test` field type-checks). Setup in `src/test/setup.ts` registers `@testing-library/jest-dom` matchers and calls `cleanup()` between cases. Test files are excluded from `tsconfig.app.json`'s `include` so `npm run build` doesn't try to compile them as app code.

jsdom logs a benign warning about `HTMLCanvasElement.getContext` not being implemented — the `QRDisplay` test only asserts on button rendering and clipboard side effects, so the canvas no-op is harmless. If you ever need pixel-level assertions, install the `canvas` package.
