# Accounting 抽象层补网报告 — 2026-05-19

## 本轮目标

在 `global_regression_20260519_after_futures_practitioner_patch` 满分恢复点基础上，补 `accounting` 的会计准则、长投、资产减值、债券、职工薪酬等稳定规则。

## 落地内容

- 补丁脚本：`[REDACTED_LOCAL_PATH]`
- 备份目录：`[REDACTED_LOCAL_PATH]`
- 修改文件：
  - `rules/会计学_rules.json`
  - `route_index.json`
  - `associations/first_order_会计学.json`
- 新增规则：10 条
- 新增 route：10 条，`route_index` 2683 → 2693
- 新增一级联想：4 条，`first_order_会计学.json` 11 → 15

## 新增规则分组

### 无形资产

1. 分期付款无形资产初始计量

### 投资性房地产

1. 出租房地产改扩建期间列报
2. 投资性房地产成本模式转公允价值模式

### 长期股权投资与企业合并

1. 同控合并长投成本含原商誉
2. 同控分步取得控制资本公积

### 资产减值

1. 资产未来现金流量预计期限

### 金融负债与债券

1. 债券实际利率法期初摊余成本
2. 可转债负债权益拆分

### 职工薪酬

1. 低价售房职工福利长期递延
2. 自产产品发放职工福利

## 单科回归

- 输出：`[REDACTED_LOCAL_PATH]`
- 结果：36/36，accuracy=1.0
- need_patch：12/36
- 备注：本轮 12 个残差基本仍由 `calc_not_parsed` 驱动，规则层已经能解释对应准则，未改变满分正确率。

## 34 科全局回归

- 脚本：`[REDACTED_LOCAL_PATH]`
- 报告：`[REDACTED_LOCAL_PATH]`
- CSV：`[REDACTED_LOCAL_PATH]`
- 结果：34/34 perfect，bad=0
- 全局总题量/正确：1151/1151
- 全局总 need_patch：343（与期货轮保持一致）

## 正向外溢

这轮会计补网的主收益是把长投、商誉、债券、投资性房地产、职工薪酬的抽象规则补厚，适合继续外溢到：

- `advanced_financial_accounting`
- `intermediate_financial_accounting`
- `certified_practising_accountant`
- `management_accounting`

## 解释

`accounting` 当前残差大多为金额/年份/现值/折现类题，属于 `calc_not_parsed` 高发区。补静态规则不一定立刻降残差，但能提升知识命中、解释一致性和跨科外溢。

## 下一步建议

优先顺序：

1. `intermediate_financial_accounting`（11 残差，和本轮外溢最强）
2. `advanced_financial_accounting`（4 残差，适合少量高精规则收口）
3. `certified_practising_accountant` 或 `management_accounting`

仍不建议先打 statistics / china_actuary / tax_law 顶部计算残差，除非准备专项增强解析器。
