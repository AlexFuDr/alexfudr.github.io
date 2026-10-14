# Acupuncture education website

A static, bilingual acupuncture education website built with Astro and deployed to GitHub Pages. Dutch is the default language; English is available as a paired translation.

## Local development

Requires Node.js 24 or newer.

```bash
npm install
npm run dev
```

## Verification

```bash
npm run verify
```

This runs Astro type/content checks, creates the static production build, and verifies localized routes and SEO metadata.

## Content

Published articles live in `src/content/articles/nl` and `src/content/articles/en`. Their front matter is validated by `src/content.config.ts`. Paired translations share a `translation_key` and link to each other through `alternate_path`.

The project-local editorial workflow is documented in `skills/acupuncture-evidence-editor/SKILL.md`.

## Deployment

Pushing to `master` runs `.github/workflows/deploy.yml`. The repository's GitHub Pages source must be set to **GitHub Actions**.

## Legacy Jekyll source

The old Jekyll files remain temporarily for migration reference. Astro builds only from `src/` and `public/`; legacy posts are not published until their medical claims have been checked against the new evidence standard.
