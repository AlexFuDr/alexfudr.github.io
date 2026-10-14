# Project context

## Mission

Build a static, evidence-oriented acupuncture education website for readers in the Netherlands. Dutch is the default language and English is the paired alternative. Consultation is an external entry point only, not an intake or treatment system.

## Technical baseline

- Astro static output hosted on GitHub Pages.
- Localized routes live under `/nl/` and `/en/`.
- Published articles live in `src/content/articles/<lang>/` and are validated by `src/content.config.ts`.
- Run `npm run verify` after behavior, content-schema, routing, or build changes.
- Do not push, deploy, or publish drafts unless the user explicitly asks.

## Load context by task

- Website implementation: follow `src/AGENTS.md`.
- Acupuncture articles or medical claims: follow `src/content/articles/AGENTS.md` and its routed project-local skill references.
- Translation tooling: follow `scripts/AGENTS.md`.
- Tests: follow `tests/AGENTS.md`.
- Product decisions or ADRs: follow `docs/AGENTS.md`.
- Static public files: follow `public/AGENTS.md`.
- Project-local skills: follow `skills/AGENTS.md`.
- Deployment workflow: follow `.github/AGENTS.md`.

Do not preload every linked document. Read only the nearest scoped instructions and the references they route for the active task. The full map is in `docs/context-map.md`.
