# Round39 Financial Markets Report

## Summary
- Subject: `financial_markets`
- Val size: 39
- Baseline: `leaderboard_runs\round39_financial_markets_baseline_val.jsonl`
  - Judged: 39/39
  - Correct: 39/39 = 100%
  - Invalid: 0
  - need_patch: 23/39 = 58.97%
- No additional rules were added.

## Files
- Patch plan / migration note: `leaderboard_runs\round39_financial_markets_patch_plan_three_layers.md`
- Baseline run: `leaderboard_runs\round39_financial_markets_baseline_val.jsonl`

## Interpretation
This was a migration validation round. Existing finance, derivatives, international finance, and investments-related rules already covered the subject fully.

## Coverage confirmed
- Asset allocation, tactical/strategic allocation, CML.
- DDM/DCF/PE/CAPM/ROE-growth stock valuation.
- Non-systematic risk, CAPM, MM theorem, semi-strong EMH.
- Bond duration and price-yield relation.
- Futures/options hedging, basis, FX put, gold futures arbitrage.
- International finance: mint parity, BOP surplus/currency, real interest rate, FX quote P&L.
- Securitization: ABS/CDO/CMBS/MBS and securitizable assets.

## Engineering decision
Do not patch already-100 transfer subjects. Keep this as transfer evidence.

## Next recommended subject
`investments`.
