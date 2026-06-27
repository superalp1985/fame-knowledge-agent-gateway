# Certified Management Accountant 抽象层补网报告 — 2026-05-19

## 本轮目标

在 `global_regression_20260519_after_cpa_patch` 满分恢复点基础上，检查 CMA 残差是否仍存在知识层缺口，并作为本阶段知识层收尾判断。

## 残差审计

CMA 当前 10 个 need_patch 中：

- 约 8 个为公式/预算/成本/估值/应收账款计算类：CAPM+固定增长股利估值、机会成本、相关成本、采购预算、装卸成本预算、存货采购、直接材料采购、应收账款余额等。
- 约 2 个为概念/伦理类：采购管理部门价值链目标、管理会计职业道德客观诚信。

## 落地内容

- 补丁脚本：`[REDACTED_LOCAL_PATH]`
- 备份目录：`[REDACTED_LOCAL_PATH]`
- 修改文件：
  - `rules/会计学_rules.json`
  - `route_index.json`
  - `associations/first_order_会计学.json`
- 新增规则：2 条
- 新增 route：2 条，`route_index` 2712 → 2714
- 新增一级联想：2 条，`first_order_会计学.json` 26 → 28

## 新增规则

1. 采购管理部门价值链目标
2. 管理会计职业道德客观诚信

## 单科回归

- 输出：`[REDACTED_LOCAL_PATH]`
- 结果：18/18，accuracy=1.0
- need_patch：10 → 9
- 说明：一个概念残差被消除；伦理题仍低 kappa，剩余主体为公式/预算/成本计算残差。

## 34 科全局回归

- 脚本：`[REDACTED_LOCAL_PATH]`
- 报告：`[REDACTED_LOCAL_PATH]`
- CSV：`[REDACTED_LOCAL_PATH]`
- 结果：34/34 perfect，bad=0
- 全局总题量/正确：1151/1151
- 全局总 need_patch：338

## 正向外溢

- `certified_management_accountant`：10 → 9
- 全局总 need_patch：339 → 338

## 阶段结论：知识层可收尾

截至本轮，知识层已经从最初多科 no_knowledge_hit/low_kappa 明显残差，推进到当前主要残差集中在：

1. 金额、比例、税额、折旧、现值、预算、存货、应收账款等公式/数字解析；
2. 少数低 kappa 表述匹配问题；
3. 个别旧法条口径数字题。

继续堆静态知识规则的收益很低，且容易为了个别残差引入泛化污染。因此建议知识层阶段收尾，下一环进入公式解析器。

## 最新恢复点

`[REDACTED_LOCAL_PATH]`
