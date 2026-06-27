# Microeconomics 抽象层 patch preview — 2026-05-17

## 定位

本文件是落地预案，基于 `reports/microeconomics_rule_audit_20260517.md`。
目标：继续扩充 `经济学_rules.json`，把微观经济学概念规则从 pipeline concept_rule 沉淀到知识网。
C 类题库口径保持隔离，不进入主抽象层。

## 建议落地文件

### `经济学_rules.json` / `微观经济学` — 28 条

#### econ_firm_shutdown_rule｜厂商亏损仍生产条件
- 来源 microeconomics id: [0]
- 候选规则: 短期内厂商亏损仍生产的条件是价格不低于平均可变成本 AVC；若 P ≥ AVC，继续生产可覆盖可变成本并分摊部分固定成本。

#### econ_perfect_competition_total_revenue｜完全竞争总收益曲线
- 来源 microeconomics id: [1]
- 候选规则: 完全竞争厂商是价格接受者，价格既定，因此总收益 TR=P·Q，总收益曲线斜率固定且等于价格。

#### econ_average_revenue_market_structure｜平均收益曲线与市场结构
- 来源 microeconomics id: [2]
- 候选规则: 平均收益曲线向右下方倾斜说明厂商面对向下倾斜的需求曲线，即不完全竞争；完全竞争下平均收益曲线通常为水平线。

#### econ_factor_demand_marginal_product｜要素需求曲线与边际产量
- 来源 microeconomics id: [3]
- 候选规则: 厂商要素需求向右下方倾斜，根源在于边际产量递减和边际收益产品递减。

#### econ_market_labor_supply｜市场劳动供给曲线
- 来源 microeconomics id: [7]
- 候选规则: 单个劳动者供给曲线可能后弯，但市场劳动供给曲线汇总后通常仍向右上方倾斜。

#### econ_wage_income_effect_labor_supply｜工资率收入效应
- 来源 microeconomics id: [8]
- 候选规则: 工资率提高的收入效应使劳动者在相同劳动时间下收入增加，从而倾向于购买更多闲暇、减少劳动供给。

#### econ_partial_general_equilibrium｜局部均衡与一般均衡
- 来源 microeconomics id: [10, 11]
- 候选规则: 局部均衡关注单一市场并忽视其他市场反馈；当冲击影响很多市场时，应使用一般均衡，否则局部均衡可能误判。

#### econ_pareto_efficiency_fairness｜帕累托效率与公平
- 来源 microeconomics id: [12, 13]
- 候选规则: 帕累托有效要求生产效率、交换效率和产品组合效率，但不保证收入分配公平。

#### econ_externality_pigouvian_tax｜外部性与庇古税
- 来源 microeconomics id: [14, 19]
- 候选规则: 外部性使市场价格不能反映交易全部社会成本或收益；污染负外部性的庇古税通常等于社会边际成本与私人边际成本之差。

#### econ_information_asymmetry_sources｜信息不对称来源
- 来源 microeconomics id: [16]
- 候选规则: 信息不对称可来自卖方隐瞒、买方认知有限或完全获取信息成本过高。

#### econ_rent_seeking｜寻租行为
- 来源 microeconomics id: [20]
- 候选规则: 企业投入资源游说政府设置准入壁垒、阻止竞争者进入，以获得或维持垄断租金，属于寻租。

#### econ_cournot_model｜古诺模型
- 来源 microeconomics id: [21]
- 候选规则: 古诺模型讨论寡头厂商以产量为战略变量进行竞争。

#### econ_prisoners_dilemma｜囚徒困境
- 来源 microeconomics id: [22, 38]
- 候选规则: 囚徒困境中，个体独立按自身利益选择会导致集体较差结果；有限期重复囚徒困境可用逆推得到每期背叛/坦白。

#### econ_first_degree_price_discrimination｜一级价格歧视
- 来源 microeconomics id: [23]
- 候选规则: 一级价格歧视按每个消费者最高支付意愿收费，理论上可攫取消费者剩余，使消费者剩余最小。

#### econ_increasing_cost_industry_supply｜成本递增行业长期供给
- 来源 microeconomics id: [24]
- 候选规则: 成本递增行业中，行业扩张推高投入价格，长期供给曲线通常向右上方倾斜。

#### econ_short_run_optimal_output｜短期最优产出
- 来源 microeconomics id: [25]
- 候选规则: 最优短期产出水平使总利润最大；若亏损不可避免，则使总亏损最小。

#### econ_perfect_competition_long_run_supply｜完全竞争长期供给曲线
- 来源 microeconomics id: [26]
- 候选规则: 完全竞争行业长期供给与长期平均成本最低点轨迹相关，长期均衡中价格等于最低长期平均成本。

#### econ_mc_avc_relation｜MC 与 AVC 关系
- 来源 microeconomics id: [29]
- 候选规则: 当边际成本 MC 高于平均可变成本 AVC 时，增加产量会拉高 AVC；当 MC 低于 AVC 时，会拉低 AVC。

#### econ_short_run_variable_cost｜短期可变成本
- 来源 microeconomics id: [30]
- 候选规则: 短期可变成本随产量增加而增加；其斜率由边际成本决定。

#### econ_total_product_mp_zero｜总产量最大与边际产量
- 来源 microeconomics id: [31]
- 候选规则: 总产量达到最大时，边际产量 MP=0，边际产量曲线与横轴相交。

#### econ_decreasing_returns_split｜规模报酬递减与拆分
- 来源 microeconomics id: [32]
- 候选规则: 若单一工厂在所有相关产出水平呈规模报酬递减，拆分为较小规模生产单位可能提高总产出。

#### econ_inferior_goods｜低档商品
- 来源 microeconomics id: [34]
- 候选规则: 收入降低时购买量增加、收入提高时购买量减少的商品，对该消费者属于低档商品。

#### econ_satiation_vertical_indifference_curve｜饱和商品与垂直无差异曲线
- 来源 microeconomics id: [35]
- 候选规则: 若无差异曲线为垂直线且 X 在横轴、Y 在纵轴，通常表示 Y 已达到饱和，效用只随 X 增加而变化。

#### econ_price_support_surplus_purchase｜支持价格
- 来源 microeconomics id: [36]
- 候选规则: 政府设定高于均衡价格的支持价格会造成供给过剩；为维持支持价格，政府可收购过剩产品。

#### econ_law_of_demand｜需求规律
- 来源 microeconomics id: [37]
- 候选规则: 需求规律指其他条件不变时，商品自身价格下降会使需求量增加，价格上升会使需求量减少。

#### econ_game_payoff｜博弈支付
- 来源 microeconomics id: [39]
- 候选规则: 博弈中局中人从策略组合中得到的结果或收益称为支付。

#### econ_mrs_exchange_direction｜MRS 与互利交换方向
- 来源 microeconomics id: [9, 18]
- 候选规则: 两人对 X 替代 Y 的边际替代率不同，则存在互利交换空间；MRS 较低者可用 X 向 MRS 较高者交换 Y。

#### econ_utility_max_mrs_price_ratio｜效用最大化与相对价格
- 来源 microeconomics id: [33]
- 候选规则: 消费者效用最大化时，边际替代率等于相对价格；跨地区相对价格不同会导致效用最大化下的 MRS 不同。

## 暂不落地 / C 类隔离

- id=5：垄断企业投入品 M 条件题 reason 已写“按本题口径”，边际条件不完整。
- id=6：产品价格上升导致劳动边际产品价值增加但劳动需求曲线左移，和标准直觉冲突。
- id=17：公共物品不能市场提供的标准原因是不排他/非竞争/搭便车，题库选“内部性”。
- id=27：竞争性市场长期均衡“以上全对”包含工艺完全相同、经济利润等高风险表述。
- id=28：LMC/LAC/长期总成本关系题干混写，reason 已标“按本题口径”。

## 预期影响

- 进一步降低 `microeconomics` 的 no_knowledge_hit / low_kappa。
- 对 macroeconomics、finance、central_banking、monetary_finance 等经济金融科目可能继续有外溢。
- 由于少量题含数字/MRS比较，`calc_not_parsed` 不一定完全消失。
- 落地后必须跑：`microeconomics` 单科回归 + 34 科全局回归。