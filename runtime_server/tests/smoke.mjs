import { spawn } from 'node:child_process'
import { once } from 'node:events'
import { createInterface } from 'node:readline'
import { setTimeout as delay } from 'node:timers/promises'
import { defaultApiKey } from '../src/auth.mjs'
import { createGatewayHttpServer } from '../src/http-server.mjs'
import { gatewayDbPath } from '../src/paths.mjs'
import { GatewayStore, openGatewayStore } from '../src/store.mjs'

function assert(condition, message) {
  if (!condition) throw new Error(message)
}

async function request(baseUrl, path, body, { apiKey = defaultApiKey, expectOk = true } = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    method: body ? 'POST' : 'GET',
    headers: {
      ...(body ? { 'content-type': 'application/json' } : {}),
      ...(apiKey ? { authorization: `Bearer ${apiKey}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  const json = await response.json()
  if (expectOk && !response.ok) throw new Error(`${path} failed: ${JSON.stringify(json)}`)
  return json
}

async function approve(baseUrl, scope, toolId, purpose, actionId) {
  const approved = await request(baseUrl, '/action/propose', {
    action_id: actionId,
    adapter: 'http',
    tool_id: toolId,
    purpose,
    scope,
    manual_ref: `runtime_server/docs/tool-contract.md#${toolId}`,
    context_cost: 300,
    risk_level: 'normal',
  })
  assert(approved.approved === true, `${toolId} approved`)
  assert(approved.approval_token.startsWith('fame.approval.v1.'), `${toolId} hmac token issued`)
  return approved
}

async function execute(baseUrl, approvalToken, args = {}) {
  return request(baseUrl, '/tool/execute', { approval_token: approvalToken, args })
}

async function runHttpSmoke() {
  const store = new GatewayStore(openGatewayStore(gatewayDbPath))
  const { server } = createGatewayHttpServer({ store })
  server.listen(0, '127.0.0.1')
  await once(server, 'listening')
  const address = server.address()
  const baseUrl = `http://127.0.0.1:${address.port}`

  try {
    const health = await request(baseUrl, '/health', null, { apiKey: '' })
    assert(health.ok === true, 'health ok')
    assert(health.knowledge.files >= 600, 'knowledge files loaded')
    assert(health.memory_policy === 'full_retention_context_distillation', 'full memory retention policy')

    const unauthorized = await request(baseUrl, '/stats', null, { apiKey: '', expectOk: false })
    assert(unauthorized.error === 'unauthorized', 'protected endpoint requires api key')

    const me = await request(baseUrl, '/agent/me')
    assert(me.agent_id === 'codex-workbench-agent', 'authenticated agent resolved')

    const scope = { project_id: 'fame-agent-gateway', subject: 'agent', route_id: 'agent/gateway', task_id: 'smoke-http' }
    const resolved = await request(baseUrl, '/goal/resolve', {
      goal: 'implement real agent gateway enforcement',
      scope,
    })
    assert(resolved.selected_route_id, 'goal resolved route')

    const context = await request(baseUrl, '/context/pack', {
      goal: 'implement real agent gateway enforcement',
      scope: resolved.scope,
      route_ids: [resolved.selected_route_id],
    })
    assert(context.memory_policy === 'full_retention_context_distillation', 'context retains full memory policy')
    assert(context.estimated_tokens <= 4800, 'context budget respected')

    const blocked = await request(baseUrl, '/tool/execute', {
      tool_id: 'knowledge_router.resolve_goal',
      args: { goal: 'should block' },
    })
    assert(blocked.executed === false && blocked.status === 'blocked', 'tool execution blocks without approval')

    const approved = await approve(
      baseUrl,
      resolved.scope,
      'knowledge_router.resolve_goal',
      'Resolve gateway implementation goal through approved action.',
      'smoke-approved-action',
    )

    const tampered = await request(baseUrl, '/tool/execute', {
      approval_token: `${approved.approval_token.slice(0, -2)}xx`,
      args: { goal: 'tampered resolver' },
    })
    assert(tampered.executed === false && tampered.blocked_reason.includes('signature'), 'tampered token blocks')

    const executed = await execute(baseUrl, approved.approval_token, { goal: 'execute approved resolver' })
    assert(executed.executed === true, 'approved tool executed')
    assert(executed.result.selected_route_id, 'approved tool returned result')

    const reused = await execute(baseUrl, approved.approval_token, { goal: 'reuse should block' })
    assert(reused.executed === false && reused.blocked_reason.includes('used'), 'used approval token blocks')

    const clockApproval = await approve(
      baseUrl,
      resolved.scope,
      'clock.schedule',
      'Schedule a due runtime clock reminder through approved gateway.',
      'smoke-clock-action',
    )
    const scheduled = await execute(baseUrl, clockApproval.approval_token, {
      run_at: new Date(Date.now() - 1000).toISOString(),
      kind: 'resume_task',
      payload: { note: 'smoke due job' },
    })
    assert(scheduled.executed === true && scheduled.result.status === 'scheduled', 'clock scheduled')

    const runDueApproval = await approve(
      baseUrl,
      resolved.scope,
      'clock.run_due',
      'Run due runtime clock jobs through approved gateway.',
      'smoke-clock-run-due-action',
    )
    const dueResult = await execute(baseUrl, runDueApproval.approval_token, {
      now: new Date().toISOString(),
      limit: 10,
    })
    const due = dueResult.result
    assert(due.fired_count >= 1, 'due clock fired')

    const semanticApproval = await approve(
      baseUrl,
      resolved.scope,
      'semantic.rebuild',
      'Rebuild scoped semantic index for knowledge routing validation.',
      'smoke-semantic-action',
    )
    const rebuilt = await execute(baseUrl, semanticApproval.approval_token, {
      include_assets: true,
      include_project_memory: true,
    })
    assert(rebuilt.executed === true && rebuilt.result.document_count >= 600, 'semantic index rebuilt')
    const semantic = await request(baseUrl, '/semantic/search', {
      query: 'agent gateway enforcement',
      scope: resolved.scope,
      top_k: 5,
    })
    assert(semantic.results.length > 0, 'semantic search returns results')

    const assetApproval = await approve(
      baseUrl,
      resolved.scope,
      'asset.index.sync',
      'Synchronize multimodal light index with asset database adapter.',
      'smoke-asset-action',
    )
    const assetSynced = await execute(baseUrl, assetApproval.approval_token, {
      asset_id: 'asset-arch-mermaid-svg',
      operation: 'refresh_asset_index',
      proposal_id: 'smoke-kpp',
    })
    assert(assetSynced.executed === true && assetSynced.result.synced === true, 'asset index synced')
    const assets = await request(baseUrl, '/assets/list', { project_id: 'fame-agent-gateway', limit: 10 })
    assert(assets.count >= 1, 'assets listed from db adapter')

    const trace = await request(baseUrl, '/trace/export', { scope: resolved.scope, limit: 50 })
    assert(trace.span_count > 0 && trace.spans[0].traceId, 'trace export returns spans')

    const sync = await request(baseUrl, '/sync/status', { scope: resolved.scope })
    assert(sync.gateway.event_count >= 4, 'events persisted')

    return {
      health: health.status,
      selected_route_id: resolved.selected_route_id,
      context_tokens: context.estimated_tokens,
      unauthorized: unauthorized.error,
      blocked_without_token: blocked.status,
      approved_token_prefix: approved.approval_token.split('.').slice(0, 3).join('.'),
      tampered_token: tampered.status,
      clock_fired: due.fired_count,
      semantic_results: semantic.results.length,
      asset_records: assets.count,
      trace_spans: trace.span_count,
      event_count: sync.gateway.event_count,
    }
  } finally {
    await new Promise((resolve) => server.close(resolve))
    store.close()
  }
}

function sendMcp(proc, id, method, params = {}) {
  proc.stdin.write(`${JSON.stringify({ jsonrpc: '2.0', id, method, params })}\n`)
}

function createMcpLineReader(proc) {
  const rl = createInterface({ input: proc.stdout })
  const queue = []
  const waiters = []
  rl.on('line', (line) => {
    const waiter = waiters.shift()
    if (waiter) waiter(line)
    else queue.push(line)
  })
  return async function readMcpLine() {
    const line = queue.length
      ? queue.shift()
      : await new Promise((resolve) => waiters.push(resolve))
    return JSON.parse(line)
  }
}

async function runMcpSmoke() {
  const proc = spawn(process.execPath, ['src/mcp-server.mjs'], {
    cwd: new URL('..', import.meta.url),
    stdio: ['pipe', 'pipe', 'pipe'],
  })
  let stderr = ''
  proc.stderr.on('data', (chunk) => {
    stderr += chunk.toString('utf8')
  })
  const readMcpLine = createMcpLineReader(proc)

  try {
    sendMcp(proc, 1, 'initialize', { protocolVersion: '2025-06-18', capabilities: {}, clientInfo: { name: 'smoke', version: '0.0.1' } })
    const init = await readMcpLine()
    assert(init.result.serverInfo.name === 'fame-knowledge-agent-gateway', 'mcp initialize')

    sendMcp(proc, 2, 'tools/list')
    const listed = await readMcpLine()
    assert(listed.result.tools.some((tool) => tool.name === 'propose_action'), 'mcp tools list')
    assert(listed.result.tools.some((tool) => tool.name === 'semantic_search'), 'mcp semantic tool listed')
    assert(listed.result.tools.some((tool) => tool.name === 'export_trace'), 'mcp trace tool listed')

    sendMcp(proc, 3, 'tools/call', {
      name: 'propose_action',
      arguments: {
        action_id: 'mcp-smoke-action',
        adapter: 'mcp',
        tool_id: 'knowledge_router.route_knowledge',
        purpose: 'Route knowledge through MCP approved action.',
        scope: { project_id: 'fame-agent-gateway', subject: 'agent', route_id: 'agent/gateway', task_id: 'smoke-mcp' },
        manual_ref: 'mcp://tool/route_knowledge',
        context_cost: 1200,
        risk_level: 'normal',
        api_key: defaultApiKey,
      },
    })
    const proposed = await readMcpLine()
    const proposedText = proposed.result.content[0].text
    assert(proposedText.includes('approval_token'), 'mcp propose action returns token')

    sendMcp(proc, 4, 'tools/call', {
      name: 'semantic_search',
      arguments: {
        query: 'gateway',
        scope: { project_id: 'fame-agent-gateway', subject: 'agent', route_id: 'agent/gateway', task_id: 'smoke-mcp' },
        top_k: 3,
        api_key: defaultApiKey,
      },
    })
    const semantic = await readMcpLine()
    assert(semantic.result.content[0].text.includes('results'), 'mcp semantic search returns results')

    return {
      initialized: true,
      tools: listed.result.tools.length,
      stderr: stderr.trim().split('\n').filter(Boolean).slice(0, 3),
    }
  } finally {
    proc.kill()
    await delay(100)
  }
}

const http = await runHttpSmoke()
const mcp = await runMcpSmoke()

console.log(JSON.stringify({ ok: true, http, mcp }, null, 2))
