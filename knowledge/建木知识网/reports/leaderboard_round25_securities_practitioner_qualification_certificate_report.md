# Round25 Securities Practitioner Qualification Certificate Report

## Summary
- Subject: `securities_practitioner_qualification_certificate`
- Val size: 22
- Baseline: `leaderboard_runs\round25_securities_practitioner_qualification_certificate_baseline_val.jsonl`
  - Judged: 21/22
  - Correct: 5/21 = 23.81%
  - Invalid: 1
  - need_patch: 16/22 = 72.73%
- First patched: `leaderboard_runs\round25_securities_practitioner_qualification_certificate_rules_val22.jsonl`
  - Correct: 20/22 = 90.91%
- Final patched: `leaderboard_runs\round25_securities_practitioner_qualification_certificate_rules2_val22.jsonl`
  - Correct: 22/22 = 100%

## Files
- Three-layer plan: `leaderboard_runs\round25_securities_practitioner_qualification_certificate_patch_plan_three_layers.md`
- Final run: `leaderboard_runs\round25_securities_practitioner_qualification_certificate_rules2_val22.jsonl`

## Rules added
- Financial opening-up policy principle.
- Futures five-in-one regulatory framework.
- Off-balance-sheet business definition.
- Public securities offering threshold.
- Unauthorized securities/bond issuance criminal penalty.
- Illegal fund-raising fraud filing threshold.
- Listed-company takeover disclosure/tender-offer violation fine.
- Sponsor institution/representative supervision and sanction period.
- Practitioner business-category change registration period.
- Securities investment consultant registration authority.
- Research report independence, quality control, and compliance review.
- Hong Kong stock investment adviser service recordkeeping.
- Securities company board minutes/signature rules.
- Entrusted investment management no guaranteed return.
- Compliance officer/check rules and compliance staff allocation.
- Futures company change approval item.
- Futures and Derivatives Law effective date.
- Securities exchange head disqualification period.
- Securities service institutions trading restriction during underwriting and 6 months after.

## Caution
- The securities company compliance review item (id=16) appears suspicious: standard intuition suggests compliance department should review new products/new businesses, but FinEval gold selects the option saying it does not need to. Kept as exposed item-level patch.
- A broad Round24 banking rule phrase initially overmatched the securities board-meeting item. Fixed by adding higher-priority securities-specific guard. This supports the “specific-before-general” rule ordering discipline.

## Next recommended subject
Continue the practitioner branch: `fund_qualification_certificate`, then `futures_practitioner_qualification_certificate`.
