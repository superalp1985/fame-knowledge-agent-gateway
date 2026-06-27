export type FameKey =
  | 'mu'
  | 'chi'
  | 'epsilon'
  | 'kappa'
  | 'nu'
  | 'delta'
  | 'rho'
  | 'lambda'

export type FameVector = Record<FameKey, number>

export type Scope = {
  project_id: string
  subject: string
  domain: string
  route_id: string
  task_id: string
}

export type RouteNodeKind =
  | 'intent'
  | 'association'
  | 'abstraction'
  | 'rule'
  | 'tool'
  | 'quality'
  | 'summary'
  | 'lesson'

export type RouteNode = {
  id: string
  label: string
  kind: RouteNodeKind
  subject: string
  route_id: string
  summary: string
  source_ref: string
  position: { x: number; y: number }
}

export type FameEdgeState = {
  edge_id: string
  source_id: string
  target_id: string
  relation_type:
    | 'routes_to'
    | 'uses_tool'
    | 'supports'
    | 'conflicts_with'
    | 'fixes_by'
    | 'summarizes_to'
  scope: Scope
  fame: FameVector
  dynamics: {
    xi: number
    freshness: number
    half_life_days: number
    last_verified_at: string
  }
  evidence: {
    success_count: number
    failure_count: number
    conflict_count: number
    lesson_count: number
    source_refs: string[]
    log_refs: string[]
  }
}

export type GoalGate = {
  gate_id: string
  goal_type:
    | 'answer_question'
    | 'choose_tool'
    | 'fix_failure'
    | 'generate_artifact'
    | 'pass_quality_gate'
    | 'update_knowledge'
    | 'resume_project'
  success_condition: string
  required_outputs: string[]
  quality_gates: string[]
  forbidden_paths: string[]
  context_budget: number
}

export type TraversalStep = {
  id: string
  name: string
  kept: string[]
  pruned: Array<{ id: string; reason: string }>
  note: string
}

export type GoalPath = {
  path_id: string
  gate: GoalGate
  route_nodes: string[]
  selected_edges: string[]
  estimated_score: number
  estimated_context_cost: number
  risk_flags: string[]
  steps: TraversalStep[]
}

export type KnowledgePatchProposal = {
  proposal_id: string
  proposer: 'human' | 'agent' | 'scheduler'
  target: {
    route_id: string
    file_path: string
    section: string
  }
  patch_type:
    | 'add_route'
    | 'edit_route'
    | 'add_edge'
    | 'update_tool_manual'
    | 'add_lesson'
    | 'deprecate_edge'
  content_summary: string
  evidence_refs: string[]
  affected_edges: string[]
  initial_fame: FameVector
  review_status: 'proposed' | 'approved' | 'rejected' | 'needs_revision'
}

export type ModuleDebugState = {
  module_id: string
  health: 'normal' | 'degraded' | 'blocked'
  latency_ms: number
  last_trace_id: string
  metrics: Record<string, number>
}

export type AgentAdapterKind = 'mcp' | 'http' | 'cli' | 'ide' | 'workflow'

export type AgentConnector = {
  adapter_id: string
  kind: AgentAdapterKind
  status: 'ready' | 'planned' | 'blocked'
  exposes: string[]
  contract: string
}

export type AgentThinkingMode =
  | 'work_start_alignment'
  | 'scope_resolve'
  | 'semantic_route'
  | 'goalgate_traversal'
  | 'tool_governance'
  | 'context_pack'
  | 'memory_update'

export type AgentThinkingStage = {
  mode: AgentThinkingMode
  input: string
  output: string
  guardrail: string
}

export type AgentActionProposal = {
  action_id: string
  intended_adapter: AgentAdapterKind
  intended_tool_id: string
  purpose: string
  scope: Scope
  requires_manual: boolean
  context_cost: number
}

export type EnforcementCheck = {
  check_id: string
  label: string
  status: 'pass' | 'warn' | 'fail'
  detail: string
}

export type ApprovedActionPreview = {
  approved: boolean
  approval_token: string
  blocked_reason: string
  required_next_step: string
  checks: EnforcementCheck[]
}

export type SemanticAnchorKind = 'language_tree' | 'taxonomy' | 'abstraction' | 'association' | 'tool' | 'quality'

export type SemanticAnchor = {
  anchor_id: string
  label: string
  kind: SemanticAnchorKind
  keywords: string[]
}

export type SemanticAssociationProposal = {
  proposal_id: string
  target_route_id: string
  target_label: string
  anchor_id: string
  anchor_label: string
  score: number
  confidence: 'high' | 'medium' | 'review'
  formula: string
  rationale: string
}

export type ContextPackPreview = {
  scope_key: string
  retained_items: string[]
  released_items: string[]
  estimated_tokens: number
  summary_ref: string
}

export type FameTimeseriesPoint = {
  point_id: string
  edge_id: string
  route_id: string
  project_id: string
  observed_at: string
  event_ref: string
  fame: FameVector
  target_fame: FameVector
  inertia_xi: number
  predicted_delta: number
  observed_delta: number
  update_reason: 'success' | 'failure' | 'conflict' | 'stale' | 'verified' | 'manual_review' | 'quality_gate'
  evidence_refs: string[]
}

export type PhysicalFeedbackEvent = {
  event_id: string
  trace_id: string
  project_id: string
  route_id: string
  action_id: string
  feedback_type: 'lint' | 'build' | 'test' | 'browser' | 'tool_result' | 'human_review' | 'asset_verify'
  status: 'pass' | 'fail' | 'partial' | 'blocked'
  distance_before: number
  distance_after: number
  kappa_scac: number
  posterior_entropy_before: number
  posterior_entropy_after: number
  feedback_gain: number
  required_next_step: string
  evidence_refs: string[]
}

export type RoutePosteriorCandidate = {
  route_id: string
  label: string
  prior: number
  posterior: number
  entropy_contribution: number
  policy_pass: boolean
  last_feedback_ref: string
  rationale: string
}

export type RoutePosteriorState = {
  state_id: string
  project_id: string
  task_id: string
  goal_gate_id: string
  candidates: RoutePosteriorCandidate[]
  entropy: number
  selected_route_id: string
}

export type FullMemoryRetentionState = {
  memory_id: string
  memory_type: 'context_summary' | 'route_summary' | 'failure_lesson' | 'tool_summary' | 'asset_index' | 'trace'
  scope: Scope
  importance: number
  freshness: number
  reuse_count: number
  full_retention: true
  context_action: 'include_summary' | 'lazy_load_raw' | 'pin_for_goal' | 'audit_only' | 'promote_candidate'
  storage_ref: string
  summary_ref: string
  reason: string
}

export type TemporalTruthEdge = {
  edge_id: string
  valid_from: string
  valid_to: string | null
  observed_at: string
  last_verified_at: string
  invalidated_by_ref: string | null
  status: 'valid_now' | 'expired' | 'invalidated' | 'unverified_recent' | 'verified_recent'
  provenance_refs: string[]
  fame_state_ref: string
}

export type SyncOutboxEvent = {
  outbox_id: string
  source_proposal_id: string
  sync_id: string
  target: string
  operation: string
  status: 'pending' | 'approved' | 'sent' | 'applied' | 'failed' | 'replayed' | 'blocked'
  approval_token: string
  replayable: boolean
  trace_id: string
  reason: string
}

export type TraceSpanEvent = {
  span_id: string
  trace_id: string
  parent_span_id: string | null
  name: string
  module_id: string
  status: 'ok' | 'warn' | 'error'
  duration_ms: number
  summary: string
}
