# Security Policy

This project is designed to connect to local knowledge stores and agent tooling. Treat local knowledge data as private by default.

## Do Not Commit

- `knowledge_backup/`
- `.env` or `.env.*`
- generated indexes derived from private knowledge
- `runtime_store/`
- API keys, tokens, private URLs, credentials, logs, or local settings
- user data or proprietary documents

## Reporting

For now, report security concerns privately to the project maintainer before opening a public issue.

## Data Boundary

External web evidence may be used as temporary evidence, but it should not be written into the core knowledge net without review.

Raw multimodal assets should stay in an asset database/store. The public graph should contain only light indexes, summaries and refs unless the payload is explicitly cleared for publication.

## Runtime Boundary

Mutation tools must pass through:

```text
ProposedAction -> Enforcement Kernel -> HMAC ApprovedAction -> Tool Gateway
```

Do not expose the gateway beyond localhost without TLS, real API keys and a rotated `FAME_APPROVAL_SECRET`.
