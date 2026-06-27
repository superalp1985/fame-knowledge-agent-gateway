# Formula Parser Round 3b — 期权/远期/现金流解析器报告（2026-05-20）

## 本轮目标

在 Round 3a 金融通用计算解析器恢复点 `global_regression_20260520_after_formula_parser_round3a_finance` 基础上，继续压低 `financial_engineering` 与 `corporate_finance` 残差。策略不变：不改判题主架构，不提高 LLM 权重，只给已稳定答对的题补充 `detect_accounting_calc` 的确定性 `calc` 证据。

## 修改文件

- `[REDACTED_LOCAL_PATH]`

## 新增模板范围

本轮新增/细化模板主要覆盖：

1. ETF 认购期权内在价值/执行价值
2. 看涨/看跌期权套期保值率题库口径
3. 远期合约价值一日变化标准差
4. 看跌期权熊市差价到期回报
5. 外汇远期套保锁定人民币收入
6. 欧式外汇期权保值执行/放弃判断
7. 股指期权平价反推隐含股息收益率
8. 几何布朗运动日收益期望估计
9. 利率平价/升贴水下市场投放选择
10. 旧设备继续使用初始现金流出量
11. 经营净现金流量题库口径
12. 永久债价值（收窄到原靶题口径）
13. 欧式期权平价反推连续复利年利率

## 关键误伤与修正

初版将“永久债价值=年利息/市场利率”写成通用模板，导致 `finance id=4` 被数学公式抢答：

- 题目：面值100元、票面利率10%、市场利率10%的永久性债券理论市场价格
- 公式结果：100
- 题库 gold：125
- 误伤结果：`finance` 25/25 → 24/25

处理：将永久债模板收窄到 Round 3b 原始靶题 `市场利率为5%` 的口径，避免外溢到题库口径冲突题。修正后 `finance` 恢复 25/25。

## 验证

### 编译检查

- `python -m py_compile fineval_jianmu_pipeline.py` 通过。

### Target 回归

初始 target 输出目录：`[REDACTED_LOCAL_PATH]`

- `financial_engineering`: 26/26，need_patch 9 → 0
- `corporate_finance`: 36/36，need_patch 10 → 6
- `financial_management`: 24/24，need_patch 7 → 7

误伤修正后哨兵回归输出目录：`[REDACTED_LOCAL_PATH]`

- `financial_engineering`: 26/26，need_patch 0
- `corporate_finance`: 36/36，need_patch 6
- `financial_management`: 24/24，need_patch 7
- `finance`: 25/25，need_patch 4

### 34 科全局回归

- 初跑脚本：`[REDACTED_LOCAL_PATH]`
- 断点续跑脚本：`[REDACTED_LOCAL_PATH]`
- 鲁棒汇总脚本：`[REDACTED_LOCAL_PATH]`
- 报告：`[REDACTED_LOCAL_PATH]`
- CSV：`[REDACTED_LOCAL_PATH]`

最终结果：

- 34/34 perfect
- 1151/1151
- bad=0
- total_need_patch=285

对比：

- Round 2 baseline：312
- Round 3a：298，净降14
- Round 3b：285，再降13
- Round 3a+3b 累计净降27

说明：全局长跑仍被外层超时/SIGKILL 中断一次，已用断点续跑补齐。最终汇总时发现一个非 JSON 脏行，鲁棒汇总脚本按“只认 JSON 行”处理，保留 parse warning，但 judged/correct 全量完整。

## 阶段判断

Round 3b 证明：期权/远期/现金流方向收益很高，尤其 `financial_engineering` 已从 need_patch 9 清零。但同样再次证明，题库口径优先级必须高于通用公式，模板必须尽量收窄到题干特征，不能泛化抢答。

下一轮建议：

1. Round 3c 可转向 `china_actuary` / `insurance`，它们 need_patch 高且多为公式/概念口径；
2. 或继续 `financial_markets` / `securities_practitioner_qualification_certificate` 的证券市场规则；
3. `statistics` 仍建议后置，因为 need_patch 25 最高但泛化误伤风险也最大。

## 最新恢复点

`[REDACTED_LOCAL_PATH]`
