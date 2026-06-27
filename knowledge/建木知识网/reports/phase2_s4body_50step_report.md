# JianMu-0.8B-S4Body Phase 2 小步快跑记录

日期：2026-05-15

## 本轮补充机制

### 1. FAME 8D Monitor

已在 `train_jianmu_08b_s4body.py` 增加 `FAMEMonitor`，每步记录工程代理版：

```text
E_AI = (mu, chi, epsilon, kappa, nu, delta, rho, lambda)
```

当前代理口径：

- `mu` 满足度：loss 改善量的 sigmoid
- `chi` 好奇度：最后 hidden activation variance / 历史最大 variance
- `epsilon` 共情度：Phase 2 暂置中性 0.5，后续接 query-answer embedding alignment
- `kappa` 置信度：最后 token [REDACTED] 最大概率
- `nu` 焦虑度：normalized entropy
- `delta` 冲突度：entropy/confidence disagreement proxy
- `rho` 疲劳度：CUDA memory allocated / total memory
- `lambda` 挫败度：loss 未改善事件的 EMA

### 2. Emergency Shortcut

已在 `train_jianmu_08b_s4body.py` 增加 `EmergencyShortcutLayer`：

```text
out = original_layer(x) + alpha * prev_hidden
```

原则：

- 不删除原层
- 不关闭原层
- 不休眠原层
- 不引入可学习 router
- 只基于物理信号触发

记录信号：

- `layer_act_ema`
- `layer_grad_ema`
- `shortcut_alpha`
- `blockage_age`

触发逻辑：

```text
act > 1.35 * median_act
and grad < 0.35 * median_grad
持续 2 个 evolve 周期
→ alpha <= 0.25
```

## 代码验证

```bash
py -3.12 -m py_compile train_jianmu_08b_s4body.py
py -3.12 train_jianmu_08b_s4body.py --model [REDACTED_LOCAL_PATH]
```

结果：

```text
wrapped PlasticMLP=24
emergency_shortcuts=24
trainable=264,241,152/752,393,024 (35.12%)
step=0001 loss=2.9684 density=1.000 shortcuts=0/24 ...
saved state step=4
DONE
```

## 50 step 小步快跑

命令：

```bash
py -3.12 train_jianmu_08b_s4body.py --model [REDACTED_LOCAL_PATH]
```

结果：

```text
wrapped PlasticMLP=24 emergency_shortcuts=24
trainable=264,241,152/752,393,024 (35.12%)
step=0001 loss=3.4370 density=1.000 shortcuts=0/24
step=0020 loss=1.7076 density=0.965 shortcuts=0/24
[eval] step=25 loss=0.6966 density=0.965
step=0040 loss=1.0343 density=0.930 shortcuts=0/24
[eval] step=50 loss=0.6541 density=0.930
saved state step=50
DONE
```

保存：

```text
[REDACTED_LOCAL_PATH]
[REDACTED_LOCAL_PATH]
```

## 当前指标

`train_config.json` 末值：

```text
train_loss_recent = 1.3011
density_mean = 0.9297
active_shortcuts = 0
shortcut_alpha_mean = 0.0
elapsed_s = 47.99
```

FAME 8D 末值：

```text
mu = 0.0010
chi = 0.9826
epsilon = 0.5000
kappa = 0.9999
nu = 0.000066
delta = 0.000009
rho = 0.3883
lambda = 0.4837
```

## 初步解释

- density 从 1.000 降到 0.930，说明 channel 用进废退已开始工作。
- eval loss 从 step25 的 0.6966 降到 step50 的 0.6541，小步训练有效。
- Emergency Shortcut 仍为 0/24，说明 50 step 内没有检测到“高激活 + 低梯度”的层阻塞；这是健康现象，不是机制失效。
- CUDA 显存占用代理 `rho≈0.388`，8GB 4070 Laptop 可承受当前 max_len=128。

## 下一步

建议进入 200 step 中跑：

```bash
py -3.12 train_jianmu_08b_s4body.py --model [REDACTED_LOCAL_PATH]
```

若 density 继续健康下降且 eval loss 不反弹，再跑 500 step / max_len 256。
