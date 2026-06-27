import { createInterface } from 'node:readline'
import { stdin as input, stdout as output } from 'node:process'
import { defaultApiKey } from './auth.mjs'
import { GatewayStore } from './store.mjs'
import { authenticateAgent, createRuntimeApi } from './runtime.mjs'

const store = new GatewayStore()
const publicApi = createRuntimeApi(store)

const serverInfo = {
  name: 'fame-knowledge-agent-gateway',
  version: '0.1.0',
}

const tools = [
  {
    name: 'resolve_goal',
    description: 'Resolve a goal into scoped FAME knowledge route candidates.',
    inputSchema: {
      type: 'object',
      properties: {
        goal: { type: 'string' },
        scope: { type: 'object' },
        top_k: { type: 'number' },
        api_key: { type: 'string' },
      },
    },
  },
  {
    name: 'route_knowledge',
    description: 'Search scoped knowledge shards and route records.',
    inputSchema: {
      type: 'object',
      properties: {
        goal: { type: 'string' },
        scope: { type: 'object' },
        top_k: { type: 'number' },
        api_key: { type: 'string' },
      },
    },
  },
  {
    name: 'pack_context',
    description: 'Build a summary-first context pack with refs and lazy-load boundaries.',
    inputSchema: {
      type: 'object',
      properties: {
        goal: { type: 'string' },
        scope: { type: 'object' },
        route_ids: { type: 'array', items: { type: 'string' } },
        budget: { type: 'number' },
        api_key: { type: 'string' },
      },
    },
  },
  {
    name: 'propose_action',
    description: 'Run Enforcement Kernel and return ApprovedAction or blocked reason.',
    inputSchema: {
      type: 'object',
      properties: {
        action_id: { type: 'string' },
        adapter: { type: 'string' },
        tool_id: { type: 'string' },
        purpose: { type: 'string' },
        scope: { type: 'object' },
        manual_ref: { type: 'string' },
        context_cost: { type: 'number' },
        risk_level: { type: 'string' },
        api_key: { type: 'string' },
      },
    },
  },
  {
    name: 'execute_tool',
    description: 'Execute an approved tool call. Requires approval_token.',
    inputSchema: {
      type: 'object',
      properties: {
        approval_token: { type: 'string' },
        tool_id: { type: 'string' },
        args: { type: 'object' },
        api_key: { type: 'string' },
      },
      required: ['approval_token'],
    },
  },
  {
    name: 'write_summary',
    description: 'Append a summary memory event without deleting raw memory.',
    inputSchema: {
      type: 'object',
      properties: {
        scope: { type: 'object' },
        summary: { type: 'string' },
        refs: { type: 'array', items: { type: 'string' } },
        api_key: { type: 'string' },
      },
    },
  },
  {
    name: 'submit_patch',
    description: 'Submit a KnowledgePatchProposal event. Does not directly modify core knowledge files.',
    inputSchema: {
      type: 'object',
      properties: {
        scope: { type: 'object' },
        patch: { type: 'object' },
        api_key: { type: 'string' },
      },
    },
  },
  {
    name: 'get_sync_status',
    description: 'Read gateway, v13 outbox, and asset DB sync status.',
    inputSchema: {
      type: 'object',
      properties: {
        scope: { type: 'object' },
        api_key: { type: 'string' },
      },
    },
  },
  {
    name: 'schedule_clock',
    description: 'Schedule a durable ClockEvent for resume/reminder/self-iteration.',
    inputSchema: {
      type: 'object',
      properties: {
        scope: { type: 'object' },
        run_at: { type: 'string' },
        kind: { type: 'string' },
        payload: { type: 'object' },
        api_key: { type: 'string' },
      },
    },
  },
  {
    name: 'run_due_clocks',
    description: 'Fire due ClockEvent jobs and append replayable runtime events.',
    inputSchema: {
      type: 'object',
      properties: {
        now: { type: 'string' },
        limit: { type: 'number' },
        api_key: { type: 'string' },
      },
    },
  },
  {
    name: 'semantic_search',
    description: 'Search the scoped SQLite semantic index with project/subject/route scoping.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string' },
        scope: { type: 'object' },
        top_k: { type: 'number' },
        api_key: { type: 'string' },
      },
    },
  },
  {
    name: 'rebuild_semantic_index',
    description: 'Rebuild derived semantic documents/terms from knowledge, project memory, and asset indexes.',
    inputSchema: {
      type: 'object',
      properties: {
        scope: { type: 'object' },
        include_assets: { type: 'boolean' },
        include_project_memory: { type: 'boolean' },
        api_key: { type: 'string' },
      },
    },
  },
  {
    name: 'sync_asset_index',
    description: 'Synchronize a light multimodal asset index into the asset DB adapter.',
    inputSchema: {
      type: 'object',
      properties: {
        asset_id: { type: 'string' },
        asset: { type: 'object' },
        operation: { type: 'string' },
        proposal_id: { type: 'string' },
        status: { type: 'string' },
        api_key: { type: 'string' },
      },
    },
  },
  {
    name: 'list_assets',
    description: 'List multimodal asset DB light indexes without loading raw payloads into context.',
    inputSchema: {
      type: 'object',
      properties: {
        project_id: { type: 'string' },
        modality: { type: 'string' },
        sync_status: { type: 'string' },
        limit: { type: 'number' },
        api_key: { type: 'string' },
      },
    },
  },
  {
    name: 'export_trace',
    description: 'Export runtime events as OpenTelemetry-style JSON spans.',
    inputSchema: {
      type: 'object',
      properties: {
        scope: { type: 'object' },
        format: { type: 'string' },
        limit: { type: 'number' },
        api_key: { type: 'string' },
      },
    },
  },
]

const resources = [
  {
    uri: 'fame://runtime/stats',
    name: 'FAME Runtime Stats',
    description: 'Runtime index counts, gateway event counts, and memory policy.',
    mimeType: 'application/json',
  },
  {
    uri: 'fame://sync/status',
    name: 'FAME Sync Status',
    description: 'Sync outbox, asset DB sync queue, and recent gateway events.',
    mimeType: 'application/json',
  },
  {
    uri: 'fame://assets/index',
    name: 'FAME Asset Index',
    description: 'Light multimodal asset indexes with db/object/text refs.',
    mimeType: 'application/json',
  },
]

function textContent(value) {
  return [{ type: 'text', text: typeof value === 'string' ? value : JSON.stringify(value, null, 2) }]
}

function apiForArgs(args = {}) {
  const apiKey = args.api_key || process.env.FAME_MCP_API_KEY || defaultApiKey
  const agent = authenticateAgent(store, apiKey)
  return createRuntimeApi(store, { agent, adapter: 'mcp' })
}

async function callTool(name, args = {}) {
  const api = apiForArgs(args)
  if (name === 'resolve_goal') return api.resolveGoal(args)
  if (name === 'route_knowledge') return api.routeKnowledge(args)
  if (name === 'pack_context') return api.packContext(args)
  if (name === 'propose_action') return api.enforceAction(args)
  if (name === 'execute_tool') return api.executeTool(args)
  if (name === 'write_summary') return api.writeSummary(args)
  if (name === 'submit_patch') return api.submitPatch(args)
  if (name === 'get_sync_status') return api.getSyncStatus(args)
  if (name === 'schedule_clock') return api.scheduleClockEvent(args)
  if (name === 'run_due_clocks') return api.runDueClockEvents(args)
  if (name === 'semantic_search') return api.semanticSearch(args)
  if (name === 'rebuild_semantic_index') return api.rebuildSemanticIndex(args)
  if (name === 'sync_asset_index') return api.syncAssetIndex(args)
  if (name === 'list_assets') return api.listAssets(args)
  if (name === 'export_trace') return api.exportTrace(args)
  throw new Error(`Unknown tool: ${name}`)
}

function readResource(uri) {
  const api = apiForArgs({})
  if (uri === 'fame://runtime/stats') return publicApi.stats()
  if (uri === 'fame://sync/status') return api.getSyncStatus({})
  if (uri === 'fame://assets/index') return api.listAssets({})
  throw new Error(`Unknown resource: ${uri}`)
}

function respond(id, result) {
  output.write(`${JSON.stringify({ jsonrpc: '2.0', id, result })}\n`)
}

function respondError(id, error) {
  output.write(`${JSON.stringify({
    jsonrpc: '2.0',
    id,
    error: {
      code: -32000,
      message: error instanceof Error ? error.message : String(error),
    },
  })}\n`)
}

async function handleMessage(message) {
  const { id, method, params = {} } = message
  if (method === 'initialize') {
    respond(id, {
      protocolVersion: params.protocolVersion ?? '2025-06-18',
      capabilities: {
        tools: {},
        resources: {},
      },
      serverInfo,
    })
    return
  }
  if (method === 'notifications/initialized') return
  if (method === 'tools/list') {
    respond(id, { tools })
    return
  }
  if (method === 'tools/call') {
    const result = await callTool(params.name, params.arguments ?? {})
    respond(id, { content: textContent(result) })
    return
  }
  if (method === 'resources/list') {
    respond(id, { resources })
    return
  }
  if (method === 'resources/read') {
    const result = readResource(params.uri)
    respond(id, {
      contents: [{
        uri: params.uri,
        mimeType: 'application/json',
        text: JSON.stringify(result, null, 2),
      }],
    })
    return
  }
  if (method === 'prompts/list') {
    respond(id, {
      prompts: [{
        name: 'fame_work_start_alignment',
        description: 'Align scope, GoalGate, memory policy, and enforcement before agent work.',
      }],
    })
    return
  }
  if (method === 'prompts/get') {
    respond(id, {
      description: 'FAME WorkStartAlignment prompt',
      messages: [{
        role: 'user',
        content: {
          type: 'text',
          text: 'Before acting, resolve scope, route knowledge, pack context, propose action, and only execute with ApprovedAction.',
        },
      }],
    })
    return
  }
  respondError(id, new Error(`Unsupported MCP method: ${method}`))
}

const rl = createInterface({ input })
rl.on('line', async (line) => {
  if (!line.trim()) return
  try {
    await handleMessage(JSON.parse(line))
  } catch (error) {
    respondError(null, error)
  }
})
