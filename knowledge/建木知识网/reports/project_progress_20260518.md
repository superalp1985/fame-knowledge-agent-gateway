# 建木知识网 FinEval 补网进度记录 — 2026-05-18`n

## 2026-05-18 21:05 — 建木 tax_law 抽象层补网完成

- `tax_law` 审计报告：`[REDACTED_LOCAL_PATH]`。
- 初始状态：45/45，need_patch=21；残差大多是税额计算 `calc_not_parsed`，不是知识空洞。
- 落地策略：补稳定税法规则与可参数化税额模板（滞纳金、城建税计税基础、消费税范围、税务处罚听证/设定权限、非居民企业核定、境外所得抵免、车辆购置税、房产税、宪法纳税义务等），不扩展成题库答案库。
- 落地脚本：`[REDACTED_LOCAL_PATH]`；备份：`[REDACTED_LOCAL_PATH]`。
- 本轮新增：会计学规则 16 条，route_index 2611→2627，`first_order_会计学.json` 一级联想 +3（当前 11）。
- 单科回归：`leaderboard_runs\tax_law_after_abstract_patch_20260518.jsonl`，45/45，accuracy=1.0，need_patch 21→20。
- 34 科全局回归：`[REDACTED_LOCAL_PATH]`，34/34 perfect，bad=0。
- 最新恢复点：`[REDACTED_LOCAL_PATH]`。
- 当前 need_patch 最高：statistics 25、china_actuary 23、investments 21、tax_law 20、banking_practitioner 19、financial_markets 16、corporate_finance 15、fund_qualification 14。
- 经验：税法和 investments 类似，继续显著降残差需要增强公式/税额解析器，而不是继续堆知识规则。

## 2026-05-18 22:05 — 建木 corporate_strategy_and_risk_management 抽象层补网完成

- 审计报告：`[REDACTED_LOCAL_PATH]`。
- 初始状态：33/33，need_patch=14；本科偏概念骨架，适合沉淀公司宗旨变化、组织结构、预算类型、产品开发、前向一体化、财务战略矩阵、公司治理风险等稳定规则。
- 落地脚本：`[REDACTED_LOCAL_PATH]`；备份：`[REDACTED_LOCAL_PATH]`。
- 本轮新增：管理学规则 12 条，route_index 2627→2639，`first_order_管理学.json` 一级联想 +3（当前 3）。
- 单科回归：`leaderboard_runs\corporate_strategy_after_abstract_patch_20260518.jsonl`，33/33，accuracy=1.0，need_patch 14→6。
- 34 科全局回归：`[REDACTED_LOCAL_PATH]`，34/34 perfect，bad=0。
- 最新恢复点：`[REDACTED_LOCAL_PATH]`。
- 外溢：`public_finance` need_patch 2→1；无负污染。
- 当前 need_patch 最高：statistics 25、china_actuary 23、investments 21、tax_law 20、banking_practitioner 19、financial_markets 16、corporate_finance 15、economic_law/macroeconomics/futures/fund 各 14。
- 下一步建议：继续打 `economic_law` 或 `macroeconomics` 这类概念型 14；若要冲最高残差，则转公式/统计/精算解析器。

## 2026-05-19 00:04 — 建木 economic_law 抽象层补网封板与睡前恢复点

- 老板准备睡觉前要求保存记忆和进度；本轮已完成到 `economic_law` 全局回归确认。
- `economic_law` 审计报告：`[REDACTED_LOCAL_PATH]`。
- `economic_law` 补丁脚本：`[REDACTED_LOCAL_PATH]`；备份：`[REDACTED_LOCAL_PATH]`。
- 本轮新增：法学/经济法规则 12 条，`route_index` 2639→2651，`first_order_法学.json` 一级联想 +3（当前 3）。
- 单科回归：`leaderboard_runs\economic_law_after_abstract_patch_20260518.jsonl`，25/25，accuracy=1.0，need_patch 14→10。
- 34 科全局回归：`[REDACTED_LOCAL_PATH]`，34/34 perfect，bad=0。
- 最新恢复点：`[REDACTED_LOCAL_PATH]`。
- 全局总题量/正确：1151/1151；总 need_patch：346（此前 corporate_strategy 后为 353，本轮净降 7）。
- 正向外溢：`auditing` need_patch 5→4、`insurance` 9→8、`management_accounting` 5→4；无负污染。
- 当前 need_patch 最高：statistics 25、china_actuary 23、investments 21、tax_law 20、banking_practitioner 19、financial_markets 16、corporate_finance 15、macroeconomics/fund/futures 各 14、securities 13、accounting 12。
- 方向判断：全局准确率已满分，剩余主要是解释完整度/知识命中率；概念型继续补网有收益，统计/精算/投资/税法高残差多为公式或计算解析器问题，后续若要明显压顶端残差，应转公式解析器增强。
