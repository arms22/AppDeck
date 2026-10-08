# Repository Guidelines

## Project Structure & Module Organization

This repository is a browser-only static app launcher. `index.html` is the launcher entry point. Application metadata lives in `apps.json`; add each app under `apps/<app-id>/index.html`.

The launcher runtime is split across `src/`: `main.js` bootstraps hosted builds, `router.js` handles hash routes, `plugins.js` maps manifest types to renderers, and `views/` contains launcher views. `src/standalone.js` supports opening `index.html` directly with `file://`. Shared launcher styling is in `assets/styles.css`; Tailwind's source entry is `src/tailwind.css`.

`assets/manifest-fallback.js` is generated from `apps.json` for direct-file operation. Do not treat it as the primary configuration file.

## Build, Test, and Development Commands

- `npm install` installs the optional local development tooling.
- `npm run dev` serves the repository locally; use this to validate the JSON-manifest runtime.
- `npm run sync:manifest` regenerates `assets/manifest-fallback.js` after editing `apps.json`.
- `npm run build:css` builds Tailwind CSS after Tailwind utility usage is added or changed.

There is currently no automated test suite. Before submitting changes, open `index.html` directly and through a static server, then launch every enabled app.

## Coding Style & Naming Conventions

Use two-space indentation in HTML, CSS, JSON, and JavaScript. Keep JavaScript as small ES modules with named exports. Use lowercase kebab-case for app IDs, directories, and asset filenames (`pdf-directory-search`); use camelCase for JavaScript variables and functions.

Escape manifest-derived text before assigning it to `innerHTML`. Keep all app behavior local: do not add analytics, external fonts, remote APIs, or other network dependencies.

## Architecture and App Registration

Every app must use `"type": "top-level"`. Do not embed apps in iframes: browser APIs such as `showDirectoryPicker()` and file pickers may be blocked in frames. Add a visible link back to `../../index.html#/` in each app page.

When registering an app, add its entry to `apps.json`, run `npm run sync:manifest`, and confirm the target path exists. Register a new plugin renderer in `src/plugins.js` only when a genuinely new launch behavior is needed.

## Commit and Pull Request Guidelines

This workspace has no Git history available, so no established commit convention can be inferred. Use imperative, scoped messages such as `feat(launcher): add notes app`. Pull requests should describe behavior changes, list validation performed, link relevant issues, and include screenshots for launcher UI changes.
