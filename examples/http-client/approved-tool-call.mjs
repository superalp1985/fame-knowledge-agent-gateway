const baseUrl = process.env.FAME_GATEWAY_URL || 'http://127.0.0.1:5191'
const apiKey = process.env.FAME_GATEWAY_DEV_API_KEY || 'dev-fame-agent-key'

async function post(path, body) {
  const response = await fetch(`${baseUrl}${path}`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  })
  if (!response.ok) throw new Error(`${path}: ${response.status} ${await response.text()}`)
  return response.json()
}

const scope = {
  project_id: 'fame-agent-gateway',
  subject: 'agent',
  route_id: 'agent/gateway',
  task_id: 'example-approved-tool-call',
}

const context = await post('/context/pack', {
  goal: 'Route a gateway task and execute only after approval.',
  scope,
})

const approved = await post('/action/propose', {
  action_id: 'example-route-knowledge',
  adapter: 'http',
  tool_id: 'knowledge_router.route_knowledge',
  purpose: 'Route knowledge for a gateway task after reading the tool contract.',
  scope,
  manual_ref: 'docs/runtime-gateway.md',
  context_cost: context.estimated_tokens,
  risk_level: 'normal',
})

const result = await post('/tool/execute', {
  approval_token: approved.approval_token,
  args: { goal: 'gateway enforcement' },
})

const semantic = await post('/semantic/search', {
  query: 'gateway enforcement',
  scope,
  top_k: 3,
})

const trace = await post('/trace/export', {
  scope,
  limit: 20,
})

console.log(JSON.stringify({
  approved_token_prefix: approved.approval_token.split('.').slice(0, 3).join('.'),
  result,
  semantic_results: semantic.results.length,
  trace_spans: trace.span_count,
}, null, 2))
