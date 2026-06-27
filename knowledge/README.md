# Public Knowledge Base

This directory is the sanitized public base of the FAME / 建木 knowledge net.

It is intentionally separate from `knowledge_backup/`:

- `knowledge/` is meant to be committed and improved by the open-source community.
- `knowledge_backup/` is local/private and may contain generated artifacts, settings, datasets, caches, or secrets.

The public base keeps readable knowledge-route materials such as Markdown, YAML, JSON, JSONL, TXT, and CSV files after path filtering and basic secret redaction.

## Scope

The workbench indexes this directory by default:

```text
knowledge/
-> knowledge roots
-> subject / route shards
-> file entries
-> headings, excerpts, keywords
```

Large generated artifacts, caches, benchmark runs, private settings, and training/evaluation datasets are excluded from this public base.

## Refreshing From Local Backup

```bash
npm run prepare:public-knowledge
npm run generate:knowledge
```

Before publishing a release, run a dedicated secret scan and license review.
