import { createHash } from "node:crypto";

function cacheKey(text, sourceLanguage, targetLanguage) {
  return createHash("sha256")
    .update(`${sourceLanguage}\0${targetLanguage}\0${text}`)
    .digest("hex");
}

export async function translateWithCache(
  text,
  translate,
  cache,
  sourceLanguage,
  targetLanguage,
) {
  const key = cacheKey(text, sourceLanguage, targetLanguage);
  if (Object.hasOwn(cache, key)) return cache[key];

  const translated = await translate(text);
  cache[key] = translated;
  return translated;
}

function splitArticle(markdown) {
  const match = markdown.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) throw new Error("Expected Markdown with YAML front matter.");
  return { frontmatter: match[1], body: match[2] };
}

function readQuotedField(frontmatter, field) {
  const match = frontmatter.match(new RegExp(`^${field}:\\s*["'](.*)["']\\s*$`, "m"));
  if (!match) throw new Error(`Missing quoted front matter field: ${field}`);
  return match[1];
}

function setField(frontmatter, field, value, quoted = false) {
  const rendered = quoted ? `"${value.replaceAll("\\", "\\\\").replaceAll('"', '\\"')}"` : value;
  const pattern = new RegExp(`^${field}:.*$`, "m");
  if (!pattern.test(frontmatter)) throw new Error(`Missing front matter field: ${field}`);
  return frontmatter.replace(pattern, `${field}: ${rendered}`);
}

function protectMarkdown(text) {
  const protectedValues = [];
  const protect = (value) => {
    const token = `ZXQPROTECTED${protectedValues.length}QXZ`;
    protectedValues.push(value);
    return token;
  };

  let safe = text.replace(/\]\((?:https?:\/\/|mailto:)[^)]+\)/g, protect);
  safe = safe.replace(/https?:\/\/[^\s)>]+/g, protect);
  safe = safe.replace(/\b(?:PMID|DOI):\s*[^\s,;]+/gi, protect);

  return {
    safe,
    restore(value) {
      return protectedValues.reduce(
        (result, protectedValue, index) =>
          result.replaceAll(`ZXQPROTECTED${index}QXZ`, protectedValue),
        value,
      );
    },
  };
}

async function translateBlock(block, options) {
  if (
    /^\s*```/.test(block) ||
    /^\s*~~~/.test(block) ||
    /^\s*\[[^\]]+\]:\s*\S+/m.test(block) ||
    /^\s*</.test(block) ||
    /^\s*\|/.test(block)
  ) {
    return block;
  }

  const prefixMatch = block.match(/^(#{1,6}\s+|>\s+|(?:[-*+] |\d+\. ))/);
  const prefix = prefixMatch?.[0] ?? "";
  const text = block.slice(prefix.length);
  if (!text.trim()) return block;

  const protectedText = protectMarkdown(text);
  const translated = await translateWithCache(
    protectedText.safe,
    options.translate,
    options.cache,
    options.sourceLanguage,
    options.targetLanguage,
  );
  return `${prefix}${protectedText.restore(translated)}`;
}

async function translateBody(body, options) {
  const leadingNewlines = body.match(/^\n+/)?.[0] ?? "";
  const content = body.slice(leadingNewlines.length);
  const blocks = content.split(/(\n{2,})/);
  let inFence = false;
  const rendered = [];

  for (const block of blocks) {
    if (/^\n+$/.test(block)) {
      rendered.push(block);
      continue;
    }

    const startsFence = /^\s*(```|~~~)/.test(block);
    if (startsFence) {
      rendered.push(block);
      const fenceCount = (block.match(/^(?:```|~~~)/gm) ?? []).length;
      if (fenceCount % 2 === 1) inFence = !inFence;
      continue;
    }

    if (inFence) {
      rendered.push(block);
      continue;
    }

    rendered.push(await translateBlock(block, options));
  }

  return leadingNewlines + rendered.join("");
}

export async function createTranslationDraft(markdown, options) {
  const article = splitArticle(markdown);
  const title = readQuotedField(article.frontmatter, "title");
  const description = readQuotedField(article.frontmatter, "description");

  const translatedTitle = await translateWithCache(
    title,
    options.translate,
    options.cache,
    options.sourceLanguage,
    options.targetLanguage,
  );
  const translatedDescription = await translateWithCache(
    description,
    options.translate,
    options.cache,
    options.sourceLanguage,
    options.targetLanguage,
  );

  let frontmatter = setField(article.frontmatter, "title", translatedTitle, true);
  frontmatter = setField(frontmatter, "description", translatedDescription, true);
  frontmatter = setField(frontmatter, "lang", options.targetLanguage);
  frontmatter = setField(frontmatter, "draft", "true");

  const body = await translateBody(article.body, options);
  return {
    markdown:
      `---\n${frontmatter}\n---\n` +
      `\n<!-- MACHINE TRANSLATION DRAFT — HUMAN REVIEW REQUIRED -->\n` +
      body.replace(/^\n+/, "\n"),
    cache: options.cache,
  };
}
