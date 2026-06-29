# 04 Dify / LlamaIndex / Workflow

把 `QUICKSTART_AGENT.md` 和 `--format prompt` 输出作为 system prompt 的前半段。

把 `route:chinese-open --compact` 作为工具前置步骤。

```bash
npm run route:chinese-open -- --scenario scenario-external-agent-integration --format prompt
```

LlamaIndex function agent 或 workflow agent 使用同一套顺序：语言树归一、scoped route、ContextPack、ProposedAction、Tool Gateway、ToolResultSummary。
