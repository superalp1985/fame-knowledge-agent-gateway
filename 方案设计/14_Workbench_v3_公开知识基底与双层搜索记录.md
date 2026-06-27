# Workbench v3：公开知识基底与双层搜索记录

日期：2026-06-27

## WorkStartAlignment

```yaml
project_positioning: Agent 万用外部插件 / 外脑运行时 / 工具治理网关
current_task: include sanitized knowledge net as open-source base and add search for both 3D/2D views
active_scope:
  project_id: fame-agent-gateway
  subject: public-knowledge-base-and-graph-search
  route_id: knowledge-public-base-3d-2d-search
  task_id: workbench-v3-public-knowledge-search
active_goal_gate:
  goal_type: integrate_indexer / improve_navigation
  success_condition: knowledge/ is the public knowledge base; 3D and 2D views can search and select locations
enforcement_required: true
context_budget_strategy: summary_first
```

## 本轮判断

用户确认：知识网要放进项目，作为以后开源继续完善的基底；同时 2D 和 3D 模式都必须有搜索功能，否则大图中找不到位置。

因此本轮把数据边界改成：

```text
knowledge/        -> 公开、可提交、可协作完善的知识网基底
knowledge_backup/ -> 私有、本地、未净化备份，继续忽略
```

不是把 `knowledge_backup/` 原样复制进项目，而是通过脚本生成净化后的 `knowledge/`。原因是备份中混有本地配置、生成物、训练/评测数据、缓存、外部依赖和潜在密钥。

## 已实现

### 1. 公开知识网准备脚本

新增：

```text
scripts/prepare-public-knowledge.mjs
```

能力：

```text
读取 knowledge_backup/
复制公开文本知识文件到 knowledge/
跳过 node_modules、cache、results、leaderboard_runs、training_data、ceval、eval、fineval、vendor、exports、hf_cache 等噪声目录
跳过 settings.json、credentials.json、env、lockfile、tmp/pk/result/round 前缀文件
对常见 api key、client secret、token、password、private url 做模式脱敏
生成 PUBLIC_KNOWLEDGE_MANIFEST.json、SANITIZE_REPORT.md、.sanitize-report.json
```

当前公开基底结果：

```yaml
copied_files: 619
copied_bytes: 27532274
skipped_events: 362
redactions: 61
roots:
  BNAI智能agent知识网: 139
  建木知识网: 480
```

### 2. 索引器默认读取公开知识基底

更新：

```text
workbench/scripts/build-knowledge-universe.mjs
```

新策略：

```text
默认读取 knowledge/
knowledge/ 缺失时回退 knowledge_backup/
FAME_KNOWLEDGE_SOURCE=public 可强制公开基底
FAME_KNOWLEDGE_SOURCE=private 可强制私有备份
```

当前公开基底索引：

```yaml
indexed_files: 619
route_shards: 31
universe_nodes: 200
universe_links: 217
source: knowledge
```

### 3. 3D / 2D 双层搜索

更新：

```text
workbench/src/App.tsx
workbench/src/App.css
```

搜索范围：

```text
3D:
  universe nodes
  route shards
  file titles
  headings
  keywords
  file paths

2D:
  route nodes
  route ids
  summaries
  source refs
  FAME edge ids
  relation types
```

交互规则：

```text
点击 3D 结果 -> 切到 3D Universe，并选中对应 node/shard/file
点击 2D route 结果 -> 切到 2D Detail，并高亮 route node
点击 FAME edge 结果 -> 切到 2D Detail，并选中 edge 与 target node
```

这样 3D 继续承担大局空间结构，2D 承担局部路线细看，但二者都有定位入口。

### 4. 文档更新

更新：

```text
README.md
docs/knowledge-indexing.md
docs/open-source-preparation.md
docs/workbench-architecture.md
examples/sample-knowledge/README.md
```

## 验证

执行：

```text
npm run prepare:public-knowledge
npm run generate:knowledge
npm run build
```

结果：

```text
prepare-public-knowledge: 通过
generate:knowledge: 619 indexed files, 31 shards, 200 nodes, 217 links
build: 通过
```

仍有 Vite chunk size warning：

```text
Three.js + generated knowledge index 仍在同一 bundle 中。
```

下一步应把 knowledge index 外置为 JSON/SQLite/DuckDB 或按 shard 动态加载。

## WorkEndSummary

```yaml
files_changed:
  - scripts/prepare-public-knowledge.mjs
  - package.json
  - README.md
  - docs/knowledge-indexing.md
  - docs/open-source-preparation.md
  - docs/workbench-architecture.md
  - examples/sample-knowledge/README.md
  - knowledge/README.md
  - knowledge/PUBLIC_KNOWLEDGE_MANIFEST.json
  - knowledge/SANITIZE_REPORT.md
  - knowledge/.sanitize-report.json
  - workbench/scripts/build-knowledge-universe.mjs
  - workbench/src/App.tsx
  - workbench/src/App.css
  - workbench/src/sampleData.ts
  - workbench/src/generated/knowledgeUniverse.generated.ts
  - workbench/src/generated/knowledgeIndex.generated.ts
  - 方案设计/14_Workbench_v3_公开知识基底与双层搜索记录.md
design_decisions:
  - knowledge/ 成为开源基底，knowledge_backup/ 保持私有回退。
  - 公开知识网不能裸复制，必须经净化脚本生成。
  - 3D/2D 都需要搜索定位，搜索结果负责切换视图和选中节点/边。
  - 索引器默认 public-first，private fallback 仅服务本地开发。
diagrams_updated: []
unresolved_questions:
  - 正式开源前需要专门 secret scan 和 license review。
  - generated index 仍应外置，避免 bundle 过大。
  - 2D Detail 下一步应从 selected shard 生成真实局部 route，而不只是静态样例 route。
next_goal_gate: externalize generated index and implement selected-shard-to-2D route drilldown
context_release_summary: v3 已把公开知识网放入项目并建立净化流程；Workbench 已支持 3D/2D 搜索定位；下一轮先读 10/01/08/09/13/14。
```
