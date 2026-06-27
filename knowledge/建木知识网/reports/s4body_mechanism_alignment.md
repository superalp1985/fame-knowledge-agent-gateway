# JianMu-0.8B-S4Body 机制对齐说明

日期：2026-05-15

## 口径

用户已将第一版本体从 `0.6B` 改为 `qwen3.5:0.8b`。项目目标相应改为：

```text
JianMu-0.8B-S4Body
```

Ollama 中的 `qwen3.5:0.8b` 用于端到端推理接线测试；真正训练需要 HuggingFace/safetensors 权重，GGUF/Q8_0 不用于反向训练。

## 已对齐 PROJECT_PLAN_0.6B_JIANMU.md 的机制

### 1. 不冻结本体，但不是裸全参 SFT

`train_jianmu_08b_s4body.py` 的训练策略：

```text
训练 MLP/FFN body 权重
默认冻结 embedding / attention / norm / lm_head
用 channel_mask 控制 FFN 通道存活
```

这不是 sidecar-only，也不是全参乱训，而是受控 body plasticity。

### 2. S4 Health Score

每层 `PlasticQwenMLP` 记录：

```text
act_ema
health
potential
channel_mask
```

Health 公式：

```text
health = mean(|W_gate|) * mean(|W_down|) * log1p(act_ema)
```

对应计划中的：

```text
Health Score = |W| × log(1+EMA_act)
```

### 3. Potential

Potential 由梯度信号形成：

```text
potential = mean(|grad_gate|) * mean(|grad_down|)
```

用于 dormant channel revive。

### 4. 用进废退

每 `evolve_every=20` step：

```text
低 health channel prune
高 potential dormant channel revive
min_density 默认 0.50
```

后续可按计划降到 `0.30` 做第二轮。

### 5. 不覆盖本体

训练保存到：

```text
[REDACTED_LOCAL_PATH]
```

保存内容：

```text
s4body_state_step*.pt
train_config.json
```

不覆盖原始模型。

## 当前训练数据

```text
[REDACTED_LOCAL_PATH]
rows=354
```

包含：

- narrative_sft
- concept_sft
- anti_hallucination

## 运行方式

先验证脚本：

```bash
python train_jianmu_08b_s4body.py --dry_run
```

如果本地有 HF/safetensors 0.8B：

```bash
python train_jianmu_08b_s4body.py --model [REDACTED_LOCAL_PATH]
```

如果没有本地 HF 权重，脚本会尝试 `Qwen/Qwen3.5-0.8B`；若 HuggingFace 没有这个 model id 或网络不可用，会明确报错。

## 注意

Ollama 的 `qwen3.5:0.8b` 是 GGUF/Q8_0 推理模型，不能直接作为 PyTorch 训练输入。训练阶段需要 HF/safetensors 版本；推理接线阶段继续用 Ollama 0.8B。
