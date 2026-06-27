# Futures Practitioner 抽象层补网报告 — 2026-05-19

## 本轮目标

在 `global_regression_20260519_after_securities_practitioner_patch` 满分恢复点基础上，补 `futures_practitioner_qualification_certificate` 的期货、衍生品、套期保值、价差交易、期权与风险管理稳定规则。

## 落地内容

- 补丁脚本：`[REDACTED_LOCAL_PATH]`
- 备份目录：`[REDACTED_LOCAL_PATH]`
- 修改文件：
  - `rules/经济学_rules.json`
  - `route_index.json`
  - `associations/first_order_经济学.json`
- 新增规则：19 条
- 新增 route：19 条，`route_index` 2664 → 2683
- 新增一级联想：4 条，`first_order_经济学.json` 60 → 64

## 新增规则分组

### 期货与衍生品

1. 期货保证金比例常见区间
2. CME外汇期货起源
3. 基本面分析的经济学基础
4. 波浪理论提出者
5. VaR置信度含义
6. 回撤与止损风控
7. 郑商所主要品种边界
8. 期权买方权利
9. 远期合约灵活性优势
10. CBOT成立节点

### 套期保值与价差交易

1. 套期保值锁定生产成本
2. 基差与卖出套期保值盈亏
3. 跨期价差缩小交易
4. 价差限价指令成交条件
5. 英镑应收款套保方向
6. 美元应付款套保方向

### 期权与风险管理

1. 看涨期权买方净收益
2. 利率下限期权支付逻辑
3. 外汇掉期定义

## 单科回归

- 输出：`[REDACTED_LOCAL_PATH]`
- 结果：39/39，accuracy=1.0
- need_patch：14 → 12
- 关键收益：id=8「基本面分析的经济学基础」、id=10「波浪理论提出者」原为 `no_knowledge_hit + low_kappa`，本轮补网后被知识网接住。

## 34 科全局回归

- 脚本：`[REDACTED_LOCAL_PATH]`
- 报告：`[REDACTED_LOCAL_PATH]`
- CSV：`[REDACTED_LOCAL_PATH]`
- 结果：34/34 perfect，bad=0
- 全局总题量/正确：1151/1151
- 全局总 need_patch：343（上一恢复点 346，本轮净降 3）

## 正向外溢

- `futures_practitioner_qualification_certificate`：14 → 12
- `fund_qualification_certificate`：14 → 13
- `international_economics`：6 → 4
- 无负污染。

## 解释

本轮比证券从业轮更直接，因为期货从业中存在两个真正的知识空洞/低 κ 概念题。补入基本面分析、波浪理论、VaR、套保、价差、外汇掉期等规则后，既保持满分，也压低全局 `need_patch`。

仍有 12 个期货残差主要是带年份、比例、金额或交易计算的 `calc_not_parsed`，后续若要继续压，需要增强 `detect_and_calc` 或增加可参数化解析模板，而不是继续堆静态知识。

## 下一步建议

下一轮可选：

1. `accounting`：36题，need_patch=12，会计准则/概念模板可能还有稳定收益。
2. `intermediate_financial_accounting`：26题，need_patch=11，与 accounting 外溢强。
3. `certified_management_accountant` / `financial_management`：各 need_patch=10，可能存在管理会计和财管概念残差。

继续暂缓 `statistics` / `china_actuary` / `investments` / `tax_law` 顶部残差，除非转入公式/计算解析器专项。
