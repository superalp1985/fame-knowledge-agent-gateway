# Macroeconomics 抽象层 patch preview — 2026-05-17

## 定位

本文件是落地预案，基于 `reports/macroeconomics_rule_audit_20260517.md`。
目标：继续扩充 `经济学_rules.json` 的宏观经济学 / 国际金融 / 中央银行规则，降低宏观科目和金融科目的补丁依赖。
C 类题库口径保持隔离，不进入主抽象层。

## 建议落地文件

### `经济学_rules.json` / `宏观经济学` + `国际金融` + `中央银行` — 27 条

#### macro_auto_stabilizer_tax｜自动稳定器与税收
- 来源 macroeconomics id: [0]
- 候选规则: 在没有主动财政政策变化时，国民收入提高会通过所得税等自动稳定器增加政府税收。

#### macro_structural_unemployment｜结构性失业
- 来源 macroeconomics id: [1]
- 候选规则: 因产业结构、技术结构或地区结构变化导致劳动者技能/岗位不匹配而产生的失业属于结构性失业。

#### macro_crowding_out_effect｜挤出效应
- 来源 macroeconomics id: [2]
- 候选规则: 政府支出增加可能推高利率，从而挤出对利率敏感的私人投资或私人部门支出。

#### macro_open_market_sale_bonds｜公开市场卖出债券
- 来源 macroeconomics id: [3]
- 候选规则: 中央银行在公开市场卖出政府债券，会回笼基础货币、减少银行准备金并紧缩货币供给。

#### macro_fx_demand_holder｜外汇需求者
- 来源 macroeconomics id: [5]
- 候选规则: 需要用本币购买某种外币以完成支付或捐赠的人，是该外币的需求者。外国人向美国捐款需要美元，因此是美元需求者。

#### macro_short_term_capital_flow_interest｜短期国际资本流动
- 来源 macroeconomics id: [6]
- 候选规则: 短期国际资本流动主要受各国利率水平差异影响。

#### macro_steady_state_capital_per_capita｜稳态人均资本
- 来源 macroeconomics id: [9]
- 候选规则: 经济增长模型的稳态下，人均资本水平保持稳定；相应人均消费也可稳定。

#### macro_repressed_inflation｜抑制性通货膨胀
- 来源 macroeconomics id: [13]
- 候选规则: 经济已有通货膨胀压力但价格因管制未显性上涨时，属于抑制性通货膨胀。

#### macro_life_cycle_vs_permanent_income｜生命周期假说与永久收入假说
- 来源 macroeconomics id: [15]
- 候选规则: 生命周期假说强调年龄、财富和一生收入路径对消费的影响；“消费主要由永久收入决定”属于永久收入假说。

#### macro_neoclassical_roots｜新古典宏观理论渊源
- 来源 macroeconomics id: [16]
- 候选规则: 新古典宏观经济学的重要理论渊源包括货币主义、理性预期和市场出清思想。

#### macro_monetarism_money_supply_target｜货币主义政策指标
- 来源 macroeconomics id: [17]
- 候选规则: 货币主义强调货币供给量是货币政策的核心控制指标。

#### macro_new_keynesian_unexpected_expansion｜新凯恩斯短期扩张政策
- 来源 macroeconomics id: [18]
- 候选规则: 新凯恩斯主义模型中，预料外扩张性政策短期可能推动价格水平上升并增加总产出。

#### macro_economic_system_definition｜经济体制定义
- 来源 macroeconomics id: [20]
- 候选规则: 资源配置和利用方式通常称为经济体制。

#### macro_gdp_growth_net_investment｜GDP持续上升与净投资
- 来源 macroeconomics id: [28]
- 候选规则: 若 GDP 或产出能力持续上升，通常意味着净投资大于零，资本存量在增加。

#### macro_multiplier_accelerator_cycle｜乘数-加速数经济周期
- 来源 macroeconomics id: [29]
- 候选规则: 经济周期波动可由乘数作用与加速数作用交织解释。

#### macro_long_run_growth_technology｜长期增长源泉
- 来源 macroeconomics id: [30]
- 候选规则: 长期经济增长率提升最根本依靠技术进步和创新。

#### macro_indirect_quote_reciprocal｜间接标价倒数换算
- 来源 macroeconomics id: [4]
- 候选规则: 若间接标价下 1 单位本币 = a 单位外币，则 1 单位外币 = 1/a 单位本币。

#### macro_balanced_budget_multiplier｜平衡预算乘数
- 来源 macroeconomics id: [7]
- 候选规则: 税收和政府购买等额增加时，平衡预算乘数为 1，均衡产出增加额等于政府购买增加额。

#### macro_tax_cut_multiplier｜减税乘数
- 来源 macroeconomics id: [8]
- 候选规则: 定量税减税乘数为 MPC/(1-MPC)，减税 ΔT 会使收入增加 MPC/(1-MPC)×ΔT。

#### macro_investment_multiplier｜投资乘数
- 来源 macroeconomics id: [10]
- 候选规则: 简单凯恩斯模型中投资乘数为 1/(1-MPC)，投资增加 ΔI 会使均衡收入增加 ΔI/(1-MPC)。

#### macro_gdp_deflator_nominal_gdp｜GDP平减指数与名义GDP
- 来源 macroeconomics id: [11]
- 候选规则: 名义 GDP = 实际 GDP × GDP 平减指数；若平减指数以倍数表示则直接相乘。

#### macro_real_gdp_base_price｜基期价格实际GDP
- 来源 macroeconomics id: [19]
- 候选规则: 按基期价格计算实际 GDP，可用名义 GDP × 基期价格指数 / 当期价格指数。

#### macro_price_index｜价格指数
- 来源 macroeconomics id: [21]
- 候选规则: 以基期为 1 或 100 时，价格指数 = 当期价格 / 基期价格。

#### macro_inflation_rate｜通货膨胀率
- 来源 macroeconomics id: [23, 25]
- 候选规则: 通货膨胀率 = (本期价格指数 - 上期价格指数) / 上期价格指数。

#### macro_okun_law｜奥肯定律
- 来源 macroeconomics id: [24]
- 候选规则: 奥肯定律常写作实际产出相对潜在产出的缺口与失业率偏离自然失业率成比例；产出损失率=奥肯系数×失业率缺口。

#### macro_natural_unemployment_flow_model｜自然失业率流量模型
- 来源 macroeconomics id: [26]
- 候选规则: 劳动市场流量模型中，自然失业率 u = s/(s+f)，s 为离职率，f 为失业者就业率。

#### macro_accelerator_net_investment｜加速数与净投资
- 来源 macroeconomics id: [27]
- 候选规则: 加速数/资本产出比为 v 时，收入增加 ΔY 对应净投资增加 v×ΔY。

## 暂不落地 / C 类隔离

- id=12：题干按支出法能算出 9.7，但选项写 GNP/NDP，报告 reason 已写“本题选 GNP”，口径风险高。
- id=14：生命周期理论在“完善社会制度下”MPC 变大属于题库口径。
- id=22：社会主义政府代表全体人民属于政治/思想政治表述，不放入宏观经济学抽象层。

## 预期影响

- 降低 `macroeconomics` 的 no_knowledge_hit / low_kappa，并对 central_banking、monetary_finance、international_finance、finance 等继续外溢。
- 多数 B 类是公式模板，能提高路由 κ；但 calc_not_parsed 不一定完全消失。
- 落地后必须跑：`macroeconomics` 单科回归 + 34 科全局回归。