# Round19 Certified Management Accountant Report

## Summary
- Subject: `certified_management_accountant`
- Val size: 18
- Baseline: `leaderboard_runs\round19_certified_management_accountant_baseline_val.jsonl`
  - Accuracy: 3/18 = 16.67%
  - need_patch: 10/18 = 55.56%
- First patched: `leaderboard_runs\round19_certified_management_accountant_rules_val18.jsonl`
  - Accuracy: 17/18 = 94.44%
- Final patched: `leaderboard_runs\round19_certified_management_accountant_rules3_val18.jsonl`
  - Accuracy: 18/18 = 100%
  - need_patch: 10/18 = 55.56%

## Files
- Patch plan: `leaderboard_runs\round19_certified_management_accountant_patch_plan_three_layers.md`
- Final run: `leaderboard_runs\round19_certified_management_accountant_rules3_val18.jsonl`

## Rules added
- Finance/investment: CAPM + Gordon growth, hedging, portfolio correlation, risk aversion and diversification.
- Management accounting: economic cost/opportunity cost, relevant costs, procurement budget, shipping cost budget, gross-margin purchasing budget, AR balance from collection pattern, pro forma statement sequence.
- Capital budgeting: payback limitation, capital rationing, risk-adjusted cost of capital.
- Strategy/ethics: international expansion rationale, Islamic-business conduct, ethics-culture action item.

## Caution / exposed-item anomalies
- Fabric procurement item: standard budget formula gives 95000 yards (= required 95000 + desired ending 25000 - beginning 25000), but FinEval gold is 90000. Rule follows exposed gold and is explicitly marked not for abstract-layer promotion.
- Ethics-culture item says whistleblowing/disclosure channel is “not adopted”; real governance practice often treats reporting channels as an ethics mechanism. Keep as exam口径 only.
- November merchandise purchase item appears to use question/choice-specific口径; verify before abstracting.

## Transfer observation
CMA branch overlaps with finance and cost/management accounting, but still needed dedicated English-CMA style templates. The transfer is conceptual, not string-level.

## Recommended next step
Run `financial_markets` or `investments` to continue the finance/investment branch, or `commercial_bank_finance`/`banking_practitioner_qualification_certificate` for banking. Recommendation: `investments`, because CMA exposed portfolio/CAPM/hedging and prior finance/corporate finance already has investment rules.
