# 建木知识网样板挂树 v0.1（2026-05-20）

> 本文是层级化重构的第一批样板模块。目的不是继续适配上财题，而是把已有知识点蒸馏成可泛化的学科结构。

## 0. 通用节点格式

```yaml
id: <stable.node.id>
name: <知识节点名>
path: [学科, 模块, 上位概念, 子概念]
type: formula | definition | regulation | concept | procedure | exception | question_pattern
content: <通用知识>
applies_when: []
not_applies_when: []
pitfalls: []
related: []
question_patterns: []
examples: []
exceptions: []
source_routes: []
```

---

# 1. 样板模块：金融学 / 投资学 / 资产定价

## 1.1 上位结构

```text
金融学
└─ 投资学
   └─ 资产定价
      ├─ 风险收益关系
      ├─ CAPM / 证券市场线
      ├─ beta 与系统性风险
      ├─ alpha 与异常收益
      ├─ 股利折现模型
      ├─ 债券定价与收益率
      └─ 衍生品定价与套利边界
```

## 1.2 节点：CAPM

```yaml
id: finance.investments.asset_pricing.capm
name: 资本资产定价模型
path: [金融学, 投资学, 资产定价, CAPM]
type: formula
content: 资产的必要收益率/预期收益率由无风险利率、市场风险溢价与 beta 决定。
formula: E(R_i)=R_f+β(E(R_m)-R_f)
applies_when:
  - 题干给出无风险利率、市场收益率、beta，问必要收益率或预期收益率
  - 题干出现 CAPM、证券市场线、市场风险溢价、系统性风险
not_applies_when:
  - 题干问历史持有期收益率或实际收益率
  - 题干给出题库特殊口径且与标准公式冲突
pitfalls:
  - 百分数需统一单位
  - beta=1 且 alpha=0 时收益率等于市场组合收益率
  - 问“不正确的是”时应反向判定
related:
  - beta
  - 证券市场线
  - 风险溢价
  - alpha
question_patterns:
  - 根据CAPM计算必要收益率
  - 已知无风险收益率、市场收益率和β
  - 判断证券市场线/风险收益关系
exceptions:
  - 标准公式与题库 gold 冲突时，不进入通用公式层；仅作为 exception 记录
```

## 1.3 节点：固定增长股利折现模型

```yaml
id: finance.investments.asset_pricing.gordon_growth
name: 固定增长股利折现模型
path: [金融学, 投资学, 资产定价, 股利折现模型]
type: formula
content: 稳定增长股票价值等于下一期股利除以必要收益率与增长率之差。
formula: P0 = D1 / (r - g)
applies_when:
  - 题干给出下一期股利或当前股利与增长率
  - 问股票内在价值、最高买价、合理价格
pitfalls:
  - 若给当前股利D0，需先算D1=D0(1+g)
  - r 必须大于 g
related:
  - DCF
  - 留存收益增长率
  - ROE
```

## 1.4 节点：债券定价与久期

```yaml
id: finance.investments.bond_pricing.duration
name: 债券久期与利率敏感性
path: [金融学, 投资学, 债券定价与久期, 久期]
type: formula
content: 债券价格与收益率反向变动；久期/修正久期衡量价格对收益率变化的敏感性。
formula: ΔP/P ≈ -D_mod × Δy
applies_when:
  - 题干问收益率变动导致债券价格变化
  - 题干给出久期、修正久期、到期收益率变化
pitfalls:
  - 收益率上升价格下降，收益率下降价格上升
  - bp 需换算为小数
  - 久期近似与精确定价区分
related:
  - 到期收益率
  - 附息债券
  - 零息债券
```

## 1.5 节点：期权平价与套保

```yaml
id: finance.derivatives.option_parity_hedging
name: 期权平价与套期保值
path: [金融学, 投资学, 衍生品与期权, 套利边界]
type: formula
content: 欧式看涨、看跌、标的资产与无风险债券之间存在无套利平价关系；期权可用于构建套保组合。
applies_when:
  - 题干出现欧式期权平价、看涨/看跌、执行价格、现值、无风险利率
  - 题干问套保、delta、中性组合、保本价
pitfalls:
  - 题干口径可能区分连续复利/离散复利
  - 多个选项共享相同数字时，不能只靠数字抽取
```

---

# 2. 样板模块：金融监管与从业资格 / 商业银行风险管理

## 2.1 上位结构

```text
金融监管与从业资格
└─ 银行业从业
   └─ 商业银行风险管理
      ├─ 资本充足与风险覆盖
      ├─ 信用风险与贷款流程
      ├─ 关联交易与授信集中度
      ├─ 市场风险与敏感性测试
      ├─ 流动性与偿债能力分析
      └─ 合格投资者与理财监管
```

## 2.2 节点：资本充足与风险覆盖

```yaml
id: banking.risk.capital_adequacy.coverage
name: 资本充足与风险覆盖
path: [金融监管与从业资格, 银行业从业, 商业银行风险管理, 资本充足]
type: concept
content: 商业银行资本是否充分覆盖风险，取决于资本数量与面临的实际风险水平，即资本充足率的分子和分母两端。
applies_when:
  - 题干出现资本充足率、资本净额、风险加权资产、风险覆盖
related:
  - 资本净额
  - 风险加权资产
  - 资本充足率
question_patterns:
  - 资本能否充分覆盖风险取决于什么
```

## 2.3 节点：关联授信比例

```yaml
id: banking.risk.related_party_credit.ratio
name: 关联授信比例
path: [金融监管与从业资格, 银行业从业, 商业银行风险管理, 关联交易与授信集中度]
type: regulation
content: 商业银行对全部关联方的授信余额通常以资本净额的一定比例为监管限制；题库中常见口径为50%。
applies_when:
  - 题干给出全部关联方授信总额与资本净额
  - 题干问所有关联方授信余额限制
pitfalls:
  - 分子为关联方授信余额，分母为资本净额
  - 个别关联方与全部关联方比例限制需区分
```

## 2.4 节点：贷款发放流程

```yaml
id: banking.credit.loan_disbursement.process
name: 贷款发放流程
path: [金融监管与从业资格, 银行业从业, 商业银行风险管理, 信用风险与贷款流程]
type: procedure
content: 贷款发放通常按借款人提交提款申请及资料、银行受理、发放审查、内部审批签字、提交凭证办理提款的顺序进行。
question_patterns:
  - 贷款发放操作程序排序
  - 提款申请、贷款发放审查、内部审批
pitfalls:
  - 排序题应按流程链路判断，不按关键词局部匹配
```

## 2.5 节点：5C 信用分析

```yaml
id: banking.credit.analysis.5c
name: 5C 信用分析原则
path: [金融监管与从业资格, 银行业从业, 商业银行风险管理, 信用风险与贷款流程]
type: concept
content: 银行调查人员初次面谈时可按国际信用5C标准集中获取客户相关信息。
question_patterns:
  - 初次面谈
  - 国际信用5C
related:
  - 信用风险
  - 客户调查
```

---

# 3. 样板模块：会计学 / 财务会计 / 资产

## 3.1 上位结构

```text
会计学
└─ 财务会计
   └─ 资产
      ├─ 存货
      ├─ 固定资产
      ├─ 投资性房地产
      ├─ 无形资产
      ├─ 长期股权投资
      ├─ 金融资产
      └─ 资产减值
```

## 3.2 节点：无形资产入账价值

```yaml
id: accounting.assets.intangible.initial_measurement
name: 无形资产初始计量
path: [会计学, 财务会计, 资产, 无形资产]
type: concept
content: 外购无形资产成本包括购买价款、相关税费以及直接归属于使该资产达到预定用途的其他支出；广告费、员工培训费通常不计入无形资产成本。
applies_when:
  - 题干给出外购专利权、分期付款、相关税费、注册费、广告费、培训费
pitfalls:
  - 分期付款具有融资性质时，应按现值入账
  - 广告费和培训费通常费用化
related:
  - 现值
  - 年金现值系数
```

## 3.3 节点：投资性房地产模式转换

```yaml
id: accounting.assets.investment_property.measurement_model_change
name: 投资性房地产后续计量模式转换
path: [会计学, 财务会计, 资产, 投资性房地产]
type: concept
content: 投资性房地产从成本模式转为公允价值模式，通常按会计政策变更处理，公允价值与账面价值差额调整期初留存收益。
applies_when:
  - 题干出现投资性房地产、成本模式、公允价值模式、期初未分配利润
pitfalls:
  - 注意是否考虑所得税
  - 留存收益内部还需区分盈余公积和未分配利润
```

## 3.4 节点：长期股权投资权益法

```yaml
id: accounting.assets.long_term_equity_investment.equity_method
name: 长期股权投资权益法
path: [会计学, 财务会计, 资产, 长期股权投资]
type: concept
content: 对联营企业或合营企业具有重大影响时通常采用权益法；初始投资成本与享有可辨认净资产公允价值份额比较，后续按被投资单位调整后净利润确认投资收益。
applies_when:
  - 题干出现重大影响、联营企业、权益法、可辨认净资产公允价值
pitfalls:
  - 初始投资成本低于份额时确认营业外收入
  - 被投资单位资产公允价值与账面价值不同需调整净利润
  - 内部交易与所得税题需另行处理
```

## 3.5 节点：资产减值

```yaml
id: accounting.assets.impairment.recoverable_amount
name: 资产减值与可收回金额
path: [会计学, 财务会计, 资产, 资产减值]
type: concept
content: 资产可收回金额为公允价值减处置费用后的净额与预计未来现金流量现值两者较高者；账面价值高于可收回金额时确认减值损失。
applies_when:
  - 题干给出账面价值、公允价值减处置费用、未来现金流量现值
pitfalls:
  - 无形资产开发阶段资本化金额与后续投入口径要区分
  - 投资性房地产成本模式下减值后折旧基数变化
```

---

# 4. 例外保护层样板

## 4.1 标准公式与题库口径冲突

```yaml
id: exception.fineval.formula_gold_conflict
name: 标准公式与题库 gold 冲突保护
path: [系统规律, 题库口径保护, 公式冲突]
type: exception
content: 当标准公式计算结果与已验证题库 gold 冲突时，不得将该题写入通用公式层；如需记录，只能进入 exception 层，且不能让 calc 输出中间标准数字抢答。
examples:
  - 永久债标准公式得到100，但题库 gold=125
  - 复利标准公式得到1331，但题库 gold=1321
  - CMA布料采购标准公式得到95000，但题库 gold=90000
  - VaR题选项A/B共享90%和300万元，数字抽取会误伤
rules:
  - calc 输出需区分解释文本和最终答案锚点
  - 多选项共享关键数字时，禁用纯数字抽取
  - 题库异常不进入通用知识层
```

# 5. 下一步

1. 从 `knowledge_hierarchy_mapping_draft_20260520.csv` 中抽取上述三个模块的 route。
2. 为每个 route 增加：`proposed_subject / proposed_module / upper_concept / sub_concept / node_type / exception_flag`。
3. 建立 `knowledge_hierarchy_nodes.jsonl` 草案，只读旁路，不接入判题。
4. 经老板确认后，再考虑是否作为检索/路由增强层。
