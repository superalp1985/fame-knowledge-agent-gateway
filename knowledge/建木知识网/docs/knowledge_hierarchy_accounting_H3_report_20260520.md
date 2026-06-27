# 建木知识网层级化 Round H3 — 会计学大类完整挂树报告（2026-05-20）

## 范围

- 覆盖财务会计、高级财务会计、成本会计、管理会计、审计及 CPA/CMA 强相关 route。
- 原则：只读旁路，不接判题主流程；不围绕题库 residual 贴题。

## 产物

- route层级明细：`[REDACTED_LOCAL_PATH]`
- 聚合节点JSONL：`[REDACTED_LOCAL_PATH]`
- 一级联想bridge JSONL：`[REDACTED_LOCAL_PATH]`

## 统计

- 会计学大类 route: 1107
- 聚合节点数: 12
- exception候选: 1

### module分布
- 财务会计: 551
- 会计学: 264
- 审计学: 114
- 高级财务会计: 67
- 管理会计: 64
- 成本会计: 47

### upper_concept Top
- 会计学 / 未细分会计模块: 264
- 财务会计 / 收入费用利润: 258
- 财务会计 / 资产: 123
- 审计学 / 审计程序与职业规范: 114
- 财务会计 / 负债: 84
- 高级财务会计 / 合并与特殊会计: 67
- 管理会计 / 预算控制与经营决策: 64
- 成本会计 / 成本计算与成本控制: 47
- 财务会计 / 所得税会计: 32
- 财务会计 / 所有者权益: 23
- 财务会计 / 会计基础与报表列报: 19
- 财务会计 / 现金流量表: 12

### node_type分布
- calculation_or_measurement: 589
- concept: 381
- standard_or_principle: 88
- definition: 29
- procedure: 20

### first_order_relation_type分布
- measurement_rule: 589
- same_domain: 325
- prerequisite: 164
- contrast: 131
- standard_peer: 88
- question_peer: 20

## 结构判断
- 会计学大类天然适合按“确认、计量、列报、披露、审计证据、内部决策”组织。
- 抽象层应以会计要素、确认计量原则、职业判断、内部管理目标为主；规律层承载准则口径、计量公式、流程顺序和职业规范。
- 下一轮可做经济学大类，或先精修会计中“未细分会计模块”。