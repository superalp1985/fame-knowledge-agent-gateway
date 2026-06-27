# Round31 Microeconomics Report

## Summary
- Subject: `microeconomics`
- Val size: 40
- Baseline: `leaderboard_runs\round31_microeconomics_baseline_val.jsonl`
  - Judged: 37/40
  - Correct: 11/37 = 29.73%
  - Invalid: 3
  - need_patch: 33/40 = 82.50%
- Final patched: `leaderboard_runs\round31_microeconomics_rules_val40.jsonl`
  - Judged: 40/40
  - Correct: 40/40 = 100%
  - need_patch: 32/40 = 80.00%

## Files
- Patch plan: `leaderboard_runs\round31_microeconomics_patch_plan_three_layers.md`
- Final run: `leaderboard_runs\round31_microeconomics_rules_val40.jsonl`

## Coverage added
- Firm theory, loss-minimizing production, perfect competition, imperfect competition, factor demand, labor supply, monopoly input condition.
- General/partial equilibrium, Pareto efficiency, externalities, asymmetric information, public goods, Pigouvian tax, rent seeking.
- Game theory: Cournot, prisoner’s dilemma, finite repeated game, payoff.
- Cost curves, long-run equilibrium, increasing-cost industry, AVC/MC relation, VC curve, marginal product, returns to scale.
- Consumer theory, MRS and relative prices, inferior goods, satiation, support price, law of demand.

## Cautions
- id=6: product price rise in perfect competition should generally increase VMP and shift labor demand right; FinEval option/gold says VMP increases but labor demand left. Kept as item-level口径.
- id=17: public goods item gold selects “internality”; standard issue is non-excludability/non-rivalry. Kept as item-level口径.
- id=27/28: long-run equilibrium and LMC/LAC wording has textbook/translation roughness; followed FinEval gold.

## Next recommended subject
`international_economics`, then `econometrics`/`statistics`.
