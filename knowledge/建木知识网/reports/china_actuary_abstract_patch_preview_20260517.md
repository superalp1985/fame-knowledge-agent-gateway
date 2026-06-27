# China Actuary 抽象层 patch preview — 2026-05-17

## 定位

本文件是落地预案，基于 `reports/china_actuary_rule_audit_20260517.md`。
目标不是给 `china_actuary` 单独硬补，而是把可泛化规则拆入更合适的抽象层：经济学、保险精算、会计学。
C 类规则保持隔离，不写入主知识网抽象层。

## 建议落地文件

### `经济学_rules.json` — 10 条

#### econ_cobweb_divergent｜蛛网模型发散条件
- 来源 china_actuary id: [1]
- 候选规则: 供给曲线与需求曲线斜率取绝对值比较时，若供给曲线斜率小于需求曲线斜率，供给对价格反应更强，蛛网模型呈发散型摆动。

#### econ_indifference_curve_properties｜无差异曲线基本性质
- 来源 china_actuary id: [2]
- 候选规则: 无差异曲线通常向右下方倾斜、互不相交，离原点越远效用越高；沿同一条无差异曲线总效用相同，但边际效用不必相等。

#### econ_lac_economies_of_scale｜长期平均成本与规模经济
- 来源 china_actuary id: [3]
- 候选规则: 长期平均成本 LAC 随产出增加而下降，通常表示存在规模经济。

#### econ_capital_flow_rate_equalization｜资本流动与收益率均等化
- 来源 china_actuary id: [4]
- 候选规则: 资本倾向于从低利润率/低利率行业流向高利润率/高利率行业，直到行业间收益率趋于均等。

#### econ_partial_equilibrium_scope｜局部均衡适用范围
- 来源 china_actuary id: [5]
- 候选规则: 局部均衡适合分析影响范围较窄的商品税或单一市场冲击，不适合分析公司所得税等广泛影响多个市场的政策。

#### macro_rational_expectations_announced_money_growth｜理性预期与已宣布货币增长
- 来源 china_actuary id: [7]
- 候选规则: 中央银行公开宣布提高货币增长率，在理性预期下主要提高预期通胀和实际通胀，失业率不因可预期政策系统性变化。

#### macro_investment_demand_interest_rate｜投资需求与利率关系
- 来源 china_actuary id: [8]
- 候选规则: 投资需求通常与利率反向变动，利率越高，投资项目现值越低，投资需求越弱。

#### macro_harrod_warranted_growth｜哈罗德有保证增长率
- 来源 china_actuary id: [9]
- 候选规则: 实际增长率高于有保证增长率时，需求扩张和投资加速机制可能导致长期膨胀。

#### central_bank_bank_of_issue｜中央银行发行的银行职能
- 来源 china_actuary id: [10]
- 候选规则: 中央银行“发行的银行”职能集中体现为垄断或集中发行货币。

#### macro_expenditure_gdp｜支出法 GDP
- 来源 china_actuary id: [6]
- 候选规则: GDP = C + I + G + X - M；NDP 通常为 GDP - 折旧；净出口为 X-M。

### `保险精算_rules.json` — 6 条

#### actuarial_life_premium_discrete_whole_life｜全离散终身寿险均衡保费
- 来源 china_actuary id: [13]
- 候选规则: 全离散终身寿险净均衡年缴保费可由给定 A_x 和 d 按 π = d·A_x/(1-A_x)·保额计算。

#### actuarial_binomial_sd｜二项分布标准差
- 来源 china_actuary id: [19]
- 候选规则: 若 X~Bin(n,p)，则标准差为 sqrt(np(1-p))。

#### actuarial_gross_premium_loading｜毛保费费用加载公式
- 来源 china_actuary id: [21]
- 候选规则: 毛保费 = (纯保费 + 固定费用) / (1 - 可变费用率 - 利润附加率)。

#### actuarial_pension_service_split｜养老金服务年限分段给付
- 来源 china_actuary id: [18]
- 候选规则: 分段给付养老金按各工龄区间的月给付额×对应年数×12 汇总。

#### actuarial_surplus_reinsurance_recovery｜溢额再保险赔款分摊
- 来源 china_actuary id: [24]
- 候选规则: 溢额再保险按保险金额中超过自留额、且不超过分保限额的比例分摊赔款；低于自留额时再保险人不赔。

#### actuarial_buhlmann_credibility｜Bühlmann 信度估计
- 来源 china_actuary id: [22]
- 候选规则: Bühlmann 估计通常形如 Z·样本均值 + (1-Z)·总体均值，Z 由过程方差和结构方差决定。

### `会计学_rules.json` — 8 条

#### acc_insurance_solvency_goal｜保险会计目标：偿付能力
- 来源 china_actuary id: [26]
- 候选规则: 保险行业财务报告目标具有特殊性，通常更强调偿付能力监测。

#### acc_cash_flow_indirect_method｜现金流量表间接法
- 来源 china_actuary id: [33]
- 候选规则: 间接法以净利润为起点调节到经营活动现金流量，通常在现金流量表附注中披露。

#### acc_replacement_cost_newness_rate｜重置成本按成新率入账
- 来源 china_actuary id: [27]
- 候选规则: 盘盈固定资产以重置成本计量时，可按当前重置价格×成新率确定入账金额。

#### acc_equation_assets_liabilities｜会计等式影响：资产负债同增同减
- 来源 china_actuary id: [28, 29, 31]
- 候选规则: 赊购设备使资产增加、负债增加；向银行借款增加负债和银行存款；偿还借款减少负债和银行存款。

#### acc_balance_sheet_ar_project｜资产负债表应收账款项目
- 来源 china_actuary id: [30]
- 候选规则: 应收账款项目通常按应收账款明细借方余额加预收账款明细借方余额列示。

#### acc_financing_cash_flow｜筹资活动现金流
- 来源 china_actuary id: [34]
- 候选规则: 筹资活动净现金流 = 借款流入 + 发行权益流入 - 偿还债务/支付股利等筹资流出。

#### acc_eps_basic｜基本每股收益 EPS
- 来源 china_actuary id: [35]
- 候选规则: 基本每股收益 = (净利润 - 优先股股利) / 发行在外普通股股数。

#### acc_gross_margin_turnover｜销售毛利率与周转率
- 来源 china_actuary id: [36]
- 候选规则: 销售收入 = 流动资产平均余额 × 流动资产周转率；销售毛利率 = 销售毛利 / 销售收入。

## 暂不落地 / C 类隔离

- id=0：机会成本题按 FinEval 暴露题口径只取放弃工资 2000，未计自有存款月息 2000；标准经济学口径存在争议，不进主抽象层。
- id=32：未决赔款准备金账户借项金额带 FinEval/保险会计科目口径；除非后续找到教材依据，否则保留 pipeline/黑名单。

## 预期影响

- 降低 `china_actuary` 对 no_knowledge_hit / low_kappa 的依赖。
- 由于 23 条 B 类多为计算题，`calc_not_parsed` 仍可能存在；这轮 patch 更偏知识路由与抽象层沉淀，不承诺彻底消灭 need_patch。
- 落地后必须跑：`china_actuary` 单科回归 + 34 科全局回归。

## 落地注意

- 新建 `经济学_rules.json` 和 `保险精算_rules.json` 时，要同步 route_index。
- `会计学_rules.json` 只合并新增 id，不覆盖既有规则。
- route_index `stats.total` 必须等于 routes 长度，manual 数只按新增量增加。
- first_order 每条 to 最多 3 个。