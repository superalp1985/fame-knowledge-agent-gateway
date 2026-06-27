import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import {
  adapterAllowed,
  canonicalToolId,
  createApprovalToken,
  hashApiKey,
  hashToken,
  publicAgent,
  scopeAllowed,
  toolAllowed,
  verifyApprovalToken,
} from './auth.mjs'
import { eventTypes } from './store.mjs'
import { generatedDir, runtimeStoreDir } from './paths.mjs'
import { normalizeText, nowIso, parseJsonLineSafe, readJson, stableId, tokenize } from './json.mjs'

const defaultScope = {
  project_id: 'fame-agent-gateway',
  subject: 'knowledge-workbench',
  domain: 'agent-external-brain',
  route_id: 'visualization-goalgate-patch',
  task_id: 'runtime-gateway',
}

const contextBudgetDefault = 4800
const routeTopKDefault = 8

let cachedRuntimeData = null

export function authenticateAgent(store, apiKey) {
  if (!apiKey) return null
  return store.getAgentByApiKeyHash(hashApiKey(apiKey))
}

function agentAclCheck(agent, scope, toolId, adapter) {
  const checks = []
  checks.push({
    check_id: 'agent_auth_check',
    label: 'Agent auth',
    status: agent?.status === 'active' ? 'pass' : 'fail',
    detail: agent?.agent_id ?? 'agent authentication required',
  })
  checks.push({
    check_id: 'agent_scope_acl_check',
    label: 'Agent scope ACL',
    status: scopeAllowed(agent, scope) ? 'pass' : 'fail',
    detail: `${scope.project_id}/${scope.subject}/${scope.route_id}/${scope.task_id}`,
  })
  checks.push({
    check_id: 'agent_tool_acl_check',
    label: 'Agent tool ACL',
    status: toolAllowed(agent, toolId) ? 'pass' : 'fail',
    detail: canonicalToolId(toolId),
  })
  checks.push({
    check_id: 'agent_adapter_acl_check',
    label: 'Agent adapter ACL',
    status: adapterAllowed(agent, adapter) ? 'pass' : 'fail',
    detail: adapter,
  })
  return checks
}

function authorizeRead(agent, scope, toolId, adapter = 'http') {
  const nextScope = normalizeScope(scope)
  const checks = agentAclCheck(agent, nextScope, toolId, adapter)
  const failed = checks.find((check) => check.status === 'fail')
  if (failed) {
    return {
      ok: false,
      status: 'blocked',
      blocked_reason: failed.detail,
      checks,
      required_next_step: 'Authenticate the agent and grant matching project/tool scope.',
    }
  }
  return { ok: true, checks, scope: nextScope }
}

function readJsonl(file) {
  if (!existsSync(file)) return []
  return readFileSync(file, 'utf8')
    .split(/\r?\n/)
    .filter(Boolean)
    .map(parseJsonLineSafe)
    .filter(Boolean)
}

export function loadRuntimeData() {
  if (cachedRuntimeData) return cachedRuntimeData
  const knowledgeIndex = readJson(join(generatedDir, 'knowledgeIndex.generated.json'))
  const knowledgeGraph = readJson(join(generatedDir, 'knowledgeGraph.generated.json'))
  const projectMemory = readJson(join(generatedDir, 'projectMemory.generated.json'))
  const multimodalAssets = readJson(join(generatedDir, 'multimodalAssets.generated.json'))
  const v13Runtime = readJson(join(generatedDir, 'v13Runtime.generated.json'))
  const runtimeV13 = {
    fameTimeseries: readJsonl(join(runtimeStoreDir, 'v13', 'fame_timeseries.jsonl')),
    fullMemoryRetention: readJsonl(join(runtimeStoreDir, 'v13', 'full_memory_retention.jsonl')),
    physicalFeedback: readJsonl(join(runtimeStoreDir, 'v13', 'physical_feedback_events.jsonl')),
    syncOutbox: readJsonl(join(runtimeStoreDir, 'v13', 'sync_outbox_events.jsonl')),
    temporalTruth: readJsonl(join(runtimeStoreDir, 'v13', 'temporal_truth_edges.jsonl')),
    traceSpans: readJsonl(join(runtimeStoreDir, 'v13', 'trace_spans.jsonl')),
  }
  cachedRuntimeData = { knowledgeIndex, knowledgeGraph, projectMemory, multimodalAssets, v13Runtime, runtimeV13 }
  return cachedRuntimeData
}

export function runtimeStats(store) {
  const data = loadRuntimeData()
  return {
    status: 'ready',
    memory_policy: data.v13Runtime.manifest?.memory_policy ?? 'full_retention_context_distillation',
    knowledge: {
      files: data.knowledgeIndex.stats.totalFiles,
      entries: data.knowledgeIndex.stats.totalEntries,
      routes: data.knowledgeIndex.stats.totalRouteRecords,
      shards: data.knowledgeIndex.stats.shardCount,
    },
    project_memory: data.projectMemory.stats,
    assets: data.multimodalAssets.stats,
    v13: data.v13Runtime.stats,
    gateway: store.stats(),
  }
}

export function normalizeScope(input = {}) {
  return {
    ...defaultScope,
    ...input,
    project_id: String(input.project_id || defaultScope.project_id),
    subject: String(input.subject || defaultScope.subject),
    route_id: String(input.route_id || defaultScope.route_id),
    task_id: String(input.task_id || defaultScope.task_id),
  }
}

function scoreCandidate(query, tokens, title, fields = []) {
  const titleText = normalizeText(title)
  const body = normalizeText([title, ...fields].join(' '))
  if (tokens.length && !tokens.every((token) => body.includes(token))) return 0
  let score = 1
  if (query && titleText === query) score += 8
  if (query && titleText.startsWith(query)) score += 5
  if (query && titleText.includes(query)) score += 3
  score += tokens.filter((token) => titleText.includes(token)).length
  return score
}

export function routeKnowledge({ goal = '', scope = {}, top_k = routeTopKDefault } = {}) {
  const data = loadRuntimeData()
  const nextScope = normalizeScope(scope)
  const query = normalizeText(goal || nextScope.subject || nextScope.route_id)
  const tokens = tokenize(query)
  const max = Math.min(Number(top_k) || routeTopKDefault, 50)

  const shardCandidates = data.knowledgeIndex.shards
    .map((shard) => {
      const scopeBoost =
        shard.route_id === nextScope.route_id
          ? 5
          : shard.root_id === nextScope.subject || shard.subject === nextScope.subject
            ? 2
            : 0
      const score = scoreCandidate(query, tokens, shard.subject, [
        shard.root_label,
        shard.route_id,
        shard.shard_id,
        shard.keywords?.join(' '),
      ]) + scopeBoost
      return { shard, score }
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, max)

  const routeCandidates = data.knowledgeIndex.entries
    .filter((entry) => entry.entry_type === 'route_record')
    .map((entry) => {
      const score = scoreCandidate(query, tokens, entry.title, [
        entry.subject,
        entry.route_id,
        entry.route_domain,
        entry.route_type,
        entry.keywords?.join(' '),
        entry.excerpt,
      ]) + Number(entry.priority ?? 1) / 10
      return { entry, score }
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, max)

  const selectedShard = shardCandidates[0]?.shard ?? data.knowledgeIndex.shards.find((shard) => shard.route_id === nextScope.route_id)
  const selectedRoutes = routeCandidates.map(({ entry, score }) => ({
    id: entry.id,
    route_id: entry.route_id,
    title: entry.title,
    subject: entry.subject,
    domain: entry.route_domain ?? 'route',
    type: entry.route_type ?? 'route',
    path: entry.path,
    score: Number(score.toFixed(3)),
    priority: entry.priority ?? 1,
    excerpt: entry.excerpt,
  }))

  return {
    scope: nextScope,
    goal,
    route_top_k: max,
    selected_shard: selectedShard
      ? {
          shard_id: selectedShard.shard_id,
          root_id: selectedShard.root_id,
          root_label: selectedShard.root_label,
          subject: selectedShard.subject,
          route_id: selectedShard.route_id,
          file_count: selectedShard.file_count,
          route_record_count: selectedShard.route_record_count,
          keywords: selectedShard.keywords?.slice(0, 12) ?? [],
        }
      : null,
    shards: shardCandidates.map(({ shard, score }) => ({
      shard_id: shard.shard_id,
      route_id: shard.route_id,
      subject: shard.subject,
      root_label: shard.root_label,
      score: Number(score.toFixed(3)),
      files: shard.file_count,
      routes: shard.route_record_count,
    })),
    routes: selectedRoutes,
  }
}

function semanticDocumentsFromRuntimeData(data) {
  const docs = []
  for (const entry of data.knowledgeIndex.entries ?? []) {
    docs.push({
      doc_id: `knowledge:${entry.id}`,
      kind: entry.entry_type ?? 'knowledge',
      project_id: '*',
      subject: entry.subject ?? '(root)',
      route_id: entry.route_id ?? '*',
      title: entry.title ?? entry.id,
      body: [entry.title, entry.subject, entry.route_domain, entry.route_type, entry.path, entry.excerpt, ...(entry.headings ?? []).map((h) => h.text ?? h)].join(' '),
      keywords: entry.keywords ?? [],
      source_ref: entry.path ?? entry.id,
    })
  }
  for (const project of data.projectMemory.projects ?? []) {
    const projectId = project.manifest?.project_id ?? '*'
    for (const node of project.nodes ?? []) {
      docs.push({
        doc_id: `project-memory:${projectId}:${node.id}`,
        kind: node.type ?? 'ProjectMemory',
        project_id: projectId,
        subject: node.scope?.subject ?? '*',
        route_id: node.scope?.route_id ?? '*',
        title: node.label ?? node.id,
        body: [node.label, node.type, node.status, node.summary, ...(node.core_refs ?? [])].join(' '),
        keywords: [node.type, node.status, node.layer].filter(Boolean),
        source_ref: node.core_refs?.[0] ?? node.id,
      })
    }
  }
  for (const asset of data.multimodalAssets.indexes ?? []) {
    docs.push({
      doc_id: `asset:${asset.asset_id}`,
      kind: `asset:${asset.modality ?? 'unknown'}`,
      project_id: asset.project_id ?? '*',
      subject: asset.subject_refs?.[0] ?? '*',
      route_id: asset.route_refs?.[0] ?? '*',
      title: asset.label ?? asset.asset_id,
      body: [
        asset.label,
        asset.summary,
        asset.caption,
        asset.modality,
        asset.source_ref,
        asset.object_ref,
        asset.extracted_text_ref,
        ...(asset.route_refs ?? []),
        ...(asset.subject_refs ?? []),
        ...(asset.tags ?? []),
      ].join(' '),
      keywords: asset.tags ?? [],
      source_ref: asset.db_ref ?? asset.asset_id,
    })
  }
  return docs
}

function termCountsForDocument(doc) {
  const counts = {}
  for (const token of tokenize([doc.title, doc.body, ...(doc.keywords ?? [])].join(' '))) {
    if (token.length > 64) continue
    counts[token] = (counts[token] ?? 0) + 1
  }
  return counts
}

export function rebuildSemanticIndex(store, { scope = {}, include_assets = true, include_project_memory = true, force = false } = {}) {
  const data = loadRuntimeData()
  const nextScope = normalizeScope(scope)
  const existingStats = store.stats()
  if (!force && existingStats.semantic_document_count > 0) {
    return {
      scope: nextScope,
      rebuilt: false,
      cached: true,
      document_count: existingStats.semantic_document_count,
      term_count: existingStats.semantic_term_count,
      index_kind: 'sqlite_bm25ish_inverted_index',
      scoping: ['project_id', 'subject', 'route_id'],
      required_next_step: 'Pass force:true to rebuild the derived semantic index.',
    }
  }
  const startedAt = nowIso()
  const docs = semanticDocumentsFromRuntimeData(data).filter((doc) => {
    if (!include_assets && doc.kind.startsWith('asset:')) return false
    if (!include_project_memory && doc.doc_id.startsWith('project-memory:')) return false
    return true
  })
  store.clearSemanticIndex()
  for (const doc of docs) {
    store.upsertSemanticDocument({ ...doc, updated_at: startedAt }, termCountsForDocument(doc))
  }
  const payload = {
    scope: nextScope,
    rebuilt: true,
    document_count: docs.length,
    started_at: startedAt,
    completed_at: nowIso(),
    index_kind: 'sqlite_bm25ish_inverted_index',
    scoping: ['project_id', 'subject', 'route_id'],
  }
  store.appendEvent(eventTypes.traceSpan, nextScope, {
    span_name: 'semantic.rebuild',
    kind: 'indexing',
    attributes: payload,
  })
  return payload
}

export function semanticSearch(store, { query = '', scope = {}, top_k = 10 } = {}) {
  const nextScope = normalizeScope(scope)
  const terms = tokenize(query)
  let scope_mode = 'strict_project_subject_route'
  let results = store.semanticSearch({ terms, scope: nextScope, top_k })
  if (results.length === 0 && store.stats().semantic_document_count === 0) {
    rebuildSemanticIndex(store, { scope: nextScope })
    results = store.semanticSearch({ terms, scope: nextScope, top_k })
  }
  if (results.length === 0) {
    scope_mode = 'project_subject'
    results = store.semanticSearch({ terms, scope: { project_id: nextScope.project_id, subject: nextScope.subject }, top_k })
  }
  if (results.length === 0) {
    scope_mode = 'project'
    results = store.semanticSearch({ terms, scope: { project_id: nextScope.project_id }, top_k })
  }
  if (results.length === 0) {
    scope_mode = 'global_fallback'
    results = store.semanticSearch({ terms, scope: {}, top_k })
  }
  return {
    scope: nextScope,
    scope_mode,
    query,
    terms,
    top_k: Math.min(Number(top_k) || 10, 50),
    results: results.map((result) => ({
      doc_id: result.doc_id,
      kind: result.kind,
      scope: result.scope,
      title: result.title,
      source_ref: result.source_ref,
      score: result.score,
      matched_terms: result.matched_terms,
      excerpt: result.body.slice(0, 360),
      keywords: result.keywords.slice(0, 12),
    })),
  }
}

export function resolveGoal({ goal, scope = {}, top_k } = {}) {
  const routed = routeKnowledge({ goal, scope, top_k })
  const routeIds = routed.routes.map((route) => route.route_id)
  const selectedRouteId = routeIds[0] ?? routed.selected_shard?.route_id ?? routed.scope.route_id
  const resolvedScope = normalizeScope({ ...routed.scope, subject: routed.selected_shard?.subject ?? routed.scope.subject, route_id: selectedRouteId })
  return {
    goal,
    scope: resolvedScope,
    selected_route_id: selectedRouteId,
    selected_shard: routed.selected_shard,
    candidates: routed.routes,
    required_next_step: 'Call pack_context, then propose_action before any tool execution.',
  }
}

export function packContext({ goal = '', scope = {}, route_ids = [], budget = contextBudgetDefault } = {}) {
  const data = loadRuntimeData()
  const nextScope = normalizeScope(scope)
  const routeSet = new Set(route_ids.length ? route_ids : [nextScope.route_id])
  const selectedEntries = data.knowledgeIndex.entries
    .filter((entry) => routeSet.has(entry.route_id) || entry.route_id === nextScope.route_id || entry.subject === nextScope.subject)
    .slice(0, 12)

  const selectedAssets = data.multimodalAssets.indexes
    .filter((asset) => asset.route_refs?.some((route) => routeSet.has(route)) || asset.subject_refs?.includes(nextScope.subject))
    .slice(0, 6)

  const retained = [
    `scope:${nextScope.project_id}/${nextScope.subject}/${nextScope.route_id}`,
    `goal:${goal || nextScope.task_id}`,
    ...selectedEntries.slice(0, 6).map((entry) => `entry:${entry.id}`),
    ...selectedAssets.slice(0, 3).map((asset) => `asset:${asset.asset_id}`),
  ]
  const estimatedTokens = Math.min(Number(budget) || contextBudgetDefault, 420 + retained.length * 130)
  return {
    scope: nextScope,
    memory_policy: 'full_retention_context_distillation',
    retained_items: retained,
    released_items: ['raw_tool_manual_after_call', 'full_search_results', 'unselected_edges', 'raw_logs_after_summary'],
    evidence: selectedEntries.map((entry) => ({
      id: entry.id,
      title: entry.title,
      path: entry.path,
      route_id: entry.route_id,
      subject: entry.subject,
      excerpt: entry.excerpt,
    })),
    assets: selectedAssets.map((asset) => ({
      asset_id: asset.asset_id,
      label: asset.label,
      modality: asset.modality,
      db_ref: asset.db_ref,
      summary: asset.summary,
    })),
    estimated_tokens: estimatedTokens,
    budget,
    summary_ref: `summary_memory/${nextScope.project_id}/${nextScope.task_id}.md`,
  }
}

function buildChecks(proposal, contextPack = null, agent = null) {
  const checks = []
  const scope = normalizeScope(proposal.scope)
  const actionId = String(proposal.action_id ?? '')
  const toolId = canonicalToolId(String(proposal.tool_id ?? proposal.intended_tool_id ?? ''))
  const adapter = String(proposal.adapter ?? proposal.intended_adapter ?? 'http')
  const purpose = String(proposal.purpose ?? '')
  const contextCost = Number(proposal.context_cost ?? contextPack?.estimated_tokens ?? 0)
  const contextBudget = Number(proposal.context_budget ?? contextPack?.budget ?? contextBudgetDefault)
  const requiresManual = Boolean(proposal.requires_manual || toolId.includes('tool') || toolId.includes('write') || toolId.includes('execute'))
  const manualRef = String(proposal.manual_ref ?? '')
  const risk = String(proposal.risk_level ?? 'normal')

  checks.push({
    check_id: 'scope_check',
    label: 'Scope',
    status: scope.project_id && scope.subject && scope.route_id && scope.task_id ? 'pass' : 'fail',
    detail: `${scope.project_id}/${scope.subject}/${scope.route_id}/${scope.task_id}`,
  })
  checks.push({
    check_id: 'purpose_check',
    label: 'Purpose',
    status: purpose.length >= 8 ? 'pass' : 'fail',
    detail: purpose || 'purpose missing',
  })
  checks.push({
    check_id: 'adapter_check',
    label: 'Adapter',
    status: ['mcp', 'http', 'cli', 'ide', 'workflow'].includes(adapter) ? 'pass' : 'fail',
    detail: adapter,
  })
  checks.push({
    check_id: 'tool_manual_check',
    label: 'Tool manual',
    status: !requiresManual || manualRef || toolId.includes('manual') ? 'pass' : 'fail',
    detail: requiresManual ? manualRef || toolId : 'manual not required',
  })
  checks.push({
    check_id: 'context_budget_check',
    label: 'Context budget',
    status: contextCost <= contextBudget ? 'pass' : 'warn',
    detail: `${contextCost}/${contextBudget}`,
  })
  checks.push({
    check_id: 'fame_risk_check',
    label: 'FAME risk',
    status: risk === 'blocked' || risk === 'conflict' ? 'fail' : risk === 'lesson' || risk === 'watch' ? 'warn' : 'pass',
    detail: risk,
  })
  checks.push({
    check_id: 'direct_core_write_check',
    label: 'Core write boundary',
    status: toolId.includes('core.write') || toolId.includes('knowledge.write') ? 'fail' : 'pass',
    detail: toolId.includes('write') ? 'writes require KnowledgePatchProposal or Tool Gateway' : 'no direct core write',
  })
  checks.push(...agentAclCheck(agent, scope, toolId || 'knowledge_router.resolve_goal', adapter))

  return {
    action_id: actionId || stableId('action'),
    adapter,
    tool_id: toolId || 'knowledge_router.resolve_goal',
    scope,
    checks,
  }
}

export function enforceAction(store, proposal, contextPack = null, agent = null) {
  const normalized = buildChecks(proposal, contextPack, agent)
  store.appendEvent(eventTypes.proposedAction, normalized.scope, { proposal, agent: publicAgent(agent) })
  const failed = normalized.checks.find((check) => check.status === 'fail')
  const createdAt = nowIso()
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString()

  if (failed) {
    const decision = {
      approved: false,
      action_id: normalized.action_id,
      scope: normalized.scope,
      adapter: normalized.adapter,
      tool_id: normalized.tool_id,
      approval_token: '',
      blocked_reason: failed.detail,
      required_next_step: 'Revise scope, purpose, manual, FAME risk, or core write boundary first.',
      checks: normalized.checks,
      created_at: createdAt,
    }
    store.appendEvent(eventTypes.blockedAction, normalized.scope, decision)
    store.appendEvent(eventTypes.enforcementDecision, normalized.scope, decision)
    return decision
  }

  const tokenPayload = {
    action_id: normalized.action_id,
    project_id: normalized.scope.project_id,
    subject: normalized.scope.subject,
    route_id: normalized.scope.route_id,
    task_id: normalized.scope.task_id,
    adapter: normalized.adapter,
    tool_id: normalized.tool_id,
    agent_id: agent?.agent_id ?? '',
    expires_at: expiresAt,
    nonce: stableId('nonce'),
  }
  const approvalToken = createApprovalToken(tokenPayload)
  const approval = {
    approved: true,
    action_id: normalized.action_id,
    agent_id: agent?.agent_id ?? '',
    scope: normalized.scope,
    adapter: normalized.adapter,
    tool_id: normalized.tool_id,
    approval_token: approvalToken,
    approval_token_hash: hashToken(approvalToken),
    approval_payload: tokenPayload,
    blocked_reason: '',
    required_next_step: 'Tool Gateway may execute this ApprovedAction before token expiry.',
    checks: normalized.checks,
    status: 'approved',
    expires_at: expiresAt,
    created_at: createdAt,
  }
  store.insertApproval(approval)
  store.appendEvent(eventTypes.approvedAction, normalized.scope, approval)
  store.appendEvent(eventTypes.enforcementDecision, normalized.scope, approval)
  return approval
}

export function scheduleClockEvent(store, { scope = {}, run_at, kind = 'resume_task', payload = {} } = {}) {
  const nextScope = normalizeScope(scope)
  const createdAt = nowIso()
  const runAt = run_at ? new Date(run_at).toISOString() : new Date(Date.now() + 5 * 60 * 1000).toISOString()
  const job = store.scheduleJob({
    job_id: payload.job_id ?? stableId('clock'),
    scope: nextScope,
    kind,
    status: 'scheduled',
    run_at: runAt,
    payload,
    created_at: createdAt,
    updated_at: createdAt,
  })
  store.appendEvent(eventTypes.clockEvent, nextScope, {
    clock_event: 'scheduled',
    job,
  })
  return job
}

export function runDueClockEvents(store, { now = nowIso(), limit = 20 } = {}) {
  const dueJobs = store.listDueJobs(new Date(now).toISOString(), limit)
  const fired = []
  for (const job of dueJobs) {
    store.markJobStatus(job.job_id, 'fired')
    const payload = {
      clock_event: 'fired',
      job: { ...job, status: 'fired', updated_at: nowIso() },
      resume_hint: {
        required_next_step: 'Resolve goal, pack context, then propose the next action with the restored scope.',
        scope: job.scope,
        payload: job.payload,
      },
    }
    store.appendEvent(eventTypes.clockEvent, job.scope, payload)
    fired.push(payload)
  }
  return { now: new Date(now).toISOString(), fired_count: fired.length, fired }
}

export function listClockEvents(store, input = {}) {
  const scope = normalizeScope(input.scope ?? input)
  return {
    scope,
    jobs: store.listJobs({ ...scope, status: input.status, limit: input.limit ?? 50 }),
  }
}

function assetRecordFromIndex(asset, override = {}) {
  return {
    asset_id: override.asset_id ?? asset.asset_id ?? stableId('asset'),
    project_id: override.project_id ?? asset.project_id ?? defaultScope.project_id,
    modality: override.modality ?? asset.modality ?? 'unknown',
    label: override.label ?? asset.label ?? asset.asset_id ?? 'asset',
    db_ref: override.db_ref ?? asset.db_ref ?? '',
    object_ref: override.object_ref ?? asset.object_ref ?? '',
    text_ref: override.text_ref ?? asset.extracted_text_ref ?? '',
    index: {
      summary: override.summary ?? asset.summary ?? '',
      caption: override.caption ?? asset.caption ?? '',
      route_refs: override.route_refs ?? asset.route_refs ?? [],
      subject_refs: override.subject_refs ?? asset.subject_refs ?? [],
      tags: override.tags ?? asset.tags ?? [],
      preview_type: override.preview_type ?? asset.preview_type ?? '',
      thumbnail_ref: override.thumbnail_ref ?? asset.thumbnail_ref ?? '',
      source_ref: override.source_ref ?? asset.source_ref ?? '',
    },
    fame: override.fame ?? asset.fame_summary ?? {},
    sync_status: override.sync_status ?? asset.sync_status ?? asset.provenance_summary?.review_status ?? 'indexed',
  }
}

export function syncAssetIndex(store, { asset = {}, asset_id, operation = 'upsert_light_index', proposal_id = '', status = 'indexed' } = {}) {
  const data = loadRuntimeData()
  const existing = data.multimodalAssets.indexes?.find((item) => item.asset_id === (asset_id ?? asset.asset_id)) ?? {}
  const record = store.upsertAssetRecord(assetRecordFromIndex(existing, { ...asset, sync_status: status }))
  const sync = store.insertAssetSyncRecord({
    sync_id: asset.sync_id ?? stableId('asset-sync'),
    status,
    proposal_id: proposal_id || asset.proposal_id || 'manual-runtime-sync',
    asset_id: record.asset_id,
    operation,
    payload: {
      record,
      graph_policy: 'graph stores preview/index only; raw multimodal payload remains in db_ref/object_ref/text_ref',
    },
  })
  store.appendEvent(eventTypes.assetDbSyncItem, { ...defaultScope, project_id: record.project_id }, {
    sync,
    record,
    guardrails: ['raw multimodal payload is not copied into the knowledge graph', 'asset DB writes require ApprovedAction when called through Tool Gateway'],
  })
  return { synced: true, record, sync }
}

export function listAssets(store, input = {}) {
  let records = store.listAssets(input)
  if (records.length === 0 && store.stats().asset_record_count === 0) {
    const data = loadRuntimeData()
    for (const asset of data.multimodalAssets.indexes ?? []) {
      store.upsertAssetRecord(assetRecordFromIndex(asset))
    }
    records = store.listAssets(input)
  }
  return {
    assets: records,
    count: records.length,
    graph_policy: 'knowledge graph uses asset preview/index; raw multimodal data remains referenced in db/object/text refs',
  }
}

export function exportTrace(store, { scope = {}, format = 'otel-json', limit = 200 } = {}) {
  const nextScope = normalizeScope(scope)
  const events = store.listEvents({ project_id: nextScope.project_id, subject: scope.subject, route_id: scope.route_id, task_id: scope.task_id, limit })
  const spans = events.reverse().map((event, index) => ({
    traceId: `fame-${nextScope.project_id}`,
    spanId: event.event_id,
    parentSpanId: index === 0 ? null : events[index - 1].event_id,
    name: event.event_type,
    kind: event.payload?.span_name ?? event.event_type,
    startTimeUnixNano: String(new Date(event.created_at).getTime() * 1_000_000),
    endTimeUnixNano: String(new Date(event.created_at).getTime() * 1_000_000),
    attributes: {
      'fame.project_id': event.scope.project_id,
      'fame.subject': event.scope.subject,
      'fame.route_id': event.scope.route_id,
      'fame.task_id': event.scope.task_id,
      'fame.event_id': event.event_id,
      'fame.event_type': event.event_type,
    },
    events: [{ name: event.event_type, timeUnixNano: String(new Date(event.created_at).getTime() * 1_000_000), attributes: event.payload }],
  }))
  return {
    format,
    scope: nextScope,
    span_count: spans.length,
    spans,
  }
}

function executeApprovedTool(store, toolId, args = {}, scope = defaultScope) {
  const canonical = canonicalToolId(toolId)
  if (canonical === 'knowledge_router.resolve_goal') {
    return resolveGoal({ goal: args.goal ?? args.purpose ?? '', scope })
  }
  if (canonical === 'knowledge_router.route_knowledge') {
    return routeKnowledge({ goal: args.goal ?? '', scope, top_k: args.top_k })
  }
  if (canonical === 'context.pack') {
    return packContext({ goal: args.goal ?? '', scope, route_ids: args.route_ids ?? [], budget: args.budget })
  }
  if (canonical === 'summary_memory.write') {
    return writeSummary(store, { scope, summary: String(args.summary ?? ''), refs: args.refs ?? [] })
  }
  if (canonical === 'knowledge_patch.submit') {
    return submitPatch(store, {
      scope,
      patch: {
        ...args,
        target: args.target ?? { route_id: scope.route_id },
        content_summary: args.content_summary ?? 'Runtime submitted patch proposal.',
      },
    })
  }
  if (canonical === 'sync.status') {
    return getSyncStatus(store, scope)
  }
  if (canonical === 'clock.schedule') {
    return scheduleClockEvent(store, { ...args, scope })
  }
  if (canonical === 'clock.run_due') {
    return runDueClockEvents(store, args)
  }
  if (canonical === 'clock.list') {
    return listClockEvents(store, { ...args, scope })
  }
  if (canonical === 'semantic.rebuild') {
    return rebuildSemanticIndex(store, { ...args, scope })
  }
  if (canonical === 'semantic.search') {
    return semanticSearch(store, { ...args, scope })
  }
  if (canonical === 'asset.index.sync') {
    return syncAssetIndex(store, args)
  }
  if (canonical === 'asset.list') {
    return listAssets(store, args)
  }
  if (canonical === 'trace.export') {
    return exportTrace(store, { ...args, scope })
  }
  return {
    echo: args,
    tool_id: canonical,
    note: 'Tool is not registered in the safe local gateway adapter table.',
  }
}

export function executeTool(store, { approval_token, tool_id, args = {} } = {}, agent = null) {
  if (!approval_token) {
    return {
      executed: false,
      status: 'blocked',
      blocked_reason: 'approval_token required',
      required_next_step: 'Call propose_action/enforce_action first.',
    }
  }
  const verified = verifyApprovalToken(approval_token)
  if (!verified.ok) {
    return { executed: false, status: 'blocked', blocked_reason: verified.reason }
  }
  const approval = store.getApproval(approval_token)
  if (!approval) {
    return { executed: false, status: 'blocked', blocked_reason: 'approval_token not found' }
  }
  if (approval.status !== 'approved') {
    return { executed: false, status: 'blocked', blocked_reason: `approval_token status is ${approval.status}` }
  }
  if (new Date(approval.expires_at).getTime() < Date.now()) {
    return { executed: false, status: 'blocked', blocked_reason: 'approval_token expired' }
  }
  const payload = verified.payload
  const payloadMismatch =
    payload.action_id !== approval.action_id ||
    payload.project_id !== approval.scope.project_id ||
    payload.subject !== approval.scope.subject ||
    payload.route_id !== approval.scope.route_id ||
    payload.task_id !== approval.scope.task_id ||
    payload.tool_id !== approval.tool_id ||
    payload.agent_id !== approval.agent_id
  if (payloadMismatch) {
    return { executed: false, status: 'blocked', blocked_reason: 'approval_token payload mismatch' }
  }
  if (agent?.agent_id && approval.agent_id && agent.agent_id !== approval.agent_id) {
    return { executed: false, status: 'blocked', blocked_reason: `approval_token belongs to ${approval.agent_id}` }
  }
  if (!scopeAllowed(agent, approval.scope) || !toolAllowed(agent, approval.tool_id) || !adapterAllowed(agent, approval.adapter)) {
    return { executed: false, status: 'blocked', blocked_reason: 'agent ACL does not allow approved tool execution' }
  }
  const requestedToolId = canonicalToolId(tool_id)
  if (tool_id && requestedToolId !== approval.tool_id) {
    return { executed: false, status: 'blocked', blocked_reason: `tool mismatch: approved ${approval.tool_id}, requested ${tool_id}` }
  }

  const result = executeApprovedTool(store, approval.tool_id, args, approval.scope)
  store.markApprovalUsed(approval_token)
  const executionPayload = {
    executed: true,
    status: 'ok',
    approval_token_hash: hashToken(approval_token),
    action_id: approval.action_id,
    agent_id: approval.agent_id,
    tool_id: approval.tool_id,
    result,
    executed_at: nowIso(),
  }
  store.appendEvent(eventTypes.toolResult, approval.scope, executionPayload)
  return executionPayload
}

export function writeSummary(store, { scope = {}, summary = '', refs = [] } = {}) {
  const nextScope = normalizeScope(scope)
  const payload = {
    summary_ref: `summary_memory/${nextScope.project_id}/${nextScope.task_id}.md`,
    summary,
    refs,
    memory_policy: 'full_retention_context_distillation',
    created_at: nowIso(),
  }
  store.appendEvent(eventTypes.summaryMemory, nextScope, payload)
  return payload
}

export function submitPatch(store, { scope = {}, patch = {} } = {}) {
  const nextScope = normalizeScope(scope)
  const payload = {
    proposal_id: patch.proposal_id ?? stableId('kpp'),
    proposer: patch.proposer ?? 'agent',
    target: patch.target ?? { route_id: nextScope.route_id },
    patch_type: patch.patch_type ?? 'add_edge',
    content_summary: patch.content_summary ?? '',
    evidence_refs: patch.evidence_refs ?? [],
    review_status: 'proposed',
    created_at: nowIso(),
    guardrails: ['no direct core write', 'promotion review required'],
  }
  store.appendEvent(eventTypes.knowledgePatchProposal, nextScope, payload)
  return payload
}

export function getSyncStatus(store, scope = {}) {
  const data = loadRuntimeData()
  const nextScope = normalizeScope(scope)
  return {
    scope: nextScope,
    gateway: store.stats(),
    v13_outbox: data.v13Runtime.syncOutbox ?? [],
    asset_sync_queue: data.multimodalAssets.syncQueue ?? [],
    recent_events: store.listEvents({ project_id: nextScope.project_id, limit: 20 }),
  }
}

function guarded(agent, scope, toolId, adapter, fn) {
  const authorization = authorizeRead(agent, scope, toolId, adapter)
  if (!authorization.ok) return authorization
  return fn(authorization.scope)
}

function directMutationBlocked(toolId) {
  return {
    executed: false,
    status: 'blocked',
    blocked_reason: `direct ${toolId} call disabled`,
    required_next_step: `Call propose_action for ${toolId}, then execute_tool with the signed approval_token.`,
  }
}

export function createRuntimeApi(store, { agent = null, adapter = 'http' } = {}) {
  return {
    stats: () => runtimeStats(store),
    agent: () => publicAgent(agent),
    resolveGoal: (input = {}) =>
      guarded(agent, input.scope ?? {}, 'knowledge_router.resolve_goal', adapter, () => resolveGoal(input)),
    routeKnowledge: (input = {}) =>
      guarded(agent, input.scope ?? {}, 'knowledge_router.route_knowledge', adapter, () => routeKnowledge(input)),
    packContext: (input) => {
      return guarded(agent, input?.scope ?? {}, 'context.pack', adapter, () => {
        const pack = packContext(input)
        store.appendEvent(eventTypes.contextPack, pack.scope, pack)
        return pack
      })
    },
    enforceAction: (input) => enforceAction(store, input.proposal ?? input, input.context_pack ?? null, agent),
    executeTool: (input) => executeTool(store, input, agent),
    writeSummary: () => directMutationBlocked('summary_memory.write'),
    submitPatch: () => directMutationBlocked('knowledge_patch.submit'),
    getSyncStatus: (input = {}) =>
      guarded(agent, input.scope ?? input, 'sync.status', adapter, () => getSyncStatus(store, input.scope ?? input)),
    listEvents: (input = {}) =>
      guarded(agent, input, 'trace.export', adapter, () => store.listEvents(input)),
    scheduleClockEvent: () => directMutationBlocked('clock.schedule'),
    runDueClockEvents: (input = {}) =>
      guarded(agent, input.scope ?? defaultScope, 'clock.run_due', adapter, () => runDueClockEvents(store, input)),
    listClockEvents: (input = {}) =>
      guarded(agent, input.scope ?? input, 'clock.list', adapter, () => listClockEvents(store, input)),
    rebuildSemanticIndex: () => directMutationBlocked('semantic.rebuild'),
    semanticSearch: (input = {}) =>
      guarded(agent, input.scope ?? {}, 'semantic.search', adapter, () => semanticSearch(store, input)),
    syncAssetIndex: () => directMutationBlocked('asset.index.sync'),
    listAssets: (input = {}) =>
      guarded(agent, input.scope ?? { project_id: input.project_id ?? defaultScope.project_id }, 'asset.list', adapter, () => listAssets(store, input)),
    exportTrace: (input = {}) =>
      guarded(agent, input.scope ?? {}, 'trace.export', adapter, () => exportTrace(store, input)),
  }
}
