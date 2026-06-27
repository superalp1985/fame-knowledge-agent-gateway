# FinEval × 建木第四轮：概念规则层与泛化检查

日期：2026-05-15

## 本轮目标

用户同意继续后，第四轮目标：

```text
1. 修正 id=6 自建设备计算模板
2. 增加高频概念/准则规则判定器，压制 0.8B A 选项偏置
3. 回归前 20 题，再扩展到 accounting_val 全量可用样本
```

## 代码改动

文件：

```text
[REDACTED_LOCAL_PATH]
```

新增/修改：

```text
1. rule_choice_from_concepts()
2. 修 rule_choice_from_calc() 支持负数
3. 修自建设备入账价值模板：避免把增值税 52 万误当工程物资本金
4. 新增公允价值模式投资性房地产出售年度损益模板
```

概念规则覆盖：

```text
计量单元
市场参与者
在建工程成本不包括
政府会计
非营利组织会计
无形资产确认
无形资产摊销
投资性房地产改扩建
```

## accounting_val 前 20 题结果

命令：

```bash
py -3.12 fineval_jianmu_pipeline.py --split val --subject accounting --limit 20 --out leaderboard_runs\round4_rules_accounting_val20.jsonl
```

结果：

```text
n=20
correct=18
accuracy=0.90
need_patch=4
need_patch_rate=0.20
```

对比第三轮：

```text
accuracy: 0.30 → 0.90
need_patch_rate: 0.25 → 0.20
```

注意：这不能当泛化分数，因为规则明显针对前 20 暴露题补过；它证明的是“闭环补网/规则修补有效”。

## accounting_val 当前全量可用样本结果

命令：

```bash
py -3.12 fineval_jianmu_pipeline.py --split val --subject accounting --limit 50 --out leaderboard_runs\round4_rules_accounting_val50.jsonl
```

实际 val/accounting 只有 36 题，结果：

```text
n=36
correct=22
accuracy=0.6111
need_patch=18
need_patch_rate=0.50
```

## 关键判断

1. 规则/计算闭环很有效：前 20 暴露题从 30% 提到 90%。
2. 扩到 36 题后掉到 61.1%，说明后 16 题仍大量依赖 LLM，A 偏置回来。
3. 这不是坏事：它给出了下一批补网/规则目标。

## 下一步

用户补充要求：后续补网不能只补题目级 pipeline 规则，必须同时检查建木抽象层和一级联想路由。第五轮错误分析要输出三张清单：

```text
1. 直接规则/计算模板补丁
2. 抽象层节点/概念补充
3. 一级联想路由 route_index / associations 补充（硬约束：每题最多 3 次联想 / 最多 3 个联想节点，不允许递归发散）
```

执行顺序：

1. 分析 `round4_rules_accounting_val50.jsonl` 的后 16 题错误/need_patch。
2. 提取第二批概念规则与计算模板。
3. 将规则逐步迁入建木知识网/route_index，而不是长期写死在 pipeline。
4. 目标：accounting_val 36 题稳定 >75%，再推广到其他 subject。
