# Round28 Central Banking Report

## Summary
- Subject: `central_banking`
- Val size: 28
- Baseline: `leaderboard_runs\round28_central_banking_baseline_val.jsonl`
  - Judged: 23/28
  - Correct: 6/23 = 26.09%
  - Invalid: 5
  - need_patch: 21/28 = 75.00%
- Final patched: `leaderboard_runs\round28_central_banking_rules_val28.jsonl`
  - Judged: 28/28
  - Correct: 28/28 = 100%
  - need_patch: 20/28 = 71.43%

## Files
- Patch plan: `leaderboard_runs\round28_central_banking_patch_plan_three_layers.md`
- Final run: `leaderboard_runs\round28_central_banking_rules_val28.jsonl`

## Coverage added
- Central bank business, deposit reserve, currency issuance/carrying, securities operations, FX reserves.
- Payment and clearing systems: gross/net settlement, CHIPS, TARGET, payment credit risk.
- Monetary statistics and national accounts: monetary survey, IIP, GDP/GNP relation, flow-of-funds balance.
- Monetary policy goals, intermediate indicators, interest-rate indicator properties, money multiplier, Mundell policy mix.

## Caution
- Mundell policy mix item follows FinEval gold: balance-of-payments surplus plus serious domestic inflation → expansionary monetary policy + contractionary fiscal policy. This may be counterintuitive depending on policy-target assignment conventions; keep wording as item口径.

## Next recommended subject
`monetary_finance`, directly adjacent to central banking and likely to reuse this branch.
