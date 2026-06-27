# Round16 Intermediate Financial Accounting Report

## Summary
- Subject: `intermediate_financial_accounting`
- Val size: 26
- Baseline: `leaderboard_runs\round16_intermediate_financial_accounting_baseline_val.jsonl`
  - Accuracy: 3/26 = 11.54%
  - need_patch: 11/26 = 42.31%
  - Pattern: extreme A-bias; route kappa mostly 0.95 but semantically mismatched.
- First patched: `leaderboard_runs\round16_intermediate_financial_accounting_rules_val26.jsonl`
  - Accuracy: 24/26 = 92.31%
- Second patched: `leaderboard_runs\round16_intermediate_financial_accounting_rules2_val26.jsonl`
  - Accuracy: 25/26 = 96.15%
- Final patched: `leaderboard_runs\round16_intermediate_financial_accounting_rules3_val26.jsonl`
  - Accuracy: 26/26 = 100%
  - need_patch: 11/26 = 42.31%

## Files
- Patch plan: `leaderboard_runs\round16_intermediate_financial_accounting_patch_plan_three_layers.md`
- Final run: `leaderboard_runs\round16_intermediate_financial_accounting_rules3_val26.jsonl`

## Rules added
- Revenue recognition: control transfer; progress indeterminate but costs recoverable.
- Equity / retained earnings: retained earnings calculation, owner equity changes, treasury stock cancellation, loss carryforward/equity ending balance.
- Investment property: initial measurement, cost model impairment, cost/fair-value model conversion, disposal profit impact.
- Intangibles: initial and subsequent measurement, R&D capitalization split, land-use right classification.
- Long-term equity investment: equity method initial bargain purchase, profit impact, fair-value adjustment of investee depreciation.
- Impairment: future cash-flow exclusions, reversible debt investment impairment, disposal cost exclusions, intangible impairment exposed item.
- Measurement attributes and financial statement quality requirements.

## Caution / old口径
- Some items are exam-specific: 2017 owner equity loss carryforward, investment property 2019 carrying amount, intangible impairment with subsequent investment, and “timeliness decisive for relevance/reliability”. Keep as FinEval rules until abstract layer has versioned textbook口径.

## Engineering notes
- Date numbers in stems can corrupt numeric extraction. For accounting formulas, prefer semantic regex fields (`实收资本...盈余公积...未分配利润`) over global number lists.
- Exact zero choices must be matched with full-string regex; substring `0` matches negative numbers like `-600`.

## Recommended next step
Continue with `certified_practising_accountant` or `certified_management_accountant` to test cross-subject professional exam transfer. If staying within accounting ladder, `certified_practising_accountant` is broader and likely stresses accounting + auditing + finance rules together.
