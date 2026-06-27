# Advanced Financial Accounting 抽象层补网报告 — 2026-05-19

## 本轮目标

在 `global_regression_20260519_after_intermediate_financial_accounting_patch` 满分恢复点基础上，处理 `advanced_financial_accounting` 的少量知识空洞，重点补高级财务会计中的记账本位币、境外经营、通货膨胀会计、递延所得税负债。

## 落地内容

- 补丁脚本：`[REDACTED_LOCAL_PATH]`
- 备份目录：`[REDACTED_LOCAL_PATH]`
- 修改文件：
  - `rules/会计学_rules.json`
  - `route_index.json`
  - `associations/first_order_会计学.json`
- 新增规则：4 条
- 新增 route：4 条，`route_index` 2704 → 2708
- 新增一级联想：3 条，`first_order_会计学.json` 19 → 22

## 新增规则

1. 记账本位币作为统一计量尺度
2. 境外经营含义
3. 通货膨胀会计模式选择原则
4. 税法折旧大于会计折旧递延所得税负债

## 单科回归

- 输出：`[REDACTED_LOCAL_PATH]`
- 结果：21/21，accuracy=1.0
- need_patch：4 → 2
- 说明：两个 no_knowledge_hit / low_kappa 被消除；剩余 2 个主要为递延所得税数字计算和境外经营表述低 kappa。

## 34 科全局回归

- 脚本：`[REDACTED_LOCAL_PATH]`
- 报告：`[REDACTED_LOCAL_PATH]`
- CSV：`[REDACTED_LOCAL_PATH]`
- 结果：34/34 perfect，bad=0
- 全局总题量/正确：1151/1151
- 全局总 need_patch：340

## 正向外溢

- `advanced_financial_accounting`：4 → 2
- `management_accounting`：4 → 3
- 全局总 need_patch：343 → 340

## 结论

高财知识空洞已基本封口，且无跨科污染。本轮证明知识层仍有少量收益，但收益开始集中于少数 no_knowledge_hit；大部分剩余残差已经转入公式/数字解析器阶段。

## 下一步建议

继续知识层收尾：

1. `certified_practising_accountant`：need_patch=7，综合会计题可能还能补少量。
2. `management_accounting`：need_patch=3，已被高财外溢降 1，可快速尝试封口。
3. `certified_management_accountant`：need_patch=10，若仍主要为管理会计概念，补；若为计算，转公式解析器。

完成后切公式解析器。
