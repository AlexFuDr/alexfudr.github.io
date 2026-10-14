# Context map

The repository uses hierarchical `AGENTS.md` files so an agent loads the smallest context needed for the path being changed. Root instructions always apply; deeper files add only local constraints.

| Scope | Load for | Additional context |
| --- | --- | --- |
| `/` | Every task | Mission, stack, global constraints, verification command |
| `/docs` | Requirements and decisions | PRD, translation workflow, relevant ADR only |
| `/src` | Astro pages, layouts, components, styles | Static architecture and localization rules |
| `/src/content` | Collection schema | Front-matter and draft behavior |
| `/src/content/articles` | Medical content | Project-local acupuncture skill and only its routed references |
| `/scripts` | Authoring automation | Translation safety, cache, providers, credential rules |
| `/tests` | Automated tests | Runner, test boundaries, verification strategy |
| `/public` | Root static files | Hosting and crawler constraints |
| `/skills` | Project-local instruction maintenance | Skill scope and progressive disclosure |
| `/.github` | Deployment | GitHub Pages workflow and permissions |

Subdirectories without their own `AGENTS.md` inherit the nearest parent. This is intentional: adding files to every leaf directory would duplicate instructions and increase context usage.

## Context budget rules

1. Start with root plus the nearest scoped `AGENTS.md` files.
2. Load the PRD only for product-scope questions.
3. Load medical evidence references only for article or claim work.
4. Load translation workflow documentation only for setup or editorial handoff; script constraints live next to the scripts.
5. Read code and tests relevant to the requested change instead of scanning the entire repository.
6. Record durable decisions in an ADR; keep temporary task state out of permanent instructions.
