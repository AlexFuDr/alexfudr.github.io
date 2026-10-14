import assert from "node:assert/strict";
import test from "node:test";

import { createTranslator } from "../scripts/lib/translation-providers.mjs";

test("LibreTranslate adapter uses the configured local endpoint", async () => {
  let request;
  const translate = createTranslator({
    provider: "libretranslate",
    sourceLanguage: "en",
    targetLanguage: "nl",
    endpoint: "http://127.0.0.1:5000",
    fetchImpl: async (url, options) => {
      request = { url, options };
      return { ok: true, json: async () => ({ translatedText: "Veiligheid" }) };
    },
  });

  assert.equal(await translate("Safety"), "Veiligheid");
  assert.equal(request.url, "http://127.0.0.1:5000/translate");
  assert.deepEqual(JSON.parse(request.options.body), {
    q: "Safety",
    source: "en",
    target: "nl",
    format: "text",
  });
});

test("DeepL adapter requires a key before making requests", () => {
  assert.throws(
    () =>
      createTranslator({
        provider: "deepl",
        sourceLanguage: "en",
        targetLanguage: "nl",
        apiKey: "",
      }),
    /DEEPL_API_KEY/,
  );
});

test("DeepL adapter sends text to the official API format", async () => {
  let request;
  const translate = createTranslator({
    provider: "deepl",
    sourceLanguage: "nl",
    targetLanguage: "en",
    apiKey: "secret",
    endpoint: "https://api-free.deepl.com",
    fetchImpl: async (url, options) => {
      request = { url, options };
      return { ok: true, json: async () => ({ translations: [{ text: "Safety" }] }) };
    },
  });

  assert.equal(await translate("Veiligheid"), "Safety");
  assert.equal(request.url, "https://api-free.deepl.com/v2/translate");
  assert.equal(request.options.headers.Authorization, "DeepL-Auth-Key secret");
  assert.deepEqual(JSON.parse(request.options.body), {
    text: ["Veiligheid"],
    source_lang: "NL",
    target_lang: "EN",
    preserve_formatting: true,
  });
});
