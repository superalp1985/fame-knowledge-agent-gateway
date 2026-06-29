import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const routeScript = path.join(projectRoot, 'scripts', 'english-route.mjs')

const agentProfiles = {
  codex: { label: 'Codex / coding agent', prompt_hint: 'Use AGENTS.md as the project-level entry; run compact route before engineering tool calls.' },
  cursor: { label: 'Cursor / IDE agent', prompt_hint: 'Put QUICKSTART_AGENT.md summary into project rules and run route:english before tools.' },
  'claude-desktop': { label: 'Claude Desktop / MCP agent', prompt_hint: 'Expose knowledge as MCP resources and route:english as a routing tool.' },
  'claude-code': { label: 'Claude Code / terminal coding agent', prompt_hint: 'Use route:english --compact as a terminal tool precheck.' },
  'openai-agents': { label: 'OpenAI Agents SDK / guardrail agent', prompt_hint: 'Map Tool Gateway decisions to guardrails and write ToolResultSummary to traces or project memory.' },
  'gemini-cli': { label: 'Gemini CLI / terminal agent', prompt_hint: 'Place compact route output before shell/file tools.' },
  openhands: { label: 'OpenHands / software engineering agent', prompt_hint: 'Route software actions through scope, ProposedAction, failure signatures and result summary.' },
  'swe-agent': { label: 'SWE-agent / repo repair agent', prompt_hint: 'Read failure signatures, working directory and validation route before patch/test loops.' },
  aider: { label: 'Aider / pair programming agent', prompt_hint: 'Route before editing files and write ToolResultSummary with changed_files after execution.' },
  cline: { label: 'Cline / VS Code agent', prompt_hint: 'Connect route, Tool Gateway and high-risk approvals through CLI or MCP.' },
  'roo-code': { label: 'Roo Code / VS Code agent', prompt_hint: 'Generate ProposedAction before IDE tool calls.' },
  continue: { label: 'Continue / IDE coding assistant', prompt_hint: 'Put FAME prompt, route CLI and result summary into custom assistant flow.' },
  langgraph: { label: 'LangGraph / workflow agent', prompt_hint: 'Store ContextPack in state and project memory overlay in checkpoint/store.' },
  autogen: { label: 'AutoGen / multi-agent framework', prompt_hint: 'Normalize every agent/tool/task into route, scope, tool contract and summary.' },
  crewai: { label: 'CrewAI / role-based multi-agent framework', prompt_hint: 'Put FAME tool action contract before each task/tool.' },
  dify: { label: 'Dify / workflow-agent platform', prompt_hint: 'Call route:english --compact before workflow or agent tool nodes.' },
  generic: { label: 'Generic local agent', prompt_hint: 'Read QUICKSTART_AGENT.md and use compact route as the pre-tool decision.' },
  other: { label: 'Other custom agent', prompt_hint: 'Works for OpenClaw, Hermes or any tool-capable agent that can read text and call CLI/HTTP/MCP.' },
}

function parseArgs(argv) {
  const args = {
    agent: 'codex',
    agent_name: '',
    goal: 'local agent connection to English open edition',
    json: false,
    run_doctor: false,
    run_eval: false,
    help: false,
  }
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]
    if (arg === '--agent') args.agent = argv[++index] ?? args.agent
    else if (arg === '--agent-name') args.agent_name = argv[++index] ?? args.agent_name
    else if (arg === '--goal') args.goal = argv[++index] ?? args.goal
    else if (arg === '--json') args.json = true
    else if (arg === '--run-doctor') args.run_doctor = true
    else if (arg === '--run-eval') args.run_eval = true
    else if (arg === '--help' || arg === '-h') args.help = true
  }
  return args
}

function exists(relativePath) {
  return fs.existsSync(path.join(projectRoot, relativePath))
}

function runNodeScript(script, args = []) {
  const started = Date.now()
  try {
    const output = execFileSync(process.execPath, [script, ...args], {
      cwd: projectRoot,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    }).trim()
    return { ok: true, ms: Date.now() - started, output }
  } catch (error) {
    return {
      ok: false,
      ms: Date.now() - started,
      error: String(error.message ?? error),
      stdout: String(error.stdout ?? '').trim(),
      stderr: String(error.stderr ?? '').trim(),
    }
  }
}

function runNpm(scriptName) {
  const started = Date.now()
  const command = process.platform === 'win32'
    ? ['cmd.exe', ['/d', '/s', '/c', `npm run ${scriptName}`]]
    : ['npm', ['run', scriptName]]
  try {
    const output = execFileSync(command[0], command[1], {
      cwd: projectRoot,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    }).trim()
    return { ok: true, ms: Date.now() - started, output }
  } catch (error) {
    return {
      ok: false,
      ms: Date.now() - started,
      error: String(error.message ?? error),
      stdout: String(error.stdout ?? '').trim(),
      stderr: String(error.stderr ?? '').trim(),
    }
  }
}

function compactRoute(goal) {
  const output = execFileSync(process.execPath, [
    routeScript,
    '--scenario',
    'scenario-local-agent-connect-check',
    '--goal',
    goal,
    '--tool-name',
    'connect:english',
    '--expected-output',
    'connected or not_connected status',
    '--compact',
  ], {
    cwd: projectRoot,
    encoding: 'utf8',
  })
  return JSON.parse(output)
}

function firstLines(text, count = 10) {
  return text.split(/\r?\n/).filter(Boolean).slice(0, count)
}

function buildConnection(args) {
  const profile = agentProfiles[args.agent] ?? agentProfiles.generic
  const customLabel = args.agent === 'other' && args.agent_name.trim()
    ? `${args.agent_name.trim()} / custom agent`
    : profile.label
  const requiredFiles = [
    'AGENTS.md',
    'versions/english/QUICKSTART_AGENT.md',
    'versions/english/docs/agent-protocol.md',
    'versions/english/docs/real-evaluation-report.md',
    'scripts/english-route.mjs',
    'scripts/english-connect.mjs',
    'scripts/english-doctor.mjs',
    'scripts/english-real-eval.mjs',
  ]
  const missing = requiredFiles.filter((file) => !exists(file))
  const route = compactRoute(args.goal)
  const checks = [
    { id: 'required_files', ok: missing.length === 0, detail: missing.length === 0 ? `checked ${requiredFiles.length}` : `missing ${missing.join(', ')}` },
    { id: 'route_compact', ok: route.scenario === 'scenario-local-agent-connect-check', detail: route.scenario },
  ]
  if (args.run_doctor) {
    const doctor = runNpm('doctor:english')
    checks.push({ id: 'doctor', ok: doctor.ok, detail: doctor.ok ? `ok in ${doctor.ms}ms` : doctor.error })
  }
  if (args.run_eval) {
    const realEval = runNpm('eval:english')
    checks.push({ id: 'real_eval', ok: realEval.ok, detail: realEval.ok ? `ok in ${realEval.ms}ms` : realEval.error })
  }
  const blockers = [
    ...missing.map((file) => `missing:${file}`),
    ...(route.blockers ?? []).map((blocker) => `route:${blocker}`),
    ...checks.filter((check) => !check.ok).map((check) => `check_failed:${check.id}`),
  ]
  const prompt = runNodeScript(routeScript, ['--scenario', 'scenario-external-agent-integration', '--format', 'prompt'])
  const connected = blockers.length === 0
  return {
    ok: connected,
    edition_id: 'english',
    kind: 'local_agent_connect',
    agent: { id: args.agent, label: customLabel, custom_name: args.agent_name || undefined, prompt_hint: profile.prompt_hint },
    status: connected ? 'connected' : 'not_connected',
    blockers,
    checks,
    route_decision: route,
    next_command: connected
      ? 'npm run route:english -- --goal "<user goal>" --compact'
      : 'npm run doctor:english && npm run eval:english',
    prompt_preview: prompt.ok ? firstLines(prompt.output, 8) : [],
  }
}

function printHelp() {
  console.log(`Usage:
  npm run connect:english -- --agent codex
  npm run connect:english -- --agent cursor --json
  npm run connect:english -- --agent claude-desktop --run-doctor
  npm run connect:english -- --agent openhands --json
  npm run connect:english -- --agent other --agent-name OpenClaw
  npm run connect:english -- --agent generic --run-doctor --run-eval

Options:
  --agent        codex | cursor | claude-desktop | claude-code | openai-agents | gemini-cli | openhands | swe-agent | aider | cline | roo-code | continue | langgraph | autogen | crewai | dify | generic | other
  --agent-name   custom agent name for --agent other
  --goal
  --json
  --run-doctor
  --run-eval`)
}

const args = parseArgs(process.argv.slice(2))
if (args.help) {
  printHelp()
  process.exit(0)
}

try {
  const result = buildConnection(args)
  if (args.json) {
    console.log(JSON.stringify(result, null, 2))
  } else {
    console.log('# FAME English Open Local Agent Connect')
    console.log(`Agent: ${result.agent.label}`)
    console.log(`Status: ${result.status}`)
    if (result.blockers.length > 0) {
      console.log('Blockers:')
      for (const blocker of result.blockers) console.log(`- ${blocker}`)
    }
    console.log(`Next: ${result.next_command}`)
    console.log(`Hint: ${result.agent.prompt_hint}`)
  }
  if (!result.ok) process.exit(1)
} catch (error) {
  console.error(JSON.stringify({ ok: false, kind: 'local_agent_connect', edition_id: 'english', error: error.message }, null, 2))
  process.exit(1)
}
