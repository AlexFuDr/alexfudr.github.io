async function assertResponse(response, provider) {
  if (response.ok) return;
  const detail = typeof response.text === "function" ? await response.text() : "";
  throw new Error(`${provider} request failed${detail ? `: ${detail}` : "."}`);
}

function endpoint(base, path) {
  return `${base.replace(/\/$/, "")}${path}`;
}

export function createTranslator(options) {
  const fetchImpl = options.fetchImpl ?? fetch;

  if (options.provider === "libretranslate") {
    const baseUrl = options.endpoint ?? "http://127.0.0.1:5000";
    return async (text) => {
      const payload = {
        q: text,
        source: options.sourceLanguage,
        target: options.targetLanguage,
        format: "text",
      };
      if (options.apiKey) payload.api_key = options.apiKey;

      const response = await fetchImpl(endpoint(baseUrl, "/translate"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      await assertResponse(response, "LibreTranslate");
      const data = await response.json();
      if (typeof data.translatedText !== "string") {
        throw new Error("LibreTranslate returned no translatedText value.");
      }
      return data.translatedText;
    };
  }

  if (options.provider === "deepl") {
    if (!options.apiKey) throw new Error("DEEPL_API_KEY is required for the DeepL provider.");
    const baseUrl = options.endpoint ?? "https://api-free.deepl.com";
    return async (text) => {
      const response = await fetchImpl(endpoint(baseUrl, "/v2/translate"), {
        method: "POST",
        headers: {
          Authorization: `DeepL-Auth-Key ${options.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: [text],
          source_lang: options.sourceLanguage.toUpperCase(),
          target_lang: options.targetLanguage.toUpperCase(),
          preserve_formatting: true,
        }),
      });
      await assertResponse(response, "DeepL");
      const data = await response.json();
      const translated = data.translations?.[0]?.text;
      if (typeof translated !== "string") throw new Error("DeepL returned no translation.");
      return translated;
    };
  }

  throw new Error(`Unsupported translation provider: ${options.provider}`);
}
