# Website content contract

## Language and URL rules

- Dutch is the default language.
- Dutch URLs live under `/nl/`; English URLs live under `/en/`.
- Each translated pair uses a shared `translation_key`.
- Language switching should open the paired page when it exists.
- Each page emits a self-canonical URL plus `hreflang` alternates for available versions and the site's chosen `x-default` behavior.

## Astro content front matter

Published Markdown belongs in `src/content/articles/nl` or `src/content/articles/en`. The schema in `src/content.config.ts` is authoritative; do not add unsupported fields silently.

```yaml
---
title: "Readable page title"
description: "Specific summary for readers and search results."
lang: nl
translation_key: acupuncture-example
author: Alex Fu
date: 2026-10-14
last_reviewed: 2026-10-14
evidence_certainty: low
content_type: evidence-review
tags: [acupunctuur, evidence]
reviewer: ""
conflicts: "None declared"
draft: false
---
```

Allowed `lang`: `nl`, `en`.

Suggested `content_type`: `foundation`, `evidence-review`, `research-explainer`, `safety-guide`, `video`.

Suggested `evidence_certainty`: `higher`, `moderate`, `low`, `very-low`, `not-applicable`. Use `not-applicable` for pages such as history or site information where clinical certainty is not being rated.

## Reference format

For each source include authors or group, title, journal/issuer, year, and a stable PMID, DOI, or official URL. Do not cite a search result page. Link to an open full text when lawfully available, otherwise to PubMed, DOI, or the publisher record.

## Publication checklist

- [ ] The page answers one primary reader intent.
- [ ] Key claims pass the evidence traceability gate.
- [ ] Benefits, uncertainty, and safety are balanced.
- [ ] Author, date, review date, and conflicts are present.
- [ ] Title and description are unique and accurate.
- [ ] Dutch and English conclusions agree, or untranslated status is explicit.
- [ ] `translation_key`, canonical, and language alternates resolve correctly.
- [ ] Links, references, images, and embedded media work.
- [ ] Structured data matches visible content.
- [ ] The page contains no patient-specific advice or unsupported efficacy claim.
