# Astro source context

- Keep the site fully static; do not introduce a runtime backend without a recorded product and architecture decision.
- Dutch is the default locale. Every public English/Dutch pair must preserve canonical, `hreflang`, `x-default`, and paired language navigation behavior.
- Shared metadata belongs in `BaseLayout.astro`; article-specific metadata belongs in `ArticleLayout.astro`.
- Shared interface text belongs in `i18n.ts`. Do not scatter duplicate translations across components.
- Keep consultation as a simple external link or entry point. Do not collect health data in this repository.
- Prefer accessible semantic HTML and lightweight CSS; avoid client JavaScript unless the interaction requires it.
- After source changes run `npm run verify`.
