# JianMu-0.8B-S4Body-FreeGrowth v1 运行记录

日期：2026-05-15

## 配置

```text
out=[REDACTED_LOCAL_PATH]
steps=200
max_len=128
lr=2e-5
prune_rate=0.02
revive_rate=0.01
evolve_every=40
growth_every=40
growth_warmup_steps=40
grow_width_step=16
max_extra_width=64
max_physical_layers=26
depth_fatigue_limit=0.55
```

## 命令

```bash
py -3.12 train_jianmu_08b_s4body.py --model [REDACTED_LOCAL_PATH]
```

## 结果

```text
wrapped PlasticMLP=26 emergency_shortcuts=26 dormant_depth=2
trainable=291,373,056/794,210,112 (36.69%)
step=0020 loss=1.3127 density=1.000 width=0 depth+=0/2 shortcuts=0/26
step=0040 loss=1.0366 density=0.907 width=0 depth+=0/2 shortcuts=0/26
[eval] step=50 loss=0.4520 density=0.907
step=0060 loss=1.0787 density=0.907 width=0 depth+=0/2 shortcuts=0/26
step=0080 loss=0.9240 density=0.891 width=0 depth+=0/2 shortcuts=0/26
step=0100 loss=0.7706 density=0.891 width=0 depth+=0/2 shortcuts=0/26
[eval] step=100 loss=0.4867 density=0.891
saved state step=100
[growth] step=120 grow_width +16 active_width=16
step=0120 loss=1.1119 density=0.875 width=16 depth+=0/2 shortcuts=0/26
step=0140 loss=0.9899 density=0.875 width=16 depth+=0/2 shortcuts=0/26
[eval] step=150 loss=0.5066 density=0.875
step=0160 loss=0.6886 density=0.859 width=16 depth+=0/2 shortcuts=1/26
step=0180 loss=0.7109 density=0.859 width=16 depth+=0/2 shortcuts=1/26
step=0200 loss=0.9757 density=0.843 width=16 depth+=0/2 shortcuts=1/26
[eval] step=200 loss=0.5137 density=0.843
saved state step=200
DONE
```

## 末值

```text
train_loss_recent = 0.8171
density_mean = 0.8428
active_extra_width_total = 16
active_depth_growth = 0
active_shortcuts = 1
shortcut_alpha_mean = 0.0096
rho = 0.3935
lambda = 0.4288
```

## 对比

| 指标 | slow-prune v2 | FreeGrowth v1 |
|---|---:|---:|
| dormant depth prealloc | no | +2 (inactive) |
| width growth | 0 | +16 |
| active depth growth | 0 | 0 |
| density@200 | 0.912 | 0.843 |
| eval@50 | 0.4646 | 0.4520 |
| eval@100 | 0.4752 | 0.4867 |
| eval@150 | 0.4909 | 0.5066 |
| eval@200 | 0.5135 | 0.5137 |
| shortcuts@200 | 0/24 | 1/26 |
| train_loss_recent | 0.7520 | 0.8171 |

## 判断

- FreeGrowth v1 跑通，宽度 sidecar 在 step120 真实增长 +16；深度未触发，符合 fallback-only 预期。
- 但 v1 没有明显超过 slow-prune v2：eval200 基本持平，train_loss_recent 更高，density 更低。
- 原因可能是 dormant depth 预置后 wrapper 数从 24→26，sleep/revive 作用范围包含 dormant depth，导致 density 比 v2 掉得更快；同时 width growth 触发较晚且只 +16，不足以改善后程。

## 下一步建议

1. 保留 FreeGrowth 机制，但不要预置 dormant depth 参与常规 plastic/evolve；或者设置 `max_physical_layers=24` 只测 width-only。
2. 做 `freegrowth_width_only_v2`：
   - `max_physical_layers=24`
   - `growth_every=40`
   - `growth_warmup_steps=40`
   - `grow_width_step=16`
   - `max_extra_width=64`
   - 保持 slow-prune v2 其余参数
3. 目标：隔离 width growth 的真实贡献，避免 dormant depth 预置带来的额外扰动。
