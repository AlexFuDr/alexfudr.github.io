# ADR-001: Use hierarchical agent context

## Status

Accepted

## Date

2026-10-14

## Context

The repository combines a static website, bilingual medical content, evidence-retrieval rules, translation automation, tests, and deployment. Loading all project documentation for every task wastes context and makes unrelated instructions compete for attention.

## Decision

Use a concise root `AGENTS.md` for global invariants and add scoped `AGENTS.md` files only at meaningful ownership boundaries. Detailed medical instructions remain in the project-local skill and are loaded progressively through its routing rules.

## Alternatives considered

- One large root instruction file: rejected because routine layout or deployment work does not need the medical editorial corpus.
- An instruction file in every directory: rejected because it duplicates rules and increases maintenance and context cost.
- Rely only on README files: rejected because human onboarding and task-scoped agent instructions serve different purposes.

## Consequences

- Routine tasks load less irrelevant context.
- Content work still receives strict medical and bilingual constraints.
- New directories inherit the nearest parent until they form a genuinely different responsibility boundary.
- Moving files across boundaries may change applicable instructions and must be reviewed deliberately.
