# Workbench v8：知识网本体路线接入与 3D 平移修正记录

日期：2026-06-27

## WorkStartAlignment

```yaml
project_positioning: Agent 万用外部插件 / 外脑运行时 / 工具治理网关
current_task: 修正 3D 左键拖动为平移；把 public knowledge/ 建木知识网 route_index.json 的路线本体作为一等知识接入
active_scope:
  project_id: fame-agent-gateway
  subject: knowledge-workbench
  route_id: route-record-ingestion-and-3d-left-pan
  task_id: workbench-v8-knowledge-ontology-route-records
active_goal_gate:
  goal_type: pass_quality_gate
  success_condition: 2714 条路线能被搜索、定位、进入 2D 局部图；3D 左键可上下左右平移，其他交互保持可用
required_modules:
  - knowledge_indexer
  - route_record_runtime_index
  - knowledge_universe_3d_controls
  - local_2d_route_detail
  - workbench_browser_validation
enforcement_required: true
context_budget_strategy: summary_first
```

## 问题纠正

上一版把“更多文件进入索引”当成“知识网补齐”，口径不对。

本项目的知识网核心不是普通检索文件库，而是 `knowledge/建木知识网/route_index.json` 中的路线本体、学科分片、抽象与联想结构。文件只是证据入口，route 才是可推理、可遍历、可进入 2D 的知识节点。

## 实现改动

```text
workbench/scripts/build-knowledge-universe.mjs
  - route_index.json.routes 拆成 entry_type=route_record 的 runtime entries
  - 每条 route_record 保留 subject/domain/type/name/content/keywords/priority/path
  - shard 统计新增 entry_count、route_record_count、sample_routes
  - totalFiles 与 totalRouteRecords 分开统计，避免文件数与知识路线数混淆
  - 纯 route 学科也能生成 subject shard，例如 会计学、经济学、FinEval、数学、物理

workbench/src/App.tsx
  - 搜索支持 knowledge-route 结果类型
  - route_record 命中优先于普通文件命中
  - 点击 route_record 进入对应 subject 的 2D Detail，并把该路线钉为选中模块
  - 2D 图按当前 shard 展示 top route_record 节点，不把全量路线塞入上下文
  - 图例更新为：左键拖动平移，右键旋转，滚轮缩放

workbench/src/KnowledgeUniverse3D.tsx
  - controls.enablePan=true
  - LEFT=PAN
  - MIDDLE=DOLLY
  - RIGHT=ROTATE
  - autoRotate=false 保持不变
```

## 生成口径

使用 public `knowledge/` 源重新生成：

```text
indexed files: 623
route records: 2714
runtime entries: 3337
shards: 51
universe nodes: 235
universe links: 287
knowledgeIndex.generated.json: regenerated runtime JSON
knowledgeGraph.generated.json: 209,256 bytes
```

根分布：

```text
BNAI/建木 上层 knowledge manifest:
  files: 4
  route records: 0

BNAI智能agent知识网:
  files: 139
  route records: 0

建木知识网:
  files: 480
  route records: 2714
```

主要路线学科分片：

```text
FinEval: 1321
FinEval_Accounting: 355
经济学: 298
会计学: 242
数学: 94
物理: 70
化学: 50
生物: 40
地理: 35
历史: 34
```

## 实机测试

### 1. 静态数据验证

```text
route_record entries: 2714
search data includes:
  管理会计职业道德客观诚信 -> 会计学 / 管理会计
  车船税法定免税项目 -> 会计学 / 税法
top route shards include FinEval、经济学、会计学、数学、物理
```

### 2. lint

```text
npm run lint
passed
```

### 3. build

```text
npm run build
passed
main JS: about 1.09 MB
```

Vite 仍提示 chunk > 500KB，这是后续 code splitting 优化项，不阻塞本次机制验证。

### 4. 浏览器实机验证

地址：

```text
http://127.0.0.1:5179/
```

结果：

```text
runtime index ready / 623 files: passed
canvas rendered: passed
panEnabled=true: passed
autoRotate=false: passed
console errors: 0
```

搜索验证：

```text
管理会计职业道德客观诚信:
  first result is route_record
  clicking opens 2D Detail
  selected module: ★ 管理会计职业道德客观诚信
  shard summary: 会计学 / 242 条路线

车船税法定免税项目:
  first result is route_record
  clicking opens 2D Detail
  selected module: ★ 车船税法定免税项目
```

3D 左键平移验证：

```text
before drag controls.target: 0.000,0.000,0.000
after left drag controls.target: 10.560,-9.570,4.049
conclusion: left drag pans/moves target up-down-left-right
```

## 当前判断

```text
知识网的 public 文件层已接入：623/623 files。
建木知识网路线本体已接入：2714 route records。
3D 不全量铺路线，避免图谱爆炸。
2D 按 subject/route_id/search focus 按需展开路线。
搜索现在能定位具体知识路线，不再只定位 route_index.json 文件。
```

## WorkEndSummary

```yaml
files_changed:
  - workbench/scripts/build-knowledge-universe.mjs
  - workbench/src/KnowledgeUniverse3D.tsx
  - workbench/src/App.tsx
  - workbench/src/generated/knowledgeIndex.generated.ts
  - workbench/src/generated/knowledgeGraph.generated.ts
  - workbench/src/generated/knowledgeUniverse.generated.ts
  - workbench/public/generated/knowledgeIndex.generated.json
  - workbench/public/generated/knowledgeGraph.generated.json
  - 方案设计/09_可视化工作台_联想机制_找球门遍历.md
  - 方案设计/19_Workbench_v8_知识网本体路线接入与3D平移修正记录.md
design_decisions:
  - 文件数和路线知识数分开统计。
  - route_index.json.routes 作为 route_record 一等知识节点接入。
  - 3D 保持大局层，不展开全量 route；2D/search 按需展开。
  - 3D 左键为 pan，右键 rotate，滚轮 zoom。
diagrams_updated:
  - 09 文档追加 v8 交互与路线接入规则。
unresolved_questions:
  - 后续可继续做 route shard lazy loading，进一步降低 5.4MB runtime index。
  - 后续可把 2D route top-k 从 priority 扩展为 GoalGate + FAME 动态评分。
next_goal_gate: route shard lazy loading + route_record FAME calibration
context_release_summary: v8 已把 public knowledge 的 623 个文件和建木 2714 条 route 本体分开接入；route records 可搜索、可进入 2D；3D 左键平移已实机验证。
```
