# Round37 International Finance Report

## Summary
- Subject: `international_finance`
- Val size: 17
- Baseline: `leaderboard_runs\round37_international_finance_baseline_val.jsonl`
  - Judged: 17/17
  - Correct: 8/17 = 47.06%
  - Invalid: 0
  - need_patch: 11/17 = 64.71%
- Final patched: `leaderboard_runs\round37_international_finance_rules_val17.jsonl`
  - Judged: 17/17
  - Correct: 17/17 = 100%

## Files
- Patch plan: `leaderboard_runs\round37_international_finance_patch_plan_three_layers.md`
- Final run: `leaderboard_runs\round37_international_finance_rules_val17.jsonl`

## Coverage added
- FX management and RMB convertibility process.
- Exchange-rate/capital-flow relation, BOP surplus/deficit currency effects, direct/indirect quotation, BOP model comparative statics.
- American option and FX put option mechanics; expansionary monetary policy.
- World Bank Group item口径, reserve-currency requirements, international reserve features, BOP account scope.
- Jamaica vs Bretton Woods system, double leasing, Triffin credit reserve proposal.

## Cautions
- World Bank Group item gold says MIGA/multilateral investment guarantee agency is not a member. Real-world World Bank Group normally includes MIGA. Keep as FinEval item口径 only.
- BOP balance-sheet scope item uses combined `capital and financial account`; standalone `financial account` option is not selected by this item.

## Next recommended subject
`financial_engineering`, then `financial_markets` / `investments`.
