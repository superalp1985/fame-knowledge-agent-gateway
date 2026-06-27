# C-Eval C11 本地 Val Baseline 与错题归因（2026-05-21）

## 方法

- 使用 sidecar v2 rich 高召回层。
- 策略：route trigger + dev exemplar + card example option alignment 的轻量本地 baseline。
- 目的不是最终模型，而是建立“自己跑、自己出分、自己归因”的闭环。

## 产物

- Predictions：`[REDACTED_LOCAL_PATH]`
- Subject scores：`[REDACTED_LOCAL_PATH]`
- Type scores：`[REDACTED_LOCAL_PATH]`

## 总分

- total: 1346
- correct: 484
- accuracy: 0.3596

## 错因粗分

- calculation_unhandled: 82
- semantic_or_option_alignment: 665
- negative_choice_misread: 83
- low_confidence: 18
- no_retrieval_hit: 14

## 题型分数

- abstraction_choice: 28/70 = 0.4000
- calculation_choice: 48/132 = 0.3636
- concept_choice: 338/967 = 0.3495
- negative_choice: 61/147 = 0.4150
- procedure_choice: 9/30 = 0.3000

## 最弱科目 Top 15

- probability_and_statistics: 3/18 = 0.1667
- mao_zedong_thought: 5/24 = 0.2083
- middle_school_physics: 4/19 = 0.2105
- urban_and_rural_planner: 10/46 = 0.2174
- high_school_mathematics: 4/18 = 0.2222
- middle_school_biology: 5/21 = 0.2381
- accountant: 12/49 = 0.2449
- tax_accountant: 12/49 = 0.2449
- computer_architecture: 6/21 = 0.2857
- college_programming: 11/37 = 0.2973
- high_school_history: 6/20 = 0.3000
- chinese_language_and_literature: 7/23 = 0.3043
- legal_professional: 7/23 = 0.3043
- modern_chinese_history: 7/23 = 0.3043
- veterinary_medicine: 7/23 = 0.3043

## 最强科目 Top 15

- marxism: 12/19 = 0.6316
- college_physics: 10/19 = 0.5263
- education_science: 15/29 = 0.5172
- logic: 11/22 = 0.5000
- middle_school_geography: 6/12 = 0.5000
- computer_network: 9/19 = 0.4737
- high_school_politics: 9/19 = 0.4737
- physician: 22/49 = 0.4490
- civil_servant: 21/47 = 0.4468
- middle_school_politics: 9/21 = 0.4286
- basic_medicine: 8/19 = 0.4211
- high_school_chinese: 8/19 = 0.4211
- high_school_geography: 8/19 = 0.4211
- ideological_and_moral_cultivation: 8/19 = 0.4211
- operating_system: 8/19 = 0.4211

## 判断

- 这是无需 LLM 的本地启发式 baseline，只用于建立度量闭环。
- 后续要按错因把 calculation/negative/option_alignment 分别接建木规则、知识卡解释和例题簇。