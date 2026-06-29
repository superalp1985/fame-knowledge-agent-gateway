# Agent 快速接入

目标：让任何工程 Agent 先少犯工具错误，再按需读取知识网。

## 直接接入

先选择本机 Agent，检查是否已经接入：

```bash
npm run connect:chinese-open -- --agent codex
```

常用可选值：

```text
codex / cursor / claude-desktop / claude-code / openai-agents
gemini-cli / openhands / swe-agent / aider / cline / roo-code / continue
langgraph / autogen / crewai / dify / generic / other
```

自定义 Agent 例如 OpenClaw、Hermes、爱马仕：

```bash
npm run connect:chinese-open -- --agent other --agent-name OpenClaw
npm run connect:chinese-open -- --agent other --agent-name "爱马仕"
```

返回 `connected` 表示入口文档、路由、doctor、实机评测脚本和启动提示都齐备；返回 `not_connected` 时先看 `blockers`。

如果用户使用 Workbench，可以进入 `Agent Runtime` 视图走图形化接入：

```text
选择本机 Agent 或 Other/自定义 Agent -> 检查 -> 复制/发送 Agent 接入消息 -> 用户确认 Agent 已回复接入
```

Workbench 默认首页是 `Agent 外脑`。接入后先看这里的安全阻断、动作契约审批流、失败签名热力区和上下文健康；红灯或 blocked 时，Agent 不应绕过网关直接调用工具。

Agent 收到接入消息后，应回复用户已接入，并从下一条任务开始先运行：

```bash
npm run route:chinese-open -- --goal "<用户目标>" --compact
```

Workbench 只做可视化确认和消息交接，不会自动修改 Agent 本机配置。

## 30 秒验证

```bash
npm run doctor:chinese-open
```

正式接入前再跑一次实机评测：

```bash
npm run eval:chinese-open
```

实机评测会创建 `.tmp/chinese-open-real-eval`，运行真实 JSONL、npm、Git、PowerShell 路径解析、PowerShell 中文编码探针和本机 Agent 接入检查。它用于确认这套机制确实能约束 Agent 的工具调用，不只是检查文件能不能打开。

通过后，给你的 Agent 第一条任务前先跑：

```bash
npm run route:chinese-open -- --goal "<用户目标>" --compact
```

## Agent 必看字段

- `scenario`：当前任务命中的稳定场景。
- `decision`：工具闸门结论。
- `blockers`：调用工具前必须补齐的缺口。
- `route_ids`：只读取这些路线，不全量加载知识网。
- `requires_approved_action`：为 `true` 时必须等待人工或等价审批。
- `next_action`：下一步动作。

## 工具调用规则

1. 先用语言树归一目标，再找球门和全局态势。
2. 工具调用前必须有 `ProposedAction`。
3. 删除、递归移动、发布、凭据修改等高风险动作必须有 `ApprovedAction`。
4. 执行后必须写 `ToolResultSummary`。
5. 完整日志写工程记忆 overlay 或数据库，上下文只保留摘要和证据。

## 立竿见影场景

```bash
npm run route:chinese-open -- --operation delete --goal "PowerShell 删除目录但要避免误删" --tool-name exec_command --working-directory "<project-root>" --expected-output "列出绝对路径并等待审批" --compact
```

这个命令应该返回 `requires_approved_action: true`，并因为 `"<project-root>"` 仍是占位符且没有真实目标路径而保留 `working_directory_not_declared` 与 `target_or_allowed_path_not_declared`。真实接入时传入实际工作目录和 `--target` 或 `--allowed-path`。

```bash
npm run route:chinese-open -- --goal "修改 JSONL 知识库并同步索引" --compact
```

这个命令应该命中 `scenario-jsonl-knowledge-edit`，并包含 `route-agent-database-sync`。

```bash
npm run route:chinese-open -- --goal "PowerShell 显示中文乱码" --compact
```

这个命令应该命中 `scenario-powershell-encoding-mojibake`，并包含 `route-powershell-encoding-output`。Agent 遇到 PowerShell 中文乱码时，先区分终端显示、管道解码和文件真实损坏，不要直接重写文件。

## 更完整输出

```bash
npm run route:chinese-open -- --goal "<用户目标>"
```

完整输出包含 `startup_read_set`、`context_pack`、`proposed_action`、`result_summary_stub`，适合接入脚本或 MCP 工具包装。
