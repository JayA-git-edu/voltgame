# VOLT Prototype Architecture

This repo ships a **static** HTML5 Canvas prototype so it can run on locked-down environments (including Chromebooks with filtering) without requiring a local web server.

## Quick Start (Chromebook-Friendly)
1. Download or clone the repo.
2. Open `index.html` directly in your browser.

The prototype uses a non-module `js/bundle.js` so it works via `file://` without triggering the "Not Found" or module blocking issues that happen on filtered devices.

## Development (Optional)
If you have a local server available, you can also serve the folder normally and use the ES module files in `js/engine` for iteration.

## Project Layout
- `index.html` — App shell with canvas + HUD.
- `styles.css` — Visual styling for the shell/UI.
- `js/bundle.js` — Single-file runtime for locked-down environments.
- `js/engine/*` — Modular architecture source files.
- `js/main.js` — Module entrypoint for local dev servers.
