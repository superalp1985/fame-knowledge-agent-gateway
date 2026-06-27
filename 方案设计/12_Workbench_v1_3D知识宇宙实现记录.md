# Workbench v1：3D 知识宇宙实现记录

日期：2026-06-27

## WorkStartAlignment

```yaml
project_positioning: Agent 万用外部插件 / 外脑运行时 / 工具治理网关
current_task: upgrade Workbench from 2D-first to 3D overview + 2D local detail
active_scope:
  project_id: fame-agent-gateway
  subject: knowledge-workbench
  route_id: 3d-overview-local-2d-detail
  task_id: upgrade-workbench-3d-knowledge-map
active_goal_gate:
  goal_type: generate_artifact
  success_condition: 3D knowledge universe is primary overview; 2D remains local route/detail/patch layer
enforcement_required: true
context_budget_strategy: summary_first
```

## 核心判断

2D 图适合：

```text
某一条 route 的具体展示
FAMEEdgeState 检查
GoalGate 剪枝细节
KnowledgePatchProposal 审核
工具治理和模块调试
```

但现有知识网具有学科间联想、抽象层、跨域迁移和大局观，2D 总览会显得单薄。因此 v1 改为：

```text
3D Knowledge Universe = 大局/学科/跨域联想主视图
2D Route Detail = 局部/具体路线/补丁修改辅助视图
```

## 已实现

### 1. 真实知识网 3D 数据生成

新增生成器：

```text
workbench/scripts/build-knowledge-universe.mjs
```

从以下目录扫描：

```text
knowledge_backup/BNAI智能agent知识网
```

生成：

```text
workbench/src/generated/knowledgeUniverse.generated.ts
```

当前生成结果：

```yaml
node_count: 139
link_count: 152
domain_count: 18
```

节点分层：

```text
core: 建木知识网核心
bridge: 根协议文件，如 README_FOR_AGENT、knowledge_hierarchy、tool_aware_reasoning
subject: 学科目录星团
file: 学科内部文件节点
```

跨学科边示例：

```text
art -> photography
photography -> film
film -> video
narrative -> literature
audio -> music
chart_diagram -> ppt
design_systems -> art
language_tree_links -> schemas
schemas -> production_pipeline
review_prompts -> production_pipeline
```

### 2. Three.js 3D 主视图

新增：

```text
workbench/src/KnowledgeUniverse3D.tsx
```

能力：

```text
OrbitControls 旋转/缩放/拖动
学科星团空间分布
文件节点卫星分布
跨学科联想边
节点 label sprite
点击节点后右侧显示节点详情
选中节点 ring 高亮
轻微自动旋转，保留空间感
```

### 3. Workbench 双层布局

主导航新增：

```text
3D Universe
2D Detail
FAME Heatmap
GoalGate
Patch Entry
Module Debug
```

职责划分：

```text
3D Universe:
  学科总览、跨域联想、大局空间结构、选中学科/文件入口

2D Detail:
  当前 route 的可编辑局部图、FAME 边检查、GoalGate 路径细节
```

### 4. 响应式修正

桌面：

```text
左侧控制区 + 中间 3D 主画布 + 右侧检查器
无横向溢出
```

移动端：

```text
先显示 3D 主工作区
再显示控制区
再显示检查器
无横向溢出
```

## 验证

构建：

```text
npm run build
```

结果：通过。

说明：

```text
Vite 对 Three.js bundle 给出 chunk size warning。
当前 v1 原型可接受；后续可将 3D Universe 动态 import 做代码分割。
```

浏览器验证：

```yaml
desktop:
  canvas_size: 645 x 1017
  horizontal_overflow: false
  non_background_ratio: 0.1797
mobile:
  canvas_size: 390 x 620
  horizontal_overflow: false
  non_background_ratio: 0.2443
```

2D Detail 验证：

```text
可正常切换
React Flow 局部 route 图正常显示
右侧 FAME Edge 检查器正常显示
```

## 依赖变化

新增：

```text
three
@types/three
pngjs
jpeg-js
```

`pngjs` 和 `jpeg-js` 当前用于本地截图像素检查。若后续不保留自动视觉测试，可移除；若保留，则应写成正式 visual test 脚本。

## 下一步 GoalGate

```yaml
goal_type: integrate_indexer / improve_3d_navigation
success_condition: 3D node selection drives scoped route shard loading and 2D local detail
required_outputs:
  - subject/domain filter
  - selected 3D node -> route shard adapter
  - search/focus controls
  - large graph level-of-detail strategy
  - dynamic import for Three.js view
```

## WorkEndSummary

```yaml
files_changed:
  - workbench/package.json
  - workbench/package-lock.json
  - workbench/scripts/build-knowledge-universe.mjs
  - workbench/src/generated/knowledgeUniverse.generated.ts
  - workbench/src/KnowledgeUniverse3D.tsx
  - workbench/src/App.tsx
  - workbench/src/App.css
  - 方案设计/12_Workbench_v1_3D知识宇宙实现记录.md
design_decisions:
  - 3D Universe 成为知识网主总览层。
  - 2D Detail 保留为局部路线、补丁、FAME 和调试层。
  - 3D 数据先从真实 knowledge_backup 扫描生成，避免纯手工假图。
  - 移动端优先显示 3D 主工作区，再显示控制区和检查器。
diagrams_updated: []
unresolved_questions:
  - 大图进一步扩展时是否引入 LOD、搜索聚焦、社区折叠。
  - 3D 选中节点如何精确映射到 route shard 和 FAMEEdgeState。
  - 是否将截图像素检查固化为 npm visual test。
next_goal_gate: selected 3D node drives scoped 2D route shard and knowledge patch target
context_release_summary: v1 已形成 3D 总览 + 2D 局部细节结构；下一轮先读 10/01/08/09/11/12。
```
