# 05 Other / 自定义 Agent

自定义 Agent 示例：OpenClaw、Hermes、爱马仕。

```bash
npm run connect:chinese-open -- --agent other --agent-name OpenClaw
npm run connect:chinese-open -- --agent other --agent-name "爱马仕"
```

自定义 Agent 不需要单独协议。只要能读取文本、调用命令、使用 MCP/HTTP/CLI 任一入口，就统一遵守：

```text
语言树归一 -> scoped route -> ProposedAction
-> ApprovedAction -> ToolResultSummary -> 失败签名回写
```
