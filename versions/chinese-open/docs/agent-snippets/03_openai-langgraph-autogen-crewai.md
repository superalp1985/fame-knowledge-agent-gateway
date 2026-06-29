# 03 SDK / 多 Agent 框架

适用：OpenAI Agents SDK、LangGraph、AutoGen、CrewAI。

把 `tool_gateway_decision` 当作 tool guardrail 输入：

```text
if blockers.length > 0: block
if requires_approved_action: ask for approval
if requires_proposed_action: require ProposedAction
else: allow read-only execution
```

把 `ToolResultSummary` 写入 trace 或工程记忆。

LangGraph / LangMem 把 `ContextPack` 写入 checkpoint，把完整工具事件写入 store。核心知识网只保存摘要、路线引用和 FAME 更新候选。

AutoGen / CrewAI 需要把每个 agent/tool/task 都压成同一份工具动作契约，避免各角色绕过 Tool Gateway。
