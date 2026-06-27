# JianMu-0.8B-S4Body slow-prune v2 记录

日期：2026-05-15

## 目的

上一轮 aggressive 配置：

```text
prune_rate=0.04
revive_rate=0.02
evolve_every=20
```

200 step 后 density 降到 0.648，eval loss 从 0.4242 反弹到 0.6612，判断剪枝过快。

本轮改为 slow-prune：

```text
prune_rate=0.02
revive_rate=0.01
evolve_every=40
```

并使用独立输出目录，避免覆盖 aggressive 版本：

```text
[REDACTED_LOCAL_PATH]
```

## 脚本改动

`train_jianmu_08b_s4body.py` 已参数化：

```bash
--prune_rate
--revive_rate
```

`wrap_plastic_mlps()` 将参数传给 `PlasticQwenMLP`。

## 冒烟测试

```bash
py -3.12 -m py_compile train_jianmu_08b_s4body.py
py -3.12 train_jianmu_08b_s4body.py --model [REDACTED_LOCAL_PATH]
```

结果：通过。

## 200 step v2 命令

```bash
py -3.12 train_jianmu_08b_s4body.py --model [REDACTED_LOCAL_PATH]
```

## 结果

```text
step=0020 loss=1.3146 density=1.000 shortcuts=0/24
step=0040 loss=1.1703 density=0.982 shortcuts=0/24
[eval] step=50 loss=0.4646 density=0.982
step=0060 loss=0.8323 density=0.982 shortcuts=0/24
step=0080 loss=1.0261 density=0.965 shortcuts=0/24
step=0100 loss=0.8896 density=0.965 shortcuts=0/24
[eval] step=100 loss=0.4752 density=0.965
saved state step=100
step=0120 loss=0.8514 density=0.947 shortcuts=0/24
step=0140 loss=0.8331 density=0.947 shortcuts=0/24
[eval] step=150 loss=0.4909 density=0.947
step=0160 loss=0.7231 density=0.930 shortcuts=0/24
step=0180 loss=0.8052 density=0.930 shortcuts=0/24
step=0200 loss=0.7920 density=0.912 shortcuts=0/24
[eval] step=200 loss=0.5135 density=0.912
saved state step=200
DONE
```

## 末值指标

```text
train_loss_recent = 0.7520
density_mean = 0.9121
active_shortcuts = 0
shortcut_alpha_mean = 0.0
elapsed_s = 164.62
```

FAME 8D：

```text
mu = 0.9880
chi = 0.9917
epsilon = 0.5000
kappa = 0.999996
nu = 0.0000055
delta = 0.0000011
rho = 0.3883
lambda = 0.4742
```

## 与 aggressive 版对比

| 指标 | aggressive 200 | slow-prune v2 200 |
|---|---:|---:|
| prune/evolve | 0.04 / 20 | 0.02 / 40 |
| density@200 | 0.648 | 0.912 |
| eval@50 | 0.4242 | 0.4646 |
| eval@100 | 0.5038 | 0.4752 |
| eval@150 | 0.5537 | 0.4909 |
| eval@200 | 0.6612 | 0.5135 |
| shortcuts@200 | 2/24 | 0/24 |
| train_loss_recent | 1.1136 | 0.7520 |

## 判断

slow-prune v2 明显更稳：

- density 保持 0.912，没有过快塌缩；
- eval loss 轻微上升但远低于 aggressive 版；
- Emergency Shortcut 未触发，说明没有明显层阻塞；
- 显存稳定。

当前最佳单点仍可能是 v2 step50（eval=0.4646）或 aggressive step50（eval=0.4242），但若按“稳定训练到 200”的标准，slow-prune v2 胜出。

## 下一步建议

1. 先保存 slow-prune v2 作为当前主线。
2. 下一轮可尝试：`prune_rate=0.01, evolve_every=40/60` 或固定 density warmup 前 100 step 不剪。
3. 进入端到端生成评估前，需要实现从 `s4body_state_step*.pt` 恢复 plastic masks/shortcut 状态并接回推理。
