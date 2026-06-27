# Runtime Gateway：全量执行面补齐与实机测试记录

日期：2026-06-27

## WorkStartAlignment

```yaml
project_positioning: Agent 万用外部插件 / 外脑运行时 / 工具治理网关
current_task: 补齐真实 runtime gateway 的鉴权、审批签名、调度、语义索引、资产 DB 轻索引、trace 导出
active_scope:
  project_id: fame-agent-gateway
  subject: real-agent-gateway
  route_id: auth-scheduler-semantic-asset-trace
  task_id: runtime-gateway-v2-full-landing
required_chain:
  - API key auth
  - per-agent ACL
  - ProposedAction
  - Enforcement Kernel
  - HMAC ApprovedAction
  - Tool Gateway
  - ToolResult / ClockEvent / AssetDbSyncItem / TraceSpan
memory_policy: full_retention_context_distillation
raw_memory_deletion: forbidden
```

## 本轮落地内容

### 1. Agent Auth / ACL

新增 `runtime_server/src/auth.mjs`：

```text
API key -> sha256 hash -> agents table
agent scopes -> project_id / subject / route_id / task_id
allowed_tools -> canonical tool id
allowed_adapters -> http / mcp / cli / ide / workflow
```

HTTP 除 `/health` 外必须带：

```text
Authorization: Bearer <api_key>
```

MCP stdio 通过 tool args `api_key` 或环境变量 `FAME_MCP_API_KEY` 注入。

### 2. HMAC ApprovedAction

旧弱 token：

```text
approved.{project_id}.{action_id}.{nonce}
```

已替换为：

```text
fame.approval.v1.<base64url(payload)>.<hmac>
```

payload 包含：

```text
action_id
project_id
subject
route_id
task_id
adapter
tool_id
agent_id
expires_at
nonce
```

Tool Gateway 强制验证：

```text
signature
approval DB record
expiry
unused status
agent_id
scope
adapter
tool_id
agent ACL
```

### 3. Durable ClockEvent

新增表：

```text
scheduler_jobs
```

新增接口：

```text
POST /clock/schedule
POST /clock/run-due
POST /clock/list
MCP: schedule_clock / run_due_clocks
```

用途：

```text
任务恢复
自我迭代提醒
过时路线复查
人工 review reminder
```

### 4. Semantic Index

新增派生索引表：

```text
semantic_documents
semantic_terms
```

索引来源：

```text
core knowledge entries
project memory nodes
multimodal asset light indexes
```

检索策略：

```text
strict project_id/subject/route_id
-> project_id/subject
-> project_id
-> global fallback
```

这样既避免大图全局爆炸，也避免 exact shard 未填满时 agent 找不到入口。

### 5. Asset DB Light Index Adapter

新增表：

```text
asset_records
asset_sync_records
```

边界保持不变：

```text
raw multimodal payload 不进入知识图谱
graph/runtime 只保存 asset_id、summary、caption、db_ref、object_ref、text_ref、route_refs、subject_refs、FAME summary
```

用户手动调整知识网后，可通过 `asset.index.sync` 同步 DB 轻索引，避免图谱与数据库脱节。

### 6. Trace Export

新增：

```text
POST /trace/export
MCP: export_trace
```

输出 OpenTelemetry-style JSON：

```text
traceId
spanId
parentSpanId
name
kind
startTimeUnixNano
endTimeUnixNano
attributes
events
```

用于复盘 agent 决策链、工具治理、失败复现和外部观测系统接入。

## API/MCP 变更

HTTP 新增：

```text
GET  /agent/me
POST /clock/schedule
POST /clock/run-due
POST /clock/list
POST /semantic/rebuild
POST /semantic/search
POST /assets/sync
POST /assets/list
POST /trace/export
```

MCP 新增：

```text
schedule_clock
run_due_clocks
semantic_search
rebuild_semantic_index
sync_asset_index
list_assets
export_trace
```

MCP Resource 新增：

```text
fame://assets/index
```

## 实机测试结果

命令：

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
    "unauthorized": "unauthorized",
    "blocked_without_token": "blocked",
    "approved_token_prefix": "fame.approval.v1",
    "tampered_token": "blocked",
    "clock_fired": 1,
    "semantic_results": 5,
    "asset_records": 1,
    "trace_spans": 50,
    "event_count": 100
  },
  "mcp": {
    "initialized": true,
    "tools": 15
  }
}
```

验证点：

```text
/health public: pass
protected endpoint without key -> 401: pass
agent identity resolve: pass
context pack full-retention policy: pass
no approval_token execution blocked: pass
HMAC ApprovedAction issued: pass
tampered token blocked: pass
used token blocked: pass
direct mutation endpoint blocked: pass
ClockEvent schedule/run-due: pass
semantic rebuild/search: pass
asset DB light-index sync/list: pass
trace export: pass
MCP initialize/tools/list/tools/call: pass
```

## WorkEndSummary

```yaml
files_changed:
  - .env.example
  - README.md
  - docs/runtime-gateway.md
  - examples/http-client/approved-tool-call.mjs
  - runtime_server/src/auth.mjs
  - runtime_server/src/store.mjs
  - runtime_server/src/runtime.mjs
  - runtime_server/src/http-server.mjs
  - runtime_server/src/mcp-server.mjs
  - runtime_server/tests/smoke.mjs
  - 方案设计/29_RuntimeGateway_全量执行面补齐与实机测试记录.md
design_decisions:
  - 真实记忆 append-first；语义倒排表属于可重建派生索引，不属于记忆删除。
  - Tool Gateway 只接受 HMAC ApprovedAction，旧弱 token 自然失效。
  - MCP stdio 使用 api_key 参数或 FAME_MCP_API_KEY，适配外部 agent 配置方式。
  - 资产数据库保存原始多模态数据引用；知识图谱只保留轻索引和预览。
  - 语义搜索采用 strict scope 优先，空结果逐级放宽，兼顾大项目效率和可发现性。
remaining_boundaries:
  - 文件系统、浏览器、IDE、真实第三方 API 等 side-effect adapter 仍需按工具逐个接入。
  - 生产部署需要替换 dev api key 和 FAME_APPROVAL_SECRET。
  - node:sqlite 仍是 Node 24 experimental API，开源版后续可增加 better-sqlite3 或 libsql 适配层。
next_goal_gate: real-side-effect-tool-adapters-and-ui-runtime-binding
```
