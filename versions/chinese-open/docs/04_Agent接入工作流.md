# Agent 接入工作流

本页只放接入流程总览。细节拆到 `agent-workflow/`。

## 总流程

```text
用户目标 -> 语言树中枢 -> 找球门逆推 -> 全局态势模型
-> 作用域裁剪 -> 学科路线 -> thought_mode
-> ContextPack -> 工具动作契约 -> 高频坑位预检
-> ProposedAction / ApprovedAction -> Tool Gateway
-> ToolResultSummary -> 反思迭代 / 失败签名
-> 工程记忆 overlay -> FAME 更新候选
```

启动读取集合必须包含 `knowledge/language-tree-hub/thought_modes.json`，用于把任务压到 L0-L6 层级。

## 必读分片

- `agent-workflow/01_start-before-task.md`：启动前读取集合，包含 `thought_modes.json`。
- `agent-workflow/02_mandatory-flow.md`：强制工作流和 `tool_gateway_decision`。
- `agent-workflow/03_context-pack.md`：ContextPack 样例。
- `agent-workflow/04_association.md`：多路径联想。
- `agent-workflow/05_reflection.md`：失败反思和负值 FAME。
- `agent-workflow/06_metrics.md`：Agent 易用性评测。
- `agent-workflow/07_real-smoke.md`：实机烟测。

## 快捷入口

```bash
npm run route:chinese-open -- --goal "<用户目标>" --compact
node versions/chinese-open/tests/agent-effect-smoke.mjs
```
