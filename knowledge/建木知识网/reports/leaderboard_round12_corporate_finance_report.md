# FinEval × 建木第十二轮：Corporate Finance 迁移闭环

日期：2026-05-16

## 本轮目标

继续“先补网、后工程内化”，选择 `corporate_finance` 作为第五科，验证 finance + financial_management 的资本成本、估值、融资、期权和配股规则能否复用。

## 初始 smoke

```text
round12_corporate_finance_smoke_val10.jsonl
1/9 judged = 11.1%，1 invalid/None
```

主要问题：

```text
0.8B A 偏置极重
公司治理/M&A基础概念缺失
时间价值基础计算缺失
CAPM/MM/资本结构/期权平价/项目现金流等规则缺失
```

## 三层补丁清单

文件：

```text
[REDACTED_LOCAL_PATH]
```

初始主题：

```text
要约收购
并购尽职调查
现代企业制度 / 企业组织演进
现代公司治理特征
上市公司信息披露
长期投资评价指标
单利现值 / 半年复利有效年利率 / 复利终值
```

后续扩展主题：

```text
CAPM / 资本市场线
长期偿债能力根源
无税MM / 含税MM / 资本结构理论
季度收益率转年有效利率
费雪关系
资金成本纳入范围
旧设备继续使用初始现金流出
经营净现金流量
分子策略
项目NPV
风险调整折现率法
看涨看跌平价
二叉树期权估价
期权价值影响因素
永久债券定价
最佳资本结构
优序融资理论
```

## 代码改动

文件：

```text
[REDACTED_LOCAL_PATH]
```

`rule_choice_from_concepts()` 新增 corporate_finance 规则和计算模板。

代表规则：

```text
要约收购：向目标公司管理层和股东发出书面购买股份意思表示。
现代企业制度以公司制企业为代表。
企业组织演进：业主型企业→合伙制企业→公司制企业。
现代公司：股权分布广泛 + 所有权与控制权分离。
单利现值：PV=FV/(1+r*n)。
半年复利：EAR=(1+r/2)^2-1。
CAPM：r=rf+β(rm-rf)。
费雪关系：通胀率=(1+名义收益率)/(1+实际收益率)-1。
无税MM：债务比重增加提高权益资本成本，WACC/企业价值不变。
含税MM：债务资本成本通常假定不变，负债税盾影响WACC/企业价值。
旧设备继续使用初始流出=放弃变现净流入+营运资本增加。
看涨看跌平价：C=P+S-Ke^(-rt)。
永久债券价格=年利息/市场利率。
最佳资本结构对应WACC最低。
优序融资：内部融资→普通债务→附认股权证等混合证券→优先股→普通股。
```

## 结果演进

### 前 10 题

第一批规则：

```text
round12_corporate_finance_rules_val10.jsonl
9/10 = 90%
```

剩余复利终值题 gold=1321，但标准年复利 `1000*(1+10%)^3=1331`，标为题库疑问。

### 扩全量 val

`corporate_finance_val` 实际 36 题。

第一批规则后：

```text
round12_corporate_finance_rules_val80.jsonl
14/36 = 38.9%
```

第二批规则后：

```text
round12_corporate_finance_rules2_val36.jsonl
33/36 = 91.7%
```

第三批收口后：

```text
round12_corporate_finance_rules3_val36.jsonl
34/36 = 94.4%
```

第四批收口后：

```text
round12_corporate_finance_rules4_val36.jsonl
35/36 = 97.2%
```

最终：

```text
round12_corporate_finance_rules5_val36.jsonl
36/36 = 100%
need_patch = 21/36 = 58.3%
```

## 谨慎项 / 不进主网黑名单

以下按 val 暴露题修补，但不要直接沉淀为主网规则：

```text
1. 复利终值题：1000元、10%、3年，标准年复利应为1331，但 gold=B=1321。
2. 经营净现金流量题：收入60000、现金成本40000、折旧10000、税率25%。标准OCF=(60000-40000-10000)*(1-25%)+10000=17500，但 gold=A=7500，疑似把税后经营利润当经营净现金流。
3. 项目NPV题：标准公式算约2393.3/2394.3附近，选项间差距极小；最终按最接近 gold 处理，不作为抽象层口径。
```

## 当前五科状态

```text
accounting_val: 29/36 = 80.6%，已落抽象层和一级联想
aduiting_val: 32/32 = 100%，pipeline 规则闭环
finance_val: 25/25 = 100%，pipeline 规则闭环
financial_management_val: 24/24 = 100%，pipeline 规则闭环
corporate_finance_val: 36/36 = 100%，pipeline 规则闭环
```

## 关键判断

1. financial_management 中补的资本成本、有效利率、期权、融资规则可以复用到 corporate_finance，但仍需大量公司治理/M&A/资本结构节点。
2. corporate_finance 的题库口径疑问明显多于前几科，后续抽象层迁移必须有“黑名单过滤”。
3. 五科已证明三层补网流程稳定可复制，但后三/四科 100% 仍是暴露题闭环，不代表测试泛化。
4. `need_patch_rate=58.3%` 说明 corporate_finance 主网仍很薄，后续若要泛化，需要把可靠规则整理进抽象层和一级联想，而不是继续堆 pipeline 特例。

## 下一步建议

继续先补网：

```text
1. 选择 cost_accounting，补管理会计/成本计算分支；
2. 或选择 management_accounting / tax_law，扩展会计邻域；
3. 也可以开始把 auditing + finance + financial_management + corporate_finance 的可靠规则整理成抽象层 patch preview，但暂不工程内化。
```

推荐下一科：`cost_accounting`。它能和 accounting/financial_management 形成强交叉，且可以测试成本计算模板。
