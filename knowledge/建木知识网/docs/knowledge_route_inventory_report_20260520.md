# 建木知识网现有 route 知识分布盘点 v0.1（2026-05-20）

## 产物

- 明细清单：`[REDACTED_LOCAL_PATH]`
- subject/domain 分布：`[REDACTED_LOCAL_PATH]`
- 初版层级映射草案：`[REDACTED_LOCAL_PATH]`

## Route Index 概况

- routes: 2714
- types: {'manual_abstract_route': 429, 'manual_concept': 11, 'neuron': 2155, 'rule': 119}

## 原始 subject 计数 Top

- FinEval: 1321
- FinEval_Accounting: 355
- 经济学: 298
- 会计学: 242
- 数学: 94
- 物理: 70
- 化学: 50
- 生物: 40
- 地理: 35
- 历史: 34
- 信息技术: 28
- 法学: 25
- 统计学: 25
- 语文: 24
- 英语: 23
- 思想政治: 22
- 管理学: 12
- 会计语言抽象: 10
- 保险精算: 6

## subject/domain 计数 Top 40

- FinEval / banking_practitioner_qualification_certificate: 121
- FinEval / fund_qualification_certificate: 73
- FinEval_Accounting / tax_law: 50
- FinEval / tax_law: 50
- FinEval / monetary_finance: 48
- FinEval / microeconomics: 45
- FinEval / public_finance: 45
- FinEval / financial_markets: 44
- FinEval / futures_practitioner_qualification_certificate: 44
- FinEval / investments: 43
- FinEval / china_actuary: 42
- FinEval_Accounting / accounting: 41
- FinEval / accounting: 41
- FinEval / corporate_finance: 41
- FinEval / statistics: 40
- FinEval_Accounting / cost_accounting: 39
- FinEval / certified_practising_accountant: 39
- FinEval / cost_accounting: 39
- FinEval_Accounting / corporate_strategy_and_risk_management: 38
- FinEval / corporate_strategy_and_risk_management: 38
- FinEval / insurance: 38
- FinEval_Accounting / auditing: 37
- FinEval / auditing: 37
- FinEval / macroeconomics: 36
- FinEval_Accounting / management_accounting: 34
- FinEval / management_accounting: 34
- 经济学 / 微观经济学: 33
- FinEval / central_banking: 33
- FinEval_Accounting / intermediate_financial_accounting: 31
- FinEval / financial_engineering: 31
- FinEval / intermediate_financial_accounting: 31
- FinEval_Accounting / economic_law: 30
- FinEval / economic_law: 30
- FinEval / finance: 30
- FinEval_Accounting / financial_management: 29
- FinEval / financial_management: 29
- FinEval / political_economy: 28
- 经济学 / 宏观经济学: 27
- FinEval / securities_practitioner_qualification_certificate: 27
- FinEval_Accounting / advanced_financial_accounting: 26

## 初版 proposed_subject 计数

- FinEval: 539
- 会计学: 503
- 金融学: 346
- 金融监管与从业资格: 329
- 税法与财政: 253
- FinEval_Accounting: 122
- 经济学: 91
- 数学: 82
- 统计学: 71
- 物理: 70
- 化学: 50
- 保险与精算: 42
- 生物: 40
- 地理: 35
- 历史: 34
- 信息技术: 28
- 语文: 24
- 英语: 23
- 思想政治: 20
- 管理学: 12

## 初步观察

- `route_index.json` 已有 `subject/domain/name/aliases/keywords/content/priority`，适合作为层级挂载底座。
- 当前结构更像“知识点/route 明细集合”，domain 可近似作为模块，但缺少稳定的上位概念、子概念、适用条件、例外与题型规律字段。
- 下一步应选样板模块，把 route 从 `subject/domain` 进一步归入 `学科/模块/上位概念/子概念/节点类型`。
- 建议样板模块：资产定价、商业银行风险管理、财务会计资产。