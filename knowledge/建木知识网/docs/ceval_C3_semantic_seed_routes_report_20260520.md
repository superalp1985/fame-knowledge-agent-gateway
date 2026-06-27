# C-Eval C3 第一波语义种子补点报告（2026-05-20）

## 范围

- 对 C2 中 semantic_gap / weakly_connected 的 41 个科目，基于 C-Eval 官方题面数据批量生成语义种子 route。
- 目的：先把题面语义接到建木的学科层级、一级联想、语义树 intent 和 exception guard。
- 注意：本轮 source_tier 为 official_benchmark_data；内容为“语义种子”，后续 C4 用官方解释/权威教材补厚定义、规律、公式和条文。

## 产物

- seed routes JSONL：`[REDACTED_LOCAL_PATH]`
- subject bridge JSONL：`[REDACTED_LOCAL_PATH]`
- seed summary CSV：`[REDACTED_LOCAL_PATH]`

## 统计

- 覆盖科目：41
- 新增 seed routes：1845

### node_type分布
- concept: 806
- formula_or_calculation: 549
- abstraction_or_regularity: 198
- regulation_or_standard: 189
- procedure: 103

### 每科 seed route 数
- computer_network: 45
- operating_system: 45
- computer_architecture: 45
- college_programming: 45
- college_physics: 45
- college_chemistry: 45
- discrete_mathematics: 45
- electrical_engineer: 45
- metrology_engineer: 45
- high_school_physics: 45
- high_school_chemistry: 45
- high_school_biology: 45
- middle_school_biology: 45
- middle_school_physics: 45
- middle_school_chemistry: 45
- veterinary_medicine: 45
- marxism: 45
- mao_zedong_thought: 45
- education_science: 45
- teacher_qualification: 45
- high_school_politics: 45
- high_school_geography: 45
- middle_school_politics: 45
- middle_school_geography: 45
- modern_chinese_history: 45
- ideological_and_moral_cultivation: 45
- logic: 45
- chinese_language_and_literature: 45
- art_studies: 45
- professional_tour_guide: 45
- high_school_chinese: 45
- high_school_history: 45
- middle_school_history: 45
- civil_servant: 45
- sports_science: 45
- plant_protection: 45
- basic_medicine: 45
- clinical_medicine: 45
- fire_engineer: 45
- environmental_impact_assessment_engineer: 45
- physician: 45

## 判断
- C3 第一波完成后，C-Eval 弱连接/断连科目不再完全悬空，已有语义树触发词、学科层级位置和一级联想种子。
- 下一步 C4：按 seed route 高频项，批量抓官方解释/权威教材目录，补 definition / regularity / formula / regulation / exception。