# 05 ToolResultSummary

每次工具执行后都写 `ToolResultSummary`。

```json
{
  "kind": "ToolResultSummary",
  "action_id": "task-001-scenario-jsonl-knowledge-edit",
  "tool_name": "tool or command",
  "status": "success | failure | partial | skipped",
  "summary": "short evidence-backed summary",
  "evidence": [],
  "errors": [],
  "next_steps": [],
  "fame_update_candidates": [
    {
      "route_ref": "route-id",
      "delta": 0,
      "reason": "short evidence-backed reason"
    }
  ]
}
```

长日志、完整工具输出和原始 trace 写入工程记忆 overlay 或数据库。上下文只保留摘要、证据和引用。
