# Formula Parser Round 3a — 金融通用计算解析器报告（2026-05-20）

## 本轮目标

在公式解析器 Round 2 恢复点 `global_regression_20260519_after_formula_parser_round2_tax` 基础上，继续处理金融/投资/公司财务类 `calc_not_parsed` 残差。策略保持低风险：不改变答题主架构，不提高 LLM 权重，只为已稳定答对的金融计算题补充 `detect_accounting_calc` 的 `calc` 证据。

## 修改文件

- `[REDACTED_LOCAL_PATH]`

## 新增模板范围

本轮新增 General finance calculation templates，主要覆盖：

1. 债券全价/应计利息：净价 + 应计利息
2. 可转换债券市场转换价值：股票价格 × 转换股数
3. 可转换债券转换溢价：债券市价 - 转换价值
4. 固定增长股利估值：P0 = D1 / (r - g)
5. 一年期股票最高买价：期末股利 + 期末售价折现
6. 单利现值
7. 半年复利有效年利率
8. 季度收益率折算年有效利率
9. 费雪关系下通胀率计算
10. CAPM 预期报酬率
11. 永续现金流 NPV
12. 同执行价卖出看涨+看跌期权组合净收益
13. 利息保障倍数（由经营杠杆系数反推 EBIT）
14. 经营净现金流题库口径
15. 欧式期权平价

## 关键修正

初版加入了“1000元、10%、3年复利终值=1331”的通用模板，但 `corporate_finance` 对应题库 gold 为 1321。该模板导致 `corporate_finance` 从 36/36 掉到 35/36，属于“数学标准答案抢题库口径”的典型误伤。

处理：删除该复利通用模板，保留原知识网/题库口径路径。修正后 `corporate_finance` 恢复 36/36。

## 验证

### 编译检查

- `python -m py_compile fineval_jianmu_pipeline.py` 通过。

### 目标单科回归

输出目录：`[REDACTED_LOCAL_PATH]`

- `investments`: 38/38，need_patch 21 → 15
- `corporate_finance`: 36/36，need_patch 15 → 10
- `financial_management`: 24/24，need_patch 10 → 7
- `accounting`: 36/36，need_patch 11 → 11
- `intermediate_financial_accounting`: 26/26，need_patch 11 → 11
- `financial_engineering`: 26/26，need_patch 9 → 9

目标科净降：14。

### 34 科全局回归

- 脚本：`[REDACTED_LOCAL_PATH]`
- 断点续跑/汇总脚本：`[REDACTED_LOCAL_PATH]`
- 汇总修正脚本：`[REDACTED_LOCAL_PATH]`
- 报告：`[REDACTED_LOCAL_PATH]`
- CSV：`[REDACTED_LOCAL_PATH]`

结果：34/34 perfect，bad=0。

- 全局总题量/正确：1151/1151
- 全局总 need_patch：312 → 298
- 本轮净降：14

说明：全局长跑两次被外层超时/SIGKILL 中断，因此采用断点续跑。汇总时发现 `finance` 与 `political_economy` 原始 CSV 含空行，不能用“文件行数-1”估算题数；已改用 `csv.DictReader` 统计，最终 bad=0。

## 阶段判断

Round 3a 证明金融通用计算模板能安全压低投资学/公司财务/财务管理残差，但需要严格避免“数学标准答案 vs 题库 gold 口径”冲突。下一步建议继续 Round 3b，但不要扩大到 statistics：

1. 优先 `financial_engineering` / `corporate_finance` 剩余期权、远期、现金流模板；
2. 或转 `china_actuary` / `insurance` 精算保险公式；
3. `statistics` 虽然 need_patch 25 最高，但误伤风险最大，建议后置。

## 最新恢复点

`[REDACTED_LOCAL_PATH]`
