# Certified Practising Accountant 抽象层补网报告 — 2026-05-19

## 本轮目标

在 `global_regression_20260519_after_management_accounting_patch` 满分恢复点基础上，检查 CPA 残差是否仍存在明显知识空洞。

## 残差审计

CPA 当前 7 个 need_patch 中：

- 6 个为税法数字/比例/税额计算类：证券交易印花税归属、增值税 13% 税率、小型微利企业所得税、追征期、契税差额计税等。
- 1 个为低 kappa / no_knowledge_hit：车船税法定免税项目。

## 落地内容

- 补丁脚本：`[REDACTED_LOCAL_PATH]`
- 备份目录：`[REDACTED_LOCAL_PATH]`
- 修改文件：
  - `rules/会计学_rules.json`
  - `route_index.json`
  - `associations/first_order_会计学.json`
- 新增规则：1 条
- 新增 route：1 条，`route_index` 2711 → 2712
- 新增一级联想：1 条，`first_order_会计学.json` 25 → 26

## 新增规则

1. 车船税法定免税项目

## 单科回归

- 输出：`[REDACTED_LOCAL_PATH]`
- 结果：34/34，accuracy=1.0
- need_patch：7 → 7
- 说明：新增规则未降低 need_patch，说明该残差仍被低 kappa/关键词匹配策略卡住；不继续硬拧，避免为 1 个残差引入泛化污染。

## 34 科全局回归

- 脚本：`[REDACTED_LOCAL_PATH]`
- 报告：`[REDACTED_LOCAL_PATH]`
- CSV：`[REDACTED_LOCAL_PATH]`
- 结果：34/34 perfect，bad=0
- 全局总题量/正确：1151/1151
- 全局总 need_patch：339

## 结论

CPA 知识层已到边界。剩余残差主要应进入公式/税额解析器阶段，而不是继续堆静态税法规则。

## 下一步建议

继续扫 `certified_management_accountant`，若仍以计算为主，则知识层收尾，转公式解析器。
