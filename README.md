# QR code generator

A single-page web app that turns any URL into a scannable QR code you can
download or share, built for the
[devChallenges.io](https://devchallenges.io) _QR code generator_ challenge.

## About this project

The brief: take a clean, design-spec'd layout (input → result), implement it
in React, and add light/dark theming on top. The goal is a polished, pixel
match of the provided design that is **responsive, accessible, themable, and
fully tested**.

It is also a small playground for a handful of modern web techniques:

- A **canvas-rendered QR** generated locally — no third-party API call, the
  page works offline
- **Design tokens in CSS custom properties**, remapped per theme so neither
  React state nor JS touches color logic at runtime
- **Native browser APIs** for file download (`a[download]` + `toDataURL`) and
  clipboard sharing (`navigator.clipboard.writeText`)
- **Vitest + Testing Library** with `@vitest/coverage-v8` thresholds set to
  100% so coverage regressions fail the build

## Demo

```text
┌──────────────────────────────┐         ┌──────────────────────────────┐
│           QRCODE             │         │           QRCODE             │
│                              │         │                              │
│  ┌────────────────┬──────┐   │         │       ┌──────────────┐       │
│  │ Enter an url   │ QR…  │   │  --->   │       │  ▓▓▓ ▓▓ ▓▓▓  │       │
│  └────────────────┴──────┘   │ submit  │       │  ▓ █ ▓██▓ ▓▓  │       │
│                              │         │       │  ▓▓▓ ▓ ▓ ▓ ▓  │       │
│                              │         │       └──────────────┘       │
│                              │         │      Download     Share      │
└──────────────────────────────┘         └──────────────────────────────┘
       empty / initial state                       result state
```

The toggle in the top-right switches between dark and light themes; the
choice persists across reloads.

## Features

- Paste a URL, click **QR code**, get a scannable QR rendered on a `<canvas>`
- **Download** the QR as `qr-code.png`
- **Share** copies the original URL to the clipboard with a transient
  "Copied!" / error status
- **Light and dark themes** driven by a `data-theme` attribute on `<html>`;
  selection is persisted under the `qr-theme` `localStorage` key
- **Responsive** layouts at mobile (≤640px), tablet, and desktop breakpoints
- **Accessible**: real `<button>` / `<input>` semantics, labelled controls,
  `aria-pressed` on the toggle, `role="status"` + `aria-live="polite"` for
  share feedback

## Tech stack

| Concern       | Choice                                                                                          |
| ------------- | ----------------------------------------------------------------------------------------------- |
| Build / dev   | [Vite 8](https://vite.dev/) with `@vitejs/plugin-react`                                         |
| UI            | [React 19](https://react.dev/) + TypeScript (strict, `verbatimModuleSyntax`)                    |
| Styling       | Plain CSS with custom-property design tokens — no UI framework                                  |
| QR rendering  | [`qrcode`](https://www.npmjs.com/package/qrcode) (canvas-based)                                 |
| Testing       | [Vitest](https://vitest.dev/) + [Testing Library](https://testing-library.com/) + jsdom         |
| Coverage      | [`@vitest/coverage-v8`](https://www.npmjs.com/package/@vitest/coverage-v8) with 100% thresholds |
| Lint / format | [ESLint](https://eslint.org/) (flat config) + [Prettier](https://prettier.io/)                  |
| Font          | [Outfit](https://fonts.google.com/specimen/Outfit) from Google Fonts                            |

## Getting started

```bash
npm install
npm run dev          # http://localhost:5173
```

Build for production:

```bash
npm run build        # → dist/
npm run preview      # serve dist/ locally
```

## Scripts

| Command                                   | Description                                                     |
| ----------------------------------------- | --------------------------------------------------------------- |
| `npm run dev`                             | Start the Vite dev server with HMR                              |
| `npm run build`                           | Type-check (`tsc -b`) and produce a production build in `dist/` |
| `npm run preview`                         | Serve the built `dist/` for local verification                  |
| `npm run lint`                            | Run ESLint over the project                                     |
| `npm run format` / `npm run format:check` | Run Prettier (write / check-only)                               |
| `npm test`                                | Run the Vitest suite once                                       |
| `npm run test:coverage`                   | Run the suite with v8 coverage (fails below 100%)               |

## How it works

The UI is a two-view state machine driven by a single piece of state in
`src/App.tsx`:

```text
url: string | null

  null  ──── submit ───▶  string
   ▲                        │
   └────── reset ───────────┘

  null   → <UrlForm onSubmit={setUrl} />
  string → <QRDisplay url={url} />  + "Generate another"
```

When `QRDisplay` mounts, it reads the active design tokens
(`--color-dark`, `--color-paper`) via `getComputedStyle` and asks the
`qrcode` library to paint into the `<canvas>` ref. Because the colors come
from CSS variables, the QR follows the theme without any per-theme branch in
TS.

- **Download** creates a hidden `<a>`, sets `href = canvas.toDataURL('image/png')`,
  sets `download = 'qr-code.png'`, and calls `.click()` on it.
- **Share** calls `navigator.clipboard.writeText(url)` and flips a small
  status label between `idle` / `copied` / `error`, resetting back to `idle`
  after 2s via `setTimeout`.

## Project structure

```text
src/
├── App.tsx                  # holds url state, swaps form ↔ display
├── App.css
├── index.css                # design tokens + theme variables
├── main.tsx                 # mounts <App /> in StrictMode
└── components/
    ├── Header/              # QRCODE logo (full / compact)
    │   ├── Header.tsx
    │   ├── Header.css
    │   └── Header.test.tsx
    ├── ThemeToggle/         # fixed top-right light/dark switch
    ├── UrlForm/             # URL input pill + submit button
    └── QRDisplay/           # canvas QR + halo + Download/Share
```

Each component follows the same `<Name>.tsx` / `<Name>.css` /
`<Name>.test.tsx` folder layout.

## Theming

The five design-spec colors are defined once on `:root`:

```text
--color-light:   #F2F5F9
--color-primary: #263FA9
--color-dark:    #030616
--color-paper:   #FAFAF9
--color-overlay: #F8FAFC1A
```

They are remapped to **semantic aliases** (`--bg`, `--text`, `--button-bg`,
`--card-bg`, `--halo`, …) under `[data-theme='dark']` and
`[data-theme='light']` selectors on `<html>`. Components only reference the
semantic aliases, so a theme switch is a single attribute write — no
re-render of the tree, no JS color logic.

The active theme is stored in `localStorage` under `qr-theme` and re-read on
mount.

## Accessibility

- The URL input has a visible placeholder _and_ an `aria-label` so screen
  readers always announce a name.
- The QR canvas exposes its content via `role="img"` and an
  `aria-label` that includes the URL.
- The theme toggle is a real `<button>` with `aria-pressed` reflecting the
  dark/light state and a context-aware `aria-label`.
- The share status uses `role="status"` + `aria-live="polite"` so screen
  readers announce "URL copied to clipboard" without stealing focus.
- All interactive elements have visible `:focus-visible` outlines.

## Testing

```bash
npm test              # one-shot
npm run test:coverage # one-shot with coverage report (html + text)
```

Coverage is enforced at **100%** for statements, branches, functions, and
lines via thresholds in `vite.config.ts`. Test files (`*.test.tsx`) live
next to their components and are excluded from the production build through
`tsconfig.app.json`.

The test suite covers:

- Component rendering (logos, labels, button states)
- The URL form's submit/disable/trim behavior
- The theme toggle's default, persisted, and click-through states
- Download triggers an anchor `.click()` with a `data:image/png` href
- Share copies the URL and resets status after the timeout (fake timers)
- Share's error path renders the failure status
- QR generation failures are swallowed without breaking the UI
- The `App` shell transitions between form and result views

## Credits

- Challenge brief and design: [devChallenges.io](https://devchallenges.io)
- Built by [@mcastig](https://github.com/mcastig) with help from
  [Claude Code](https://claude.com/claude-code)
