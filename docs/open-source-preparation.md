# Open Source Preparation

The codebase is being organized so the runtime and workbench can be shared without exposing private knowledge data.

## Public

- source code
- schemas
- docs
- examples
- sanitized public knowledge base under `knowledge/`
- sanitize manifest and report under `knowledge/`

## Private / Local

- `knowledge_backup/`
- generated indexes from private knowledge
- local logs and run outputs
- env files

## Release Checklist

- Run `npm run prepare:public-knowledge`.
- Review `knowledge/SANITIZE_REPORT.md`.
- Run `npm run generate:knowledge`.
- Run `npm run build`.
- Check `.gitignore`.
- Remove private generated files or regenerate from `knowledge/`.
- Run a secret scan before publishing.
- Replace private screenshots or local paths with public examples.

## Knowledge Base Policy

`knowledge/` is the open-source collaboration base. It is produced from local knowledge by a sanitizer that copies readable knowledge-route files, skips noisy/generated/private paths, and applies pattern-based redaction.

`knowledge_backup/` remains ignored because it may contain local settings, datasets, benchmark runs, generated outputs, and secrets.
