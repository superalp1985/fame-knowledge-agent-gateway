# FAME 参数与公式设计

## 1. 8 维路由状态

```text
E_edge(t) = (mu, chi, epsilon, kappa, nu, delta, rho, lambda)^T
```

这些参数不是装饰性情绪，而是工程路线状态：

- `mu`：有效性。
- `chi`：探索价值。
- `epsilon`：与用户目标、项目语义、知识网风格的贴合度。
- `kappa`：置信度。
- `nu`：风险和不确定性。
- `delta`：逻辑冲突。
- `rho`：资源/上下文压力。
- `lambda`：持续失败和教训记忆。

## 2. 惯性更新

```text
E_edge(t) = clip(E_edge(t-1) + (1 - xi) * r_t, 0, 1)
```

`xi` 越大，越不容易被单次事件改变。

## 3. 时效性

```text
freshness(t) = exp(-(now - last_verified_at) / half_life)
```

```text
kappa_eff = kappa * freshness * evidence_factor * conflict_penalty
```

```text
evidence_factor = 1 - exp(-evidence_count / c)
conflict_penalty = 1 / (1 + delta + unresolved_conflicts)
```

## 4. 路由评分

```text
Score(route) =
  0.18 * mu
+ 0.08 * chi
+ 0.14 * epsilon
+ 0.22 * kappa_eff
- 0.12 * nu
- 0.16 * delta
- 0.06 * rho
- 0.12 * lambda
+ 0.18 * quality_gate_fit
+ 0.16 * subject_scope_fit
```

## 5. 触发人工确认

```text
delta > 0.65
nu > 0.75 and kappa_eff < 0.45
lambda > 0.70 and failure_count >= 3
rho > 0.80 and requires_heavy_worker
permission_required = true
```

## 6. 上下文健康

上下文只保留当前必须信息：

```text
Context(t) =
  current_intent
+ route_summary_top_k
+ abstraction_summary
+ fame_state_summary
+ recent_relevant_lessons
+ active_constraints
```

任务结束后：

```text
full_trace -> log
key_trace -> summary
summary -> searchable index
FAME delta -> edge state
```

## 7. v13 FAME 时间动力学

`FAMEEdgeState` 不应只保存当前值，还应保存时间序列和惯性。每次工程事件、质量门、工具反馈、人工审核都会生成一个 `FAMETimeseriesPoint`。

```yaml
FAMETimeseriesPoint:
  point_id: string
  edge_id: string
  route_id: string
  project_id: string
  observed_at: datetime
  event_ref: string
  fame: { mu, chi, epsilon, kappa, nu, delta, rho, lambda }
  target_fame: { mu, chi, epsilon, kappa, nu, delta, rho, lambda }
  inertia_xi: float
  update_reason: success|failure|conflict|stale|verified|manual_review|quality_gate
  evidence_refs: list
```

更新式：

```text
E(t+1) =
  clip(
    E(t)
  + eta * (1 - xi) * (E_target(t) - E(t))
  + beta * r_event(t)
  - gamma * stale_penalty(t),
    0, 1
  )
```

惯性估计：

```text
xi_hat =
  clamp(
    1 - sum(<DeltaE_i, D_i>) / (sum(||D_i||^2) + eps),
    0, 1
  )
```

工程含义：

```text
xi 高：路线稳定，单次事件不应剧烈改写边状态。
xi 低：路线仍在摸索，近期反馈会快速影响路由。
```

## 8. v13 SCAC 反馈收敛

SCAC 要求语义路线接受真实工程反馈。lint、build、test、browser、tool result、human review、asset verify 都应写成 `PhysicalFeedbackEvent`。

```yaml
PhysicalFeedbackEvent:
  event_id: string
  trace_id: string
  project_id: string
  route_id: string
  action_id: string
  feedback_type: lint|build|test|browser|tool_result|human_review|asset_verify
  status: pass|fail|partial|blocked
  distance_before: float
  distance_after: float
  kappa_scac: float
  posterior_entropy_before: float
  posterior_entropy_after: float
  feedback_gain: float
  evidence_refs: list
```

收敛系数：

```text
kappa_scac = distance_after / max(distance_before, eps)
```

规则：

```text
kappa_scac < 1:
  当前路线正在接近 GoalGate。

kappa_scac >= 1 and entropy_drop <= 0:
  当前路线没有收敛，禁止继续惯性执行，必须 re-scope、换路线或进入 human_review。
```

Bayesian 路由后验：

```text
p_{t+1}(route_i) =
  normalize(
    p_t(route_i)
  * Phi(feedback_t | route_i)
  * I(policy_pass_i)
  )
```

后验熵：

```text
H_t = - sum_i p_t(route_i) * log(p_t(route_i))
entropy_drop = H_t - H_{t+1}
```

## 9. v13 情绪标记与全量记忆保留

Onto-plasticity 的工程价值改为：底层记忆、日志、trace、资产索引和失败教训全量保留；系统只根据情绪标记、失败教训、置信度、上下文压力和时效性，决定本轮上下文读取摘要、引用、固定片段，还是按需懒加载原始记录。

情绪标记：

```text
alpha(E, m) =
  (1 / 8) * sum_i w_i * abs(E_i - Ebar_i(m))
```

上下文有效半衰期：

```text
tau_eff(m) =
  base_tau(m)
  * (1 + a1 * alpha + a2 * lambda + a3 * kappa + a4 * human_pin)
  / (1 + b1 * rho + b2 * staleness)
```

上下文注意强度：

```text
context_attention(t + dt) =
  context_attention(t) * exp(-dt / tau_eff)
```

动作：

```text
include_summary:
  读取摘要和关键证据 ref，不读取完整原始记录。

pin_for_goal:
  当前 GoalGate 必需的失败教训、约束或人工钉住内容，直接进入上下文。

lazy_load_raw:
  原始记录全量留在外部存储，需要审计、复盘或验证时再加载。

audit_only:
  默认只保留 trace/ref，不进入普通执行上下文。

promote_candidate:
  跨项目复现或人工确认的项目经验。
```

硬约束：

```text
raw_memory_delete = forbidden
full_retention = true
context_health = summary/ref/lazy-load policy
```
