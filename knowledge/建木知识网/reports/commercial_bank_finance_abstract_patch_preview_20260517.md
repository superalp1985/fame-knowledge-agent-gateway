# Commercial Bank Finance 抽象层 patch preview — 2026-05-17

## 定位

基于 `reports/commercial_bank_finance_rule_audit_20260517.md`，建议落地商业银行、银行信贷、租赁、国际业务与贴现计算模板。
不落固定签章、截断题和教材口径冲突的商业银行功能题。

## 建议落地规则 16 条

#### cbf_finance_vs_operating_lease｜融资租赁与经营租赁区别
- 来源 commercial_bank_finance id: [0]
- 候选规则: 融资租赁与经营租赁主要区别在风险报酬是否转移、租赁期限和承租人权利，订金是否完全支付不是主要区别。

#### cbf_irrevocable_standby_lc_beneficiary｜不可撤销备用信用证受益人保护
- 来源 commercial_bank_finance id: [1]
- 候选规则: 不可撤销备用信用证不能由开证银行单方撤销，相比可撤销备用信用证明显更有利于受益人。

#### cbf_spot_futures_by_delivery_time｜现货期货市场划分
- 来源 commercial_bank_finance id: [2]
- 候选规则: 现货市场与期货市场按交割时间划分。

#### cbf_early_withdrawal_demand_rate｜定期储蓄提前支取计息
- 来源 commercial_bank_finance id: [3]
- 候选规则: 定期储蓄存款提前支取时，支取部分按支取日挂牌公告的活期存款利率计付利息。

#### cbf_dupont_core_roe｜杜邦分析核心指标
- 来源 commercial_bank_finance id: [4]
- 候选规则: 杜邦财务分析体系的核心指标是净资产收益率 ROE。

#### cbf_special_mention_loan｜关注类贷款定义
- 来源 commercial_bank_finance id: [5]
- 候选规则: 贷款五级分类中，借款人目前有能力偿还本息但存在可能不利影响因素的贷款是关注类贷款。

#### cbf_business_outsourcing_boundary｜银行业务外包意义边界
- 来源 commercial_bank_finance id: [6]
- 候选规则: 银行业务外包可获得技术比较优势、节约成本、集中管理资源，但不等于直接提高盈利能力。

#### cbf_real_bills_doctrine｜真实票据理论
- 来源 commercial_bank_finance id: [7]
- 候选规则: 真实票据理论主张商业银行资金用于短期、自偿性商业贷款。

#### cbf_international_business_objectives｜银行国际业务经营目标
- 来源 commercial_bank_finance id: [8]
- 候选规则: 银行国际业务经营目标包括安全性、流动性、盈利性，不包括固定性。

#### cbf_financial_internationalization_negative_effects｜金融业国际化消极影响边界
- 来源 commercial_bank_finance id: [9]
- 候选规则: 金融业国际化可能加剧国内竞争、扩大金融风险、增加监管难度；推动金融市场稳定不是消极作用。

#### cbf_cash_asset_management_principles｜商业银行现金资产管理原则
- 来源 commercial_bank_finance id: [11]
- 候选规则: 商业银行现金资产管理原则包括总量适度、适时调节和安全保障，不包括盈利性原则。

#### cbf_interbank_lending_purpose｜同业拆借主要目的
- 来源 commercial_bank_finance id: [12]
- 候选规则: 银行同业拆借主要用于调剂准备金头寸和短期流动性。

#### cbf_loan_policy_contents｜贷款政策内容边界
- 来源 commercial_bank_finance id: [14]
- 候选规则: 贷款政策包括业务发展战略、贷款工作规程和权限划分、贷款规模与比率控制；借款担保是具体贷款条件。

#### cbf_loan_pricing_principles｜贷款定价原则边界
- 来源 commercial_bank_finance id: [16]
- 候选规则: 商业银行贷款定价原则可包括利润最大化、扩大市场份额、维护银行形象等，不包括减少贷款量。

#### cbf_credit_intermediation_boundary｜信用中介作用边界
- 来源 commercial_bank_finance id: [17]
- 候选规则: 商业银行信用中介功能可使闲散货币转化为资本、闲置资本得到利用并续短为长；节约流通费用更偏支付中介。

#### cbf_bill_discount_cash_proceeds｜商业票据贴现现金额
- 来源 commercial_bank_finance id: [18]
- 候选规则: 商业票据贴现金额 = 票据面额 × (1 - 年贴现率 × 未到期月数/12)。

## 暂不落地 / C 类隔离

- id=10：银行承兑汇票托收背书栏签章，固定操作细则。
- id=13：题干/选项疑似截断，“短期”作为定量控制指标不泛化。
- id=15：贷款政策考虑因素中资产结构口径风险。
- id=19：商业银行“货币创造”是否列入功能依教材口径变化。

## 预期影响

- `commercial_bank_finance` 的 no_knowledge_hit / low_kappa 应下降。
- 可能外溢到 `banking_practitioner_qualification_certificate`、`finance`、`financial_markets`、`accounting`。
- 落地后跑单科 + 34 科全局回归。