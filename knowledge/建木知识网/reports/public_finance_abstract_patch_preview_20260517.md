# Public Finance 抽象层 patch preview — 2026-05-17

## 定位

本文件是落地预案，基于 `reports/public_finance_rule_audit_20260517.md`。
目标：扩充 `经济学_rules.json` 的财政学/公共财政/国际金融规则，继续降低财政、宏观、金融相关科目的补丁依赖。
C 类旧税法、FinEval口径、预算制度细枝保持隔离，不进入主抽象层。

## 建议落地文件

### `经济学_rules.json` / `财政学` + `公共财政` + `国际金融` — 30 条

#### public_finance_supply_side_tax｜供给学派税收观点
- 来源 public_finance id: [0]
- 候选规则: 供给学派认为高边际税率会阻碍物质资本和人力资本投资、减少资本积累；较低边际税率有利于鼓励投资和增加资本存量。

#### public_finance_laffer_curve｜拉弗曲线含义
- 来源 public_finance id: [1]
- 候选规则: 拉弗曲线说明税率、税收收入与经济增长之间存在相互制约关系；高税率不一定带来高税收收入，理论上可能存在兼顾收入与增长的最优税率。

#### public_finance_import_tax_types｜进口环节税种
- 来源 public_finance id: [3]
- 候选规则: 进口货物或物品通常征收关税、进口环节增值税，特定消费品征收消费税；营业税不属于进口货物征收税种。

#### public_finance_resource_taxable_resources｜资源税应税资源
- 来源 public_finance id: [5]
- 候选规则: 资源税的应税资源主要包括矿产资源等自然资源，不包括人力资源、风力/水力这类直接能力表述。

#### public_finance_central_local_functions｜中央与地方职能分配
- 来源 public_finance id: [6]
- 候选规则: 中央政府适合承担宏观稳定、收入再分配、跨区域公共事务等职能；消防等地方性公共服务通常由地方政府承担。

#### public_finance_local_public_goods_spillover｜地方公共产品外溢性
- 来源 public_finance id: [8]
- 候选规则: 地方公共产品的成本和收益外溢会影响地方政府供给效率。

#### public_finance_power_responsibility_match｜财权财力与事权匹配
- 来源 public_finance id: [9]
- 候选规则: 中央与地方财权、财力划分应以政府间事权和支出责任划分为依据。

#### public_finance_bank_bond_purchase_monetary_effect｜银行购买公债货币效应
- 来源 public_finance id: [12]
- 候选规则: 银行购买公共债券的货币效应取决于购买对象、资金来源和央行操作等条件，不能一概判断为扩张或紧缩。

#### public_finance_bond_continuous_distribution｜国债连续经销方式
- 来源 public_finance id: [13]
- 候选规则: 政府通过国债经纪人在二级市场连续销售新发债券的方式称为连续经销方式。

#### public_finance_local_government_dual_role｜地方政府财政政策双重角色
- 来源 public_finance id: [14]
- 候选规则: 地方政府既执行国家宏观财政政策，又可制定地方性财政政策。

#### public_finance_automatic_stabilizing_policy｜自动稳定财政政策
- 来源 public_finance id: [15]
- 候选规则: 自动稳定财政政策能随经济波动自动发生稳定作用，不需要临时相机抉择。

#### public_finance_contractionary_policy_tools｜紧缩性财政政策手段
- 来源 public_finance id: [16]
- 候选规则: 紧缩性财政政策通常通过增收节支实现。

#### public_finance_fiscal_imbalance_causes｜财政不平衡原因
- 来源 public_finance id: [17]
- 候选规则: 财政不平衡可能来自国有企业经营状况、意外事件、外部冲击等多种因素。

#### public_finance_fiscal_policy_goals｜财政政策目标
- 来源 public_finance id: [18]
- 候选规则: 财政政策通常追求充分就业、物价稳定、经济增长与公平分配。

#### public_finance_public_expenditure_micro_adjustment｜公共支出微观调节
- 来源 public_finance id: [19]
- 候选规则: 公共支出的微观化调节调整支出项目和项目金额结构，不以改变财政支出总量为目标。

#### public_finance_expansionary_policy_boundary｜扩张性财政政策适用条件
- 来源 public_finance id: [21]
- 候选规则: 扩张性财政政策适用于需求不足时刺激需求；若社会总需求已超过总供给，继续扩张不能恢复供需平衡。

#### public_finance_external_debt_structure｜外债结构
- 来源 public_finance id: [23]
- 候选规则: 外债结构通常包括来源/持有者结构、期限结构、币种结构等，不包括企业意义上的资本结构。

#### public_finance_terms_of_trade_types｜贸易条件类型
- 来源 public_finance id: [24]
- 候选规则: 常见贸易条件包括价格贸易条件、收入贸易条件和要素贸易条件。

#### public_finance_preferential_trade_arrangements｜特惠贸易安排类型
- 来源 public_finance id: [25]
- 候选规则: 特惠贸易安排常见类型包括自由贸易区、关税同盟和共同市场。

#### public_finance_income_distribution_fairness｜收入分配公平两层含义
- 来源 public_finance id: [26]
- 候选规则: 收入分配公平通常包括社会公平与经济公平两个层面。

#### public_finance_stabilization_tools_boundary｜财政稳定经济工具边界
- 来源 public_finance id: [27]
- 候选规则: 财政稳定经济的主要工具包括预算收支政策、内在稳定器和相机抉择政策，不包括发行货币。

#### public_finance_public_finance_functions｜公共财政职能
- 来源 public_finance id: [28]
- 候选规则: 社会主义市场经济下公共财政职能包括优化资源配置、维护市场统一、促进社会公平、实现国家长治久安。

#### public_finance_public_goods_categories｜公共产品类型
- 来源 public_finance id: [30]
- 候选规则: 公共产品类型通常包括纯公共产品、准公共产品和混合产品；“公益产品”不是标准分类。

#### public_finance_public_needs_features｜公共需求特征
- 来源 public_finance id: [31]
- 候选规则: 公共需求是社会公众共同需要，并非个体需求的简单数学加总；其满足一般依靠政府和公共机制，但不意味着成员享用完全无需任何代价。

#### public_finance_market_pricing_fields｜市场定价适用领域
- 来源 public_finance id: [33]
- 候选规则: 竞争性行业应主要采用市场定价；自然垄断和公共事业领域价格常受政府规制。

#### public_finance_debt_scale_factors｜国债规模影响因素
- 来源 public_finance id: [34]
- 候选规则: 国债规模受财政政策选择、财政体制、居民/社会承债能力等影响；“收入集成”不是常规影响因素。

#### public_finance_debt_repayment_ratio｜国债偿还率
- 来源 public_finance id: [10]
- 候选规则: 国债偿还率通常指当年还本付息额占当年财政收入的比重。

#### public_finance_debt_dependency_ratio｜国债依存度
- 来源 public_finance id: [11]
- 候选规则: 国债依存度通常指当年国债发行额占当年财政支出的比例。

#### public_finance_external_debt_liability_ratio｜外债负债率
- 来源 public_finance id: [22]
- 候选规则: 国际通用外债负债率指标通常为当年债务余额占 GNP 的百分比。

#### public_finance_bond_simple_compound_coupon｜国债单利复利票面利率
- 来源 public_finance id: [39]
- 候选规则: 在实际收益率相等时，单利计息国债的票面利率一般不低于复利计息国债的票面利率。

## 暂不落地 / C 类隔离

- id=2：外资再投资退税 100% 属历史税法/制度细枝，强时效。
- id=4/7/20/29/38：reason 或判断含 FinEval 口径，先不进主网。
- id=35/36/37：预算体系/原则/组成是固定制度条文，易随口径变化，先隔离。

## 预期影响

- 主要降低 `public_finance` 的 no_knowledge_hit / low_kappa。
- 可能外溢到 `macroeconomics`、`central_banking`、`monetary_finance`、`international_economics`、`tax_law`，但税法不以硬补为目标。
- 落地后必须跑：`public_finance` 单科回归 + 34 科全局回归。