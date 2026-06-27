# Round15 Advanced Financial Accounting Report

## Summary
- Subject: `advanced_financial_accounting`
- Val size: 21
- Baseline: `leaderboard_runs\round15_advanced_financial_accounting_baseline_val.jsonl`
  - Judged: 20/21
  - Accuracy: 3/20 = 15.00%
  - need_patch: 7/21 = 33.33%
  - Pattern: A-bias plus one invalid answer; most misses were high-kappa route mismatches.
- First patched: `leaderboard_runs\round15_advanced_financial_accounting_rules_val21.jsonl`
  - Accuracy: 20/21 = 95.24%
- Final patched: `leaderboard_runs\round15_advanced_financial_accounting_rules3_val21.jsonl`
  - Accuracy: 21/21 = 100%
  - need_patch: 7/21 = 33.33%

## Files
- Patch plan: `leaderboard_runs\round15_advanced_financial_accounting_patch_plan_three_layers.md`
- Final run: `leaderboard_runs\round15_advanced_financial_accounting_rules3_val21.jsonl`

## Rules added
- Consolidation: non-controlling interest, group internal transactions, consolidation elimination entries.
- Foreign currency: functional currency, spot rate, exchange differences, untranslated retained earnings.
- Income tax: deferred tax liability calculation, balance sheet liability method date, temporary difference.
- Lease accounting: finance lease definition, breach penalty account, sale-and-leaseback operating lease deferred gain/loss allocation.
- Interim reports, segment-style reporting overlap, monetary assets, derivatives/fair value hedge, inflation accounting.

## Caution / old口径
- “出租人出资向供货人购买租赁物并租给承租人、承租人分期付租” is treated by this item as `融资租赁`, not `直接租赁`; do not overfit the word “直接” from lease subtypes without checking教材语境.
- Semiannual financial report audit, operating lease initial direct costs, and liquidation/currency/inflation rules may be old-exam textbook口径.

## Recommended next step
Continue with `intermediate_financial_accounting` to test accounting + advanced financial accounting transfer, or `certified_practising_accountant` if we want a broader professional-exam mixed subject.
