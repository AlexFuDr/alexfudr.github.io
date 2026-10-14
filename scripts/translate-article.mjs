#!/usr/bin/env node

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { basename, dirname, resolve } from "node:path";

import { createTranslationDraft } from "./lib/translation.mjs";
import { createTranslator } from "./lib/translation-providers.mjs";

function usage() {
  return `Usage:
  npm run translate:article -- --input <article.md> --source <en|nl> --target <nl|en> [options]

Options:
  --provider <libretranslate|deepl>  Default: libretranslate
  --endpoint <url>                  Override the provider endpoint
  --output <path>                   Default: .translation-drafts/<target>/<filename>
  --help                            Show this help

Environment:
  LIBRETRANSLATE_URL, LIBRETRANSLATE_API_KEY
  DEEPL_API_URL, DEEPL_API_KEY
`;
}

function parseArgs(argv) {
  const values = {};
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === "--help") return { help: true };
    if (!argument.startsWith("--")) throw new Error(`Unexpected argument: ${argument}`);
    const value = argv[index + 1];
    if (!value || value.startsWith("--")) throw new Error(`Missing value for ${argument}`);
    values[argument.slice(2)] = value;
    index += 1;
  }
  return values;
}

async function readJson(path) {
  try {
    return JSON.parse(await readFile(path, "utf8"));
  } catch (error) {
    if (error.code === "ENOENT") return {};
    throw error;
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    process.stdout.write(usage());
    return;
  }

  if (!args.input || !args.source || !args.target) throw new Error(usage());
  if (!["en", "nl"].includes(args.source) || !["en", "nl"].includes(args.target)) {
    throw new Error("Source and target must be either en or nl.");
  }
  if (args.source === args.target) throw new Error("Source and target languages must differ.");

  const provider = args.provider ?? "libretranslate";
  const inputPath = resolve(args.input);
  const outputPath = resolve(
    args.output ?? `.translation-drafts/${args.target}/${basename(inputPath)}`,
  );
  const cachePath = resolve(`.translation-cache/${args.source}-${args.target}.json`);
  const cache = await readJson(cachePath);
  const entriesBefore = Object.keys(cache).length;

  const translate = createTranslator({
    provider,
    sourceLanguage: args.source,
    targetLanguage: args.target,
    endpoint:
      args.endpoint ??
      (provider === "deepl" ? process.env.DEEPL_API_URL : process.env.LIBRETRANSLATE_URL),
    apiKey:
      provider === "deepl"
        ? process.env.DEEPL_API_KEY
        : process.env.LIBRETRANSLATE_API_KEY,
  });

  const source = await readFile(inputPath, "utf8");
  const result = await createTranslationDraft(source, {
    sourceLanguage: args.source,
    targetLanguage: args.target,
    translate,
    cache,
  });

  await mkdir(dirname(outputPath), { recursive: true });
  await mkdir(dirname(cachePath), { recursive: true });
  await writeFile(outputPath, result.markdown, "utf8");
  await writeFile(cachePath, `${JSON.stringify(cache, null, 2)}\n`, "utf8");

  const newEntries = Object.keys(cache).length - entriesBefore;
  process.stdout.write(`Draft: ${outputPath}\nNew translations: ${newEntries}\n`);
}

main().catch((error) => {
  process.stderr.write(`${error.message}\n`);
  process.exitCode = 1;
});
