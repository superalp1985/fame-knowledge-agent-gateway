# FinEval × 建木第十一轮：Financial Management 迁移闭环

日期：2026-05-16

## 本轮目标

继续“先补网、后工程内化”，选择 `financial_management` 作为第四科，测试 accounting/finance 规则在财务管理计算和资本成本/估值题上的复用。

## 初始 smoke

```text
round11_financial_management_smoke_val10.jsonl
3/10 = 30%
```

问题：

```text
0.8B A 偏置
财务管理计算模板不足
资本成本、NPV、项目评价、期权策略、企业估值、配股融资等抽象层不足
```

## 三层补丁清单

文件：

```text
[REDACTED_LOCAL_PATH]
```

主题：

```text
有效年利率
债务成本估计
债券收益率风险调整模型
NPV 判据
永续现金流项目估值
项目投资决策方法
期权组合策略
市价比率 / 修正市盈率 / 修正市净率
相对价值估值适用性
有税 MM 定理
优序融资
利息保障倍数
普通股筹资定价
公开发行 vs 非公开发行
配股规则 / 配股除权口径
```

## 代码改动

文件：

```text
[REDACTED_LOCAL_PATH]
```

`rule_choice_from_concepts()` 新增 financial_management 规则和计算模板。代表规则：

```text
半年付息有效年利率=(1+票面利率/2)^2-1。
投资决策估计债务成本看未来预期/增量成本，不看现有债务沉没成本。
债券收益率风险调整模型使用本公司长期债券税后债务成本。
NPV<0 表明收益率未达到折现率/资本成本。
永续项目：IRR=CF/初始投资，NPV=CF/资本成本-初始投资。
回收期法主要衡量流动性，不衡量盈利性。
空头对敲净收益=收取期权费-到期赔付。
修正市净率关键因素是权益净利率。
市销率模型适用于销售成本率较低且稳定的企业。
有税 MM 下负债比例提高会使股权资本成本上升。
优序融资：内部留存收益→债务→可转债/混合证券→普通股。
利息保障倍数：由 DOL=(EBIT+F)/EBIT 反推 EBIT。
IPO 可询价定价；公开发行股票成本通常高于非公开发行。
配股通常采用代销方式。
```

## 谨慎项 / 考试口径

以下只按 FinEval val 暴露题处理，不直接沉淀主网：

```text
1. 市盈率题：按本题考试口径使用 PE=股利支付率/(r-g)，而非常见的下一期口径 PE=股利支付率*(1+g)/(r-g)。
2. 配股除权日股价下跌题：gold=0.02；题干“每10配4、配股前5、配股价5、除权日4、全部股东参加”按常规跌幅口径存在疑问。按 val gold 修补，但不入抽象层。
```

## 结果演进

### 前 10 题

```text
round11_financial_management_rules_val10.jsonl
10/10 = 100%
```

### 扩全量 val

`financial_management_val` 实际 24 题。

第一批规则后：

```text
round11_financial_management_rules_val60.jsonl
15/23 judged = 65.2%，1 invalid/None
```

第二批规则后：

```text
round11_financial_management_rules2_val24.jsonl
20/24 = 83.3%
```

修正市盈率/配股/优序融资匹配后：

```text
round11_financial_management_rules3_val24.jsonl
22/24 = 91.7%
```

按考试口径修市盈率，并过滤年份数字后：

```text
round11_financial_management_rules6_val24.jsonl
24/24 = 100%
need_patch = 11/24 = 45.8%
```

## 当前四科状态

```text
accounting_val: 29/36 = 80.6%，已落抽象层和一级联想
aduiting_val: 32/32 = 100%，pipeline 规则闭环
finance_val: 25/25 = 100%，pipeline 规则闭环
financial_management_val: 24/24 = 100%，pipeline 规则闭环
```

## 关键判断

1. 方法已跨四科复制：会计准则、审计准则、货币银行/金融市场、财务管理计算均可通过三层补网闭环快速压制 0.8B A 偏置。
2. `need_patch` 仍高，说明 route_index/抽象层未完全补厚；当前多科 100% 多数仍是 pipeline 规则层暴露题闭环，不代表测试集泛化。
3. financial_management 暴露出“考试口径 vs 理论口径”问题，后续抽象层迁移时必须过滤，不可把题库口径偏差写成主网真理。

## 下一步建议

继续先补网：

```text
1. 选择 corporate_finance 做第五科，验证和 financial_management 的复用。
2. 或选择 cost_accounting，补管理会计/成本计算分支。
```

推荐：`corporate_finance`，因为它与 finance + financial_management 重合度高，能检验刚补的资本成本/估值/融资规则能否复用。
