# Workbench v10：项目工程记忆 Overlay 完整实现记录

日期：2026-06-27

## WorkStartAlignment

```yaml
project_positioning: Agent 万用外部插件 / 外脑运行时 / 工具治理网关
current_task: 完整实现项目级工程记忆网，记录实际工程落地，作为 agent 工程外部记忆，并避免污染主知识网
active_scope:
  project_id: fame-agent-gateway
  subject: project-memory
  route_id: project-memory-overlay
  task_id: workbench-v10-project-memory
active_goal_gate:
  goal_type: pass_quality_gate
  success_condition: Project Memory 能独立存储、生成、加载、搜索、可视化，并通过 promotion candidate 与主知识网隔离连接
required_modules:
  - project_memory_graph
  - fame_project_overlay
  - promotion_candidate_review
  - project_memory_workbench_view
  - project_memory_runtime_loader
enforcement_required: true
context_budget_strategy: summary_first
```

## 外部借鉴路线

```text
LangGraph namespace/store:
  借鉴 project_id/agent_id/task_id namespace 分区。

MCP roots:
  借鉴 core root / project root / workspace root 的访问边界。

Graphiti / Zep temporal graph:
  借鉴工程事实、工具调用、失败教训随时间变化。

W3C PROV:
  借鉴 Entity / Activity / Agent 的 provenance 审计结构。
```

## 实现内容

### Project Memory 数据层

新增：

```text
memory/projects/fame-agent-gateway/
  project_manifest.json
  project_graph.jsonl
  project_edges.jsonl
  fame_overlay.jsonl
  tool_invocation_summary.jsonl
  failure_lessons.jsonl
  context_summaries/
  promotion_candidates/
```

这些文件记录项目实际工程落地：

```text
ProjectTask
ProjectDecision
ProjectModule
ProjectArtifact
QualityGateResult
ToolInvocationSummary
FailureLesson
ContextSummary
PromotionCandidate
```

### 生成器

新增：

```text
workbench/scripts/build-project-memory.mjs
```

生成：

```text
workbench/src/generated/projectMemory.generated.ts
workbench/public/generated/projectMemory.generated.json
```

当前生成规模：

```text
projects: 1
nodes: 8
edges: 6
fame overlays: 6
tool invocations: 3
failure lessons: 2
context summaries: 2
promotion candidates: 1
```

### Workbench 视图

新增 `Project Memory` 视图：

```text
project manifest
core isolation card
project FAME overlay
project nodes
tool summaries
failure lessons
context summaries
promotion candidates
```

项目节点复用 2D 图：

```text
ProjectTask -> intent
ProjectDecision -> rule
ProjectModule -> tool
ProjectArtifact -> summary
QualityGateResult -> quality
Core Knowledge Anchor -> abstraction
Promotion Candidate Anchor -> lesson
```

Project Memory 2D 图必须显示两类外部锚点：

```text
core:*:
  只读核心知识锚点。项目经验可以引用，但不能直接写入。

promotion-*:
  项目经验进入主知识网的候选桥。默认 blocked，直到 review 通过。
```

### 搜索

Search 新增命中：

```text
project manifest
project memory nodes
failure lessons
promotion candidates
```

点击 project-memory 结果会切换到 Project Memory，并选中对应项目节点。

## 隔离机制

```text
Core Knowledge Net:
  read-only

Project Memory Graph:
  writable overlay

Promotion Candidate:
  proposed / blocked until review
```

工程事件只更新 `E_project`：

```text
E_eff =
  clip(
    0.45 * E_core
  + 0.40 * E_project
  + 0.15 * E_session,
    0, 1
  )
```

主知识网只允许通过：

```text
KnowledgePatchProposal -> review -> approved promotion
```

## 修改文件

```text
memory/projects/fame-agent-gateway/*
workbench/scripts/build-project-memory.mjs
workbench/src/generated/projectMemory.generated.ts
workbench/public/generated/projectMemory.generated.json
workbench/src/App.tsx
workbench/src/App.css
workbench/package.json
方案设计/02_架构图.mmd
方案设计/05_调研摘要.md
方案设计/08_完整版实施蓝图.md
方案设计/09_可视化工作台_联想机制_找球门遍历.md
```

## 验证口径

```text
npm run generate:project-memory
npm run lint
npm run build
browser smoke:
  runtime index ready
  Project Memory nav visible
  Project Memory view visible
  project nodes/edges/core anchors/promotion anchors visible
  failure lesson search visible
  promotion candidate search visible
  console errors = 0
```

2026-06-27 实机结果：

```text
runtime index ready / 623 files
project memory generated: 1 project / 8 project nodes / 6 edges
Project Memory 2D visible nodes: 10
Project Memory 2D visible edges: 6
core anchor visible: Core: jianmu-route-index
promotion anchor visible: Promotion: project-memory-overlay-policy
search dev_server_port_in_use -> Project Memory lesson
search project-memory-overlay-policy -> promotion candidate, core_write_allowed=false
browser console errors: 0
browser console warnings: 0
npm run generate:project-memory: pass
npm run lint: pass
npm run build: pass
```

## WorkEndSummary

```yaml
files_changed:
  - memory/projects/fame-agent-gateway/project_manifest.json
  - memory/projects/fame-agent-gateway/project_graph.jsonl
  - memory/projects/fame-agent-gateway/project_edges.jsonl
  - memory/projects/fame-agent-gateway/fame_overlay.jsonl
  - memory/projects/fame-agent-gateway/tool_invocation_summary.jsonl
  - memory/projects/fame-agent-gateway/failure_lessons.jsonl
  - memory/projects/fame-agent-gateway/context_summaries/workbench-v9-agent-runtime.md
  - memory/projects/fame-agent-gateway/context_summaries/workbench-v10-project-memory.md
  - memory/projects/fame-agent-gateway/promotion_candidates/project_memory_policy.json
  - workbench/scripts/build-project-memory.mjs
  - workbench/src/generated/projectMemory.generated.ts
  - workbench/public/generated/projectMemory.generated.json
  - workbench/src/App.tsx
  - workbench/src/App.css
  - workbench/package.json
  - 方案设计/02_架构图.mmd
  - 方案设计/05_调研摘要.md
  - 方案设计/08_完整版实施蓝图.md
  - 方案设计/09_可视化工作台_联想机制_找球门遍历.md
  - 方案设计/21_Workbench_v10_项目工程记忆Overlay完整实现记录.md
design_decisions:
  - 项目记忆是 overlay，不是核心知识网的一部分。
  - 工程事件默认只写 E_project，不更新 E_core。
  - promotion candidate 是项目经验进入主知识网的唯一入口。
  - Project Memory 复用 2D/FAME 视觉机制，避免另起一套思考方式。
  - Project Memory 图显式渲染 core anchor 与 promotion anchor，表达“引用核心、隔离写入、候选提升”的边界。
diagrams_updated:
  - 02_架构图.mmd 增加 Project Memory Graph 与 promotion candidate 链路。
unresolved_questions:
  - 后续可实现真实 MCP resources: project_memory/project_manifest/project_context_summary。
  - 后续可让 Tool Gateway 自动追加 tool_invocation_summary.jsonl。
  - 后续可增加跨项目 promotion 统计，判断经验是否具备通用性。
next_goal_gate: MCP/HTTP adapter prototype writes and reads ProjectMemoryGraph
context_release_summary: v10 已完整建立项目级工程记忆 Overlay，前端可视化、搜索和 promotion 隔离链路已接入。
```
