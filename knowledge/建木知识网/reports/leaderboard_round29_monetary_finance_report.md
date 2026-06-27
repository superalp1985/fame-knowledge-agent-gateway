# Round29 Monetary Finance Report

## Summary
- Subject: `monetary_finance`
- Val size: 43
- Baseline: `leaderboard_runs\round29_monetary_finance_baseline_val.jsonl`
  - Judged: 41/43
  - Correct: 10/41 = 24.39%
  - Invalid: 2
  - need_patch: 26/43 = 60.47%
- Final patched: `leaderboard_runs\round29_monetary_finance_rules_val43.jsonl`
  - Judged: 43/43
  - Correct: 43/43 = 100%

## Files
- Patch plan: `leaderboard_runs\round29_monetary_finance_patch_plan_three_layers.md`
- Final run: `leaderboard_runs\round29_monetary_finance_rules_val43.jsonl`

## Coverage added
- International balance of payments, current/capital accounts, debt service ratio.
- Keynesian/neutrality/Lucas monetary theory and money demand.
- Monetary policy operations, deposit reserve ratio, base money channels, money supply target.
- Commercial bank funding, off-balance-sheet lending commitments, liability business innovation.
- Inflation/deflation, interest-rate liberalization, credit expansion.
- Capital market functions, securities issuance, ordinary shares, discount issuance.
- World Bank Group, direct finance institutions, commercial bank assets/business scope, real bills doctrine, financial deepening.

## Cautions
- Financial institution main function item gold is `管理人民币流通`, which is more like a central bank function than a general financial-institution function. Kept as FinEval item口径.
- Commercial bank off-balance-sheet business item gold is `承诺业务`; although settlement/agency can also be off-balance-sheet/intermediary in broad teaching contexts, use the item’s narrower口径.

## Next recommended subject
Continue macro/economics branch: `macroeconomics`, then `microeconomics`/`international_economics`.
