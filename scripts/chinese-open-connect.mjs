import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const routeScript = path.join(projectRoot, 'scripts', 'chinese-open-route.mjs')

const agentProfiles = {
  codex: {
    label: 'Codex / coding agent',
    prompt_hint: '把 AGENTS.md 作为项目级入口；每次工程任务前先跑 compact route。',
  },
  cursor: {
    label: 'Cursor / IDE agent',
    prompt_hint: '把 QUICKSTART_AGENT.md 摘要放入项目规则；工具前先调用 route:chinese-open。',
  },
  'claude-desktop': {
    label: 'Claude Desktop / MCP agent',
    prompt_hint: '把 knowledge 目录作为 MCP resources，把 route:chinese-open 作为 routing tool。',
  },
  'claude-code': {
    label: 'Claude Code / terminal coding agent',
    prompt_hint: '把 route:chinese-open --compact 作为终端工具调用前置检查。',
  },
  'openai-agents': {
    label: 'OpenAI Agents SDK / tool guardrail agent',
    prompt_hint: '把 Tool Gateway 映射成 guardrail，把 ToolResultSummary 写入 trace 或工程记忆。',
  },
  'gemini-cli': {
    label: 'Gemini CLI / terminal agent',
    prompt_hint: '把 compact route 输出作为 shell/file 工具调用前的动作契约。',
  },
  openhands: {
    label: 'OpenHands / software engineering agent',
    prompt_hint: '软件工程动作先过 scope、ProposedAction、失败签名和结果摘要。',
  },
  'swe-agent': {
    label: 'SWE-agent / repo repair agent',
    prompt_hint: '补丁和测试循环前先读取失败签名、工作目录和验证路线。',
  },
  aider: {
    label: 'Aider / pair programming agent',
    prompt_hint: '编辑文件前先 route，执行后写 ToolResultSummary 和 changed_files 摘要。',
  },
  cline: {
    label: 'Cline / VS Code agent',
    prompt_hint: '通过 MCP/CLI 接入路线、工具闸门和高风险审批。',
  },
  'roo-code': {
    label: 'Roo Code / VS Code agent',
    prompt_hint: 'IDE 工具调用前先生成 ProposedAction，高风险动作等待确认。',
  },
  continue: {
    label: 'Continue / IDE coding assistant',
    prompt_hint: '把 FAME prompt、route CLI 和结果摘要接入自定义助手工作流。',
  },
  langgraph: {
    label: 'LangGraph / workflow agent',
    prompt_hint: '把 ContextPack 放入 state，把工程记忆 overlay 映射到 checkpoint/store。',
  },
  autogen: {
    label: 'AutoGen / multi-agent framework',
    prompt_hint: '多 Agent 协作前统一 route、scope、tool contract 和 summary。',
  },
  crewai: {
    label: 'CrewAI / role-based multi-agent framework',
    prompt_hint: '每个 task/tool 前置 FAME 工具动作契约和结果摘要。',
  },
  dify: {
    label: 'Dify / workflow-agent platform',
    prompt_hint: '在 workflow/agent 节点前调用 route:chinese-open --compact。',
  },
  generic: {
    label: 'Generic local agent',
    prompt_hint: '读取 QUICKSTART_AGENT.md，并把 compact route 输出作为工具前置决策。',
  },
  other: {
    label: 'Other custom agent',
    prompt_hint: '适合 OpenClaw、Hermes/爱马仕或任何新工具型 Agent；统一遵守 FAME 接入协议。',
  },
}

function parseArgs(argv) {
  const args = {
    agent: 'codex',
    agent_name: '',
    goal: '本机 Agent 接入中文开源版',
    json: false,
    run_doctor: false,
    run_eval: false,
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
    'connect:chinese-open',
    '--expected-output',
    'connected 或 not_connected 状态',
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
    'versions/chinese-open/QUICKSTART_AGENT.md',
    'versions/chinese-open/docs/07_Agent协议与最小接入.md',
    'versions/chinese-open/docs/09_实机评测报告.md',
    'scripts/chinese-open-route.mjs',
    'scripts/chinese-open-doctor.mjs',
    'scripts/chinese-open-real-eval.mjs',
  ]
  const missing = requiredFiles.filter((file) => !exists(file))
  const route = compactRoute(args.goal)
  const checks = [
    {
      id: 'required_files',
      ok: missing.length === 0,
      detail: missing.length === 0 ? `checked ${requiredFiles.length}` : `missing ${missing.join(', ')}`,
    },
    {
      id: 'route_compact',
      ok: route.scenario === 'scenario-local-agent-connect-check',
      detail: route.scenario,
    },
  ]

  if (args.run_doctor) {
    const doctor = runNpm('doctor:chinese-open')
    checks.push({ id: 'doctor', ok: doctor.ok, detail: doctor.ok ? `ok in ${doctor.ms}ms` : doctor.error })
  }

  if (args.run_eval) {
    const realEval = runNpm('eval:chinese-open')
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
    edition_id: 'chinese-open',
    kind: 'local_agent_connect',
    agent: {
      id: args.agent,
      label: customLabel,
      custom_name: args.agent_name || undefined,
      prompt_hint: profile.prompt_hint,
    },
    status: connected ? 'connected' : 'not_connected',
    blockers,
    checks,
    route_decision: route,
    next_command: connected
      ? 'npm run route:chinese-open -- --goal "<用户目标>" --compact'
      : 'npm run doctor:chinese-open && npm run eval:chinese-open',
    prompt_preview: prompt.ok ? firstLines(prompt.output, 8) : [],
  }
}

function printHelp() {
  console.log(`Usage:
  npm run connect:chinese-open -- --agent codex
  npm run connect:chinese-open -- --agent cursor --json
  npm run connect:chinese-open -- --agent claude-desktop --run-doctor
  npm run connect:chinese-open -- --agent openhands --json
  npm run connect:chinese-open -- --agent other --agent-name OpenClaw
  npm run connect:chinese-open -- --agent generic --run-doctor --run-eval

Options:
  --agent        codex | cursor | claude-desktop | claude-code | openai-agents | gemini-cli | openhands | swe-agent | aider | cline | roo-code | continue | langgraph | autogen | crewai | dify | generic | other
  --agent-name   自定义 Agent 名称，配合 --agent other
  --goal         用于本机 Agent 接入检查的目标文本
  --json         输出 JSON
  --run-doctor   顺手运行 doctor:chinese-open
  --run-eval     顺手运行 eval:chinese-open`)
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
    console.log(`# FAME 中文开源版本机 Agent 接入`)
    console.log(`Agent: ${result.agent.label}`)
    console.log(`Status: ${result.status}`)
    if (result.blockers.length > 0) {
      console.log(`Blockers:`)
      for (const blocker of result.blockers) console.log(`- ${blocker}`)
    }
    console.log(`Next: ${result.next_command}`)
    console.log(`Hint: ${result.agent.prompt_hint}`)
  }
  if (!result.ok) process.exit(1)
} catch (error) {
  console.error(JSON.stringify({ ok: false, kind: 'local_agent_connect', error: error.message }, null, 2))
  process.exit(1)
}
