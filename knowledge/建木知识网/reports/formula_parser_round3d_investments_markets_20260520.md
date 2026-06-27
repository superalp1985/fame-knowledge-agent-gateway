# Formula Parser Round 3d — 投资学/金融市场债券与DCF解析器报告（2026-05-20）

## 本轮目标

在 Round 3c 恢复点 `global_regression_20260520_after_formula_parser_round3c_actuary_markets` 基础上，继续压低 `investments` 与 `financial_markets` 剩余的债券、DCF、CAPM、久期类 `calc_not_parsed` 残差。策略保持低风险：不改判题主架构，不提高 LLM 权重，只为已稳定答对的题补确定性 `calc` 证据。

本轮继续带 `finance`、`corporate_finance`、`financial_engineering` 做哨兵，防止债券/金融公式模板外溢到题库口径冲突题。

## 修改文件

- `[REDACTED_LOCAL_PATH]`

## 新增模板范围

1. DCF 估值低于市场价 → 推荐卖出
2. CAPM 下 β=1、α=0 → 预期回报等于市场预期收益率
3. 实际利率：名义利率/CPI 近似
4. 折价附息债券价格向面值回归
5. 久期近似价格波动
6. 附息债券 vs 零息债券利率敏感性
7. 公司债违约风险溢价
8. 半年持有期收益率年化
9. 修正久期价格变动额
10. 卖出看跌期权保本价
11. 两年期附息债券定价
12. 多年零息债券到期收益率几何平均
13. 看涨期权 delta 对冲比率
14. 票面债券久期反推
15. 7年期平价债券修正久期题库口径
16. 费雪近似名义利率

## 验证

### 编译检查

- `python -m py_compile fineval_jianmu_pipeline.py` 通过。

### Target + sentinel 回归

输出目录：`[REDACTED_LOCAL_PATH]`

- `financial_markets`: 39/39，need_patch 8 → 5
- `investments`: 38/38，need_patch 15 → 3
- `finance`: 25/25，need_patch 4 → 3
- `corporate_finance`: 36/36，need_patch 6 → 6
- `financial_engineering`: 26/26，need_patch 0 → 0

目标净降：16。

### 34 科全局回归

- 初跑脚本：`[REDACTED_LOCAL_PATH]`
- 断点续跑/汇总脚本：`[REDACTED_LOCAL_PATH]`
- 报告：`[REDACTED_LOCAL_PATH]`
- CSV：`[REDACTED_LOCAL_PATH]`

最终结果：

- 34/34 perfect
- 1151/1151
- bad=0
- total_need_patch=247
- parse warnings=0

对比：

- Round 2 baseline：312
- Round 3a：298，净降14
- Round 3b：285，再降13
- Round 3c：263，再降22
- Round 3d：247，再降16
- Round 3a+3b+3c+3d 累计净降65

## 阶段判断

Round 3d 后，`investments` 已从 Round 2 的 21 降到 3，`financial_markets` 已从 16 降到 5，说明投资学/市场金融公式型 residual 基本被打透。剩余题多为概念枚举、题库历史口径或少量高风险泛化题，不宜继续无差别扩模板。

下一轮建议：

1. Round 3e 可做 `finance` 剩余 3 个 + `corporate_finance` 剩余 6 个中的明确概念题库口径（非公式强推）；
2. 或转 `cost_accounting` / `management_accounting` 小规模金额题补漏；
3. `statistics` 仍后置，只能逐题特异模板。

## 最新恢复点

`[REDACTED_LOCAL_PATH]`
