# 语言树中枢

语言树中枢是中文开源版的入口层，也是语义树挂点。它不是单纯词表，也不是检索库，而是把语言、意图、抽象、联想和验证串成一条可控的路由链。

## 中枢层级

```text
意图层 -> 词汇层 -> 语法层 -> 语义抽象层 -> 联想迁移层 -> 表达层 -> 验证层
```

## 入口文件

- `core.json`：中枢结构和默认路由政策
- `thought_modes.json`：L0-L6 思考层级与工具策略
- `intent_patterns.json`：意图识别和作用域裁剪
- `association_rules.json`：横向联想的约束
- `association_playbooks.json`：多路径搜索玩法
- `abstraction_playbooks.json`：抽象迁移玩法
- `lexicon_seed.json`：词汇和术语种子

## 原则

- 所有学科分支都从语言树进入。
- 联想只迁移结构和方法，不迁移未经验证的事实。
- 任务要先映射到思考层级，再决定工具粒度和验证方式。
- 术语先归一到 canonical term，再进入路由和联想。
- 失败、负值 FAME 和反例都要保留。

## 相关文件

- `../indexes/subject_index.json`
- `../indexes/scoping_index.json`
- `../agent-tooling/critical_error_domains.json`
