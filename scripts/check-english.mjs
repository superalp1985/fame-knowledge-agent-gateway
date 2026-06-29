import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { extname, join, relative } from 'node:path'

const projectRoot = process.cwd()
const editionRoot = join(projectRoot, 'versions', 'english')
const knowledgeRoot = join(editionRoot, 'knowledge')

const requiredFiles = [
  'README.md',
  'QUICKSTART_AGENT.md',
  'docs/agent-protocol.md',
  'docs/common-agent-snippets.md',
  'docs/real-evaluation-report.md',
  'docs/roadmap.md',
  'examples/README.md',
  'examples/external-agent-bootstrap.md',
  'examples/route-output.example.json',
  'examples/tool-result-summary.example.json',
  'golden-tasks/tool-stability.golden.json',
  'knowledge/README.md',
  'knowledge/graph.schema.json',
  'knowledge/graph.seed.json',
  'knowledge/route_index.json',
  'knowledge/source_registry.json',
  'knowledge/language-tree-hub/README.md',
  'knowledge/language-tree-hub/core.json',
  'knowledge/language-tree-hub/thought_modes.json',
  'knowledge/language-tree-hub/intent_patterns.json',
  'knowledge/language-tree-hub/association_rules.json',
  'knowledge/language-tree-hub/association_playbooks.json',
  'knowledge/language-tree-hub/abstraction_playbooks.json',
  'knowledge/language-tree-hub/lexicon_seed.json',
  'knowledge/logic/taxonomy.json',
  'knowledge/logic/reasoning_methods.json',
  'knowledge/logic/argument_patterns.json',
  'knowledge/logic/fallacy_patterns.json',
  'knowledge/logic/validation_checklists.json',
  'knowledge/mathematics/taxonomy.json',
  'knowledge/mathematics/methods.json',
  'knowledge/mathematics/modeling_patterns.json',
  'knowledge/mathematics/validation_checklists.json',
  'knowledge/computer-science/taxonomy.json',
  'knowledge/computer-science/engineering_methods.json',
  'knowledge/computer-science/system_patterns.json',
  'knowledge/computer-science/validation_checklists.json',
  'knowledge/agent-tooling/taxonomy.json',
  'knowledge/agent-tooling/action.schema.json',
  'knowledge/agent-tooling/context_pack.schema.json',
  'knowledge/agent-tooling/action_templates.json',
  'knowledge/agent-tooling/operation_playbooks.json',
  'knowledge/agent-tooling/tool_gateway_policies.json',
  'knowledge/agent-tooling/result_summary_patterns.json',
  'knowledge/agent-tooling/stability_scenarios.json',
  'knowledge/agent-tooling/tool_call_failure_patterns.json',
  'knowledge/agent-tooling/critical_error_domains.json',
  'knowledge/agent-tooling/reflection_patterns.json',
  'knowledge/agent-tooling/evaluation_metrics.json',
  'knowledge/powershell-safety/taxonomy.json',
  'knowledge/powershell-safety/command_review_flow.json',
  'knowledge/powershell-safety/risk_matrix.json',
  'knowledge/powershell-safety/safe_command_patterns.json',
  'knowledge/powershell-safety/command_review_checklist.json',
  'knowledge/powershell-safety/do_not_patterns.json',
  'knowledge/powershell-safety/failure_patterns.json',
  'knowledge/rules/agent_tool_governance.json',
  'knowledge/rules/powershell_safety.json',
  'knowledge/database/content_units.jsonl',
  'knowledge/database/content_index.json',
  'knowledge/database/data_sources.json',
  'knowledge/database/samples/README.md',
  'knowledge/database/candidates/README.md',
  'knowledge/indexes/subject_index.json',
  'knowledge/indexes/alias_index.json',
  'knowledge/indexes/scoping_index.json',
  'project-memory-cases/case.schema.json',
  'project-memory-cases/candidate_sources.json',
  'tests/agent-effect-smoke.mjs',
]

const findings = []

function rel(file) {
  return relative(projectRoot, file).replace(/\\/g, '/')
}

function add(severity, id, file, message) {
  findings.push({ severity, id, file, message })
}

function readJson(file) {
  try {
    return JSON.parse(readFileSync(file, 'utf8').replace(/^\uFEFF/, ''))
  } catch (error) {
    add('error', 'json_parse', rel(file), error.message)
    return null
  }
}

function readText(file) {
  try {
    return readFileSync(file, 'utf8').replace(/^\uFEFF/, '')
  } catch {
    return ''
  }
}

function walk(dir, files = []) {
  if (!existsSync(dir)) return files
  for (const item of readdirSync(dir, { withFileTypes: true })) {
    const child = join(dir, item.name)
    if (item.isDirectory()) walk(child, files)
    if (item.isFile()) files.push(child)
  }
  return files
}

for (const file of requiredFiles) {
  if (!existsSync(join(editionRoot, file))) add('error', 'required_file', `versions/english/${file}`, 'Required English edition file is missing.')
}

for (const file of walk(editionRoot)) {
  if (extname(file).toLowerCase() === '.json') readJson(file)
  if (extname(file).toLowerCase() === '.jsonl') {
    readFileSync(file, 'utf8').split(/\r?\n/).filter(Boolean).forEach((line, index) => {
      try {
        JSON.parse(line)
      } catch (error) {
        add('error', 'jsonl_parse', `${rel(file)}:${index + 1}`, error.message)
      }
    })
  }
}

const graph = readJson(join(knowledgeRoot, 'graph.seed.json'))
const routeIndex = readJson(join(knowledgeRoot, 'route_index.json'))
const sourceRegistry = readJson(join(knowledgeRoot, 'source_registry.json'))
const subjectIndex = readJson(join(knowledgeRoot, 'indexes', 'subject_index.json'))
const contentIndex = readJson(join(knowledgeRoot, 'database', 'content_index.json'))
const stabilityScenarios = readJson(join(knowledgeRoot, 'agent-tooling', 'stability_scenarios.json'))
const resultPatterns = readJson(join(knowledgeRoot, 'agent-tooling', 'result_summary_patterns.json'))
const failurePatterns = readJson(join(knowledgeRoot, 'agent-tooling', 'tool_call_failure_patterns.json'))
const powershellFailurePatterns = readJson(join(knowledgeRoot, 'powershell-safety', 'failure_patterns.json'))
const versionReadme = readText(join(editionRoot, 'README.md'))
const protocolDoc = readText(join(editionRoot, 'docs', 'agent-protocol.md'))
const quickstartDoc = readText(join(editionRoot, 'QUICKSTART_AGENT.md'))
const commonAgentDoc = readText(join(editionRoot, 'docs', 'common-agent-snippets.md'))
const routeCli = readText(join(projectRoot, 'scripts', 'english-route.mjs'))
const doctorCli = readText(join(projectRoot, 'scripts', 'english-doctor.mjs'))
const realEvalCli = readText(join(projectRoot, 'scripts', 'english-real-eval.mjs'))
const connectCli = readText(join(projectRoot, 'scripts', 'english-connect.mjs'))

const contentUnits = []
const contentFile = join(knowledgeRoot, 'database', 'content_units.jsonl')
if (existsSync(contentFile)) {
  readFileSync(contentFile, 'utf8').split(/\r?\n/).filter(Boolean).forEach((line) => contentUnits.push(JSON.parse(line)))
}

if (graph && routeIndex && sourceRegistry) {
  const nodeIds = new Set(graph.nodes?.map((node) => node.id) ?? [])
  const routeIds = new Set(routeIndex.routes?.map((route) => route.id) ?? [])
  const contentIds = new Set(contentUnits.map((unit) => unit.id))
  const sourceIds = new Set(sourceRegistry.sources?.map((source) => source.id) ?? [])

  for (const edge of graph.edges ?? []) {
    if (!nodeIds.has(edge.source)) add('error', 'edge_source', 'knowledge/graph.seed.json', `Missing source node ${edge.source}`)
    if (!nodeIds.has(edge.target)) add('error', 'edge_target', 'knowledge/graph.seed.json', `Missing target node ${edge.target}`)
  }
  for (const node of graph.nodes ?? []) {
    for (const ref of node.content_refs ?? []) {
      if (!contentIds.has(ref)) add('error', 'node_content_ref', 'knowledge/graph.seed.json', `Missing content ref ${ref}`)
    }
    for (const ref of node.source_refs ?? []) {
      if (!sourceIds.has(ref)) add('error', 'node_source_ref', 'knowledge/graph.seed.json', `Missing source ref ${ref}`)
    }
  }
  for (const route of routeIndex.routes ?? []) {
    for (const ref of route.content_refs ?? []) {
      if (!contentIds.has(ref)) add('error', 'route_content_ref', 'knowledge/route_index.json', `Missing content ref ${ref}`)
    }
    if (!route.fame) add('error', 'route_fame', 'knowledge/route_index.json', `Missing FAME params for ${route.id}`)
  }
  for (const route of [
    'route-language-intent-to-scope',
    'route-agent-tool-doc-first',
    'route-agent-tool-proposed-action',
    'route-agent-tool-result-summary',
    'route-powershell-safe-command',
    'route-negative-fame-lesson',
    'route-language-goal-backcasting',
    'route-language-global-situation-model',
    'route-agent-tool-action-contract',
    'route-agent-stability-preflight',
    'route-agent-integration-usability-test',
    'route-powershell-encoding-output',
    'route-agent-local-connect-check',
  ]) {
    if (!routeIds.has(route)) add('error', 'mandatory_route', 'knowledge/route_index.json', `Missing mandatory route ${route}`)
  }
}

if (subjectIndex) {
  for (const subject of ['language-tree-hub', 'logic', 'mathematics', 'computer-science', 'agent-tooling', 'powershell-safety']) {
    if (!subjectIndex.subjects?.some((item) => item.id === subject)) {
      add('error', 'subject_missing', 'knowledge/indexes/subject_index.json', `Missing subject ${subject}`)
    }
  }
  for (const subject of subjectIndex.subjects ?? []) {
    for (const file of subject.entry_files ?? []) {
      if (!existsSync(join(knowledgeRoot, file))) add('error', 'subject_entry_file', 'knowledge/indexes/subject_index.json', `Missing entry file ${file}`)
    }
  }
}

if (!versionReadme.includes('npm run eval:english') || !versionReadme.includes('Language Tree')) {
  add('error', 'readme_entry', 'README.md', 'English README must document eval:english and Language Tree positioning.')
}
if (!protocolDoc.includes('ToolResultSummary') || !protocolDoc.includes('thought_modes.json') || !protocolDoc.includes('working_directory')) {
  add('error', 'protocol_contract', 'docs/agent-protocol.md', 'Protocol must expose ToolResultSummary, thought_modes and working_directory.')
}
if (!quickstartDoc.includes('npm run doctor:english') || !quickstartDoc.includes('--compact')) {
  add('error', 'quickstart_entry', 'QUICKSTART_AGENT.md', 'Quickstart must show doctor and compact route commands.')
}
if (!commonAgentDoc.includes('OpenAI Agents SDK') || !commonAgentDoc.includes('MCP') || !commonAgentDoc.includes('LangGraph')) {
  add('error', 'common_agent_snippets', 'docs/common-agent-snippets.md', 'Common snippets must mention MCP, OpenAI Agents SDK and LangGraph.')
}
if (!routeCli.includes('--list-scenarios') || !routeCli.includes('--format prompt') || !routeCli.includes('--compact')) {
  add('error', 'route_cli_options', 'scripts/english-route.mjs', 'English route CLI must support list, prompt and compact outputs.')
}
if (!doctorCli.includes('golden_tasks') || !doctorCli.includes('powershell_encoding_route')) {
  add('error', 'doctor_cli_checks', 'scripts/english-doctor.mjs', 'English doctor must check golden tasks and PowerShell encoding route.')
}
if (!realEvalCli.includes("kind: 'real_evaluation'") || !realEvalCli.includes('failure_recurrence_guard') || !realEvalCli.includes('powershell_encoding_probe')) {
  add('error', 'real_eval_cli_checks', 'scripts/english-real-eval.mjs', 'English real eval must cover real checks, encoding and recurrence guard.')
}
if (!connectCli.includes('local_agent_connect') || !connectCli.includes('connected') || !connectCli.includes('scenario-local-agent-connect-check')) {
  add('error', 'connect_cli_checks', 'scripts/english-connect.mjs', 'English connect CLI must expose local Agent connection state.')
}

if (stabilityScenarios && routeIndex && resultPatterns && failurePatterns && powershellFailurePatterns) {
  const routeIds = new Set(routeIndex.routes?.map((route) => route.id) ?? [])
  const resultPatternIds = new Set(resultPatterns.patterns?.map((pattern) => pattern.id) ?? [])
  const failurePatternIds = new Set([
    ...(failurePatterns.patterns?.map((pattern) => pattern.id) ?? []),
    ...(powershellFailurePatterns.patterns?.map((pattern) => pattern.id) ?? []),
  ])
  for (const routeId of stabilityScenarios.global_required_routes ?? []) {
    if (!routeIds.has(routeId)) add('error', 'scenario_global_route_ref', 'knowledge/agent-tooling/stability_scenarios.json', `Missing global route ${routeId}`)
  }
  for (const scenario of stabilityScenarios.scenarios ?? []) {
    if (!scenario.id || !scenario.operation_type || !scenario.risk_level) add('error', 'scenario_required_field', 'knowledge/agent-tooling/stability_scenarios.json', `Scenario ${scenario.id ?? '(missing id)'} missing required fields.`)
    if ((scenario.required_routes?.length ?? 0) < 3) add('error', 'scenario_route_coverage', 'knowledge/agent-tooling/stability_scenarios.json', `Scenario ${scenario.id} needs at least 3 required routes.`)
    if ((scenario.required_checks?.length ?? 0) < 4) add('error', 'scenario_required_checks', 'knowledge/agent-tooling/stability_scenarios.json', `Scenario ${scenario.id} needs at least 4 required checks.`)
    if (!resultPatternIds.has(scenario.expected_summary_pattern)) add('error', 'scenario_summary_pattern_ref', 'knowledge/agent-tooling/stability_scenarios.json', `Scenario ${scenario.id} references missing summary pattern ${scenario.expected_summary_pattern}`)
    for (const routeId of scenario.required_routes ?? []) {
      if (!routeIds.has(routeId)) add('error', 'scenario_route_ref', 'knowledge/agent-tooling/stability_scenarios.json', `Scenario ${scenario.id} references missing route ${routeId}`)
    }
    for (const signature of scenario.failure_signatures ?? []) {
      if (!failurePatternIds.has(signature)) add('error', 'scenario_failure_signature_ref', 'knowledge/agent-tooling/stability_scenarios.json', `Scenario ${scenario.id} references missing failure signature ${signature}`)
    }
  }
}

const routeOutputExample = readJson(join(editionRoot, 'examples', 'route-output.example.json'))
if (routeOutputExample?.context_pack?.semantic_anchor !== 'language-tree-hub') add('error', 'example_context_semantic_anchor', 'examples/route-output.example.json', 'Route output example must expose semantic_anchor=language-tree-hub.')
if (!routeOutputExample?.proposed_action?.scope?.working_directory) add('error', 'example_proposed_action_workdir', 'examples/route-output.example.json', 'Route output example ProposedAction must include scope.working_directory.')

const resultSummaryExample = readJson(join(editionRoot, 'examples', 'tool-result-summary.example.json'))
if (resultSummaryExample?.kind !== 'ToolResultSummary') add('error', 'example_tool_result_summary', 'examples/tool-result-summary.example.json', 'Tool result summary example must be ToolResultSummary.')

const goldenTasks = readJson(join(editionRoot, 'golden-tasks', 'tool-stability.golden.json'))
if (goldenTasks) {
  const taskIds = new Set(goldenTasks.tasks?.map((task) => task.id) ?? [])
  for (const taskId of ['golden-powershell-delete', 'golden-jsonl-edit', 'golden-git-dirty-worktree', 'golden-node-build', 'golden-no-evidence-no-complete']) {
    if (!taskIds.has(taskId)) add('error', 'golden_task_missing', 'golden-tasks/tool-stability.golden.json', `Missing golden task ${taskId}`)
  }
}

if (contentIndex) {
  const bridgeGroup = contentIndex.route_groups?.find((group) => group.id === 'external_agent_plugin_bridge')
  if (!bridgeGroup?.route_refs?.includes('route-agent-integration-usability-test')) {
    add('error', 'content_index_bridge_group', 'knowledge/database/content_index.json', 'Content index must include external_agent_plugin_bridge.')
  }
}

const errors = findings.filter((finding) => finding.severity === 'error')
const warnings = findings.filter((finding) => finding.severity === 'warn')

console.log(JSON.stringify({
  ok: errors.length === 0,
  checked_files: walk(editionRoot).filter((file) => statSync(file).isFile()).length,
  graph_nodes: graph?.nodes?.length ?? 0,
  graph_edges: graph?.edges?.length ?? 0,
  routes: routeIndex?.routes?.length ?? 0,
  content_units: contentUnits.length,
  sources: sourceRegistry?.sources?.length ?? 0,
  errors: errors.length,
  warnings: warnings.length,
  findings,
}, null, 2))

if (errors.length > 0) process.exit(1)
