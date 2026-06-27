import type { KnowledgeIndexEntry, KnowledgeShardSummary } from './generated/knowledgeIndex.generated'
import type {
  AgentActionProposal,
  AgentConnector,
  AgentThinkingStage,
  ApprovedActionPreview,
  ContextPackPreview,
  FameEdgeState,
  GoalPath,
  RouteNode,
  Scope,
  SemanticAnchor,
  SemanticAssociationProposal,
} from './model'
import { edgeRiskLevel } from './routeEngine'

export const agentConnectors: AgentConnector[] = [
  {
    adapter_id: 'mcp-agent-gateway',
    kind: 'mcp',
    status: 'ready',
    exposes: ['resolve_goal', 'route_knowledge', 'propose_action', 'pack_context', 'write_summary'],
    contract: 'MCP exposes tools/resources/prompts, but every tool action still needs ApprovedAction.',
  },
  {
    adapter_id: 'http-runtime-api',
    kind: 'http',
    status: 'planned',
    exposes: ['POST /goal/resolve', 'POST /action/propose', 'GET /graph/routes', 'POST /context/pack'],
    contract: 'HTTP API is for web apps and remote agents that cannot mount an MCP server directly.',
  },
  {
    adapter_id: 'cli-local-bridge',
    kind: 'cli',
    status: 'planned',
    exposes: ['fame route', 'fame action dry-run', 'fame summary write'],
    contract: 'CLI keeps local automation scriptable while preserving scope and audit checks.',
  },
  {
    adapter_id: 'ide-copilot-panel',
    kind: 'ide',
    status: 'planned',
    exposes: ['current_file_scope', 'route_hint', 'failure_replay', 'patch_review'],
    contract: 'IDE adapter maps editor state to project_id/subject/route_id before agent reasoning.',
  },
  {
    adapter_id: 'workflow-resume-adapter',
    kind: 'workflow',
    status: 'planned',
    exposes: ['clock_event', 'resume_task', 'human_review', 'replay_trace'],
    contract: 'Workflow adapter handles long tasks, reminders, retries, and human-in-the-loop stops.',
  },
]

export const semanticAnchors: SemanticAnchor[] = [
  {
    anchor_id: 'anchor-language-tree',
    label: '语言树中枢',
    kind: 'language_tree',
    keywords: ['语言', '语义', '词汇', '语法', '表达', '概念', '抽象', '联想'],
  },
  {
    anchor_id: 'anchor-formal-taxonomy',
    label: '正规学科分类',
    kind: 'taxonomy',
    keywords: ['学科', '门类', '一级学科', '二级学科', '分类', '标准', 'taxonomy'],
  },
  {
    anchor_id: 'anchor-abstraction-route',
    label: '抽象与模型层',
    kind: 'abstraction',
    keywords: ['对象', '属性', '关系', '规则', '模型', '方法', '规律', '结构'],
  },
  {
    anchor_id: 'anchor-association-creative',
    label: '联想创造层',
    kind: 'association',
    keywords: ['联想', '类比', '跨学科', '迁移', '创造', '扩展', '相似'],
  },
  {
    anchor_id: 'anchor-tool-governance',
    label: '工具治理层',
    kind: 'tool',
    keywords: ['工具', '调用', 'manual', '参数', '权限', 'MCP', 'API', 'CLI'],
  },
  {
    anchor_id: 'anchor-quality-memory',
    label: '质量与记忆层',
    kind: 'quality',
    keywords: ['质量', '验证', '失败', '教训', '摘要', 'FAME', 'freshness', '复发'],
  },
]

function normalizeText(value: unknown) {
  return String(value ?? '')
    .toLocaleLowerCase()
    .replace(/[^\p{L}\p{N}_]+/gu, ' ')
    .trim()
}

function tokenize(value: unknown) {
  return Array.from(new Set(normalizeText(value).split(/\s+/).filter(Boolean)))
}

function tokenOverlapScore(sourceTokens: string[], targetTokens: string[]) {
  if (sourceTokens.length === 0 || targetTokens.length === 0) return 0
  const targetSet = new Set(targetTokens)
  const hits = sourceTokens.filter((token) => targetSet.has(token)).length
  return hits / Math.sqrt(sourceTokens.length * targetTokens.length)
}

function fieldHitScore(text: string, keywords: string[]) {
  if (!text || keywords.length === 0) return 0
  const hits = keywords.filter((keyword) => text.includes(keyword.toLocaleLowerCase())).length
  return hits / keywords.length
}

export function buildThinkingStages(scope: Scope, goalPath: GoalPath): AgentThinkingStage[] {
  return [
    {
      mode: 'work_start_alignment',
      input: 'user request + latest design docs',
      output: `${scope.project_id}/${scope.subject}/${scope.route_id}`,
      guardrail: 'No route traversal before WorkStartAlignment and GoalGate exist.',
    },
    {
      mode: 'scope_resolve',
      input: 'project event, selected shard, route search hit',
      output: `task=${scope.task_id}`,
      guardrail: 'Every memory, patch, action, and log must carry project_id/subject/route_id/task_id.',
    },
    {
      mode: 'semantic_route',
      input: 'language-tree anchor + route fingerprint + FAME state',
      output: 'semantic association proposals, not direct core edits',
      guardrail: 'Low confidence semantic matches become review proposals.',
    },
    {
      mode: 'goalgate_traversal',
      input: `${goalPath.route_nodes.length} route nodes / ${goalPath.selected_edges.length} selected edges`,
      output: `score=${goalPath.estimated_score}, ctx=${goalPath.estimated_context_cost}`,
      guardrail: 'Scoped beam search only; no full graph scan.',
    },
    {
      mode: 'tool_governance',
      input: 'ProposedAction',
      output: 'ApprovedAction or blocked reason',
      guardrail: 'The agent cannot execute a tool unless the gateway issues an approval token.',
    },
    {
      mode: 'context_pack',
      input: 'route summary, selected evidence, failure lessons',
      output: 'minimal resume context',
      guardrail: 'Raw logs and full manuals are released after summary is written.',
    },
    {
      mode: 'memory_update',
      input: 'tool result, review result, route score delta',
      output: 'FAMEEdgeState delta + SummaryMemory',
      guardrail: 'Failures are retained as lessons instead of being retried blindly.',
    },
  ]
}

export function buildActionProposal(scope: Scope, selectedNode?: RouteNode, goalPath?: GoalPath): AgentActionProposal {
  const node = selectedNode
  return {
    action_id: `pa-${scope.task_id}`,
    intended_adapter: 'mcp',
    intended_tool_id: node?.kind === 'tool' ? 'tool_manual_registry.read_then_execute' : 'knowledge_router.resolve_goal',
    purpose: node ? `Use route node "${node.label}" to advance the active GoalGate.` : 'Resolve the active GoalGate.',
    scope,
    requires_manual: node?.kind === 'tool',
    context_cost: goalPath?.estimated_context_cost ?? 0,
  }
}

export function previewApprovedAction(
  proposal: AgentActionProposal,
  edges: FameEdgeState[],
  goalPath: GoalPath,
): ApprovedActionPreview {
  const selectedEdges = edges.filter((edge) => goalPath.selected_edges.includes(edge.edge_id))
  const hasRoute = proposal.scope.route_id.trim().length > 0
  const highRiskEdge = selectedEdges.find((edge) => edgeRiskLevel(edge) === 'risk')
  const highLessonEdge = selectedEdges.find((edge) => edgeRiskLevel(edge) === 'lesson')
  const contextOk = proposal.context_cost <= goalPath.gate.context_budget
  const manualOk = !proposal.requires_manual || proposal.intended_tool_id.includes('manual')
  const checks = [
    {
      check_id: 'scope_check',
      label: 'Scope',
      status: hasRoute ? 'pass' : 'fail',
      detail: hasRoute ? 'project_id/subject/route_id present' : 'route_id missing',
    },
    {
      check_id: 'goalgate_check',
      label: 'GoalGate',
      status: goalPath.selected_edges.length > 0 ? 'pass' : 'fail',
      detail: `${goalPath.selected_edges.length} selected route edges`,
    },
    {
      check_id: 'manual_check',
      label: 'Tool manual',
      status: manualOk ? 'pass' : 'fail',
      detail: manualOk ? 'manual will be loaded lazily before execution' : 'tool action lacks manual step',
    },
    {
      check_id: 'fame_check',
      label: 'FAME risk',
      status: highRiskEdge ? 'fail' : highLessonEdge ? 'warn' : 'pass',
      detail: highRiskEdge
        ? `${highRiskEdge.edge_id} is conflict/risk`
        : highLessonEdge
          ? `${highLessonEdge.edge_id} is a failure lesson`
          : 'selected route has no blocking risk edge',
    },
    {
      check_id: 'context_check',
      label: 'Context budget',
      status: contextOk ? 'pass' : 'warn',
      detail: `${proposal.context_cost}/${goalPath.gate.context_budget} estimated tokens`,
    },
  ] satisfies ApprovedActionPreview['checks']
  const failed = checks.find((check) => check.status === 'fail')
  const approved = !failed
  return {
    approved,
    approval_token: approved ? `approved:${proposal.action_id}:scope:${proposal.scope.route_id}` : '',
    blocked_reason: failed?.detail ?? '',
    required_next_step: approved ? 'Gateway may execute the approved adapter call.' : 'Revise route, scope, manual, or FAME risk first.',
    checks,
  }
}

export function buildSemanticAssociationProposals(
  entries: KnowledgeIndexEntry[],
  shard: KnowledgeShardSummary | undefined,
  selectedNode: RouteNode | undefined,
) {
  const candidates = entries.slice(0, 24)
  const shardText = shard ? `${shard.subject} ${shard.root_label} ${shard.keywords.join(' ')}` : ''
  const routeText = selectedNode ? `${selectedNode.label} ${selectedNode.summary} ${selectedNode.route_id}` : ''
  const proposals: SemanticAssociationProposal[] = []

  for (const entry of candidates) {
    const fingerprint = [
      entry.title,
      entry.subject,
      entry.route_id,
      entry.route_domain,
      entry.route_type,
      entry.keywords.join(' '),
      entry.excerpt,
      shardText,
      routeText,
    ].join(' ')
    const fingerprintTokens = tokenize(fingerprint)
    const normalizedFingerprint = normalizeText(fingerprint)

    for (const anchor of semanticAnchors) {
      const anchorTokens = tokenize(`${anchor.label} ${anchor.keywords.join(' ')}`)
      const overlap = tokenOverlapScore(fingerprintTokens, anchorTokens)
      const keywordHit = fieldHitScore(normalizedFingerprint, anchor.keywords)
      const routePriority = Math.min(1, (entry.priority ?? 1) / 10)
      const routeTypeBoost = entry.entry_type === 'route_record' ? 0.12 : 0.04
      const score = Math.min(1, 0.42 * overlap + 0.3 * keywordHit + 0.12 * routePriority + routeTypeBoost)
      if (score < 0.16) continue
      proposals.push({
        proposal_id: `sap-${entry.id}-${anchor.anchor_id}`.replace(/[^a-zA-Z0-9_-]+/g, '-').slice(0, 96),
        target_route_id: entry.route_id,
        target_label: entry.title,
        anchor_id: anchor.anchor_id,
        anchor_label: anchor.label,
        score: Number(score.toFixed(3)),
        confidence: score >= 0.62 ? 'high' : score >= 0.36 ? 'medium' : 'review',
        formula: '0.42*token_overlap + 0.30*keyword_hit + 0.12*priority + route_type_boost',
        rationale: `${entry.subject || 'unknown subject'} / ${entry.route_domain ?? 'route'} -> ${anchor.kind}`,
      })
    }
  }

  return proposals.sort((a, b) => b.score - a.score).slice(0, 8)
}

export function buildContextPackPreview(
  scope: Scope,
  selectedNode: RouteNode | undefined,
  goalPath: GoalPath,
  semanticProposals: SemanticAssociationProposal[],
): ContextPackPreview {
  const retained = [
    `scope:${scope.project_id}/${scope.subject}/${scope.route_id}`,
    `goal:${goalPath.gate.gate_id}`,
    `node:${selectedNode?.label ?? 'none'}`,
    ...goalPath.selected_edges.slice(0, 4).map((edgeId) => `edge:${edgeId}`),
    ...semanticProposals.slice(0, 3).map((proposal) => `semantic:${proposal.anchor_label}`),
  ]
  return {
    scope_key: `${scope.project_id}/${scope.subject}/${scope.route_id}/${scope.task_id}`,
    retained_items: retained,
    released_items: ['raw_tool_manual_after_call', 'full_search_results', 'unselected_edges', 'raw_logs_after_summary'],
    estimated_tokens: Math.min(goalPath.gate.context_budget, 420 + retained.length * 130),
    summary_ref: `summary_memory/${scope.project_id}/${scope.task_id}.md`,
  }
}
