# MCP Integration

The runtime server can run as a stdio MCP server:

```bash
npm run gateway:mcp
```

For local development, the default API key is:

```text
dev-fame-agent-key
```

For real usage, set:

```bash
FAME_MCP_API_KEY=...
FAME_APPROVAL_SECRET=...
```

You can also pass `api_key` inside each tool call argument object.

## Tools

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

## Resources

```text
fame://runtime/stats
fame://sync/status
fame://assets/index
```

## Required Agent Flow

Agents should use this sequence:

```text
resolve_goal
-> route_knowledge
-> pack_context
-> propose_action
-> execute_tool
```

Mutation tools are blocked if the model tries to call them directly.

## Example Tool Call Arguments

```json
{
  "action_id": "mcp-demo-route",
  "adapter": "mcp",
  "tool_id": "knowledge_router.route_knowledge",
  "purpose": "Route knowledge through MCP after reading the tool contract.",
  "scope": {
    "project_id": "fame-agent-gateway",
    "subject": "agent",
    "route_id": "agent/gateway",
    "task_id": "mcp-demo"
  },
  "manual_ref": "mcp://tool/route_knowledge",
  "context_cost": 1200,
  "risk_level": "normal",
  "api_key": "dev-fame-agent-key"
}
```

## Prompt Contract

The server exposes a `fame_work_start_alignment` prompt. It reminds agents to resolve scope, pack context and request approval before tool execution.
