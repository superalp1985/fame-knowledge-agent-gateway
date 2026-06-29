# Agent 协议与最小接入

本页只放外部 Agent 的最短入口。详细规则拆到 `agent-protocol/`，按需读取。

## 先读这 5 个

1. `knowledge/route_index.json`
2. `knowledge/indexes/subject_index.json`
3. `knowledge/language-tree-hub/core.json`
4. `knowledge/language-tree-hub/thought_modes.json`
5. `knowledge/agent-tooling/stability_scenarios.json`

## 最小闭环

```text
语言树归一 -> subject/route_id -> ContextPack
-> ProposedAction -> Tool Gateway / ApprovedAction
-> ToolResultSummary -> failure_signature/FAME 候选
```

不要全量加载知识网，不要把长日志塞进上下文，不要跳过工具动作契约。

## 必读分片

- `agent-protocol/01_startup-read-set.md`：启动读取集合。
- `agent-protocol/02_context-pack.md`：ContextPack 最小字段，包含 `thought_mode`。
- `agent-protocol/03_tool-loop.md`：工具调用六步闭环。
- `agent-protocol/04_proposed-action.md`：`ProposedAction` 和 `working_directory` 字段。
- `agent-protocol/05_tool-result-summary.md`：`ToolResultSummary`。
- `agent-protocol/06_enforcement-rules.md`：强制规则。
- `agent-protocol/07_cli-and-wizard.md`：CLI、Workbench 接入和 Agent 预设。
- `agent-protocol/08_ecosystem-mapping.md`：MCP、OpenAI Agents SDK、LangGraph、LlamaIndex 映射。

生态映射见 `agent-protocol/08_ecosystem-mapping.md`：MCP、OpenAI Agents SDK、LangGraph / LangMem、LlamaIndex、AutoGen / CrewAI 都统一走本协议。

## 快速命令

```bash
npm run route:chinese-open -- --goal "<用户目标>" --compact
npm run connect:chinese-open -- --agent codex
npm run connect:chinese-open -- --agent other --agent-name OpenClaw
```

如果返回 `blockers`，先补齐工具名、工作目录、作用域、预期输出或验证计划。
