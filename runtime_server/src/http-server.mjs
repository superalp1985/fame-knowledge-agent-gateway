import { createServer } from 'node:http'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { extractApiKeyFromHeaders, publicAgent } from './auth.mjs'
import { GatewayStore } from './store.mjs'
import { authenticateAgent, createRuntimeApi } from './runtime.mjs'

const host = process.env.FAME_GATEWAY_HOST || '127.0.0.1'
const port = Number(process.env.FAME_GATEWAY_PORT || 5191)

function sendJson(res, statusCode, payload) {
  const body = JSON.stringify(payload, null, 2)
  res.writeHead(statusCode, {
    'content-type': 'application/json; charset=utf-8',
    'access-control-allow-origin': '*',
    'access-control-allow-methods': 'GET,POST,OPTIONS',
    'access-control-allow-headers': 'content-type, authorization, x-fame-api-key',
  })
  res.end(body)
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    req.on('data', (chunk) => chunks.push(chunk))
    req.on('error', reject)
    req.on('end', () => {
      if (chunks.length === 0) return resolve({})
      const text = Buffer.concat(chunks).toString('utf8')
      if (!text.trim()) return resolve({})
      try {
        resolve(JSON.parse(text))
      } catch (error) {
        reject(Object.assign(new Error('Invalid JSON request body'), { cause: error }))
      }
    })
  })
}

function routeTable(api) {
  return {
    'GET /health': () => ({ ok: true, ...api.stats() }),
    'GET /stats': () => api.stats(),
    'GET /agent/me': () => api.agent(),
    'POST /goal/resolve': (body) => api.resolveGoal(body),
    'POST /knowledge/route': (body) => api.routeKnowledge(body),
    'POST /context/pack': (body) => api.packContext(body),
    'POST /action/propose': (body) => api.enforceAction(body),
    'POST /action/enforce': (body) => api.enforceAction(body),
    'POST /tool/execute': (body) => api.executeTool(body),
    'POST /summary/write': (body) => api.writeSummary(body),
    'POST /patch/submit': (body) => api.submitPatch(body),
    'POST /sync/status': (body) => api.getSyncStatus(body),
    'POST /events/list': (body) => api.listEvents(body),
    'POST /clock/schedule': (body) => api.scheduleClockEvent(body),
    'POST /clock/run-due': (body) => api.runDueClockEvents(body),
    'POST /clock/list': (body) => api.listClockEvents(body),
    'POST /semantic/rebuild': (body) => api.rebuildSemanticIndex(body),
    'POST /semantic/search': (body) => api.semanticSearch(body),
    'POST /assets/sync': (body) => api.syncAssetIndex(body),
    'POST /assets/list': (body) => api.listAssets(body),
    'POST /trace/export': (body) => api.exportTrace(body),
  }
}

export function createGatewayHttpServer({ store = new GatewayStore() } = {}) {
  const publicApi = createRuntimeApi(store)

  const server = createServer(async (req, res) => {
    try {
      if (req.method === 'OPTIONS') {
        sendJson(res, 200, { ok: true })
        return
      }
      const url = new URL(req.url || '/', `http://${req.headers.host || `${host}:${port}`}`)
      const routeKey = `${req.method} ${url.pathname}`
      const apiKey = extractApiKeyFromHeaders(req.headers)
      const agent = authenticateAgent(store, apiKey)
      const api = routeKey === 'GET /health' ? publicApi : createRuntimeApi(store, { agent, adapter: 'http' })
      const routes = routeTable(api)
      const handler = routes[routeKey]
      if (!handler) {
        sendJson(res, 404, {
          error: 'not_found',
          route: routeKey,
          available_routes: Object.keys(routes),
        })
        return
      }
      if (routeKey !== 'GET /health' && !agent) {
        sendJson(res, 401, {
          error: 'unauthorized',
          message: 'FAME Gateway API key required. Use Authorization: Bearer <key> or x-fame-api-key.',
        })
        return
      }
      const body = req.method === 'GET' ? Object.fromEntries(url.searchParams.entries()) : await readBody(req)
      const result = await handler(body)
      if (result?.status === 'blocked' && result?.checks?.some((check) => check.check_id?.includes('acl') || check.check_id === 'agent_auth_check')) {
        sendJson(res, 403, result)
        return
      }
      sendJson(res, 200, result)
    } catch (error) {
      sendJson(res, 500, {
        error: 'runtime_error',
        message: error instanceof Error ? error.message : String(error),
      })
    }
  })

  return { server, api: publicApi, store, publicAgent }
}

if (resolve(fileURLToPath(import.meta.url)) === resolve(process.argv[1] ?? '')) {
  const { server } = createGatewayHttpServer()
  server.listen(port, host, () => {
    console.log(`FAME Runtime Gateway listening on http://${host}:${port}`)
  })
}
