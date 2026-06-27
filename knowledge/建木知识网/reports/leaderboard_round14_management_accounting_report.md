# Round14 Management Accounting Report

## Summary
- Subject: `management_accounting`
- Val size: 29
- Baseline: `leaderboard_runs\round14_management_accounting_baseline_val.jsonl`
  - Accuracy: 7/29 = 24.14%
  - need_patch: 7/29 = 24.14%
  - Pattern: severe A-bias; most wrong answers were high-kappa route mismatches.
- First patched: `leaderboard_runs\round14_management_accounting_rules_val29.jsonl`
  - Accuracy: 28/29 = 96.55%
  - Remaining error: rule for “变动成本率=可变成本÷产量” matched “可变成本×产量” because it only searched `可变成本` + `产量`.
- Final patched: `leaderboard_runs\round14_management_accounting_rules2_val29.jsonl`
  - Accuracy: 29/29 = 100%
  - need_patch: 7/29 = 24.14%

## Files
- Patch plan: `leaderboard_runs\round14_management_accounting_patch_plan_three_layers.md`
- Final run: `leaderboard_runs\round14_management_accounting_rules2_val29.jsonl`

## Notes
This subject is mislabeled/heterogeneous: many items are advanced financial accounting, consolidated statements, lease accounting, tax basis, company law, and liquidation reporting, not pure management accounting. Useful transfer targets: `advanced_financial_accounting`, `intermediate_financial_accounting`, `certified_management_accountant`.

## Rules added
- Management accounting basics: financial vs management accounting, cost management, cost behavior, variable costing, CVP.
- Advanced accounting: deferred tax/tax basis, segment reports, interim reports, leases, business combinations, consolidation eliminations, consolidated cash flow, foreign currency translation, liquidation reports.
- Measurement: derivatives under trading financial assets use fair value.

## Caution
Several rules use old-textbook/exam口径: old Company Law minimum registered capital 5 million RMB, operating lease lessee initial direct costs expensed, interim reporting independent view, and liquidation cash-flow statement exclusion. Keep these as exam rules until abstract layer is explicitly versioned.
