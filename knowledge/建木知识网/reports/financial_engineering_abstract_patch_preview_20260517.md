# Financial Engineering 抽象层 patch preview — 2026-05-17

## 定位

本文件是落地预案，基于 `reports/financial_engineering_rule_audit_20260517.md`。
目标：扩充 `经济学_rules.json` 的金融工程/金融衍生工具/国际金融规则，降低金融工程、期货、证券、投资相关科目的补丁依赖。
C 类 FinEval口径、标准冲突题、过窄复杂算例保持隔离。

## 建议落地文件

### `经济学_rules.json` / `金融工程` + `金融衍生工具` + `国际金融` — 18 条

#### fineng_call_option_intrinsic_value｜认购期权内在价值
- 来源 financial_engineering id: [0]
- 候选规则: 认购/看涨期权内在价值 = max(标的价格 S - 行权价格 K, 0)。

#### fineng_convertible_bond_composite｜可转换债券复合属性
- 来源 financial_engineering id: [1]
- 候选规则: 可转换债券可视为普通债券与转换期权的复合。

#### fineng_derivative_contract_types｜衍生合约类型边界
- 来源 financial_engineering id: [3]
- 候选规则: 远期、期货、期权属于典型衍生合约类型；久期是利率敏感性指标，不是合约类型。

#### fineng_derivative_market_features｜衍生品市场特点
- 来源 financial_engineering id: [4]
- 候选规则: 衍生金融工具市场具有跨期交易、杠杆效应、套期保值与投机套利共存等特点，并非低风险确定性市场。

#### fineng_forward_contract_definition｜金融远期合约定义
- 来源 financial_engineering id: [5]
- 候选规则: 约定未来特定日期按既定价格买卖某项资产的合约是金融远期合约。

#### fineng_fx_futures_margin｜外汇期货保证金制度
- 来源 financial_engineering id: [7]
- 候选规则: 外汇期货交易通常采取保证金制度。

#### fineng_option_time_value｜期权时间价值
- 来源 financial_engineering id: [9]
- 候选规则: 期权时间价值 = 期权实际价格 - 期权内在价值。

#### fineng_bear_put_spread_payoff｜熊市看跌价差 payoff
- 来源 financial_engineering id: [11]
- 候选规则: 熊市看跌价差可由买入高执行价看跌期权、卖出低执行价看跌期权构成，到期 payoff 为 max(K_high-S,0)-max(K_low-S,0)。

#### fineng_forward_hedged_revenue｜远期锁汇收入
- 来源 financial_engineering id: [12]
- 候选规则: 使用远期合约套期保值时，锁定本币收入 = 外币金额 × 远期汇率。

#### fineng_financial_engineering_definition｜金融工程定义
- 来源 financial_engineering id: [13]
- 候选规则: 金融工程是以科学化、程序化方法对金融问题进行设计、开发和运用，并进行金融工具创新的活动。

#### fineng_initial_margin｜初始保证金
- 来源 financial_engineering id: [14]
- 候选规则: 期货交易中新开仓交易必须缴纳的保证金称为初始保证金。

#### fineng_put_call_parity_dividend_yield｜含股息看涨看跌平价
- 来源 financial_engineering id: [16]
- 候选规则: 含连续股息收益率的看涨看跌平价可用于由 C、P、S、K、r、T 反推隐含股息收益率。

#### fineng_gbm_expected_price｜几何布朗运动期望价格
- 来源 financial_engineering id: [17]
- 候选规则: 若股票价格服从几何布朗运动，短期预期价格可近似按 S·exp(μ·Δt) 计算。

#### fineng_american_option_definition｜美式期权定义
- 来源 financial_engineering id: [18]
- 候选规则: 到期日前可以行使的期权是美式期权。

#### fineng_interest_rate_futures_long_hedge｜利率期货买入套保
- 来源 financial_engineering id: [22]
- 候选规则: 未来将买入固定收益债券且担心利率下降导致债券价格上升时，可买入利率期货套期保值。

#### fineng_derivatives_participant_roles｜衍生品市场参与者功能分类
- 来源 financial_engineering id: [23]
- 候选规则: 衍生品市场参与者按功能通常包括套期保值者、套利者和投机者；“机构”不是功能分类。

#### fineng_no_arbitrage_pricing_basis｜无套利定价基础
- 来源 financial_engineering id: [24]
- 候选规则: 现代金融衍生品定价理论通常以无套利为基础，即假设不存在无风险套利机会。

#### fineng_open_interest_change｜期货未平仓合约数变化
- 来源 financial_engineering id: [25]
- 候选规则: 期货交易后未平仓合约数可能增加、减少或不变，取决于交易双方开仓/平仓状态。

## 暂不落地 / C 类隔离

- id=2：题干/选项疑似异常，标准口径应为看涨上涨、认沽下跌。
- id=8：put-call delta 标准关系通常 put delta = call delta - 1，本题 gold 为 -0.8，口径冲突。
- id=10/15/20：复杂具体算例，留给计算器/解析器，不写固定数值规则。
- id=19：期权合约通常会规定标的数量，本题口径风险。
- id=21：卖出看涨降低下跌风险的表述有保护不对称，暂不落。

## 预期影响

- 主要降低 `financial_engineering` 的 no_knowledge_hit / low_kappa；大量 calc_not_parsed 可能仍保留。
- 可能外溢到 `futures_practitioner_qualification_certificate`、`financial_markets`、`investments`、`securities_practitioner_qualification_certificate`。
- 落地后必须跑：`financial_engineering` 单科回归 + 34 科全局回归。