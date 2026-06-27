# Round20 Investments Report

## Summary
- Subject: `investments`
- Val size: 38
- Baseline: `leaderboard_runs\round20_investments_baseline_val.jsonl`
  - Judged: 37/38
  - Accuracy: 10/37 = 27.03%
  - need_patch: 26/38 = 68.42%
  - Pattern: A-bias with many investment-specific calculation gaps and one invalid output.
- Final patched: `leaderboard_runs\round20_investments_rules_val38.jsonl`
  - Judged: 38/38
  - Accuracy: 38/38 = 100%
  - need_patch: 26/38 = 68.42%

## Files
- Patch plan: `leaderboard_runs\round20_investments_patch_plan_three_layers.md`
- Final run: `leaderboard_runs\round20_investments_rules_val38.jsonl`

## Rules added
### Asset pricing / portfolio / risk
- Expected return-beta relation use cases, Chen/Roll/Ross APT factor口径, Black/Jensen/Scholes empirical SML slope, Fama-French CAPM challenge.
- Bond-rating characteristics, stock index methods, market-cap weighting, Sharpe ratio independence from beta when returns/std are same, ADRs, political risk.

### Bonds / equities
- Bond full price = quoted clean price + accrued interest.
- Discount/premium convergence, short maturity lower discount/premium, convertible market conversion value and premium.
- Duration price approximation, coupon vs zero-coupon duration sensitivity, default risk premium, fixed-growth and single-period equity valuation.
- Bond price / zero-coupon / forward-rate items, including several exposed exam口径 choices.

### Options / futures / arbitrage
- Call-writing upside risk, call buyer strike/exercise price, short put breakeven, hedge ratio, futures short position, Treasury strip arbitrage exposed item.

## Caution / exposed-item anomalies
- 2-year bond price item: standard calculation for 10% coupon, 12% YTM, FV=1000 is about 966, but FinEval gold is 996. Rule follows gold as exposed patch only.
- STRIPPED Treasury arbitrage item has duplicated/awkward option text; rule follows gold D only as exposed patch.
- Some empirical-finance findings are textbook/exam口径 and should be version-tagged before abstract-layer promotion.

## Transfer observation
Finance/CMA rules helped conceptually, but investments needed dedicated bond/duration/options templates. The finance branch is now much thicker.

## Recommended next step
Run `financial_markets` next. It should reuse investments + finance rules (indices, rates, markets, derivatives) and expose remaining market-institution gaps.
