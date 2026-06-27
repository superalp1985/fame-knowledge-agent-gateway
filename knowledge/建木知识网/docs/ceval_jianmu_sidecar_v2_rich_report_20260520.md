# C-Eval × 建木 Sidecar v2 Rich 报告（2026-05-20）

## 目的

落实老板要求：泛化能力和答题水平一样重要；题目可作为例题挂在知识点下面；知识点解释要清楚，不能是光杆触发词。

## 产物

- sidecar v2 rich：`[REDACTED_LOCAL_PATH]`
- trigger index：`[REDACTED_LOCAL_PATH]`
- spec：`[REDACTED_LOCAL_PATH]`

## 统计

- 总 routes: 4559
- jianmu_H6: 2714
- ceval_C4_rich_seed: 1845
- 挂例题 rich seed: 1845

## 新原则

- C-Eval seed 节点必须至少包含 explanation / example_questions / first_order_enriched / understanding_fields。
- 例题用于泛化和解释，不把例题答案当通用规则。
- 后续权威资料补点优先填 `definition` 和 `scope_boundary`。