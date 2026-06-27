# Workbench v5：2D 模块编辑与完整知识接入记录

日期：2026-06-27

## WorkStartAlignment

```yaml
project_positioning: Agent 万用外部插件 / 外脑运行时 / 工具治理网关
current_task: 2D 模块可编辑，补接完整知识网与语言树路线层
active_scope:
  project_id: fame-agent-gateway
  subject: knowledge-workbench
  route_id: editable-2d-full-knowledge-graph
  task_id: workbench-v5-module-editor-full-index
active_goal_gate:
  goal_type: update_knowledge
  success_condition: 双击 2D 模块可编辑；可增删模块/路径；route_index 和语言树内容进入局部图
required_modules:
  - local_route_editor
  - knowledge_indexer
  - language_tree_graph
  - route_index_adapter
  - knowledge_patch_proposal
enforcement_required: true
context_budget_strategy: summary_first
```

## 用户指出的问题

```text
1. 双击 2D 图具体模块，应能编辑该模块。
2. 在同一视窗下，应能直接增加、修改、删除路径和模块。
3. 知识网没有接全，原知识网数量差很多。
4. 语言树没有完全接好。
```

## 数量审计

```yaml
raw_original_files: 19758
previous_public_indexed_files: 619
current_full_local_indexed_files: 5559
route_index_routes: 2714
current_shards: 39
current_3d_nodes: 255
current_3d_links: 287
```

差异原因：

```text
knowledge/ 是开源净化基底，故意过滤了私有、缓存、训练、vendor、outputs、settings、过大文件。
knowledge_backup/ 是本地完整备份，包含大量 .git/node_modules/vendor/hf_cache/outputs/results/source maps。
不能把 19758 个原始文件全当知识节点，否则大图不可用且开源风险高。
```

本轮采用：

```text
public knowledge/ -> 开源基底
private knowledge_backup/ -> 本地完整工作台源
```

完整本地源经过知识资产过滤后，接入 5559 个文件/资产，并拆出 2714 条 route。

## 已实现

### 1. 2D 模块编辑器

更新：

```text
workbench/src/App.tsx
workbench/src/App.css
```

交互：

```text
双击 2D 节点 -> 打开模块编辑视窗
保存模块草稿 -> 更新本地 draft graph，并生成 edit_route proposal
新增模块 -> 新增 draft node + draft edge，并生成 add_route proposal
新增路径 -> 新增 draft edge，并生成 add_edge proposal
删除路径 -> 从 draft graph 移除 edge，并生成 deprecate_edge proposal
删除模块 -> 从 draft graph 移除 node 及相关 edge，并生成 deprecate_edge proposal
```

边界：

```text
图上即时变化是 local draft。
核心知识网仍需 proposal/review。
```

### 2. 完整知识图生成文件

更新：

```text
workbench/scripts/build-knowledge-universe.mjs
workbench/src/generated/knowledgeGraph.generated.ts
```

新增输出：

```text
languageTreeGraph
routeGraphStats
associationGraph
knowledgeSourceCoverage
```

接入内容：

```text
backbone.json:
  language layers
  specific_neurons
  abstraction_rules

route_index.json:
  2714 route records
  subject/domain 聚合
  top sample routes

associations/cross_domain.json:
  48 cross-domain associations

asset metadata:
  jpg/png/pdf/pptx/docx/mp3/wav/mp4/parquet/sqlite 等作为 metadata 节点
```

### 3. 语言树补接

3D Universe 增加：

```text
specific_neurons -> language layer
route subjects -> language tree growth links
```

2D Detail 增加：

```text
当前 shard 的 route_index top sample route nodes
route sample -> abstraction/GoalGate 的 FAME edges
```

这样语言树不再只显示 4 个层节点，而是开始把 route_index 与真实知识路线接到语言树生长结构。

## 验证

执行：

```text
FAME_KNOWLEDGE_SOURCE=private npm run generate:knowledge
npm run lint
npm run build
```

结果：

```text
generate:knowledge 通过
lint 通过
build 通过
```

构建警告：

```text
主 JS bundle 约 7.2MB。
```

原因：完整本地索引和 routeGraphStats 仍打进前端 bundle。下一步必须外置索引：

```text
generated JSON
SQLite/DuckDB
按 shard 动态加载
```

## 下一步

```text
1. 将 knowledgeIndex/knowledgeGraph 从 TS bundle 外置为 JSON 或 SQLite。
2. 2D 编辑器增加目标选择器：路径可连到任意当前模块，而不是默认连 local-patch。
3. route_index 的 2714 条 route 支持搜索后按需展开，而不是只显示 sample_routes。
4. 语言树完整性检查脚本：列出未回连 language tree 的 subject/domain/route。
5. Patch Proposal 持久化到本地 store，并增加 review/approve/reject UI。
```

## WorkEndSummary

```yaml
files_changed:
  - workbench/scripts/build-knowledge-universe.mjs
  - workbench/src/App.tsx
  - workbench/src/App.css
  - workbench/src/generated/knowledgeUniverse.generated.ts
  - workbench/src/generated/knowledgeIndex.generated.ts
  - workbench/src/generated/knowledgeGraph.generated.ts
  - 方案设计/09_可视化工作台_联想机制_找球门遍历.md
  - 方案设计/16_Workbench_v5_2D模块编辑与完整知识接入记录.md
design_decisions:
  - 2D Detail 是局部 route 编辑器，不只是查看器。
  - 2D 编辑即时更新 local draft，但核心知识仍走 proposal/review。
  - 完整本地知识源使用 knowledge_backup，开源基底仍使用 knowledge。
  - 原始 19758 文件不过度全画，只接知识资产与 metadata。
  - route_index 拆为路线层，按 subject/domain/top-k 接入 2D。
diagrams_updated: []
unresolved_questions:
  - 完整索引打包过大，需要外置。
  - 真实写回和 review 状态机还未接入后端。
  - 语言树完整性 repair proposal 需要单独脚本。
next_goal_gate: externalize knowledge graph index and persist patch proposal review flow
context_release_summary: v5 已实现 2D 模块编辑与本地 draft；完整本地知识源接入 5559 资产和 2714 route；下轮先读 10/09/16。
```
