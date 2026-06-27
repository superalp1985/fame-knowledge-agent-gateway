# Workbench v4：语言树中心与 FAME 风险下钻记录

日期：2026-06-27

## WorkStartAlignment

```yaml
project_positioning: Agent 万用外部插件 / 外脑运行时 / 工具治理网关
current_task: 3D 语言树中心、双击进入 2D、FAME 负值路线高亮、图形化补知识入口
active_scope:
  project_id: fame-agent-gateway
  subject: knowledge-workbench
  route_id: language-centered-3d-2d-fame-risk
  task_id: workbench-v4-drilldown-risk-patch
active_goal_gate:
  goal_type: generate_artifact
  success_condition: 3D 可以手动观察并双击进入局部 2D；负值 FAME 线路清晰可见；补知识入口更傻瓜化
required_modules:
  - knowledge_indexer
  - knowledge_universe_3d
  - local_route_graph
  - fame_route_evaluator
  - knowledge_patch_entry
enforcement_required: true
context_budget_strategy: summary_first
```

## 本轮设计判断

知识网不是普通检索库，而是以语言树为主干、抽象和联想共同生长的创造型知识结构。因此 3D 大图不能继续把普通总根放在中心，而必须让语言树成为视觉和遍历中心。

本轮采用：

```text
3D = 语言树中心 + 学科围绕生长 + 跨域关系 + 风险热力
2D = 当前 shard 的可操作局部路线 + FAME 边 + proposal 入口
```

## 已实现

### 1. 语言树中心 3D Universe

更新：

```text
workbench/scripts/build-knowledge-universe.mjs
workbench/src/generated/knowledgeUniverse.generated.ts
```

变化：

```text
语言树 / Language Backbone 位于 3D 原点
增加语言入口、词汇层、语法层、语义层 bridge 节点
FAME 工程总控退为 governance bridge
知识根、学科分片和 sample 文件围绕语言树生长
language / language_tree / multimodal / root 分片补充回连语言树的 trunk/binding/growth 边
UniverseLink 增加 riskLevel: stable | watch | risk | lesson
```

当前生成结果：

```yaml
indexed_files: 619
route_shards: 31
universe_nodes: 205
universe_links: 236
```

### 2. 3D 手动观察与双击下钻

更新：

```text
workbench/src/KnowledgeUniverse3D.tsx
workbench/src/App.tsx
```

变化：

```text
移除自动旋转
保留 OrbitControls 鼠标拖拽旋转、缩放、阻尼
Raycaster 单击选中节点
dblclick + Raycaster 进入对应 2D 局部图
3D 风险边按 riskLevel 使用颜色、粗细、虚线
```

### 3. 动态 2D 局部路线

更新：

```text
workbench/src/App.tsx
```

双击 3D shard 后，2D 图动态生成：

```text
语言树主干
-> 当前知识分片
-> 抽象与联想
-> 找球门遍历
-> 质量门与强制执行
-> 图形化补知识
-> 负值 FAME 教训
-> 当前 shard sample 文件
```

### 4. FAME 负值路线高亮

更新：

```text
workbench/src/routeEngine.ts
workbench/src/App.tsx
workbench/src/App.css
```

新增 helper：

```text
edgeRiskLevel
edgeRiskLabel
edgeStrokePattern
```

视觉规则：

```text
stable: 健康
watch: 待验证/低新鲜度
risk: 负值风险/冲突阻断
lesson: 失败教训
```

2D 边标签会显示：

```text
健康 / routes_to / score
失败教训 / fixes_by / score
```

### 5. 图形化补知识入口

更新：

```text
workbench/src/App.tsx
workbench/src/App.css
```

Patch Entry 增加 preset：

```text
添加路线
添加联想
记录教训
工具说明
弃用路线
```

每个 preset 自动填：

```text
patch_type
section
target route_id
target file_path
initial_fame
content_summary
evidence_refs
affected_edges
```

仍然只生成 `KnowledgePatchProposal`，不直接写核心知识网。

### 6. 工作台布局修正

修复：

```text
桌面三列固定在 100vh 内
sidebar / inspector 各自滚动
3D canvas 不再被右侧长面板撑到首屏下方
```

## 验证

执行：

```text
npm run generate:knowledge
npm run lint
npm run build
```

结果：

```text
generate:knowledge 通过
lint 通过
build 通过
```

浏览器验证：

```text
3D 初始选中：语言树 / Language Backbone
3D 首屏可见语言树中心与学科围绕结构
双击中心节点进入 2D Detail
2D 局部图显示当前 language shard、sample 文件和失败教训边
```

仍有 Vite chunk size warning，原因是 Three.js + generated knowledge index 在同一 bundle 中。下一步应把 generated index 外置为 JSON/SQLite/DuckDB 或按 shard 动态加载。

## 外部经验吸收

```text
Three.js OrbitControls: 手动拖拽观察 3D 场景
Three.js Raycaster: 3D 节点点击/双击命中
React Flow: 2D 局部图、边样式、标签、动画、点击区域
Cytoscape/Sigma/3d-force-graph 思路: 大图分层、过滤、聚焦、下钻
GraphRAG community view: 大图先看社区/层级，不全量摊平
```

## 下一步

```text
1. 将 generated index 从 bundle 外置，避免大图和知识索引压进主 JS。
2. Patch Proposal 接入本地持久化 store 和 review 状态机。
3. 2D 局部图继续接真实 route_index / first_order_association，而不是只用 shard sample 生成。
4. FAME risk edge 在 3D 增加 hover tooltip 和筛选开关。
5. Knowledge Workbench 增加图形化新增节点/边的 review preview。
6. 增加语言树连接完整性检查：未回连语言树的 shard 自动列入 repair proposal。
```

## WorkEndSummary

```yaml
files_changed:
  - workbench/scripts/build-knowledge-universe.mjs
  - workbench/src/KnowledgeUniverse3D.tsx
  - workbench/src/App.tsx
  - workbench/src/App.css
  - workbench/src/routeEngine.ts
  - workbench/src/generated/knowledgeUniverse.generated.ts
  - workbench/src/generated/knowledgeIndex.generated.ts
  - 方案设计/05_调研摘要.md
  - 方案设计/09_可视化工作台_联想机制_找球门遍历.md
  - 方案设计/15_Workbench_v4_语言树中心与FAME风险下钻记录.md
design_decisions:
  - 语言树是 3D 宇宙视觉中心和知识生长主干。
  - 3D 不自动旋转，只使用鼠标拖拽观察。
  - 双击 3D 节点进入对应 2D 局部路线。
  - 负值 FAME 边以 riskLevel 统一驱动 3D/2D 显示。
  - 补知识入口采用 preset + proposal/review，不直接写核心知识。
diagrams_updated: []
unresolved_questions:
  - 真实 route_index / association 文件量大，需分阶段接入 2D 生成器。
  - generated index 仍应外置，避免 bundle 过大。
  - 语言树完整性 repair proposal 需要单独实现脚本。
next_goal_gate: externalize generated index and connect real route_index/association into local 2D graph
context_release_summary: v4 已完成语言树中心 3D、手动拖拽、双击下钻、FAME 负值边、图形化 patch preset；下轮先读 10/08/09/15。
```
