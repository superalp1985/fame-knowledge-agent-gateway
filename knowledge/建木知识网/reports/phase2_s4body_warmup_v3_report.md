# JianMu-0.8B-S4Body warmup-no-prune v3 记录

日期：2026-05-15

## 目的

根据 slow-prune v2 的结论，尝试“先学协议，再用进废退”：

```text
前 100 step 不剪枝/不 revive；
100 step 后 slow-prune。
```

## 脚本改动

`train_jianmu_08b_s4body.py` 新增参数：

```bash
--plastic_warmup_steps
```

逻辑：

```python
if step % evolve_every == 0 and step > plastic_warmup_steps:
    evolve()
```

因此 warmup 阶段仍记录 health/potential/FAME，但不执行 prune/revive/shortcut evolve。

## 配置

```text
out=[REDACTED_LOCAL_PATH]
steps=200
max_len=128
prune_rate=0.02
revive_rate=0.01
evolve_every=40
plastic_warmup_steps=100
```

命令：

```bash
py -3.12 train_jianmu_08b_s4body.py --model [REDACTED_LOCAL_PATH]
```

## 结果

```text
step=0020 loss=1.6589 density=1.000 shortcuts=0/24
step=0040 loss=0.9947 density=1.000 shortcuts=0/24
[eval] step=50 loss=0.5461 density=1.000
step=0060 loss=0.9603 density=1.000 shortcuts=0/24
step=0080 loss=1.1957 density=1.000 shortcuts=0/24
step=0100 loss=0.9719 density=1.000 shortcuts=0/24
[eval] step=100 loss=0.5693 density=1.000
saved state step=100
step=0120 loss=0.6913 density=0.982 shortcuts=0/24
step=0140 loss=0.9148 density=0.982 shortcuts=0/24
[eval] step=150 loss=0.5801 density=0.982
step=0160 loss=0.8654 density=0.965 shortcuts=0/24
step=0180 loss=0.6942 density=0.965 shortcuts=0/24
step=0200 loss=0.8494 density=0.947 shortcuts=0/24
[eval] step=200 loss=0.6182 density=0.947
saved state step=200
DONE
```

## 末值指标

```text
train_loss_recent = 0.7783
density_mean = 0.9473
active_shortcuts = 0
shortcut_alpha_mean = 0.0
elapsed_s = 166.87
```

FAME 8D：

```text
mu = 0.9497
chi = 0.9740
epsilon = 0.5000
kappa = 0.9996
nu = 0.000274
delta = 0.000108
rho = 0.3826
lambda = 0.4744
```

## 对比

| 指标 | slow-prune v2 | warmup v3 |
|---|---:|---:|
| density@200 | 0.912 | 0.947 |
| eval@50 | 0.4646 | 0.5461 |
| eval@100 | 0.4752 | 0.5693 |
| eval@150 | 0.4909 | 0.5801 |
| eval@200 | 0.5135 | 0.6182 |
| shortcuts@200 | 0/24 | 0/24 |
| train_loss_recent | 0.7520 | 0.7783 |

## 判断

warmup v3 没有达到预期：虽然 density 更保守，但 eval 全程差于 slow-prune v2。说明当前任务里“早期温和剪枝”可能起到了正则/压噪作用，完全 warmup 不剪反而不如 v2。

当前最佳主线仍是 slow-prune v2。

## 下一步建议

不继续 warmup v3。下一轮建议：

```text
v4: slow-prune v2 参数不变，但降低学习率 lr=1e-5 或加 eval-based early stop。
```

目标：保持 v2 的稳定剪枝，同时减少 step100 后 eval 缓慢上升。
