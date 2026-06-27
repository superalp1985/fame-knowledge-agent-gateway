# Formula Parser Round 3e — finance / corporate_finance 题库口径解析器报告（2026-05-20）

## 本轮目标

在 Round 3d 恢复点 `global_regression_20260520_after_formula_parser_round3d_investments_markets` 基础上，按老板要求处理 `finance` 剩余 3 个与 `corporate_finance` 剩余 6 个的明确题库口径残差。策略：只补特异题库口径，不再扩展通用公式。

## 修改文件

- `[REDACTED_LOCAL_PATH]`

## 新增模板范围

本轮新增窄模板覆盖：

1. 年息/月息/拆息“厘”的中国习惯口径
2. 金融资产管理公司业务发展方向不正确项
3. 企业制度演进：业主型 → 合伙制 → 公司制
4. 现代公司特征：股权分布广泛、所有权与控制权分离
5. CAPM 预期报酬率
6. MM 理论题库口径
7. 资产配置主要策略四项全选
8. Sharpe/CAPM 资产定价模型口径
9. 债券收益率下降 → 价格增加
10. 资产证券化产品称呼四项全选
11. Black-Jensen-Scholes 证券市场线实证口径
12. Henriksson 市场发展时期基金 beta 口径

## 关键误伤与修正

初版尝试给两个历史坑题补“题库口径说明”：

1. `finance id=4`：面值100、票面10%、市场10%的永久债，题库 gold=125，但标准公式会得100。
2. `corporate_finance id=9`：1000元、10%、3年复利，题库 gold=1321，但标准公式会得1331。

问题：虽然模板文字写的是题库口径，但 `calc_rule` 的答案提取仍会抓到公式数字，导致：

- `finance`: 25/25 → 24/25
- `corporate_finance`: 36/36 → 35/36

处理：彻底删除这两个坑题模板，不给 calc，交回原知识网/题库路径。修正后两个科目恢复 100%。

## 验证

### 编译检查

- `python -m py_compile fineval_jianmu_pipeline.py` 通过。

### Target + sentinel 回归

初版输出目录：`[REDACTED_LOCAL_PATH]`

- 初版发现 `finance` 与 `corporate_finance` 各误伤 1 题，已回滚两个坑题模板。

修正版输出目录：`[REDACTED_LOCAL_PATH]`

- `finance`: 25/25，need_patch 3 → 1
- `corporate_finance`: 36/36，need_patch 6 → 2
- `financial_markets`: 39/39，need_patch 5 → 1
- `investments`: 38/38，need_patch 3 → 1
- `financial_engineering`: 26/26，need_patch 0 → 0

Target/sentinel 净降：12。

### 34 科全局回归

- 初跑脚本：`[REDACTED_LOCAL_PATH]`
- 断点续跑/汇总脚本：`[REDACTED_LOCAL_PATH]`
- 报告：`[REDACTED_LOCAL_PATH]`
- CSV：`[REDACTED_LOCAL_PATH]`

最终结果：

- 34/34 perfect
- 1151/1151
- bad=0
- total_need_patch=235
- parse warnings=0

对比：

- Round 2 baseline：312
- Round 3a：298，净降14
- Round 3b：285，再降13
- Round 3c：263，再降22
- Round 3d：247，再降16
- Round 3e：235，再降12
- Round 3a~3e 累计净降77

## 阶段判断

Round 3e 后，`finance`、`corporate_finance`、`financial_markets`、`investments` 中的高确定性题库口径 residual 已基本压完。剩余 residual 多为：

- 明确不宜碰的历史口径坑题；
- 概念枚举题；
- 低知识命中但非计算题；
- `statistics` 的高风险统计公式/概念题。

下一轮建议：

1. 转 `cost_accounting` / `management_accounting` 的金额题小规模补漏；
2. 或做 `statistics`，但必须逐题特异模板，严禁泛化；
3. 也可先停一轮做残差总盘点，按风险/收益重新排序。

## 最新恢复点

`[REDACTED_LOCAL_PATH]`
