# China Actuary 规则分级审计 — 2026-05-17

## 结论

- 本文件只做分级审计与候选沉淀，不直接修改 pipeline。
- `china_actuary` 当前 val 为 37/37 = 100%，但原始 need_patch 为 32/37，主要风险来自 calc_not_parsed 和 no_knowledge_hit。
- 与 `statistics` 不同，本科混杂了宏微观经济学、中央银行、精算保险、保险会计、基础会计计算；建议拆成“经济学/金融基础 + 精算保险模板 + 会计模板”三层，不强行塞进单一抽象桶。
- 初判：A 可泛化概念规则 12 条；B 可参数化计算模板 23 条；C 题库/口径补丁 2 条。

## 统计

- 样本数: 37
- 正确数: 37/37
- need_patch: 32/37
- need_patch reasons: calc_not_parsed=23, no_knowledge_hit=12, low_kappa=12
- decision_source: concept_rule=37

## A 可泛化概念规则（12）

- id=1 pred/gold=B/B κ=0.3 need_patch=True
  - reason: Divergent cobweb when supply slope abs is smaller than demand slope abs
  - q: 如果供给曲线和需求曲线都是直线，根据蛛网原理，发散型摆动的条件是____(这里斜率值指的是绝对值)。
- id=2 pred/gold=D/D κ=0.3 need_patch=True
  - reason: Along same indifference curve utility is equal, not marginal utility
  - q: 无差异曲线是用来表示两种商品或两组商品的不同数量的组合给消费者提供的效用是相同的，一般而言，对两种商品形成的无差异曲线不具有以下哪种特征____。
- id=3 pred/gold=A/A κ=0.3 need_patch=True
  - reason: Declining LAC indicates economies of scale
  - q: 当LAC曲线随着产出增加而下降，可能是因为____。
- id=4 pred/gold=C/C κ=0.3 need_patch=True
  - reason: Capital flows toward higher-interest industry until rates equalize
  - q: 假若乙行业的利率低于甲行业的利率，则____。
- id=5 pred/gold=C/C κ=0.3 need_patch=True
  - reason: Partial equilibrium unsuitable for broad corporate income tax, suitable for narrow alcohol tax
  - q: 局部均衡的分析方法不适合估计____变化的影响，但适合估计____变化的影响。
- id=7 pred/gold=B/B κ=0.3 need_patch=True
  - reason: Under rational expectations announced monetary growth raises inflation, not unemployment
  - q: 如果中央银行公开宣布提高货币增长率，根据理性预期的总供给函数，那么____。
- id=8 pred/gold=D/D κ=0.95 need_patch=False
  - reason: Investment demand is generally inversely related to interest rate, not same direction
  - q: 以下关于投资需求的叙述中不正确的是____。
- id=9 pred/gold=C/C κ=0.3 need_patch=True
  - reason: Harrod: actual growth above warranted growth leads to long-run expansion
  - q: 所谓有保证的增长率就是IS均衡条件下的经济增长率 ，也就是哈罗德-多马模型定义的增长率。根据哈罗德分析，如果实际的经济增长率大于有保证的经济增长率，经济将____。
- id=10 pred/gold=D/D κ=0.3 need_patch=True
  - reason: 中央银行发行的银行职能体现为发行货币
  - q: 以下中央银行行为中，体现其“发行的银行”职能的是____。
- id=25 pred/gold=B/B κ=0.95 need_patch=False
  - reason: Financial statement presentation is specific standard content, not basic-standard regulated content
  - q: 我国现行的《企业会计准则》包括基本准则、具体准则和准则指南。内容（受基本准则所规范）不包括____。
- id=26 pred/gold=A/A κ=0.95 need_patch=False
  - reason: Insurance accounting goal emphasizes solvency monitoring
  - q: 保险行业中的特殊性体现在会计目标方面的是____。
- id=33 pred/gold=C/C κ=0.95 need_patch=False
  - reason: Indirect method starts from net profit and is disclosed in notes
  - q: 相对于净利润而言，企业的经营活动现金流量更能反映企业真实的经营成果，经营活动现金流量可以用不同方法在现金流量表中列报，其中以净利润为起算点并以现金流量表附注形式予以披露的方法是____。

## B 可参数化计算模板（23）

- id=6 pred/gold=D/D κ=0.95 need_patch=True
  - reason: GDP=C+I+G+X-M=300+80+96+20-12=484
  - q: 给定C=300亿元，I=80亿元，G=96亿元，X=20亿元，M=12亿元和折旧=40亿元,以下哪项陈述是准确的：____。
- id=11 pred/gold=A/A κ=0.48 need_patch=True
  - reason: Actuarial variance item result is 0.055 by given A-differences
  - q: 已知如下条件：(1)$i=0.02$；(2)$p_{50}=0.98$；(3)$A_{51}-A_{50}=0.004$；(4)$^2A_{51}-^2A_{50}=0.005$，Z为离散型保险保额为1的现值随机变量，则当$x＝51$时，$Var(Z)$等于____。
- id=12 pred/gold=A/A κ=0.95 need_patch=True
  - reason: Uniform-death annuity APV item result: 11317.9
  - q: 假设存在一个退休人员，现年65岁，每月初退休金为100元。已知其在年龄12岁时，他的剩余寿命期望为1.000281年，每个月会有0.46811951的概率去世。而当他已经65岁时，他的剩余寿命期望为9.89693年。在这种均匀死亡的模型下，计算这个退休人员的终生年金精算现值为____。
- id=13 pred/gold=A/A κ=0.3 need_patch=True
  - reason: Premium pi=d*A/(1-A)*10000=0.05*0.19/0.81*10000=117.28
  - q: 终身寿险指保障终身的寿险，无论被保人疾病身故、意外身故、还是自然身故，都可以获得理赔。考虑保额为10000元的全离散式终身寿险。用$\pi$表示该保单的年缴保费，$L(\pi)$表示该保单签发时的保险人亏损随机变量，其中投保年龄为25岁，且$A_{25}=0.19$，$d=0.05$。则当$L(\pi_{a})$的均值为0时，保费$\pi_{a}$等于____。
- id=14 pred/gold=B/B κ=0.3 need_patch=True
  - reason: Given continuous insurance/annuity relation item result: 22
  - q: 已知$1000_t\bar{V}(\bar{A}_{x})=100$；$1000\overline{P}(\overline{A}_{x})=10.50$;$\delta=0.03$,则$\overline{a}_{x+t}$=____。
- id=15 pred/gold=B/B κ=0.95 need_patch=True
  - reason: Property insurance density/rate item result: 30.12
  - q: 假设某财产保险每份保单金额的概率密度函数为：$f(b)=kb^{-3}(b>10)$，其中$b$的单位是千元。若$a=25$, $f=0.15$, $c=12$，则保单费率$R(\sqrt{k})$等于____。
- id=16 pred/gold=B/B κ=0.3 need_patch=True
  - reason: Independent joint-life termination probability in 5-10 years item result: 9/65
  - q: $(x)$的生存函数为$s(x)=\begin{cases}1-\frac{x}{100},&0\le{x}<100\\\quad0,&x\ge100\end{cases}$，假设(35)和(40)的未来生存时间是相互独立的，那么该状态(35: 40)在未来5~10年内终止的概率为____。
- id=17 pred/gold=B/B κ=0.8160000000000001 need_patch=True
  - reason: Double-risk model item result: g(20)=0.024
  - q: 在保险公司经营的过 不仅理赔次数的发生是随机的，理赔额的发生是随机的，而且保费的收入也是随机的。对于一个双风险模型，已知：$\mu_{x+t}^{(1)}=\frac{k}{50-t}$, $0\leq{t}<50$， $\mu_{x+t}^{(2)}=\frac{1}{50-t}$, $0\leq{t}<50$， $h(2|{T}={t})=0.5$,$0\leq{t}<50$。则$g(20)$等于____。
- id=18 pred/gold=D/D κ=0.8640000000000001 need_patch=True
  - reason: Retirement service 40 years: 30*35*12+10*40*12=17400
  - q: 某养老金计划为职工提供养老金如下：当服务期低于30年的，则每服务1年每月给付养老金$b_1=35$元；超过30年工龄的部分，每服务一年每月给付养老金$b_2=40$元。小张现年38岁，他从20岁开始工作，则其60岁退休时的养老金年收入为____元。
- id=19 pred/gold=D/D κ=0.95 need_patch=True
  - reason: Binomial SD=sqrt(100*0.5*0.5)=5
  - q: 在某公司刚刚推出的100个新产品中，成功产品的数量的标准差是多少？假设这些产品的成功概率为50$\%$，并服从二项分布。
- id=20 pred/gold=A/A κ=0.95 need_patch=True
  - reason: Lognormal simulation item result: 27.34
  - q: 已使用Box-Muller方法生成了一个标准正态分布的随机数0.8082，现在需要生成一个代表模拟随机利率的随机数$Y=\sqrt{X}$。其中，$X$服从参数为$\mu=5$，$\sigma^{2}=4$的对数正态分布。请计算得到的随机数为____。
- id=21 pred/gold=B/B κ=0.8160000000000001 need_patch=True
  - reason: Gross premium=(200+15)/(1-0.15-0.05)=268.75
  - q: 假设每一个风险单位的纯保费是200元，固定费用是15元，可变费用的比例是15$\%$，而预期利润附加率是5$\%$，则每一个风险单位的毛保费为____。
- id=22 pred/gold=B/B κ=0.408 need_patch=True
  - reason: Buhlmann credibility estimate item result: 1063
  - q: 已知：(1)赔款额$X$满足：${E[X\mid{u}]=u$, $Var[X\mid{u}]=500}$；(2)随机变量$u$的期望为1000，方差为50；(3)前三起赔案的赔款额分别为：750，1075，2000；用Bühlmann信度方法估计下一赔案的预期赔款额为____。
- id=23 pred/gold=A/A κ=0.3 need_patch=True
  - reason: Bornhuetter-Ferguson reserve is less than 23000
  - q: 给定下面的逐年进展因子：$f_{0-1}=1.41$, $f_{1-2}=1.22$, $f_{2-3}=1.16$, $f_{3-4}=1.08$, $f_{4,\infty}=1.04$，在评估日2021年12月31日，2020事故年的已赚保费为100000元，期望赔付率为0.6，用B-F法计算2020事故年的未决赔款准备金为____。
- id=24 pred/gold=D/D κ=0.95 need_patch=True
  - reason: Surplus reinsurance recoveries: 0, 6, 9.6
  - q: 再保险人与原保险人签署溢额再保险合同，每个风险单位的自留额为6万元，再保险人的分保额为24万元。下面发生了以下索赔事件：风险A的保险金额为5万元，索赔金额为3万元；风险B的保险金额为18万元，索赔金额为9万元；风险C的保险金额为30万元，索赔金额为12万元。请计算再保险人在上述索赔事件中应支付的索赔金额，分别为____万元。
- id=27 pred/gold=C/C κ=0.95 need_patch=True
  - reason: Replacement cost entry=130000*90%=117000
  - q: 某公司在财产清查中盘盈9成新的设备一台，公司同类设备于1年前购买时的单价为10万元，预计使用6年。按当前市场条件，重新购买该设备需支付13万元。公司以重置成本将该设备入账，入账金额为____。
- id=28 pred/gold=A/A κ=0.95 need_patch=True
  - reason: Asset and liability increase simultaneously
  - q: A公司购入机器设备一台，发票价为100000元，机器设备已验收入库但货款尚未支付，该项经济业务对A公司会计等式产生的影响是____。
- id=29 pred/gold=D/D κ=0.95 need_patch=True
  - reason: Short-term loan credit balance=55+30-15=70
  - q: 某公司在本月初时有55万元的短期借款，在本月向银行额外借入了30万元作为短期借款。然后，该公司用银行存款的方式偿还了15万元的短期借款。请计算本月末"短期借款"账户的余额为_____万元。
- id=30 pred/gold=D/D κ=0.95 need_patch=True
  - reason: AR project=debit AR details 45000 + debit advance-receipt details 40000 = 85000
  - q: 某企业“应收账款”科目月末借方金额30000元，其中，“应收A公司账款”明细科目借方金额45000元，“应收B公司账款”明细科目贷方金额15000元；“预收账款”科目月末借方金额30000元，其中，“预收甲工厂账款”明细科目借方金额40000元，“预收乙工厂账款”明细科目贷方金额30000元。则该企业月末资产负债表中“应收账款”项目的金额为____元。
- id=31 pred/gold=D/D κ=0.95 need_patch=True
  - reason: Short-term loan credit balance=65+15-45=35
  - q: 某公司在月初有短期借款金额达到65万元。这个月，他们向银行借入了额外的15万元短期借款。而通过使用银行存款来偿还短期借款的一部分，他们还了45万元。请问在月末，“短期借款”账户上的余额为____万元。
- id=34 pred/gold=A/A κ=0.95 need_patch=True
  - reason: Financing cash flow=15000+10000-25000=0
  - q: A公司2010年度的现金流量表中，反映了公司筹资活动所产生的净现金流量金额为____，其中包括从银行借款15000元并存入银行，通过发行普通股获得10000元现金，以及支付股利25000元。
- id=35 pred/gold=C/C κ=0.95 need_patch=True
  - reason: EPS=(150000-30000)/(70000-10000)=2
  - q: 求A公司每股收益，已知该公司2010年的净利润为150000元，发放给优先股的股利为30000元，该公司发行在外的股数为70000股，其中10000股为优先股，此外每股普通股派发现金股利为0.50元。
- id=36 pred/gold=C/C κ=0.43200000000000005 need_patch=True
  - reason: Sales=10000*7=70000, gross margin=21000/70000=30%
  - q: 假设A公司2009年实现销售毛利21000元，流动资产平均余额为10000元，流动资产周转率为7次，则A公司2009年的销售毛利率为____。

## C 疑似题库口径/硬补丁（2）

- id=0 pred/gold=A/A κ=0.38400000000000006 need_patch=True
  - reason: FinEval item口径 uses forgone wage only: 2000
  - q: 张先生辞去月薪2000元的工作，取出自有存款200000元(月息1$\%$)，办一家独资企业，如果不考虑商业风险，则张先生自办企业按月计算的机会成本是____元。
- id=32 pred/gold=B/B κ=0.95 need_patch=False
  - reason: FinEval口径: debit amount reflects current required reserve exceeding account balance
  - q: 未决赔款准备金账户本月的借项金额反映了____。

## 可沉淀抽象候选

### [A] 蛛网模型发散条件
- 来源 id: [1]
- 候选规则: 供给曲线与需求曲线斜率取绝对值比较时，若供给曲线斜率小于需求曲线斜率，供给对价格反应更强，蛛网模型呈发散型摆动。

### [A] 无差异曲线基本性质
- 来源 id: [2]
- 候选规则: 无差异曲线通常向右下方倾斜、互不相交，离原点越远效用越高；沿同一条无差异曲线总效用相同，但边际效用不必相等。

### [A] 长期平均成本与规模经济
- 来源 id: [3]
- 候选规则: 长期平均成本 LAC 随产出增加而下降，通常表示存在规模经济。

### [A] 资本流动与利润率均等化
- 来源 id: [4]
- 候选规则: 资本倾向于从低利润率/低利率行业流向高利润率/高利率行业，直到行业间收益率趋于均等。

### [A] 局部均衡适用范围
- 来源 id: [5]
- 候选规则: 局部均衡适合分析影响范围较窄的商品税或单一市场冲击，不适合分析公司所得税等广泛影响多个市场的政策。

### [A] 理性预期总供给函数
- 来源 id: [7]
- 候选规则: 中央银行公开宣布提高货币增长率，在理性预期下主要提高预期通胀和实际通胀，失业率不因可预期政策系统性变化。

### [A] 投资需求与利率关系
- 来源 id: [8]
- 候选规则: 投资需求通常与利率反向变动，利率越高，投资项目现值越低，投资需求越弱。

### [A] 哈罗德-多马有保证增长率
- 来源 id: [9]
- 候选规则: 实际增长率高于有保证增长率时，需求扩张和投资加速机制可能导致长期膨胀。

### [A] 中央银行发行的银行职能
- 来源 id: [10]
- 候选规则: 中央银行“发行的银行”职能集中体现为垄断或集中发行货币。

### [A] 保险会计目标：偿付能力
- 来源 id: [26]
- 候选规则: 保险行业财务报告目标具有特殊性，通常更强调偿付能力监测。

### [A] 现金流量表间接法
- 来源 id: [33]
- 候选规则: 间接法以净利润为起点调节到经营活动现金流量，通常在现金流量表附注中披露。

### [B] 支出法 GDP
- 来源 id: [6]
- 候选规则: GDP = C + I + G + X - M；NDP 通常为 GDP - 折旧；净出口为 X-M。

### [B] 二项分布标准差
- 来源 id: [19]
- 候选规则: 若 X~Bin(n,p)，则标准差为 sqrt(np(1-p))。

### [B] 毛保费费用加载公式
- 来源 id: [21]
- 候选规则: 毛保费 = (纯保费 + 固定费用) / (1 - 可变费用率 - 利润附加率)。

### [B] 养老金服务年限分段给付
- 来源 id: [18]
- 候选规则: 分段给付养老金按各工龄区间的月给付额×对应年数×12 汇总。

### [B] 溢额再保险分摊
- 来源 id: [24]
- 候选规则: 溢额再保险按保险金额中超过自留额、且不超过分保限额的比例分摊赔款；低于自留额时再保险人不赔。

### [B] 重置成本按成新率入账
- 来源 id: [27]
- 候选规则: 盘盈固定资产以重置成本计量时，可按当前重置价格×成新率确定入账金额。

### [B] 会计等式影响
- 来源 id: [28, 29, 31]
- 候选规则: 赊购设备使资产增加、负债增加；向银行借款增加负债和银行存款；偿还借款减少负债和银行存款。

### [B] 资产负债表应收账款项目
- 来源 id: [30]
- 候选规则: 应收账款项目通常按应收账款明细借方余额加预收账款明细借方余额列示。

### [B] 筹资活动现金流
- 来源 id: [34]
- 候选规则: 筹资活动净现金流 = 借款流入 + 发行权益流入 - 偿还债务/支付股利等筹资流出。

### [B] 每股收益 EPS
- 来源 id: [35]
- 候选规则: 基本每股收益 = (净利润 - 优先股股利) / 发行在外普通股股数。

### [B] 销售毛利率与周转率
- 来源 id: [36]
- 候选规则: 销售收入 = 流动资产平均余额 × 流动资产周转率；销售毛利率 = 销售毛利 / 销售收入。

### [B] 终身寿险均衡保费模板
- 来源 id: [13]
- 候选规则: 全离散终身寿险净均衡年缴保费可由给定 A_x 和 d 按 π = d·A_x/(1-A_x)·保额计算。

### [B] Bühlmann 信度估计
- 来源 id: [22]
- 候选规则: Bühlmann 估计通常形如 Z·样本均值 + (1-Z)·总体均值，Z 由过程方差和结构方差决定。

## 不建议沉淀项

- id=0：机会成本题按 FinEval 暴露题口径只取放弃工资 2000，未计自有存款月息 2000；标准经济学口径存在争议，应进 C 类黑名单，不进主抽象层。
- id=32：未决赔款准备金账户借项金额描述含保险会计科目口径，报告中带 FinEval 口径提示；除非后续找到教材依据，否则先保留 pipeline/黑名单。