# C-Eval C5 Knowledge Cards 报告（2026-05-20）

## 目的

把 C4 rich seed 从“有解释和例题的节点”继续升级为 knowledge cards：定义线索、规律线索、陷阱、例题簇、一级联想和适用边界都放在同一卡片里。

## 产物

- Knowledge cards JSONL：`[REDACTED_LOCAL_PATH]`
- Summary CSV：`[REDACTED_LOCAL_PATH]`
- Subject packs：`[REDACTED_LOCAL_PATH]`

## 统计

- cards: 1845

### node_type
- concept: 806
- formula_or_calculation: 549
- abstraction_or_regularity: 198
- regulation_or_standard: 189
- procedure: 103

### matched_question_count
- 2-4: 757
- >=10: 361
- 5-9: 505
- 1: 222

### clue coverage
- with_definition_clues: 337
- with_regularity_clues: 205
- with_trap_clues: 136
- with_examples: 1845

## 新增结构

- `definition_clues`: 来自 dev/题面解析的定义线索。
- `regularity_clues`: 公式、因果、制度、条件等规律线索。
- `trap_clues`: 否定题、例外、易混表达。
- `first_order_links`: same_subject / question_peer / contrast_peer / correct_answer_peer。
- `scope_boundary`: 适用边界和答案守卫。
- `example_cluster`: 最多 8 道例题簇。

## 判断

- C5 仍不把 benchmark 例题当作权威教材；它先形成“理解脚手架”。
- 下一步 C6 应对 needs_authoritative_upgrade=True 的高频卡片按科目补官方/权威定义，尤其是医学、工程、计算机、政治历史、法考。