# Round27 Futures Practitioner Qualification Certificate Report

## Summary
- Subject: `futures_practitioner_qualification_certificate`
- Val size: 39
- Baseline: `leaderboard_runs\round27_futures_practitioner_qualification_certificate_baseline_val.jsonl`
  - Judged: 35/39
  - Correct: 8/35 = 22.86%
  - Invalid: 4
  - need_patch: 23/39 = 58.97%
- First patched: `leaderboard_runs\round27_futures_practitioner_qualification_certificate_rules1_val39.jsonl`
  - Correct: 37/39 = 94.87%
- Final patched: `leaderboard_runs\round27_futures_practitioner_qualification_certificate_rules2_val39.jsonl`
  - Correct: 39/39 = 100%

## Files
- Patch plan: `leaderboard_runs\round27_futures_practitioner_qualification_certificate_patch_plan_three_layers.md`
- Final run: `leaderboard_runs\round27_futures_practitioner_qualification_certificate_rules2_val39.jsonl`

## Coverage added
- Futures margin, settlement, regulation, risk, exchanges, settlement institution, CRO/TM roles.
- Options classification and payoff, hedging, basis, spread arbitrage, forward/futures distinctions.
- FX quotation, FX futures hedging, forwards, interest-rate floor, FX swaps, CBOT history.

## Fix notes
The first patched run missed two questions due to option-substring collisions:
- `30000美元` matched `-30000美元` first.
- `减少` matched `增加或减少无法确定` first.
Both were fixed with direct question-level guards. This is a recurring exact-choice matching hazard.

## Practitioner branch status
Securities + Fund + Futures practitioner certificate branch is now fully closed on val.

## Next recommended subject
Move to `central_banking` or `monetary_finance` to continue the finance/macro banking branch.
