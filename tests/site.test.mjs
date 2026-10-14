import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function page(path) {
  return readFile(new URL(`../dist/${path}`, import.meta.url), "utf8");
}

test("builds Dutch and English home pages with paired language links", async () => {
  const dutch = await page("nl/index.html");
  const english = await page("en/index.html");

  assert.match(dutch, /<html lang="nl">/);
  assert.match(english, /<html lang="en">/);
  assert.match(dutch, /href="\/en\/"[^>]*hreflang="en"/);
  assert.match(english, /href="\/nl\/"[^>]*hreflang="nl"/);
});
test("emits canonical and hreflang metadata for localized pages", async () => {
  const dutch = await page("nl/index.html");

  assert.match(dutch, /rel="canonical" href="https:\/\/alexfudr\.github\.io\/nl\/"/);
  assert.match(dutch, /rel="alternate" hreflang="nl" href="https:\/\/alexfudr\.github\.io\/nl\/"/);
  assert.match(dutch, /rel="alternate" hreflang="en" href="https:\/\/alexfudr\.github\.io\/en\/"/);
  assert.match(dutch, /rel="alternate" hreflang="x-default" href="https:\/\/alexfudr\.github\.io\/nl\/"/);
});

test("publishes paired evidence-method articles", async () => {
  const dutch = await page("nl/artikelen/hoe-we-bewijs-beoordelen/index.html");
  const english = await page("en/articles/how-we-assess-evidence/index.html");

  assert.match(dutch, /Hoe we wetenschappelijk bewijs beoordelen/);
  assert.match(english, /How we assess scientific evidence/);
  assert.match(dutch, /Laatst beoordeeld/);
  assert.match(english, /Last reviewed/);
  assert.match(dutch, /Niet van toepassing/);
  assert.match(english, /Not applicable/);
  assert.match(dutch, /"@type":"Article"/);
  assert.match(english, /"@type":"Article"/);
});

test("root page defaults visitors and crawlers to Dutch", async () => {
  const root = await page("index.html");

  assert.match(root, /url=\/nl\//);
  assert.match(root, /href="\/nl\/"/);
});

test("ships a bilingual 404 page and crawler guidance", async () => {
  const notFound = await page("404.html");
  const robots = await page("robots.txt");

  assert.match(notFound, /Pagina niet gevonden/);
  assert.match(notFound, /Page not found/);
  assert.match(robots, /Sitemap: https:\/\/alexfudr\.github\.io\/sitemap-index\.xml/);
});
