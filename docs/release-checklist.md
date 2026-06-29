# Release Checklist

Run before publishing:

```bash
npm run prepare:public-knowledge
npm run generate:all
npm run release:check
npm run gateway:smoke
npm run lint
npm run build
npm run build:release-assets
```

Or:

```bash
npm run ci
```

## Data Review

- Confirm `knowledge_backup/` is not present in the public commit.
- Review `knowledge/SANITIZE_REPORT.md`.
- Review `knowledge/PUBLIC_KNOWLEDGE_MANIFEST.json`.
- Confirm local absolute paths are redacted.
- Confirm raw multimodal payloads are not included unless intentionally public.
- Confirm `asset_store/` contains only light indexes and refs.

## Security Review

- Replace dev API keys and approval secrets before deployment.
- Do not commit `.env`.
- Run an independent secret scanner.
- Review generated indexes for private excerpts.
- Review license compatibility of public knowledge and assets.
- Review license/copyright status of theory PDFs under `方案设计/theory/` before publishing them in a public repository.

## License Review

- Project source is released under Apache-2.0.
- Public knowledge, sample assets, design notes and theory PDFs should be reviewed before publication because they may have their own source or attribution constraints.
- Add or update `NOTICE` before release if any retained material requires attribution beyond the root license.

## Functional Review

- Workbench starts on `127.0.0.1:5178`.
- Gateway starts on `127.0.0.1:5191`.
- `/health` returns ready.
- Protected endpoints require an API key.
- Direct mutation endpoints are blocked.
- ApprovedAction token execution succeeds.
- MCP tools list includes semantic, scheduler, asset and trace tools.

## GitHub Release Assets

Before creating a public release, verify:

- `.tmp/release/fame-knowledge-agent-gateway-v<version>-portable.zip` exists.
- `.tmp/release/fame-knowledge-agent-gateway-v<version>-portable.zip.sha256` exists.
- `.tmp/release/install.ps1` exists and contains the correct GitHub repository.
- `.tmp/release/RELEASE_NOTES.md` includes the Windows one-click install command.

Release automation is handled by `.github/workflows/release.yml`. It runs `npm run build:release-assets`, uploads workflow artifacts, then creates or updates the GitHub Release with the portable zip, checksum, installer and manifest.

## Known Technical Note

The runtime currently uses Node 24 `node:sqlite`, which is still experimental. This keeps the first open-source version dependency-light. A future release can add an adapter for `better-sqlite3`, `libsql` or a hosted database.
