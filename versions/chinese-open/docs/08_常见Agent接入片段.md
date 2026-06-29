# 常见 Agent 接入片段

本页只做入口目录。具体片段拆到 `agent-snippets/`。

## 通用启动提示

```text
你正在使用 FAME 中文开源版。先运行 route:chinese-open 获取 compact 决策。
只读取 route_ids 对应内容，不全量加载知识网。
工具调用前必须有 ProposedAction；高风险动作必须有 ApprovedAction。
执行后写 ToolResultSummary，完整日志写工程记忆 overlay 或数据库。
```

## 分片

- `agent-snippets/01_coding-ide-agents.md`：Codex、Cursor、OpenHands、Aider、Cline、Roo Code 等。
- `agent-snippets/02_claude-desktop-mcp.md`：Claude Desktop / MCP。
- `agent-snippets/03_openai-langgraph-autogen-crewai.md`：OpenAI Agents SDK、LangGraph、AutoGen、CrewAI。
- `agent-snippets/04_dify-llamaindex-workflow.md`：Dify、LlamaIndex、Workflow。
- `agent-snippets/05_other-custom-agent.md`：OpenClaw、Hermes、爱马仕等自定义 Agent。
