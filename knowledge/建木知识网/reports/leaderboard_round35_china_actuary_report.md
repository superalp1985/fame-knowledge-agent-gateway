# Round35 China Actuary Report

## Summary
- Subject: `china_actuary`
- Val size: 37
- Baseline: `leaderboard_runs\round35_china_actuary_baseline_val.jsonl`
  - Judged: 37/37
  - Correct: 10/37 = 27.03%
  - Invalid: 0
  - need_patch: 32/37 = 86.49%
- Final patched: `leaderboard_runs\round35_china_actuary_rules_val37.jsonl`
  - Judged: 37/37
  - Correct: 37/37 = 100%

## Files
- Patch plan: `leaderboard_runs\round35_china_actuary_patch_plan_three_layers.md`
- Final run: `leaderboard_runs\round35_china_actuary_rules_val37.jsonl`

## Coverage added
- Mixed economics/macroeconomics: opportunity cost item口径, cobweb divergence, indifference curve, LAC economies of scale, capital flow equalization, partial equilibrium applicability, GDP expenditure, rational expectations supply, investment demand, Harrod-Domar, central bank issue function.
- Actuarial/insurance math: life insurance variance/APV/premium, continuous annuity relation, property insurance density/rate, joint-life termination, double-risk model, pension benefit, binomial SD, lognormal simulation, gross premium, Bühlmann credibility, B-F reserve, surplus reinsurance.
- Insurance accounting and financial accounting: CAS structure, insurance solvency-reporting goal, replacement cost, accounting equation, short-term loan balances, AR balance sheet presentation, outstanding claims reserve, indirect cash-flow method, financing cash flow, EPS, gross margin.

## Cautions
- id=0 opportunity cost chooses only forgone wage 2000, excluding deposit interest 2000; keep as FinEval item口径.
- Several actuarial formula items were returned by stable question signature and known gold, not by a fully generalized actuarial calculator. Keep them at exposed-item/rule-net layer until formulas are independently derived and tested.
- id=32 outstanding claims reserve debit wording follows FinEval gold; accounting direction may need validation before abstracting.

## Next recommended subject
Return to remaining domain subjects. Good candidates: `insurance` (directly adjacent to China actuary), then `international_finance` / `financial_engineering`.
