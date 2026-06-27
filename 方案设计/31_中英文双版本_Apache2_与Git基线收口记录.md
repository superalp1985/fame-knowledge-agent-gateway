# 中英文双版本、Apache-2.0 与 Git 基线收口记录

日期：2026-06-27

## WorkStartAlignment

```yaml
project_positioning: Agent 万用外部插件 / 外部记忆治理网关 / 图谱知识工作台
current_task: 最后开源优化、建立 git 仓库、保留中文现版并新增纯英文版本
license_policy: Apache-2.0
edition_policy:
  chinese: current_full_root_edition
  english: pure_english_seed
english_knowledge_structure:
  center: Language Tree Hub
  professional_placeholders:
    - Programming
    - Design
memory_policy:
  full_retention: true
  memory_evaporation: false
privacy_policy:
  private_knowledge_backup_ignored: true
  runtime_store_ignored: true
  generated_private_indexes_ignored: true
```

## 本轮落地内容

### 1. 许可证切换

项目许可证由 MIT 切换为 Apache License 2.0。

更新范围：

```text
LICENSE
package.json
workbench/package.json
runtime_server/package.json
README.md
```

发布门禁增加许可证校验：

```text
LICENSE must include Apache License / Version 2.0
package.json license must be Apache-2.0
workbench/package.json license must be Apache-2.0
runtime_server/package.json license must be Apache-2.0
```

### 2. 双版本结构

新增：

```text
versions/
versions/chinese/
versions/english/
```

中文版本定义为当前根目录完整版本：

```text
knowledge/
workbench/
runtime_server/
memory/
asset_store/
```

英文版本定义为纯英文种子版本，不混入中文知识节点。

### 3. 英文知识网种子

新增英文知识结构：

```text
versions/english/knowledge/
|-- language-tree-hub/
|   |-- README.md
|   |-- core.json
|   `-- routes.json
|-- professional-knowledge/
|   |-- README.md
|   |-- programming/
|   |   |-- README.md
|   |   `-- placeholder.json
|   `-- design/
|       |-- README.md
|       `-- placeholder.json
`-- route_index.json
```

中心仍为语言树：

```text
Language Tree Hub
-> Professional Knowledge
   -> Programming
   -> Design
```

当前只做占位，不做学科细化，方便明天逐科核对。

### 4. 机制保持不变

英文版不另起机制，继续继承系统核心：

```text
route-first reasoning
Language Tree-centered abstraction and association
FAME edge parameters
Project Memory overlay isolation
Full Memory Retention
Tool Gateway enforcement
MCP / HTTP agent access
multimodal asset DB light-index boundary
summary/ref/lazy-load context health
```

### 5. Release Check 加固

`scripts/release-check.mjs` 更新为扫描公开提交范围：

```text
.github
docs
examples
scripts
runtime_server
workbench/src
workbench/scripts
knowledge
versions
asset_store
memory
方案设计
```

继续忽略：

```text
knowledge_backup/
runtime_store/
workbench/src/generated/
workbench/public/generated/
workbench/node_modules/
workbench/dist/
```

同时修正早期文档中残留的本机绝对路径为相对路径。

## WorkEndSummary

```yaml
open_source_direction: dual_edition_repository
default_edition: chinese_current_full
english_edition_status: seed_ready_for_subject_review
license: Apache-2.0
git_baseline: pending_after_tests
next_manual_work:
  - review English Language Tree Hub taxonomy
  - expand Programming subject tree
  - expand Design subject tree
  - decide whether English edition needs a separate generator profile or UI selector
```
