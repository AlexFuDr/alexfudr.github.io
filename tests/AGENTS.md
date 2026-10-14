# Test context

- Tests use the built-in `node:test` runner and live in `tests/*.test.mjs`.
- Test observable behavior and generated output, not private implementation details.
- External translation services must be represented by injected deterministic fakes; tests must not use the network or real credentials.
- Add a failing regression test before fixing behavior.
- `npm test` is the focused suite; `npm run verify` is the full project gate.
