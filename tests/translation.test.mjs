import assert from "node:assert/strict";
import test from "node:test";

import {
  createTranslationDraft,
  translateWithCache,
} from "../scripts/lib/translation.mjs";

const article = `---
title: "How evidence is assessed"
description: "A concise explanation."
lang: en
slug: "evidence"
translation_key: "evidence"
alternate_path: "/nl/artikelen/bewijs/"
author: "Alex Fu"
draft: false
---

Intro with a [source](https://example.com/paper).

## What this means

The conclusion remains cautious.
`;

test("creates a target-language draft without changing protected metadata", async () => {
  const translated = [];
  const result = await createTranslationDraft(article, {
    sourceLanguage: "en",
    targetLanguage: "nl",
    translate: async (text) => {
      translated.push(text);
      return `NL: ${text}`;
    },
    cache: {},
  });

  assert.match(result.markdown, /title: "NL: How evidence is assessed"/);
  assert.match(result.markdown, /description: "NL: A concise explanation\."/);
  assert.match(result.markdown, /lang: nl/);
  assert.match(result.markdown, /translation_key: "evidence"/);
  assert.match(result.markdown, /draft: true/);
  assert.match(result.markdown, /MACHINE TRANSLATION DRAFT — HUMAN REVIEW REQUIRED/);
  assert.match(result.markdown, /\[source\]\(https:\/\/example\.com\/paper\)/);
  assert.match(result.markdown, /## NL: What this means/);
  assert.equal(translated.some((text) => text.includes("translation_key")), false);
});

test("reuses exact cached translations instead of calling the provider", async () => {
  let calls = 0;
  const cache = {};
  const translate = async (text) => {
    calls += 1;
    return `NL: ${text}`;
  };

  const first = await translateWithCache("Safety", translate, cache, "en", "nl");
  const second = await translateWithCache("Safety", translate, cache, "en", "nl");

  assert.equal(first, "NL: Safety");
  assert.equal(second, "NL: Safety");
  assert.equal(calls, 1);
  assert.equal(Object.keys(cache).length, 1);
});

test("does not send fenced code blocks or reference definitions for translation", async () => {
  const input = `${article}\n\`\`\`text\nPMID: 12345\n\`\`\`\n\n[1]: https://doi.org/10.1000/example\n`;
  const translated = [];
  const result = await createTranslationDraft(input, {
    sourceLanguage: "en",
    targetLanguage: "nl",
    translate: async (text) => {
      translated.push(text);
      return `NL: ${text}`;
    },
    cache: {},
  });

  assert.match(result.markdown, /PMID: 12345/);
  assert.match(result.markdown, /\[1\]: https:\/\/doi\.org\/10\.1000\/example/);
  assert.equal(translated.some((text) => text.includes("PMID")), false);
  assert.equal(translated.some((text) => text.includes("doi.org")), false);
});
