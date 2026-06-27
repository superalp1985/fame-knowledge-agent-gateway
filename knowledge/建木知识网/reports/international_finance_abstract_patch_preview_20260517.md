# International Finance 抽象层 patch preview — 2026-05-17

## 定位

基于 `reports/international_finance_rule_audit_20260517.md`，建议落地国际收支、汇率资本流动、国际储备、外汇期权和国际租赁相关通用规则。
MIGA/世界银行集团、旧版国际收支表科目、特里芬固定方案名保持隔离。

## 建议落地规则 10 条

#### ifx_china_fx_policy_dynamic｜中国外汇管理政策动态变化
- 来源 international_finance id: [0]
- 候选规则: 中国外汇管理政策与人民币自由兑换进程是逐步调整和开放的过程，并非始终保持不变。

#### ifx_exchange_rate_short_capital_flow｜汇率变动影响短期资本流动
- 来源 international_finance id: [1]
- 候选规则: 汇率变动会显著影响短期资本流动：本币大幅贬值易引起资本外逃或短期资本流出，本币升值易吸引短期资本流入。

#### ifx_put_option_rights_obligations｜外汇看跌期权权利义务
- 来源 international_finance id: [3]
- 候选规则: 外汇看跌期权买方享有按约定价格卖出外汇的权利，卖方承担相应买入外汇的义务，买方支付的期权费通常不可收回。

#### ifx_bop_deficit_currency_weakness｜国际收支逆差与货币疲软
- 来源 international_finance id: [6]
- 候选规则: 一国国际收支出现巨额逆差通常会削弱本币，使货币趋于疲软。

#### ifx_bop_surplus_currency_strength｜国际收支顺差与货币坚挺
- 来源 international_finance id: [13]
- 候选规则: 一国国际收支出现巨额顺差通常会支撑本币，使货币趋于坚挺。

#### ifx_direct_quote_bop_model_direction｜直接标价法国际收支模型方向
- 来源 international_finance id: [7, 14]
- 候选规则: 直接标价法下，国际收支模型通常推断汇率与本国物价同方向变动、与本国收入同方向变动、与本国利率反方向变动。

#### ifx_reserve_currency_conditions｜储备货币条件
- 来源 international_finance id: [9]
- 候选规则: 充当国际储备资产的货币通常需要可自由兑换、在国际货币体系中占重要地位且购买力稳定，不要求货币面值或价值较高。

#### ifx_international_reserve_characteristics｜国际储备特性
- 来源 international_finance id: [10]
- 候选规则: 国际储备强调可得性、流动性和普遍接受性，盈利性不是其必要特性。

#### ifx_jamaica_system_differences｜牙买加体系区别
- 来源 international_finance id: [12]
- 候选规则: 牙买加体系相对布雷顿森林体系的重要变化包括黄金非货币化、储备货币多样化和汇率制度多样化，不包括国际收支调节单一化。

#### ifx_double_leasing_definition｜双重租赁定义
- 来源 international_finance id: [15]
- 候选规则: 双重租赁是指不同国家对租赁资产税收所有人的认定标准不同，从而产生跨国减税安排。

## 暂不落地 / C 类隔离

- id=5：MIGA 实际属于世界银行集团，FinEval gold 与现实口径冲突。
- id=8：美国采用间接标价法属于国家固定口径。
- id=11：国际收支表“金融项目/资本和金融项目”是旧教材口径差异。
- id=16：特里芬方案名称为固定史实。

## 预期影响

- 主要降低 `international_finance` no_knowledge_hit / low_kappa。
- 可能外溢到 `monetary_finance`、`finance`、`commercial_bank_finance`、`macroeconomics`。
- 落地后跑单科 + 34 科全局回归。