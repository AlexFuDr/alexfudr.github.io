# Content collection context

- `content.config.ts` is the authoritative schema for published content.
- Schema changes must remain compatible with both `nl` and `en` collections and require build verification.
- Do not silently add front-matter fields that are absent from the schema.
- Draft filtering and publication behavior must be explicit and tested before relying on `draft` for unpublished material.
