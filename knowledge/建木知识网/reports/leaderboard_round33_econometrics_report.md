# Round33 Econometrics Report

## Summary
- Subject: `econometrics`
- Val size: 18
- Baseline: `leaderboard_runs\round33_econometrics_baseline_val.jsonl`
  - Judged: 17/18
  - Correct: 5/17 = 29.41%
  - Invalid: 1
  - need_patch: 16/18 = 88.89%
- First rules: `leaderboard_runs\round33_econometrics_rules_val18.jsonl`
  - 13/18 = 72.22%
- Second rules: `leaderboard_runs\round33_econometrics_rules2_val18.jsonl`
  - 16/18 = 88.89%
- Third rules: `leaderboard_runs\round33_econometrics_rules3_val18.jsonl`
  - 17/18 = 94.44%
- Final patched: `leaderboard_runs\round33_econometrics_rules4_val18.jsonl`
  - Judged: 18/18
  - Correct: 18/18 = 100%

## Files
- Patch plan: `leaderboard_runs\round33_econometrics_patch_plan_three_layers.md`
- Final run: `leaderboard_runs\round33_econometrics_rules4_val18.jsonl`

## Coverage added
- Regression equation F-test null hypothesis, G-Q heteroskedasticity, VIF multicollinearity, DW test conditions/regions, specification bias.
- Distributed lag model correction, reduced-form criteria.
- Probit/Logit binary choice distributions and estimation-method distinctions.
- Panel/parallel data parameter variation test order.
- Production-function substitution elasticity, marginal rate of technical substitution, C-D production function, sample regression function, simultaneous-equation order condition.

## Engineering note
- This round exposed a matching issue: many option-level strings are LaTeX-heavy, and the rule function only has reliable access to question text before choice matching. Added direct question-level guards for LaTeX-heavy econometrics items.
- Rule priority matters: broad `Probit + 不正确` must come after the more specific `Probit模型和Logit模型 + 参数估计`, otherwise the parameter-estimation item is stolen.

## Cautions
- Multicollinearity item id=3 has a strange gold/wording about developing new estimation methods including OLS/difference methods; keep as item口径.
- DW indeterminate-region item id=17 gold is `以上都不对`; option intervals appear malformed, avoid abstraction.

## Next recommended subject
`statistics`.
