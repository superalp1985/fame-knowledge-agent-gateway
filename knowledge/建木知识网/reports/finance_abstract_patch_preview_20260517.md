# Finance 抽象层 patch preview — 2026-05-17

## 定位

本文件是落地预案，基于 `reports/finance_rule_audit_20260517.md`。
目标：扩充 `经济学_rules.json` 的金融学/货币金融/国际金融/金融衍生工具规则，快速收口 finance 并验证金融通用层。
C 类暴露题口径、历史机构名单、固定事实保持隔离，不进入主抽象层。

## 建议落地文件

### `经济学_rules.json` / `金融学` + `货币金融` + `国际金融` + `金融衍生工具` — 21 条

#### finance_direct_vs_indirect_credit｜直接信用与间接信用
- 来源 finance id: [0]
- 候选规则: 直接信用是资金供求双方直接融资；商业银行贷款通过金融中介完成，属于间接信用。

#### finance_fisher_equation_approx｜费雪方程近似
- 来源 finance id: [1]
- 候选规则: 名义利率约等于实际利率加预期通货膨胀率。

#### finance_li_interest_unit_conversion｜厘的利率单位换算
- 来源 finance id: [2]
- 候选规则: 按我国习惯，年息1厘约为1%，月息1厘约为0.1%，拆息/日息1厘约为0.01%。

#### finance_deposit_rate_classification｜挂牌存款利率性质
- 来源 finance id: [3]
- 候选规则: 挂牌公告的定期储蓄存款利率通常属于固定利率、名义利率和官定利率，不属于浮动利率。

#### finance_bank_credit_instrument_creation｜银行创造信用流通工具职能
- 来源 finance id: [5]
- 候选规则: 银行开出银行汇票、银行本票等信用工具，体现创造信用流通工具职能。

#### finance_futures_vs_option_features｜期货与期权特征区别
- 来源 finance id: [6]
- 候选规则: 期货合约本身通常不包含期权式选择权；可赎回债券、认股权证等含有类似期权特征。

#### finance_futures_core_purpose｜期货交易核心目的
- 来源 finance id: [7]
- 候选规则: 期货交易的重要经济功能是套期保值、转移或减少价格风险。

#### finance_derivatives_functions｜金融衍生工具功能
- 来源 finance id: [8]
- 候选规则: 金融衍生工具基本功能包括避险保值、价格发现和改善资产管理，不包括保持资信度不变。

#### finance_international_financial_institutions｜国际金融机构边界
- 来源 finance id: [9]
- 候选规则: IMF、IBRD、BIS 属于国际性金融机构；WTO 属于国际贸易组织，不是金融机构。

#### finance_rural_banking_reform_scope｜农村银行改革机构边界
- 来源 finance id: [11]
- 候选规则: 农村银行改革后的机构包括农村商业银行、农村合作银行、村镇银行等，不包括“中国农村发展银行”这一非标准机构。

#### finance_financial_intermediary_functions｜金融中介主要职能
- 来源 finance id: [12]
- 候选规则: 金融中介机构主要职能包括信用中介、支付中介和信用创造；转移价格风险更偏金融衍生工具功能。

#### finance_commercial_bank_basic_function｜商业银行基本职能
- 来源 finance id: [13]
- 候选规则: 商业银行最基本的职能是信用中介。

#### finance_financial_innovation_regulatory_avoidance｜自动转账制度创新动因
- 来源 finance id: [14]
- 候选规则: 自动转账制度等金融创新常被视为规避行政管制推动的创新。

#### finance_commercial_bank_nature｜商业银行性质
- 来源 finance id: [15]
- 候选规则: 商业银行是以盈利为目的、经营货币信用业务并承担资金融通职能的特殊企业。

#### finance_separated_banking_system｜分离银行制特点
- 来源 finance id: [16]
- 候选规则: 分离银行制下商业银行主要经营吸收存款和发放短期工商贷款业务，不综合经营证券、保险、信托等业务。

#### finance_central_bank_service_function｜央行服务职能
- 来源 finance id: [19]
- 候选规则: 中央银行经理国库、临时财政垫支、充当最后贷款人等体现其服务职能。

#### finance_central_bank_business_counterparties｜央行业务对象
- 来源 finance id: [20]
- 候选规则: 中央银行业务对象主要是一国政府与金融机构，不直接面向普通工商企业和个人。

#### finance_stock_index_futures_cash_settlement｜股指期货交割方式
- 来源 finance id: [21]
- 候选规则: 股指期货通常根据股票指数进行现金交割。

#### finance_fx_put_option｜外汇看跌期权
- 来源 finance id: [22]
- 候选规则: 外汇看跌期权赋予买方按约定价格卖出外汇的权利，而不是买入外汇的权利。

#### finance_convertible_bond_call_feature｜可转换债券赎回条款
- 来源 finance id: [23]
- 候选规则: 可转换债券通常可附提前赎回条款，“不能被发行公司提前赎回”表述过绝对。

#### finance_american_option_exercise｜美式期权执行时间
- 来源 finance id: [24]
- 候选规则: 美式期权可以在到期日或到期日之前的任一允许时间执行。

## 暂不落地 / C 类隔离

- id=4：永久性债券题按常规定价应为 100，但 FinEval 暴露题口径选 125，不进入主网。
- id=10：金融资产管理公司历史名单/措辞细枝，泛化收益低。
- id=17：央行“发行的银行”职能题口径异常，已标注暴露题口径。
- id=18：最早全面发挥央行职能的银行属于历史固定事实。

## 预期影响

- 主要降低 `finance` 的 no_knowledge_hit / low_kappa；calc_not_parsed 不一定全部消失。
- 可能外溢到 `banking_practitioner_qualification_certificate`、`commercial_bank_finance`、`financial_markets`、`fund_qualification_certificate`、`securities_practitioner_qualification_certificate`。
- 落地后必须跑：`finance` 单科回归 + 34 科全局回归。