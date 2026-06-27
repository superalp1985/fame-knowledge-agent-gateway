# 最终机制对齐与 Agent 接入系统评测

日期：2026-06-27

## WorkStartAlignment

```yaml
project_positioning: Agent 万用外部插件 / 外脑运行时 / 工具治理网关
current_task: 最终机制对齐、agent 接入可用性评测、外部方案复核、实机测试
active_scope:
  project_id: fame-agent-gateway
  subject: agent-integration-evaluation
  route_id: final-mechanism-alignment-agent-gateway-test
  task_id: workbench-v15-final-agent-eval
active_goal_gate:
  goal_type: pass_quality_gate
  success_condition: 明确机制覆盖、实机结果、agent 易用性、未落地执行面和下一步优先级
required_modules:
  - WorkStartAlignment
  - Knowledge Directory
  - 3D/2D graph traversal
  - Agent Runtime
  - Enforcement Preview
  - Project Memory Overlay
  - Multimodal Light Index
  - v13 Runtime
  - KnowledgePatchProposal
  - Module Debug
enforcement_required: true
context_budget_strategy: summary_first + lazy_load_refs
memory_policy: full_retention_context_distillation
```

## 外部调研结论

本轮调研没有推翻现有定位，反而进一步明确了项目边界：

1. MCP 适合作为外部 agent 的标准插头。MCP tools/resources 提供工具和上下文资源的发现、调用、读取接口，但安全执行仍需要本项目自己的 Enforcement Kernel 与 ApprovedAction。
2. OpenAI Agents SDK 的 Guardrails/Tracing 思路证明：工具调用要有工具级 guardrail，trace 要记录 LLM、tool、handoff、guardrail 等完整事件。Workbench 已有 Trace Runtime 预览，但还没有真实 trace exporter。
3. LangGraph 的 checkpointer/store 区分适合本项目的短期断点续跑和长期工程记忆；当前 Project Memory 是静态/JSON overlay，还未落到 durable checkpoint/store。
4. GraphRAG 的 community summaries、global/local search 适合解决大图谱爆炸；当前已有 subject/shard scoping 和目录树，但还缺 embedding/community summary 索引。
5. Graphiti 的 temporal knowledge graph 适合 temporal truth、事实失效、历史保留和混合搜索；当前 v13 已有 Temporal Truth 视图和全量记忆保留，但还未接真实 temporal graph backend。

本项目差异性继续保持为：语言树中心、抽象联想路线、找球门遍历、FAME 动态参数、工程记忆与核心知识网隔离、强制工具治理。

## 本轮修正

### 1. 3D/索引唯一性

发现：

```text
Universe file node id 因 .md / .yaml 同名文件去扩展名后撞车。
KnowledgeIndex entry id 也因同名文件撞车。
GoalGate step.kept 中多个相同 route_id 作为 React key 时撞车。
```

修正：

```text
scripts/build-knowledge-universe.mjs:
  file entry id 增加文件扩展名
  3D file node id 增加唯一来源和局部序号

workbench/src/App.tsx:
  shard / keyword / route_ref / subject_ref / context item / GoalGate kept item key 增加序号
```

结果：

```json
{
  "entries": 3337,
  "shards": 51,
  "nodes": 235,
  "links": 287,
  "entryIdDupes": [],
  "shardIdDupes": [],
  "nodeIdDupes": [],
  "brokenLinks": []
}
```

### 2. 顶部状态与上下文健康

顶部状态保持紧凑为 4 个核心 pill：

```text
ready 623/2714
assets 5 / sync 3
v13 3/3
goal 0.608 / ctx 2480
```

它满足 agent 快速判断运行态的要求，不再把所有内部指标铺满页面。

## 实机测试结果

### 1. 数据生成

```text
npm run generate:knowledge
pass: 623 indexed files / 2714 route records / 3337 entries / 51 shards / 235 universe nodes / 287 links
```

### 2. 静态质量门

```text
npm run lint
pass

npm run build
pass
```

### 3. 唯一性与图完整性

```text
entry id duplicates: 0
shard id duplicates: 0
3D node id duplicates: 0
broken universe links: 0
```

### 4. 浏览器冷启动

测试地址：

```text
http://127.0.0.1:5181/
```

结果：

```text
console warn/error: 0
compact topbar: pass
Directory: pass
Agent Runtime: pass
Project Memory: pass
Assets Light Index: pass
v13 Runtime: pass
GoalGate: pass
Patch Entry: pass
Module Debug: pass
negative FAME visual signal: pass
no Memory Evaporation policy: pass
```

说明：全文搜索中仍会出现地理/物理知识里的“蒸发”，那是水循环、物态变化等学科内容，不是“记忆蒸发”机制。机制层没有 Memory Evaporation 策略残留，保留的是 Full Memory Retention。

## 机制覆盖矩阵

| 机制 | 状态 | 说明 |
|---|---:|---|
| WorkStartAlignment | 已实现 | 入口文档和 UI scope 可见 |
| 3D Universe | 已实现 | 语言树中心、学科围绕、负值 FAME 线索可见 |
| 2D Detail | 已实现 | 双击节点进入局部路线，模块可编辑 |
| Directory 文字索引 | 已实现 | root -> subject -> shard -> file/route |
| Search | 已实现 | 覆盖 3D、2D、route、file、asset、v13 |
| FAME Edge State | 已实现 | 风险/教训/健康线路可视化 |
| GoalGate 找球门遍历 | 已实现 | scope、FAME、context budget、剪枝可见 |
| Semantic Auto-Fit | 预览实现 | 可展示建议；还不是 embedding/ontology 级自动重构 |
| Project Memory Overlay | 已实现 | 工程记忆与核心知识网隔离 |
| Core Knowledge Protection | 已实现 | 核心写入走 KnowledgePatchProposal / review |
| Multimodal Light Index | 已实现 | 图谱只保存预览和索引，原始资产在 asset store/db |
| Manual Asset DB Sync | 已实现预览 | 可见同步项；真实 DB 写入网关未落地 |
| Full Memory Retention | 已实现 | 全量保留，context 只做摘要/ref/懒加载 |
| Temporal Truth | 已实现预览 | v13 视图可见；真实 temporal DB 未落地 |
| Sync Outbox | 已实现预览 | 可见 pending/applied/blocked 事件 |
| Trace Runtime | 已实现预览 | 可见 spans；真实 OpenTelemetry/exporter 未落地 |
| Module Debug | 已实现 | 模块健康、metrics、trace id 可见 |
| MCP Connector | 预览实现 | UI 已列出 mcp-agent-gateway；真实 MCP server 未实现 |
| HTTP API | 未落地 | 仍是 planned |
| Tool Gateway | 未落地 | 还没有真实 approval_token 强制校验 |
| Durable Checkpoint/Store | 未落地 | 仍是 JSON/generated store |
| Scheduler/Agent Clock | 预览/样例 | 需要真实 clock loop 和 resume worker |

## Agent 易用性评估

### 结论

```text
Workbench 作为人机调试面和 agent 外脑预览：可用性高。
作为真实 agent 万用插件执行面：中等，核心接口还需要落地。
```

### 优点

1. 外部 agent 能快速看到 scope、route、FAME、context budget、同步状态。
2. 不需要全量知识进入上下文，目录、搜索、GoalGate、Context Pack 都是按需取用。
3. 工程记忆和核心知识网边界清晰，不容易污染核心知识。
4. 失败教训没有被删除，而是用负值 FAME 和 lesson 继续参与剪枝与复盘。
5. 多模态设计是轻索引，不会把图谱拖成重资产库。

### 主要缺口

1. 真实 MCP server 必须优先实现，否则 agent 只能看 UI preview。
2. Tool Gateway 必须要求 ApprovedAction + approval_token，否则“强制执行机制”还只是设计约束。
3. 需要 HTTP API 给非 MCP agent、web workflow、后台 worker 使用。
4. 需要 durable event log / checkpoint store，把 JSON 预览升级为可恢复运行时。
5. 需要 embedding + BM25 + graph traversal + community summary，提升大图谱语义定位质量。
6. 需要真实 scheduler：ClockEvent、resume_task、stale route check、human review reminder。
7. 需要评测集：tool success rate、context token saving、failure recurrence、route posterior accuracy、enforcement bypass block rate。

## 推荐下一步

### P0：真实 Agent Gateway

```text
packages/gateway 或 runtime_server:
  MCP tools:
    resolve_goal
    route_knowledge
    propose_action
    enforce_action
    pack_context
    write_summary
    submit_patch
    get_sync_status

  MCP resources:
    fame://knowledge/index
    fame://knowledge/shards/{subject}
    fame://project-memory/{project_id}
    fame://v13/runtime
    fame://assets/index

  Enforcement:
    ProposedAction -> schema validation -> FAME/scope/manual/context checks -> ApprovedAction

  Tool Gateway:
    reject all direct tool calls without approval_token
```

### P1：Durable Runtime

```text
append-only event log:
  KnowledgePatchProposal
  AssetDbSyncItem
  ApprovedAction
  ToolResult
  FAMEHistory
  TraceSpan
  ClockEvent

storage:
  SQLite/Postgres for events/checkpoints
  vector index for semantic lookup
  graph backend optional for temporal relations
```

### P2：大图谱检索增强

```text
indexing:
  project_id / subject / route_id / shard_id / asset_id
  BM25 + embedding + graph neighbor expansion
  community summaries
  route posterior cache

traversal:
  scope first
  language-tree anchor
  GoalGate beam
  FAME prune
  context pack
```

### P3：评测与开源准备

```text
benchmarks:
  tool_success_rate
  context_token_saving
  failure_recurrence_reduction
  enforcement_bypass_block_rate
  route_resolution_latency
  patch_review_latency
  memory_resume_success_rate

open-source:
  examples/agent-mcp-client
  examples/http-client
  docs/plugin-contract.md
  docs/evaluation.md
  SECURITY.md policy update
```

## 参考来源

- MCP Tools: https://modelcontextprotocol.io/specification/2025-06-18/server/tools
- MCP Resources: https://modelcontextprotocol.io/specification/2025-06-18/server/resources
- OpenAI Agents SDK Guardrails: https://openai.github.io/openai-agents-python/guardrails/
- OpenAI Agents SDK Tracing: https://openai.github.io/openai-agents-python/tracing/
- LangGraph Persistence: https://docs.langchain.com/oss/python/langgraph/persistence
- Microsoft GraphRAG: https://microsoft.github.io/graphrag/
- Graphiti Overview: https://help.getzep.com/graphiti/getting-started/overview

## WorkEndSummary

```yaml
files_changed:
  - workbench/scripts/build-knowledge-universe.mjs
  - workbench/src/App.tsx
  - workbench/src/generated/knowledgeUniverse.generated.ts
  - workbench/public/generated/knowledgeIndex.generated.json
  - workbench/public/generated/knowledgeGraph.generated.json
  - 方案设计/27_最终机制对齐与Agent接入系统评测.md
design_decisions:
  - 保持 Full Memory Retention，不引入记忆蒸发。
  - 把同名 .md/.yaml 文件的索引 ID 做到文件级唯一。
  - 把字符串列表 React key 改为值+序号，避免重复 route_id 干扰调试。
  - 明确区分 Workbench 预览面与真实 MCP/HTTP 执行面。
unresolved_questions:
  - 是否下一步直接实现真实 MCP/HTTP Gateway。
  - durable store 先选 SQLite 还是 Postgres。
  - temporal graph backend 先自研轻量事件表，还是接 Graphiti/Neo4j。
next_goal_gate: real-mcp-http-enforcement-gateway
context_release_summary: 本轮完成最终机制评测、唯一性修复、冷启动实测和 agent 接入缺口排序。
```
