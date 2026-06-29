import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const testDir = path.dirname(fileURLToPath(import.meta.url))
const editionRoot = path.resolve(testDir, '..')
const projectRoot = path.resolve(editionRoot, '..', '..')
const knowledgeRoot = path.join(editionRoot, 'knowledge')

function assert(condition, message) {
  if (!condition) throw new Error(message)
}

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(knowledgeRoot, relativePath), 'utf8'))
}

function readText(relativePath) {
  return fs.readFileSync(path.join(knowledgeRoot, relativePath), 'utf8')
}

function readJsonl(relativePath) {
  return readText(relativePath).split(/\r?\n/).filter(Boolean).map((line) => JSON.parse(line))
}

function walkFiles(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const child = path.join(dir, entry.name)
    if (entry.isDirectory()) walkFiles(child, files)
    if (entry.isFile()) files.push(child)
  }
  return files
}

function approxTokens(text) {
  return Math.ceil(text.length / 3.2)
}

function routeById(routeIndex, id) {
  const route = routeIndex.routes.find((item) => item.id === id)
  assert(route, `missing route: ${id}`)
  return route
}

function aliasByTerm(aliasIndex, term) {
  const alias = aliasIndex.aliases.find((item) => item.term === term)
  assert(alias, `missing alias: ${term}`)
  return alias
}

function playbookById(playbooks, id) {
  const playbook = playbooks.playbooks.find((item) => item.id === id)
  assert(playbook, `missing playbook: ${id}`)
  return playbook
}

function templateById(templates, id) {
  const template = templates.templates.find((item) => item.id === id)
  assert(template, `missing template: ${id}`)
  return template
}

const routeIndex = readJson('route_index.json')
const subjectIndex = readJson('indexes/subject_index.json')
const aliasIndex = readJson('indexes/alias_index.json')
const scopingIndex = readJson('indexes/scoping_index.json')
const lexicon = readJson('language-tree-hub/lexicon_seed.json')
const thoughtModes = readJson('language-tree-hub/thought_modes.json')
const criticalDomains = readJson('agent-tooling/critical_error_domains.json')
const operationPlaybooks = readJson('agent-tooling/operation_playbooks.json')
const actionTemplates = readJson('agent-tooling/action_templates.json')
const stabilityScenarios = readJson('agent-tooling/stability_scenarios.json')
const failurePatterns = readJson('agent-tooling/tool_call_failure_patterns.json')
const powershellFailurePatterns = readJson('powershell-safety/failure_patterns.json')
const resultPatterns = readJson('agent-tooling/result_summary_patterns.json')
const associationPlaybooks = readJson('language-tree-hub/association_playbooks.json')
const abstractionPlaybooks = readJson('language-tree-hub/abstraction_playbooks.json')
const evaluationMetrics = readJson('agent-tooling/evaluation_metrics.json')
const contentUnits = readJsonl('database/content_units.jsonl')
const sourceRegistry = readJson('source_registry.json')
const graphSeed = readJson('graph.seed.json')
const contentIndex = readJson('database/content_index.json')
const protocolDoc = fs.readFileSync(path.join(editionRoot, 'docs', '07_Agent协议与最小接入.md'), 'utf8')
const workflowDoc = fs.readFileSync(path.join(editionRoot, 'docs', '04_Agent接入工作流.md'), 'utf8')
const quickstartDoc = fs.readFileSync(path.join(editionRoot, 'QUICKSTART_AGENT.md'), 'utf8')
const goldenTasks = JSON.parse(fs.readFileSync(path.join(editionRoot, 'golden-tasks', 'tool-stability.golden.json'), 'utf8'))

const requiredRoutes = [
  'route-language-goal-backcasting',
  'route-language-global-situation-model',
  'route-agent-tool-action-contract',
  'route-agent-stability-preflight',
  'route-agent-integration-usability-test',
  'route-agent-tool-doc-first',
  'route-agent-tool-result-summary',
  'route-negative-fame-lesson',
]

for (const routeId of requiredRoutes) routeById(routeIndex, routeId)

const semanticTreeAlias = aliasByTerm(aliasIndex, '语义树')
assert(semanticTreeAlias.node_ref === 'language-tree-hub', 'semantic tree must anchor to language-tree-hub')
assert(lexicon.terms.some((term) => term.aliases.includes('语义树')), 'lexicon must normalize semantic tree')

const languageSubject = subjectIndex.subjects.find((subject) => subject.id === 'language-tree-hub')
const agentSubject = subjectIndex.subjects.find((subject) => subject.id === 'agent-tooling')
assert(languageSubject.route_refs.includes('route-language-goal-backcasting'), 'language subject must include goal backcasting')
assert(agentSubject.route_refs.includes('route-agent-tool-action-contract'), 'agent subject must include tool action contract')

const goalpostPlaybook = playbookById(associationPlaybooks, 'playbook-goalpost-first')
const actionContractPlaybook = playbookById(operationPlaybooks, 'playbook-tool-action-contract')
const actionContractTemplate = templateById(actionTemplates, 'template-tool-action-contract')
assert(goalpostPlaybook.route_refs.includes('route-agent-tool-action-contract'), 'goalpost should land in tool contract')
assert(actionContractPlaybook.route_refs.includes('route-agent-stability-preflight'), 'tool contract should include preflight')
assert(actionContractTemplate.required_arguments.includes('expected_signal'), 'tool contract template must require expected_signal')
assert(actionContractTemplate.required_arguments.includes('validation_plan'), 'tool contract template must require validation_plan')

const criticalDomainIds = new Set(criticalDomains.domains.map((domain) => domain.id))
for (const domainId of ['startup-global-framing', 'tool-action-contract', 'powershell', 'git', 'node-npm', 'python', 'structured-data', 'database-sync']) {
  assert(criticalDomainIds.has(domainId), `missing critical domain: ${domainId}`)
}

const gateIds = new Set(evaluationMetrics.gates.map((gate) => gate.id))
assert(gateIds.has('gate-no-contract-no-risky-tool'), 'must gate risky tools without action contract')
assert(gateIds.has('gate-no-goalpost-no-expansion'), 'must gate context expansion without goalpost')

const failurePatternIds = new Set([
  ...failurePatterns.patterns.map((pattern) => pattern.id),
  ...powershellFailurePatterns.patterns.map((pattern) => pattern.id),
])
const resultPatternIds = new Set(resultPatterns.patterns.map((pattern) => pattern.id))
assert(failurePatternIds.has('tool-failure-knowledge-index-drift'), 'must include knowledge index drift failure')
assert(failurePatternIds.has('tool-failure-runtime-assumption'), 'must include runtime assumption failure')
assert(resultPatternIds.has('result-pattern-action-contract'), 'must include action contract result summary')

const sourceIds = new Set(sourceRegistry.sources.map((source) => source.id))
for (const sourceId of ['mcp-docs-intro', 'mcp-tools-spec', 'openai-agents-sdk-guardrails', 'langgraph-memory-docs', 'llamaindex-agent-docs']) {
  assert(sourceIds.has(sourceId), `missing integration reference source: ${sourceId}`)
}

const abstractionPlaybook = playbookById(abstractionPlaybooks, 'abstract-global-to-tool-contract')
assert(abstractionPlaybook.route_refs.includes('route-language-global-situation-model'), 'abstraction must start from global situation')
assert(abstractionPlaybook.route_refs.includes('route-agent-tool-action-contract'), 'abstraction must land in tool contract')

const selectedFiles = [
  'route_index.json',
  'indexes/subject_index.json',
  'indexes/alias_index.json',
  'indexes/scoping_index.json',
  'language-tree-hub/core.json',
  'language-tree-hub/lexicon_seed.json',
  'language-tree-hub/thought_modes.json',
  'language-tree-hub/association_playbooks.json',
  'agent-tooling/critical_error_domains.json',
  'agent-tooling/operation_playbooks.json',
  'agent-tooling/action_templates.json',
  'agent-tooling/result_summary_patterns.json',
]
const selectedText = selectedFiles.map((file) => readText(file)).join('\n')
const fullKnowledgeText = walkFiles(knowledgeRoot)
  .filter((file) => /\.(json|jsonl|md)$/i.test(file))
  .filter((file) => !file.includes(`${path.sep}database${path.sep}samples${path.sep}`))
  .filter((file) => !file.includes(`${path.sep}database${path.sep}candidates${path.sep}`))
  .map((file) => fs.readFileSync(file, 'utf8'))
  .join('\n')
const contextTokens = approxTokens(selectedText)
const fullTokens = approxTokens(fullKnowledgeText)
const contextSavings = Number((1 - contextTokens / Math.max(1, fullTokens)).toFixed(3))
assert(contextTokens < fullTokens, 'selected context should be smaller than full knowledge')
assert(contextSavings >= 0.35, 'context savings should be meaningful')

const routeRefs = [
  'route-language-goal-backcasting',
  'route-language-global-situation-model',
  'route-agent-tool-action-contract',
  'route-agent-stability-preflight',
  'route-agent-tool-result-summary',
]
const smokeContextPack = {
  edition_id: 'chinese-open',
  project_id: 'agent-effect-smoke',
  task_id: 'tool-stability-001',
  subject: 'agent-tooling',
  semantic_anchor: 'language-tree-hub',
  route_ids: routeRefs,
  thought_mode: 'L5_operation',
  context_budget: 3200,
  summaries: routeRefs.map((routeId) => routeById(routeIndex, routeId).content),
  content_refs: [...new Set(routeRefs.flatMap((routeId) => routeById(routeIndex, routeId).content_refs))],
  rules: ['gate-no-contract-no-risky-tool', 'gate-no-goalpost-no-expansion'],
  negative_lessons: ['route-negative-fame-lesson'],
}
assert(smokeContextPack.content_refs.includes('cu-agent-tool-action-contract-001'), 'context pack must include tool action contract content')
assert(smokeContextPack.content_refs.includes('cu-agent-stability-preflight-001'), 'context pack must include stability preflight content')

const smokeActionContract = {
  goal: 'Run a safe tool action after global framing and preflight.',
  tool_name: 'example.tool',
  operation_type: 'read',
  arguments: { target: 'declared target' },
  scope: {
    working_directory: 'project root',
    allowed_paths: [],
    route_ids: smokeContextPack.route_ids,
  },
  risk_level: 'read_only',
  expected_output: 'observable result summary',
  validation_plan: ['Check output relevance.', 'Write ToolResultSummary.'],
  rollback_plan: [],
}
for (const field of ['tool_name', 'operation_type', 'scope', 'expected_output', 'validation_plan']) {
  assert(smokeActionContract[field], `smoke action contract missing ${field}`)
}

const contentIds = new Set(contentUnits.map((unit) => unit.id))
for (const unitId of ['cu-agent-ecosystem-mapping-001', 'cu-agent-practical-bridge-001']) {
  assert(contentIds.has(unitId), `missing practical integration content unit: ${unitId}`)
}
for (const route of routeIndex.routes) {
  for (const ref of route.content_refs || []) {
    assert(contentIds.has(ref), `route ${route.id} points to missing content ref ${ref}`)
  }
}

const integrationRoute = routeById(routeIndex, 'route-agent-integration-usability-test')
assert(integrationRoute.content_refs.includes('cu-agent-ecosystem-mapping-001'), 'integration route must include ecosystem mapping')
assert(integrationRoute.content_refs.includes('cu-agent-practical-bridge-001'), 'integration route must include practical bridge')

const agentToolingNode = graphSeed.nodes.find((node) => node.id === 'agent-tooling')
const integrationNode = graphSeed.nodes.find((node) => node.id === 'agent-integration-usability-test')
assert(agentToolingNode?.content_refs.includes('cu-agent-ecosystem-mapping-001'), 'agent-tooling graph node must include ecosystem mapping')
assert(integrationNode?.content_refs.includes('cu-agent-practical-bridge-001'), 'integration graph node must include practical bridge')

const bridgeGroup = contentIndex.route_groups.find((group) => group.id === 'external_agent_plugin_bridge')
assert(bridgeGroup?.route_refs.includes('route-agent-integration-usability-test'), 'content index must expose external agent plugin bridge')

const smokeCases = [
  {
    id: 'powershell-delete-review',
    goal: '删除目录但避免 PowerShell 路径和递归风险',
    expected_routes: ['route-language-goal-backcasting', 'route-agent-stability-preflight', 'route-powershell-safe-command'],
  },
  {
    id: 'jsonl-safe-edit',
    goal: '修改 JSONL 知识库并同步索引',
    expected_routes: ['route-agent-tool-action-contract', 'route-agent-stability-preflight', 'route-agent-database-sync'],
  },
  {
    id: 'external-agent-integration',
    goal: '外部 Agent 接入知识网并证明上下文健康',
    expected_routes: ['route-agent-integration-usability-test', 'route-language-global-situation-model', 'route-agent-tool-result-summary'],
  },
  {
    id: 'powershell-encoding',
    goal: 'PowerShell 显示中文乱码并需要区分终端和文件证据',
    expected_routes: ['route-powershell-encoding-output', 'route-agent-stability-preflight', 'route-agent-tool-result-summary'],
  },
  {
    id: 'local-agent-connect',
    goal: '本机 Agent 接入状态检查',
    expected_routes: ['route-agent-local-connect-check', 'route-agent-integration-usability-test', 'route-agent-tool-result-summary'],
  },
]
for (const testCase of smokeCases) {
  for (const routeId of testCase.expected_routes) routeById(routeIndex, routeId)
}

const requiredScenarioIds = [
  'scenario-powershell-destructive-delete',
  'scenario-jsonl-knowledge-edit',
  'scenario-git-dirty-worktree',
  'scenario-node-npm-build',
  'scenario-python-runtime',
  'scenario-network-source-import',
  'scenario-external-agent-integration',
  'scenario-powershell-encoding-mojibake',
  'scenario-local-agent-connect-check',
]
const scenariosById = new Map(stabilityScenarios.scenarios.map((scenario) => [scenario.id, scenario]))
for (const scenarioId of requiredScenarioIds) {
  const scenario = scenariosById.get(scenarioId)
  assert(scenario, `missing stability scenario: ${scenarioId}`)
  assert(scenario.required_routes.length >= 3, `scenario ${scenarioId} needs enough route coverage`)
  assert(scenario.required_checks.length >= 4, `scenario ${scenarioId} needs concrete checks`)
  assert(resultPatternIds.has(scenario.expected_summary_pattern), `scenario ${scenarioId} points to missing summary pattern`)
  for (const routeId of scenario.required_routes) routeById(routeIndex, routeId)
  for (const signature of scenario.failure_signatures) {
    assert(failurePatternIds.has(signature), `scenario ${scenarioId} points to missing failure signature ${signature}`)
  }
}

for (const routeId of stabilityScenarios.global_required_routes) routeById(routeIndex, routeId)

function runRouteCli(args) {
  const output = execFileSync(process.execPath, ['scripts/chinese-open-route.mjs', ...args], {
    cwd: projectRoot,
    encoding: 'utf8',
  })
  return JSON.parse(output)
}

function runRouteCliText(args) {
  return execFileSync(process.execPath, ['scripts/chinese-open-route.mjs', ...args], {
    cwd: projectRoot,
    encoding: 'utf8',
  })
}

const cliJsonl = runRouteCli(['--goal', '修改 JSONL 知识库并同步索引'])
assert(cliJsonl.ok === true, 'route cli should succeed for JSONL goal')
assert(cliJsonl.selected_scenario.id === 'scenario-jsonl-knowledge-edit', 'route cli should select JSONL scenario')
assert(cliJsonl.context_pack.route_ids.includes('route-agent-database-sync'), 'JSONL CLI result must include database sync')
assert(cliJsonl.action_contract_draft.operation_type === 'write', 'JSONL CLI operation should be write')
assert(cliJsonl.startup_read_set.includes('versions/chinese-open/knowledge/agent-tooling/stability_scenarios.json'), 'CLI must expose startup read set')
assert(cliJsonl.context_pack.semantic_anchor === 'language-tree-hub', 'CLI ContextPack must expose semantic anchor')
assert(cliJsonl.context_pack.summaries.every((item) => item.ref && item.summary), 'CLI ContextPack summaries must be structured')
assert(cliJsonl.proposed_action.kind === 'ProposedAction', 'CLI must return ProposedAction')
assert(cliJsonl.proposed_action.scope.working_directory === '<project-root>', 'ProposedAction must include working_directory')
assert(cliJsonl.tool_gateway_decision.final_decision === 'blocked_until_contract_complete', 'incomplete contract should be blocked')
assert(cliJsonl.result_summary_stub.kind === 'ToolResultSummary', 'CLI must return ToolResultSummary stub')

const cliPython = runRouteCli(['--scenario', 'scenario-python-runtime'])
assert(cliPython.selected_scenario.id === 'scenario-python-runtime', 'route cli should accept explicit scenario')
assert(cliPython.action_contract_draft.validation_plan.length >= 3, 'CLI contract should include validation plan')

const cliDelete = runRouteCli([
  '--operation',
  'delete',
  '--goal',
  'PowerShell 删除目录但要避免误删',
  '--tool-name',
  'exec_command',
  '--working-directory',
  '<project-root>',
  '--expected-output',
  '列出绝对路径并等待审批',
])
assert(cliDelete.selected_scenario.id === 'scenario-powershell-destructive-delete', 'delete goal should select PowerShell destructive delete scenario')
assert(cliDelete.tool_gateway_decision.requires_approved_action === true, 'delete scenario must require approval')
assert(cliDelete.proposed_action.requires_approval === true, 'delete ProposedAction must require approval')
assert(cliDelete.proposed_action.scope.working_directory === '<project-root>', 'delete ProposedAction must retain working directory')

const cliEncoding = runRouteCli(['--goal', 'PowerShell 显示中文乱码'])
assert(cliEncoding.selected_scenario.id === 'scenario-powershell-encoding-mojibake', 'encoding goal should select PowerShell encoding scenario')
assert(cliEncoding.context_pack.route_ids.includes('route-powershell-encoding-output'), 'encoding route must include PowerShell encoding output route')

const cliLocalConnect = runRouteCli(['--goal', '本机 Agent 接入状态检查'])
assert(cliLocalConnect.selected_scenario.id === 'scenario-local-agent-connect-check', 'local connect goal should select local Agent connect scenario')
assert(cliLocalConnect.context_pack.route_ids.includes('route-agent-local-connect-check'), 'local connect route must include local connect route')

const scenarioListMd = runRouteCliText(['--list-scenarios', '--format', 'md'])
assert(scenarioListMd.includes('scenario-jsonl-knowledge-edit'), 'scenario list must include JSONL scenario')
assert(scenarioListMd.includes('scenario-external-agent-integration'), 'scenario list must include external integration scenario')
assert(scenarioListMd.includes('scenario-powershell-encoding-mojibake'), 'scenario list must include PowerShell encoding scenario')
assert(scenarioListMd.includes('scenario-local-agent-connect-check'), 'scenario list must include local Agent connect scenario')

const promptText = runRouteCliText(['--scenario', 'scenario-external-agent-integration', '--format', 'prompt'])
assert(promptText.includes('FAME 中文开源版'), 'prompt mode must generate agent startup prompt')
assert(promptText.includes('language-tree-hub'), 'prompt mode must mention semantic anchor')

const compactJsonl = runRouteCli(['--goal', '修改 JSONL 知识库并同步索引', '--compact'])
assert(compactJsonl.scenario === 'scenario-jsonl-knowledge-edit', 'compact mode must return selected scenario')
assert(compactJsonl.route_ids.includes('route-agent-database-sync'), 'compact mode must expose route ids')
assert(compactJsonl.next_action, 'compact mode must expose next action')
assert(compactJsonl.failure_signatures.includes('tool-failure-knowledge-index-drift'), 'compact mode must expose failure signatures')

const doctorOutput = execFileSync(process.execPath, ['scripts/chinese-open-doctor.mjs'], {
  cwd: projectRoot,
  encoding: 'utf8',
})
const doctorJson = JSON.parse(doctorOutput)
assert(doctorJson.ok === true, 'doctor must pass')
assert(doctorJson.checks.length >= 5, 'doctor must run practical checks')
assert(doctorJson.checks.some((check) => check.id === 'golden_tasks' && check.detail.checked === 5), 'doctor must execute golden tasks')

const connectOutput = execFileSync(process.execPath, ['scripts/chinese-open-connect.mjs', '--agent', 'codex', '--json'], {
  cwd: projectRoot,
  encoding: 'utf8',
})
const connectJson = JSON.parse(connectOutput)
assert(connectJson.ok === true && connectJson.status === 'connected', 'local Agent connect check must report connected')

const exampleRouteOutput = JSON.parse(fs.readFileSync(path.join(editionRoot, 'examples', 'route-output.example.json'), 'utf8'))
const exampleSummary = JSON.parse(fs.readFileSync(path.join(editionRoot, 'examples', 'tool-result-summary.example.json'), 'utf8'))
assert(exampleRouteOutput.context_pack.semantic_anchor === 'language-tree-hub', 'example route output must include semantic anchor')
assert(exampleRouteOutput.proposed_action.scope.working_directory, 'example ProposedAction must include working_directory')
assert(exampleSummary.kind === 'ToolResultSummary', 'example summary must be ToolResultSummary')

assert(protocolDoc.includes('ProposedAction') && protocolDoc.includes('working_directory'), 'protocol doc must explain ProposedAction working_directory')
assert(protocolDoc.includes('生态映射'), 'protocol doc must explain ecosystem mapping')
assert(workflowDoc.includes('tool_gateway_decision'), 'workflow doc must mention tool gateway decision')
assert(quickstartDoc.includes('npm run doctor:chinese-open') && quickstartDoc.includes('--compact'), 'quickstart must include doctor and compact commands')
assert(goldenTasks.tasks.length === 5, 'golden tasks must include five practical tasks')

console.log(JSON.stringify({
  ok: true,
  routes_checked: requiredRoutes.length,
  content_units: contentUnits.length,
  context: {
    selected_tokens: contextTokens,
    full_tokens: fullTokens,
    savings: contextSavings,
    selected_files: selectedFiles.length,
  },
  context_pack: {
    route_count: smokeContextPack.route_ids.length,
    content_ref_count: smokeContextPack.content_refs.length,
    thought_mode: smokeContextPack.thought_mode,
  },
  action_contract: {
    fields: Object.keys(smokeActionContract).length,
    risk_level: smokeActionContract.risk_level,
    validation_steps: smokeActionContract.validation_plan.length,
  },
  stability_scenarios: {
    checked: requiredScenarioIds.length,
    total: stabilityScenarios.scenarios.length,
    failure_signatures: failurePatternIds.size,
    summary_patterns: resultPatternIds.size,
  },
  route_cli: {
    jsonl_scenario: cliJsonl.selected_scenario.id,
    python_scenario: cliPython.selected_scenario.id,
    delete_scenario: cliDelete.selected_scenario.id,
    encoding_scenario: cliEncoding.selected_scenario.id,
    local_connect_scenario: cliLocalConnect.selected_scenario.id,
    jsonl_routes: cliJsonl.context_pack.route_ids.length,
    delete_requires_approval: cliDelete.tool_gateway_decision.requires_approved_action,
    scenario_list_ok: scenarioListMd.includes('scenario-jsonl-knowledge-edit'),
    prompt_mode_ok: promptText.includes('FAME 中文开源版'),
    compact_mode_ok: compactJsonl.scenario === 'scenario-jsonl-knowledge-edit',
    doctor_ok: doctorJson.ok,
    connect_ok: connectJson.ok,
  },
  external_agent_bridge: {
    sources: ['mcp-docs-intro', 'openai-agents-sdk-guardrails', 'langgraph-memory-docs'].length,
    examples_checked: 2,
    integration_route_refs: integrationRoute.content_refs.length,
    golden_tasks: goldenTasks.tasks.length,
  },
  smoke_cases: smokeCases.map((item) => ({ id: item.id, routes: item.expected_routes.length })),
}, null, 2))
