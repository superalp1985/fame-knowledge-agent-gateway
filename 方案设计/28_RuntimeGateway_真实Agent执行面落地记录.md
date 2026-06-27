# Runtime Gateway：真实 Agent 执行面落地记录

日期：2026-06-27

## WorkStartAlignment

```yaml
project_positioning: Agent 万用外部插件 / 外脑运行时 / 工具治理网关
current_task: 落地真实 MCP/HTTP Gateway、SQLite runtime store、Enforcement Kernel、Tool Gateway
active_scope:
  project_id: fame-agent-gateway
  subject: real-agent-gateway
  route_id: real-mcp-http-enforcement-gateway
  task_id: runtime-gateway-v1
active_goal_gate:
  goal_type: executable_runtime
  success_condition: 外部 agent 可通过 HTTP/MCP 调用路由、上下文打包、审批和受控工具执行
required_modules:
  - runtime_server
  - SQLite GatewayStore
  - HTTP API
  - MCP stdio server
  - Enforcement Kernel
  - Tool Gateway
  - smoke tests
enforcement_required: true
memory_policy: full_retention_context_distillation
```

## 已实现内容

### 1. Runtime Server

新增目录：

```text
runtime_server/
  package.json
  src/
    paths.mjs
    json.mjs
    store.mjs
    runtime.mjs
    http-server.mjs
    mcp-server.mjs
  tests/
    smoke.mjs
```

定位：

```text
Workbench = 可视化调试面
runtime_server = 真实 agent 接入和强制执行面
runtime_store/gateway/gateway.sqlite = 事件库、审批库、checkpoint 库
```

### 2. SQLite Runtime Store

使用 Node 24 内置 `node:sqlite`，无需新增 npm 数据库依赖。

表：

```text
events:
  ProposedAction
  EnforcementDecision
  ApprovedAction
  BlockedAction
  ToolResult
  ContextPack
  SummaryMemory
  KnowledgePatchProposal
  AssetDbSyncItem
  ClockEvent
  TraceSpan

approvals:
  approval_token
  action_id
  scope
  adapter
  tool_id
  status
  checks
  expires_at

checkpoints:
  project_id / subject / route_id / task_id / state_json
```

文件：

```text
runtime_store/gateway/gateway.sqlite
```

### 3. HTTP API

启动：

```bash
npm run gateway
```

默认：

```text
http://127.0.0.1:5191/
```

端点：

```text
GET  /health
GET  /stats
POST /goal/resolve
POST /knowledge/route
POST /context/pack
POST /action/propose
POST /action/enforce
POST /tool/execute
POST /summary/write
POST /patch/submit
POST /sync/status
POST /events/list
```

### 4. MCP Server

启动：

```bash
npm run gateway:mcp
```

暴露：

```text
tools/list
tools/call
resources/list
resources/read
prompts/list
prompts/get
```

Tools：

```text
resolve_goal
route_knowledge
pack_context
propose_action
execute_tool
write_summary
submit_patch
get_sync_status
```

Resources：

```text
fame://runtime/stats
fame://sync/status
```

### 5. Enforcement Kernel

审批流程：

```text
ProposedAction
-> scope_check
-> purpose_check
-> adapter_check
-> tool_manual_check
-> context_budget_check
-> fame_risk_check
-> direct_core_write_check
-> ApprovedAction / BlockedAction
```

通过后签发：

```text
approval_token = approved.{project_id}.{action_id}.{nonce}
expires_at = now + 15 minutes
```

### 6. Tool Gateway

执行规则：

```text
无 approval_token: blocked
找不到 approval_token: blocked
approval_token 非 approved: blocked
approval_token 过期: blocked
tool_id 与审批不一致: blocked
通过: 执行并写 ToolResult 事件，token 标记 used
```

已接安全工具：

```text
knowledge_router.resolve_goal
knowledge_router.route_knowledge
context.pack
summary_memory.write
knowledge_patch.submit
sync.status
```

副作用类工具仍需要后续单独 adapter。

## 实机测试

### 1. Gateway smoke

```bash
npm run gateway:smoke
```

结果：

```json
{
  "ok": true,
  "http": {
    "health": "ready",
    "selected_route_id": "manual_fin_npv",
    "context_tokens": 1460,
    "blocked_without_token": "blocked",
    "approved_token_prefix": "approved.fame-agent-gateway",
    "event_count": 10
  },
  "mcp": {
    "initialized": true,
    "tools": 8
  }
}
```

说明：

```text
HTTP: pass
MCP initialize: pass
MCP tools/list: pass
MCP tools/call propose_action: pass
无 token 工具执行阻断: pass
ApprovedAction token 执行: pass
SQLite event persistence: pass
```

### 2. Workbench 质量门

```bash
npm run lint
npm run build
```

结果：

```text
lint: pass
build: pass
```

### 3. 固定端口 HTTP 探测

```bash
npm run gateway
GET http://127.0.0.1:5191/health
POST http://127.0.0.1:5191/tool/execute
```

结果：

```text
/health: 200
memory_policy: full_retention_context_distillation
knowledge: 623 files / 3337 entries / 2714 routes / 51 shards
tool execute without token: blocked
```

## 当前边界

已落地：

```text
真实 HTTP API
真实 MCP stdio server
真实 SQLite event/approval/checkpoint store
真实 approval_token 强制校验
真实无 token 阻断
真实 context pack / route / goal resolver
真实 KnowledgePatchProposal event append
```

仍需后续增强：

```text
真实文件/系统工具 adapter
真实 asset DB 写入 adapter
OpenTelemetry exporter
durable scheduler / ClockEvent worker
embedding + BM25 + community summary index
Graphiti/temporal graph backend
auth / API key / per-agent ACL
approval token signature/HMAC
```

## WorkEndSummary

```yaml
files_changed:
  - package.json
  - README.md
  - docs/runtime-gateway.md
  - runtime_server/package.json
  - runtime_server/src/paths.mjs
  - runtime_server/src/json.mjs
  - runtime_server/src/store.mjs
  - runtime_server/src/runtime.mjs
  - runtime_server/src/http-server.mjs
  - runtime_server/src/mcp-server.mjs
  - runtime_server/tests/smoke.mjs
  - examples/http-client/approved-tool-call.mjs
  - 方案设计/28_RuntimeGateway_真实Agent执行面落地记录.md
design_decisions:
  - runtime_server 与 workbench 分离，避免前端承担执行面。
  - 首版 durable store 使用 Node 内置 SQLite，降低开源安装成本。
  - Tool Gateway 默认拒绝无 approval_token 调用。
  - 保持 Full Memory Retention，不引入记忆删除/蒸发。
  - KnowledgePatchProposal 只写事件，不直接修改核心知识网。
diagrams_updated: []
unresolved_questions:
  - 生产级 auth/ACL 策略尚未落地。
  - approval_token 后续需要 HMAC 或签名。
  - side-effectful tool adapter 需要按工具逐个接入。
next_goal_gate: auth-scheduler-vector-index-and-real-adapters
context_release_summary: 本轮把 agent 万用插件执行面从 Workbench preview 推进到可运行 HTTP/MCP gateway，并完成强制审批和落库实测。
```
