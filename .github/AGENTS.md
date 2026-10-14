# Deployment context

- GitHub Pages deployment is static and runs from `master` through `.github/workflows/deploy.yml`.
- Preserve the `npm run verify` build gate before deployment.
- Use official GitHub/Astro actions and narrowly scoped permissions.
- Do not add repository secrets or external deployment services without explicit user approval.
- Workflow changes must keep local `npm run verify` behavior aligned with CI.
