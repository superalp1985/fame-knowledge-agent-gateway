import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const editionRoot = path.join(projectRoot, 'versions', 'chinese-open')
const knowledgeRoot = path.join(editionRoot, 'knowledge')

const startupReadSet = [
  'versions/chinese-open/docs/07_Agent协议与最小接入.md',
  'versions/chinese-open/knowledge/route_index.json',
  'versions/chinese-open/knowledge/indexes/subject_index.json',
  'versions/chinese-open/knowledge/language-tree-hub/core.json',
  'versions/chinese-open/knowledge/language-tree-hub/lexicon_seed.json',
  'versions/chinese-open/knowledge/language-tree-hub/thought_modes.json',
  'versions/chinese-open/knowledge/indexes/scoping_index.json',
  'versions/chinese-open/knowledge/agent-tooling/stability_scenarios.json',
  'versions/chinese-open/knowledge/agent-tooling/tool_gateway_policies.json',
]

const keywordHints = [
  ['原生命令', 'scenario-powershell-native-command'],
  ['参数边界', 'scenario-powershell-native-command'],
  ['native command', 'scenario-powershell-native-command'],
  ['powershell', 'scenario-powershell-destructive-delete'],
  ['remove-item', 'scenario-powershell-destructive-delete'],
  ['递归', 'scenario-powershell-destructive-delete'],
  ['删除', 'scenario-powershell-destructive-delete'],
  ['清空', 'scenario-powershell-destructive-delete'],
  ['移动目录', 'scenario-powershell-destructive-delete'],
  ['jsonl', 'scenario-jsonl-knowledge-edit'],
  ['content_units', 'scenario-jsonl-knowledge-edit'],
  ['route_index', 'scenario-jsonl-knowledge-edit'],
  ['alias_index', 'scenario-jsonl-knowledge-edit'],
  ['知识库', 'scenario-jsonl-knowledge-edit'],
  ['知识网', 'scenario-jsonl-knowledge-edit'],
  ['同步索引', 'scenario-jsonl-knowledge-edit'],
  ['git', 'scenario-git-dirty-worktree'],
  ['脏工作区', 'scenario-git-dirty-worktree'],
  ['未提交', 'scenario-git-dirty-worktree'],
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
  ['解释器', 'scenario-python-runtime'],
  ['乱码', 'scenario-powershell-encoding-mojibake'],
  ['mojibake', 'scenario-powershell-encoding-mojibake'],
  ['encoding', 'scenario-powershell-encoding-mojibake'],
  ['utf-8', 'scenario-powershell-encoding-mojibake'],
  ['中文输出', 'scenario-powershell-encoding-mojibake'],
  ['编码', 'scenario-powershell-encoding-mojibake'],
  ['下载', 'scenario-network-source-import'],
  ['抓取', 'scenario-network-source-import'],
  ['网络', 'scenario-network-source-import'],
  ['url', 'scenario-network-source-import'],
  ['许可证', 'scenario-network-source-import'],
  ['source_registry', 'scenario-network-source-import'],
  ['接入', 'scenario-external-agent-integration'],
  ['协议', 'scenario-external-agent-integration'],
  ['插件', 'scenario-external-agent-integration'],
  ['mcp', 'scenario-external-agent-integration'],
  ['agent', 'scenario-external-agent-integration'],
  ['contextpack', 'scenario-external-agent-integration'],
  ['guardrail', 'scenario-guardrail-human-review'],
  ['人工审批', 'scenario-guardrail-human-review'],
  ['checkpoint', 'scenario-agent-resume-memory'],
  ['store', 'scenario-agent-resume-memory'],
  ['本机agent', 'scenario-local-agent-connect-check'],
  ['本机 agent', 'scenario-local-agent-connect-check'],
  ['local agent', 'scenario-local-agent-connect-check'],
  ['connected', 'scenario-local-agent-connect-check'],
  ['接入状态', 'scenario-local-agent-connect-check'],
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
    .split(/[\s,，。；;、:：()（）[\]【】"'`]+/u)
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
  const mentionsNativeCommand = /(?:npm|node|pnpm|yarn|python|pip|git|docker|curl|native command|原生命令|参数边界)/iu.test(goal)
  if (mentionsPowerShell && mentionsNativeCommand) {
    routes.push('route-powershell-native-command-boundary')
  }
  if (/mcp|capability|能力边界|能力发现/iu.test(goal)) {
    routes.push('route-agent-mcp-capability-boundary')
  }
  if (/guardrail|审批|批准|approval|human review/iu.test(goal)) {
    routes.push('route-agent-guardrail-human-review')
  }
  if (/checkpoint|store|resume|恢复|续跑|中断/iu.test(goal)) {
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
    return ['高风险动作先等待 ApprovedAction；执行前记录目标快照、绝对路径和人工确认。']
  }
  if (selected.operation_type === 'write') {
    return ['记录 changed_files；必要时由版本控制或人工按变更摘要回退。']
  }
  if (selected.operation_type === 'network') {
    return ['外部来源先隔离到候选区；许可证或来源不清时只保留摘要和链接。']
  }
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
  if (args.prior_failure_signatures.length > 0) {
    requiredPolicyIds.push('gateway-policy-negative-lesson')
  }
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
      '确认球门、验收证据和停止条件。',
      '确认工具说明、参数 schema、权限和副作用。',
      '确认作用域：project_id、task_id、subject、route_id、working_directory、allowed_paths。',
      '执行后写 ToolResultSummary，长日志只进外部记忆或数据库。',
    ],
  }
}

function makeAgentStartPrompt(result) {
  return [
    '你正在接入 FAME 中文开源版。先把用户目标归一到语言树中枢，再选择 subject 和 route。',
    `当前场景：${result.selected_scenario.label} (${result.selected_scenario.id})。`,
    `先读文件：${result.startup_read_set.join(' ; ')}`,
    `当前 ContextPack：project_id=${result.context_pack.project_id}, task_id=${result.context_pack.task_id}, thought_mode=${result.context_pack.thought_mode}。`,
    `必须加载路线：${result.context_pack.route_ids.join(', ')}`,
    '工具调用前必须有工具动作契约；高风险动作必须有 ApprovedAction；执行后必须写 ToolResultSummary。',
    `工具闸门结论：${result.tool_gateway_decision.final_decision}。`,
    '不要全量加载知识网，不要把长日志塞进上下文，不要把项目 overlay 自动合并进核心知识网。',
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
            `先检查历史失败签名：${priorFailureSignatures.join(', ')}`,
            '不得重复同一命令形态；先修正失败触发条件，再执行最小验证。',
          ]
        : []),
      ...selected.required_checks,
    ].slice(0, 5),
    rollback_plan: rollbackPlanFor(selected),
    requires_approval: gateway.requires_approved_action,
  }

  const result = {
    ok: true,
    edition_id: 'chinese-open',
    startup_read_set: startupReadSet,
    selected_scenario: {
      id: selected.id,
      label: selected.label,
      operation_type: selected.operation_type,
      risk_level: selected.risk_level,
      trigger: selected.trigger,
    },
    context_pack: {
      edition_id: 'chinese-open',
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
            `先读取并处理历史失败签名：${priorFailureSignatures.join(', ')}`,
            '不得重复同一失败触发条件；先修正原因，再执行最小验证。',
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
    const lines = ['# 中文开源版稳定场景', '']
    for (const item of items) {
      lines.push(`- \`${item.id}\` - ${item.label} / ${item.operation_type} / ${item.risk_level}`)
      lines.push(`  ${item.trigger}`)
    }
    return lines.join('\n')
  }

  return JSON.stringify({ ok: true, edition_id: 'chinese-open', scenarios: items }, null, 2)
}

function printMarkdown(result) {
  const lines = []
  lines.push(`# ${result.selected_scenario.label}`)
  lines.push('')
  lines.push(`- 场景：\`${result.selected_scenario.id}\``)
  lines.push(`- 动作类型：\`${result.selected_scenario.operation_type}\``)
  lines.push(`- 风险：\`${result.selected_scenario.risk_level}\``)
  lines.push(`- 工具闸门：\`${result.tool_gateway_decision.final_decision}\``)
  lines.push('')
  lines.push('## 路线')
  for (const route of result.routes) lines.push(`- \`${route.id}\`：${route.name}`)
  lines.push('')
  lines.push('## 检查项')
  for (const check of result.required_checks) lines.push(`- ${check}`)
  lines.push('')
  lines.push('## 工具动作契约草案')
  lines.push('```json')
  lines.push(JSON.stringify(result.proposed_action, null, 2))
  lines.push('```')
  lines.push('')
  lines.push('## Agent 启动提示')
  lines.push('```text')
  lines.push(result.agent_start_prompt)
  lines.push('```')
  console.log(lines.join('\n'))
}

function printHelp() {
  console.log(`Usage:
  node scripts/chinese-open-route.mjs --goal "修改 JSONL 知识库并同步索引"
  node scripts/chinese-open-route.mjs --scenario scenario-python-runtime --format md
  node scripts/chinese-open-route.mjs --operation delete --goal "PowerShell 删除目录" --tool-name exec_command --working-directory "<project-root>"
  node scripts/chinese-open-route.mjs --list-scenarios --format md
  node scripts/chinese-open-route.mjs --scenario scenario-external-agent-integration --format prompt
  node scripts/chinese-open-route.mjs --goal "PowerShell 显示中文乱码" --compact
  node scripts/chinese-open-route.mjs --scenario scenario-local-agent-connect-check --format prompt
  node scripts/chinese-open-route.mjs --goal "修改 JSONL 知识库并同步索引" --compact

Options:
  --goal                 自然语言任务目标
  --scenario             指定稳定场景 id
  --operation            read | write | execute | test | build | network | delete
  --format               json | md | markdown | prompt
  --project-id           项目作用域
  --task-id              任务作用域
  --tool-name            准备调用的工具名
  --working-directory    工具执行目录
  --expected-output      可观察验证信号
  --target               工具目标，写入 proposed_action.arguments.target
  --allowed-path         允许路径，可重复
  --prior-failure-signature  上一次失败签名，可重复，用于触发反思和复发防护
  --list-scenarios       列出内置稳定场景
  --compact              只输出给外部 Agent 的最小决策 JSON`)
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
  console.error(JSON.stringify({ ok: false, error: error.message }, null, 2))
  process.exit(1)
}
