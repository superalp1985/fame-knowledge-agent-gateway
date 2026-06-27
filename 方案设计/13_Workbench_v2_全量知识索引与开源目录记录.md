# Workbench v2：全量知识索引与开源目录记录

日期：2026-06-27

## WorkStartAlignment

```yaml
project_positioning: Agent 万用外部插件 / 外脑运行时 / 工具治理网关
current_task: connect full knowledge net gradually and prepare open-source project layout
active_scope:
  project_id: fame-agent-gateway
  subject: knowledge-index-open-source
  route_id: full-knowledge-index-and-oss-layout
  task_id: connect-knowledge-net-prepare-oss
active_goal_gate:
  goal_type: integrate_indexer / prepare_open_source
  success_condition: local knowledge roots indexed into shards; repository has safe open-source structure
enforcement_required: true
context_budget_strategy: summary_first
```

## 核心判断

用户指出“知识网内的知识接完整，量大但不着急”。本轮选择的实现策略是：

```text
全量进入索引
分片进入摘要
3D 只展示 LOD 总览
2D / 检索 / patch 按需下钻
```

不把 5000+ 知识节点一次性画进 3D 图，避免大图爆炸和浏览器负载过高。

## 已接入知识根

```yaml
knowledge_roots:
  - id: bnai-agent
    path: knowledge_backup/BNAI智能agent知识网
    indexed_files: 140
  - id: jianmu
    path: knowledge_backup/建木知识网
    indexed_files: 1277
```

当前索引结果：

```yaml
total_indexed_files: 1417
route_shards: 36
universe_nodes: 229
universe_links: 247
knowledge_index_size_bytes: 2111932
knowledge_universe_size_bytes: 141990
```

## 生成器升级

文件：

```text
workbench/scripts/build-knowledge-universe.mjs
```

生成：

```text
workbench/src/generated/knowledgeUniverse.generated.ts
workbench/src/generated/knowledgeIndex.generated.ts
```

索引层级：

```text
knowledge root
-> root/subject route shard
-> file entry
-> headings
-> redacted excerpt
-> keywords
```

排除噪声：

```text
node_modules
__pycache__
dist
build
outputs
cache
leaderboard_runs
results
package-lock.json
```

安全处理：

```text
excerpt 中对 sk-*、api_key、token、secret、password、base_url、api_url 做基础脱敏
开源仓库默认忽略 knowledge_backup 与 generated index
```

## Workbench UI 更新

3D 节点现在带有：

```text
shard_id
file_path
subject
root
```

右侧检查器新增：

```text
知识分片摘要
样例文件
关键词
知识根分片列表
```

3D 仍然只承载大局：

```text
FAME 知识网总根
-> 两个知识根
-> 36 个 subject shard
-> 每个 shard 的代表文件
```

## 开源目录准备

新增：

```text
README.md
LICENSE
CONTRIBUTING.md
SECURITY.md
.gitignore
.editorconfig
.env.example
package.json
docs/README.md
docs/open-source-preparation.md
docs/knowledge-indexing.md
docs/workbench-architecture.md
examples/sample-knowledge/README.md
```

关键规则：

```text
knowledge_backup/ 不提交
workbench/src/generated/ 不提交
.env 不提交
真实知识网和本地生成索引默认视为私有数据
```

## 验证

根目录执行：

```text
npm run generate:knowledge
npm run build
```

结果：通过。

构建提示：

```text
Three.js + 全量 generated index 使 bundle 超过 500KB。
当前原型可接受；下一步应把 knowledgeIndex 外置为 JSON/SQLite 或动态加载。
```

## 下一步 GoalGate

```yaml
goal_type: optimize_index_loading / scoped_drilldown
success_condition: 3D selected shard loads local 2D route detail without bundling full private index
required_outputs:
  - generated index emitted as external JSON or local DB
  - dynamic import or fetch-based shard loading
  - 3D node -> shard -> 2D detail adapter
  - local search box over shard titles/headings/keywords
  - KnowledgePatchProposal default target follows selected shard
```

## WorkEndSummary

```yaml
files_changed:
  - .gitignore
  - .editorconfig
  - LICENSE
  - README.md
  - CONTRIBUTING.md
  - SECURITY.md
  - .env.example
  - package.json
  - docs/README.md
  - docs/open-source-preparation.md
  - docs/knowledge-indexing.md
  - docs/workbench-architecture.md
  - examples/sample-knowledge/README.md
  - workbench/package.json
  - workbench/README.md
  - workbench/scripts/build-knowledge-universe.mjs
  - workbench/src/generated/knowledgeUniverse.generated.ts
  - workbench/src/generated/knowledgeIndex.generated.ts
  - workbench/src/App.tsx
  - workbench/src/App.css
  - 方案设计/13_Workbench_v2_全量知识索引与开源目录记录.md
design_decisions:
  - 两套知识网都进入本地索引。
  - 3D 图保持 LOD 总览，不绘制所有文件节点。
  - Open-source 仓库默认排除私有知识、生成索引、env、缓存和构建产物。
  - 索引摘要做基础脱敏，但不作为安全保证。
diagrams_updated: []
unresolved_questions:
  - 全量索引应迁移到 JSON、SQLite 还是 DuckDB。
  - 选中 3D shard 后，2D Route Detail 需要怎样从文件标题/章节生成路线图。
  - 开源发布前需要做正式 secret scan。
next_goal_gate: externalize generated index and implement selected-shard drilldown
context_release_summary: v2 已完成多知识根全量文本索引、shard 摘要和开源目录骨架；下一轮先读 10/01/08/09/12/13。
```
