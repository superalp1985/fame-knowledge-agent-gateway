# JianMu-0.8B-S4Body-FreeGrowth 当前运行状态

日期：2026-05-15 21:46

## 口径修正

当前 `channel_mask` 不是物理删除，只是：

```text
sleep / dormant / revive
```

权重仍保留，通道可复活。

## 当前已实现

```text
S4Body Plasticity
FAME 8D Monitor
Emergency Shortcut
```

## 当前待补齐

```text
ElasticWidthBranch / grow_width
grow_depth
pressure fallback / cooldown
```

## 安全上限

当前 base：

```text
Qwen3.5-0.8B
layers=24
hidden=1024
intermediate=3584
```

训练环境：RTX 4070 Laptop 8GB，max_len=128，rho≈0.38。

第一版安全限制：

```text
max_physical_layers=26   # base 24 + 最多 2 层
每次 grow_depth 只 +1
深度只作 fallback
```

宽度限制：

```text
grow_width_step=16
max_extra_width_per_layer=64
```

主路径：宽度 sidecar 增长优先；深度增长仅当 width 无法缓解压力且显存安全时触发。
