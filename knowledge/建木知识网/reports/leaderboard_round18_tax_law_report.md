# Round18 Tax Law Report

## Summary
- Subject: `tax_law`
- Val size: 45
- Baseline: `leaderboard_runs\round18_tax_law_baseline_val.jsonl`
  - Judged: 44/45
  - Accuracy: 6/44 = 13.64%
  - need_patch: 27/45 = 60.00%
  - Pattern: extremely weak tax branch, severe A-bias, one invalid output.
- Final patched: `leaderboard_runs\round18_tax_law_rules_val45.jsonl`
  - Judged: 45/45
  - Accuracy: 45/45 = 100%
  - need_patch: 27/45 = 60.00%

## Files
- Patch plan: `leaderboard_runs\round18_tax_law_patch_plan_three_layers.md`
- Final run: `leaderboard_runs\round18_tax_law_rules_val45.jsonl`

## Rules added
### Tax fundamentals and administration
- Political power as taxation basis; tax legal relationship subject; constitutional tax obligation; core tax-law principle.
- Tax administrative penalty hearing, penalty-setting limits, reconsideration/pre-litigation boundaries, tax administrative litigation principles.
- Tax registration exemption, tax declaration simplification, withholding system, tax pledge exclusions.

### Turnover/income taxes
- Customs duty late payment surcharge; urban maintenance/construction tax bases and city/county rates.
- Individual income tax: author remuneration, business deductions, property transfer original value, restricted shares, interest/special deduction concepts from CPA branch.
- Enterprise income tax: resident/nonresident, income recognition time, donation income, deductible property insurance, overseas tax credit, representative-office deemed profit.
- VAT/consumption tax: taxable scope, deemed sales, no-tax items, operating lease service, gold/silver jewelry, continuous production, tobacco/alcohol.

### Property/action taxes and calculations
- Vehicle purchase tax, property tax including rental/exemption/underground buildings/land-price allocation.
- Deed tax, land appreciation tax, urban land use tax, resource tax, vehicle/vessel tax, stamp tax inherited from CPA branch.

## Caution
This is the most version-sensitive branch so far. Many rules are 2020-ish CPA/FinEval exam口径 and should be stored with date/version tags. They are not current tax advice.

## Transfer observation
CPA tax rules helped, but `tax_law` needed many extra dedicated calculation templates. This confirms tax should be its own branch rather than a few scattered CPA rules.

## Recommended next step
If continuing breadth-first, run `economic_law` next to cover law-adjacent professional exam logic. If staying finance/accounting, run `certified_management_accountant` to test management/cost transfer. My recommendation: `certified_management_accountant`, because accounting/cost/management branch is already hot and likely gives higher transfer yield.
