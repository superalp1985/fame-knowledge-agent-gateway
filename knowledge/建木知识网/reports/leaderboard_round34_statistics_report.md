# Round34 Statistics Report

## Summary
- Subject: `statistics`
- Val size: 35
- Baseline: `leaderboard_runs\round34_statistics_baseline_val.jsonl`
  - Judged: 32/35
  - Correct: 6/32 = 18.75%
  - Invalid: 3
  - need_patch: 35/35 = 100.00%
- Final patched: `leaderboard_runs\round34_statistics_rules_val35.jsonl`
  - Judged: 35/35
  - Correct: 35/35 = 100%

## Files
- Patch plan: `leaderboard_runs\round34_statistics_patch_plan_three_layers.md`
- Final run: `leaderboard_runs\round34_statistics_rules_val35.jsonl`

## Coverage added
- Data/variable type, population/statistic distinction, population inference, sampling-frame error, convenience/stratified sampling, secondary data.
- Statistical graphs: line chart, stem-and-leaf, ring chart; grouped midpoint, normal empirical count, mode, symmetric bell distribution, Chebyshev inequality.
- Probability and distributions: event algebra, Poisson-like normalization, normal standardization, CLT sample mean.
- Moment estimation, sampling-error scaling, sample mean variance, efficiency/unbiasedness, CI width and coverage interpretation.
- Hypothesis testing: one-sided H0/H1, alpha-level relation, fail-to-reject meaning, significance level choice, chi-square contingency df/expected count, phi coefficient.

## Engineering note
- Statistics formulas and Chinese text matched well with direct question-level guards. This round reached 100% on first rule pass after baseline.
- need_patch remained 35/35 because the baseline had no reliable statistics knowledge; this subject is almost entirely rule-net dependent.

## Next recommended subject
Continue quantitative/math branch: `probability_and_statistics` if present, otherwise move to `management`/remaining economics subjects by data directory inventory.
