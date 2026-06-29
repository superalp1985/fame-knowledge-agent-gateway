import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const editionId = 'english'
const editionRoot = path.join(projectRoot, 'versions', editionId)
const knowledgeRoot = path.join(editionRoot, 'knowledge')

const startupReadSet = [
  'versions/english/docs/agent-protocol.md',
  'versions/english/knowledge/route_index.json',
  'versions/english/knowledge/indexes/subject_index.json',
  'versions/english/knowledge/language-tree-hub/core.json',
  'versions/english/knowledge/language-tree-hub/lexicon_seed.json',
  'versions/english/knowledge/language-tree-hub/thought_modes.json',
  'versions/english/knowledge/indexes/scoping_index.json',
  'versions/english/knowledge/agent-tooling/stability_scenarios.json',
  'versions/english/knowledge/agent-tooling/tool_gateway_policies.json',
]

const keywordHints = [
  ['native command', 'scenario-powershell-native-command'],
  ['argument boundary', 'scenario-powershell-native-command'],
  ['powershell', 'scenario-powershell-destructive-delete'],
  ['remove-item', 'scenario-powershell-destructive-delete'],
  ['delete', 'scenario-powershell-destructive-delete'],
  ['remove directory', 'scenario-powershell-destructive-delete'],
  ['recursive', 'scenario-powershell-destructive-delete'],
  ['jsonl', 'scenario-jsonl-knowledge-edit'],
  ['content_units', 'scenario-jsonl-knowledge-edit'],
  ['route_index', 'scenario-jsonl-knowledge-edit'],
  ['alias_index', 'scenario-jsonl-knowledge-edit'],
  ['knowledge base', 'scenario-jsonl-knowledge-edit'],
  ['knowledge net', 'scenario-jsonl-knowledge-edit'],
  ['sync index', 'scenario-jsonl-knowledge-edit'],
  ['git', 'scenario-git-dirty-worktree'],
  ['dirty worktree', 'scenario-git-dirty-worktree'],
  ['uncommitted', 'scenario-git-dirty-worktree'],
  ['checkout', 'scenario-git-dirty-worktree'],
  ['reset', 'scenario-git-dirty-worktree'],
  ['node', 'scenario-node-npm-build'],
  ['npm', 'scenario-node-npm-build'],
  ['pnpm', 'scenario-node-npm-build'],
  ['yarn', 'scenario-node-npm-build'],
  ['lint', 'scenario-node-npm-build'],
  ['build', 'scenario-node-npm-build'],
  ['test', 'scenario-node-npm-build'],
  ['python', 'scenario-python-runtime'],
  ['pip', 'scenario-python-runtime'],
  ['venv', 'scenario-python-runtime'],
  ['download', 'scenario-network-source-import'],
  ['scrape', 'scenario-network-source-import'],
  ['network', 'scenario-network-source-import'],
  ['url', 'scenario-network-source-import'],
  ['license', 'scenario-network-source-import'],
  ['source_registry', 'scenario-network-source-import'],
  ['connect', 'scenario-external-agent-integration'],
  ['protocol', 'scenario-external-agent-integration'],
  ['plugin', 'scenario-external-agent-integration'],
  ['mcp', 'scenario-external-agent-integration'],
  ['agent', 'scenario-external-agent-integration'],
  ['contextpack', 'scenario-external-agent-integration'],
  ['guardrail', 'scenario-guardrail-human-review'],
  ['approval', 'scenario-guardrail-human-review'],
  ['human review', 'scenario-guardrail-human-review'],
  ['checkpoint', 'scenario-agent-resume-memory'],
  ['store', 'scenario-agent-resume-memory'],
  ['resume', 'scenario-agent-resume-memory'],
  ['local agent', 'scenario-local-agent-connect-check'],
  ['local agent connection', 'scenario-local-agent-connect-check'],
  ['connection state', 'scenario-local-agent-connect-check'],
  ['connection state check', 'scenario-local-agent-connect-check'],
  ['agent preset', 'scenario-local-agent-connect-check'],
  ['connected', 'scenario-local-agent-connect-check'],
  ['wizard', 'scenario-local-agent-connect-check'],
  ['mojibake', 'scenario-powershell-encoding-mojibake'],
  ['encoding', 'scenario-powershell-encoding-mojibake'],
  ['utf-8', 'scenario-powershell-encoding-mojibake'],
  ['chinese output', 'scenario-powershell-encoding-mojibake'],
  ['garbled', 'scenario-powershell-encoding-mojibake'],
]

function parseArgs(argv) {
  const args = {
    goal: '',
    scenario: '',
    operation: '',
    format: 'json',
    project_id: 'example-project',
    task_id: 'task-001',
    tool_name: '<tool-name>',
    working_directory: '<project-root>',
    expected_output: '<observable-signal>',
    target: '',
    allowed_paths: [],
    prior_failure_signatures: [],
    list_scenarios: false,
    compact: false,
    help: false,
  }

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]
    if (arg === '--goal') args.goal = argv[++index] ?? ''
    else if (arg === '--scenario') args.scenario = argv[++index] ?? ''
    else if (arg === '--operation') args.operation = argv[++index] ?? ''
    else if (arg === '--format') args.format = argv[++index] ?? 'json'
    else if (arg === '--project-id') args.project_id = argv[++index] ?? args.project_id
    else if (arg === '--task-id') args.task_id = argv[++index] ?? args.task_id
    else if (arg === '--tool-name') args.tool_name = argv[++index] ?? args.tool_name
    else if (arg === '--working-directory') args.working_directory = argv[++index] ?? args.working_directory
    else if (arg === '--expected-output') args.expected_output = argv[++index] ?? args.expected_output
    else if (arg === '--target') args.target = argv[++index] ?? ''
    else if (arg === '--allowed-path') args.allowed_paths.push(argv[++index] ?? '')
    else if (arg === '--prior-failure-signature') args.prior_failure_signatures.push(argv[++index] ?? '')
    else if (arg === '--list-scenarios') args.list_scenarios = true
    else if (arg === '--compact') args.compact = true
    else if (arg === '--help' || arg === '-h') args.help = true
  }

  args.allowed_paths = args.allowed_paths.filter(Boolean)
  args.prior_failure_signatures = args.prior_failure_signatures.filter(Boolean)
  return args
}

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(knowledgeRoot, relativePath), 'utf8'))
}

function routeById(routeIndex, id) {
  return routeIndex.routes.find((route) => route.id === id)
}

function splitGoal(goal) {
  return goal
    .toLowerCase()
    .split(/[\s,.;:!?()[\]{}"'`/\\|]+/u)
    .map((token) => token.trim())
    .filter(Boolean)
}

function scenarioScore(scenario, args) {
  if (args.scenario && scenario.id === args.scenario) return 1000
  const haystack = [
    scenario.id,
    scenario.label,
    scenario.operation_type,
    scenario.trigger,
    ...(scenario.required_checks ?? []),
    ...(scenario.failure_signatures ?? []),
  ].join(' ').toLowerCase()
  const goal = args.goal.toLowerCase()
  const operation = args.operation.toLowerCase()
  let score = 0
  if (operation && scenario.operation_type.toLowerCase() === operation) score += 35
  for (const token of splitGoal(goal)) {
    if (haystack.includes(token)) score += token.length > 2 ? 6 : 3
  }
  for (const [keyword, scenarioId] of keywordHints) {
    if (goal.includes(keyword) && scenario.id === scenarioId) score += 25
  }
  return score
}

function selectScenario(scenarios, args) {
  if (args.scenario) {
    const exact = scenarios.find((scenario) => scenario.id === args.scenario)
    if (!exact) throw new Error(`Unknown scenario: ${args.scenario}`)
    return exact
  }
  const ranked = scenarios
    .map((scenario) => ({ scenario, score: scenarioScore(scenario, args) }))
    .sort((left, right) => right.score - left.score)
  return ranked[0]?.score > 0
    ? ranked[0].scenario
    : scenarios.find((scenario) => scenario.id === 'scenario-external-agent-integration')
}

function extraRouteIdsForGoal(args, selected) {
  const goal = args.goal.toLowerCase()
  const routes = []
  const mentionsPowerShell = goal.includes('powershell') || goal.includes('pwsh')
  const mentionsNativeCommand = /(?:npm|node|pnpm|yarn|python|pip|git|docker|curl|native command|argument boundary)/iu.test(goal)
  if (mentionsPowerShell && mentionsNativeCommand) {
    routes.push('route-powershell-native-command-boundary')
  }
  if (/mcp|capability|capability boundary|capability discovery/iu.test(goal)) {
    routes.push('route-agent-mcp-capability-boundary')
  }
  if (/guardrail|approval|approvedaction|human review/iu.test(goal)) {
    routes.push('route-agent-guardrail-human-review')
  }
  if (/checkpoint|store|resume|continuation|interrupted/iu.test(goal)) {
    routes.push('route-agent-checkpoint-store-memory')
  }
  if (selected.id === 'scenario-powershell-native-command') {
    routes.push('route-powershell-native-command-boundary')
  }
  return routes
}

function routeSummary(route) {
  return String(route.content ?? route.summary ?? route.name ?? route.id).slice(0, 240)
}

function allowedSideEffects(operationType) {
  const sideEffects = {
    read: ['none'],
    write: ['modify_declared_files'],
    delete: ['delete_declared_paths_after_approval'],
    move: ['move_declared_paths_after_approval'],
    network: ['network_read', 'write_registered_source_summary'],
    execute: ['execute_declared_command'],
    test: ['write_test_cache_or_artifacts'],
    build: ['write_build_artifacts'],
    publish: ['remote_publish_after_approval'],
  }
  return sideEffects[operationType] ?? ['declared_side_effects_only']
}

function rollbackPlanFor(selected) {
  if (selected.risk_level === 'high' || selected.risk_level === 'critical') {
    return ['High-risk action waits for ApprovedAction; record target snapshot, resolved absolute paths and human confirmation before execution.']
  }
  if (selected.operation_type === 'write') return ['Record changed_files; use version control or manual change summary for rollback.']
  if (selected.operation_type === 'network') return ['Keep external downloads isolated; retain only summary and links when license is unclear.']
  return []
}

function gatewayDecision(selected, args) {
  const requiredPolicyIds = ['gateway-policy-result-summary']
  const blockers = []
  const operationType = selected.operation_type
  const riskLevel = selected.risk_level
  const toolMissing = !args.tool_name || args.tool_name === '<tool-name>'
  const workdirMissing = !args.working_directory || args.working_directory === '<project-root>'
  const signalMissing = !args.expected_output || args.expected_output === '<observable-signal>'
  const targetMissing = !args.target && args.allowed_paths.length === 0

  if (toolMissing) {
    requiredPolicyIds.push('gateway-policy-doc-first')
    blockers.push('tool_name_or_tool_schema_not_declared')
  }
  if (workdirMissing && operationType !== 'read') blockers.push('working_directory_not_declared')
  if (signalMissing) blockers.push('expected_signal_not_declared')
  if (['delete', 'move', 'network', 'publish'].includes(operationType) && targetMissing) {
    blockers.push('target_or_allowed_path_not_declared')
  }
  if (['write', 'move', 'network', 'execute', 'test', 'build', 'publish'].includes(operationType)) {
    requiredPolicyIds.push('gateway-policy-mutation-proposed-action')
  }
  if (args.prior_failure_signatures.length > 0) requiredPolicyIds.push('gateway-policy-negative-lesson')
  if (riskLevel === 'high' || riskLevel === 'critical' || operationType === 'delete') {
    requiredPolicyIds.push('gateway-policy-high-risk-approval')
  }

  const needsApproval = requiredPolicyIds.includes('gateway-policy-high-risk-approval')
  const needsProposal = requiredPolicyIds.includes('gateway-policy-mutation-proposed-action') || needsApproval
  let finalDecision = 'allow_read_only_with_summary'
  if (blockers.length > 0) finalDecision = 'blocked_until_contract_complete'
  else if (needsApproval) finalDecision = 'requires_approved_action'
  else if (needsProposal) finalDecision = 'requires_proposed_action'

  return {
    final_decision: finalDecision,
    required_policy_ids: [...new Set(requiredPolicyIds)],
    requires_proposed_action: needsProposal,
    requires_approved_action: needsApproval,
    blockers,
    required_before_tool_call: [
      'Confirm goal gate, validation evidence and stop conditions.',
      'Confirm tool manual, argument schema, permissions and side effects.',
      'Confirm scope: project_id, task_id, subject, route_id, working_directory and allowed_paths.',
      'After execution, write ToolResultSummary; long logs go to external memory or database.',
    ],
  }
}

function makeAgentStartPrompt(result) {
  return [
    'You are connecting to FAME English open edition. Normalize the user goal through the Language Tree Hub, then select subject and route.',
    `Current scenario: ${result.selected_scenario.label} (${result.selected_scenario.id}).`,
    `Read first: ${result.startup_read_set.join(' ; ')}`,
    `Current ContextPack: project_id=${result.context_pack.project_id}, task_id=${result.context_pack.task_id}, thought_mode=${result.context_pack.thought_mode}.`,
    `Required routes: ${result.context_pack.route_ids.join(', ')}`,
    'Before tool execution, create a Tool Action Contract. High-risk actions require ApprovedAction. After execution, write ToolResultSummary.',
    `Tool Gateway decision: ${result.tool_gateway_decision.final_decision}.`,
    'Do not full-load the knowledge net, do not put long logs in context, and do not merge project overlay into core knowledge automatically.',
  ].join('\n')
}

function buildResult(args) {
  const routeIndex = readJson('route_index.json')
  const scenarios = readJson('agent-tooling/stability_scenarios.json')
  const actionTemplates = readJson('agent-tooling/action_templates.json')
  const resultPatterns = readJson('agent-tooling/result_summary_patterns.json')
  const selected = selectScenario(scenarios.scenarios, args)
  const priorFailureSignatures = [...new Set(args.prior_failure_signatures)]
  const routeIds = [...new Set([
    ...scenarios.global_required_routes,
    ...selected.required_routes,
    ...extraRouteIdsForGoal(args, selected),
    ...(priorFailureSignatures.length > 0
      ? ['route-logic-failure-diagnosis', 'route-agent-reflection-improvement', 'route-negative-fame-lesson']
      : []),
  ])]
  const routes = routeIds.map((id) => {
    const route = routeById(routeIndex, id)
    if (!route) throw new Error(`Scenario ${selected.id} references missing route: ${id}`)
    return {
      id: route.id,
      name: route.name,
      subject: route.subject,
      type: route.type,
      priority: route.priority,
      content_refs: route.content_refs ?? [],
      fame: route.fame,
      summary: routeSummary(route),
    }
  })
  const subjectIds = [...new Set(routes.map((route) => route.subject).filter(Boolean))]
  const contentRefs = [...new Set(routes.flatMap((route) => route.content_refs))]
  const thoughtMode = selected.risk_level === 'high' || selected.risk_level === 'critical' ? 'L5_operation' : 'L4_method'
  const actionTemplate = actionTemplates.templates.find((template) => template.id === 'template-tool-action-contract')
  const summaryPattern = resultPatterns.patterns.find((pattern) => pattern.id === selected.expected_summary_pattern)
  const gateway = gatewayDecision(selected, args)
  const proposedAction = {
    kind: 'ProposedAction',
    action_id: `${args.task_id}-${selected.id}`,
    project_id: args.project_id,
    task_id: args.task_id,
    route_refs: routeIds,
    tool_name: args.tool_name,
    operation_type: selected.operation_type,
    scope: {
      working_directory: args.working_directory,
      paths: args.allowed_paths,
      subjects: subjectIds,
      allowed_side_effects: allowedSideEffects(selected.operation_type),
    },
    arguments: args.target ? { target: args.target } : {},
    risk_level: selected.risk_level,
    expected_output: args.expected_output,
    validation_plan: [
      ...(priorFailureSignatures.length > 0
        ? [
            `First inspect prior failure signatures: ${priorFailureSignatures.join(', ')}`,
            'Do not repeat the same failing command shape; remove the trigger condition before the smallest validation.',
          ]
        : []),
      ...selected.required_checks,
    ].slice(0, 5),
    rollback_plan: rollbackPlanFor(selected),
    requires_approval: gateway.requires_approved_action,
  }

  const result = {
    ok: true,
    edition_id: editionId,
    startup_read_set: startupReadSet,
    selected_scenario: {
      id: selected.id,
      label: selected.label,
      operation_type: selected.operation_type,
      risk_level: selected.risk_level,
      trigger: selected.trigger,
    },
    context_pack: {
      edition_id: editionId,
      project_id: args.project_id,
      task_id: args.task_id,
      subject: 'agent-tooling',
      semantic_anchor: 'language-tree-hub',
      lexicon_refs: ['knowledge/language-tree-hub/lexicon_seed.json'],
      route_ids: routeIds,
      abstraction_level: thoughtMode,
      thought_mode: thoughtMode,
      summaries: routes.map((route) => ({ ref: route.id, summary: route.summary })),
      content_refs: contentRefs,
      rules: ['gate-no-contract-no-risky-tool', 'gate-no-goalpost-no-expansion'],
      negative_lessons: [...new Set([...selected.failure_signatures, ...priorFailureSignatures])],
      prior_failure_signatures: priorFailureSignatures,
      context_budget: selected.risk_level === 'high' || selected.risk_level === 'critical' ? 3600 : 2800,
      resume_point: {
        current_goal: args.goal || selected.trigger,
        loaded_refs: startupReadSet,
        next_step: priorFailureSignatures.length > 0
          ? 'Review prior failure signatures, change the failing condition, then run the smallest validation.'
          : 'Complete ProposedAction fields, pass Tool Gateway, then execute the tool if allowed.',
      },
    },
    routes,
    required_checks: [
      ...(priorFailureSignatures.length > 0
        ? [
            `Read and handle prior failure signatures: ${priorFailureSignatures.join(', ')}`,
            'Do not repeat the same failing condition; fix the cause before minimal validation.',
          ]
        : []),
      ...selected.required_checks,
    ],
    failure_signatures: [...new Set([...selected.failure_signatures, ...priorFailureSignatures])],
    prior_failure_signatures: priorFailureSignatures,
    recurrence_guard: priorFailureSignatures.length > 0
      ? {
          active: true,
          prior_failure_signatures: priorFailureSignatures,
          required_routes: ['route-logic-failure-diagnosis', 'route-agent-reflection-improvement', 'route-negative-fame-lesson'],
          rule: 'Do not repeat the same failing command shape. First remove the trigger condition, then run the smallest validation and write ToolResultSummary.',
        }
      : { active: false, prior_failure_signatures: [] },
    tool_gateway_decision: gateway,
    proposed_action: proposedAction,
    action_contract_draft: {
      goal: args.goal || selected.trigger,
      tool_name: args.tool_name,
      operation_type: selected.operation_type,
      arguments: proposedAction.arguments,
      scope: {
        working_directory: args.working_directory,
        allowed_paths: args.allowed_paths,
        route_ids: routeIds,
      },
      risk_level: selected.risk_level,
      expected_output: args.expected_output,
      validation_plan: proposedAction.validation_plan.slice(0, 3),
      rollback_plan: proposedAction.rollback_plan,
      blocked_if: gateway.blockers.length > 0
        ? gateway.blockers
        : ['tool_gateway_policy_rejects_action', 'validation_signal_missing_after_execution'],
    },
    action_template_required_arguments: actionTemplate?.required_arguments ?? [],
    expected_summary_pattern: summaryPattern
      ? { id: summaryPattern.id, required_fields: summaryPattern.required_fields }
      : { id: selected.expected_summary_pattern, required_fields: [] },
    result_summary_stub: {
      kind: 'ToolResultSummary',
      action_id: proposedAction.action_id,
      tool_name: proposedAction.tool_name,
      status: 'skipped',
      summary: 'Tool not executed yet; fill evidence after Tool Gateway allows execution.',
      evidence: [],
      errors: [],
      next_steps: ['Complete the action contract, pass Tool Gateway, then replace this stub with execution evidence.'],
      fame_update_candidates: [],
    },
  }
  result.agent_start_prompt = makeAgentStartPrompt(result)
  return result
}

function compactResult(result) {
  const decision = result.tool_gateway_decision
  const nextAction = decision.blockers.length > 0
    ? 'complete_action_contract'
    : decision.requires_approved_action
      ? 'request_approved_action'
      : decision.requires_proposed_action
        ? 'execute_after_proposed_action_review'
        : 'execute_read_only_then_write_summary'
  return {
    ok: true,
    edition_id: result.edition_id,
    scenario: result.selected_scenario.id,
    decision: decision.final_decision,
    blockers: decision.blockers,
    route_ids: result.context_pack.route_ids,
    thought_mode: result.context_pack.thought_mode,
    context_budget: result.context_pack.context_budget,
    requires_proposed_action: decision.requires_proposed_action,
    requires_approved_action: decision.requires_approved_action,
    next_action: nextAction,
    required_checks: result.required_checks.slice(0, 5),
    failure_signatures: result.failure_signatures,
    prior_failure_signatures: result.prior_failure_signatures,
    recurrence_guard: result.recurrence_guard,
    proposed_action_id: result.proposed_action.action_id,
    expected_summary_pattern: result.expected_summary_pattern.id,
  }
}

function scenarioList(format) {
  const scenarios = readJson('agent-tooling/stability_scenarios.json')
  const items = scenarios.scenarios.map((scenario) => ({
    id: scenario.id,
    label: scenario.label,
    operation_type: scenario.operation_type,
    risk_level: scenario.risk_level,
    trigger: scenario.trigger,
  }))
  if (format === 'md' || format === 'markdown') {
    const lines = ['# English Open Stability Scenarios', '']
    for (const item of items) {
      lines.push(`- \`${item.id}\` - ${item.label} / ${item.operation_type} / ${item.risk_level}`)
      lines.push(`  ${item.trigger}`)
    }
    return lines.join('\n')
  }
  return JSON.stringify({ ok: true, edition_id: editionId, scenarios: items }, null, 2)
}

function printMarkdown(result) {
  const lines = []
  lines.push(`# ${result.selected_scenario.label}`)
  lines.push('')
  lines.push(`- scenario: \`${result.selected_scenario.id}\``)
  lines.push(`- operation: \`${result.selected_scenario.operation_type}\``)
  lines.push(`- risk: \`${result.selected_scenario.risk_level}\``)
  lines.push(`- gateway: \`${result.tool_gateway_decision.final_decision}\``)
  lines.push('')
  lines.push('## Routes')
  for (const route of result.routes) lines.push(`- \`${route.id}\`: ${route.name}`)
  lines.push('')
  lines.push('## Checks')
  for (const check of result.required_checks) lines.push(`- ${check}`)
  lines.push('')
  lines.push('## ProposedAction Draft')
  lines.push('```json')
  lines.push(JSON.stringify(result.proposed_action, null, 2))
  lines.push('```')
  lines.push('')
  lines.push('## Agent Start Prompt')
  lines.push('```text')
  lines.push(result.agent_start_prompt)
  lines.push('```')
  console.log(lines.join('\n'))
}

function printHelp() {
  console.log(`Usage:
  node scripts/english-route.mjs --goal "edit JSONL knowledge and sync indexes"
  node scripts/english-route.mjs --scenario scenario-python-runtime --format md
  node scripts/english-route.mjs --operation delete --goal "PowerShell delete directory" --tool-name exec_command --working-directory "<project-root>"
  node scripts/english-route.mjs --list-scenarios --format md
  node scripts/english-route.mjs --scenario scenario-external-agent-integration --format prompt
  node scripts/english-route.mjs --goal "PowerShell Chinese output mojibake" --compact

Options:
  --goal
  --scenario
  --operation            read | write | execute | test | build | network | delete
  --format               json | md | markdown | prompt
  --project-id
  --task-id
  --tool-name
  --working-directory
  --expected-output
  --target
  --allowed-path         repeatable
  --prior-failure-signature repeatable
  --list-scenarios
  --compact`)
}

const args = parseArgs(process.argv.slice(2))
if (args.help) {
  printHelp()
  process.exit(0)
}

try {
  if (args.list_scenarios) {
    console.log(scenarioList(args.format))
    process.exit(0)
  }
  const result = buildResult(args)
  if (args.compact || args.format === 'compact') console.log(JSON.stringify(compactResult(result), null, 2))
  else if (args.format === 'md' || args.format === 'markdown') printMarkdown(result)
  else if (args.format === 'prompt') console.log(result.agent_start_prompt)
  else console.log(JSON.stringify(result, null, 2))
} catch (error) {
  console.error(JSON.stringify({ ok: false, edition_id: editionId, error: error.message }, null, 2))
  process.exit(1)
}
