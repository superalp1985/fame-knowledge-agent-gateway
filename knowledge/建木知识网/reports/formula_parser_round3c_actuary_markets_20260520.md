# Formula Parser Round 3c — 精算/保险/金融市场解析器报告（2026-05-20）

## 本轮目标

在 Round 3b 恢复点 `global_regression_20260520_after_formula_parser_round3b_fe_cf` 基础上，继续压低 `china_actuary`、`insurance` 与部分 `financial_markets` 的 `calc_not_parsed` 残差。策略保持低风险：不改判题主架构，不提高 LLM 权重，只为已稳定答对的题补确定性 `calc` 证据。

本轮明确不碰 `statistics`，因为统计学 residual 虽高但泛化误伤风险最大。

## 修改文件

- `[REDACTED_LOCAL_PATH]`

## 新增模板范围

### china_actuary / actuarial-accounting

1. 支出法 GDP：C+I+G+X-M
2. 全离散终身寿险均衡年缴保费
3. 服务年限分段养老金年收入
4. 二项分布标准差
5. 毛保费：纯保费、固定费用、可变费用、利润附加
6. Bühlmann 信度估计
7. 溢额再保险赔款分摊
8. 盘盈固定资产重置成本入账
9. 短期借款贷方余额
10. 资产负债表应收账款项目
11. 筹资活动现金流量净额
12. 每股收益
13. 销售毛利率

### financial_markets

1. 固定增长股利模型估值
2. 半年复利有效年利率高于名义利率的差额
3. ROE 留存增长股利估值
4. 黄金期货套利方向
5. 修正久期价格变动
6. CAPM 必要收益率
7. 固定增长模型反推必要回报率

## 验证

### 编译检查

- `python -m py_compile fineval_jianmu_pipeline.py` 通过。

### Target + sentinel 回归

输出目录：`[REDACTED_LOCAL_PATH]`

- `china_actuary`: 37/37，need_patch 23 → 9
- `insurance`: 33/33，need_patch 7 → 7
- `financial_markets`: 39/39，need_patch 16 → 8
- `securities_practitioner_qualification_certificate`: 22/22，need_patch 13 → 13
- `finance`: 25/25，need_patch 4 → 4

目标净降：22。

### 34 科全局回归

- 初跑脚本：`[REDACTED_LOCAL_PATH]`
- 断点续跑/汇总脚本：`[REDACTED_LOCAL_PATH]`
- 报告：`[REDACTED_LOCAL_PATH]`
- CSV：`[REDACTED_LOCAL_PATH]`

最终结果：

- 34/34 perfect
- 1151/1151
- bad=0
- total_need_patch=263
- parse warnings=0

对比：

- Round 2 baseline：312
- Round 3a：298，净降14
- Round 3b：285，再降13
- Round 3c：263，再降22
- Round 3a+3b+3c 累计净降49

## 阶段判断

Round 3c 是目前 Round 3 系列收益最高的一轮，证明 `china_actuary` 与 `financial_markets` 中存在大量安全可补的公式型残差。`insurance` 本身剩余多为低知识命中/概念题，不适合继续用公式解析器硬压。

下一轮建议：

1. Round 3d 可以继续做 `financial_markets` 剩余 8 个 + `investments` 剩余 15 个中的债券/DCF/CAPM/久期残差；
2. 或做 `management_accounting`/`cost_accounting` 的小规模补漏；
3. `statistics` 仍后置，除非逐题写特异模板。

## 最新恢复点

`[REDACTED_LOCAL_PATH]`
