# Public Finance 规则分级审计 — 2026-05-17

## 结论

- 本文件只做分级审计与候选沉淀，不直接修改 pipeline。
- `public_finance` 当前 40/40 = 100%，need_patch 为 11/40；宏观 patch 已将其从 14 降到 11。
- 初判：A 可泛化财政学规则 27 条；B 可参数化比率/计息模板 4 条；C 题库口径/制度细枝/硬补丁 9 条。
- C 类不进入主抽象层，尤其旧税法退税比例、FinEval口径、预算构成固定条文等。

## 统计

- 样本数: 40
- 正确数: 40/40
- need_patch: 11/40
- need_patch reasons: calc_not_parsed=1, no_knowledge_hit=10, low_kappa=10
- decision_source: concept_rule=40

## A 可泛化财政学规则（27）

- id=0 pred/gold=B/B κ=0.95 need_patch=False
  - reason: Supply-side tax view: high marginal tax rates hinder investment; low rates encourage investment
  - q: 供给学派税收观点的一个基础命题是什么？
- id=1 pred/gold=D/D κ=0.95 need_patch=False
  - reason: Laffer curve rejects the claim that high tax rates necessarily bring high tax revenue
  - q: 请指出，在拉弗曲线中，没有包含的经济含义是____。
- id=3 pred/gold=C/C κ=0.95 need_patch=False
  - reason: Business tax is not levied on imported goods/items
  - q: 我国在进口货物或物品时，哪种税不进行征收。
- id=5 pred/gold=B/B κ=0.95 need_patch=False
  - reason: Taxable resources include mineral resources
  - q: 下列资源中，属于我国资源税的应税资源有____。
- id=6 pred/gold=C/C κ=0.3 need_patch=True
  - reason: Firefighting is local public service, not central government function
  - q: 中央政府或国家政府是国家全国事务主管机构的总称，联邦制国家的中央政府，即称“联邦政府”。按照政府间职能分配的原则，以下职能中不应由中央政府承担的是____。
- id=8 pred/gold=A/A κ=0.408 need_patch=False
  - reason: Spillover of local public-product costs/benefits affects efficiency
  - q: 地方政府在提供地方公共产品的效率受多方因素影响。以下问题中会影响其效率的是____。
- id=9 pred/gold=B/B κ=0.95 need_patch=False
  - reason: Fiscal power division follows division of governmental responsibilities
  - q: 划分中央与地方财力和财权大小的根据是____。
- id=12 pred/gold=D/D κ=0.3 need_patch=True
  - reason: Monetary effect of banks buying public bonds is uncertain
  - q: 银行购买公共债券的货币效应是____。
- id=13 pred/gold=D/D κ=0.3 need_patch=True
  - reason: Selling new bonds via brokers in secondary market is continuous distribution
  - q: 政府通过国债经纪人将新发的债券在二级市场上直接销售的方法，叫做____。
- id=14 pred/gold=B/B κ=0.95 need_patch=False
  - reason: Local governments execute national macro fiscal policy and make local fiscal policy
  - q: 在中国当前的市场经济条件下，____既是国家宏观财政政策的执行者，也是地方性财政政策的制定者。
- id=15 pred/gold=C/C κ=0.95 need_patch=False
  - reason: Automatic stabilizing fiscal policy works without discretionary intervention
  - q: 在现代市场经济条件下，财政政策又是国家干预经济，实现宏观经济目标的工具。国家能根据经济的波动情况自动发生稳定作用，无须借助外力就可直接产生调控效果的财政政策是____。
- id=16 pred/gold=A/A κ=0.408 need_patch=False
  - reason: Contractionary fiscal policy uses revenue increase and expenditure cut
  - q: 财政政策分为紧缩性财政政策和扩张性财政政策，其中前者主要是通过财政的____手段实现的。
- id=17 pred/gold=D/D κ=0.3 need_patch=True
  - reason: Fiscal imbalance can result from SOE conditions, accidents, and external shocks
  - q: 下列选项中，国家财政不平衡的主要原因包括____。
- id=18 pred/gold=B/B κ=0.408 need_patch=False
  - reason: Fiscal policy goals: full employment, price stability, growth, fair distribution
  - q: 我国的财政政策主要追求的目标是什么？
- id=19 pred/gold=D/D κ=0.84 need_patch=False
  - reason: Micro adjustment of public expenditure does not change total fiscal expenditure
  - q: 公共支出是西方学者对资本主义国家财政支出的称谓。因资本主义国家的财政支出涉及中央政府、地方政府和公共法人组织等"公共部门"而得名，公共支出的微观化调节的是政府支出项目和各项目的数额，并不是要变动____总量。
- id=21 pred/gold=C/C κ=0.408 need_patch=False
  - reason: If aggregate demand already exceeds supply, expansionary fiscal policy will not restore balance
  - q: 关于扩张性财政政策说法错误的是____。
- id=23 pred/gold=B/B κ=0.38400000000000006 need_patch=False
  - reason: External debt structure excludes capital structure
  - q: 下列选项中不属于外债结构的是____。
- id=24 pred/gold=A/A κ=0.95 need_patch=False
  - reason: Common terms of trade: price, income, factor terms
  - q: 贸易条件是用来衡量在一定时期内一个国家出口相对于进口的盈利能力和贸易利益的指标，反映该国的对外贸易状况，一般以贸易条件指数表示，在双边贸易中尤其重要。常用的贸易条件有____。
- id=25 pred/gold=C/C κ=0.3 need_patch=True
  - reason: Preferential trade arrangements: FTA, customs union, common market
  - q: 下列选项中符合特惠贸易安排类型的是____。
- id=26 pred/gold=C/C κ=0.43200000000000005 need_patch=False
  - reason: Income distribution fairness includes social fairness and economic fairness
  - q: 关于收入分配公平的两层含义分别是____。
- id=27 pred/gold=D/D κ=0.408 need_patch=False
  - reason: Fiscal stabilization tools do not include issuing currency
  - q: 财政稳定经济的主要工具不包括____。
- id=28 pred/gold=B/B κ=0.95 need_patch=False
  - reason: Public finance functions: optimize resource allocation, maintain market unity, promote fairness, long-term stability
  - q: 社会主义市场经济下的公共财政职能主要包括____。
- id=30 pred/gold=D/D κ=0.3 need_patch=True
  - reason: Public-product categories do not include public-welfare product as separate type
  - q: 下列产品类型不属于公共产品的是____。
- id=31 pred/gold=A/A κ=0.3 need_patch=True
  - reason: Public needs do not imply members enjoy without paying any price
  - q: 下列不属于公共需求特征的是____。
- id=32 pred/gold=A/A κ=0.95 need_patch=False
  - reason: Interest/dividend income taxable amount is each receipt
  - q: 在个人所得税的征税范围内，与股息、红利和利息有关的所得应纳税所得额是____。
- id=33 pred/gold=D/D κ=0.408 need_patch=False
  - reason: Clothing industry should use market pricing
  - q: 以下各领域中，应当采用市场定价的是____。
- id=34 pred/gold=B/B κ=0.95 need_patch=False
  - reason: Income integration is not a factor affecting government bond scale
  - q: 影响国债规模的因素不包括____。

## B 可参数化比率/计息模板（4）

- id=10 pred/gold=C/C κ=0.95 need_patch=False
  - reason: Debt repayment ratio = current-year principal+interest / current-year fiscal revenue
  - q: 国家债务的偿还率是指____。
- id=11 pred/gold=C/C κ=0.84 need_patch=False
  - reason: Debt dependency = current-year government bond issuance / current-year fiscal expenditure
  - q: 国债依存度指的是____。
- id=22 pred/gold=D/D κ=0.95 need_patch=False
  - reason: External debt liability ratio = debt balance / GNP
  - q: 国际上通用的衡量外债的负债率指标是____。
- id=39 pred/gold=D/D κ=0.95 need_patch=False
  - reason: At same effective yield, simple-interest nominal coupon is not lower than compound-interest coupon
  - q: 关于国债利率的表述错误的是____。

## C 题库口径/制度细枝/硬补丁（9）

- id=2 pred/gold=D/D κ=0.48 need_patch=True
  - reason: Reinvestment tax refund ratio item: 100%
  - q: 外国投资者将从企业分得的利润，在中国境内再投资举办、扩建产品出口企业或先进企业，并且经营期不少于5年的情况下，按规定，应根据____比例退还其再投资部分已纳所得税税款。
- id=4 pred/gold=A/A κ=0.95 need_patch=False
  - reason: FinEval口径 selects liquor for specific-unit consumption tax
  - q: 消费税计税依据采取从价定率和从量定额两种计算方法，因此，下列项目中采用从量定额征税的是____。
- id=7 pred/gold=C/C κ=0.95 need_patch=False
  - reason: FinEval口径: local borrowing for local infrastructure is local-government function
  - q: 下列哪一项是地方政府应承担的职能____。
- id=20 pred/gold=A/A κ=0.95 need_patch=False
  - reason: FinEval口径 selects currency issuance as fiscal-policy tool; caution
  - q: 财政政策工具是指国家为实现一定财政政策目标而采取的各种财政手段和措施，它主要包括____。
- id=29 pred/gold=B/B κ=0.95 need_patch=False
  - reason: FinEval口径: providing public goods/services as most important allocation mode is not listed feature
  - q: 公共财政隶属于社会市场经济，其特点不包括____。
- id=35 pred/gold=A/A κ=0.3 need_patch=True
  - reason: Budget system is based on state power structure, administrative division and fiscal management system
  - q: 国家预算体系是在____基础上形成的国家预算组织结构。
- id=36 pred/gold=C/C κ=0.3 need_patch=True
  - reason: Government budget principles follow guiding ideology and policy
  - q: 政府预算原则是指国家制定施政方针和社会经济政策，规定政府活动的范围和方向应遵循的____。
- id=37 pred/gold=D/D κ=0.3 need_patch=True
  - reason: Budgets: public finance, government fund, state capital operation, social security
  - q: 我国各级政府预算的组成构成于____。
- id=38 pred/gold=D/D κ=0.38400000000000006 need_patch=False
  - reason: FinEval口径: preferential tax expenditure to legislative organ
  - q: 照顾性税收支出给____。

## 可沉淀抽象候选

### [A] 供给学派税收观点
- 来源 id: [0]
- 候选规则: 供给学派认为高边际税率会阻碍物质资本和人力资本投资、减少资本积累；较低边际税率有利于鼓励投资和增加资本存量。

### [A] 拉弗曲线含义
- 来源 id: [1]
- 候选规则: 拉弗曲线说明税率、税收收入与经济增长之间存在相互制约关系；高税率不一定带来高税收收入，理论上可能存在兼顾收入与增长的最优税率。

### [A] 进口环节税种
- 来源 id: [3]
- 候选规则: 进口货物或物品通常征收关税、进口环节增值税，特定消费品征收消费税；营业税不属于进口货物征收税种。

### [A] 资源税应税资源
- 来源 id: [5]
- 候选规则: 资源税的应税资源主要包括矿产资源等自然资源，不包括人力资源、风力/水力这类直接能力表述。

### [A] 中央与地方职能分配
- 来源 id: [6]
- 候选规则: 中央政府适合承担宏观稳定、收入再分配、跨区域公共事务等职能；消防等地方性公共服务通常由地方政府承担。

### [A] 地方公共产品外溢性
- 来源 id: [8]
- 候选规则: 地方公共产品的成本和收益外溢会影响地方政府供给效率。

### [A] 财权财力与事权匹配
- 来源 id: [9]
- 候选规则: 中央与地方财权、财力划分应以政府间事权和支出责任划分为依据。

### [A] 银行购买公债货币效应
- 来源 id: [12]
- 候选规则: 银行购买公共债券的货币效应取决于购买对象、资金来源和央行操作等条件，不能一概判断为扩张或紧缩。

### [A] 国债连续经销方式
- 来源 id: [13]
- 候选规则: 政府通过国债经纪人在二级市场连续销售新发债券的方式称为连续经销方式。

### [A] 地方政府财政政策双重角色
- 来源 id: [14]
- 候选规则: 地方政府既执行国家宏观财政政策，又可制定地方性财政政策。

### [A] 自动稳定财政政策
- 来源 id: [15]
- 候选规则: 自动稳定财政政策能随经济波动自动发生稳定作用，不需要临时相机抉择。

### [A] 紧缩性财政政策手段
- 来源 id: [16]
- 候选规则: 紧缩性财政政策通常通过增收节支实现。

### [A] 财政不平衡原因
- 来源 id: [17]
- 候选规则: 财政不平衡可能来自国有企业经营状况、意外事件、外部冲击等多种因素。

### [A] 财政政策目标
- 来源 id: [18]
- 候选规则: 财政政策通常追求充分就业、物价稳定、经济增长与公平分配。

### [A] 公共支出微观调节
- 来源 id: [19]
- 候选规则: 公共支出的微观化调节调整支出项目和项目金额结构，不以改变财政支出总量为目标。

### [A] 扩张性财政政策适用条件
- 来源 id: [21]
- 候选规则: 扩张性财政政策适用于需求不足时刺激需求；若社会总需求已超过总供给，继续扩张不能恢复供需平衡。

### [A] 外债结构
- 来源 id: [23]
- 候选规则: 外债结构通常包括来源/持有者结构、期限结构、币种结构等，不包括企业意义上的资本结构。

### [A] 贸易条件类型
- 来源 id: [24]
- 候选规则: 常见贸易条件包括价格贸易条件、收入贸易条件和要素贸易条件。

### [A] 特惠贸易安排类型
- 来源 id: [25]
- 候选规则: 特惠贸易安排常见类型包括自由贸易区、关税同盟和共同市场。

### [A] 收入分配公平两层含义
- 来源 id: [26]
- 候选规则: 收入分配公平通常包括社会公平与经济公平两个层面。

### [A] 财政稳定经济工具边界
- 来源 id: [27]
- 候选规则: 财政稳定经济的主要工具包括预算收支政策、内在稳定器和相机抉择政策，不包括发行货币。

### [A] 公共财政职能
- 来源 id: [28]
- 候选规则: 社会主义市场经济下公共财政职能包括优化资源配置、维护市场统一、促进社会公平、实现国家长治久安。

### [A] 公共产品类型
- 来源 id: [30]
- 候选规则: 公共产品类型通常包括纯公共产品、准公共产品和混合产品；“公益产品”不是标准分类。

### [A] 公共需求特征
- 来源 id: [31]
- 候选规则: 公共需求是社会公众共同需要，并非个体需求的简单数学加总；其满足一般依靠政府和公共机制，但不意味着成员享用完全无需任何代价。

### [A] 市场定价适用领域
- 来源 id: [33]
- 候选规则: 竞争性行业应主要采用市场定价；自然垄断和公共事业领域价格常受政府规制。

### [A] 国债规模影响因素
- 来源 id: [34]
- 候选规则: 国债规模受财政政策选择、财政体制、居民/社会承债能力等影响；“收入集成”不是常规影响因素。

### [B] 国债偿还率
- 来源 id: [10]
- 候选规则: 国债偿还率通常指当年还本付息额占当年财政收入的比重。

### [B] 国债依存度
- 来源 id: [11]
- 候选规则: 国债依存度通常指当年国债发行额占当年财政支出的比例。

### [B] 外债负债率
- 来源 id: [22]
- 候选规则: 国际通用外债负债率指标通常为当年债务余额占 GNP 的百分比。

### [B] 国债单利复利票面利率
- 来源 id: [39]
- 候选规则: 在实际收益率相等时，单利计息国债的票面利率一般不低于复利计息国债的票面利率。

## 不建议沉淀项

- id=2：外资再投资退税 100% 属历史税法/制度细枝，强时效。
- id=4/7/20/29/38：reason 或判断含 FinEval 口径，先不进主网。
- id=35/36/37：预算体系/原则/组成是固定制度条文，易随口径变化，先隔离。