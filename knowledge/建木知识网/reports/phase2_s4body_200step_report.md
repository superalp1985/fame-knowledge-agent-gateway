# JianMu-0.8B-S4Body Phase 2 200 step 中跑记录

日期：2026-05-15

## 先发现并修复的 bug

首次 200 step 运行在 step≈140 暴露 Emergency Shortcut shape mismatch：

```text
RuntimeError: The size of tensor a (116) must match the size of tensor b (128) at non-singleton dimension 1
```

原因：`EmergencyShortcutLayer` 错误缓存了上一批样本的 hidden state 作为旁路输入，下一批 seq_len 不一致时维度冲突。

修复：Emergency Shortcut 不再跨 batch 缓存 hidden；改为 shape-safe 版本：

```text
out = original_layer(x) + alpha * current_layer_input
```

这保持“应急残差旁路”的物理保险丝含义，同时避免跨样本污染。真正的 `h_{l-1}->h_{l+1}` 栈级旁路后续再做。

已记录到 `.learnings/ERRORS.md`。

## 修复后验证

45 step 验证通过：

```text
step=0020 loss=1.1113 density=0.965 shortcuts=0/24
[eval] step=20 loss=0.5040 density=0.965
step=0040 loss=0.9728 density=0.930 shortcuts=0/24
[eval] step=40 loss=0.3998 density=0.930
saved state step=45
DONE
```

## 200 step 中跑命令

```bash
py -3.12 train_jianmu_08b_s4body.py --model [REDACTED_LOCAL_PATH]
```

## 过程日志要点

```text
step=0020 loss=1.1284 density=0.965 shortcuts=0/24
step=0040 loss=1.3526 density=0.930 shortcuts=0/24
[eval] step=50 loss=0.4242 density=0.930
step=0060 loss=0.8000 density=0.895 shortcuts=0/24
step=0080 loss=0.9737 density=0.859 shortcuts=0/24
step=0100 loss=1.2188 density=0.824 shortcuts=0/24
[eval] step=100 loss=0.5038 density=0.824
saved state step=100
step=0120 loss=1.0968 density=0.789 shortcuts=1/24
step=0140 loss=0.9037 density=0.754 shortcuts=1/24
[eval] step=150 loss=0.5537 density=0.754
step=0160 loss=0.8972 density=0.719 shortcuts=1/24
step=0180 loss=1.0733 density=0.684 shortcuts=2/24
step=0200 loss=1.1063 density=0.648 shortcuts=2/24
[eval] step=200 loss=0.6612 density=0.648
saved state step=200
DONE
```

## 保存文件

```text
[REDACTED_LOCAL_PATH]
[REDACTED_LOCAL_PATH]
[REDACTED_LOCAL_PATH]
```

## 末值指标

```text
train_loss_recent = 1.1136
density_mean = 0.6484
active_shortcuts = 2
shortcut_alpha_mean = 0.0208
elapsed_s = 310.75
```

FAME 8D：

```text
mu = 0.6174
chi = 0.8808
epsilon = 0.5000
kappa = 0.9997
nu = 0.000206
delta = 0.000064
rho = 0.3884
lambda = 0.4524
```

## 判断

- 200 step 机制可跑通，CUDA 稳定，显存压力稳定 rho≈0.388。
- density 从 1.000 降到 0.648，下降较快；仍高于 min_density=0.50，但已经明显压缩。
- eval loss 在 50/100/150/200 分别为 0.4242 / 0.5038 / 0.5537 / 0.6612，后半程反弹，说明继续训练前应先做一次推理质量评估，不建议盲目直接 500 step。
- Emergency Shortcut 在 120 后开始触发，最终 2/24，说明确实检测到局部物理阻塞；修复后不会再因 seq_len 变化崩溃。

## 下一步建议

1. 先评估 step100 与 step200 的状态差异，尤其 step100 可能比 step200 更稳。
2. 在能恢复/应用 plastic state 的前提下，分别接 router 测 20/50 条端到端生成。
3. 若需要继续训练，建议降低 prune_rate 或提高 evolve interval，避免 density 过快降到 0.65 后 eval loss 反弹。
