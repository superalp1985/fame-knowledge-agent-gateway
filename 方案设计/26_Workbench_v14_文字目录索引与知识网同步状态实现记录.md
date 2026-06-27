# Workbench v14：文字目录索引与知识网同步状态实现记录

日期：2026-06-27

## WorkStartAlignment

```yaml
project_positioning: Agent 万用外部插件 / 外脑运行时 / 工具治理网关
current_task: 增加可逐级展开的文字目录索引，并显示知识网修改同步状态
active_scope:
  project_id: fame-agent-gateway
  subject: knowledge-directory
  route_id: directory-tree-sync-status
  task_id: workbench-v14-directory-index
active_goal_gate:
  goal_type: pass_quality_gate
  success_condition: 用户可按大科目展开知识目录，定位 shard/file/route，并看到 KnowledgePatchProposal、Asset DB Sync、v13 Outbox 的同步状态
required_modules:
  - knowledge_directory_tree
  - shard_sync_status
  - search_directory_handoff
  - route_2d_handoff
  - browser_smoke_test
enforcement_required: true
context_budget_strategy: summary_first
```

## 调研结论

成熟文档/知识项目通常把文字目录放在主导航侧边栏或独立目录视图：

```text
Docusaurus:
  sidebar 支持按文件夹和 category 自动生成，适合文档/知识按层级展开。

VitePress:
  sidebar 是文档主导航，适合按主题和子主题展开。

GitBook:
  左侧 table of contents 是主要浏览入口。

Obsidian:
  File Explorer 是核心左侧文件树，用来按文件夹和笔记定位知识。
```

本项目采用“左侧入口 + 主工作区 Directory 树”的方式：左侧 `Directory` 是稳定入口，主工作区负责大科目逐级展开、状态显示和 2D/搜索联动。这样不会把已有 3D 视图挤得更重。

## 实现内容

新增视图：

```text
ViewMode: directory
sidebar nav: Directory
main stage: Knowledge Directory
```

目录层级：

```text
root
-> subject
-> shard
-> sample files / sample routes
```

目录数据源复用现有运行时索引：

```text
knowledgeIndex.stats.roots
knowledgeIndex.shards
knowledgeIndex.entries
routeGraphStats.subjects
```

不重新扫描文件，不额外塞入文件全文；目录只承载轻量索引、路径、样例文件、样例路线和同步状态。

## 同步状态

目录每层显示 `sync-pill`：

```text
clean
synced
pending
review
outbox
blocked
```

状态来源：

```text
KnowledgePatchProposal:
  proposed / review -> review
  approved -> pending

Asset DB Sync queue:
  synced -> synced
  pending_review / needs_review -> review
  other non-synced -> pending

v13 Sync Outbox:
  pending / approved / sent -> outbox
  applied / replayed -> synced
  failed / blocked -> blocked
```

同步边界：

```text
目录只显示索引和同步状态。
核心知识写入仍走 KnowledgePatchProposal / promotion review。
资产数据库写入仍走 ApprovedAction。
多模态原始数据仍留在 asset store。
```

## 交互

```text
点击 Directory:
  打开文字目录索引。

点击 root:
  展开或折叠大科目根。

点击 subject:
  展开或折叠学科分组。

点击 shard:
  选中该知识分片，并在右侧显示 files/routes/entries/sync。

点击 打开 2D 局部路线:
  进入对应 2D Detail。

搜索命中 knowledge-shard / knowledge-file:
  跳转 Directory。

搜索命中 route_record:
  跳转 2D Detail 并聚焦 route entry。
```

## 实机测试

### 1. 静态质量门

```text
npm run lint
result: pass

npm run build
result: pass
```

### 2. 旧策略词审计

```text
rg "Memory Evaporation|memory_evaporation|MemoryEvaporation|evaporate|evaporation|记忆蒸发|蒸发"
result: no matches
```

### 3. 浏览器目录入口

```text
Directory nav: visible
runtime index ready / 623 files: visible
Knowledge Directory: visible
directory tree ready: true
root rows: true
subject rows: true
sync pills: true
console warn/error: 0
```

### 4. 展开与 2D 联动

```text
展开 建木知识网: pass
显示学科: 数学、物理、化学、会计学、经济学、FinEval 等
点击 打开 2D 局部路线: pass
2D Detail active: true
ReactFlow canvas: true
模块编辑器: visible
console warn/error: 0
```

### 5. 搜索联动

```text
搜索 数学: pass
第 1 条 3D 节点结果 -> 3D Universe
第 2 条 knowledge-shard 结果 -> Directory
Directory 中显示数学、sync 状态和打开 2D 入口
console warn/error: 0
```

## WorkEndSummary

```yaml
files_changed:
  - workbench/src/App.tsx
  - workbench/src/App.css
  - 方案设计/26_Workbench_v14_文字目录索引与知识网同步状态实现记录.md
design_decisions:
  - 文字目录采用独立 Directory 视图，避免加重 3D 画布。
  - 目录按 root/subject/shard/files/routes 展开，模仿 Docusaurus/VitePress/GitBook/Obsidian 的侧栏目录经验。
  - 同步状态从 KnowledgePatchProposal、Asset DB Sync queue、v13 Outbox 计算，不直接写核心知识网。
diagrams_updated: []
unresolved_questions:
  - 下一步可把 Directory 的展开状态持久化到 Project Memory 或 local runtime store。
next_goal_gate: persistent_directory_state_and_real_patch_review
context_release_summary: 本轮新增文字目录索引和知识网同步状态，解决大图谱中按科目逐级定位和修改同步可见性问题。
```

## 参考

- Docusaurus sidebar: https://docusaurus.io/docs/sidebar
- VitePress sidebar: https://vitepress.dev/reference/default-theme-sidebar
- GitBook table of contents: https://docs.gitbook.com/getting-started/what-is-gitbook
- Obsidian File Explorer: https://help.obsidian.md/plugins/file-explorer
