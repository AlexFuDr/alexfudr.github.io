# ADR-002: Use YouTube for video hosting

## Status

Accepted

## Date

2026-10-14

## Context

The education site needs video without storing large media files in GitHub Pages. A separate video channel can also build an audience outside search traffic to the website. The website must remain useful when an embedded player is unavailable and must preserve citations, transcripts, and bilingual context.

## Decision

Host project videos on a dedicated YouTube channel. The website will provide an independent page for each video with a summary, transcript or detailed notes, chapters, references, thumbnail, and `VideoObject` structured data. Player integration will be implemented when the first real video and channel identifiers exist.

## Alternatives considered

- Store video in the repository or GitHub Pages: rejected because it is a poor fit for large media delivery and the project's static hosting constraints.
- Vimeo: viable, but rejected as the default because YouTube better supports the desired public channel and content-discovery workflow.
- Embed-only pages: rejected because they provide weak accessibility, evidence traceability, and resilience when third-party playback fails.

## Consequences

- YouTube handles encoding, streaming, and channel subscriptions.
- The site remains the canonical location for evidence context and readable transcripts.
- Embeds add a third-party privacy and availability dependency, so loading behavior must be reviewed when the player is implemented.
- Video files remain outside this repository.
