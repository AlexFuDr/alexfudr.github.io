# Script context

- Scripts support authoring and maintenance; they must not publish content or modify production articles by default.
- Translation output belongs in `.translation-drafts/`; exact-match cache belongs in `.translation-cache/`.
- LibreTranslate on localhost is the default provider. Any hosted provider must be explicitly selected.
- Never write API keys to source, cache, output, logs, or tests. Environment-variable names are documented in `.env.example`.
- Protect Markdown structure, URLs, DOI/PMID identifiers, code blocks, and reference definitions across translation.
- Prefer Node standard-library APIs and dependency injection for network boundaries.
- Translation logic changes require the focused translation tests and then `npm run verify`.
