# Translation workflow

The site language switch is static and requires no runtime translation service. English and Dutch pages are built independently and linked through `translation_key` and `alternate_path`.

Machine translation is only a drafting aid. It must not be used to publish medical content without bilingual human review.

## Recommended setup: local LibreTranslate

LibreTranslate is self-hosted and uses Argos Translate. Once its English and Dutch models are installed, article text stays on the local machine and no model tokens are consumed.

Run the service on `http://127.0.0.1:5000`, then create a Dutch draft:

```sh
npm run translate:article -- \
  --input src/content/articles/en/how-we-assess-evidence.md \
  --source en \
  --target nl
```

The result is written to `.translation-drafts/nl/`. Exact translated segments are cached under `.translation-cache/`, so unchanged text is not sent again.

LibreTranslate installation instructions: <https://docs.libretranslate.com/guides/installation/>

## Optional fallback: DeepL API

Copy `.env.example` values into your shell environment; do not commit a real API key. Then run:

```sh
DEEPL_API_KEY="your-key" npm run translate:article -- \
  --input src/content/articles/en/how-we-assess-evidence.md \
  --source en \
  --target nl \
  --provider deepl
```

DeepL API documentation: <https://developers.deepl.com/docs/api-reference/translate>

## Review before publication

1. Localize the slug and `alternate_path`.
2. Compare conclusions, effect estimates, units, citations, cautions, and certainty labels.
3. Replace literal wording with established Dutch or English healthcare terminology.
4. Verify every consequential medical claim against the cited source.
5. Remove the machine-translation warning only after review, then copy the file into the appropriate `src/content/articles/<lang>/` directory and change `draft` when ready.

Nordon remains the evidence-retrieval tool. It is not the translation engine.
