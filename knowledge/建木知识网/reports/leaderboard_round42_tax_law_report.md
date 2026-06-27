# Round42 Tax Law Report

## Summary
- Subject: `tax_law`
- Val size: 45
- Baseline: `leaderboard_runs\round42_tax_law_baseline_val.jsonl`
  - Judged: 45/45
  - Correct: 45/45 = 100%
  - Invalid: 0
  - need_patch: 27/45 = 60.00%
- No additional rules were added.

## Files
- Patch plan / migration note: `leaderboard_runs\round42_tax_law_patch_plan_three_layers.md`
- Baseline run: `leaderboard_runs\round42_tax_law_baseline_val.jsonl`

## Interpretation
This is a migration validation round for public-finance/tax/accounting rules. Existing rules already cover all val items.

## Coverage confirmed
- Customs late-payment surcharge, city maintenance and construction tax.
- IIT categories/deductions/original value/limited shares.
- EIT resident/nonresident, revenue timing, donation income, deductible expenses, foreign tax credit, representative office deemed profit.
- Consumption tax and VAT rules.
- Tax administration, hearing, penalty-setting power, reconsideration/litigation, registration/declaration/withholding/pledge.
- Vehicle purchase tax and real estate tax calculations.
- Basic tax-law principles and legal relations.

## Engineering decision
No patch for already-100 transfer subject.

## Next recommended subject
`economic_law`.
