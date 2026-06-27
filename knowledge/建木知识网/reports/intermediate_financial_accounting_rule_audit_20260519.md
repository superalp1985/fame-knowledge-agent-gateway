# Intermediate Financial Accounting 抽象层补网报告 — 2026-05-19

## 本轮目标

在 `global_regression_20260519_after_accounting_patch` 满分恢复点基础上，补 `intermediate_financial_accounting` 的所有者权益、投资性房地产、无形资产与研发、长期股权投资等中级财务会计高频准则模板。

## 落地内容

- 补丁脚本：`[REDACTED_LOCAL_PATH]`
- 备份目录：`[REDACTED_LOCAL_PATH]`
- 修改文件：
  - `rules/会计学_rules.json`
  - `route_index.json`
  - `associations/first_order_会计学.json`
- 新增规则：11 条
- 新增 route：11 条，`route_index` 2693 → 2704
- 新增一级联想：4 条，`first_order_会计学.json` 15 → 19

## 新增规则分组

### 所有者权益

1. 留存收益构成
2. 弥补亏损后的所有者权益变动

### 投资性房地产

1. 成本模式投资性房地产减值后账面价值
2. 公允价值模式投资性房地产处置损益

### 无形资产与研发

1. 无形资产摊销方法选择
2. 研发支出研究开发阶段区分
3. 在研无形资产减值测试

### 长期股权投资

1. 长投部分处置权益法转成本法
2. 非现金资产取得权益法长投损益
3. 权益法初始利得与投资收益
4. 权益法净利润公允价值调整

## 单科回归

- 输出：`[REDACTED_LOCAL_PATH]`
- 结果：26/26，accuracy=1.0
- need_patch：11/26
- 备注：残差仍主要为 `calc_not_parsed`，静态准则规则未直接降低 need_patch。

## 34 科全局回归

- 脚本：`[REDACTED_LOCAL_PATH]`
- 报告：`[REDACTED_LOCAL_PATH]`
- CSV：`[REDACTED_LOCAL_PATH]`
- 结果：34/34 perfect，bad=0
- 全局总题量/正确：1151/1151
- 全局总 need_patch：343

## 结论

中级财务会计知识层已补厚，未引入跨科污染。当前会计链路残差高度集中在金额、折旧、现值、投资收益、减值损失等公式/数字解析，因此后续若继续打会计大类，收益主要来自公式解析器，而不是继续堆静态知识规则。

## 下一步建议

继续完成知识层收尾：

1. `advanced_financial_accounting`：残差少，适合快速收口。
2. `certified_practising_accountant`：综合会计/审计/财管规则融合。
3. `management_accounting`：成本、预算、责任会计规则可补。

知识层收尾后，再切公式解析器。
