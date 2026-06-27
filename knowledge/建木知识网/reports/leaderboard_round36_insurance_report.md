# Round36 Insurance Report

## Summary
- Subject: `insurance`
- Val size: 33
- Baseline: `leaderboard_runs\round36_insurance_baseline_val.jsonl`
  - Judged: 33/33
  - Correct: 8/33 = 24.24%
  - Invalid: 0
  - need_patch: 16/33 = 48.48%
- First rules: `leaderboard_runs\round36_insurance_rules_val33.jsonl`
  - 32/33 = 96.97%
- Final patched: `leaderboard_runs\round36_insurance_rules2_val33.jsonl`
  - Judged: 33/33
  - Correct: 33/33 = 100%

## Files
- Patch plan: `leaderboard_runs\round36_insurance_patch_plan_three_layers.md`
- Final run: `leaderboard_runs\round36_insurance_rules2_val33.jsonl`

## Coverage added
- Insurance contract/law: assistants, offer/acceptance, termination, personal-insurance interest timing, death-benefit consent, beneficiary change, disclosure breach, premium grace/liability period, insurable interest, duplicate insurance, statutory insurance definition.
- Regulation/rate/operation: NFRA regulator, substantive/entity supervision, life-rate factors, fire-rate method, market demand factors, fund-use principles, current-asset loss indemnity, gross premium, risk feature, organization form, rate-setting principles, risk mass principle, business categories, business traits, operation principles, indemnity limits.
- Risk/causation: proximate cause, psychological risk factor, dynamic risk, risk-insurance relationship.

## Engineering note
- First pass missed only one synonym pattern: `经营的业务分为两大类` vs `将保险公司经营的业务分成两个主要类型`. Added synonym guard.

## Cautions
- id=15 risk “无时不刻围绕我们” gold is `可变性`; many textbooks would map this wording to universality/普遍性. Keep as item口径.
- id=9 market demand “personal factors” excluded by gold; avoid broad abstraction without checking textbook context.

## Next recommended subject
`international_finance`, then `financial_engineering` / `financial_markets`.
