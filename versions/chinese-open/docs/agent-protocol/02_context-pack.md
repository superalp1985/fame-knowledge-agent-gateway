# 02 ContextPack

ContextPack 是本轮 Agent 可以带入上下文的最小包。

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
  "summaries": [],
  "content_refs": [],
  "rules": [],
  "negative_lessons": [],
  "context_budget": 2200
}
```

## 约束

- `thought_mode` 必须来自 `knowledge/language-tree-hub/thought_modes.json`。
- `route_ids` 必须可在 `knowledge/route_index.json` 找到。
- 完整日志和大文件不进 ContextPack，只放摘要和外部引用。
