# C-Eval C16：negative + route-noise 二级 guard（2026-05-21）

## 目标

- 在 C14 548/1346 基础上，只保留 C16 sweep 中真实正收益且可解释的规则。
- 避免把过宽的 formula/numeric guard 接入评分，因为 sweep 证明它们会吞掉大量 C14 正收益。

## 规则

当且仅当：
1. C14 相对 C11 改变了预测；
2. 题型/题干为 negative choice；
3. top5 ceval route 存在，但没有本学科 route，属于 off-subject route noise；
则回退 C11。

## Policy sweep 摘要

- C14: 548/1346 = 0.4071, fallback=0, saved=0, lost=0, net=0
- negative_only_fallback: 544/1346 = 0.4042, fallback=35, saved=10, lost=14, net=-4
- formula_question_fallback: 484/1346 = 0.3596, fallback=333, saved=67, lost=131, net=-64
- formula_options_fallback: 543/1346 = 0.4034, fallback=22, saved=6, lost=11, net=-5
- numeric_options_fallback: 538/1346 = 0.3997, fallback=76, saved=19, lost=29, net=-10
- route_noise_negative_fallback: 549/1346 = 0.4079, fallback=12, saved=4, lost=3, net=1
- route_noise_formula_fallback: 539/1346 = 0.4004, fallback=145, saved=35, lost=44, net=-9
- strict_symbol_guard: 536/1346 = 0.3982, fallback=77, saved=18, lost=30, net=-12
- concept_formula_guard: 496/1346 = 0.3685, fallback=256, saved=49, lost=101, net=-52

## C16 结果

- correct: 549/1346
- accuracy: 0.4079
- delta vs C11: 65 / +4.83 pct
- delta vs C14: 1
- fallback_to_C11: 12
- changed_vs_C11: 321
- guard_saved_C14_hurt: 4
- guard_lost_C14_help: 3

## 产物

- Predictions: `[REDACTED_LOCAL_PATH]`
- Subject scores: `[REDACTED_LOCAL_PATH]`
- Type scores: `[REDACTED_LOCAL_PATH]`
- Sweep: `[REDACTED_LOCAL_PATH]`

## 判断

- C16 只多救 1 题，但重要的是证明“guard 必须极窄”；宽泛的公式/数字/无本学科 route 回退都会明显降分。
- 下一步 C17 更值得做 contrast peer 草案：针对 C14/C16 剩余 hurt 的正确选项与误选项，抽取区别条件，而不是继续调 overlap 权重。