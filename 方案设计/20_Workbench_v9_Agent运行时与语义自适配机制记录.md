# Workbench v9：Agent 运行时与语义自适配机制记录

日期：2026-06-27

## WorkStartAlignment

```yaml
project_positioning: Agent 万用外部插件 / 外脑运行时 / 工具治理网关
current_task: 根据开源路线和项目定位，修正工作台机制与功能，使其面向 agent 连接和建木式思考模式
active_scope:
  project_id: fame-agent-gateway
  subject: knowledge-workbench
  route_id: agent-runtime-semantic-autofit
  task_id: workbench-v9-agent-runtime
active_goal_gate:
  goal_type: pass_quality_gate
  success_condition: Workbench 能展示 agent 插件接入、思考管线、语义自适配、强制门预览、上下文打包，并保持 3D/2D 交互可用
required_modules:
  - agent_runtime_adapter_surface
  - semantic_layout_engine
  - enforcement_preview
  - context_pack_preview
  - knowledge_universe_3d_controls
enforcement_required: true
context_budget_strategy: summary_first
```

## 外部借鉴路线

```text
MCP:
  作为万能插件接口，暴露 tools/resources/prompts。

LangGraph:
  借鉴 durable workflow、checkpoint、human-in-the-loop、resume。

GraphRAG / LightRAG:
  借鉴 global/local、community summary、高低层图谱检索。

Graphiti / Zep:
  借鉴 temporal knowledge graph、事实时效、关系更新。

Semantic Router:
  借鉴语义 route decision，但叠加建木语言树、FAME 和 Enforcement。
```

结论：

```text
开源技术负责接口、检索、时序记忆和工作流。
本项目差异点仍是建木思考方式 + FAME 动态真实性 + 强制执行门 + 上下文健康。
```

## 实现改动

```text
workbench/src/model.ts
  - 增加 AgentConnector、AgentThinkingStage、AgentActionProposal、ApprovedActionPreview。
  - 增加 SemanticAnchor、SemanticAssociationProposal、ContextPackPreview。

workbench/src/agentRuntime.ts
  - 新增 agent runtime 机制层。
  - 定义 MCP/HTTP/CLI/IDE/Workflow 五类连接。
  - 定义 WorkStartAlignment -> Memory Update 的 agent thinking pipeline。
  - 实现 ProposedAction -> ApprovedAction preview。
  - 实现轻量 semantic auto-fit 评分。
  - 实现 context pack retain/release 预览。

workbench/src/App.tsx
  - 新增 Agent Runtime 视图。
  - UI 展示 connectors、thinking pipeline、enforcement checks、semantic proposals、context pack。
  - Agent Runtime 随当前 shard、选中 2D 节点、GoalPath 动态更新。

workbench/src/KnowledgeUniverse3D.tsx
  - 保持左键 pan、右键 rotate、滚轮 zoom。
  - 新增 zoomToCursor、screenSpacePanning、maxTargetRadius、zoomSpeed、panSpeed。
  - 降低 pan 后目标漂移导致缩放像卡住的概率。

workbench/src/App.css
  - 增加 Agent Runtime 面板样式。

方案设计/05_调研摘要.md
  - 追加 agent runtime、MCP、LangGraph、GraphRAG/LightRAG、Graphiti、Semantic Router 调研结论。

方案设计/08_完整版实施蓝图.md
  - 追加 v9 agent runtime plugin rule。

方案设计/09_可视化工作台_联想机制_找球门遍历.md
  - 追加 v9 Agent Runtime view、semantic auto-fit、3D zoom stability。
```

## 机制口径

### Agent 接入

```text
Agent 通过 MCP 优先接入。
HTTP / CLI / IDE / Workflow 是适配层。
所有 adapter 只负责连接，不负责绕过建木/FAME/Enforcement。
```

### 思考模式

```text
WorkStartAlignment
-> Scope Resolve
-> Semantic Route
-> GoalGate Traversal
-> Tool Governance
-> Context Pack
-> Memory Update
```

### 语义自适配

当前先使用轻量公式：

```text
semantic_fit =
  0.42 * token_overlap
+ 0.30 * keyword_hit
+ 0.12 * priority
+ route_type_boost
```

后续可替换或叠加：

```text
embedding similarity
GraphRAG community summary
LightRAG high/low-level retrieval
UMAP/HDBSCAN semantic clustering
Leiden community detection
```

### 强制执行

当前为 preview 机制，真实工具执行仍需未来接 Tool Gateway：

```text
Agent -> ProposedAction -> Enforcement Kernel -> ApprovedAction -> Tool Gateway
```

preview 检查：

```text
scope_check
goalgate_check
manual_check
fame_check
context_check
```

### 上下文健康

Workbench 现在可以显示：

```text
retain:
  scope
  goal
  selected node
  selected FAME edges
  top semantic anchors

release:
  raw tool manual after call
  full search results
  unselected edges
  raw logs after summary
```

## 已验证

```text
npm run lint: passed
npm run build: passed
```

build 仍有 Vite chunk > 500KB 警告，属于后续 code splitting 优化项，不阻塞 v9 机制验证。

## WorkEndSummary

```yaml
files_changed:
  - workbench/src/model.ts
  - workbench/src/agentRuntime.ts
  - workbench/src/App.tsx
  - workbench/src/App.css
  - workbench/src/KnowledgeUniverse3D.tsx
  - 方案设计/05_调研摘要.md
  - 方案设计/08_完整版实施蓝图.md
  - 方案设计/09_可视化工作台_联想机制_找球门遍历.md
  - 方案设计/20_Workbench_v9_Agent运行时与语义自适配机制记录.md
design_decisions:
  - MCP 是接口层，不是路线判断层。
  - Agent Runtime 视图作为万能插件的调试截面。
  - 语义自适配先走轻量可解释评分，后续可升级 embedding/GraphRAG/LightRAG。
  - agent 只能提交 ProposedAction，工具执行必须经过 Enforcement Kernel。
  - 上下文打包必须显示 retain/release。
diagrams_updated:
  - 本轮未改 Mermaid 架构图源，机制先写入 08/09/20。
unresolved_questions:
  - 后续需要把 Agent Runtime preview 接成真实 MCP Server / HTTP API。
  - 后续需要把 semantic auto-fit 结果转为 KnowledgePatchProposal 审核流。
  - 后续需要做知识网正规学科分类重构前的结构审计。
next_goal_gate: MCP/HTTP adapter prototype + semantic taxonomy audit proposal
context_release_summary: v9 已把 Workbench 从图谱浏览器推进为 agent-facing runtime 截面，新增连接、思考管线、语义适配、强制门和上下文打包预览。
```
