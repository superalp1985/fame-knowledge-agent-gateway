import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { extname, join, relative } from 'node:path'

const projectRoot = process.cwd()
const editionRoot = join(projectRoot, 'versions', 'chinese-open')
const knowledgeRoot = join(editionRoot, 'knowledge')

const requiredFiles = [
  'README.md',
  'QUICKSTART_AGENT.md',
  'docs/00_\u5b9a\u4f4d\u4e0e\u5efa\u8bbe\u89c4\u5219.md',
  'docs/01_\u6743\u5a01\u6765\u6e90\u4e0e\u8bb8\u53ef\u8bc1\u767b\u8bb0.md',
  'docs/02_\u77e5\u8bc6\u7f51\u5f55\u5165\u89c4\u8303.md',
  'docs/03_\u5de5\u7a0b\u8bb0\u5fc6\u6848\u4f8b\u5f55\u5165\u89c4\u8303.md',
  'docs/04_Agent\u63a5\u5165\u5de5\u4f5c\u6d41.md',
  'docs/05_\u5f00\u6e90\u8d21\u732e\u6d41\u7a0b.md',
  'docs/06_\u6210\u719f\u6570\u636e\u6e90\u5bfc\u5165\u7b56\u7565.md',
  'docs/07_Agent\u534f\u8bae\u4e0e\u6700\u5c0f\u63a5\u5165.md',
  'docs/08_\u5e38\u89c1Agent\u63a5\u5165\u7247\u6bb5.md',
  'docs/09_\u5b9e\u673a\u8bc4\u6d4b\u62a5\u544a.md',
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
    return JSON.parse(readFileSync(file, 'utf8'))
  } catch (error) {
    add('error', 'json_parse', rel(file), error.message)
    return null
  }
}

function readText(file) {
  try {
    return readFileSync(file, 'utf8')
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
  if (!existsSync(join(editionRoot, file))) {
    add('error', 'required_file', `versions/chinese-open/${file}`, 'Required Chinese open edition file is missing.')
  }
}

for (const file of walk(editionRoot)) {
  if (extname(file).toLowerCase() === '.json') readJson(file)
  if (extname(file).toLowerCase() === '.jsonl') {
    const lines = readFileSync(file, 'utf8').split(/\r?\n/).filter(Boolean)
    lines.forEach((line, index) => {
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
const dataSources = readJson(join(knowledgeRoot, 'database', 'data_sources.json'))
const sampleManifestFile = join(knowledgeRoot, 'database', 'samples', 'manifest.json')
const sampleManifest = existsSync(sampleManifestFile) ? readJson(sampleManifestFile) : null
const openAlexCandidatesFile = join(knowledgeRoot, 'database', 'candidates', 'openalex_topic_candidates.json')
const openAlexCandidates = existsSync(openAlexCandidatesFile) ? readJson(openAlexCandidatesFile) : null
const knowledgeReadme = readText(join(knowledgeRoot, 'README.md'))
const languageTreeReadme = readText(join(knowledgeRoot, 'language-tree-hub', 'README.md'))
const versionReadme = readText(join(editionRoot, 'README.md'))
const workflowDoc = readText(join(editionRoot, 'docs', '04_Agent\u63a5\u5165\u5de5\u4f5c\u6d41.md'))
const protocolDoc = readText(join(editionRoot, 'docs', '07_Agent\u534f\u8bae\u4e0e\u6700\u5c0f\u63a5\u5165.md'))
const quickstartDoc = readText(join(editionRoot, 'QUICKSTART_AGENT.md'))
const commonAgentDoc = readText(join(editionRoot, 'docs', '08_\u5e38\u89c1Agent\u63a5\u5165\u7247\u6bb5.md'))
const routeCli = readText(join(projectRoot, 'scripts', 'chinese-open-route.mjs'))
const doctorCli = readText(join(projectRoot, 'scripts', 'chinese-open-doctor.mjs'))
const realEvalCli = readText(join(projectRoot, 'scripts', 'chinese-open-real-eval.mjs'))
const connectCli = readText(join(projectRoot, 'scripts', 'chinese-open-connect.mjs'))

const contentUnits = []
const contentFile = join(knowledgeRoot, 'database', 'content_units.jsonl')
if (existsSync(contentFile)) {
  readFileSync(contentFile, 'utf8')
    .split(/\r?\n/)
    .filter(Boolean)
    .forEach((line) => contentUnits.push(JSON.parse(line)))
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

  for (const source of ['openai-agents-sdk-guardrails', 'langgraph-memory-docs', 'llamaindex-agent-docs', 'ms-powershell-character-encoding']) {
    if (!sourceIds.has(source)) add('error', 'integration_source', 'knowledge/source_registry.json', `Missing external Agent integration source ${source}`)
  }
  for (const unit of ['cu-agent-ecosystem-mapping-001', 'cu-agent-practical-bridge-001', 'cu-ps-encoding-output-001', 'cu-agent-local-connect-001']) {
    if (!contentIds.has(unit)) add('error', 'integration_content_unit', 'knowledge/database/content_units.jsonl', `Missing integration content unit ${unit}`)
  }
  const integrationRoute = routeIndex.routes?.find((route) => route.id === 'route-agent-integration-usability-test')
  if (!integrationRoute?.content_refs?.includes('cu-agent-ecosystem-mapping-001')) {
    add('error', 'integration_route_content', 'knowledge/route_index.json', 'Integration route must include ecosystem mapping content.')
  }
  if (!integrationRoute?.content_refs?.includes('cu-agent-practical-bridge-001')) {
    add('error', 'integration_route_content', 'knowledge/route_index.json', 'Integration route must include practical bridge content.')
  }
}

if (subjectIndex) {
  const languageTreeHub = subjectIndex.subjects?.find((subject) => subject.id === 'language-tree-hub')
  if (!languageTreeHub?.entry_files?.includes('language-tree-hub/thought_modes.json')) {
    add('error', 'subject_thought_modes', 'knowledge/indexes/subject_index.json', 'language-tree-hub must include thought_modes.json in entry_files.')
  }
  for (const subject of subjectIndex.subjects ?? []) {
    for (const file of subject.entry_files ?? []) {
      if (!existsSync(join(knowledgeRoot, file))) {
        add('error', 'subject_entry_file', 'knowledge/indexes/subject_index.json', `Missing entry file ${file}`)
      }
    }
  }
}

if (!versionReadme.includes('\u601d\u8003\u5c42\u7ea7')) {
  add('error', 'version_readme_thought_mode', 'README.md', 'Version README must mention the thinking layer.')
}
if (!knowledgeReadme.includes('language-tree-hub/thought_modes.json')) {
  add('error', 'knowledge_readme_thought_modes', 'knowledge/README.md', 'Knowledge README must list thought_modes.json in the read order.')
}
if (!knowledgeReadme.includes('\u601d\u8003\u5c42\u7ea7')) {
  add('error', 'knowledge_readme_thought_modes', 'knowledge/README.md', 'Knowledge README must explain the thinking level check.')
}
if (!languageTreeReadme.includes('thought_modes.json')) {
  add('error', 'language_tree_readme_thought_modes', 'knowledge/language-tree-hub/README.md', 'Language tree README must list thought_modes.json.')
}
if (!workflowDoc.includes('knowledge/language-tree-hub/thought_modes.json')) {
  add('error', 'workflow_thought_modes', 'docs/04_Agent接入工作流.md', 'Agent workflow must include thought_modes.json in the startup read set.')
}
if (!workflowDoc.includes('thought_mode')) {
  add('error', 'workflow_thought_mode_field', 'docs/04_Agent接入工作流.md', 'Agent workflow ContextPack must expose thought_mode.')
}
if (!workflowDoc.includes('tool_gateway_decision')) {
  add('error', 'workflow_tool_gateway_decision', 'docs/04_Agent接入工作流.md', 'Agent workflow must mention tool_gateway_decision for external agents.')
}
if (!protocolDoc.includes('knowledge/language-tree-hub/thought_modes.json')) {
  add('error', 'protocol_thought_modes', 'docs/07_Agent协议与最小接入.md', 'Agent protocol must include thought_modes.json in the startup read set.')
}
if (!protocolDoc.includes('thought_mode')) {
  add('error', 'protocol_thought_mode_field', 'docs/07_Agent协议与最小接入.md', 'Agent protocol must expose thought_mode.')
}
if (!protocolDoc.includes('working_directory')) {
  add('error', 'protocol_working_directory', 'docs/07_Agent协议与最小接入.md', 'Agent protocol ProposedAction must expose working_directory.')
}
if (!protocolDoc.includes('生态映射')) {
  add('error', 'protocol_ecosystem_mapping', 'docs/07_Agent协议与最小接入.md', 'Agent protocol must explain ecosystem mapping.')
}
if (!routeCli.includes('--list-scenarios') || !routeCli.includes('--format prompt')) {
  add('error', 'route_cli_external_agent_options', 'scripts/chinese-open-route.mjs', 'Chinese open route CLI must support scenario listing and prompt mode.')
}
if (!routeCli.includes('--compact') || !routeCli.includes('compactResult') || !routeCli.includes('failure_signatures')) {
  add('error', 'route_cli_compact', 'scripts/chinese-open-route.mjs', 'Chinese open route CLI must support compact output.')
}
if (!doctorCli.includes('compact_jsonl_route') || !doctorCli.includes('delete_requires_approval') || !doctorCli.includes('golden_tasks')) {
  add('error', 'doctor_cli_checks', 'scripts/chinese-open-doctor.mjs', 'Chinese open doctor must check compact route, high-risk approval, and golden tasks.')
}
if (!realEvalCli.includes("kind: 'real_evaluation'") || !realEvalCli.includes('PowerShell 删除目录') || !realEvalCli.includes('npm_test_executed')) {
  add('error', 'real_eval_cli_checks', 'scripts/chinese-open-real-eval.mjs', 'Chinese open real eval must run real engineering checks.')
}
if (!realEvalCli.includes('powershell_encoding_probe') || !realEvalCli.includes('local_agent_connect_check')) {
  add('error', 'real_eval_cli_encoding_connect', 'scripts/chinese-open-real-eval.mjs', 'Real eval must cover PowerShell encoding and local Agent connection.')
}
if (!connectCli.includes('local_agent_connect') || !connectCli.includes('connected') || !connectCli.includes('scenario-local-agent-connect-check')) {
  add('error', 'connect_cli_checks', 'scripts/chinese-open-connect.mjs', 'Chinese open connect CLI must expose local Agent connection state.')
}
if (!versionReadme.includes('npm run eval:chinese-open') || !versionReadme.includes('docs/09_实机评测报告.md')) {
  add('error', 'version_readme_real_eval', 'README.md', 'Version README must document the real engineering evaluation command and report.')
}
if (!versionReadme.includes('npm run connect:chinese-open')) {
  add('error', 'version_readme_connect', 'README.md', 'Version README must document the local Agent connect command.')
}
if (!quickstartDoc.includes('npm run doctor:chinese-open') || !quickstartDoc.includes('--compact') || !quickstartDoc.includes('--target') || !quickstartDoc.includes('--allowed-path')) {
  add('error', 'quickstart_agent_entry', 'QUICKSTART_AGENT.md', 'Quickstart must show doctor, compact route, and target/path commands.')
}
if (!commonAgentDoc.includes('OpenAI Agents SDK') || !commonAgentDoc.includes('MCP') || !commonAgentDoc.includes('LangGraph')) {
  add('error', 'common_agent_snippets', 'docs/08_常见Agent接入片段.md', 'Common Agent snippets must mention MCP, OpenAI Agents SDK, and LangGraph.')
}
for (const keyword of ['删除', '知识库', '脏工作区', '接入']) {
  if (!routeCli.includes(keyword)) {
    add('error', 'route_cli_chinese_keyword', 'scripts/chinese-open-route.mjs', `Route CLI must keep readable Chinese keyword: ${keyword}`)
  }
}

if (dataSources && sourceRegistry) {
  const sourceIds = new Set(sourceRegistry.sources?.map((source) => source.id) ?? [])
  const sourceEquivalentIds = {
    'conceptnet-data': 'conceptnet',
    'open-english-wordnet-data': 'open-english-wordnet',
    'universal-dependencies-data': 'universal-dependencies',
    'library-of-congress-linked-data': 'loc-linked-data',
    'libraries-io': 'libraries-io-data',
  }

  for (const source of dataSources.sources ?? []) {
    const equivalent = sourceEquivalentIds[source.id] ?? source.id
    if (!sourceIds.has(equivalent)) {
      add('warn', 'data_source_registry_ref', 'knowledge/database/data_sources.json', `Data source ${source.id} is not registered in source_registry.json.`)
    }
    for (const field of ['id', 'title', 'url', 'domain', 'license_hint', 'recommended_tier', 'import_strategy']) {
      if (!source[field]) add('error', 'data_source_required_field', 'knowledge/database/data_sources.json', `Data source ${source.id ?? '(missing id)'} missing ${field}`)
    }
  }
}

if (sampleManifest) {
  if (sampleManifest.policy?.no_bulk_download !== true) {
    add('error', 'sample_manifest_policy', 'knowledge/database/samples/manifest.json', 'Sample manifest must declare no_bulk_download=true.')
  }
  if (sampleManifest.policy?.no_full_text_import !== true) {
    add('error', 'sample_manifest_policy', 'knowledge/database/samples/manifest.json', 'Sample manifest must declare no_full_text_import=true.')
  }
  for (const source of sampleManifest.sources ?? []) {
    const output = join(editionRoot, source.output)
    if (!existsSync(output)) {
      add('error', 'sample_manifest_output', 'knowledge/database/samples/manifest.json', `Missing sample output ${source.output}`)
      continue
    }
    const lines = readFileSync(output, 'utf8').split(/\r?\n/).filter(Boolean)
    if (lines.length !== source.records) {
      add('error', 'sample_manifest_count', source.output, `Manifest records=${source.records}, actual lines=${lines.length}`)
    }
  }
}

if (openAlexCandidates) {
  if (openAlexCandidates.policy?.candidate_index_only !== true) {
    add('error', 'candidate_policy', 'knowledge/database/candidates/openalex_topic_candidates.json', 'Candidate index must declare candidate_index_only=true.')
  }
  if (openAlexCandidates.policy?.no_core_graph_write !== true || openAlexCandidates.policy?.no_content_unit_write !== true) {
    add('error', 'candidate_policy', 'knowledge/database/candidates/openalex_topic_candidates.json', 'Candidate index must not write core graph or content units.')
  }
  if ((openAlexCandidates.candidates?.length ?? 0) !== (openAlexCandidates.summary?.candidates ?? 0)) {
    add('error', 'candidate_count', 'knowledge/database/candidates/openalex_topic_candidates.json', 'Candidate count does not match summary.')
  }
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
    if (!scenario.id || !scenario.operation_type || !scenario.risk_level) {
      add('error', 'scenario_required_field', 'knowledge/agent-tooling/stability_scenarios.json', `Scenario ${scenario.id ?? '(missing id)'} missing required fields.`)
    }
    if ((scenario.required_routes?.length ?? 0) < 3) {
      add('error', 'scenario_route_coverage', 'knowledge/agent-tooling/stability_scenarios.json', `Scenario ${scenario.id} needs at least 3 required routes.`)
    }
    if ((scenario.required_checks?.length ?? 0) < 4) {
      add('error', 'scenario_required_checks', 'knowledge/agent-tooling/stability_scenarios.json', `Scenario ${scenario.id} needs at least 4 required checks.`)
    }
    if (!resultPatternIds.has(scenario.expected_summary_pattern)) {
      add('error', 'scenario_summary_pattern_ref', 'knowledge/agent-tooling/stability_scenarios.json', `Scenario ${scenario.id} references missing summary pattern ${scenario.expected_summary_pattern}`)
    }
    for (const routeId of scenario.required_routes ?? []) {
      if (!routeIds.has(routeId)) add('error', 'scenario_route_ref', 'knowledge/agent-tooling/stability_scenarios.json', `Scenario ${scenario.id} references missing route ${routeId}`)
    }
    for (const signature of scenario.failure_signatures ?? []) {
      if (!failurePatternIds.has(signature)) add('error', 'scenario_failure_signature_ref', 'knowledge/agent-tooling/stability_scenarios.json', `Scenario ${scenario.id} references missing failure signature ${signature}`)
    }
  }
}

const routeOutputExample = readJson(join(editionRoot, 'examples', 'route-output.example.json'))
if (routeOutputExample) {
  if (routeOutputExample.context_pack?.semantic_anchor !== 'language-tree-hub') {
    add('error', 'example_context_semantic_anchor', 'examples/route-output.example.json', 'Route output example must expose semantic_anchor=language-tree-hub.')
  }
  if (!routeOutputExample.proposed_action?.scope?.working_directory) {
    add('error', 'example_proposed_action_workdir', 'examples/route-output.example.json', 'Route output example ProposedAction must include scope.working_directory.')
  }
}
const resultSummaryExample = readJson(join(editionRoot, 'examples', 'tool-result-summary.example.json'))
if (resultSummaryExample?.kind !== 'ToolResultSummary') {
  add('error', 'example_tool_result_summary', 'examples/tool-result-summary.example.json', 'Tool result summary example must be ToolResultSummary.')
}

const goldenTasks = readJson(join(editionRoot, 'golden-tasks', 'tool-stability.golden.json'))
if (goldenTasks) {
  const taskIds = new Set(goldenTasks.tasks?.map((task) => task.id) ?? [])
  for (const taskId of ['golden-powershell-delete', 'golden-jsonl-edit', 'golden-git-dirty-worktree', 'golden-node-build', 'golden-no-evidence-no-complete']) {
    if (!taskIds.has(taskId)) add('error', 'golden_task_missing', 'golden-tasks/tool-stability.golden.json', `Missing golden task ${taskId}`)
  }
  for (const task of goldenTasks.tasks ?? []) {
    if (!task.expected_scenario || (task.must_have?.length ?? 0) === 0) {
      add('error', 'golden_task_shape', 'golden-tasks/tool-stability.golden.json', `Golden task ${task.id ?? '(missing id)'} must declare expected_scenario and must_have.`)
    }
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

console.log(
  JSON.stringify(
    {
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
    },
    null,
    2,
  ),
)

if (errors.length > 0) process.exit(1)
