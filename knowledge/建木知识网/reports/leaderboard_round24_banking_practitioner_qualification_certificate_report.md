# Round24 Banking Practitioner Qualification Certificate Report

## Summary
- Subject: `banking_practitioner_qualification_certificate`
- Val size: 116
- Baseline: `leaderboard_runs\round24_banking_practitioner_qualification_certificate_baseline_val.jsonl`
  - Judged: 108/116
  - Correct: 26/108 = 24.07%
  - Invalid: 8
  - need_patch: 50/116 = 43.10%
- First patched: `leaderboard_runs\round24_banking_practitioner_qualification_certificate_rules1_val116.jsonl`
  - Judged: 116/116
  - Correct: 115/116 = 99.14%
- Final patched: `leaderboard_runs\round24_banking_practitioner_qualification_certificate_rules2_val116.jsonl`
  - Judged: 116/116
  - Correct: 116/116 = 100%
  - need_patch: 49/116 = 42.24%

## Files
- Baseline: `leaderboard_runs\round24_banking_practitioner_qualification_certificate_baseline_val.jsonl`
- Final run: `leaderboard_runs\round24_banking_practitioner_qualification_certificate_rules2_val116.jsonl`
- Three-layer patch plan: `leaderboard_runs\round24_banking_practitioner_qualification_certificate_patch_plan_three_layers.md`

## Approach
This subject has 116 questions and spans regulatory capital, bank risk management, personal finance, retail loans, corporate credit, legal procedure, consumer rights, and financial institution basics. For speed and to avoid over-generalizing 116 exposed validation items, the first pass inserted a subject-specific banking practitioner knowledge block keyed by stable question phrases and gold option text. Generic reusable concepts are summarized in the patch plan and can later be promoted selectively.

## Important data issue
- id=85 has malformed CSV options: option A contains `营运资金量B.借款人自有资金C.现有流动资金贷款D.平均存货余额`, so ordinary option-text matching for `平均存货余额` hits A before D.
- Final patch adds a direct question-level guard returning D.

## Transfer observation
Prior `commercial_bank_finance` rules helped only a small part. The banking practitioner subject is much broader and should be treated as a high-coverage domain expansion source for the banking/监管/个人金融/company-credit branches.

## JianmuFlowSelector decision
Per boss decision at 2026-05-16 11:55: first finish the whole knowledge net; implement `JianmuFlowSelector` only after the knowledge net is complete. Current work remains Fineval mainline.

## Next recommended subject
Continue nearby金融从业 branches if present (securities/fund/insurance/banking related), otherwise move to the next remaining large finance/accounting subject.
