# Central Banking 抽象层 patch preview — 2026-05-17

## 定位

本文件是落地预案，基于 `reports/central_banking_rule_audit_20260517.md`。
目标：扩充 `经济学_rules.json` 的中央银行/货币金融/国际金融规则，降低央行、货币金融、商业银行相关科目的补丁依赖。
C 类固定制度、历史系统名、题库口径保持隔离，不进入主抽象层。

## 建议落地文件

### `经济学_rules.json` / `中央银行` + `货币金融` + `国际金融` — 22 条

#### central_bank_transparency_principle｜央行公开性原则
- 来源 central_banking id: [0]
- 候选规则: 中央银行公开性原则的目的在于信息披露、接受公共监督并增强货币政策告示效应，不以提高权威性为直接目的。

#### central_bank_deposit_business_features｜中央银行存款业务特点
- 来源 central_banking id: [1]
- 候选规则: 中央银行存款业务具有强制性、特殊性等特点，不属于一般商业存款的自愿性业务。

#### central_bank_reserve_requirement_subjects｜存款准备金缴存主体
- 来源 central_banking id: [2]
- 候选规则: 需向中央银行缴存存款准备金的通常是吸收存款的存款类金融机构；证券公司等非存款类机构一般不属缴存主体。

#### central_bank_reserve_ratio_tool｜存款准备率工具
- 来源 central_banking id: [5]
- 候选规则: 存款准备率通过影响商业银行可贷资金和放款能力发挥货币政策作用。

#### central_bank_clearing_methods｜央行清算方式
- 来源 central_banking id: [6]
- 候选规则: 中央银行常用清算方式包括全额实时结算、小额定时结算和净额批量结算。

#### central_bank_open_market_operation_target｜公开市场操作目标
- 来源 central_banking id: [7]
- 候选规则: 中央银行公开市场买卖证券的操作目标通常是调节基础货币和银行体系流动性。

#### central_bank_fx_reserve_risk｜外汇储备风险构成
- 来源 central_banking id: [8]
- 候选规则: 外汇储备中的外汇资产受汇率和市场价格影响，风险性相对较大。

#### central_bank_gross_settlement｜全额结算定义
- 来源 central_banking id: [9]
- 候选规则: 支付系统对每笔转账业务逐笔一一对应结算，属于全额结算。

#### central_bank_payment_credit_risk｜支付信用风险
- 来源 central_banking id: [12]
- 候选规则: 支付过程中一方拒绝或无力清偿债务导致另一方损失的可能性称为信用风险。

#### central_bank_accounting_report_requirements｜央行会计报表编制要求
- 来源 central_banking id: [13]
- 候选规则: 中央银行会计报表编制要求数字真实正确、内容完整、编报及时。

#### central_bank_monetary_statistics_parallel｜中国货币统计并行方式
- 来源 central_banking id: [14]
- 候选规则: 我国货币统计既单独编制货币供应量和基础货币统计表，也按 IMF 货币与金融统计框架编制货币概览和银行概览。

#### central_bank_monetary_survey_generation｜货币概览生成
- 来源 central_banking id: [15]
- 候选规则: 合并货币当局资产负债表和存款货币机构资产负债表，可生成货币概览。

#### central_bank_iip_definition｜国际投资头寸表
- 来源 central_banking id: [16]
- 候选规则: 国际投资头寸表反映特定时点一国或地区对外金融资产和负债存量。

#### central_bank_gdp_gnp_factor_income｜GDP与GNP要素净收入
- 来源 central_banking id: [17]
- 候选规则: GNP = GDP + 来自国外的要素净收入。

#### central_bank_government_finance_balance_analysis｜政府财政状况差额分析
- 来源 central_banking id: [18]
- 候选规则: 政府部门财政状况分析可使用总差额和经常性收支差额等方法。

#### central_bank_monetary_accounts_hierarchy｜货币账户层次
- 来源 central_banking id: [19]
- 候选规则: 货币账户层次关系通常为金融概览大于货币概览，货币概览大于货币当局资产负债表。

#### central_bank_flow_of_funds_balance｜资金流量账户平衡
- 来源 central_banking id: [20]
- 候选规则: 资金流量账户按交易内容和部门记录资金流动，行列加总应满足会计平衡关系。

#### central_bank_monetary_policy_primary_goal｜货币政策首要目标
- 来源 central_banking id: [22]
- 候选规则: 货币政策的首要目标通常是币值稳定或物价稳定。

#### central_bank_intermediate_targets｜货币政策中介指标
- 来源 central_banking id: [23]
- 候选规则: 货币政策中介指标可包括货币供给量、利率、贷款量等；准备金更偏操作工具或基础变量。

#### central_bank_interest_rate_target_features｜利率中介指标特点
- 来源 central_banking id: [24]
- 候选规则: 利率作为货币政策中介指标数据易得、影响面广、与政策目标相关，但容易受非政策因素影响。

#### central_bank_broad_money_boundary｜广义货币供给构成边界
- 来源 central_banking id: [26]
- 候选规则: 广义货币供给包括现金和各类存款，但不包括银行准备金。

#### central_bank_excess_reserve_money_multiplier｜超额准备金与货币乘数
- 来源 central_banking id: [25]
- 候选规则: 超额准备金 = 实际准备金 - 存款×法定准备金率；货币乘数可按货币供给量与基础货币之比计算。

## 暂不落地 / C 类隔离

- id=3：香港港币发行银行名单是地区制度事实，可变且细枝。
- id=4：人民币出入境携带限额是固定监管数值，强时效。
- id=11：TARGET 启动日期/系统名属历史事实，泛化收益低。
- id=21：货币政策有效性“有效—无效—有效”属于教材流派口径。
- id=27：蒙代尔政策搭配按本题口径，标准 IS-LM-BP 语境易有歧义。

## 预期影响

- 主要降低 `central_banking` 的 no_knowledge_hit / low_kappa。
- 可能外溢到 `monetary_finance`、`banking_practitioner_qualification_certificate`、`commercial_bank_finance`、`international_finance`。
- 落地后必须跑：`central_banking` 单科回归 + 34 科全局回归。