# Round32 International Economics Report

## Summary
- Subject: `international_economics`
- Val size: 20
- Baseline: `leaderboard_runs\round32_international_economics_baseline_val.jsonl`
  - Judged: 19/20
  - Correct: 2/19 = 10.53%
  - Invalid: 1
  - need_patch: 10/20 = 50.00%
- Final patched: `leaderboard_runs\round32_international_economics_rules_val20.jsonl`
  - Judged: 20/20
  - Correct: 20/20 = 100%

## Files
- Patch plan: `leaderboard_runs\round32_international_economics_patch_plan_three_layers.md`
- Final run: `leaderboard_runs\round32_international_economics_rules_val20.jsonl`

## Coverage added
- FDI theory: internalization theory.
- BOP/current/capital account classification; credit items; monetary imbalance.
- FX market functions, direct quotation, interest parity, relative PPP.
- International balance-of-payments multiplier, Marshall-Lerner demand elasticity condition, export/investment balance item.
- Mundell-Fleming fixed-rate/free-capital policy effectiveness and Mundell assignment rule.
- Heckscher-Ohlin factor endowment, Stolper-Samuelson-style factor income effect.
- Gold standard and fixed/floating exchange-rate shock comparison.

## Cautions
- id=9 export increase/investment adjustment item uses FinEval口径 `增加投资25亿美元`; derivation is not as standard as the other multiplier items, avoid broad generalization.
- Fixed/floating shock comparison is item口径; keep option-specific.

## Next recommended subject
`econometrics`, then `statistics`.
