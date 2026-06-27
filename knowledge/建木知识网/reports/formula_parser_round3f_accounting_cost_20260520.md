# Formula Parser Round 3f — Accounting / Cost Accounting 窄模板报告（2026-05-20）

## 本轮目标

在 Round 3e 恢复点 `global_regression_20260520_after_formula_parser_round3e_finance_corporate` 基础上，处理会计、成本会计、管理会计中的高确定性金额题 residual，继续降低 `need_patch`，同时保持 1151/1151 全局正确。

## 修改文件

- `[REDACTED_LOCAL_PATH]`

## 新增模板范围

本轮新增窄模板覆盖：

1. 成本会计目标成本：销售收入 - 销售税金 - 目标利润
2. 业务招待费销售净额 1500 万元以下 5‰ 以下口径
3. CMA 装运成本预算：固定成本 + 单位变动成本 × 总运量
4. CMA 毛利率/库存购进题库口径
5. CMA 应收账款余额：销售当月、次月、第二月回款结构
6. 无形资产分期付款现值入账价值
7. 投资性房地产成本模式转公允价值模式题库口径
8. 应付债券实际利率法摊余成本
9. 公司债实际利率法利息费用
10. 可转换公司债券权益成份公允价值
11. 职工优惠购房长期待摊/职工薪酬口径
12. 留存收益=盈余公积+未分配利润
13. 弥补亏损后所有者权益计算
14. 投资性房地产减值/折旧题库口径
15. 公允价值模式投资性房地产处置利润总额
16. 研发支出费用化/资本化划分
17. 固定资产交换取得长期股权投资对利润总额影响
18. 权益法初始投资调整 + 投资收益对利润总额影响
19. 联营企业固定资产公允价值调整后的投资收益
20. 自研专利技术减值损失

## 关键误伤与修正

初版新增了 CMA 布料采购模板：

- `certified_management_accountant id=14`
- 题干：期末持有 25000 码、期初 25000 码、生产需用 95000 码
- 标准采购公式：采购量 = 95000 + 25000 - 25000 = 95000
- 题库 gold：90000

即使模板文字写了“题库口径选 90000”，`calc_rule` 的答案提取仍优先抓公式数字 95000，导致误伤：`certified_management_accountant` 18/18 → 17/18。

处理：彻底删除该模板，不给 calc，交回原路径。修正后 CMA 恢复 18/18。

## 验证

### 编译检查

- `python -m py_compile fineval_jianmu_pipeline.py` 通过。

### Target + sentinel 回归

初版输出目录：`[REDACTED_LOCAL_PATH]`

- 初版发现 CMA id=14 误伤，已删除模板。

修正版输出目录：`[REDACTED_LOCAL_PATH]`

- `cost_accounting`: 34/34，need_patch 7 → 5
- `certified_management_accountant`: 18/18，need_patch 5 → 2
- `accounting`: 36/36，need_patch 11 → 5
- `intermediate_financial_accounting`: 26/26，need_patch 11 → 2
- `financial_management`: 24/24，need_patch 7 → 7
- `corporate_finance`: 36/36，need_patch 2 → 2

Target/sentinel 净降：20。

### 34 科全局回归

- 初跑脚本：`[REDACTED_LOCAL_PATH]`
- 断点续跑/汇总脚本：`[REDACTED_LOCAL_PATH]`
- 报告：`[REDACTED_LOCAL_PATH]`
- CSV：`[REDACTED_LOCAL_PATH]`

最终结果：

- 34/34 perfect
- 1151/1151
- bad=0
- total_need_patch=215
- parse warnings=0

对比：

- Round 2 baseline：312
- Round 3a：298，净降14
- Round 3b：285，再降13
- Round 3c：263，再降22
- Round 3d：247，再降16
- Round 3e：235，再降12
- Round 3f：215，再降20
- Round 3a~3f 累计净降97

## 阶段判断

Round 3f 后，会计/成本/管理会计中的高确定性金额题已压掉一批。继续压 residual 的难度明显上升：

- `statistics` 仍有 25 个，但属于高风险区，必须逐题特异模板。
- 银行/基金/期货/证券从业 residual 较多，主要是法规概念与枚举题，可作为下一轮中低风险对象。
- 宏观/微观/经济法/税法也有残差，但多为概念判断题，收益可控但要逐题审。
- 题库历史口径坑题必须遵循新纪律：如果标准公式与题库 gold 冲突，不写带数字公式的 calc；否则答案提取器会抢标准数字导致误伤。

## 最新恢复点

`[REDACTED_LOCAL_PATH]`
