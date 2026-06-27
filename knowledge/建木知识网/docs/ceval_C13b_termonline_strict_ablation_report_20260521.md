# C-Eval C13b TermOnline 严格消融：只加术语证据，不改 C11 tokenizer（2026-05-21）

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
- 严格复用 C11 tokenizer；TermOnline 证据只用同一 token [REDACTED] A/B/C/D 选项做 overlap。
- 只 sweep TermOnline evidence weight，避免把其它 baseline 改动混进结果。

## Weight sweep

- w=0.0: 484/1346 = 0.3596, delta=0, used=71, changed=0, helped=0, hurt=0
- w=0.25: 484/1346 = 0.3596, delta=0, used=71, changed=0, helped=0, hurt=0
- w=0.5: 484/1346 = 0.3596, delta=0, used=71, changed=0, helped=0, hurt=0
- w=0.75: 484/1346 = 0.3596, delta=0, used=71, changed=0, helped=0, hurt=0
- w=1.0: 484/1346 = 0.3596, delta=0, used=71, changed=1, helped=0, hurt=0
- w=1.25: 484/1346 = 0.3596, delta=0, used=71, changed=1, helped=0, hurt=0

## 采用版本

- best weight: 0.75
- total: 1346
- correct: 484
- accuracy: 0.3596
- delta vs no-term C13 baseline: 0
- term_used_questions: 71
- term_changed_predictions: 0
- term_helped: 0
- term_hurt: 0

## 产物

- Predictions: `[REDACTED_LOCAL_PATH]`
- Subject scores: `[REDACTED_LOCAL_PATH]`
- Type scores: `[REDACTED_LOCAL_PATH]`
- Weight sweep: `[REDACTED_LOCAL_PATH]`

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

- TermOnline 术语定义本轮没有带来净分数提升，说明仅靠定义 overlap 不足以解决 C11 的主错因；但旁路没有造成净伤害。
- 下一步 C14 应扩大高质量术语覆盖，并把 definition 证据转成 contrast peer / option entailment，而不是简单词面 overlap。