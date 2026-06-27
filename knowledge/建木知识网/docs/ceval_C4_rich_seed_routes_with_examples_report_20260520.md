# C-Eval C4 Rich Seed Routes：解释 + 例题挂载（2026-05-20）

## 原则

老板确认：泛化能力和答题水平一样重要；必要时把题目作为例题挂在知识点下面；知识点解释必须清楚，不能只有光杆知识点。

## 产物

- Rich seed JSONL：`[REDACTED_LOCAL_PATH]`
- Summary CSV：`[REDACTED_LOCAL_PATH]`

## 统计

- rich seed routes: 1845
- routes with examples: 1845

### example_count分布
- 1 examples: 222
- 2 examples: 263
- 3 examples: 275
- 4 examples: 219
- 5 examples: 866

## 新增字段

- `explanation`: 面向理解的概念解释，不再只是触发词。
- `example_questions`: 挂载 C-Eval 例题，保留题干、选项、答案、解析。
- `first_order_enriched`: 从选项/例题中挖 question_peer、contrast、formula_neighbor、regulation_peer。
- `understanding_fields`: definition/scope_boundary/common_traps/generalization_note/source_upgrade_needed。

## 判断

- 这一步让 C3 seed 从“语义触发点”升级为“可解释、可挂例题、可泛化”的知识节点雏形。
- 后续 C5/C6 再用官方解释/权威教材把 TODO_C4_authoritative_definition 和 scope_boundary 补实。