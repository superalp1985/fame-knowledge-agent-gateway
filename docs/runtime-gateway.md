# Runtime Gateway

The runtime gateway is the real execution boundary for FAME Knowledge Agent Gateway.

It is designed as a universal external agent plugin:

```text
Agent / IDE / CLI / Workflow
-> HTTP or MCP adapter
-> scoped knowledge routing
-> context pack
-> ProposedAction
-> Enforcement Kernel
-> signed ApprovedAction
-> Tool Gateway
-> event store / project memory / asset DB light index
```

## Security Model

`GET /health` is public. All other HTTP endpoints require:

```text
Authorization: Bearer <api_key>
```

or:

```text
x-fame-api-key: <api_key>
```

The default local development key is `dev-fame-agent-key`. Set these before real use:

```bash
FAME_GATEWAY_DEV_API_KEY=...
FAME_MCP_API_KEY=...
FAME_APPROVAL_SECRET=...
```

The gateway stores API key hashes, not raw keys. Approval tokens are HMAC-signed:

```text
fame.approval.v1.<payload>.<signature>
```

The Tool Gateway validates:

```text
signature
approval DB record
expiry
unused status
agent_id
project_id / subject / route_id / task_id
adapter
tool_id
agent ACL
```

## Flow

```text
resolve_goal / route_knowledge
-> pack_context
-> propose_action
-> ApprovedAction + signed approval_token
-> execute_tool
-> ToolResult event
```

Direct execution without `approval_token` is blocked.

Mutation tools are also blocked when called directly through their convenience HTTP endpoints. The enforced path is:

```text
propose_action -> execute_tool
```

This applies to:

```text
summary_memory.write
knowledge_patch.submit
clock.schedule
clock.run_due
semantic.rebuild
asset.index.sync
```

## Memory Policy

The gateway preserves the project rule:

```text
Full Memory Retention
```

Raw memory, traces, tool results and lessons are retained in storage. Context packing only controls what enters the active model context:

```text
summary + refs + lazy-load raw records
```

Derived indexes such as `semantic_terms` may be rebuilt. They are not memory deletion.

## HTTP

Start:

```bash
npm run gateway
```

Default:

```text
http://127.0.0.1:5191/
```

Endpoints:

```text
GET  /health
GET  /stats
GET  /agent/me
POST /goal/resolve
POST /knowledge/route
POST /context/pack
POST /action/propose
POST /action/enforce
POST /tool/execute
POST /summary/write
POST /patch/submit
POST /sync/status
POST /events/list
POST /clock/schedule
POST /clock/run-due
POST /clock/list
POST /semantic/rebuild
POST /semantic/search
POST /assets/sync
POST /assets/list
POST /trace/export
```

## MCP

Start:

```bash
npm run gateway:mcp
```

For stdio MCP, pass `api_key` in tool arguments or set `FAME_MCP_API_KEY`.

Tools:

```text
resolve_goal
route_knowledge
pack_context
propose_action
execute_tool
write_summary
submit_patch
get_sync_status
schedule_clock
run_due_clocks
semantic_search
rebuild_semantic_index
sync_asset_index
list_assets
export_trace
```

Resources:

```text
fame://runtime/stats
fame://sync/status
fame://assets/index
```

## Store

SQLite file:

```text
runtime_store/gateway/gateway.sqlite
```

Tables:

```text
events
approvals
checkpoints
agents
scheduler_jobs
semantic_documents
semantic_terms
asset_records
asset_sync_records
```

The store is append-first for real memory. Core knowledge files are not modified directly; core updates must be submitted as `KnowledgePatchProposal`.

## Asset Boundary

Multimodal payloads stay in the asset database/store. The graph and runtime context keep only:

```text
asset_id
label
summary/caption
db_ref
object_ref
text_ref
route_refs
subject_refs
FAME summary
```

Manual graph edits can call `asset.index.sync` so the asset DB light index stays aligned with knowledge graph changes.

## Semantic Index

The current local index is a SQLite BM25-ish inverted index over:

```text
core knowledge entries
project memory nodes
multimodal asset light indexes
```

Search is scoped by:

```text
project_id / subject / route_id
```

If strict route scope returns no result, the search widens to subject, project, then global fallback. This keeps large graphs efficient while still giving the agent a useful route when the exact local shard has not been populated.
