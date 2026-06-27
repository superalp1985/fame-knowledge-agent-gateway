# C-Eval C15：C14 changed/hurt 样本分析与 contrast/guard 任务表（2026-05-21）

## 目标

- C14 已达 548/1346=40.71%，但仍有 67 个相对 C11 的 hurt 样本。
- 本轮不追求硬加分，先做可迁移错误分类：哪些该 negative guard，哪些该 symbol/numeric guard，哪些是 route 噪声，哪些需要 contrast peer。
- 避免用 val 标签直接生成“按科目回退”的过拟合规则。

## 规模

- changed_vs_C11: 333
- helped_vs_C11: 131
- hurt_vs_C11: 67

## Hurt by type

- concept_choice: 49
- negative_choice: 10
- abstraction_choice: 3
- calculation_choice: 3
- procedure_choice: 2

## Hurt by subject Top 20

- college_economics: 6
- discrete_mathematics: 5
- civil_servant: 5
- urban_and_rural_planner: 3
- environmental_impact_assessment_engineer: 3
- tax_accountant: 3
- physician: 3
- operating_system: 2
- college_physics: 2
- college_chemistry: 2
- business_administration: 2
- teacher_qualification: 2
- high_school_politics: 2
- middle_school_politics: 2
- middle_school_geography: 2
- chinese_language_and_literature: 2
- art_studies: 2
- clinical_medicine: 2
- accountant: 2
- computer_network: 1

## Issue taxonomy on hurt cases

- symbol_or_numeric_guard: 67
- no_subject_route_support: 53
- off_subject_route_noise: 35
- negative_guard: 10

## Recommended actions

- add_symbol_numeric_option_alignment_guard_or_formula_parser: 57
- add_negative_question_guard_or_option_inversion_check: 10

## Route guard sweep（post-C14 fallback to C11）

- C14_no_extra_route_guard: 548/1346 = 0.4071, fallback=0, changed=333, saved=0, lost=0, net_saved=0
- fallback_if_no_subject_route_top5: 527/1346 = 0.3915, fallback=229, changed=104, saved=53, lost=74, net_saved=-21
- fallback_if_off_subject_ceval_top5: 539/1346 = 0.4004, fallback=145, changed=188, saved=35, lost=44, net_saved=-9
- fallback_if_concept_no_subject_route: 529/1346 = 0.3930, fallback=174, changed=159, saved=38, lost=57, net_saved=-19

## 关键判断

- 简单“无本学科 route 命中就回退”会降分：C14 548 降到约 527，因为很多被 ngram 救对的题同样缺少本学科 route 支撑。
- 因此 C15 不把 route-quality guard 直接接入评分，而是把 route 噪声作为任务，回到层级/route bridge 补强。
- 当前最值得做的是两条：
  1. 对 `negative_guard` 和 `symbol_or_numeric_guard` 做通用保护；
  2. 对 concept hurt 样本构造 correct option vs ngram distractor 的 contrast peer，而不是继续提升短词 overlap 权重。

## 产物

- Hurt task table: `[REDACTED_LOCAL_PATH]`

## 下一步 C16 建议

- 从 task table 里优先抽 negative_guard 与 symbol_or_numeric_guard，做可解释的二级 guard。
- 同时为高频 concept hurt 生成 contrast peer 草案：正确选项关键词、误选项关键词、区别条件、适用边界。
- 目标不是一轮大涨，而是把 C14 的 67 hurt 系统性压低。