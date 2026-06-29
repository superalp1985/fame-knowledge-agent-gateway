# 08 生态映射

- MCP：知识文件是 resources，`route:chinese-open` 是 routing tool，`--format prompt` 是启动 prompt。
- OpenAI Agents SDK：把 Tool Gateway 策略视作 tool guardrail，把 `ToolResultSummary` 视作 tracing/summary 的最小落点。
- LangGraph / LangMem：工程记忆 overlay 对应 checkpoint/store，核心知识网只保留摘要和引用。
- LlamaIndex：把本协议作为 function agent 或 workflow agent 的系统提示和工具前置检查。
- AutoGen / CrewAI：每个 agent/tool/task 都压成同一份工具动作契约，避免角色绕过 Tool Gateway。
