import type { FameEdgeState, FameKey, GoalGate, GoalPath, RouteNode, Scope } from './model'

export type EdgeRiskLevel = 'stable' | 'watch' | 'risk' | 'lesson'

const weights: Record<FameKey | 'quality' | 'scope', number> = {
  mu: 0.18,
  chi: 0.08,
  epsilon: 0.14,
  kappa: 0.22,
  nu: 0.12,
  delta: 0.16,
  rho: 0.06,
  lambda: 0.12,
  quality: 0.18,
  scope: 0.16,
}

export function kappaEff(edge: FameEdgeState) {
  const evidenceCount =
    edge.evidence.success_count +
    edge.evidence.failure_count +
    edge.evidence.conflict_count +
    edge.evidence.lesson_count
  const evidenceFactor = 1 - Math.exp(-evidenceCount / 4)
  const conflictPenalty = 1 / (1 + edge.fame.delta + edge.evidence.conflict_count)
  return edge.fame.kappa * edge.dynamics.freshness * evidenceFactor * conflictPenalty
}

export function routeScore(edge: FameEdgeState, scope: Scope) {
  const scopeFit =
    edge.scope.project_id === scope.project_id &&
    edge.scope.subject === scope.subject &&
    edge.scope.route_id === scope.route_id
      ? 1
      : edge.scope.project_id === scope.project_id
        ? 0.55
        : 0.15

  const qualityFit = edge.relation_type === 'conflicts_with' ? 0.1 : 0.75
  const score =
    weights.mu * edge.fame.mu +
    weights.chi * edge.fame.chi +
    weights.epsilon * edge.fame.epsilon +
    weights.kappa * kappaEff(edge) -
    weights.nu * edge.fame.nu -
    weights.delta * edge.fame.delta -
    weights.rho * edge.fame.rho -
    weights.lambda * edge.fame.lambda +
    weights.quality * qualityFit +
    weights.scope * scopeFit

  return Number(score.toFixed(3))
}

export function edgeHeatColor(edge: FameEdgeState) {
  const { mu, kappa, rho } = edge.fame
  const riskLevel = edgeRiskLevel(edge)
  if (riskLevel === 'risk') return '#e25252'
  if (riskLevel === 'lesson') return '#9b5de5'
  if (riskLevel === 'watch') return rho > 0.65 ? '#747b87' : '#d79a20'
  if (mu > 0.74) return '#2f9e65'
  if (kappa > 0.72) return '#2d7dd2'
  return '#6b7280'
}

export function edgeRiskLevel(edge: FameEdgeState): EdgeRiskLevel {
  if (edge.relation_type === 'conflicts_with' || edge.fame.delta > 0.65) return 'risk'
  if (edge.fame.lambda > 0.68 || edge.evidence.failure_count >= 3) return 'lesson'
  if (edge.fame.delta > 0.55) return 'risk'
  if (edge.fame.nu > 0.62 || edge.fame.rho > 0.65 || edge.dynamics.freshness < 0.8) return 'watch'
  return 'stable'
}

export function edgeRiskLabel(edge: FameEdgeState) {
  const level = edgeRiskLevel(edge)
  if (level === 'risk') return edge.relation_type === 'conflicts_with' ? '冲突阻断' : '负值风险'
  if (level === 'lesson') return '失败教训'
  if (level === 'watch') return edge.dynamics.freshness < 0.8 ? '低新鲜度' : '待验证'
  return '健康'
}

export function edgeStrokePattern(edge: FameEdgeState) {
  const level = edgeRiskLevel(edge)
  if (level === 'risk') return '10 5'
  if (level === 'lesson') return '4 5'
  if (level === 'watch') return '7 6'
  return edge.dynamics.freshness < 0.9 ? '6 6' : undefined
}

export function shouldPrune(edge: FameEdgeState, scope: Scope) {
  if (edge.scope.project_id !== scope.project_id) return 'project_id 不匹配'
  if (edge.fame.delta > 0.65) return 'delta 冲突过高'
  if (edge.fame.rho > 0.8) return 'context/resource 压力过高'
  if (edge.fame.lambda > 0.72 && edge.evidence.failure_count >= 3) return 'lambda 高且失败复发'
  if (edge.dynamics.freshness < 0.35) return 'freshness 过低，需要先验证'
  return ''
}

export function buildGoalPath(nodes: RouteNode[], edges: FameEdgeState[], scope: Scope, gate: GoalGate): GoalPath {
  const scopedEdges = edges.filter((edge) => edge.scope.project_id === scope.project_id)
  const candidateEdges = scopedEdges
    .map((edge) => ({ edge, score: routeScore(edge, scope), pruneReason: shouldPrune(edge, scope) }))
    .sort((a, b) => b.score - a.score)

  const keptAfterScope = candidateEdges.filter((item) => !item.pruneReason)
  const selectedEdges = keptAfterScope.slice(0, 5).map((item) => item.edge)
  const selectedNodeIds = Array.from(
    new Set(selectedEdges.flatMap((edge) => [edge.source_id, edge.target_id])),
  )

  const contextCost = selectedNodeIds.length * 280 + selectedEdges.length * 160
  const riskFlags = selectedEdges.flatMap((edge) => {
    const flags: string[] = []
    if (edge.fame.nu > 0.55) flags.push(`${edge.edge_id}: risk`)
    if (edge.fame.lambda > 0.55) flags.push(`${edge.edge_id}: recurrence`)
    if (edge.dynamics.freshness < 0.8) flags.push(`${edge.edge_id}: stale-ish`)
    return flags
  })

  const avgScore =
    selectedEdges.reduce((sum, edge) => sum + routeScore(edge, scope), 0) / Math.max(selectedEdges.length, 1)
  const selectedLabels = selectedNodeIds.map((id) => nodes.find((node) => node.id === id)?.label ?? id)

  return {
    path_id: 'goalpath-workbench-v0',
    gate,
    route_nodes: selectedNodeIds,
    selected_edges: selectedEdges.map((edge) => edge.edge_id),
    estimated_score: Number(avgScore.toFixed(3)),
    estimated_context_cost: contextCost,
    risk_flags: riskFlags,
    steps: [
      {
        id: 'resolve-scope',
        name: 'Resolve Scope',
        kept: [`${scope.project_id}/${scope.subject}/${scope.route_id}`],
        pruned: [],
        note: '默认不做全图扫描，只进入当前 project + subject + route shard。',
      },
      {
        id: 'candidate-route',
        name: 'Candidate Route Lookup',
        kept: candidateEdges.slice(0, 8).map((item) => item.edge.edge_id),
        pruned: candidateEdges.slice(8).map((item) => ({ id: item.edge.edge_id, reason: '超出 route_top_k=8' })),
        note: '先从 route shard 和 summary cache 取候选边。',
      },
      {
        id: 'fame-scoring',
        name: 'FAME Scoring',
        kept: keptAfterScope.slice(0, 6).map((item) => `${item.edge.edge_id} (${item.score})`),
        pruned: candidateEdges
          .filter((item) => item.pruneReason)
          .map((item) => ({ id: item.edge.edge_id, reason: item.pruneReason })),
        note: '按 mu/chi/epsilon/kappa_eff 减去 nu/delta/rho/lambda，并叠加 scope 与 quality fit。',
      },
      {
        id: 'goal-gate-check',
        name: 'Goal Gate Check',
        kept: selectedLabels,
        pruned:
          contextCost > gate.context_budget
            ? [{ id: 'raw-log-expansion', reason: '超过 context_budget，保留摘要不展开原始日志' }]
            : [],
        note: '目标门要求可运行产物、可视图、patch proposal 和调试接口。',
      },
      {
        id: 'route-posterior',
        name: 'Route Posterior',
        kept: selectedEdges.map((edge) => edge.scope.route_id),
        pruned: keptAfterScope
          .slice(5)
          .map((item) => ({ id: item.edge.edge_id, reason: 'posterior 低于当前 beam，保留为候选摘要' })),
        note: 'v13 维护候选路线后验概率，真实反馈收敛后提高主路线权重。',
      },
      {
        id: 'scac-feedback',
        name: 'SCAC Physical Feedback',
        kept: ['lint/build/test/browser/tool_result -> PhysicalFeedbackEvent'],
        pruned: candidateEdges
          .filter((item) => item.edge.fame.lambda > 0.68 && item.edge.evidence.failure_count >= 3)
          .map((item) => ({ id: item.edge.edge_id, reason: 'kappa_scac 需要先证明收敛，不能惯性重试' })),
        note: '如果 kappa_scac >= 1 且 entropy_drop <= 0，必须 re-scope、换路由或 human_review。',
      },
      {
        id: 'full-memory-retention',
        name: 'Full Memory Retention',
        kept: ['full logs', 'route summaries', 'failure lessons', 'asset refs', 'trace spans'],
        pruned: [{ id: 'raw-memory-in-context', reason: '全量记忆保留在外部存储，本轮上下文只放摘要和 refs' }],
        note: '底层记忆、日志和 trace 全量保留；Context Pack 只控制进入本轮上下文的摘要粒度。',
      },
    ],
  }
}
