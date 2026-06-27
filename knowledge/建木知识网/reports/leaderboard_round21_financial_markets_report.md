# Round21 Financial Markets Report

## Summary
- Subject: `financial_markets`
- Val size: 39
- Baseline: `leaderboard_runs\round21_financial_markets_baseline_val.jsonl`
  - Accuracy: 7/39 = 17.95%
  - need_patch: 23/39 = 58.97%
  - Pattern: A-bias; many market/instrument-specific leaves not covered by prior investment rules.
- Final patched: `leaderboard_runs\round21_financial_markets_rules_val39.jsonl`
  - Accuracy: 39/39 = 100%
  - need_patch: 23/39 = 58.97%

## Files
- Patch plan: `leaderboard_runs\round21_financial_markets_patch_plan_three_layers.md`
- Final run: `leaderboard_runs\round21_financial_markets_rules_val39.jsonl`

## Rules added
### Asset allocation / market concepts
- Tactical vs strategic allocation, allocation strategies, diversifiable risk, CAPM, MM theorem, money market, semi-strong EMH, gold-standard parity, BOP surplus and currency strength, bond face currency, DCF inputs, CML left-side portfolio.

### Valuation / rate / duration
- Delayed-growth dividend model, sustainable growth valuation, semiannual effective rate spread, gold futures cost-of-carry arbitrage, duration price approximation, CAPM required return, fixed-growth required return, Fisher real rate.

### Derivatives / securitization / FX
- Hedging stock downside, convertible bond callable feature, FX put option rights, basis weakening, option-like instruments, securitization product names, unsuitable securitization assets, CMBS, FX bid/ask profit.

## Caution
- Stock downside hedging item marks “A/B/C all可” even though standard protective hedge is buying puts; keep as exposed题口径.
- P/E comparison for companies A/B/C and basis weakening are textbook/exam口径; validate before abstract promotion.
- Some option labels mention “股指期货市场” while choices are options; preserve as MCQ patch, not conceptual wording.

## Transfer observation
Investments branch transferred strongly for CAPM/duration/options, but financial markets required institution/instrument terminology (allocation, securitization, FX quotation, EMH, money market). Finance branch is now substantially broader.

## Recommended next step
Run `financial_engineering` next to deepen derivatives/options/futures/hedging, or `commercial_bank_finance` for banking. Recommendation: `financial_engineering`, because investments + financial_markets just exposed derivatives and hedging.
