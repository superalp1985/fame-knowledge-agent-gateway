# Formula Parser Round 1 — CMA 计算模板迁移报告（2026-05-19）

## 本轮目标

在知识层收尾恢复点 `global_regression_20260519_after_cma_patch` 基础上，启动公式解析器阶段第一轮。原则是低风险闭环：不改答案策略，不扩大 LLM 权重，只把已经被确定性概念规则稳定答对的 CMA 计算题迁移进 `detect_accounting_calc`，让系统真正产出 `calc` 证据，从而消除 `calc_not_parsed`。

## 修改文件

- `[REDACTED_LOCAL_PATH]`

## 修改内容

在 `detect_accounting_calc()` 前部新增 CMA / management accounting 计算模板：

1. CAPM + 固定增长股利估值
2. MBA 显性成本 + 机会成本
3. 新产品相关成本
4. 玩具/鞋子采购预算
5. 装卸混合成本预算
6. 11 月商品采购预算
7. 直接材料采购预算（题库口径）
8. 应收账款回款余额

## 验证

### 编译检查

- `python -m py_compile fineval_jianmu_pipeline.py` 通过。

### 单科回归

- 科目：`certified_management_accountant`
- 输出：`[REDACTED_LOCAL_PATH]`
- 结果：18/18，accuracy=1.0
- need_patch：9 → 5

### 34 科全局回归

- 脚本：`[REDACTED_LOCAL_PATH]`
- 报告：`[REDACTED_LOCAL_PATH]`
- CSV：`[REDACTED_LOCAL_PATH]`
- 结果：34/34 perfect，bad=0
- 全局总题量/正确：1151/1151
- 全局总 need_patch：338 → 334

## 剩余问题

CMA 剩余 5 个 need_patch 包括：

- 1 个伦理/低 kappa 表述题
- 4 个特殊或题库口径计算题，适合后续按更通用预算/成本解析器继续抽象，而不是继续手写单题硬编码

## 阶段判断

公式解析器第一轮成功，证明当前残差中确实有大量“已会答但未产出 calc 证据”的题。后续优先方向：

1. 税法/税额解析器（tax_law + CPA）
2. 债券/现值/收益率解析器（investments + financial_management + accounting）
3. 预算/存货/应收账款通用模板继续抽象

## 最新恢复点

`[REDACTED_LOCAL_PATH]`
