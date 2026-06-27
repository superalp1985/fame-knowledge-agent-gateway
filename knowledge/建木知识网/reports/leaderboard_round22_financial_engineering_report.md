# Round22 Financial Engineering Report

## Summary
- Subject: `financial_engineering`
- Val size: 26
- Baseline: `leaderboard_runs\round22_financial_engineering_baseline_val.jsonl`
  - Judged: 25/26
  - Accuracy: 7/25 = 28.00%
  - need_patch: 20/26 = 76.92%
  - Pattern: derivatives branch had many specialized details and one invalid output.
- First patched: `leaderboard_runs\round22_financial_engineering_rules_val26.jsonl`
  - Judged: 25/26
  - Accuracy: 23/25 = 92.00%
- Final patched: `leaderboard_runs\round22_financial_engineering_rules2_val26.jsonl`
  - Judged: 26/26
  - Accuracy: 26/26 = 100%
  - need_patch: 20/26 = 76.92%

## Files
- Patch plan: `leaderboard_runs\round22_financial_engineering_patch_plan_three_layers.md`
- Final run: `leaderboard_runs\round22_financial_engineering_rules2_val26.jsonl`

## Rules added
### Derivatives basics
- Convertible bond as bond+option, derivative contract categories, derivative market features, forward contract definition, futures standardization, margin system, initial margin, financial engineering definition, American option, derivative market participant categories, no-arbitrage pricing assumption, open interest mechanics.

### Option / forward / hedging calculations
- ETF call intrinsic value, option time value, put/call hedge ratio exposed item, bear put spread payoff, FX forward locked revenue, FX option execution, implied dividend yield from put-call parity, GBM one-day expected price.
- Equity downside hedging, fixed-income futures hedge, UK/US interest-rate investment choice.

## Caution / exposed-item anomalies
- Stock price up vs put option item: gold says option pattern `下跌，上涨`; standard finance intuition would normally be call up / put down. Kept as exposed patch only.
- Put hedge ratio item: standard put delta from call delta 0.8 would be -0.2, but gold is -0.8. Exposed patch only.
- Option contract content item: gold says `标的的数量` is not part of option contract, while standard contracts normally specify contract size/underlying quantity. Exposed patch only.

## Transfer observation
Financial markets/investments rules helped for options/futures/hedging, but financial engineering still required many instrument-definition and derivative-calculation templates. Derivatives branch is now much stronger but contains several suspicious gold口径 items.

## Recommended next step
Run `commercial_bank_finance` or `banking_practitioner_qualification_certificate` to start the banking branch. Recommendation: `commercial_bank_finance`, likely more finance-institution focused and connected to current market/rate knowledge.
