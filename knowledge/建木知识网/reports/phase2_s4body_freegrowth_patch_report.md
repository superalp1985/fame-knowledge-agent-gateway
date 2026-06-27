# JianMu-0.8B-S4Body-FreeGrowth 补齐记录

日期：2026-05-15

## 用户确认的问题

1. `channel_mask` 的“剪”必须只是暂时休眠，不是真的减没。
2. 当前必须补齐“增长”：宽度增长和深度增长都要有。
3. 增长必须有安全上限。
4. 参考：
   - `experiment_log(2).md`
   - `S7-DW_FreeGrowth_论文.md`

## 口径修正

当前 `channel_mask` 是：

```text
sleep / dormant / revive
```

不是物理删除。权重矩阵仍在，只是不参与当前前向；后续可通过 potential 复活。

## 安全上限

基座：

```text
Qwen3.5-0.8B
base layers=24
hidden=1024
intermediate=3584
```

本地训练：RTX 4070 Laptop 8GB，max_len=128 时 FAME `rho≈0.38`。

第一版上限：

```text
max_physical_layers=26   # base 24 + 最多 2 层
每次 depth 只激活 1 层
深度增长仅作 fallback
```

宽度上限：

```text
grow_width_step=16
max_extra_width_per_layer=64
```

## 代码新增机制

文件：

```text
[REDACTED_LOCAL_PATH]
```

### 1. ElasticWidthBranch

每个 `PlasticQwenMLP` 现在包含 width sidecar：

```text
base_mlp(x) + width_sidecar(x)
```

sidecar 初始 active width = 0，参数预分配到 `max_extra_width`，增长时只解除 active width：

```text
grow_width(delta)
```

默认：

```text
delta=16
max_extra_width=64
```

### 2. DormantDepthLayer

预置最多 2 个 dormant depth layer：

```text
max_physical_layers=26
```

inactive 时是 exact no-op：

```text
return hidden_states
```

触发 `grow_depth()` 后激活。当前深度增长只作为 fallback。

### 3. Growth controller

新增参数：

```bash
--enable_freegrowth / --no_freegrowth
--grow_width_step
--max_extra_width
--max_physical_layers
--growth_every
--growth_warmup_steps
--growth_cooldown
--depth_fatigue_limit
```

当前最小策略：

```text
width-first
pressure = recent loss 不降 or FAME lambda > 0.45
优先 grow_width
所有 width 满后，且 rho < depth_fatigue_limit，才允许 grow_depth
```

## 验证

### 12 step smoke

```bash
py -3.12 train_jianmu_08b_s4body.py ... --steps 12 --max_physical_layers 26
```

结果：

```text
wrapped PlasticMLP=26 emergency_shortcuts=26 dormant_depth=2
trainable=291,373,056/794,210,112 (36.69%)
[eval] step=12 loss=0.8806 density=1.000
DONE
```

12 step 未触发增长，属保守条件正常。

### 40 step growth check

```bash
py -3.12 train_jianmu_08b_s4body.py --model [REDACTED_LOCAL_PATH]
```

结果：

```text
wrapped PlasticMLP=26 emergency_shortcuts=26 dormant_depth=2
step=0001 loss=3.0258 density=1.000 width=0 depth+=0/2
[growth] step=20 grow_width +16 active_width=16
step=0020 loss=1.5639 density=1.000 width=16 depth+=0/2
[eval] step=20 loss=0.6530 density=1.000
[growth] step=36 grow_width +16 active_width=32
step=0040 loss=1.1355 density=0.907 width=32 depth+=0/2
[eval] step=40 loss=0.5148 density=0.907
DONE
```

## 当前判断

- 宽度增长已真实触发，不是摆设。
- 深度增长安全上限已装入（最多 +2 层），但当前策略下未触发，这是符合“depth 只作 fallback”的预期。
- 预置 dormant depth 会让 wrapper 计数从 24 到 26，训练参数从约 752M 变为 794M；仍可在本地 CUDA 跑通。
- 下一步应跑较保守的 FreeGrowth v1：`growth_every=40`、`growth_warmup_steps=40`、`max_len=128`、steps=200，观察 width 增长是否改善 slow-prune v2 后程反弹。
