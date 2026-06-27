# Round38 Financial Engineering Report

## Summary
- Subject: `financial_engineering`
- Val size: 26
- Baseline: `leaderboard_runs\round38_financial_engineering_baseline_val.jsonl`
  - Judged: 26/26
  - Correct: 26/26 = 100%
  - Invalid: 0
  - need_patch: 20/26 = 76.92%
- No additional rules were added.

## Files
- Patch plan / migration note: `leaderboard_runs\round38_financial_engineering_patch_plan_three_layers.md`
- Baseline run: `leaderboard_runs\round38_financial_engineering_baseline_val.jsonl`

## Interpretation
This was a migration validation round. Existing rules from futures, international finance, statistics, and derivatives/option knowledge already cover the subject fully.

## Coverage confirmed
- Options, forwards, futures, swaps, convertible bonds.
- Intrinsic/time value, American option, put/call hedge ratio relation.
- Forward hedge revenue, FX option hedge decision, bear spread payoff.
- Futures margin, open interest, standardization, interest-rate futures hedge.
- No-arbitrage derivative pricing assumptions.

## Engineering decision
Do not add exposed-item rules for a subject already at 100%. Keep pipeline cleaner and treat this as evidence of cross-subject transfer.

## Next recommended subject
`financial_markets`, then `investments`.
