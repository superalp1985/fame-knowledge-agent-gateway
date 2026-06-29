# 07 CLI 和图形化接入

## 常用命令

```bash
npm run route:chinese-open -- --goal "<用户目标>" --compact
npm run route:chinese-open -- --list-scenarios --format md
npm run route:chinese-open -- --scenario scenario-external-agent-integration --format prompt
```

## 本机 Agent 检查

```bash
npm run connect:chinese-open -- --agent codex
npm run connect:chinese-open -- --agent openhands
npm run connect:chinese-open -- --agent other --agent-name OpenClaw
```

当前预设覆盖 Codex、Cursor、Claude Desktop、Claude Code、OpenAI Agents SDK、Gemini CLI、OpenHands、SWE-agent、Aider、Cline、Roo Code、Continue、LangGraph、AutoGen、CrewAI、Dify 和 Generic Agent。

## Workbench

```text
Agent Runtime -> 本机 Agent 接入 -> 选择预设或 Other
-> 检查 -> 复制/发送 Agent 接入消息 -> Agent 回复已接入
-> 用户确认
```

图形化路径不自动修改 Agent 配置。它只负责交接协议消息和确认接入状态。
