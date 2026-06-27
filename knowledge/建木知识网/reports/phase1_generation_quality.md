# 建木 Phase 1 端到端生成质量复盘

- mode: llm
- total: 20
- deterministic ok_rate: 100.00%
- elapsed_s: 54.78
- flagged_cases: 0

## 结论

确定性路由/计算链路已打通，但端到端生成仍暴露一个核心问题：route_index 命中正确后，legacy neuron 兜底会把 FinEval 填空题/选择题噪声作为第2/第3节点塞进 narrative，导致模型有时回答时混入无关题干或选项。

## 需修复

1. 如果 route_index 最高分为 manual_* 且分数足够高，narrative 应只使用 manual route + 少量同域干净规则，不再混入 legacy neuron 噪声。

2. 自动抽取 route_index 时，应过滤 name/content 含 `____` 的 FinEval 填空题作为低优先级训练材料，而不是作为在线回答 context。

3. build_narrative 应增加 context hygiene：跳过含 `____`、过长题干、明显选择题残片的相关知识。

4. 端到端评分不能只看 route_ok，还要加入 blank_question_leak / answer_too_long / noisy_context_neuron。


## Flagged cases
