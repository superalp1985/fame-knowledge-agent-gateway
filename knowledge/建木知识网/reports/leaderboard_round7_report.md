# FinEval × 建木第七轮：抽象层/一级联想落库

日期：2026-05-16

## 用户确认

用户同意第六轮建议：保守迁移，不为单题污染抽象层。第七轮执行：

```text
1. 探明现有知识网结构
2. 追加/合并抽象层 rules
3. 追加/合并 route_index 手工高优先级路由
4. 新建 first_order_会计学 associations
5. 不改 FinEval 题库 neurons
6. 重跑 accounting_val 验证不破坏成绩
```

## 现有结构确认

关键文件：

```text
[REDACTED_LOCAL_PATH]
[REDACTED_LOCAL_PATH]
[REDACTED_LOCAL_PATH]
[REDACTED_LOCAL_PATH]
[REDACTED_LOCAL_PATH]
```

结论：

```text
题库型知识在 FinEval_Accounting_neurons.json，容易污染，不直接改。
抽象层应进入 rules/会计学_rules.json。
高优先级入口进入 route_index.json。
一级联想单独进入 associations/first_order_会计学.json。
```

## 脚本

```text
[REDACTED_LOCAL_PATH]
```

特性：

```text
- 追加/合并，不全量重写
- 自动备份 touched files
- route_index 新增项插入前部，保持 manual high priority
- associations 每个 from 最多 3 个 to
- 不触碰 FinEval 题库 neurons
```

## 落库结果

结果文件：

```text
[REDACTED_LOCAL_PATH]
```

摘要：

```text
backup_dir: [REDACTED_LOCAL_PATH]
route_index_total_before: 2285
rules_added: 8
rules_updated: 0
routes_added: 8
routes_updated: 0
route_index_total_after: 2293
associations: 8
```

新增 association 文件：

```text
[REDACTED_LOCAL_PATH]
```

## 新增 8 个抽象层 rules

```text
长期股权投资初始计量
同一控制下企业合并初始计量
资产减值与资产组
商誉减值测试
债券实际利率法
可转换公司债券权益成份
累积带薪缺勤
利润分享计划
```

## 路由命中验证

8 个测试查询均命中新手工抽象路由第一名：

```text
manual_acc_lti_initial_measurement
manual_acc_common_control_combination_initial
manual_acc_impairment_asset_group
manual_acc_goodwill_impairment
manual_acc_bond_effective_interest
manual_acc_convertible_bond_equity_component
manual_acc_accumulated_paid_absence
manual_acc_profit_sharing_plan
```

## accounting_val 回归

命令：

```bash
py -3.12 fineval_jianmu_pipeline.py --split val --subject accounting --limit 50 --out leaderboard_runs\round7_after_kb_patch_accounting_val36.jsonl
```

结果：

```text
n=36
correct=29
accuracy=0.8055555555555556
need_patch=14
need_patch_rate=0.3888888888888889
```

对比第五轮：

```text
29/36 = 80.6% → 29/36 = 80.6%
```

结论：抽象层/route_index/一级联想落库没有破坏当前 accounting_val 成绩；路由置信出现局部提升，如 id=6 κ 从 0.408 到 0.816。

## 记录的工具教训

PowerShell 不支持 bash heredoc `python - <<'PY'`。已写入：

```text
[REDACTED_LOCAL_PATH]
```

## 下一步

```text
1. 让 fineval_jianmu_pipeline 真正读取 first_order_会计学.json，把一级联想纳入 narrative，但每题最多 3 个节点。
2. 将部分 pipeline if/else 规则改成基于 route_index/rules 的结构化命中，减少硬编码。
3. 跑 accounting 之外 subject smoke，验证不是只刷会计。
```
