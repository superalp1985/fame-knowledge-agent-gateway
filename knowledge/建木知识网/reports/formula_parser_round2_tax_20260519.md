# Formula Parser Round 2 — 税法/税额解析器报告（2026-05-19/20）

## 本轮目标

在公式解析器 Round 1 恢复点 `global_regression_20260519_after_formula_parser_round1_cma` 基础上，继续处理税法/税额类残差。策略延续低风险闭环：不改变答题架构，不提高 LLM 权重，只把已经由确定性规则稳定答对、但 `calc` 字段为空的税法/CPA 题补成可解释的 `detect_accounting_calc` 计算证据。

## 修改文件

- `[REDACTED_LOCAL_PATH]`

## 新增模板范围

本轮新增 Tax / levy calculation templates，覆盖：

1. 关税滞纳金
2. 城市维护建设税
3. 股权转让个人所得税
4. 竞拍所得计税基础
5. 证券交易印花税收入归属
6. 增值税 13% 税率范围
7. 小型微利企业所得税及资产总额口径
8. 税款追征期
9. 契税差额计税
10. 非居民企业核定所得税
11. 境外所得抵免企业所得税
12. 车辆购置税、车辆购置税退税
13. 个人出租住房房产税
14. 房产税从价/从租及地下建筑物房产税
15. 容积率低于 0.5 时地价并入房产原值
16. 消费税征税范围
17. 税务行政处罚听证与税务规章罚款上限

## 验证

### 编译检查

- `python -m py_compile fineval_jianmu_pipeline.py` 通过。

### 单科回归

- `tax_law`
  - 输出：`[REDACTED_LOCAL_PATH]`
  - 结果：45/45，accuracy=1.0
  - need_patch：20 → 9

- `certified_practising_accountant`
  - 输出：`[REDACTED_LOCAL_PATH]`
  - 结果：34/34，accuracy=1.0
  - need_patch：7 → 2

### 34 科全局回归

- 脚本：`[REDACTED_LOCAL_PATH]`
- 报告：`[REDACTED_LOCAL_PATH]`
- CSV：`[REDACTED_LOCAL_PATH]`
- 结果：34/34 perfect，bad=0
- 全局总题量/正确：1151/1151
- 全局总 need_patch：334 → 312

## 额外收益

除 `tax_law` 和 CPA 主目标外，`accounting` 也从 12 → 11，说明税额/车辆/房产税模板对会计科目中的涉税计算题产生了正外溢，且无误伤。

## 阶段判断

Round 2 是公式解析器阶段目前收益最大的一轮：单轮全局 need_patch 下降 22，且全局准确率仍为 100%。后续优先方向建议：

1. 债券/现值/收益率解析器：`investments`、`financial_management`、`accounting` 中 residual 密度高。
2. 统计/概率/回归解析器：`statistics` 当前 need_patch 25，是最高残差科之一，但需要更谨慎防误伤。
3. 精算/保险公式解析器：`china_actuary` 23、`insurance` 7，可后续单独处理。

## 最新恢复点

`[REDACTED_LOCAL_PATH]`
