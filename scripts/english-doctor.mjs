import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const routeScript = path.join(projectRoot, 'scripts', 'english-route.mjs')
const editionRoot = path.join(projectRoot, 'versions', 'english')
const goldenTaskFile = path.join(editionRoot, 'golden-tasks', 'tool-stability.golden.json')

function runJson(args) {
  const output = execFileSync(process.execPath, [routeScript, ...args], {
    cwd: projectRoot,
    encoding: 'utf8',
  })
  return JSON.parse(output)
}

function assert(condition, message) {
  if (!condition) throw new Error(message)
}

function exists(relativePath) {
  return fs.existsSync(path.join(projectRoot, relativePath))
}

function goldenHas(result, expected) {
  if (expected === 'requires_approved_action') return result.requires_approved_action === true
  if (expected.startsWith('route-')) return result.route_ids.includes(expected)
  if (expected.startsWith('tool-failure-') || expected.startsWith('ps-failure-')) return JSON.stringify(result).includes(expected)
  if (expected.startsWith('result-pattern-')) return result.expected_summary_pattern === expected
  return JSON.stringify(result).includes(expected)
}

const requiredFiles = [
  'versions/english/QUICKSTART_AGENT.md',
  'versions/english/examples/external-agent-bootstrap.md',
  'versions/english/examples/route-output.example.json',
  'versions/english/examples/tool-result-summary.example.json',
  'versions/english/golden-tasks/tool-stability.golden.json',
  'scripts/english-route.mjs',
  'scripts/english-connect.mjs',
  'scripts/check-english.mjs',
]

const checks = []

function record(id, fn) {
  try {
    const detail = fn()
    checks.push({ id, ok: true, detail })
  } catch (error) {
    checks.push({ id, ok: false, error: error.message })
  }
}

record('required_files', () => {
  const missing = requiredFiles.filter((file) => !exists(file))
  assert(missing.length === 0, `Missing files: ${missing.join(', ')}`)
  return { checked: requiredFiles.length }
})

record('compact_jsonl_route', () => {
  const result = runJson(['--goal', 'edit JSONL knowledge base and sync indexes', '--compact'])
  assert(result.scenario === 'scenario-jsonl-knowledge-edit', `Unexpected scenario ${result.scenario}`)
  assert(result.route_ids.includes('route-agent-database-sync'), 'Missing database sync route')
  return { scenario: result.scenario, decision: result.decision, routes: result.route_ids.length }
})

record('delete_requires_approval', () => {
  const result = runJson([
    '--operation',
    'delete',
    '--goal',
    'PowerShell delete directory but avoid accidental deletion',
    '--tool-name',
    'exec_command',
    '--working-directory',
    '<project-root>',
    '--expected-output',
    'list absolute path and wait for approval',
    '--compact',
  ])
  assert(result.scenario === 'scenario-powershell-destructive-delete', `Unexpected scenario ${result.scenario}`)
  assert(result.requires_approved_action === true, 'Delete route must require approval')
  return { scenario: result.scenario, decision: result.decision }
})

record('powershell_encoding_route', () => {
  const result = runJson(['--goal', 'PowerShell Chinese output mojibake', '--compact'])
  assert(result.scenario === 'scenario-powershell-encoding-mojibake', `Unexpected scenario ${result.scenario}`)
  assert(result.route_ids.includes('route-powershell-encoding-output'), 'Missing PowerShell encoding route')
  assert(result.failure_signatures.includes('ps-failure-output-encoding-mojibake'), 'Missing encoding failure signature')
  return { scenario: result.scenario, decision: result.decision, routes: result.route_ids.length }
})

record('local_agent_connect_route', () => {
  const result = runJson(['--goal', 'local agent connection state check', '--compact'])
  assert(result.scenario === 'scenario-local-agent-connect-check', `Unexpected scenario ${result.scenario}`)
  assert(result.route_ids.includes('route-agent-local-connect-check'), 'Missing local connect route')
  return { scenario: result.scenario, decision: result.decision, routes: result.route_ids.length }
})

record('failure_recurrence_guard_route', () => {
  const result = runJson([
    '--goal',
    'rerun npm test but avoid repeating the wrong working directory failure',
    '--operation',
    'build',
    '--tool-name',
    'exec_command',
    '--working-directory',
    projectRoot,
    '--expected-output',
    'npm test passes',
    '--prior-failure-signature',
    'tool-failure-wrong-working-directory',
    '--compact',
  ])
  assert(result.scenario === 'scenario-node-npm-build', `Unexpected scenario ${result.scenario}`)
  assert(result.recurrence_guard?.active === true, 'Recurrence guard must be active with prior failure signature')
  assert(result.prior_failure_signatures.includes('tool-failure-wrong-working-directory'), 'Missing prior failure signature')
  assert(result.route_ids.includes('route-agent-reflection-improvement'), 'Missing reflection route')
  assert(result.route_ids.includes('route-negative-fame-lesson'), 'Missing negative lesson route')
  assert(result.route_ids.includes('route-logic-failure-diagnosis'), 'Missing failure diagnosis route')
  return { scenario: result.scenario, decision: result.decision, guard: result.recurrence_guard.active }
})

record('external_agent_prompt', () => {
  const output = execFileSync(process.execPath, [
    routeScript,
    '--scenario',
    'scenario-external-agent-integration',
    '--format',
    'prompt',
  ], {
    cwd: projectRoot,
    encoding: 'utf8',
  })
  assert(output.includes('FAME English open edition'), 'Prompt must identify English open edition')
  assert(output.includes('language-tree-hub'), 'Prompt must mention semantic anchor')
  return { chars: output.length }
})

record('example_json_parse', () => {
  const routeExample = JSON.parse(fs.readFileSync(path.join(editionRoot, 'examples', 'route-output.example.json'), 'utf8'))
  const summaryExample = JSON.parse(fs.readFileSync(path.join(editionRoot, 'examples', 'tool-result-summary.example.json'), 'utf8'))
  assert(routeExample.context_pack?.semantic_anchor === 'language-tree-hub', 'Route example missing semantic anchor')
  assert(summaryExample.kind === 'ToolResultSummary', 'Summary example must be ToolResultSummary')
  return { examples: 2 }
})

record('golden_tasks', () => {
  const golden = JSON.parse(fs.readFileSync(goldenTaskFile, 'utf8'))
  const checked = []
  for (const task of golden.tasks) {
    const result = runJson(['--goal', task.goal, ...(task.args ?? []), '--compact'])
    assert(result.scenario === task.expected_scenario, `${task.id} expected ${task.expected_scenario}, got ${result.scenario}`)
    for (const expected of task.must_have ?? []) {
      assert(goldenHas(result, expected), `${task.id} missing ${expected}`)
    }
    checked.push(task.id)
  }
  return { checked: checked.length, tasks: checked }
})

const failures = checks.filter((check) => !check.ok)
console.log(JSON.stringify({
  ok: failures.length === 0,
  edition_id: 'english',
  checks,
  next_command: 'npm run route:english -- --goal "<your task>" --compact',
}, null, 2))

if (failures.length > 0) process.exit(1)
