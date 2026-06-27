import { createHash, createHmac, timingSafeEqual } from 'node:crypto'

export const defaultApiKey = process.env.FAME_GATEWAY_DEV_API_KEY || 'dev-fame-agent-key'
export const approvalSecret = process.env.FAME_APPROVAL_SECRET || 'dev-fame-approval-secret-change-me'

export const defaultAllowedTools = [
  'knowledge_router.resolve_goal',
  'knowledge_router.route_knowledge',
  'context.pack',
  'summary_memory.write',
  'knowledge_patch.submit',
  'sync.status',
  'clock.schedule',
  'clock.run_due',
  'clock.list',
  'semantic.rebuild',
  'semantic.search',
  'asset.index.sync',
  'asset.list',
  'trace.export',
]

export const defaultAllowedAdapters = ['http', 'mcp', 'cli', 'ide', 'workflow']

export function hashApiKey(apiKey) {
  return createHash('sha256').update(String(apiKey ?? ''), 'utf8').digest('hex')
}

export function hashToken(token) {
  return createHash('sha256').update(String(token ?? ''), 'utf8').digest('hex')
}

export function defaultAgentRecord(now) {
  return {
    agent_id: process.env.FAME_GATEWAY_DEV_AGENT_ID || 'codex-workbench-agent',
    api_key_hash: hashApiKey(defaultApiKey),
    role: 'developer',
    scopes_json: JSON.stringify([{ project_id: '*', subject: '*', route_id: '*', task_id: '*' }]),
    allowed_tools_json: JSON.stringify(defaultAllowedTools),
    allowed_adapters_json: JSON.stringify(defaultAllowedAdapters),
    status: 'active',
    created_at: now,
    updated_at: now,
  }
}

export function normalizeAgent(row) {
  if (!row) return null
  return {
    agent_id: row.agent_id,
    role: row.role,
    status: row.status,
    scopes: JSON.parse(row.scopes_json || '[]'),
    allowed_tools: JSON.parse(row.allowed_tools_json || '[]'),
    allowed_adapters: JSON.parse(row.allowed_adapters_json || '[]'),
    created_at: row.created_at,
    updated_at: row.updated_at,
  }
}

export function publicAgent(agent) {
  if (!agent) return null
  return {
    agent_id: agent.agent_id,
    role: agent.role,
    status: agent.status,
    scopes: agent.scopes,
    allowed_tools: agent.allowed_tools,
    allowed_adapters: agent.allowed_adapters,
  }
}

function wildcardMatch(pattern, value) {
  return pattern === '*' || String(pattern ?? '') === String(value ?? '')
}

export function scopeAllowed(agent, scope = {}) {
  if (!agent || agent.status !== 'active') return false
  return (agent.scopes ?? []).some((allowed) => {
    if (allowed === '*') return true
    return (
      wildcardMatch(allowed.project_id ?? '*', scope.project_id) &&
      wildcardMatch(allowed.subject ?? '*', scope.subject) &&
      wildcardMatch(allowed.route_id ?? '*', scope.route_id) &&
      wildcardMatch(allowed.task_id ?? '*', scope.task_id)
    )
  })
}

export function canonicalToolId(toolId) {
  const value = String(toolId ?? '')
  const aliases = {
    resolve_goal: 'knowledge_router.resolve_goal',
    route_knowledge: 'knowledge_router.route_knowledge',
    pack_context: 'context.pack',
    write_summary: 'summary_memory.write',
    submit_patch: 'knowledge_patch.submit',
    get_sync_status: 'sync.status',
    schedule_clock: 'clock.schedule',
    run_due_clocks: 'clock.run_due',
    list_clocks: 'clock.list',
    rebuild_semantic_index: 'semantic.rebuild',
    semantic_search: 'semantic.search',
    sync_asset_index: 'asset.index.sync',
    list_assets: 'asset.list',
    export_trace: 'trace.export',
  }
  return aliases[value] ?? value
}

export function toolAllowed(agent, toolId) {
  if (!agent || agent.status !== 'active') return false
  const allowed = agent.allowed_tools ?? []
  const canonical = canonicalToolId(toolId)
  return allowed.includes('*') || allowed.includes(canonical) || allowed.includes(toolId)
}

export function adapterAllowed(agent, adapter) {
  if (!agent || agent.status !== 'active') return false
  const allowed = agent.allowed_adapters ?? []
  return allowed.includes('*') || allowed.includes(String(adapter ?? ''))
}

export function extractApiKeyFromHeaders(headers = {}) {
  const direct = headers['x-fame-api-key']
  if (direct) return Array.isArray(direct) ? direct[0] : direct
  const auth = headers.authorization
  const value = Array.isArray(auth) ? auth[0] : auth
  const match = /^Bearer\s+(.+)$/i.exec(String(value ?? ''))
  return match?.[1] ?? ''
}

function base64UrlEncode(value) {
  return Buffer.from(value).toString('base64url')
}

function base64UrlDecode(value) {
  return Buffer.from(value, 'base64url').toString('utf8')
}

function signPayload(payload, secret = approvalSecret) {
  return createHmac('sha256', secret).update(payload, 'utf8').digest('base64url')
}

export function createApprovalToken(payload, secret = approvalSecret) {
  const encodedPayload = base64UrlEncode(JSON.stringify(payload))
  const signature = signPayload(encodedPayload, secret)
  return `fame.approval.v1.${encodedPayload}.${signature}`
}

export function verifyApprovalToken(token, secret = approvalSecret) {
  const parts = String(token ?? '').split('.')
  if (parts.length !== 5 || parts[0] !== 'fame' || parts[1] !== 'approval' || parts[2] !== 'v1') {
    return { ok: false, reason: 'invalid approval token format' }
  }
  const [, , , encodedPayload, signature] = parts
  const expected = signPayload(encodedPayload, secret)
  const sig = Buffer.from(signature)
  const exp = Buffer.from(expected)
  if (sig.length !== exp.length || !timingSafeEqual(sig, exp)) {
    return { ok: false, reason: 'invalid approval token signature' }
  }
  try {
    return { ok: true, payload: JSON.parse(base64UrlDecode(encodedPayload)) }
  } catch {
    return { ok: false, reason: 'invalid approval token payload' }
  }
}
