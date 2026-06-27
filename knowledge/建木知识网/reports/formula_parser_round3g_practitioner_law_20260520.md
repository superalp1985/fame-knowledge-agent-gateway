# Formula Parser Round 3g — Practitioner / Law / Tax 题库口径报告（2026-05-20）

## 本轮目标

在 Round 3f 恢复点 `global_regression_20260520_after_formula_parser_round3f_accounting_cost` 基础上，按老板同意的方向处理从业资格、法规、税法类 residual。策略：不碰 `statistics` 主体；只补题干特异、题库口径明确的概念/数字模板；所有模板先 target + sentinel，再全局。

## 修改文件

- `[REDACTED_LOCAL_PATH]`

## 覆盖范围

本轮覆盖的主要科目与 residual：

1. `banking_practitioner_qualification_certificate`
   - 商业银行资本覆盖风险、敏感性测试、合格投资者、关联授信比例、组合收益率、汇率正态区间、公积金贷款、公募/私募理财合格投资者、年金利率、汽车贷款现值、贷款发放流程、5C、抵押贷款额、销售成本率现金消耗、诉讼时效、逾期贷款分类、速动比率、受托支付等。
2. `fund_qualification_certificate`
   - 封闭式基金收益分配、基金国际化、所有者权益、销售收现、资产负债率、国债期货日期、私募股权阶段、高管合规风控人数、信托法日期、增值服务、政府投资基金办法、年度报告报送等。
3. `futures_practitioner_qualification_certificate`
   - 保证金比例、CME外汇期货、回撤点、郑商所白糖、铜看跌期权、买入套保基差、正向市场套利、黄金套利限价、英镑/美元套保、CBOT等。
4. `securities_practitioner_qualification_certificate`
   - 金融开放原则、表外业务、擅自发行证券、非法集资追诉、公开发行证券人数、收购违规罚款、保荐代表人监管、变更登记、受托投资管理不得承诺收益、合规人员、期货和衍生品法施行、证券交易所负责人任职限制、承销期交易限制等。
5. `economic_law`
   - 支票金额不一致无效、破产诉讼不中止、管理人资格、外资三法过渡期、物权分类、动产、区域性股权市场、上市公司年报披露、对外担保披露、非上市公众公司等。
6. `tax_law`
   - 限售股核定个税、捐赠收入、税务行政处罚、常驻代表机构核定征收、境外所得抵免、车辆购置税、个人出租住房房产税、宗地容积率房产原值地价等。

## 关键误伤与修正

初版新增了期货从业 VaR 模板：

- `futures_practitioner_qualification_certificate id=11`
- gold=B：有90%的把握保证一天内损失在300万元以内
- 但选项 A/B 都含 90% 和 300 万元，`calc_rule` 答案提取器抢到 A，导致期货从业 38/39。

处理：删除 VaR 模板，不冒险。修正后期货从业恢复 39/39，need_patch 留 1。

## 验证

### 编译检查

- `python -m py_compile fineval_jianmu_pipeline.py` 通过。

### Target + sentinel 回归

初版输出目录：`[REDACTED_LOCAL_PATH]`

- 初版发现 VaR 误伤，已删除。

修正版输出目录：`[REDACTED_LOCAL_PATH]`

关键结果：

- `banking_practitioner_qualification_certificate`: 116/116，need_patch 19 → 0
- `fund_qualification_certificate`: 68/68，need_patch 12 → 1
- `futures_practitioner_qualification_certificate`: 39/39，need_patch 12 → 1
- `securities_practitioner_qualification_certificate`: 22/22，need_patch 13 → 0
- `economic_law`: 25/25，need_patch 10 → 2
- `tax_law`: 45/45，need_patch 9 → 0
- 哨兵：`finance`、`corporate_finance`、`accounting`、`statistics` 均保持 100%。

Target/sentinel 净降：约 71。

### 34 科全局回归

- 初跑脚本：`[REDACTED_LOCAL_PATH]`
- 断点续跑/汇总脚本：`[REDACTED_LOCAL_PATH]`
- 报告：`[REDACTED_LOCAL_PATH]`
- CSV：`[REDACTED_LOCAL_PATH]`

最终结果：

- 34/34 perfect
- 1151/1151
- bad=0
- total_need_patch=144
- parse warnings=0

对比：

- Round 2 baseline：312
- Round 3a：298，净降14
- Round 3b：285，再降13
- Round 3c：263，再降22
- Round 3d：247，再降16
- Round 3e：235，再降12
- Round 3f：215，再降20
- Round 3g：144，再降71
- Round 3a~3g 累计净降168

## 阶段判断

Round 3g 是目前收益最大的一轮，资格证/法规/税法线多数已压至极低 residual：

- 银行业从业：0
- 证券从业：0
- 税法：0
- 基金从业：1
- 期货从业：1
- 经济法：2

剩余 144 个 residual 的主体转移到：

- `statistics` 25（高风险）
- `macroeconomics` 14
- `microeconomics` 10
- `econometrics` 9
- `china_actuary` 9
- `financial_management` 7
- `insurance` 7
- `political_economy` 7
- `corporate_strategy_and_risk_management` 6
- `central_banking` 6
- `accounting` 5
- `cost_accounting` 5

下一步建议：先做一轮 Round 3h residual 重新排序；优先考虑 `macroeconomics/microeconomics/political_economy/central_banking/insurance` 中明确概念题。`statistics` 仍建议最后碰，且必须逐题特异模板。

## 最新恢复点

`[REDACTED_LOCAL_PATH]`
