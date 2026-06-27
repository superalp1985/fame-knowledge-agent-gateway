# International Finance 规则分级审计 — 2026-05-17

## 结论

- 本文件只做分级审计与候选沉淀，不直接修改 pipeline。
- `international_finance` 当前 17/17 = 100%，need_patch 为 3/17。
- 初判：A 可泛化国际金融规则 13 条；C 现实冲突/旧教材口径/固定史实 4 条。
- 世界银行集团/MIGA、国际收支表旧科目口径、特里芬方案名等不进入主抽象层。

## 统计

- 样本数: 17
- 正确数: 17/17
- need_patch: 3/17
- need_patch reasons: no_knowledge_hit=3, low_kappa=3
- decision_source: concept_rule=17

## A 可泛化国际金融规则（13）

- id=0 pred/gold=C/C κ=0.95 need_patch=False
  - reason: China's foreign-exchange policy has not remained unchanged
  - q: 以下关于中国的外汇管理政策与人民币自由兑换进程，错误的是____。
- id=1 pred/gold=A/A κ=0.408 need_patch=False
  - reason: Exchange-rate changes can strongly affect short-term capital flows
  - q: 汇率变化与资本流动的关系不包括____。
- id=2 pred/gold=C/C κ=0.95 need_patch=False
  - reason: American option can be exercised on or before expiration
  - q: 美式期权是指期权的执行时间____。
- id=3 pred/gold=B/B κ=0.95 need_patch=False
  - reason: Put buyer has right to sell foreign exchange, not buy it
  - q: 以下关于外汇看跌期权的说法中，错误的是____。
- id=4 pred/gold=B/B κ=0.95 need_patch=False
  - reason: 降低法定存款准备金率属于扩张性货币政策
  - q: 以下操作中，属于扩张性货币政策的是____。
- id=6 pred/gold=A/A κ=0.95 need_patch=False
  - reason: Large BOP deficit weakens currency
  - q: 一般来说，一国国际收支出现巨额逆差会使其____。
- id=7 pred/gold=D/D κ=0.95 need_patch=False
  - reason: BOP model item cannot infer exchange rate moves in same direction as foreign income
  - q: 根据国际收支模型不可以判断____。（在直接标价法下）
- id=9 pred/gold=D/D κ=0.95 need_patch=False
  - reason: Reserve currency condition does not require higher currency value
  - q: 储备货币是各国用作外汇储备的货币，充当国际储备资产的货币必须具备一定的条件，其中并不包括下列选项中的哪一个：____。
- id=10 pred/gold=B/B κ=0.7919999999999999 need_patch=False
  - reason: International reserves require availability/liquidity/acceptability, not profitability
  - q: 以下哪个特性都不是国际储备应具备的：____。
- id=12 pred/gold=D/D κ=0.3 need_patch=True
  - reason: Jamaica vs Bretton Woods difference does not include single BOP adjustment
  - q: 牙买加体系与布雷顿森林体系是影响深远的的经济体系格局，其区别不包括____。
- id=13 pred/gold=B/B κ=0.95 need_patch=False
  - reason: Large BOP surplus strengthens currency
  - q: 一国国际收支出现巨额顺差，通常会导致其_____。
- id=14 pred/gold=A/A κ=0.95 need_patch=False
  - reason: Direct quotation: exchange rate moves with domestic price level
  - q: 从国际收支模型可以推断出，直接标价法意味着____。
- id=15 pred/gold=A/A κ=0.95 need_patch=False
  - reason: Different tax-owner standards across countries create double leasing
  - q: ____是指在国与国之间，对于谁(出租人还是承租人)是取得减税的租赁资产的所有人，其标准不相同。

## C 现实冲突/旧教材口径/固定史实（4）

- id=5 pred/gold=D/D κ=0.48 need_patch=False
  - reason: FinEval口径 selects MIGA as not World Bank Group member; real-world caution
  - q: 下列组织中，不是世界银行集团的成员机构的是____。
- id=8 pred/gold=D/D κ=0.408 need_patch=False
  - reason: United States uses indirect quotation in this textbook item
  - q: 哪个国家采用间接标价法？
- id=11 pred/gold=B/B κ=0.3 need_patch=True
  - reason: FinEval uses combined capital-and-financial account; standalone financial item not in range
  - q: 以下哪项不在国际收支平衡表范围内？
- id=16 pred/gold=B/B κ=0.3 need_patch=True
  - reason: Triffin proposal name: establish international credit reserve system
  - q: 特里芬提出建立国家的国际信用储备制度的方案，其名称是____。（在此基础上推动了国际储备货币的改革方案）

## 可沉淀抽象候选

### [A] 中国外汇管理政策动态变化
- 来源 id: [0]
- 候选规则: 中国外汇管理政策与人民币自由兑换进程是逐步调整和开放的过程，并非始终保持不变。

### [A] 汇率变动影响短期资本流动
- 来源 id: [1]
- 候选规则: 汇率变动会显著影响短期资本流动：本币大幅贬值易引起资本外逃或短期资本流出，本币升值易吸引短期资本流入。

### [A] 外汇看跌期权权利义务
- 来源 id: [3]
- 候选规则: 外汇看跌期权买方享有按约定价格卖出外汇的权利，卖方承担相应买入外汇的义务，买方支付的期权费通常不可收回。

### [A] 国际收支逆差与货币疲软
- 来源 id: [6]
- 候选规则: 一国国际收支出现巨额逆差通常会削弱本币，使货币趋于疲软。

### [A] 国际收支顺差与货币坚挺
- 来源 id: [13]
- 候选规则: 一国国际收支出现巨额顺差通常会支撑本币，使货币趋于坚挺。

### [A] 直接标价法国际收支模型方向
- 来源 id: [7, 14]
- 候选规则: 直接标价法下，国际收支模型通常推断汇率与本国物价同方向变动、与本国收入同方向变动、与本国利率反方向变动。

### [A] 储备货币条件
- 来源 id: [9]
- 候选规则: 充当国际储备资产的货币通常需要可自由兑换、在国际货币体系中占重要地位且购买力稳定，不要求货币面值或价值较高。

### [A] 国际储备特性
- 来源 id: [10]
- 候选规则: 国际储备强调可得性、流动性和普遍接受性，盈利性不是其必要特性。

### [A] 牙买加体系区别
- 来源 id: [12]
- 候选规则: 牙买加体系相对布雷顿森林体系的重要变化包括黄金非货币化、储备货币多样化和汇率制度多样化，不包括国际收支调节单一化。

### [A] 双重租赁定义
- 来源 id: [15]
- 候选规则: 双重租赁是指不同国家对租赁资产税收所有人的认定标准不同，从而产生跨国减税安排。

## 不建议沉淀项

- id=5：MIGA 实际属于世界银行集团，FinEval gold 与现实口径冲突，绝不进主网。
- id=8：美国/间接标价法属于国家固定口径，且可能随教材表达变化，不进主抽象层。
- id=11：国际收支表“金融项目/资本和金融项目”是旧教材口径差异，现代口径风险。
- id=16：特里芬方案名称为固定史实，局部知识可记但不放通用抽象。