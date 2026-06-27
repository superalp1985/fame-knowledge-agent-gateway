# Workbench v12：多模态资产数据库与轻量索引实现记录

日期：2026-06-27

## WorkStartAlignment

```yaml
project_positioning: Agent 万用外部插件 / 外脑运行时 / 工具治理网关
current_task: 多模态数据进数据库，知识网只保留轻量预览索引
active_scope:
  project_id: fame-agent-gateway
  subject: multimodal-asset-store
  route_id: asset-db-light-index-preview
  task_id: workbench-v12-multimodal-assets
active_goal_gate:
  goal_type: pass_quality_gate
  success_condition: 多模态原始数据入 asset store，知识网只保存轻量索引、预览、db_ref，并通过 Workbench 搜索/可视化/Project Memory 隔离实测
required_modules:
  - multimodal_asset_store
  - asset_index_generator
  - workbench_assets_view
  - asset_search_router
  - light_index_boundary
  - browser_smoke_test
enforcement_required: true
context_budget_strategy: summary_first
```

## 设计决策

多模态资料不直接进入核心知识图谱。核心知识网只保存 `AssetIndexNode` 级别的轻量索引、摘要、预览类型、route anchor、FAME 摘要和数据库引用。

```text
raw object / OCR / ASR / caption / embedding / thumbnail / extraction log / FAME history
  -> asset_store

AssetIndexNode / route_refs / subject_refs / db_ref / object_ref / text_ref / fame_summary
  -> Workbench graph preview and agent context pack
```

Project Memory 可以记录项目级资产索引，但不得污染核心知识网。需要进入核心知识的经验仍然走 `KnowledgePatchProposal / promotion review`。

## 新增资产库

```text
asset_store/
  multimodal_manifest.json
  assets.jsonl
  asset_index.jsonl
  asset_edges.jsonl
  extraction_runs.jsonl
  asset_fame_history.jsonl
```

首批 seed：

```text
asset-arch-mermaid-svg
asset-v10-project-memory-smoke
asset-fame-paper-pdf
asset-workbench-build-log
asset-route-table-sample
```

## 生成层

新增脚本：

```text
workbench/scripts/build-multimodal-assets.mjs
```

输出：

```text
workbench/src/generated/multimodalAssets.generated.ts
workbench/public/generated/multimodalAssets.generated.json
```

package script：

```text
npm run generate:multimodal
```

生成结果：

```text
5 assets
5 indexes
5 edges
5 extraction runs
5 FAME history records
```

## Workbench 实现

`App.tsx` 新增：

```text
ViewMode: assets
SearchResultKind: multimodal-asset
loadMultimodalAssets()
Assets sidebar nav
topbar asset stats
asset search result handling
asset card grid
asset inspector panel
asset search ranking boost
```

`App.css` 新增：

```text
asset-stage
asset-stage-header
asset-grid
asset-card
asset-thumb
asset modality color blocks
asset-inspector-panel
```

## 搜索规则

搜索覆盖：

```text
asset_id
label
summary
caption
tags
route_refs
subject_refs
db_ref
object_ref
extracted_text_ref
```

显式资产意图词获得加权：

```text
asset
assets
multimodal
db_ref
object_ref
text_ref
thumbnail
route_index
```

验证结果：`route_index` 查询中，核心 `route_index` 根节点和文件仍保留在前两位，`建木路线索引统计表` 多模态资产进入第 3 位，并可点击进入 Assets 视图。

## 命令验证

```text
npm run generate:multimodal: pass
npm run generate:project-memory: pass
npm run lint: pass
npm run build: pass
```

生产构建结果：

```text
index JS: 197.05 KB
vendor-three-renderer: 354.56 KB
vendor-three-core: 177.35 KB
vendor-react: 174.82 KB
vendor-flow: 125.60 KB
Vite large chunk warning: resolved
```

## 浏览器实机测试

### 1. Runtime boot

```text
runtime index ready / 623 files: pass
routes 2714: pass
shards 51: pass
projects 1 / pm edges 6: pass
assets 5 / asset edges 5: pass
```

### 2. Assets view

```text
Assets nav visible and clickable: pass
Multimodal Asset Index visible: pass
5 asset cards visible: pass
Light Index Boundary visible: pass
light_index_only visible: pass
fame-multimodal-asset-store visible: pass
Modality counts visible: pass
Asset FAME Summary visible: pass
Database References visible: pass
Evidence Edges visible: pass
Extraction Runs visible: pass
FAME History visible: pass
```

### 3. FAME paper search

```text
query: FAME 论文
result kind: multimodal-asset
click result -> Assets view: pass
selected asset: asset-fame-paper-pdf
db_ref/object_ref/text_ref visible: pass
raw PDF not inserted into graph context: pass
```

### 4. route_index search

```text
query: route_index
asset result visible in top results: pass
click 建木路线索引统计表 -> Assets view: pass
selected asset: asset-route-table-sample
db_ref/object_ref/text_ref visible: pass
2714 route_record stays out of 3D full graph: pass
```

### 5. Console

```text
browser console errors: 0
browser console warnings: 0
```

## WorkEndSummary

```yaml
files_changed:
  - asset_store/multimodal_manifest.json
  - asset_store/assets.jsonl
  - asset_store/asset_index.jsonl
  - asset_store/asset_edges.jsonl
  - asset_store/extraction_runs.jsonl
  - asset_store/asset_fame_history.jsonl
  - workbench/scripts/build-multimodal-assets.mjs
  - workbench/package.json
  - workbench/src/generated/multimodalAssets.generated.ts
  - workbench/public/generated/multimodalAssets.generated.json
  - workbench/src/App.tsx
  - workbench/src/App.css
  - 方案设计/08_完整版实施蓝图.md
  - 方案设计/09_可视化工作台_联想机制_找球门遍历.md
  - 方案设计/23_Workbench_v12_多模态资产数据库与轻量索引实现记录.md
design_decisions:
  - 多模态原始数据进入 asset_store，核心知识图谱只保留轻量索引和引用。
  - Agent 默认只拿 AssetIndexNode 进入上下文，原始资产按 GoalGate 与 Tool Governance 懒加载。
  - Project Memory 可记录项目资产索引，但不污染核心知识网。
  - 资产搜索加入 asset intent boost，避免明确资产查询被大批 route/file 结果淹没。
diagrams_updated: []
unresolved_questions:
  - 下一步可把 JSON/JSONL asset_store 替换为 SQLite/Postgres + object storage + vector index。
  - 下一步可实现真实 OCR/ASR/caption/embedding worker 与持久化 Tool Gateway。
next_goal_gate: MCP/HTTP adapter exposes AssetIndex resources and lazy raw-asset fetch through ApprovedAction
context_release_summary: v12 已实现多模态资产库、轻量索引生成、Workbench Assets 视图、资产搜索闭环和实机浏览器验证。
```

## v12.1 补充：人工知识网调整同步资产数据库

### 新增目标

用户手动调整知识网时，资产数据库必须方便同步，不能让知识图谱和资产库形成两个互相漂移的真相源。

```text
Human edit
-> KnowledgePatchProposal
-> AssetDbSyncItem
-> review / ApprovedAction
-> asset database write
-> FAME history / summary replay
```

### 新增资产库文件

```text
asset_store/asset_sync_queue.jsonl
```

首批同步项：

```text
sync-seed-route-table-index-refresh
sync-seed-fame-paper-review
```

### manifest 策略更新

```text
manual_knowledge_sync_policy:
  KnowledgePatchProposal -> AssetDbSyncItem -> ApprovedAction before database write

manual_core_edit_boundary:
  manual knowledge edits refresh asset indexes, edges and FAME refs only; raw assets stay in asset store
```

### 生成层更新

`build-multimodal-assets.mjs` 现在读取：

```text
asset_store/asset_sync_queue.jsonl
```

生成 payload 新增：

```text
syncQueue
stats.sync_queue_count
stats.pending_sync_count
```

生成类型新增：

```text
MultimodalAssetSyncItem
```

### Workbench 更新

`App.tsx` 新增运行时同步机制：

```text
RuntimeAssetSyncItem
runtimeSyncItemFromProposal()
operationForPatchType()
statusForPatchSync()
assetSyncQueue = runtime proposals + persisted syncQueue
selectedAssetSyncItems
pendingAssetSyncCount
```

人工动作映射：

```text
add_route -> append_asset_index
edit_route -> refresh_asset_index
add_edge -> upsert_asset_edge
add_lesson -> append_asset_fame_history
deprecate_edge -> append_asset_fame_history
update_tool_manual -> verify_asset_refs
```

UI 新增：

```text
Topbar sync count
Assets view sync count
Assets inspector Manual Sync Boundary
Assets inspector Manual Asset DB Sync
Patch Entry Asset DB Sync Preview
```

### 强制边界

```text
KnowledgePatchProposal 未通过前，不写核心知识网。
ApprovedAction 未签发前，不写资产数据库。
raw_asset_write 默认 false。
无法匹配现有资产时，生成 draft asset index target 并进入 review。
```

### v12.1 命令验证

```text
npm run generate:multimodal: pass
npm run lint: pass
npm run build: pass
```

生产构建结果：

```text
index JS: 202.15 KB
vendor-three-renderer: 354.56 KB
vendor-three-core: 177.35 KB
vendor-react: 174.82 KB
vendor-flow: 125.60 KB
Vite large chunk warning: resolved
```

### v12.1 浏览器实测

```text
runtime index ready / 623 files: pass
topbar sync pending count visible: pass
Assets Manual Sync Boundary visible: pass
Assets Manual Asset DB Sync visible: pass
Patch Entry Asset DB Sync Preview visible: pass
persisted syncQueue + runtime proposal sync visible together: pass
submit KnowledgePatchProposal -> proposal count +1: pass
submit KnowledgePatchProposal -> sync count +1: pass
browser console errors/warnings: 0
```

### v12.1 修复记录

实测发现 Patch Entry 提交 proposal 后页面会空白。原因是提交逻辑把 `event.currentTarget` 传入异步 `setProposals` updater，事件对象/表单引用在 React 更新周期中不稳定。

修复：

```text
submit 时同步生成 nextProposal
setProposals((items) => [nextProposal, ...items])
不再把 event.currentTarget 传入 state updater
```

复测结果：

```text
before: proposalCards 1 / syncCards 3 / sync 3
after: proposalCards 2 / syncCards 4 / sync 4
app shell remains visible
console errors/warnings: 0
```
