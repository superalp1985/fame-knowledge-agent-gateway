# FAME Knowledge Agent Gateway

FAME Knowledge Agent Gateway is an open-source external memory and governance plugin for agents.

It is not plain RAG and not plain chat memory. The system is route-first:

```text
goal
-> scoped knowledge route
-> abstraction and association
-> FAME edge evaluation
-> context pack
-> ProposedAction
-> Enforcement Kernel
-> signed ApprovedAction
-> Tool Gateway
-> retained memory / trace / asset index
```

## What It Provides

- 3D knowledge universe for large-scale overview.
- 2D route detail for scoped editing and local graph inspection.
- Search across knowledge nodes, route shards, project memory and assets.
- FAME route parameters for confidence, emotional signal, risk and lesson weighting.
- Project Memory overlay so implementation memory does not pollute the core knowledge net.
- HTTP gateway for non-MCP agents and workflows.
- MCP stdio gateway for agent tools/resources/prompts.
- API-key agent auth and per-agent ACL.
- HMAC-signed ApprovedAction tokens.
- Tool Gateway that blocks mutation tools unless they pass the approval chain.
- Durable ClockEvent scheduler for reminders and resume points.
- SQLite semantic index with project/subject/route scoping.
- Multimodal asset DB light-index adapter.
- OpenTelemetry-style trace export.

## Repository Layout

```text
.
|-- workbench/              # React + Three.js + React Flow workbench
|-- runtime_server/         # HTTP/MCP gateway, SQLite store, enforcement kernel
|-- docs/                   # Open-source docs
|-- examples/               # Client and sample knowledge examples
|-- scripts/                # Public knowledge sanitizer and release checks
|-- knowledge/              # Chinese/public knowledge-net base for the current edition
|-- versions/               # Edition notes and the English seed knowledge base
|-- asset_store/            # Public sample asset light indexes
|-- memory/                 # Public sample project-memory overlay
|-- runtime_store/          # Local runtime artifacts, ignored
`-- knowledge_backup/       # Private local knowledge, ignored
```

## Editions

- Chinese Edition: the current full version in the repository root, including the workbench, runtime gateway, public Chinese knowledge net, project-memory overlay and multimodal light index.
- English Edition: a clean English seed under `versions/english/`. Its knowledge structure starts from a `Language Tree Hub`, with `Programming` and `Design` as professional knowledge placeholders for later subject-by-subject expansion.

## Requirements

- Node.js 24 or newer.
- npm.

Node 24 is required because the runtime gateway currently uses Node's built-in `node:sqlite` module.

## Quick Start

```bash
npm run install:all
npm run generate:all
npm run dev
```

Open:

```text
http://127.0.0.1:5178/
```

## Runtime Gateway

Start the HTTP gateway:

```bash
npm run gateway
```

Default URL:

```text
http://127.0.0.1:5191/
```

Except for `/health`, HTTP calls require an API key:

```text
Authorization: Bearer dev-fame-agent-key
```

For real deployment, set:

```bash
FAME_GATEWAY_DEV_API_KEY=...
FAME_MCP_API_KEY=...
FAME_APPROVAL_SECRET=...
```

Tool execution is blocked unless the caller first receives an HMAC-signed `approval_token` through `propose_action`.

## MCP

Start the MCP stdio server:

```bash
npm run gateway:mcp
```

MCP tools include:

```text
resolve_goal
route_knowledge
pack_context
propose_action
execute_tool
get_sync_status
schedule_clock
run_due_clocks
semantic_search
rebuild_semantic_index
sync_asset_index
list_assets
export_trace
```

See [MCP integration](docs/mcp-integration.md).

## Test

```bash
npm run release:check
npm run gateway:smoke
npm run lint
npm run build
```

Or run the combined gate:

```bash
npm run ci
```

## Public Knowledge Policy

`knowledge/` is the public collaboration base. It is produced from local/private knowledge by:

```bash
npm run prepare:public-knowledge
```

`knowledge_backup/` is private and ignored. Do not publish it.

The sanitizer performs path filtering, basic secret redaction and local-path redaction. It is an audit aid, not a legal or security guarantee. Run an independent secret scan and license review before public release.

## Documentation

- [Runtime Gateway](docs/runtime-gateway.md)
- [API Reference](docs/api-reference.md)
- [MCP Integration](docs/mcp-integration.md)
- [Deployment](docs/deployment.md)
- [Knowledge Indexing](docs/knowledge-indexing.md)
- [Workbench Architecture](docs/workbench-architecture.md)
- [Release Checklist](docs/release-checklist.md)

## Security

Read [SECURITY.md](SECURITY.md).

Do not commit:

- `.env`
- real API keys or approval secrets
- local runtime databases
- private knowledge data
- raw multimodal payloads that are not cleared for publication

## License

Apache License 2.0. See [LICENSE](LICENSE).
