# 03 ContextPack 样例

```json
{
  "edition_id": "chinese-open",
  "project_id": "example-project",
  "task_id": "task-001",
  "subject": "agent-tooling",
  "semantic_anchor": "language-tree-hub",
  "lexicon_refs": ["knowledge/language-tree-hub/lexicon_seed.json"],
  "route_ids": ["route-agent-tool-doc-first"],
  "abstraction_level": "L5_operation",
  "thought_mode": "L5_operation",
  "summaries": [{"ref": "route-agent-tool-doc-first", "summary": "先读工具说明和 schema。"}],
  "content_refs": [],
  "rules": [],
  "negative_lessons": [],
  "context_budget": 2200
}
```

不要把完整工具说明、完整日志或完整图谱塞进上下文。
