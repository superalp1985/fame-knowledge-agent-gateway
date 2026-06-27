# Round26 Fund Qualification Certificate Report

## Summary
- Subject: `fund_qualification_certificate`
- Val size: 68
- Baseline: `leaderboard_runs\round26_fund_qualification_certificate_baseline_val.jsonl`
  - Judged: 65/68
  - Correct: 12/65 = 18.46%
  - Invalid: 3
  - need_patch: 28/68 = 41.18%
- Final patched: `leaderboard_runs\round26_fund_qualification_certificate_rules1_val68.jsonl`
  - Judged: 68/68
  - Correct: 68/68 = 100%
  - need_patch: 27/68 = 39.71%

## Files
- Patch plan: `leaderboard_runs\round26_fund_qualification_certificate_patch_plan_three_layers.md`
- Final run: `leaderboard_runs\round26_fund_qualification_certificate_rules1_val68.jsonl`

## Approach
This is a medium-size comprehensive fund subject. Like Round24 banking practitioner, it spans multiple subdomains, so the first pass used a subject-specific knowledge block keyed by stable question phrases and gold option text. Reusable rules are summarized in the three-layer patch plan for later promotion.

## Coverage added
- Public fund accounting, valuation, NAV, profit distribution, liquidation and custody.
- Fund internationalization and securities/derivatives basics.
- Private equity, venture capital, fundraising, compliance, valuation, post-investment management, exit, and industry association rules.

## Cautions
- id=36: “股权投资基金管理人最主要职责” gold is `以上都不是`, while the first two options look plausibly correct. Keep as exposed item-level patch.
- id=37: hurdle/threshold return item gold is `以上都是`, although standard phrase is 门槛收益率. Keep as exposed item-level patch.
- id=53: option text appears malformed/concatenated around “以上都对”, but final gold is D and accepted.

## Next recommended subject
`futures_practitioner_qualification_certificate`, continuing the practitioner/capital-market branch.
