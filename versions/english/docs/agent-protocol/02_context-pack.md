# 02 ContextPack

ContextPack is the small context bundle for the current task.

```json
{
  "edition_id": "english",
  "project_id": "example-project",
  "task_id": "task-001",
  "subject": "agent-tooling",
  "semantic_anchor": "language-tree-hub",
  "route_ids": ["route-agent-tool-action-contract"],
  "thought_mode": "L5_operation",
  "summaries": [],
  "content_refs": [],
  "negative_lessons": [],
  "context_budget": 2200
}
```

`thought_mode` comes from `knowledge/language-tree-hub/thought_modes.json`. Long logs and raw files stay outside active context.
