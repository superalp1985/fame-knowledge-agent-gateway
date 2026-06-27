# FinEval × 建木管线第一轮报告

日期：2026-05-15

## 本轮目标

按用户确认的主线开始行动：不再继续训练调参，转向真实公开榜端到端答题。

本轮落地：

```text
1. 正式管线设计文档
2. FinEval academic MCQ 最小答题脚本
3. 小样本 smoke test
4. 问题发现与修复
```

## 新增文件

```text
[REDACTED_LOCAL_PATH]
[REDACTED_LOCAL_PATH]
```

输出目录：

```text
[REDACTED_LOCAL_PATH]
```

## 管线设计

主流程：

```text
题目 + A/B/C/D
→ 题型识别
→ 建木 route/router 检索
→ Python detect_and_calc
→ 0.8B 选择 A/B/C/D
→ 输出 prediction/gold/correct/kappa/need_patch/evidence
```

need_patch 规则：

```text
no_knowledge_hit
low_kappa
calc_not_parsed
invalid_choice
```

## 数据定位

已确认 FinEval academic 数据位置：

```text
[REDACTED_LOCAL_PATH]
[REDACTED_LOCAL_PATH]
[REDACTED_LOCAL_PATH]
```

示例字段：

```text
id, question, A, B, C, D, answer   # dev/val
id, question, A, B, C, D           # test
```

## Smoke 结果

### no-LLM dry-run

命令：

```bash
py -3.12 fineval_jianmu_pipeline.py --split val --subject accounting --limit 3 --no_llm --out leaderboard_runs\smoke_no_llm_accounting_val.jsonl
```

结果：

```text
n=3
能读取 val
能走建木检索
能输出 need_patch
```

### LLM smoke v1/v2 问题

最初 LLM 输出全空。定位到两个问题：

1. `router.call_llm` 的 STOP_TOKENS 包含 `答案:` / `正确答案`，与 MCQ prompt 的 “答案: X” 冲突，导致输出被截空。
2. 本地 Ollama `qwen3.5:0.8b` 会把短输出放进 `thinking` 字段，而 `response` 为空；pipeline 原先只读 `response`。

已修复：

```text
- pipeline 内新增 call_choice_llm，不复用 router.call_llm 的 stop tokens
- prompt 加 /no_think
- response 为空时 fallback 读取 thinking
```

### LLM smoke v3

命令：

```bash
py -3.12 fineval_jianmu_pipeline.py --split val --subject accounting --limit 5 --out leaderboard_runs\smoke_llm_accounting_val_v3.jsonl
```

结果：

```text
n=5
judged=5
correct=1
accuracy=0.20
need_patch=2
need_patch_rate=0.40
```

日志：

```text
id=0 pred=A gold=B false need_patch=True
id=1 pred=A gold=D false
id=2 pred=A gold=A true
id=3 pred=A gold=C false
id=4 pred=A gold=C false need_patch=True
```

## 当前判断

管线已经能跑通，但 0.8B 在当前 prompt 下有明显 A 选项偏置，且建木证据对公允价值/计量单元等题目覆盖不足或过粗。

这符合预期：第一轮目标是打通端到端，不是立刻拿高分。

## 下一步建议

1. 增加 MCQ 选项逐项评分模式：不要让模型直接生成答案，而是让它分别判断 A/B/C/D 与证据链是否匹配，最后用程序选最高分。
2. 强化计算器：先补公允价值、固定资产入账价值、股份支付等高频会计计算模板。
3. 对 val/accounting 跑 20-50 题，统计 need_patch 主题，生成补网清单。
4. 补 route_index/rules：优先补公允价值、计量单元、主要市场/最有利市场、市场参与者、固定资产初始计量等第一批暴露知识点。
