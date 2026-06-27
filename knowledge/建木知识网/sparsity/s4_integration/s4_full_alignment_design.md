# S4 GrowPruneFormer × 建木 — 完整对齐实验设计 v2.0

**日期**: 2026-05-12  
**目录**: `[REDACTED_LOCAL_PATH]`

---

## 1. 训练数据

### 来源
- **建木知识网**: 1.3MB, 神经元 (概念+解析) + 抽象规则
- **FinEval 真题**: 34 科目, dev+val 共 1321 题 (含解析)

### 34 科目清单

| 类别 | 科目 | dev | val | 合计 |
|------|------|-----|-----|------|
| 会计类 | accounting | 5 | 36 | 41 |
| | intermediate_financial_accounting | 5 | 26 | 31 |
| | advanced_financial_accounting | 5 | 21 | 26 |
| | cost_accounting | 5 | 34 | 39 |
| | management_accounting | 5 | 29 | 34 |
| | financial_management | 5 | 24 | 29 |
| | auditing | 5 | 32 | 37 |
| | certified_practising_accountant | 5 | 34 | 39 |
| | certified_management_accountant | 5 | 18 | 23 |
| | corporate_strategy_and_risk_management | 5 | 33 | 38 |
| 金融类 | finance | 5 | 25 | 30 |
| | corporate_finance | 5 | 36 | 41 |
| | financial_engineering | 5 | 26 | 31 |
| | financial_markets | 5 | 39 | 44 |
| | international_finance | 5 | 17 | 22 |
| | investments | 5 | 38 | 43 |
| | commercial_bank_finance | 5 | 20 | 25 |
| | central_banking | 5 | 28 | 33 |
| | monetary_finance | 5 | 43 | 48 |
| 法律/税务 | tax_law | 5 | 45 | 50 |
| | economic_law | 5 | 25 | 30 |
| 经济类 | macroeconomics | 5 | 31 | 36 |
| | microeconomics | 5 | 40 | 45 |
| | international_economics | 5 | 20 | 25 |
| | political_economy | 5 | 23 | 28 |
| | public_finance | 5 | 40 | 45 |
| | econometrics | 5 | 18 | 23 |
| 资格证 | banking_practitioner | 5 | 116 | 121 |
| | fund_qualification | 5 | 68 | 73 |
| | futures_practitioner | 5 | 39 | 44 |
| | securities_practitioner | 5 | 22 | 27 |
| | china_actuary | 5 | 37 | 42 |
| 其他 | statistics | 5 | 35 | 40 |
| | insurance | 5 | 33 | 38 |
| **总计** | **34 科目** | **170** | **1151** | **1321** |

---

## 2. 五层可塑性对齐

| S4 层 | 建木实现 | 目标参数 | 状态 |
|-------|---------|---------|------|
| **L1 权重通道** | PlasticFFN (Health Score) | 最后 N 层 FFN | ✅ |
| **L2 注意力头** | PlasticAttention (Head Health) | 最后 N 层 Attention | ✅ |
| **L3 层数增长** | DeepCopy + Gaussian Noise | 默认关, 可开关 | 🔧 |
| **L4 密度底线** | min_density = 50% | 所有 PlasticFFN | ✅ |
| **L5 验证驱动** | Val Loss > 阈值才演化 | 每个 evolve 步 | ✅ |

---

## 3. 关键 Hyperparams

| 参数 | 值 | 来源 |
|------|-----|------|
| PRUNE_RATE | 0.08 (8% per evolve) | S4 |
| GROW_RATE | 0.05 (5% per evolve) | S4 |
| MIN_DENSITY | 0.50 (保底 50%) | S4 |
| Health Score | |W| · log(1+EMA_act) | S4 |
| Growth Potential | |grad| 乘积 | S4 |
| Revival Gate | potential > mean(active) | S4 |
| 学习率 | 2e-5 | 经验 |
| max_length | 64 tokens | VRAM 优化 |

---

## 4. 训练分阶段

| 阶段 | 步数 | 内容 | 预计 |
|------|------|------|------|
| P1 全科目 | 400 | 34 科全量 | 首次密度下降 |
| P2 深度优化 | 600 | 低 Loss 精调 | 密度稳定平台 |
| P3 收敛验证 | 300 | 最终验证 | 统计报告 |

---

## 5. 文件清单

```
[REDACTED_LOCAL_PATH]
├─ s4_integration_design.md          # v1 文档 (已过时)
├─ s4_full_alignment_design.md       # v2 本文档
├─ train_s4_full.py                  # 完整训练脚本
├─ train_27b_h20.py                  # v1 仅 lm_head
├─ dynamic_sparsity_report.md        # 微型 MLP 报告
└─ dynamic_sparsity_full_report.md   # 0.6B + mini-MLP 综合报告
```
