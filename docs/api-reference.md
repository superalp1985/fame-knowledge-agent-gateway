# API Reference

Base URL:

```text
http://127.0.0.1:5191
```

`GET /health` is public. All other endpoints require:

```text
Authorization: Bearer <api_key>
```

or:

```text
x-fame-api-key: <api_key>
```

## Core Flow

### `POST /goal/resolve`

Resolve a user goal into a scoped route.

```json
{
  "goal": "route this implementation task",
  "scope": {
    "project_id": "fame-agent-gateway",
    "subject": "agent",
    "route_id": "agent/gateway",
    "task_id": "demo"
  }
}
```

### `POST /context/pack`

Build a summary-first context pack with refs and lazy-load boundaries.

### `POST /action/propose`

Run the Enforcement Kernel.

```json
{
  "action_id": "demo-route",
  "adapter": "http",
  "tool_id": "knowledge_router.route_knowledge",
  "purpose": "Route knowledge after reading the tool contract.",
  "scope": {
    "project_id": "fame-agent-gateway",
    "subject": "agent",
    "route_id": "agent/gateway",
    "task_id": "demo"
  },
  "manual_ref": "docs/runtime-gateway.md",
  "context_cost": 1200,
  "risk_level": "normal"
}
```

Successful response includes:

```text
approval_token = fame.approval.v1.<payload>.<signature>
```

### `POST /tool/execute`

Execute only after approval.

```json
{
  "approval_token": "fame.approval.v1....",
  "args": {
    "goal": "gateway enforcement"
  }
}
```

## Read Endpoints

```text
GET  /stats
GET  /agent/me
POST /knowledge/route
POST /sync/status
POST /events/list
POST /clock/list
POST /semantic/search
POST /assets/list
POST /trace/export
```

## Mutation Tools

These tool IDs must be executed through `propose_action -> execute_tool`:

```text
summary_memory.write
knowledge_patch.submit
clock.schedule
clock.run_due
semantic.rebuild
asset.index.sync
```

Their convenience HTTP endpoints intentionally return a blocked response when called directly.

## Safe Tool IDs

```text
knowledge_router.resolve_goal
knowledge_router.route_knowledge
context.pack
summary_memory.write
knowledge_patch.submit
sync.status
clock.schedule
clock.run_due
clock.list
semantic.rebuild
semantic.search
asset.index.sync
asset.list
trace.export
```

## Error Shapes

Unauthorized:

```json
{
  "error": "unauthorized",
  "message": "FAME Gateway API key required. Use Authorization: Bearer <key> or x-fame-api-key."
}
```

Blocked execution:

```json
{
  "executed": false,
  "status": "blocked",
  "blocked_reason": "approval_token required",
  "required_next_step": "Call propose_action/enforce_action first."
}
```
