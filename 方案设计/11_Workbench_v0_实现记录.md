# Workbench v0 实现记录

日期：2026-06-27

## WorkStartAlignment

```yaml
project_positioning: Agent 万用外部插件 / 外脑运行时 / 工具治理网关
current_task: implement visual Knowledge Workbench + knowledge patch entry
active_scope:
  project_id: fame-agent-gateway
  subject: knowledge-workbench
  route_id: visualization-goalgate-patch
  task_id: initial-workbench-implementation
active_goal_gate:
  goal_type: generate_artifact
  success_condition: runnable first version of workbench with graph visualization and patch proposal entry
enforcement_required: true
context_budget_strategy: summary_first
```

## 已实现位置

```text
workbench/
```

技术栈：

```text
Vite + React + TypeScript
@xyflow/react
lucide-react
zod
```

本版选择 `@xyflow/react` 承载可编辑路线小图和 GoalPath 展示。后续已在 v1 改为 `Three.js 3D Knowledge Universe + React Flow 2D Detail` 的双层结构；v0 保留为局部路线层的基础。

## v0 功能

1. Route Graph
   - 展示意图、建木联想链、抽象判型、scope/index、工具层、Enforcement Kernel、上下文摘要、失败教训区。
   - 节点点击后显示来源、摘要、类型和 route_id。

2. FAME Heatmap
   - 边按 FAME 状态着色：
     - mu 高：绿色
     - kappa 高：蓝色
     - nu 高：黄色
     - delta 高：红色
     - lambda 高：紫色
   - 支持查看 `mu/chi/epsilon/kappa/nu/delta/rho/lambda`、`kappa_eff`、`freshness`、route score。

3. GoalGate / 找球门遍历
   - 已实现 `Scoped Beam Search + FAME Scoring + Goal Gate Check` 的前端模拟引擎。
   - 输出 `GoalPath`、保留节点、剪枝原因、上下文成本。

4. KnowledgePatchProposal 入口
   - 可提交 proposal。
   - proposal 默认保持 `proposed` 状态，不直接写入核心知识网。
   - 符合“补充必须 proposal/review”的治理规则。

5. Module Debug
   - 为核心模块预留调试面板：
     - `knowledge_router`
     - `fame_route_evaluator`
     - `context_health_manager`
     - `tool_governance_gate`
     - `enforcement_kernel`
     - `agent_clock_scheduler`
   - 每个模块展示 health、trace、metrics，对齐 `health/explain/dry-run/replay/metrics/trace` 接口目标。

## 关键源码

```text
workbench/src/model.ts
workbench/src/sampleData.ts
workbench/src/routeEngine.ts
workbench/src/App.tsx
workbench/src/App.css
```

## v0 中已经固化的规则

### FAME 有效置信度

```text
kappa_eff = kappa * freshness * evidence_factor * conflict_penalty
```

### 路由评分

```text
Score(route) =
  w_mu * mu
+ w_chi * chi
+ w_epsilon * epsilon
+ w_kappa * kappa_eff
- w_nu * nu
- w_delta * delta
- w_rho * rho
- w_lambda * lambda
+ w_quality * quality_gate_fit
+ w_scope * subject_scope_fit
```

### 剪枝规则

当前 v0 已实现：

```text
project_id 不匹配
delta > 0.65
rho > 0.80
lambda > 0.72 and failure_count >= 3
freshness < 0.35
```

## 当前验证

```text
npm run build
```

结果：通过。

## 下一步 GoalGate

```yaml
goal_type: update_knowledge / integrate_indexer
success_condition: build real knowledge_backup adapter and persist KnowledgePatchProposal as sidecar files
required_outputs:
  - knowledge shard scanner
  - route summary index
  - patch proposal sidecar writer
  - local API or persistence layer
  - dev-server visual verification
```

## WorkEndSummary

```yaml
files_changed:
  - workbench/package.json
  - workbench/package-lock.json
  - workbench/src/model.ts
  - workbench/src/sampleData.ts
  - workbench/src/routeEngine.ts
  - workbench/src/App.tsx
  - workbench/src/App.css
  - workbench/src/index.css
  - 方案设计/11_Workbench_v0_实现记录.md
design_decisions:
  - Workbench v0 先使用 React Flow 完成路线小图、FAME 热力和 GoalPath 可视化。
  - KnowledgePatchProposal 仅进入 proposed 状态，不直接修改知识网核心文件。
  - 找球门遍历先以本地 routeEngine 固化评分和剪枝规则，后续迁移到 API/插件运行时。
  - 模块调试接口先以面板和数据结构预留，后续接真实 health/explain/dry-run/replay/metrics。
diagrams_updated: []
unresolved_questions:
  - 大图 overview 使用 Sigma.js 还是 Cytoscape.js，需要等知识网索引规模评估后决定。
  - patch proposal 持久化格式建议优先 sidecar YAML/JSONL，待后端确定后实现。
next_goal_gate: integrate real knowledge shard scanner and proposal persistence
context_release_summary: v0 已可构建，核心逻辑在 model/sampleData/routeEngine/App；下一轮先读 10/01/08/09/11。
```
