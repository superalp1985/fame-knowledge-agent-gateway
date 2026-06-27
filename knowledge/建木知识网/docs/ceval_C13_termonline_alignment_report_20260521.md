# C-Eval C13 TermOnline 术语定义驱动的选项语义对齐（2026-05-21）

## 目标

- 接 C11 最大错因 `semantic_or_option_alignment=665`。
- 使用 C12b 术语在线命中的 definition / English alias，只做选项语义对齐旁路，不改主知识库、不接最终生产判题。

## 输入

- C11 baseline runner: `[REDACTED_LOCAL_PATH]`
- C12b cards: `[REDACTED_LOCAL_PATH]`
- TermOnline enriched cards: 45/971

## 方法

- 保留 sidecar v2 rich 高召回层。
- 对命中的 route，如果 C12b card 有术语在线定义/英文别名，则抽取 definition、normative word、english alias、source quote。
- 用中文 2-4gram + 英文 token [REDACTED] A/B/C/D 选项做 overlap，对选项加轻量分。
- 只 sweep TermOnline evidence weight，避免把其它 baseline 改动混进结果。

## Weight sweep

- w=0.0: 542/1346 = 0.4027, delta=0, used=98, changed=0, helped=0, hurt=0
- w=0.25: 542/1346 = 0.4027, delta=0, used=98, changed=2, helped=0, hurt=0
- w=0.5: 542/1346 = 0.4027, delta=0, used=98, changed=2, helped=0, hurt=0
- w=0.75: 542/1346 = 0.4027, delta=0, used=98, changed=2, helped=0, hurt=0
- w=1.0: 541/1346 = 0.4019, delta=-1, used=98, changed=3, helped=0, hurt=1
- w=1.25: 541/1346 = 0.4019, delta=-1, used=98, changed=3, helped=0, hurt=1

## 采用版本

- best weight: 0.75
- total: 1346
- correct: 542
- accuracy: 0.4027
- delta vs no-term C13 baseline: 0
- term_used_questions: 98
- term_changed_predictions: 2
- term_helped: 0
- term_hurt: 0

## 产物

- Predictions: `[REDACTED_LOCAL_PATH]`
- Subject scores: `[REDACTED_LOCAL_PATH]`
- Type scores: `[REDACTED_LOCAL_PATH]`
- Weight sweep: `[REDACTED_LOCAL_PATH]`

## 错因粗分

- semantic_or_option_alignment: 550
- low_confidence: 107
- calculation_unhandled: 68
- negative_choice_misread: 67
- no_retrieval_hit: 12

## 题型分数

- abstraction_choice: 29/70 = 0.4143
- calculation_choice: 48/132 = 0.3636
- concept_choice: 390/967 = 0.4033
- negative_choice: 65/147 = 0.4422
- procedure_choice: 10/30 = 0.3333

## 最弱科目 Top 15

- advanced_mathematics: 4/19 = 0.2105
- urban_and_rural_planner: 10/46 = 0.2174
- probability_and_statistics: 4/18 = 0.2222
- accountant: 13/49 = 0.2653
- high_school_mathematics: 5/18 = 0.2778
- computer_architecture: 6/21 = 0.2857
- tax_accountant: 14/49 = 0.2857
- mao_zedong_thought: 7/24 = 0.2917
- art_studies: 10/33 = 0.3030
- discrete_mathematics: 5/16 = 0.3125
- middle_school_physics: 6/19 = 0.3158
- environmental_impact_assessment_engineer: 10/31 = 0.3226
- college_programming: 12/37 = 0.3243
- college_economics: 18/55 = 0.3273
- college_chemistry: 8/24 = 0.3333

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

- TermOnline 术语定义本轮没有带来净分数提升，说明仅靠定义 overlap 不足以解决 C11 的主错因；但旁路没有造成净伤害。
- 下一步 C14 应扩大高质量术语覆盖，并把 definition 证据转成 contrast peer / option entailment，而不是简单词面 overlap。