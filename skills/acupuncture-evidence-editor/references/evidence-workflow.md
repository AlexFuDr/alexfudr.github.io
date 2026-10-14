# Evidence workflow

## Local resources

- Nordon CLI: `nordon`
- Workspace: `/Users/bathe/Documents/NordonWorkspace`
- General strategy: `config/strategies/acupuncture_literature.yaml`
- Topic database: `data/acupuncture.db`
- Standalone retrieval: `scripts/acupuncture_search.py`
- Reading list: `docs/acupuncture_reading_list.docx`

The existing database is a discovery index, not a publication-ready evidence base. At the time this skill was created it contained 433 paper records and 408 abstracts, but no parsed full text, DOI values, PMC articles, or extracted evidence records. Recheck its state rather than assuming these counts remain current.

## Define the question first

Turn a broad topic into an answerable question before retrieval. Record:

- population or reader context;
- intervention and relevant comparator;
- outcomes, including harms;
- study designs needed;
- date, language, and setting boundaries;
- whether the page concerns efficacy, safety, mechanism, history, or patient experience.

Do not use the broad acupuncture strategy as the final search for a condition-specific page. Create or adapt a narrow, version-controlled YAML strategy for the question.

## Retrieve reproducibly

1. Inspect the proposed query with `nordon fetch --strategy NAME --dry-run`.
2. Check that synonyms, MeSH terms, outcomes, comparators, and major spelling variants are represented.
3. Execute the strategy and retain its query ID, search date, query text, and PMID set.
4. Search for current clinical guidelines separately; PubMed alone is not a complete guideline source.
5. Deduplicate related publications and identify corrections, retractions, protocols, and secondary analyses.

Prefer the standalone acupuncture script when isolation in `acupuncture.db` matters. Do not silently write acupuncture results into an unrelated research database.

## Appraise before synthesis

Prioritize:

1. current authoritative clinical guidelines;
2. systematic reviews with transparent methods and certainty assessment;
3. randomized controlled trials;
4. well-designed observational safety studies;
5. mechanistic and preclinical work;
6. historical or traditional sources for historical claims only.

For each consequential source, inspect the original abstract and, when needed, full text. Record study design, sample, comparator, outcome definition, effect estimate, uncertainty, follow-up, adverse events, funding, conflicts, and major bias risks.

Treat sham acupuncture and usual-care comparisons as different questions. Do not pool or narrate them as interchangeable. Distinguish statistical significance from clinical importance.

## Synthesize

- Organize findings by outcome and comparator.
- State when reviews overlap or reuse the same trials.
- Give absolute effects when reliable and interpretable; otherwise avoid manufacturing them.
- Separate efficacy, effectiveness, safety, and mechanism.
- Explain heterogeneity and conflicting results.
- Use a plain certainty label: `higher`, `moderate`, `low`, or `very low/uncertain`, with a short rationale. Do not claim formal GRADE unless a source or a documented assessment actually used it.

## Traceability gate

Before handing evidence to the editorial workflow:

- every key number resolves to a PMID, DOI, guideline URL, or stable publisher record;
- citations support the exact nearby claim;
- corrections and retractions have been checked;
- Nordon summaries have been compared with their sources;
- absence of evidence is not phrased as evidence of no effect;
- search limitations and unresolved questions are recorded.
