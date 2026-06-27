# FinEval × 建木第八轮：一级联想接入推理链

日期：2026-05-16

## 目标

把第七轮落库的：

```text
[REDACTED_LOCAL_PATH]
```

真正接入 `router.py` / `fineval_jianmu_pipeline.py` 推理链，同时严格遵守：

```text
单跳
最多 3 个联想节点
不递归
不纵向展开
不投票/不平均/不 ensemble
```

## 代码改动

### router.py

新增：

```text
KnowledgeNet.first_order
KnowledgeNet.get_first_order_assoc(focus_names, max_n=3)
build_narrative() 一级联想叙事
JianMuRouter.route() 优先读取 first_order associations，缺失再 fallback cross_domain
返回字段 first_order_assocs
```

同时修复：

```text
router.call_llm() 在 response 为空时 fallback 读取 thinking
```

原因：本地 qwen3.5:0.8b / Ollama 有时把文本放在 thinking 字段，response 为空。

### fineval_jianmu_pipeline.py

新增输出字段：

```text
first_order_assocs
```

## 中途发现并修正的隐患

首次抽查发现部分旧 cross_domain association 也有 `to` 字段，但 `to` 是字符串。原逻辑直接 `list(to)[:3]` 会变成单字列表，例如：

```text
['会','学','/']
```

这会造成联想污染。

修复：

```text
只有 isinstance(to, list) 的 association 才当一级联想
旧 cross_domain 若有 insight 则只作为跨域视角
first_order_assocs 输出也只保留 list 型 to
```

验证：

```text
round8_first_order_guarded_accounting_val36.jsonl
rows_with_first_order = 22/36
bad = []
```

说明没有单字污染。

## accounting_val 回归

命令：

```bash
py -3.12 fineval_jianmu_pipeline.py --split val --subject accounting --limit 50 --out leaderboard_runs\round8_first_order_guarded_accounting_val36.jsonl
```

结果：

```text
n=36
correct=29
accuracy=0.8055555555555556
need_patch=14
need_patch_rate=0.3888888888888889
```

与第七轮持平：

```text
29/36 = 80.6%
```

结论：一级联想已接入推理链，并且不破坏当前会计成绩。

## 非 accounting smoke

命令：

```bash
py -3.12 fineval_jianmu_pipeline.py --split val --subject auditing --limit 10 --out leaderboard_runs\round8_smoke_auditing_val10.jsonl
py -3.12 fineval_jianmu_pipeline.py --split val --subject finance --limit 10 --out leaderboard_runs\round8_smoke_finance_val10.jsonl
```

结果：

```text
auditing: 1/10 = 10.0%
finance: 2/9 judged = 22.2%, 1 invalid
```

判断：非会计 smoke 没有运行崩溃，但成绩很低。主要原因仍是：

```text
1. 0.8B 对 MCQ 有强 A 偏置
2. 非会计 subject 没有做 accounting 这种抽象层/规则/计算闭环
3. 当前规则主要服务 accounting，不应期待跨科泛化
```

不是第八轮一级联想改动导致系统性崩溃。

## 当前状态

```text
accounting_val: 80.6%，一级联想已接入，22/36 题触发有效一级联想
非会计 smoke: 可运行但分数低，需要单独补网/规则或换更可靠推理后端
```

## 下一步建议

```text
1. 继续第九轮：减少 pipeline if/else，把已落库抽象节点转成可复用结构化选择逻辑。
2. 或转入其他 subject：先选 auditing / finance 之一，按 accounting 闭环方式做三层补网。
3. 如果要整体冲 leaderboard，应先解决 0.8B A 偏置：可评估 [REDACTED_LOCAL_PATH]
```
