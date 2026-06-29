# 01 Coding / IDE Agent

适用：Codex、Cursor、Claude Code、Gemini CLI、OpenHands、SWE-agent、Aider、Cline、Roo Code、Continue。

## 接入检查

```bash
npm run connect:chinese-open -- --agent codex
npm run connect:chinese-open -- --agent openhands
npm run connect:chinese-open -- --agent aider
```

Workbench 路径：`Agent Runtime -> 选择预设 -> 检查 -> 复制/发送 Agent 接入消息 -> 用户确认`。

Agent 回复：

```text
已接入 FAME 中文开源版。下一条任务前我会先运行 route:chinese-open --compact。
```

## 每个任务前

```bash
npm run route:chinese-open -- --goal "<用户目标>" --compact
```

如果 `blockers` 非空，先补齐工具名、工作目录、预期输出或验证计划。

PowerShell 中文乱码时先跑：

```bash
npm run route:chinese-open -- --goal "PowerShell 显示中文乱码" --compact
```
