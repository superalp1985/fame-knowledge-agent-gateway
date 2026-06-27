# Statistics 抽象层 patch preview — 2026-05-17

## 定位

本文件是预案，不直接修改 `rules/`、`route_index.json` 或 pipeline。

目标：把 `statistics` 当前 35/35 的 concept_rule 兜底，拆成可泛化的抽象层规则，降低对 pipeline if 的依赖。

来源：
- `reports/statistics_abstraction_candidates_20260517.md`
- `leaderboard_runs/global_regression_20260516/statistics_val.jsonl`

## 建议新增规则桶

### 1. 统计学基础概念

#### stat_abs_variable_type_categorical｜分类变量
分类变量用于表示类别或属性，而非可加减乘除的数量。支付方式、性别、品牌、地区等属于分类变量。判断题中若选项是付款方式/类别标签，优先判为分类变量。

#### stat_abs_population_sample_statistic_parameter｜总体、样本、统计量与参数
总体是研究对象的全体；样本是从总体中抽取的部分；由样本计算出的比例、均值、方差等称为统计量；描述总体真实特征的数值称为参数。样本比例/样本均值不是总体参数。

#### stat_abs_inference_population｜由样本推断总体
用样本观察结果对总体作结论，属于统计推断。题干若说“由若干样本表明全部/整体对象如何”，核心是从样本推断总体。

#### stat_abs_sampling_frame_error｜抽样框误差
抽样框未覆盖目标总体或包含错误对象会导致抽样框误差。例如用旧购买名单抽样但部分车主已转卖，名单缺失新车主，属于抽样框误差。

#### stat_abs_convenience_sampling｜方便抽样
在食堂门口、街头、课堂门口等便于接触的位置拦截调查对象，通常属于方便抽样，代表性较弱。

#### stat_abs_stratified_sampling｜分层抽样
先按年龄段、地区、收入层等特征把总体分层，再在各层内随机抽样，属于分层抽样。

#### stat_abs_secondary_data｜二手数据特点
二手数据通常具有获取方便、速度快、成本低的优点，但适配性和准确性需另行评估。

#### stat_abs_chart_selection｜统计图选择
时间序列变化适合折线图；结构占比比较可用环形图/饼图；需要保留数据顺序并观察分位数时，茎叶图比简单汇总表更有信息。

#### stat_abs_estimator_properties｜估计量性质
估计量的数学期望等于被估总体参数称为无偏性；估计量与总体参数离差越小，通常体现有效性/效率更好。

#### stat_abs_hypothesis_test_interpretation｜假设检验解释
不拒绝原假设只表示样本证据不足以否定原假设，并不等于证明原假设为真。显著性水平越小，拒绝原假设越谨慎。

#### stat_abs_contingency_table｜列联表与相关系数
列联表中的变量可以有两个或多个类别；2×2列联表常用 φ 相关系数；卡方独立性检验要求期望频数不能过小，两个单元时每个单元期望频数通常至少为 5。

---

### 2. 统计学公式模板

#### stat_tpl_group_midpoint｜组中值
组中值通常取组下限与组上限的平均数。开口组若第一组为“3000 元以下”，且相邻组距为 3000，可近似取 0—3000 的中点 1500。

#### stat_tpl_normal_empirical_rule｜正态分布经验法则
正态分布下，均值 ±1 个标准差约覆盖 68% 的个体，均值 ±2 个标准差约覆盖 95%，均值 ±3 个标准差约覆盖 99.7%。人数 = 总人数 × 覆盖比例。

#### stat_tpl_mode_mean_median｜众数、均值、中位数
众数是出现次数最多的数值；对称钟形分布中，均值、中位数、众数通常相等。

#### stat_tpl_chebyshev｜切比雪夫不等式
任意分布中，落在均值 ±k 个标准差之外的比例最多为 1/k²；落在区间内的比例至少为 1-1/k²。k=4 时区间外最多 6.25%。

#### stat_tpl_probability_set｜概率集合公式
P(A∩非B)=P(A)-P(A∩B)。若已知 P(A∪B)=c、P(B)=b 且题目结构给出 A 包含关系口径，可化为 c-b；一般情况下应先由 P(A∪B)=P(A)+P(B)-P(A∩B) 求交集。

#### stat_tpl_discrete_distribution_normalization｜离散分布归一化
离散分布律的概率和必须等于 1。若 P(X=k)=A/(3^k k!)，k=0,1,...，则 Σ1/(3^k k!)=e^(1/3)，所以 A=e^(-1/3)。

#### stat_tpl_normal_standardization｜正态标准化
若 X~N(μ,σ²)，则 Z=(X-μ)/σ~N(0,1)。密度中 exp[-(x-μ)^2/(2σ²)] 可读出均值和方差。

#### stat_tpl_clt_sample_mean｜中心极限定理与样本均值
样本量足够大时，样本均值近似服从正态分布，均值为总体均值 μ，标准误为 σ/√n。

#### stat_tpl_sampling_error_n｜抽样误差与样本量
简单随机抽样中，抽样平均误差通常与 1/√n 成正比。误差降低 50% 需要样本量扩大到 4 倍。

#### stat_tpl_sample_mean_variance｜样本均值方差
独立同分布样本均值的方差为总体方差/n。例如总体方差 900，样本量 400，则样本均值方差为 900/400=2.25。

#### stat_tpl_confidence_alpha｜置信水平与 α
置信水平为 1-α。α 升高意味着置信水平降低，临界值变小，其他条件相同时置信区间变窄。99% 置信水平表示长期重复抽样中约 99% 的置信区间覆盖真实参数。

#### stat_tpl_one_sided_test｜单侧假设检验
检验均值是否超过某值时，原假设通常写作 H0: μ≤μ0，备择假设写作 H1: μ>μ0。

#### stat_tpl_alpha_nested｜显著性水平嵌套
在较小显著性水平下不拒绝 H0，并不能推出在较大显著性水平下一定不拒绝；因为较大 α 的拒绝域更宽。

#### stat_tpl_chi_square_df｜卡方列联表自由度
r 行 c 列列联表的卡方独立性检验自由度为 (r-1)(c-1)。例如 4 行 5 列，自由度为 12。

## 路由建议

新增 `manual_abstract_route` 时，建议：

- subject: `统计学`
- type: `manual_abstract_route`
- priority: 1.6—1.8
- negative_keywords: 暂不需要复杂负关键词，先避免过拟合
- content: 使用上方 law 原文

## 风险提示

- `stat_tpl_probability_set` 需要谨慎：val 题里 c-b 成立，但一般概率集合公式不能无条件化简为 c-b。落地时必须保留边界说明。
- `组中值` 的开口组中点是教材常见近似，不是严格数学定理；应标注“近似/按组距推断”。
- 本 patch preview 不包含任何 C 类黑名单条目。

## 建议下一步

1. 先手工确认本 preview 的概念是否允许进入主知识网。
2. 若确认，再写 `build_statistics_abstract_patch.py`，仿照 `build_accounting_abstract_patch.py`：备份、merge rules、merge routes、写 first_order associations。
3. 落地后跑 statistics 单科回归，再跑 34 科全局回归，验证不破坏现有 100%。
