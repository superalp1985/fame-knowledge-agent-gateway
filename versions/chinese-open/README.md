# FAME 中文开源版

这是 FAME Knowledge Agent Gateway 的中文开源种子版。

## 一分钟上手

```bash
npm run connect:chinese-open -- --agent codex
npm run doctor:chinese-open
npm run route:chinese-open -- --goal "修改 JSONL 知识库并同步索引" --compact
```

当前目标是让工程 Agent 立刻变稳：

- 高风险工具调用先阻断或要求审批。
- 工具调用前生成 `ProposedAction`。
- 执行后强制写 `ToolResultSummary`。
- 只加载路线包，避免全量知识网压垮上下文。
- 失败签名保留，减少同类错误复发。
- 当前 smoke 上下文节省率约 `77%`。

外部 Agent 最短接入见 `QUICKSTART_AGENT.md`。

## 定位

它不是完整私有知识网的复制品，而是面向开源协作重建的规范底座。公开范围只正式展开编程与工具调用相关内容；语言树中枢同时承担语义树挂点、术语归一和抽象路由。重点放在：

- 语言树中枢
- 思考层级
- 工具调取治理
- PowerShell 安全语法
- PowerShell 中文编码输出证据
- 轻量知识索引
- 工程记忆 overlay
- 本机 Agent 傻瓜接入检查
- Workbench 图形化接入确认向导

## 结构

```text
language-tree-hub/         # 语言树中枢（语义树挂点）、思考模式、横向联想、抽象迁移
logic/                     # 方法支撑骨架
mathematics/               # 方法支撑骨架
computer-science/          # 编程、工程、测试、索引
agent-tooling/             # Agent 工具调取、反思迭代、易用性评测
powershell-safety/         # PowerShell 安全语法
database/                  # 详细内容单元
rules/                     # 工具、语法、验证规则
indexes/                   # 搜索、语义、别名和作用域索引
```

## 读取顺序

外部 Agent 先读：

1. `docs/07_Agent协议与最小接入.md`
2. `QUICKSTART_AGENT.md`
3. `knowledge/route_index.json`
4. `knowledge/indexes/subject_index.json`
5. `knowledge/language-tree-hub/core.json`
6. `knowledge/language-tree-hub/lexicon_seed.json`
7. `knowledge/language-tree-hub/thought_modes.json`
8. `knowledge/indexes/scoping_index.json`
9. `knowledge/agent-tooling/critical_error_domains.json`

## 规则

- 不全量加载知识网。
- 不把完整日志或完整工具说明塞进上下文。
- 开源知识网只公开编程、工具调用和 PowerShell 安全相关内容。
- 语言树中枢就是语义树挂点，术语必须先归一到 canonical term 再路由。
- 工具调用前先固定球门和全局态势，再写工具动作契约。
- 高风险动作先过 `ProposedAction`。
- 失败经验必须保留。
- 工程 overlay 只做外部记忆，不自动升级核心知识。

## 验证

```bash
npm run doctor:chinese-open
npm run eval:chinese-open
npm run connect:chinese-open -- --agent codex
node versions/chinese-open/tests/agent-effect-smoke.mjs
```

`doctor:chinese-open` 检查路线、黄金任务和高风险审批规则；`eval:chinese-open` 会创建 `.tmp/chinese-open-real-eval`，执行真实 JSONL 解析、真实 `npm test`、真实 Git 脏工作区检测、真实 PowerShell `Resolve-Path`、PowerShell 中文编码探针和本机 Agent 接入检查。`connect:chinese-open` 用于直接选择本机 Agent 并返回 `connected` / `not_connected`。这不是烟测，正式结论见 `docs/09_实机评测报告.md`。

`agent-effect-smoke.mjs` 只用于快速检查语义树挂点、路由完整性、上下文裁剪、工具动作契约和 Agent 接入便利性。

## 实用路由

外部 Agent 或开发者可以直接用目标生成最小路线和工具动作契约草案：

```bash
npm run route:chinese-open -- --goal "修改 JSONL 知识库并同步索引"
npm run route:chinese-open -- --goal "修改 JSONL 知识库并同步索引" --compact
```

常用入口：

```bash
npm run route:chinese-open -- --list-scenarios --format md
npm run route:chinese-open -- --scenario scenario-external-agent-integration --format prompt
npm run connect:chinese-open -- --agent codex
npm run route:chinese-open -- --goal "PowerShell 显示中文乱码" --compact
npm run route:chinese-open -- --operation delete --goal "PowerShell 删除目录但要避免误删" --tool-name exec_command --working-directory "<project-root>" --expected-output "列出绝对路径并等待审批"
```

也可以指定场景：

```bash
npm run route:chinese-open -- --scenario scenario-python-runtime --format md
```

返回内容包括 `startup_read_set`、`context_pack`、`tool_gateway_decision`、`proposed_action`、`expected_summary_pattern` 和 `result_summary_stub`。外部 Agent 应把完整日志写到工程记忆 overlay 或数据库，只把摘要、证据和路线引用保留在上下文。

## 图形化接入

启动根目录 Workbench 后，默认会先进入 `Agent 外脑` 控制台。先看安全阻断红绿灯、动作契约审批流、失败签名热力区、动态免疫网和上下文健康；这些状态用于判断 Agent 是否已经接入、当前工具动作是否应放行、失败教训是否会写回。

需要配置本机 Agent 时，进入 `Agent Runtime` 视图使用接入向导：

```text
选择 Agent -> 检查入口 -> 复制/发送接入消息 -> 用户确认 Agent 已接入
```

这个向导不自动改写用户 Agent 配置。它把 `connect:chinese-open`、协议入口和接入消息做成可视化确认流程，适合普通用户把 Codex、Cursor、Claude Desktop 或通用 Agent 接到中文开源版。

## 接入样例

见 `examples/`：

- `external-agent-bootstrap.md`
- `route-output.example.json`
- `tool-result-summary.example.json`
- `golden-tasks/tool-stability.golden.json`

## 说明

详细录入规范见 `docs/02_知识网录入规范.md`，Agent 接入见 `docs/04_Agent接入工作流.md`、`docs/07_Agent协议与最小接入.md` 和 `docs/08_常见Agent接入片段.md`。
