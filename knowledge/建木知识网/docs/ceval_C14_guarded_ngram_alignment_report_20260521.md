# C-Eval C14：带防误伤 guard 的中文 ngram 选项语义对齐（2026-05-21）

## 目标

- 继承 C13c 的真实收益：中文 2-4gram tokenizer 让 val 从 484/1346 提升到 542/1346。
- 重点降低 C13c 的 74 个 hurt 样本，不把 val 标签上的“按科目回退”当成果。
- 本轮只做 shadow/eval 层，不改主知识库，不接生产答题。

## Guard 设计

- 使用 C13c ngram alignment 作为默认。
- 对 STEM/代码/经济学中的 `calculation_choice` 回退 C11。
- 理由：ngram 对中文概念题收益最大；公式、代码、数学符号题容易被短词碎片抢分，C11 原先整体更稳。
- Guard subjects: `advanced_mathematics, college_chemistry, college_economics, college_physics, college_programming, computer_architecture, discrete_mathematics, high_school_mathematics, middle_school_physics, probability_and_statistics`

## Policy sweep

- C11_baseline: 484/1346 = 0.3596, delta_vs_C11=0, fallback=1346, changed=0, helped=0, hurt=0, net=0
- C13c_ngram_all: 542/1346 = 0.4027, delta_vs_C11=58, fallback=0, changed=349, helped=132, hurt=74, net=58
- C14_stem_calc_guard: 548/1346 = 0.4071, delta_vs_C11=64, fallback=58, changed=333, helped=131, hurt=67, net=64
- concept_only_ngram: 536/1346 = 0.3982, delta_vs_C11=52, fallback=379, changed=256, helped=101, hurt=49, net=52
- concept_negative_ngram: 540/1346 = 0.4012, delta_vs_C11=56, fallback=232, changed=291, helped=115, hurt=59, net=56
- no_calculation_ngram: 542/1346 = 0.4027, delta_vs_C11=58, fallback=132, changed=314, helped=122, hurt=64, net=58

## C14 结果

- total: 1346
- correct: 548
- accuracy: 0.4071
- delta vs C11: 64 / +4.75 pct
- delta vs C13c: 6
- fallback_to_c11: 58
- changed_vs_C11: 333
- helped_vs_C11: 131
- hurt_vs_C11: 67
- net_vs_C11: 64
- guard_saved_C13c_hurt: 7
- guard_lost_C13c_help: 1

## 产物

- Predictions: `[REDACTED_LOCAL_PATH]`
- Subject scores: `[REDACTED_LOCAL_PATH]`
- Type scores: `[REDACTED_LOCAL_PATH]`
- Policy sweep: `[REDACTED_LOCAL_PATH]`

## 题型分数

- abstraction_choice: 29/70 = 0.4143
- calculation_choice: 54/132 = 0.4091
- concept_choice: 390/967 = 0.4033
- negative_choice: 65/147 = 0.4422
- procedure_choice: 10/30 = 0.3333

## 最弱科目 Top 15

- urban_and_rural_planner: 10/46 = 0.2174
- advanced_mathematics: 5/19 = 0.2632
- accountant: 13/49 = 0.2653
- high_school_mathematics: 5/18 = 0.2778
- probability_and_statistics: 5/18 = 0.2778
- tax_accountant: 14/49 = 0.2857
- mao_zedong_thought: 7/24 = 0.2917
- art_studies: 10/33 = 0.3030
- discrete_mathematics: 5/16 = 0.3125
- middle_school_physics: 6/19 = 0.3158
- environmental_impact_assessment_engineer: 10/31 = 0.3226
- computer_architecture: 7/21 = 0.3333
- law: 8/24 = 0.3333
- metrology_engineer: 8/24 = 0.3333
- middle_school_biology: 7/21 = 0.3333

## 最强科目 Top 15

- marxism: 13/19 = 0.6842
- high_school_biology: 12/19 = 0.6316
- modern_chinese_history: 14/23 = 0.6087
- middle_school_history: 13/22 = 0.5909
- education_science: 17/29 = 0.5862
- computer_network: 11/19 = 0.5789
- high_school_politics: 11/19 = 0.5789
- ideological_and_moral_cultivation: 11/19 = 0.5789
- logic: 12/22 = 0.5455
- high_school_chinese: 10/19 = 0.5263
- high_school_physics: 10/19 = 0.5263
- fire_engineer: 16/31 = 0.5161
- middle_school_geography: 6/12 = 0.5000
- basic_medicine: 9/19 = 0.4737
- college_physics: 9/19 = 0.4737

## 判断

- C14 是比 C13c 更干净的“收益保守落地版”：542 → 548，又额外救回 6 题。
- 但 C14 的 guard 仍是启发式，不应过早写死进主流程；建议下一轮 C15 做 changed/hurt 样本的选项层解释，构造 contrast peer / negative guard，而不是继续靠 subject list。
- TermOnline 仍保留为解释/别名/contrast peer 来源，不直接用于 definition overlap 加分。