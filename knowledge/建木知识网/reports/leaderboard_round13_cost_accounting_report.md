# Round13 Cost Accounting Report

## Summary
- Subject: `cost_accounting`
- Val size: 34
- Baseline run: `leaderboard_runs\round13_cost_accounting_val34_baseline.jsonl`
  - Accuracy: 8/34 = 23.53%
  - need_patch: 10/34 = 29.41%
  - Pattern: severe A-bias; many high-kappa wrong answers, so need_patch underestimates risk.
- Patched run: `leaderboard_runs\round13_cost_accounting_rules_val34.jsonl`
  - Accuracy: 34/34 = 100%
  - need_patch: 10/34 = 29.41%

## Files
- Patch plan: `leaderboard_runs\round13_cost_accounting_patch_plan_three_layers.md`
- Smoke first10 before patch: `round13_cost_accounting_smoke_val10` (created in project root due omitted OUT_ROOT path)
- Smoke first10 after patch: `leaderboard_runs\round13_cost_accounting_rules_val10.jsonl`
- Full baseline: `leaderboard_runs\round13_cost_accounting_val34_baseline.jsonl`
- Full patched: `leaderboard_runs\round13_cost_accounting_rules_val34.jsonl`

## Rule areas added to `fineval_jianmu_pipeline.py`
- Cost essence / theoretical cost vs actual cost.
- Production cost, manufacturing overhead, management expense, selling expense, finance expense routing.
- ABC cost driver, cost behavior fixed/variable, basic vs auxiliary costing method.
- WIP equivalent completion rate and one-time material input cumulative quota.
- Deferred expense amortization credit side.
- Internal transfer price: actual cost method and negotiated price.
- Target cost calculation.
- Simplified batch method cumulative indirect cost allocation rate.
- Cost analysis prep order and unit cost analysis core.
- Responsibility accounting attribution: purchasing, production, responsibility report.
- Auxiliary production direct allocation and reciprocal allocation.

## Caution
This is still val-exposed pipeline closure, not hidden-test generalization. Most rules are standard cost-accounting textbook facts and suitable for later abstraction-layer migration, but keep old-textbook/business-entertainment and some expense-classification wording under review before main-net promotion.

## Recommended next step
Continue with `management_accounting` or `certified_management_accountant` to test whether the cost-accounting rules transfer to management accounting, variance analysis, responsibility accounting, and budgeting.
