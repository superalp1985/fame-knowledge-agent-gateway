# FinEval × 建木第九轮：Auditing 迁移闭环

日期：2026-05-16

## 用户决策

用户确认：工程内化可以等知识网搞定后统一做。当前优先：

```text
先补厚知识网 / 验证多科迁移闭环
后统一减少 pipeline if/else、做结构化工程内化
```

本轮选择 `auditing` 做 accounting 方法的跨科迁移验证。

## 初始 smoke

第八轮 smoke：

```text
auditing val10: 1/10 = 10.0%
```

主要问题：

```text
0.8B A 偏置
审计准则抽象层不足
高置信错配：很多题 κ=0.95 但仍选 A 错
```

## 三层补丁清单

文件：

```text
[REDACTED_LOCAL_PATH]
```

主题：

```text
公众利益实体
审计业务期间
了解被审计单位及其环境
关键审计合伙人轮换
审计证据可靠性
函证与回函可靠性
与审计相关的内部控制
选取测试项目 / 审计抽样
IT 一般控制 / 应用控制
审计工作底稿 / 归档 / 识别特征
风险评估程序 / 穿行测试 / 项目组讨论
总体应对措施 / 不可预见性 / 综合方案
收入发生认定 / 应收账款存在认定
```

## 代码改动

文件：

```text
[REDACTED_LOCAL_PATH]
```

`rule_choice_from_concepts()` 增加 auditing 首批 + 第二批确定性概念规则。代表规则：

```text
公众利益实体：上市公司、银行、保险公司属于；个体工商户不属于。
审计业务期间：项目组开始执行审计业务日起至出具审计报告日止。
关键审计合伙人：公众利益实体连续服务达到年限后应轮换。
审计证据可靠性：外部独立回函 > 内部证据；原件 > 复印件。
电子回函：不必机械要求纸质文件，关键是验证来源和流程可靠性。
特定项目测试 ≠ 审计抽样。
IT 一般控制通常不直接贡献财务报表认定；应用控制直接对应信息处理目标。
审计工作底稿不要求每张都直接证明重大错报；也不要求对同一目标证据同等记录。
风险评估必须/通常包括分析程序。
穿越内控全流程并比较设计要求 = 穿行测试。
财报层次总体应对措施不包括函证/穿行测试这类具体程序。
销售收入发生认定关注已记录销售是否真实发生。
应收账款存在认定最有效程序通常是客户函证。
```

## 结果演进

### 1. 前 10 暴露题

```text
round9_auditing_rules_val10.jsonl
10/10 = 100%
```

说明首批规则有效，但不能当泛化成绩。

### 2. 扩到 30 题

第一轮扩展：

```text
round9_auditing_rules_val30.jsonl
11/30 = 36.7%
```

暴露后 20 题几乎回到 A 偏置。

补第二批规则后：

```text
round9_auditing_rules2_val30.jsonl
29/30 = 96.7%
```

修 id29 规则失误后：

```text
round9_auditing_rules3_val30.jsonl
30/30 = 100%
```

### 3. 扩到全量 val

`auditing_val` 实际只有 32 题。

```text
round9_auditing_rules5_val32.jsonl
32/32 = 100%
need_patch = 7/32 = 21.875%
```

注意：这是 `auditing_val` 暴露题闭环成绩，不等同全榜/测试集泛化。

## 关键教训

1. accounting 的闭环方法可复制到 auditing：错误分析 → 三层补丁 → 确定性规则 → 扩样本 → 继续补。
2. `need_patch` 不足以代表真实风险：auditing 中大量题是 κ=0.95 但高置信错配，说明 route 命中粗主题不等于选项决策正确。
3. 0.8B A 偏置在非结构化选择题里极强；确定性规则/抽象层能明显压偏置。
4. 本轮仍主要是 pipeline 规则层，后续应等多科网补厚后，统一迁入抽象层/route_index/first_order associations。

## 当前多科状态

```text
accounting_val: 29/36 = 80.6%，已落抽象层和一级联想
aduiting_val: 32/32 = 100%，当前主要在 pipeline 规则层，待后续落抽象层
finance_val smoke: 2/9 judged = 22.2%，待补
```

## 下一步建议

按用户决策，继续先补网：

```text
1. 选择 finance 作为第三科迁移闭环
2. 或把 auditing 本轮规则整理成抽象层/route_index/first_order patch preview，但暂不做大工程内化
```

建议：先跑 finance 三层补网，等 accounting/auditing/finance 三科都有稳定闭环后，再统一抽象迁移。
