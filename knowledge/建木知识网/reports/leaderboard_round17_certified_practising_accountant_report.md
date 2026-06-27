# Round17 Certified Practising Accountant Report

## Summary
- Subject: `certified_practising_accountant`
- Val size: 34
- Baseline: `leaderboard_runs\round17_certified_practising_accountant_baseline_val.jsonl`
  - Accuracy: 8/34 = 23.53%
  - need_patch: 9/34 = 26.47%
  - Pattern: mixed CPA-style auditing + tax law; baseline still severe A-bias and high-kappa mismatches.
- Final patched: `leaderboard_runs\round17_certified_practising_accountant_rules_val34.jsonl`
  - Accuracy: 34/34 = 100%
  - need_patch: 9/34 = 26.47%

## Files
- Patch plan: `leaderboard_runs\round17_certified_practising_accountant_patch_plan_three_layers.md`
- Final run: `leaderboard_runs\round17_certified_practising_accountant_rules_val34.jsonl`

## Rules added
### Auditing
- Confirmation reply reliability, statistical/non-statistical sampling, control-test sample size, due diligence understanding, special risk, governance communication, control tests vs substantive procedures, predecessor auditor, financial-statement-level RMM, opening balances, fraud responsibility, laws/regulations, expert work, accounting estimate retrospective review.

### Tax law
- Securities transaction stamp tax sharing, VAT 13% and leasing service classification, consumption tax deduction/taxable goods, small low-profit enterprise income tax, IIT interest and special additional deduction, urban maintenance/construction tax, customs duty recovery period and customs valuation, resource tax exemption, urban land use tax, property tax, deed tax, land appreciation tax, vehicle/vessel tax, transportation contract stamp tax, APA interquartile method.

## Caution
Tax law rules are highly date/version sensitive. Keep them as FinEval/CPA 2020-ish exam口径; do not treat them as current tax advice or promote blindly to general law knowledge without version tags.

## Transfer observation
This subject mostly required new auditing/tax details rather than accounting transfer. Earlier auditing rules helped the shape, but CPA tax law is a separate branch and should likely be expanded next with `tax_law` for a dedicated tax closure.

## Recommended next step
Run `tax_law` next to consolidate the tax branch, or `certified_management_accountant` if the goal is to test management/cost accounting transfer. Recommendation: `tax_law`, because CPA exposed many tax-law-specific leaves and version口径 risks.
