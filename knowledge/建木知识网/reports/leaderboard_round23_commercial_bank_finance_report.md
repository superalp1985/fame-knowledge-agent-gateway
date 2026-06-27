# Round23 Commercial Bank Finance Report

## Summary
- Subject: `commercial_bank_finance`
- Val size: 20
- Baseline: `leaderboard_runs\round23_commercial_bank_finance_baseline_val.jsonl`
  - Judged: 17/20
  - Accuracy: 3/17 = 17.65%
  - Invalid: 3
  - need_patch: 8/20 = 40.00%
- Final patched: `leaderboard_runs\round23_commercial_bank_finance_rules_val20.jsonl`
  - Judged: 20/20
  - Accuracy: 20/20 = 100%

## Files
- Patch plan: `leaderboard_runs\round23_commercial_bank_finance_patch_plan_three_layers.md`
- Final run: `leaderboard_runs\round23_commercial_bank_finance_rules_val20.jsonl`

## Rules added
### Banking / financial market basics
- Spot vs futures market by delivery time.
- DuPont core metric ROE.
- Cash asset management principles do not include profitability.
- Interbank borrowing mainly adjusts reserve positions.
- International banking business objectives do not include fixedness.
- Financial internationalization negative effects do not include stabilizing financial markets.

### Commercial bank operation and management
- Financing lease vs operating lease distinction.
- Irrevocable standby L/C benefits beneficiary.
- Early withdrawal of time deposit uses withdrawal-date demand deposit rate.
- Five-category loan classification: concerned/special mention loan.
- Bank outsourcing significance.
- Real bills doctrine.
- Loan policy content and policy formulation considerations.
- Loan pricing principles.
- Customer credit quantitative indicator item.

### Bills / functions / discount calculation
- Endorsement seal for discounted bank acceptance bill collection.
- Credit intermediary function vs payment intermediary function.
- Commercial bill discount: 50000*(1-12%*0.5)=47000.
- Commercial bank modern economic function exposed item: gold selects money creation as incorrect expression, cautious.

## Caution
- The final modern commercial-bank function item may have a口径 issue: standard textbooks often list credit intermediary, payment intermediary, financial services, and credit/money creation as commercial bank functions. The exposed gold chooses `货币创造` as incorrect; keep as item-level patch only.

## Transfer observation
Prior financial market rules transferred to spot/futures and DuPont/finance basics, but banking制度题 still required specific commercial-bank knowledge templates.

## Next recommended subject
`banking_practitioner_qualification_certificate` to continue the banking branch while rules are fresh.
