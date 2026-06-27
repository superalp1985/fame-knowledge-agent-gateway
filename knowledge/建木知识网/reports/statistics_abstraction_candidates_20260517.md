# Statistics 抽象层候选清单 — 2026-05-17

## 结论
- statistics 当前 val 35/35 依赖 concept_rule，need_patch 35/35。
- 但审计显示没有明显 C 类题库口径规则；大部分可沉淀为统计学基础概念或公式模板。
- 推荐优先内化本文件，而不是继续在 pipeline 里堆 if。

## A 概念/定义规则（15）
- id=0 pred/gold=D/D κ=0.3
  - rule: Categorical variable: payment method
  - q: 请从下面的选项中，选择一个分类变量____。
- id=3 pred/gold=D/D κ=0.3
  - rule: Conclusion from sample to all phones is inference about population
  - q: 某研究报告写道，“由200部国内外手机组成的样本表明，外国手机的价格明显高于国产手机”。这一结论属于____。
- id=4 pred/gold=B/B κ=0.3
  - rule: Old owner list missing new owners causes sampling-frame error
  - q: 某汽车品牌准备对产品的使用体验进行调研，准备采取抽样调查方式搜集数据。该品牌利用最初的购买名单进行抽样，但车主中有一些将车出售，因此有了新的二手车车主，由此造成的误差属于____。
- id=5 pred/gold=B/B κ=0.3
  - rule: Intercept survey at cafeteria door is convenience sampling
  - q: 100名学生在食堂门口被调查员拦截并接受了问卷调查，以了解他们的消费情况。以下哪个说法是正确的？
- id=7 pred/gold=A/A κ=0.3
  - rule: Secondary data are convenient, fast and low-cost
  - q: 二手数据的特点____。
- id=8 pred/gold=C/C κ=0.3
  - rule: Daily change over time is best shown by line chart
  - q: 一名科学家想要利用图表来显示北京地区自4月份以来每天的二手房租金变化情况。在以下选项中，哪个图形最为适合？
- id=9 pred/gold=B/B κ=0.3
  - rule: Stem-and-leaf plot preserves order and helps quantiles
  - q: 现有200名学生数学课程的成绩，要求出五分之一中位数和中位数，以下____描述统计的办法更有效。
- id=10 pred/gold=A/A κ=0.3
  - rule: Ring chart compares structures across samples/populations
  - q: 统计图是图解分析方法的统计学工具，适合于比较研究两个或多个样本或总体的结构性问题的____。
- id=20 pred/gold=B/B κ=0.3
  - rule: First raw moment is sample mean
  - q: 下面对矩估计法中原点矩和中心矩表述正确的____。
- id=24 pred/gold=A/A κ=0.3
  - rule: Estimator expectation equals parameter is unbiasedness
  - q: 在数理统计中以样本统计量估计总体参数时，要求估计量的数学期望等于被估计的总体参数，这一性质称为____。
- id=26 pred/gold=C/C κ=0.95
  - rule: Confidence level is long-run coverage proportion of intervals
  - q: 99$\%$置信水平的区间估计中99$\%$的置信水平是____。
- id=29 pred/gold=D/D κ=0.3
  - rule: Failing to reject means no evidence H0 is false
  - q: 在假设检验中，不拒绝原假设指____。
- id=32 pred/gold=D/D κ=0.3
  - rule: Contingency table variables can have two or more categories
  - q: 有关列联表中的每个变量的类别，表述正确的是____。
- id=33 pred/gold=B/B κ=0.95
  - rule: For two cells expected frequency should be at least 5
  - q: 利用$\chi^{2}$分布进行独立性检验时，样本容量应充分大，每个单元中的期望频数$fe$不能过小。如果只有两个单元，每个单元的期望频数应当____。
- id=34 pred/gold=A/A κ=0.3
  - rule: Phi coefficient is mainly for 2x2 contingency tables
  - q: $\varphi$相关系数主要使用场景是____。

## B 公式/计算模板（20）
- id=1 pred/gold=A/A κ=0.43200000000000005
  - rule: Population is all IT practitioners
  - q: 一家研究机构从IT从业者中随机抽取300人作为样本进行调查，其中70$\%$回答他们的月收入在5000元以上，60$\%$回答他们的消费支付方式是用信用卡。这里的总体是____。
- id=2 pred/gold=B/B κ=0.3
  - rule: Sample proportion is a statistic value
  - q: 针对对某城市内拥有空调的家庭比例进行估算，我们从500个家庭中抽取了一个样本，结果显示拥有空调的家庭比例为80$\%$。在这种情况下，80$\%$代表了样本得出的一个____。
- id=6 pred/gold=B/B κ=0.3
  - rule: Sampling within age strata is stratified sampling
  - q: 在检验人的血压与年龄之间是否存在近似的线性关系时，对不同年龄段的人群进行随机抽样检测，包括0~20岁、20~30岁、30~40岁、40~50岁、50~60岁和60岁以上的人。这种抽样方法被归类为____。
- id=11 pred/gold=B/B κ=0.8640000000000001
  - rule: Open first class 0-3000 midpoint is about 1500
  - q: 某企业职工的月收入被划分为不同组，分别是3000元以下、3000元～6000元、6000元～9000元、9000元～12000元和12000元以上。请问，第一组的中间值大约是多少？
- id=12 pred/gold=D/D κ=0.95
  - rule: 1000-2000 is mean±1sigma, about 68% of 2000 = 1360
  - q: 某公司共有职工2000名，每月平均工资是1500元，标准差是500元。假定该公司职工的工资服从正态分布，月工资在1000元至2000元之间的职工人数大约为____。
- id=13 pred/gold=D/D κ=0.95
  - rule: Mode 75 means 75 appears most frequently
  - q: 现有一份样本，为100名中学生的IQ分数，由此计算得到以下统计量：样本平均=98，中位数=100，下四分位数=70$，上四分位数=120，众数=75，标准差=30。则关于这100名中学生，下面____项陈述正确。
- id=14 pred/gold=A/A κ=0.3
  - rule: Symmetric bell-shaped distribution has mean=median=mode
  - q: 哪种频数分布状态下平均数、众数和中位数是相等____。
- id=15 pred/gold=C/C κ=0.3
  - rule: Chebyshev outside mean±4sd is at most 1/16≈6.25%
  - q: 如果一组数据不是对称分布,根据切比雪夫不等式,对于$k=4$,其意义为____。
- id=16 pred/gold=C/C κ=0.3
  - rule: P(A and not B)=P(A union B)-P(B)=c-b
  - q: 已知$P(A)=a,P(B)=b,P(A\cupB)=c$，求$P(A\cap\bar{B})$的值____。
- id=17 pred/gold=B/B κ=0.95
  - rule: Sum A/(3^k k!) = A e^(1/3)=1, so A=e^(-1/3)
  - q: 离散型随机变量$\xi$的分布律为$P\{\xi=k\}=\frac{A}{3^{k}\timesk!}$，$k=0,1,2,3,\cdots$，求常数$A$的值为____。
- id=18 pred/gold=D/D κ=0.3
  - rule: Density is N(5,2), standardize by (xi-5)/sqrt(2)
  - q: 设随机变量$\xi$的概率密度为$f(x)=\frac{1}{2\sqrt{\pi}}e^{-\frac{(x-5)^{2}}{4}}(-\infty<x<+\infty)$，则以下哪个统计量服从$N(0,1)$____。
- id=19 pred/gold=B/B κ=0.95
  - rule: CLT: sample mean is normal with mean 16 and SE 5/sqrt(100)=0.5
  - q: 在饭店门口等待出租车的时长是偏左的，平均等待时间是16分钟，标准差为5分钟。随机选择100位顾客并记录他们的等待时间，样本均值的分布遵循____分布。
- id=21 pred/gold=C/C κ=0.3
  - rule: Sampling error proportional to 1/sqrt(n); halve error needs 4n
  - q: 简单随机重复抽样方法被用来选择样本单位，如果想要减少抽样平均误差50$\%$，需要将抽样单位数增加到原单位数的多少倍？
- id=22 pred/gold=D/D κ=0.43200000000000005
  - rule: Variance of sample mean is 900/400=2.25
  - q: 如果从某地区随机抽取400户进行调查，那么调查样本中户平均收入的方差将是多少，而该地区居民收入的方差为900。
- id=23 pred/gold=B/B κ=0.3
  - rule: Smaller deviation/variance means efficiency
  - q: 在参数估计中，要求通过样本的统计量来估计总体参数，评价统计量的标准之一是使它与总体参数的离差越小越好。这种评价标准称为____。
- id=25 pred/gold=C/C κ=0.3
  - rule: Higher alpha means lower confidence and narrower interval
  - q: 如果把$\alpha$从2$\%$升到5$\%$，则置信程度为$1-\alpha$的样本均值的置信区间的宽度____。
- id=27 pred/gold=B/B κ=0.95
  - rule: Test exceeding 1 minute: H0 mu<=1, H1 mu>1
  - q: 某航空公司分析得到销售一张机票的平均时间为1分钟。抽取一个由十名顾客购买机票使用时间组成的随机样本，结果为：0.9，0.7，2.8，1.4，1.6，1.5，1.8，3.2，1.6，2.5分钟。在$\alpha=0.01$的显著性水平下，检验平均售票时间是否超过1分钟，建立的原假设和备择假设____。
- id=28 pred/gold=A/A κ=0.95
  - rule: Accept at 0.01 may accept or reject at 0.05
  - q: 对正态总体的数学期望$\mu$进行假设检验，若在显著水平0.01下接受$H_{0}:\mu=\mu_{0}$，那么在显著水平0.05下，下列结论正确的____。
- id=30 pred/gold=B/B κ=0.95
  - rule: If H0 likely true and type II cost small, use smaller alpha
  - q: 在假设检验中，如果我们相信原假设是真的，而犯第二类错误影响不大，此时，检验的显著性水平应该____。
- id=31 pred/gold=D/D κ=0.3
  - rule: Chi-square df=(4-1)(5-1)=12
  - q: 如果列联表的行数为4，列数为5，那么$\chi^{2}$检验会有多少个自由度？

## 建议落地方式
1. 新增 `statistics` 抽象节点：变量类型、总体/样本/统计量/参数、抽样误差、抽样方法、二手数据、图表选择。
2. 新增 `statistics_formula_templates`：正态分布经验法则、切比雪夫、样本量与误差、样本均值方差、置信水平/显著性、卡方列联表自由度。
3. pipeline 中保留 rule 作为兜底，但 route_index/knowledge hit 应先命中这些节点，目标是把 statistics need_patch 从 35/35 降到低位。
