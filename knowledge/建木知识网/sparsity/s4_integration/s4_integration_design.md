# S4 GrowPruneFormer × 建木动态稀疏 — 融合实验设计

**日期**: 2026-05-12  
**目录**: `[REDACTED_LOCAL_PATH]`

---

## 1. 背景

建木动态稀疏实验（`sparsity/` 目录）在 0.6B 上验证了"用进废退"机制：
- MLP (33K): 密度 100%→40%, Loss 0.80→0.0002
- 0.6B lm_head (155M): 密度 100%→74%, Loss 2.18→1.27

S4 GrowPruneFormer 在腾讯 UNI-REC 2026 比赛中实现了更精细的**五层可塑性**架构。
本实验将 S4 的关键机制融入建木动态稀疏，在 H20 云机上对 Qwen3.6-27B 做完整训练。

---

## 2. S4 核心机制提取

### 2.1 Health Score (S) — 替代建木的简单 gradient EMA

```
S4:  S = |W|_in · |W|_out · log(1 + EMA_activation)
建木: score = 0.9·score + 0.1·|gradient|

差异: S4 同时考虑结构重要性(|W|)和使用频率(EMA_act),
      建木只看梯度幅度。S4 更精准。
```

### 2.2 Growth Potential (P) — 复活门槛

```
S4:  P = |grad_in| · |grad_out|     (梯度乘积)
复活条件: P > mean(P_active)       (超过活跃通道均值才复活)

建木当前: 随机复活 4% 死连接 (无门槛)
```

### 2.3 密度地板 (Floor)

```
S4:  min_active_frac = 0.50  (保底 50% 存活)
建木: 无保底 → L1 掉到 32%

S4 的保底防止关键层被过度压缩
```

### 2.4 验证驱动演化

```
S4:  每 epoch 结束后，根据 val AUC + overfit gap 决定是否生长/修剪
建木: 每个 EVOLVE_STEPS 无条件演化

S4 方式更稳定，防止训练波动触发误剪
```

---

## 3. 融合方案 — DynLinear-S4

```python
class DynLinearS4(nn.Module):
    """
    建木动态稀疏 + S4 增强
    
    S4 改进点:
    1. Health Score:  |W| * log(1+EMA_act)   (替换纯 gradient EMA)
    2. Growth Potential: |grad| 乘积 + 阈值门控
    3. 密度地板: 50% (替换无限制)
    4. 软启动: 小随机噪声 (保留)
    """
    
    def __init__(self, in_features, out_features, bias=True):
        super().__init__()
        self.in_features = in_features
        self.out_features = out_features
        
        # 权重与偏置
        self.weight = nn.Parameter(torch.randn(out_features, in_features) * 0.1)
        self.bias = nn.Parameter(torch.zeros(out_features)) if bias else None
        
        # 三态寄存器 (建木 FAME 映射)
        self.register_buffer('mask', torch.ones(out_features, in_features))     # κ: 存活
        self.register_buffer('score', torch.zeros(out_features, in_features))   # μ: 重要性 (S4 Health)
        self.register_buffer('freq', torch.zeros(out_features, in_features))    # χ: 调用频次 (EMA)
        self.register_buffer('potential', torch.zeros(out_features, in_features))  # P: 生长潜力
        
        # S4 参数
        self.min_density = 0.50     # 保底 50%
        self.prune_rate = 0.08      # 每次剪 8%
        self.grow_rate = 0.05       # 每次生长 5%
        self.ema_decay = 0.95       # 激活 EMA 衰减
        self.ema_update = 0.05      # 激活 EMA 更新率
    
    def forward(self, x):
        """前向传播 — 更新激活频率"""
        out = F.linear(x, self.weight * self.mask, self.bias)
        with torch.no_grad():
            # S4 方式: 记录 batch 平均激活
            act = x.abs().mean(dim=0)  # [in_features]
            self.freq = self.ema_decay * self.freq + self.ema_update * act.mean().unsqueeze(0).expand_as(self.freq)
        return out
    
    def update_score(self):
        """S4 Health Score: |W| × log(1+EMA_act)"""
        if self.weight.grad is None:
            return
        with torch.no_grad():
            # S4-style health computation per scalar weight
            w_mag = self.weight.abs()  # 结构重要性
            log_act = torch.log1p(self.freq)  # 使用频率 (log 平滑)
            self.score = w_mag * log_act
        
        # 更新生长潜力 (从梯度)
        if self.weight.grad is not None:
            with torch.no_grad():
                self.potential = self.weight.grad.abs()
    
    def evolve(self):
        """S4 剪枝+生长 一次迭代"""
        with torch.no_grad():
            total = self.mask.numel()
            
            # === 剪枝 ===
            n_kill = int(total * self.prune_rate)
            alive = (self.mask > 0)
            alive_count = alive.sum().item()
            
            # S4 密度地板: 不低于 min_density
            min_alive = int(total * self.min_density)
            if alive_count - n_kill < min_alive:
                n_kill = max(0, alive_count - min_alive)
            
            if n_kill > 0:
                alive_scores = self.score[alive]
                if alive_scores.numel() > n_kill:
                    th = torch.kthvalue(alive_scores.flatten(), n_kill).values
                    kill = (self.score <= th) & alive
                    self.mask[kill] = 0
            
            # === 生长 (S4 revival) ===
            dead = (self.mask == 0)
            dead_count = dead.sum().item()
            
            if dead_count > 0:
                n_grow = min(int(total * self.grow_rate), dead_count)
                
                # S4 门槛: 只复活 potential > mean(active_potential) 的死连接
                if alive_count > 0:
                    active_pot = self.potential[alive].mean()
                else:
                    active_pot = 0.01
                
                # 在死连接中找 potential 最高的
                dead_pot = self.potential[dead]
                qualified = dead_pot > active_pot
                
                if qualified.sum() > 0:
                    # 优先复活 qualified 的
                    n_qualified = min(n_grow, qualified.sum().item())
                    dead_indices = dead.nonzero(as_tuple=False)
                    # 在 qualified 的死连接中按 potential 排，取 top-n
                    qualified_idx = dead_indices[dead_pot > active_pot]
                    qualified_pot = self.potential[qualified_idx[:, 0], qualified_idx[:, 1]]
                    _, top = torch.topk(qualified_pot, n_qualified)
                    grow_idx = qualified_idx[top]
                else:
                    # 没有达标的，随机复活 (兜底)
                    dead_indices = dead.nonzero(as_tuple=False)
                    idx = torch.randperm(dead_indices.shape[0])[:n_grow]
                    grow_idx = dead_indices[idx]
                
                r, c = grow_idx[:, 0], grow_idx[:, 1]
                self.mask[r, c] = 1
                self.weight[r, c] = torch.randn(grow_idx.shape[0], device=self.weight.device) * 0.01  # 软启动
                self.freq[r, c] = 0.01  # 小初始值
    
    @property
    def density(self):
        return self.mask.sum().item() / self.mask.numel()
```

---

## 4. 训练计划 — 三层课程

| 阶段 | 内容 | 题量 | 步数 | 目标 |
|------|------|------|------|------|
| **P1 基础会计** | accounting + auditing + 基础概念 | ~200 条 | 500 | 密度基准, Loss 收敛 |
| **P2 全科灌入** | 所有 FinEval 会计/审计/税法/财管/经济法 | ~500 条 | 1500 | 跨域泛化, 密度继续降 |
| **P3 实战测试** | 真实 FinEval 真题 (无答案) + 建木路由联合 | ~100 条 | 300 | 最终密度, 准确率评估 |

每阶段结束后运行验证，只有当**val_loss 改善**时才进入下一阶段（S4 验证驱动）。

---

## 5. H20 执行计划

```
云机配置: H20 96GB HBM3
模型: Qwen3.6-27B (HuggingFace 直接下载)
训练层: 仅 lm_head (155M 参数, DynLinearS4)
量化: bfloat16
Training overhead: ~3GB (optimizer + activations)
总显存: ~22GB / 96GB

预计耗时:
  P1: 500步 × 0.3s = 150s ≈ 3分钟
  P2: 1500步 × 0.3s = 450s ≈ 8分钟  
  P3: 300步 × 0.3s = 90s ≈ 2分钟
  总计: ~15分钟 (含验证)
```

---

## 6. 预期结果

基于 0.6B 实验趋势 + S4 机制增强，预测：

| 指标 | 0.6B (195步) | 27B (2000步) 预测 |
|------|-------------|------------------|
| lm_head 初始密度 | 100% | 100% |
| lm_head 最终密度 | 74% | 40-55% |
| 密度地板 | 无 (掉到 32% on L1) | 50% |
| Loss 趋势 | 2.18→1.27 | 预计 < 1.0 |
| 关键连接识别 | 梯度 EMA | S4 Health Score (更准) |

---

## 7. 文件清单

```
[REDACTED_LOCAL_PATH]
├─ s4_integration_design.md     # 本文档
├─ dynlinear_s4.py               # S4增强版动态稀疏层 (待实现)
├─ train_27b_s4.py               # 27B三步训练脚本 (待实现)
└─ results/                      # 训练结果 (待生成)
```

*参考: `[REDACTED_LOCAL_PATH]`*
