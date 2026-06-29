# 04 ProposedAction

变更性动作必须先写 `ProposedAction`。高风险动作再等待 `ApprovedAction` 或等价人工确认。

```json
{
  "kind": "ProposedAction",
  "action_id": "task-001-scenario-jsonl-knowledge-edit",
  "project_id": "example-project",
  "task_id": "task-001",
  "route_refs": ["route-agent-tool-action-contract"],
  "tool_name": "tool or command",
  "operation_type": "read | write | delete | move | network | execute | test | build | publish",
  "scope": {
    "working_directory": "project root or target directory",
    "paths": [],
    "subjects": [],
    "allowed_side_effects": []
  },
  "arguments": {},
  "risk_level": "read_only | low | medium | high | critical",
  "expected_output": "observable result",
  "validation_plan": [],
  "rollback_plan": [],
  "requires_approval": false
}
```

`scope.working_directory` 是必填项。路径边界不清时不允许执行写入、删除、移动、发布或脚本执行。
