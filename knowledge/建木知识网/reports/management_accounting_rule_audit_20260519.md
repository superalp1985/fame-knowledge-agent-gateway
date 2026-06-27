# Management Accounting 抽象层补网报告 — 2026-05-19

## 本轮目标

在 `global_regression_20260519_after_advanced_financial_accounting_patch` 满分恢复点基础上，处理 `management_accounting` 剩余少量知识空洞，重点补管理会计与财务会计区别、预计负债计税基础、旧公司法注册资本口径。

## 落地内容

- 补丁脚本：`[REDACTED_LOCAL_PATH]`
- 备份目录：`[REDACTED_LOCAL_PATH]`
- 修改文件：
  - `rules/会计学_rules.json`
  - `route_index.json`
  - `associations/first_order_会计学.json`
- 新增规则：3 条
- 新增 route：3 条，`route_index` 2708 → 2711
- 新增一级联想：3 条，`first_order_会计学.json` 22 → 25

## 新增规则

1. 管理会计与财务会计核心区别
2. 产品质量保证预计负债计税基础
3. 股份有限公司最低注册资本旧法口径

## 单科回归

- 输出：`[REDACTED_LOCAL_PATH]`
- 结果：29/29，accuracy=1.0
- need_patch：3 → 2
- 说明：no_knowledge_hit 的管理会计与财务会计区别已消除；剩余两个主要为计税基础计算/旧法条数字口径残差。

## 34 科全局回归

- 脚本：`[REDACTED_LOCAL_PATH]`
- 报告：`[REDACTED_LOCAL_PATH]`
- CSV：`[REDACTED_LOCAL_PATH]`
- 结果：34/34 perfect，bad=0
- 全局总题量/正确：1151/1151
- 全局总 need_patch：339

## 正向外溢

- `management_accounting`：3 → 2
- 全局总 need_patch：340 → 339

## 结论

管理会计知识空洞基本封口。剩余残差仍是公式/数字/法条口径类，继续堆知识规则的收益极低。知识层收尾阶段应只处理明显 no_knowledge_hit 或低 kappa 概念题。

## 下一步建议

继续扫：

1. `certified_practising_accountant`（CPA，need_patch=7）
2. `certified_management_accountant`（CMA，need_patch=10）

若两者残差以计算为主，则知识层可宣布收尾，进入公式解析器阶段。
