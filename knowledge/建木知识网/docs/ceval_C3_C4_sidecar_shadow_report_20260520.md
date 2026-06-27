# C-Eval C3/C4 Sidecar v1 与 Shadow Retrieval 报告（2026-05-20）

## 完成事项

1. 对 C2 中 weakly_connected / semantic_gap 的 41 个科目生成 C3 语义 seed routes。
2. 将建木 H6 sidecar 与 C3 seed routes 合并为 C-Eval × 建木 sidecar v1。
3. 构建 trigger index。
4. 在 C-Eval val split 上跑 shadow retrieval，只记录命中，不影响答案。

## 产物

- C3 seed routes：`[REDACTED_LOCAL_PATH]`
- C3 subject bridge：`[REDACTED_LOCAL_PATH]`
- C3 报告：`[REDACTED_LOCAL_PATH]`
- Sidecar v1：`[REDACTED_LOCAL_PATH]`
- Trigger index：`[REDACTED_LOCAL_PATH]`
- Sidecar v1 spec：`[REDACTED_LOCAL_PATH]`
- Sidecar v1 报告：`[REDACTED_LOCAL_PATH]`
- Shadow retrieval 明细：`[REDACTED_LOCAL_PATH]`
- Shadow retrieval summary：`[REDACTED_LOCAL_PATH]`

## C3 统计

- 覆盖弱连接/断连科目：41
- 新增 seed routes：1845
- node_type 分布：concept=806, formula_or_calculation=549, abstraction_or_regularity=198, regulation_or_standard=189, procedure=103

## Sidecar v1 统计

- 总 routes：4559
- jianmu_H6：2714
- ceval_C3_seed：1845

## Shadow retrieval val 结果

- val 总题数：1346
- sidecar 命中题数：1302
- sidecar 命中率：96.73%
- C3 seed 命中题数：1007
- C3 seed 命中率：74.81%

## 低命中科目（Top 12）

- chinese_language_and_literature: hit_rate=82.61%, c3_seed_hit_rate=65.22%, total=23
- art_studies: hit_rate=84.85%, c3_seed_hit_rate=75.76%, total=33
- civil_servant: hit_rate=85.11%, c3_seed_hit_rate=74.47%, total=47
- clinical_medicine: hit_rate=86.36%, c3_seed_hit_rate=68.18%, total=22
- physician: hit_rate=87.76%, c3_seed_hit_rate=81.63%, total=49
- veterinary_medicine: hit_rate=91.30%, c3_seed_hit_rate=78.26%, total=23
- mao_zedong_thought: hit_rate=91.67%, c3_seed_hit_rate=79.17%, total=24
- professional_tour_guide: hit_rate=93.10%, c3_seed_hit_rate=75.86%, total=29
- discrete_mathematics: hit_rate=93.75%, c3_seed_hit_rate=62.50%, total=16
- computer_network: hit_rate=94.74%, c3_seed_hit_rate=84.21%, total=19
- high_school_geography: hit_rate=94.74%, c3_seed_hit_rate=73.68%, total=19
- ideological_and_moral_cultivation: hit_rate=94.74%, c3_seed_hit_rate=94.74%, total=19

## 判断

- 建木 H6 + C3 seed 已经把 C-Eval val 题面绝大部分接入语义树/层级/一级联想旁路。
- 当前只是 retrieval 覆盖，不代表答题准确率。下一步要接答案引擎、跑 baseline accuracy，再按错题归因补官方/权威教材知识。
- C3 seed 的 source_tier 是 official_benchmark_data，属于语义种子；C4 需继续用官方解释/权威教材补厚 definition / regularity / formula / regulation。