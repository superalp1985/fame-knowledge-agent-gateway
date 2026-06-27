# Workbench v7：3D交互锁定与知识补网记录

日期：2026-06-27

## WorkStartAlignment

```yaml
project_positioning: Agent 万用外部插件 / 外脑运行时 / 工具治理网关
current_task: 3D 图只允许旋转缩放；补齐更多知识网资产接入
active_scope:
  project_id: fame-agent-gateway
  subject: knowledge-workbench
  route_id: 3d-rotate-only-and-expanded-knowledge-index
  task_id: workbench-v7-pan-lock-expanded-index
active_goal_gate:
  goal_type: pass_quality_gate
  success_condition: 3D 不能上下左右平移，完整知识源更多资产进入 runtime index，并通过实机验证
required_modules:
  - knowledge_universe_3d_controls
  - knowledge_indexer
  - runtime_knowledge_index_loader
  - workbench_validation
enforcement_required: true
context_budget_strategy: summary_first
```

## 用户指出的问题

```text
1. 3D 图只能旋转和放大缩小，不能左右上下移动。
2. 知识网还有大量知识没有进网，需要把内容补全。
```

## 3D 交互修正

更新文件：

```text
workbench/src/KnowledgeUniverse3D.tsx
```

实现：

```text
controls.enablePan = false
controls.autoRotate = false
mouse LEFT = ROTATE
mouse MIDDLE = DOLLY
mouse RIGHT = ROTATE
touch ONE = ROTATE
touch TWO = DOLLY_ROTATE
```

新增只读验收状态：

```text
data-pan-enabled
data-auto-rotate
data-controls-target
```

用途：实机测试时确认拖拽后 `controls.target` 不变，证明没有平移。

## 知识网补网审计

private 知识源原始统计：

```text
BNAI智能agent知识网: 140 files
建木知识网: 19918 files
total: 20058 files
```

v6 索引状态：

```text
indexed: 5559 files
ignoredDir: 13362 files
unsupported: 1133 files
```

主要未接入来源：

```text
unsupported ext:
  .py 763
  .html 129
  .sh 30
  .rst 24
  .tsv 15
  .js/.ts/.tsx/.css/log/conf 等

ignored dir:
  node_modules 10750
  outputs 2377
  __pycache__ 120
  .git 115
```

判断：

```text
node_modules/.git/__pycache__ 继续排除，属于依赖或缓存噪声。
outputs 不能整体排除，因为里面有研究简报、课程大纲、讲稿、PPT、PDF、视频、音频等知识产物。
代码/脚本/HTML/RST/log 也应作为工程路线、生成路线和证据资产接入。
```

## 索引规则更新

更新文件：

```text
workbench/scripts/build-knowledge-universe.mjs
```

新增文本类：

```text
.tsv .rst .html .htm .py .js .jsx .ts .tsx .mjs .cjs
.css .scss .vue .sh .ps1 .cmd .bat .dockerfile
.conf .cfg .toml .xml .jinja .tmpl .log
```

新增资产 metadata 类：

```text
.ico .mid .sqlite .db .npy .pt .safetensors .tiktoken .bpe
.whl .zip .ttf .woff .woff2
```

新增无扩展名文本白名单：

```text
Dockerfile / Modelfile / Makefile / README / LICENSE / requirements
```

调整忽略目录：

```text
继续忽略:
  .git
  .cache
  __pycache__
  node_modules
  dist
  build
  cache

不再整体忽略:
  outputs
```

保护：

```text
文本文件超过 1MB 时只读取前 1MB 做 excerpt preview。
完整文件仍作为资产路径进入 index，不把长日志/长代码全文塞入运行时摘要。
```

## 重新生成结果

命令：

```powershell
$env:FAME_KNOWLEDGE_SOURCE='private'; npm run generate:knowledge; Remove-Item Env:\FAME_KNOWLEDGE_SOURCE
```

结果：

```text
indexed files: 9030
routes: 2714
shards: 39
universe nodes: 255
universe links: 287
knowledgeIndex.generated.json: 11,942,600 bytes
knowledgeGraph.generated.json: 209,649 bytes
asset coverage: 1314 files
```

相对 v6：

```text
5559 -> 9030
新增接入: 3471 files
```

新增较多的类型：

```text
.md: 1612
.py: 778
.html: 205
.pdf: 97
.srt: 96
.mp4: 77
.wav: 69
.pptx: 47
.ps1: 37
.sh: 30
.rst: 24
```

## 验证

### lint

```text
npm run lint
通过
```

### build

```text
npm run build
通过
入口 JS: 1,106.01 KB
gzip: 290.70 KB
```

说明：知识补网后主包仍保持约 1.1MB，说明 runtime JSON 外置策略有效。Vite 仍提示 chunk > 500KB，后续仍建议 code splitting。

### 浏览器实机

测试地址：

```text
http://127.0.0.1:5179/
```

结果：

```text
runtime index ready / 9030 files: 通过
routes 2714: 通过
3D canvas 正常: 通过
autoRotate=false: 通过
panEnabled=false: 通过
拖拽后 controls.target 仍为 0.000,0.000,0.000: 通过
console error: 0
```

## 当前判断

```text
1. 3D 图已经锁定为旋转 + 缩放，不再允许上下左右移动。
2. 知识网接入从 5559 扩展到 9030，补入 outputs、代码脚本、网页/RST/日志和更多资产 metadata。
3. 仍不应把 node_modules/.git/cache 等依赖噪声接入知识网。
4. 单体 runtime JSON 已达 11.9MB，下一步必须做 shard-level lazy loading 或 SQLite/DuckDB。
```

## WorkEndSummary

```yaml
files_changed:
  - workbench/src/KnowledgeUniverse3D.tsx
  - workbench/scripts/build-knowledge-universe.mjs
  - workbench/src/generated/knowledgeUniverse.generated.ts
  - workbench/public/generated/knowledgeIndex.generated.json
  - workbench/public/generated/knowledgeGraph.generated.json
  - 方案设计/18_Workbench_v7_3D交互锁定与知识补网记录.md
design_decisions:
  - 3D Universe 禁止 pan，只保留 rotate/dolly。
  - outputs 作为知识产物目录接入，不再整体忽略。
  - 代码/脚本/HTML/RST/log 作为工程路线证据进入索引。
  - node_modules/.git/cache 继续排除。
  - 超大文本只读前 1MB 作为摘要预览，避免运行时膨胀。
diagrams_updated: []
unresolved_questions:
  - 9030 files 单体 JSON 已偏大，下一步应拆 shard JSON 或接 SQLite/DuckDB。
  - 3D universe 仍是 255 nodes 的总览层，后续是否按搜索动态加载更多 3D 局部点需要单独设计。
next_goal_gate: shard-level lazy loading and patch proposal persistence
context_release_summary: v7 已修复 3D 平移问题并补入更多知识资产；下次开工先读 10/08/09/18。
```
