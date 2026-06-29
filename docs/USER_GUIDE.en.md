# FAME Knowledge Agent Gateway User Guide

## 1. What This Project Is

FAME Knowledge Agent Gateway is an external memory and execution-governance system for agents. It combines a knowledge graph, project memory, tool-call governance, FAME route feedback, visualization and a runtime gateway into one plugin-style system.

The project is not plain RAG and not plain chat memory. Its goal is to make agents work through engineering routes:

```text
goal
-> scoped project / subject / route
-> Language Tree and knowledge graph
-> abstraction and association
-> FAME route evaluation
-> context packing
-> proposed tool action
-> approval gateway
-> tool execution
-> retained evidence, lessons and traces
```

Good fit:

- long-running software projects
- multi-agent workflows
- tool-heavy agent automation
- graph-based reasoning beyond retrieval
- external project memory that survives context limits

## Quick Start

On Windows:

```powershell
.\start.ps1
```

or:

```bat
start.bat
```

Open:

```text
http://127.0.0.1:5178/
```

Then go to `Agent Runtime` and use the first-run wizard. Pick `chinese-open` or `english`, choose an Agent preset, copy the connection message, generate config snippets, and confirm after the Agent replies.

Manual checks:

```bash
npm run check:english
npm run check:editions
npm run doctor:english
npm run eval:english
npm run route:english -- --goal "run npm test after confirming package root" --compact
```

Packaging:

```bash
npm run package:portable
docker compose up --build
```

## 2. Core Ideas

### 2.1 Language Tree Hub

The Language Tree is the center of the knowledge system. It turns a user goal into routeable intent, terminology, constraints, semantic abstractions, expression plans and validation language.

Professional knowledge should grow around the Language Tree instead of becoming isolated subject silos. This helps an agent understand what the problem means before deciding which subject, route or tool should be used.

### 2.2 FAME Route Parameters

Routes and edges carry FAME parameters:

```text
mu       effectiveness
chi      exploration value
epsilon  fit with goal and semantics
kappa    confidence
nu       risk and uncertainty
delta    logical conflict
rho      resource and context pressure
lambda   failure lesson weight
```

These values are updated by builds, tests, tool results, human review and failure analysis. Successful routes become more trustworthy. Failed routes are retained as lessons instead of being deleted.

### 2.3 Project Memory Overlay

The core knowledge net stores reusable knowledge. Project Memory stores real implementation history for a specific project.

Project Memory does not directly pollute the core knowledge net. A project lesson can become a core-knowledge candidate only after review or promotion.

### 2.4 Tool Governance

Agents should not directly execute risky or mutating tools. The enforced path is:

```text
ProposedAction -> ApprovedAction -> Tool Gateway -> ToolResult
```

This reduces failures caused by incorrect parameters, stale context, wrong paths, missing permissions or unsafe mutation calls.

### 2.5 Context Health

The system does not push the whole graph into the model context. It loads only what is needed:

```text
current_intent
route_summary_top_k
abstraction_summary
fame_state_summary
recent_relevant_lessons
active_constraints
```

After a task finishes, full traces and raw records remain in external storage. The active model context keeps summaries, references and the next useful state.

## 3. Repository Layout

```text
.
|-- workbench/              3D/2D visual workbench
|-- runtime_server/         HTTP/MCP gateway and SQLite runtime
|-- docs/                   documentation and user guides
|-- examples/               sample clients
|-- scripts/                knowledge sanitizer, generators and release checks
|-- knowledge/              current Chinese public knowledge base
|-- versions/english/       English seed edition
|-- asset_store/            multimodal light-index examples
|-- memory/                 project-memory overlay examples
|-- runtime_store/          local runtime data, ignored
`-- knowledge_backup/       private knowledge backup, ignored
```

## 4. Requirements

- Node.js 24 or newer.
- npm.

Node 24 is required because the runtime gateway currently uses Node's built-in `node:sqlite`.

## 5. Install And Run

Install dependencies:

```bash
npm run install:all
```

Generate local indexes:

```bash
npm run generate:all
```

Start the visual workbench:

```bash
npm run dev
```

Open:

```text
http://127.0.0.1:5178/
```

Start the HTTP runtime gateway:

```bash
npm run gateway
```

Default URL:

```text
http://127.0.0.1:5191/
```

Start the MCP stdio gateway:

```bash
npm run gateway:mcp
```

## 6. Using The Workbench

### 6.1 Agent External Brain Console

The Workbench opens on `Agent 外脑 / Agent External Brain`. This view does not replace the 3D or 2D graph. It aggregates the runtime controls that matter before an agent uses tools:

- `Safety Stoplight`: shows whether the current `ProposedAction` has an `ApprovedAction`.
- `Action Contract Approval Flow`: Scope, ContextPack, ProposedAction, ApprovedAction, ToolResultSummary and Memory Writeback.
- `Dynamic Immune Net`: SCAC feedback, route posterior, build/test/tool feedback and policy blocks.
- `Failure Signature Heat Zone`: negative FAME edges, retained failure lessons and blocked/failed feedback.
- `Context Throttle`: what stays in context, what is released, and what can be lazy-loaded later.

Users should check the Agent External Brain first. Use `Agent Runtime` for local agent connection, `3D Universe` for global graph orientation, and `2D Detail` for route editing.

### 6.2 3D Knowledge Universe

The 3D graph is for global orientation:

- Drag to rotate or pan.
- Scroll to zoom.
- Search nodes, routes, files, project memory and asset indexes.
- Negative or risky FAME routes are visually distinguished.
- Double-click a 3D node to open the matching 2D local route.

The 3D graph is intentionally an overview. It should not render every low-level node in a large project.

### 6.3 2D Route Detail

The 2D graph is for local inspection and editing:

- inspect nodes and edges inside the selected route
- double-click a module to edit it
- add, modify or delete modules and paths in the local view
- inspect FAME parameters, failure lessons and sync state

### 6.4 Text Directory Index

The text directory is for hierarchical navigation by subject. Large graphs become hard to browse visually, so the directory helps users and agents locate the right region before moving into 3D or 2D graph views.

## 7. Agent Integration

### 7.1 Workbench Local Agent Wizard

The `Agent Runtime` view includes a local Agent connection wizard. It does not silently rewrite a user's Codex, Cursor, Claude Desktop or generic Agent configuration. It provides an explicit confirmation flow:

```text
select local Agent
-> check the connection command and required entry files
-> copy/send the Agent integration message
-> user confirms the Agent has acknowledged the integration
```

The generated message tells the Agent to route through the Language Tree, scope by `subject / route_id`, produce `ProposedAction` before tool calls, require `ApprovedAction` for high-risk actions, and write `ToolResultSummary` after execution. It also tells the Agent to use `route-powershell-encoding-output` before treating PowerShell Chinese mojibake as real file corruption.

The preset list covers Codex, Cursor, Claude Desktop, Claude Code, OpenAI Agents SDK, Gemini CLI, OpenHands, SWE-agent, Aider, Cline, Roo Code, Continue, LangGraph, AutoGen, CrewAI, Dify and Generic Agent. Use `Other / Custom Agent` for new tool-using agents such as OpenClaw or Hermes.

The real CLI check remains:

```bash
npm run connect:chinese-open -- --agent codex
```

Use the Workbench wizard for human-friendly confirmation. Use CLI, HTTP or MCP for automated Agent integration.

### 7.2 HTTP Integration

Every HTTP endpoint except `/health` requires an API key:

```text
Authorization: Bearer dev-fame-agent-key
```

Common endpoints:

```text
GET  /health
GET  /stats
GET  /agent/me
POST /goal/resolve
POST /knowledge/route
POST /context/pack
POST /action/propose
POST /tool/execute
POST /summary/write
POST /patch/submit
POST /clock/schedule
POST /semantic/search
POST /assets/sync
POST /trace/export
```

Typical flow:

```text
resolve goal
-> route knowledge
-> pack context
-> propose action
-> execute tool with approval_token
-> write summary / trace / feedback
```

See:

```text
examples/http-client/approved-tool-call.mjs
```

### 7.3 MCP Integration

MCP tools:

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

Agents should follow this order:

```text
resolve_goal -> route_knowledge -> pack_context -> propose_action -> execute_tool
```

Do not let agents bypass the approval chain for mutation tools.

## 8. Knowledge Maintenance

### 8.1 Chinese Edition

The current public Chinese knowledge base is:

```text
knowledge/
```

The private original knowledge backup is:

```text
knowledge_backup/
```

`knowledge_backup/` is ignored by git and should not be published.

To regenerate public knowledge from the private source:

```bash
npm run prepare:public-knowledge
npm run generate:all
```

Review:

```text
knowledge/SANITIZE_REPORT.md
knowledge/PUBLIC_KNOWLEDGE_MANIFEST.json
```

### 8.2 English Edition

The English seed edition is:

```text
versions/english/
```

Current structure:

```text
Language Tree Hub
-> Professional Knowledge
   -> Programming
   -> Design
```

It is a placeholder seed for now. Future expansion should keep:

- pure English naming
- Language Tree-centered organization
- Programming and Design growing around the Language Tree
- unchanged route, FAME and failure-lesson mechanisms
- Chinese and English knowledge isolated unless a cross-edition route is explicitly designed

## 9. Multimodal Data

The knowledge graph should not store heavy multimodal payloads directly. Recommended boundary:

```text
asset database / object store
-> asset_id
-> caption / summary
-> preview ref
-> text ref
-> object ref
-> route refs
-> FAME summary
```

The graph stores previews and indexes. Raw images, audio, video and documents stay in a database or object store.

Manual graph edits can trigger asset index sync so database information stays aligned with graph references.

## 10. Evaluation Metrics

Track:

- tool success rate
- context tokens saved
- failure recurrence reduction
- route convergence
- scoped search hit rate
- human review override rate

Run the gateway smoke test:

```bash
npm run gateway:smoke
```

Run the full gate:

```bash
npm run ci
```

## 11. Open-Source Release Flow

Before publishing:

```bash
npm run prepare:public-knowledge
npm run generate:all
npm run release:check
npm run gateway:smoke
npm run lint
npm run build
```

Or:

```bash
npm run ci
```

Manual checks:

- `.env` is not committed.
- `runtime_store/` is not committed.
- `knowledge_backup/` is not committed.
- generated indexes do not contain private excerpts.
- theory PDFs, public knowledge and sample assets have clear license and attribution status.
- development API keys and approval secrets are replaced before any non-local deployment.

## 12. FAQ

### Why not plain RAG

Plain RAG mainly answers "which documents should I read?" This project answers "which route should an agent follow, which tool is allowed, what feedback was verified, and how do we avoid repeating failures?"

### Why retain failed routes

Failed routes are useful lessons. FAME risk and lesson parameters help future agents avoid repeated mistakes or request human review.

### Why not store raw multimodal data in the graph

Raw multimodal data makes the graph heavy. The graph should store lightweight indexes, summaries, previews and references; raw assets belong in a database or object store.

### Why use a runtime gateway

Large models often know tool usage patterns but still fail in real engineering because of wrong paths, stale context, permissions or malformed parameters. The runtime gateway separates "the agent wants to act" from "the action is approved and executable."
