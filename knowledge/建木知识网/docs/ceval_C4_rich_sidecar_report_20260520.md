# C-Eval C4 Rich Seeds 与 Sidecar v2 Rich 报告（2026-05-20）

## 用户要求

- 泛化能力和答题水平一样重要。
- 实在不行就把题目作为例题挂在知识点下面。
- 知识点解释一定要清楚，不能是光杆知识点。

## 完成事项

1. 将 C3 semantic seed routes 升级为 rich seed routes：每个知识点都挂 explanation、example_questions、first_order_enriched、understanding_fields。
2. 将 C-Eval sidecar 升级为 v2 rich，全部 1845 个 C3 seed route 都挂上例题。
3. 重新跑 val shadow retrieval，确认增加解释和例题后覆盖没有下降。

## 产物

- Rich seed JSONL：`[REDACTED_LOCAL_PATH]`
- Rich seed summary：`[REDACTED_LOCAL_PATH]`
- Rich seed report：`[REDACTED_LOCAL_PATH]`
- Sidecar v2 rich：`[REDACTED_LOCAL_PATH]`
- Sidecar v2 trigger index：`[REDACTED_LOCAL_PATH]`
- Sidecar v2 spec：`[REDACTED_LOCAL_PATH]`
- Sidecar v2 report：`[REDACTED_LOCAL_PATH]`
- Shadow v2 detail：`[REDACTED_LOCAL_PATH]`
- Shadow v2 summary：`[REDACTED_LOCAL_PATH]`

## 统计

- rich seed routes: 1845
- rich seed routes with examples: 1845
- example count 分布：5例=866、4例=219、3例=275、2例=263、1例=222
- sidecar v2 rich total routes: 4559

## Shadow retrieval val 结果

- val 总题数：1346
- 命中题数：1328
- 命中率：98.66%
- rich seed 命中题数：1157
- rich seed 命中率：85.96%

## 结论

- 这轮把知识点从“光杆触发词”升级成了“可解释 + 可挂例题 + 可做一级联想”的节点。
- 这满足了老板说的“别就光杆一个知识点，没有理解的余地”。
- 目前侧重仍是泛化和理解，不是单纯刷 accuracy；后续再补官方解释/权威教材，把 definition / scope_boundary / regularity 进一步写实。