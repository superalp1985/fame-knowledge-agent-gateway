# Workbench v13：理论运行时与全量记忆保留实现记录

日期：2026-06-27

## WorkStartAlignment

```yaml
project_positioning: Agent 万用外部插件 / 外脑运行时 / 工具治理网关
current_task: theory 论文机制落地 + v13 运行时可视化 + 全量记忆保留修正
active_scope:
  project_id: fame-agent-gateway
  subject: theory-runtime
  route_id: v13-full-memory-retention-runtime
  task_id: workbench-v13-full-implementation
active_goal_gate:
  goal_type: pass_quality_gate
  success_condition: FAME 时间动力学、SCAC 物理反馈、Route Posterior、Temporal Truth、Sync Outbox、Trace Runtime 和全量记忆保留机制可在 Workbench 实机查看，并通过 lint/build/browser 测试
required_modules:
  - fame_dynamics_engine
  - scac_feedback_convergence
  - route_posterior_runtime
  - full_memory_retention_engine
  - context_distillation_engine
  - temporal_truth_graph
  - event_sourced_sync_outbox
  - trace_runtime
enforcement_required: true
context_budget_strategy: full_memory_retention_summary_first
```

## 核心修正

v13 移除删除式记忆策略。系统保留全量底层记忆、日志、trace、失败教训、资产索引和同步事件；上下文健康只由 `Context Pack` 控制进入当前模型上下文的粒度。

```text
raw_memory_delete = forbidden
full_retention = true
context_health = include_summary / pin_for_goal / lazy_load_raw / audit_only / promote_candidate
```

因此 Onto-plasticity 在本项目中的工程翻译是“上下文可塑性”，不是“底层记忆删除”。`alpha / tau_eff / context_attention` 用于排序、摘要、固定、懒加载和审计，不用于丢弃记录。

## 外部路线对齐

本轮重新核对了现有开源与标准路线：

```text
GraphRAG:
  global/local search 和 community summaries 可借鉴为大图分层摘要与按 scope 遍历。

LangGraph:
  checkpoint/store/namespace 可借鉴为 agent 恢复、长期记忆和工程状态保存。

MCP:
  tools/resources/prompts 是万能外部插件接口的标准入口；本项目在其前方增加 Enforcement Kernel。

OpenTelemetry:
  trace/span 树适合作为可回放执行链路，用于工具治理、SCAC 反馈和失败复盘。
```

本项目差异仍保持不变：外部路线只解决连接、检索、持久化或观测；本项目额外维护 FAME 情绪动力学、SCAC 收敛、Route Posterior、GoalGate 找球门和全量记忆上下文蒸馏。

## 新增运行时数据

新增目录：

```text
runtime_store/v13/
```

数据文件：

```text
v13_manifest.json
fame_timeseries.jsonl
physical_feedback_events.jsonl
route_posterior_state.json
full_memory_retention.jsonl
temporal_truth_edges.jsonl
sync_outbox_events.jsonl
trace_spans.jsonl
```

`v13_manifest.json` 明确策略：

```text
memory_policy = full_retention_context_distillation
memory_retention = full
raw_memory_deletion = forbidden
context_distillation_only = true
tool_execution = ApprovedAction required
sync_consistency = event_sourced_outbox
```

## 生成层

新增脚本：

```text
workbench/scripts/build-v13-runtime.mjs
```

输出：

```text
workbench/src/generated/v13Runtime.generated.ts
workbench/public/generated/v13Runtime.generated.json
```

package script：

```text
npm run generate:v13
```

生成结果：

```text
3 FAME timeseries points
3 physical feedback events
4 full memory retention states
3 temporal truth edges
3 sync outbox events
4 trace spans
```

## Workbench 实现

`App.tsx` 新增：

```text
ViewMode: v13
SearchResultKind: v13-runtime
loadV13Runtime()
V13RuntimeStage
v13 Runtime sidebar nav
v13 topbar stats
v13 Runtime Inspector
v13 search targets
```

v13 面板：

```text
FAME Dynamics
SCAC Convergence
Route Posterior
Full Memory Retention
Temporal Truth
Sync Outbox
Trace Runtime
Context Distillation
```

搜索覆盖：

```text
SCAC
posterior
全量记忆
outbox
trace
temporal truth
context distillation
```

`routeEngine.ts` 的找球门遍历增加：

```text
Route Posterior
SCAC Physical Feedback
Full Memory Retention
```

其中 Full Memory Retention 的剪枝含义只针对“原始记忆是否进入本轮上下文”，不针对底层存储。

## 文档对齐

已将以下文档中的删除式记忆路线改为“全量记忆保留 + 上下文蒸馏”：

```text
方案设计/04_FAME公式与参数.md
方案设计/05_调研摘要.md
方案设计/07_差异化_遍历效率_评估指标.md
方案设计/08_完整版实施蓝图.md
方案设计/09_可视化工作台_联想机制_找球门遍历.md
方案设计/24_理论论文与外部调研_v13_机制改进建议.md
```

指标同步调整：

```text
deletion_based_memory_saving
  -> context_distillation_saving

useful_memory_retention
  -> reused_retained_memories / all_retained_memories
```

## 实机测试结果

### 1. 旧词审计

```text
rg "<deleted-memory-policy legacy terms>"
result: no matches
```

### 2. 数据生成

```text
npm run generate:v13
result: pass
output: 3 FAME points, 3 feedback events, 4 retained memories
```

### 3. 静态质量门

```text
npm run lint
result: pass

npm run build
result: pass
```

### 4. 浏览器首页测试

地址：

```text
http://127.0.0.1:5181/
```

结果：

```text
runtime index ready / 623 files
routes 2714
shards 51
v13 3/3
scac 0.67
posterior 0.58
console warn/error: 0
```

### 5. v13 面板测试

点击 `v13 Runtime` 后确认：

```text
v13 Theory Runtime: visible
FAME Dynamics: visible
SCAC Convergence: visible
Route Posterior: visible
Full Memory Retention: visible
Temporal Truth: visible
Sync Outbox: visible
Trace Runtime: visible
删除式记忆策略旧文案: not visible
console warn/error: 0
```

### 6. 搜索跳转测试

```text
SCAC -> SCAC Convergence active
posterior -> Route Posterior active
全量记忆 -> Full Memory Retention active
outbox -> Sync Outbox active
console warn/error: 0
```

## WorkEndSummary

```yaml
files_changed:
  - workbench/src/model.ts
  - workbench/src/sampleData.ts
  - workbench/src/routeEngine.ts
  - workbench/src/App.tsx
  - workbench/src/App.css
  - workbench/scripts/build-v13-runtime.mjs
  - workbench/src/generated/v13Runtime.generated.ts
  - workbench/public/generated/v13Runtime.generated.json
  - runtime_store/v13/*
  - 方案设计/04_FAME公式与参数.md
  - 方案设计/05_调研摘要.md
  - 方案设计/07_差异化_遍历效率_评估指标.md
  - 方案设计/08_完整版实施蓝图.md
  - 方案设计/09_可视化工作台_联想机制_找球门遍历.md
  - 方案设计/24_理论论文与外部调研_v13_机制改进建议.md
  - 方案设计/25_Workbench_v13_理论运行时全量记忆保留实现记录.md
design_decisions:
  - v13 移除删除式记忆策略。
  - 全量记忆保留在外部存储，当前上下文只读摘要、refs、固定片段或按需原始记录。
  - FAME、SCAC、Route Posterior、Temporal Truth、Outbox、Trace 统一进入可视化运行时。
  - Agent 工具执行仍必须经过 ApprovedAction / Enforcement Kernel / Tool Gateway。
next_goal_gate: connect_real_mcp_http_gateway_and_persistent_db
```

## 参考

- Microsoft GraphRAG: https://microsoft.github.io/graphrag/
- GraphRAG Global Search: https://microsoft.github.io/graphrag/query/global_search/
- GraphRAG Local Search: https://microsoft.github.io/graphrag/query/local_search/
- LangGraph persistence: https://docs.langchain.com/oss/python/langgraph/persistence
- LangGraph checkpointers: https://docs.langchain.com/oss/python/langgraph/checkpointers
- MCP specification: https://modelcontextprotocol.io/specification/2025-11-25
- MCP tools: https://modelcontextprotocol.io/specification/2025-06-18/server/tools
- MCP resources: https://modelcontextprotocol.io/specification/2025-06-18/server/resources
- OpenTelemetry traces: https://opentelemetry.io/docs/concepts/signals/traces/
- OpenTelemetry trace API: https://opentelemetry.io/docs/specs/otel/trace/api/
