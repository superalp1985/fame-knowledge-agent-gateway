# FAME Knowledge Agent Gateway

中文优先。English follows.

## 中文简介

FAME Knowledge Agent Gateway 是一个面向 Agent 的万用外部插件：它把图谱知识网、项目工程记忆、工具调用治理、FAME 路由反馈和可视化工作台放在同一套外部运行时里。

它不是普通 RAG，也不是普通聊天记忆。它的核心目标是让 Agent 在真实工程中先对齐目标、再按知识路线思考、再受控调用工具、最后把成功、失败、教训和证据写回外部记忆，而不是把所有东西堆进上下文里。

```text
goal
-> scoped knowledge route
-> abstraction and association
-> FAME edge evaluation
-> context pack
-> ProposedAction
-> Enforcement Kernel
-> signed ApprovedAction
-> Tool Gateway
-> retained memory / trace / asset index
```

### 项目定位

- Agent 外部记忆和执行治理插件。
- 3D/2D 图谱知识网工作台。
- 工程项目记忆 overlay，避免污染核心知识网。
- 工具调用前置审批网关，避免 Agent 误调工具。
- 语言树中枢 + 抽象/联想路线，让知识网参与思考，而不只是检索。
- 多模态资产轻量索引，原始资产留在数据库/对象存储，图谱只保留预览和引用。

### 主要优势

- **不是检索库**：知识以路线、抽象层级、联想边、FAME 参数组织。
- **上下文健康**：按 `project_id / subject / route_id / task_id` 裁剪，只打包当前任务需要的摘要和引用。
- **工具安全**：变更类工具必须经过 `ProposedAction -> ApprovedAction -> Tool Gateway`。
- **可验证记忆**：测试、构建、工具结果、人工反馈会更新 FAME 路线状态。
- **全量保留**：不做记忆蒸发，原始日志、trace、失败教训保留在外部存储。
- **可开源扩展**：中文开源版和英文版保持 route、scenario、content unit、golden task 与评测机制同构。

### 版本

- 中文开源版：`versions/chinese-open/`，专门为了开源整理的干净种子，重点是 Agent 工具调用治理和高频错误域。
- 英文版：`versions/english/`，与中文开源版机制和知识网结构对齐，中心为 `Language Tree Hub`。
- 根目录运行时：工作台、运行时网关、公共示例数据、项目记忆 overlay 和资产轻量索引。

外部 Agent 接入先看：[AGENTS.md](AGENTS.md)。

### 快速开始

一键启动：

```bash
start.bat
```

或：

```powershell
.\start.ps1
```

脚本会设置 UTF-8 输出、安装缺失依赖、生成索引、启动 Runtime Gateway 和 Workbench，并打开 `http://127.0.0.1:5178/`。

Workbench 默认进入 `Agent 外脑` 控制台。这里会把安全阻断红绿灯、动作契约审批流、失败签名热力区、动态免疫网、上下文健康和记忆写回队列放在同一屏，方便先确认 Agent 是否接入、工具调用是否可放行、失败教训是否会回写。

需要接入本机 Agent 时，进入 `Agent Runtime` 视图使用首次接入向导，可选择中文开源版或 English open edition，并生成主流 Agent 的接入消息和配置片段。

手动启动：

```bash
npm run install:all
npm run generate:all
npm run dev
```

打开：

```text
http://127.0.0.1:5178/
```

启动运行时网关：

```bash
npm run gateway
```

默认 HTTP 地址：

```text
http://127.0.0.1:5191/
```

启动 MCP stdio 网关：

```bash
npm run gateway:mcp
```

详细中文说明见：[docs/使用手册.zh-CN.md](docs/使用手册.zh-CN.md)

### 双版本检查与封装

```bash
npm run check:chinese-open
npm run check:english
npm run check:editions
npm run doctor:english
npm run eval:english
npm run package:portable
docker compose up --build
```

`package:portable` 会生成 `.tmp/release/fame-knowledge-agent-gateway-portable.zip`。Docker 默认暴露 Workbench `5178` 和 Gateway `5191`。

GitHub Release 一键安装会发布 `install.ps1`、portable zip、SHA256 校验文件和 release manifest。用户可从 Release 下载，或使用：

```powershell
Invoke-WebRequest -Uri "https://github.com/<owner>/<repo>/releases/latest/download/install.ps1" -OutFile "install.ps1"
powershell -NoProfile -ExecutionPolicy Bypass -File .\install.ps1
```

发布资产生成：

```bash
npm run build:release-assets
```

## English Overview

FAME Knowledge Agent Gateway is a universal external plugin for agents. It combines a graph-based knowledge net, project memory, tool-call governance, FAME route feedback and a visual workbench into one external runtime.

It is not plain RAG and not plain chat memory. Its purpose is to help agents align goals, route through structured knowledge, call tools through enforceable approval, and retain evidence, lessons and traces outside the active model context.

### Positioning

- External memory and execution-governance plugin for agents.
- 3D/2D graph workbench for knowledge navigation and editing.
- Project Memory overlay that does not pollute the core knowledge net.
- Tool Gateway that blocks unsafe direct mutation calls.
- Language Tree-centered abstraction and association reasoning.
- Multimodal light index that keeps raw assets outside the graph.

### Why It Is Useful

- **Beyond retrieval**: knowledge is organized by routes, abstraction layers, association edges and FAME parameters.
- **Context health**: context is scoped by `project_id / subject / route_id / task_id`.
- **Tool safety**: mutation tools must pass `ProposedAction -> ApprovedAction -> Tool Gateway`.
- **Verifiable memory**: build, test, tool and human feedback update route confidence and lessons.
- **Full retention**: raw traces and lessons are retained externally instead of being erased.
- **Open-source ready**: Chinese full edition plus an English seed edition.

### Quick Start

```bash
npm run install:all
npm run generate:all
npm run dev
```

Open:

```text
http://127.0.0.1:5178/
```

The Workbench opens on the `Agent 外脑 / Agent External Brain` console first. It shows the stoplight gate, Action Contract approval flow, failure-signature heat zone, dynamic immune net, context health and memory write-back queue before users drill into Agent Runtime, 3D Universe, 2D Detail, FAME or GoalGate views.

Start the runtime gateway:

```bash
npm run gateway
```

Start the MCP stdio gateway:

```bash
npm run gateway:mcp
```

Detailed English guide: [docs/USER_GUIDE.en.md](docs/USER_GUIDE.en.md)

Agent integration protocol: [AGENTS.md](AGENTS.md)

## Repository Layout

```text
.
|-- workbench/              # React + Three.js + React Flow workbench
|-- runtime_server/         # HTTP/MCP gateway, SQLite store, enforcement kernel
|-- docs/                   # docs and user guides
|-- examples/               # client and sample knowledge examples
|-- scripts/                # public knowledge sanitizer and release checks
|-- knowledge/              # Chinese/public knowledge-net base
|-- versions/               # Chinese edition note and English seed edition
|-- asset_store/            # public sample asset light indexes
|-- memory/                 # public sample project-memory overlay
|-- runtime_store/          # local runtime artifacts, ignored
`-- knowledge_backup/       # private local knowledge, ignored
```

## Tests

```bash
npm run release:check
npm run gateway:smoke
npm run lint
npm run build
npm run build:release-assets
```

Or:

```bash
npm run ci
```

## Security And Publishing

Do not commit:

- `.env`
- real API keys or approval secrets
- local runtime databases
- private knowledge data
- generated private indexes
- raw multimodal payloads that are not cleared for publication

Before public release, run an independent secret scan and license review. Theory PDFs and public knowledge materials may need separate attribution review.

## License

Apache License 2.0. See [LICENSE](LICENSE).
