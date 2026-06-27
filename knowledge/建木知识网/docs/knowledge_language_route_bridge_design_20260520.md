# 建木知识网：语言树—知识树—一级联想路由连接设计 v0.1（2026-05-20）

## 1. 目标

本设计用于补足层级化重构中的三类连接：

```text
语言树表达
  → route/知识节点
    → 一级联想路由
      → 学科层级节点
```

目标不是替换现有判题主流程，而是建立只读旁路结构，后续作为检索/解释/泛化增强层。

## 2. 现有结构

### 2.1 语言树

- `language/sentence_patterns.json`
  - 句式/意图层：能力询问、执行请求、意见征求等。
  - 当前字段：`id/name/template_regex/intent/route_to/examples/fame`。
- `language/vocab_technical.json`
  - 技术/财经词汇层：领域词汇映射。
  - 当前字段：`domains`。

### 2.2 语言树到学科入口

- `associations/lang_*.json`
  - 当前为“语言树→学科入口”的 1-level association。
  - 典型字段：`name/type/from/to/trigger_keywords/examples/fame`。

### 2.3 学科入口到 route

- `associations/route_*.json`
  - 学科入口到 route 的连接。
  - 主要作用：从学科域进入具体路由/知识点。

### 2.4 一级联想路由

- `associations/first_order_*.json`
  - 当前为同域一级联想。
  - 典型结构：`from -> [to1, to2, to3]`。
  - 作用：一个知识点命中后，补充相邻概念/易混概念/共同考法。

### 2.5 具体知识 route

- `route_index.json`
  - 当前已有 2714 条 route。
  - 典型字段：`id/type/subject/domain/name/aliases/keywords/negative_keywords/content/priority`。
  - 这是层级挂树的最佳底座。

## 3. 新增旁路连接模型

建议新增一个旁路连接文件：

```text
[REDACTED_LOCAL_PATH]
```

每条连接记录一个“语言/route/联想/层级”四元关系：

```json
{
  "bridge_id": "bridge.finance.asset_pricing.capm",
  "language": {
    "sentence_intents": ["calculation_request", "concept_judgement"],
    "trigger_keywords": ["CAPM", "必要收益率", "预期收益率", "beta", "证券市场线"],
    "negative_keywords": []
  },
  "route": {
    "route_ids": ["..."],
    "source_subject": "金融学",
    "source_domain": "投资学"
  },
  "first_order": {
    "from": "资本资产定价模型",
    "to": ["beta", "证券市场线", "风险溢价"],
    "relation": "same_domain_or_prerequisite"
  },
  "hierarchy": {
    "subject": "金融学",
    "module": "投资学",
    "upper_concept": "资产定价",
    "sub_concept": "CAPM",
    "node_type": "formula"
  },
  "guards": {
    "exception_policy": "formula_gold_conflict_goes_to_exception",
    "answer_anchor_policy": "do_not_extract_from_intermediate_numbers"
  }
}
```

## 4. 路由执行顺序建议

未来接入时建议顺序：

```text
1. 语言树句式识别
   - 判断是计算、定义、法规、排序、不正确项、观点分析等。

2. 领域词汇/trigger 命中
   - 从 vocab_technical + lang_* 进入学科入口。

3. route_index 粗召回
   - 用 route aliases/keywords/content 召回候选 route。

4. 层级节点对齐
   - 将 route 对齐到 学科/模块/上位概念/子概念。

5. 一级联想扩展
   - 根据 first_order 补相邻概念、易混点、共同考法。

6. 适用条件与例外检查
   - 判断公式/法规/定义是否适用。
   - 检查题库口径冲突、数字抢答风险。

7. 生成解释或答案锚点
   - 解释文本与最终答案锚点分离。
```

## 5. 一级联想的角色重定义

一级联想不应只是“命中后补三个相关词”，而应分关系类型：

```text
same_domain       同域相邻概念
prerequisite      前置概念
contrast          易混/相反概念
formula_neighbor  同公式族
regulation_peer   同法规体系
question_peer     同题型共同考法
exception_peer    同类题库口径异常
```

例如：

```text
CAPM
 ├─ prerequisite: 无风险利率、市场收益率、beta
 ├─ formula_neighbor: 证券市场线、风险溢价
 ├─ contrast: 实际收益率、历史持有期收益率
 └─ exception_peer: 标准公式与题库 gold 冲突保护
```

## 6. 与知识层级的连接规则

每条 route 至少应补以下层级字段：

```text
proposed_subject
proposed_module
upper_concept
sub_concept
node_type
applicability
exception_flag
first_order_group
language_triggers
```

其中：

- `language_triggers` 来自语言树/领域词汇/route keywords；
- `first_order_group` 来自 `first_order_*.json`；
- `upper_concept/sub_concept` 来自人工或半自动挂树；
- `exception_flag` 用于阻止题库异常污染通用层。

## 7. 近期任务

1. 盘点 `language/`、`associations/`、`route_index.json` 的连接现状。
2. 生成 `knowledge_language_association_inventory_20260520.csv`。
3. 为三个样板模块生成 bridge 草案：
   - 资产定价
   - 商业银行风险管理
   - 财务会计资产
4. 只输出旁路文档，不接判题主流程。
