# 中文开源知识网

本目录保存中文开源版的知识网骨架。公开范围只正式展开编程与工具调用相关内容；语言树中枢就是语义树挂点，负责术语归一和抽象路由。其他学科只保留支撑骨架，不做首发扩展重点。

## 文件结构

```text
graph.schema.json          # 图谱节点、边、FAME 参数 schema
graph.seed.json            # 第一版轻量图谱
route_index.json           # Agent 可直接读取的路由索引
source_registry.json       # 权威来源和许可状态登记
language-tree-hub/         # 语言树中枢（语义树挂点）、思考模式、横向联想、抽象迁移
logic/                     # 方法支撑骨架
mathematics/               # 方法支撑骨架
computer-science/          # 编程、工程、测试、索引
agent-tooling/             # Agent 工具调取、反思迭代、易用性评测
powershell-safety/         # PowerShell 安全语法
database/                  # 详细内容单元
rules/                     # 工具、语法、验证规则
indexes/                   # 搜索、语义、别名和作用域索引
```

## 读取顺序

Agent 开始任务时建议按需读取：

1. `route_index.json`
2. `language-tree-hub/core.json`
3. `language-tree-hub/lexicon_seed.json`
4. `language-tree-hub/thought_modes.json`
5. `indexes/scoping_index.json`
6. 当前 subject 的 `taxonomy.json`
7. 相关 `rules/*.json`
8. `database/content_index.json`
9. 必要的 `database/content_units.jsonl` 摘要引用

不要把整个 `knowledge/` 一次性塞进上下文。

## Agent 必读机制

- 核心错误域：先读取 `agent-tooling/critical_error_domains.json`。
- 语义树挂点：读取 `language-tree-hub/lexicon_seed.json`，先把术语归一到 canonical term，再做 subject 和 route 选择。
- 思考层级：读取 `language-tree-hub/thought_modes.json`，把任务映射到 L0-L6 层级后再决定工具粒度、验证方式和停止条件。
- 开放问题：读取 `language-tree-hub/association_playbooks.json`，生成多路径候选，再用验证钩子收敛。
- 抽象和创造：读取 `language-tree-hub/abstraction_playbooks.json`，先上提到方法层，再落回最小可执行动作。
- 工具失败：读取 `agent-tooling/reflection_patterns.json`。
- 质量评测：读取 `agent-tooling/evaluation_metrics.json`。

## 数据库内容

`database/content_units.jsonl` 保存摘要级知识单元，`database/content_index.json` 保存轻量目录，`database/data_sources.json` 保存成熟数据源导入策略。先查目录，再按 `subject`、`route_ref`、`source_ref` 或关键词按需读取少量内容单元。
