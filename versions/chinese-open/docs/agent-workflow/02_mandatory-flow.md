# 02 强制工作流

工程类任务优先读取：

- `route-language-goal-backcasting`
- `route-language-global-situation-model`
- `route-agent-tool-action-contract`
- `route-agent-stability-preflight`

`thought_modes.json` 用来把任务压到 L0-L6 层级，再决定工具粒度、验证方式和停止条件。

## 工具闸门

外部 Agent 必须看 `tool_gateway_decision`：

```text
if blockers.length > 0: block
if requires_approved_action: ask for approval
if requires_proposed_action: require ProposedAction
else: allow read-only execution
```

失败后不能盲试，同类失败先进入 `route-agent-reflection-improvement`。
