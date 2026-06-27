# Round40 Investments Report

## Summary
- Subject: `investments`
- Val size: 38
- Baseline: `leaderboard_runs\round40_investments_baseline_val.jsonl`
  - Judged: 38/38
  - Correct: 38/38 = 100%
  - Invalid: 0
  - need_patch: 26/38 = 68.42%
- No additional rules were added.

## Files
- Patch plan / migration note: `leaderboard_runs\round40_investments_patch_plan_three_layers.md`
- Baseline run: `leaderboard_runs\round40_investments_baseline_val.jsonl`

## Interpretation
This is the third consecutive finance/investment transfer validation subject after financial_engineering and financial_markets. Existing rules cover investment theory, bonds, equities, derivatives, and portfolio metrics well enough for this val set.

## Coverage confirmed
- CAPM/SML/factor tests/beta/Sharpe/performance timing.
- Bond clean/full price, accrued interest, YTM, duration/modified duration, default spread, zero-coupon/forward-rate pricing.
- Equity valuation via DDM/holding return/DCF/accounting ratios.
- Convertible bonds, conversion value and premium.
- Arbitrage and stripped cash-flow reconstruction.
- Stock indexes, market-cap weighting, T-bills, ADRs, political risk.
- Options/futures hedge ratio, put breakeven, call rights, gold futures positions.

## Engineering decision
No patch for already-100 transfer subject.

## Next recommended subject
Move out of the now-validated finance/investments chain. Good next candidates: `public_finance`, `tax_law`, or `economic_law`.
