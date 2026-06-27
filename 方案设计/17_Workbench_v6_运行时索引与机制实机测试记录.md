# Workbench v6：运行时索引外置与机制实机测试记录

日期：2026-06-27

## WorkStartAlignment

```yaml
project_positioning: Agent 万用外部插件 / 外脑运行时 / 工具治理网关
current_task: 完整知识索引外置、机制功能对齐、Workbench 实机验收
active_scope:
  project_id: fame-agent-gateway
  subject: knowledge-workbench
  route_id: externalized-index-mechanism-test
  task_id: workbench-v6-runtime-index-and-mechanism-test
active_goal_gate:
  goal_type: pass_quality_gate
  success_condition: 完整知识源可运行时加载，3D/2D/搜索/FAME/GoalGate/Proposal/Debug 全链路通过实机测试
required_modules:
  - runtime_knowledge_index_loader
  - knowledge_graph_json_loader
  - 3d_universe_drilldown
  - local_route_editor
  - fame_heatmap
  - goalgate_traversal_debug
  - module_debug_runtime
enforcement_required: true
context_budget_strategy: summary_first
```

## 本轮目标

上一轮 v5 已经接入完整本地知识源，但 `knowledgeIndex.generated.ts` 约 7.2MB，会被打入前端主包，不符合“上下文健康”和“大图按需加载”的设计。

本轮目标：

```text
1. 保留完整知识底座：5559 files / 2714 routes / 39 shards。
2. 将大索引从 TS bundle 外置为 public/generated/*.json。
3. 前端启动时先显示轻量 3D 宇宙，再运行时加载完整索引。
4. 搜索、2D 局部图、route sample、统计面板都改用 runtime JSON。
5. 对 3D/2D/FAME/GoalGate/Patch/Debug 做实机验收。
```

## 实现内容

### 1. 运行时 JSON 索引

更新文件：

```text
workbench/scripts/build-knowledge-universe.mjs
workbench/src/generated/knowledgeIndex.generated.ts
workbench/src/generated/knowledgeGraph.generated.ts
workbench/public/generated/knowledgeIndex.generated.json
workbench/public/generated/knowledgeGraph.generated.json
```

生成策略：

```text
src/generated/knowledgeIndex.generated.ts:
  只保留类型定义与 loadKnowledgeIndex()

src/generated/knowledgeGraph.generated.ts:
  只保留类型定义与 loadKnowledgeGraph()

public/generated/knowledgeIndex.generated.json:
  entries / shards / stats 完整运行时数据

public/generated/knowledgeGraph.generated.json:
  languageTreeGraph / routeGraphStats / associationGraph / knowledgeSourceCoverage
```

体积变化：

```text
knowledgeIndex.generated.ts:
  旧：约 7.2 MB
  新：约 1.7 KB

knowledgeGraph.generated.ts:
  新：约 1.7 KB

knowledgeIndex.generated.json:
  约 7.5 MB

knowledgeGraph.generated.json:
  约 209 KB

当前 build 入口 JS:
  dist/assets/index-WJco2DQL.js = 1,105,653 bytes
```

说明：`dist/assets` 里存在旧构建残留大 JS 文件，但当前 `dist/index.html` 只引用 `index-WJco2DQL.js` 与 `index-htt4PJ4O.css`。

### 2. 前端运行时加载状态

更新文件：

```text
workbench/src/App.tsx
workbench/src/App.css
```

新增能力：

```text
runtimeDataStatus: loading | ready | error
runtimeDataError: string
emptyKnowledgeIndex / emptyKnowledgeGraph 兜底
侧栏 index-status 状态条
topbar 显示 index ready/loading/error
```

设计意义：

```text
索引服务未加载完成时，3D 宇宙与基础 Workbench 不白屏；
完整索引 ready 后，再打开文件搜索、分片统计、route sample 和 2D 局部细节。
```

### 3. 机制边界保持

本轮没有直接写核心知识网内容。

2D 编辑动作仍然遵守：

```text
编辑模块 -> local draft + edit_route proposal
新增模块 -> local draft node + add_route proposal
新增路径 -> local draft edge + add_edge proposal
删除路径 -> local draft 删除 + deprecate_edge proposal
删除模块 -> local draft 删除 + deprecate_edge proposal
```

核心边界：

```text
图上即时变化只是 local draft；
知识网核心写回必须走 KnowledgePatchProposal -> review。
```

## 生成与构建测试

### Step 1：完整私有知识源生成

命令：

```powershell
$env:FAME_KNOWLEDGE_SOURCE='private'; npm run generate:knowledge; Remove-Item Env:\FAME_KNOWLEDGE_SOURCE
```

结果：

```text
通过。
5559 indexed files
2714 routes
39 shards
255 universe nodes
287 links
```

### Step 2：lint

命令：

```powershell
npm run lint
```

结果：

```text
通过。
```

### Step 3：build

命令：

```powershell
npm run build
```

结果：

```text
通过。
当前入口 JS 约 1.1 MB，gzip 后约 290 KB。
Vite 仍提示 chunk > 500 KB，后续可用 code splitting 继续优化。
```

## 浏览器实机测试

测试地址：

```text
http://127.0.0.1:5179/
```

说明：5178 已被占用，Vite 自动切换到 5179。

### Step 4：运行时索引与 3D 初屏

结果：

```text
通过。
页面显示 runtime index ready / 5559 files。
topbar 显示 files 5559 / routes 2714 / shards 39 / assets 897 / nodes 255 / links 287。
3D canvas 已渲染，尺寸约 660 x 650 client px。
```

### Step 5：搜索

测试词：

```text
language
```

结果：

```text
通过。
返回 28 条结果。
覆盖 3D node、knowledge shard、knowledge file。
点击结果可定位到 language 节点。
```

### Step 6：3D -> 2D 下钻

结果：

```text
通过。
3D canvas 双击后进入 2D Detail。
2D React Flow 图出现。
模块编辑面板出现。
```

### Step 7：2D 模块编辑与 Proposal

初始状态：

```text
modules: 12
paths: 11
```

执行动作：

```text
保存模块草稿
新增模块
新增路径
删除路径
打开 Patch Entry
```

结果：

```text
通过。
modules 变为 13。
paths 变为 12。
proposal 列表变为 5 条。
包含 edit_route / add_route / add_edge / deprecate_edge。
```

### Step 8：FAME 负值线路

结果：

```text
通过。
FAME Heatmap 中存在 flow-edge-lesson 风险边。
标签显示“失败教训 / fixes_by / 0.213”。
风险/教训线路与普通健康线路有明显区别。
```

### Step 9：GoalGate 找球门遍历

结果：

```text
通过。
显示 4 个步骤：
Resolve Scope
Candidate Route Lookup
FAME Scoring
Goal Gate Check

包含保留路径与剪枝信息。
```

### Step 10：Module Debug

结果：

```text
通过。
显示 6 个核心模块调试卡片：
knowledge_router
fame_route_evaluator
context_health_manager
tool_governance_gate
enforcement_kernel
agent_clock_scheduler

每个卡片显示 health / explain / dry-run / replay / metrics / trace。
```

### Step 11：3D 手动旋转与控制台

结果：

```text
通过。
页面保留“鼠标拖拽旋转”说明。
拖拽 canvas 后 3D 视图保持可用。
controls.autoRotate = false。
浏览器 console error = 0。
```

## 当前已满足的机制点

```text
[x] 开工前文档对齐
[x] 完整知识源接入，不退回简化版
[x] 大索引运行时加载，避免主 bundle 膨胀
[x] 3D 语言树中心
[x] 3D 手动拖拽，不自动旋转
[x] 3D 双击进入 2D
[x] 2D 双击/面板编辑模块
[x] 2D 增删模块与路径
[x] 所有编辑先形成 proposal
[x] 负值 FAME 路线醒目显示
[x] 搜索覆盖 3D / shard / file / 2D route / FAME edge
[x] GoalGate 找球门遍历显示保留与剪枝
[x] Module Debug 接口面板
[x] build/lint 通过
[x] 浏览器实机测试通过
```

## 剩余问题

```text
1. runtime JSON 目前仍一次性加载完整 knowledgeIndex.generated.json，下一步应拆 shard JSON 或 SQLite/DuckDB。
2. PatchProposal 当前为前端内存态，下一步需要本地 store 与 review/approve/reject UI。
3. 3D 仍使用 TS 内置 universeNodes/universeLinks，当前体积可接受；后续大图扩张时也应外置。
4. 当前 dist 目录有旧构建残留，可在发布流程加入 clean dist。
5. 真实 Tool Gateway / Enforcement Kernel 还在 UI 模拟层，后续要接 MCP/API 执行面。
```

## WorkEndSummary

```yaml
files_changed:
  - workbench/scripts/build-knowledge-universe.mjs
  - workbench/src/App.tsx
  - workbench/src/App.css
  - workbench/src/generated/knowledgeIndex.generated.ts
  - workbench/src/generated/knowledgeGraph.generated.ts
  - workbench/public/generated/knowledgeIndex.generated.json
  - workbench/public/generated/knowledgeGraph.generated.json
  - 方案设计/08_完整版实施蓝图.md
  - 方案设计/09_可视化工作台_联想机制_找球门遍历.md
  - 方案设计/17_Workbench_v6_运行时索引与机制实机测试记录.md
design_decisions:
  - 完整知识索引不再进入前端主 bundle，改为 runtime JSON。
  - App 使用 empty payload 兜底，索引 ready 后再开放完整搜索与统计。
  - 2D 编辑继续只产生 local draft 与 KnowledgePatchProposal。
  - 本轮不清理 dist 旧残留，避免无关文件 churn；发布流程另设 clean。
diagrams_updated: []
unresolved_questions:
  - 是否优先做 shard-level JSON lazy loading，还是先接 SQLite/DuckDB。
  - PatchProposal review store 选前端 IndexedDB、SQLite，还是后端 API。
next_goal_gate: persist patch proposal review flow and shard-level lazy loading
context_release_summary: v6 已完成运行时索引外置与全链路实机测试；下次开工先读 10/08/09/17。
```
