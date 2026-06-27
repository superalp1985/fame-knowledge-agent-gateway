# 建木知识网 C-Eval 52科战略切换设计 v0.1（2026-05-20）

## 背景

老板确认：C-Eval 榜单已经取消，现在可以本地自测、自跑、自出分。因此 C-Eval 不再是外部打榜任务，而是建木知识网的本地标准化回归集。

这解决了 FinEval 后期的核心伦理顾虑：不再围绕隐藏榜/潜规则做题库适配，而是以公开/本地评测驱动知识网泛化。

## 新目标

从 FinEval 财经垂直选择题，升级到：

```text
C-Eval 52科选择题通用知识脑
```

目标不是“刷榜”，而是验证建木的：

```text
语言树 → 学科层级 → 抽象层 → 规律层 → 一级联想 → route → exception guard → 选择题判别
```

能否迁移到多学科。

## 原则

1. C-Eval 作为本地回归集：自己跑、自己出分、自己迭代。
2. 可大面积补知识，但必须记录 source/source_tier/confidence。
3. 权威来源优先级：
   - official_exam_outline
   - official_textbook
   - ministry_standard
   - university_textbook
   - authoritative_reference
   - web_verified
4. 官方解释和权威教材可直接入库；普通网页只作为线索。
5. 继续保持旁路优先，不直接污染主判题流程。
6. 选择题守卫必须保留：否定题、多数字锚点、题库口径、标准公式冲突。

## 阶段路线

### Phase C0 — 工程骨架

- 建 C-Eval 工作目录；
- 建 52 科学科树 schema；
- 建 source tier schema；
- 建 coverage diff 输出格式；
- 建本地评测报告模板。

### Phase C1 — 52 科目映射

- 整理 C-Eval 52 科科目；
- 映射到建木 discipline/module；
- 标记已有覆盖/部分覆盖/缺失。

### Phase C2 — 外部 coverage diff

- 官方/教材目录 vs H6 sidecar 节点；
- 输出 missing_module / missing_upper_concept / missing_sub_concept / missing_regularities。

### Phase C3 — 大面积权威补点

- 找不到的就上网搜；
- 官方解释和权威教材直接上；
- 每条新增 route 带 source_tier 和 evidence。

### Phase C4 — 本地 C-Eval 回归

- 跑 52 科选择题；
- 记录 accuracy / per-subject score / error taxonomy；
- 迭代知识树、语言树、一级联想、exception guard。

## 当前继承资产

- H6 final sidecar：`[REDACTED_LOCAL_PATH]`
- H6 final nodes：`[REDACTED_LOCAL_PATH]`
- H6 retrieval spec：`[REDACTED_LOCAL_PATH]`

## 判断

FinEval 已证明建木在财经垂直选择题上有效；C-Eval 将验证建木是否能成为通用考试型知识脑。榜单取消后，C-Eval 更适合作为长期本地回归标准，而不是短期打榜目标。
