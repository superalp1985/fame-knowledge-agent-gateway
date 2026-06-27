# 建木 0.8B 上财公开榜目标路线

日期：2026-05-15

## 用户定调

当前训练数值已经够了，不再继续为了局部 eval loss 反复堆实验。

最终评判标准：

```text
真实测试结果 / 公开榜表现
```

本次实验的主要证明点：

```text
1. 建木系统对 0.8B 小模型有实用价值
2. 受控训练 / 用进废退 / FreeGrowth 不伤其它权重和通用能力
3. 承认 0.8B 的参数天花板，不把小模型包装成万能大模型
4. 最终目标是在上财公开榜拿到名次
```

## 当前可用成果

### Phase 1: 建木知识网接线

- route_index 已完成
- router.py 已接入
- Ollama `qwen3.5:0.8b` 端到端 20 条核心测试 flagged_cases=0
- 训练数据 `training_data/jianmu_phase1_sft.jsonl` 354 条

### Phase 2: 受控训练机制验证

已实现并验证：

- S4Body channel sleep / dormant / revive
- Health / Potential
- FAME 8D Monitor
- Emergency Shortcut
- ElasticWidthBranch / grow_width
- DormantDepthLayer / max_physical_layers 安全上限
- CUDA 本地训练链路

重要口径：

```text
channel_mask 是休眠，不是物理删除
FreeGrowth 已跑通，但采用哪个 state 以真实榜单/端到端评测为准
```

## 不再继续的方向

暂不继续：

```text
1. 单纯为了 eval loss 继续 500/1000 step
2. 反复微调 prune_rate / warmup / growth 参数
3. 追求本地小集 eval 最优而忽略公开榜真实性
```

## 下一步榜单路线

### 1. 明确上财公开榜数据与提交格式

需要确定：

```text
- test 文件位置
- 题目字段
- 选项字段
- 输出 CSV/JSON 格式
- 是否要求 subject/question/answer
- 是否有 dev/validation 可本地评估
```

### 2. 建立端到端答题管线

建议流程：

```text
题目 + 选项
→ 建木 route_index / rules / neurons 检索
→ narrative 证据链
→ qwen3.5:0.8b 生成/选择答案
→ κ/FAME 控温
→ 输出标准格式
```

### 3. 真实评估集

至少做三组：

```text
会计/财经专项：证明建木实用价值
通用知识：证明不伤其它能力
数学/逻辑：证明小模型基础能力保留
```

### 4. 对比基线

必须保留：

```text
裸 qwen3.5:0.8b
qwen3.5:0.8b + 建木 route
训练 state + 建木 route
```

目标不是只报最高分，而是证明增益来源。

### 5. 榜单提交

生成全量答案后：

```text
格式校验
抽样人工核对
提交公开榜
记录名次/分数
```

## 当前推荐策略

先用最稳定的：

```text
Ollama qwen3.5:0.8b + 建木 route_index/router
```

作为榜单主 baseline。

训练 state 是否接入，要等恢复/加载 plastic state 并真实端到端评测后决定；如果训练 state 没显著提升，就不要强行用，避免把机制验证和榜单目标混在一起。
