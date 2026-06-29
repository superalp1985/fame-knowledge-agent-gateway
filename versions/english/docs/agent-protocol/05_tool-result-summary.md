# 05 ToolResultSummary

Write `ToolResultSummary` after every tool call.

```json
{
  "kind": "ToolResultSummary",
  "action_id": "task-001",
  "tool_name": "tool or command",
  "status": "success | failure | partial | skipped",
  "summary": "short evidence-backed summary",
  "evidence": [],
  "errors": [],
  "next_steps": [],
  "fame_update_candidates": []
}
```

Store raw logs and full traces in project memory or a database. Keep only summaries and evidence refs in context.
