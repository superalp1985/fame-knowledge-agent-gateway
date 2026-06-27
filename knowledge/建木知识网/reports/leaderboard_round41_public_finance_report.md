# Round41 Public Finance Report

## Summary
- Subject: `public_finance`
- Val size: 40
- Baseline: `leaderboard_runs\round41_public_finance_baseline_val.jsonl`
  - Judged: 38/40
  - Correct: 8/38 = 21.05%
  - Invalid: 2
  - need_patch: 17/40 = 42.50%
- First rules: `leaderboard_runs\round41_public_finance_rules_val40.jsonl`
  - 39/40 = 97.50%
- Final patched: `leaderboard_runs\round41_public_finance_rules5_val40.jsonl`
  - Judged: 40/40
  - Correct: 40/40 = 100%

## Files
- Patch plan: `leaderboard_runs\round41_public_finance_patch_plan_three_layers.md`
- Final run: `leaderboard_runs\round41_public_finance_rules5_val40.jsonl`

## Coverage added
- Taxation and trade: supply-side tax view, Laffer curve, reinvestment tax refund, import taxes, consumption tax, resource tax, external debt ratios/structure, terms of trade, preferential trade arrangements, income distribution fairness, dividend/interest taxable income.
- Intergovernmental fiscal relations and debt: central/local functions, local public goods spillovers, responsibility/fiscal power division, debt repayment ratio, debt dependency, public bond sale mode, local fiscal-policy role, debt scale factors, budget system and composition, tax expenditure, bond interest.
- Fiscal policy/public finance: automatic stabilizer, contractionary/expansionary fiscal policy, fiscal imbalance causes, policy goals, public expenditure micro-adjustment, stabilization tools, public finance functions/features, public goods/types/demand, market pricing.

## Engineering note
- Final miss was id=33 market pricing: the decisive text `服装行业` was in option D, not in the question. Question-only guards failed. Added a joined-options-level guard after `joined` is built.
- This is a useful pattern: when a rule depends on option set composition rather than question wording, use `joined`, not only `q`.

## Cautions
- id=20 fiscal-policy tool gold is `增发货币`, which is more monetary-policy-like; keep as item口径.
- id=29 public-finance feature exclusion and id=38 tax expenditure to legislative organ are item口径 and should not be overgeneralized.

## Next recommended subject
`tax_law`, then `economic_law`.
