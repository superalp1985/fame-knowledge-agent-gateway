import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { extname, join, relative } from 'node:path'

const projectRoot = process.cwd()

const scanRoots = [
  '.env.example',
  '.github',
  'README.md',
  'AGENTS.md',
  'SECURITY.md',
  'CONTRIBUTING.md',
  'LICENSE',
  'Dockerfile',
  'docker-compose.yml',
  '.dockerignore',
  'start.ps1',
  'start.bat',
  'package.json',
  'docs',
  'examples',
  'scripts',
  'scripts/check-chinese-open.mjs',
  'scripts/chinese-open-route.mjs',
  'scripts/chinese-open-connect.mjs',
  'scripts/chinese-open-doctor.mjs',
  'scripts/chinese-open-real-eval.mjs',
  'scripts/english-route.mjs',
  'scripts/english-connect.mjs',
  'scripts/english-doctor.mjs',
  'scripts/english-real-eval.mjs',
  'scripts/check-english.mjs',
  'scripts/check-edition-alignment.mjs',
  'scripts/start-all.mjs',
  'scripts/package-portable.mjs',
  'scripts/sync-english-edition.mjs',
  'scripts/sample-chinese-open-data-sources.mjs',
  'scripts/build-openalex-candidates.mjs',
  'runtime_server',
  'workbench/src',
  'workbench/scripts',
  'workbench/package.json',
  'knowledge',
  'versions',
  'asset_store',
  'memory',
  '方案设计',
]

const ignoredDirs = new Set([
  'node_modules',
  'dist',
  'build',
  '.git',
  '.cache',
  'runtime_store',
  'knowledge_backup',
  'workbench/src/generated',
  'workbench/public/generated',
  'workbench/node_modules',
  'workbench/dist',
])

const textExtensions = new Set([
  '',
  '.css',
  '.csv',
  '.html',
  '.js',
  '.json',
  '.jsonl',
  '.md',
  '.mjs',
  '.svg',
  '.ts',
  '.tsx',
  '.txt',
  '.yaml',
  '.yml',
])

const maxFileBytes = 5 * 1024 * 1024

const allowList = [
  'dev-fame-agent-key',
  'dev-fame-approval-secret-change-me',
  'change-me-before-real-use',
  'knowledge_backup/',
  'process.env.FAME_GATEWAY_DEV_API_KEY',
  'process.env.FAME_MCP_API_KEY',
  'process.env.FAME_APPROVAL_SECRET',
  'args.api_key',
  'defaultApiKey',
  'apiKey = extractApiKeyFromHeaders(req.headers)',
  '$env:FAME_KNOWLEDGE_SOURCE',
  'http://127.0.0.1',
  'https://',
  'fame://',
  'mcp://',
]

const checks = [
  {
    id: 'openai_key',
    severity: 'error',
    regex: /(?<![A-Za-z0-9])sk-(?:proj-)?[A-Za-z0-9_-]{16,}/g,
    message: 'Possible OpenAI-style API key.',
  },
  {
    id: 'private_key',
    severity: 'error',
    regex: /-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----/g,
    message: 'Private key material found.',
  },
  {
    id: 'local_windows_path',
    severity: 'error',
    regex: /(?<![A-Za-z0-9+.-])[A-Za-z]:[\\/][^\r\n`"'<>]*/g,
    message: 'Local Windows absolute path found.',
  },
  {
    id: 'local_home_path',
    severity: 'error',
    regex: /(?:\/Users|\/home)\/[^\s`"'<>]+/g,
    message: 'Local user home path found.',
  },
  {
    id: 'generic_secret_assignment',
    severity: 'warn',
    regex:
      /(?:api[_-]?key|access[_-]?key|secret[_-]?key|client[_-]?secret|auth[_-]?token|access[_-]?token|refresh[_-]?token|password|passwd|pwd)\s*[:=]\s*["']?[^"',\s}]{12,}/gi,
    message: 'Secret-like assignment found. Confirm it is an example placeholder.',
  },
]

function normalizeRel(file) {
  return relative(projectRoot, file).replace(/\\/g, '/')
}

function shouldSkipDir(name) {
  return ignoredDirs.has(name)
}

function isTextFile(file) {
  return textExtensions.has(extname(file).toLowerCase())
}

function readTextIfExists(file) {
  const full = join(projectRoot, file)
  if (!existsSync(full)) return ''
  return readFileSync(full, 'utf8')
}

function listFiles(entry) {
  const full = join(projectRoot, entry)
  if (!existsSync(full)) return []
  const stat = statSync(full)
  if (stat.isFile()) return [full]
  const result = []
  function walk(dir) {
    for (const item of readdirSync(dir, { withFileTypes: true })) {
      const child = join(dir, item.name)
      const rel = normalizeRel(child)
      if (item.isDirectory()) {
        if (!shouldSkipDir(item.name) && !ignoredDirs.has(rel)) walk(child)
        continue
      }
      if (item.isFile()) result.push(child)
    }
  }
  walk(full)
  return result
}

function allowed(match) {
  return allowList.some((item) => match.includes(item))
}

function addFinding(findings, severity, check, file, line, message, excerpt) {
  findings.push({ severity, check, file, line, message, excerpt })
}

const findings = []
const scannedFiles = []

for (const root of scanRoots) {
  for (const file of listFiles(root)) {
    const stat = statSync(file)
    if (!isTextFile(file) || stat.size > maxFileBytes) continue
    const rel = normalizeRel(file)
    const text = readFileSync(file, 'utf8')
    scannedFiles.push(rel)
    for (const check of checks) {
      for (const match of text.matchAll(check.regex)) {
        const value = match[0]
        if (allowed(value)) continue
        const before = text.slice(0, match.index)
        const line = before.split(/\r?\n/).length
        addFinding(findings, check.severity, check.id, rel, line, check.message, value.slice(0, 160))
      }
    }
  }
}

const requiredFiles = [
  'README.md',
  'LICENSE',
  'SECURITY.md',
  'CONTRIBUTING.md',
  'docs/runtime-gateway.md',
  'docs/使用手册.zh-CN.md',
  'docs/USER_GUIDE.en.md',
  'docs/deployment.md',
  'docs/api-reference.md',
  'docs/mcp-integration.md',
  'docs/release-checklist.md',
  '.github/workflows/ci.yml',
  '.github/workflows/release.yml',
  'Dockerfile',
  'docker-compose.yml',
  '.dockerignore',
  'start.ps1',
  'start.bat',
  'scripts/start-all.mjs',
  'scripts/package-portable.mjs',
  'scripts/install-release.ps1',
  'scripts/build-release-assets.mjs',
  'scripts/english-route.mjs',
  'scripts/english-connect.mjs',
  'scripts/english-doctor.mjs',
  'scripts/english-real-eval.mjs',
  'scripts/check-english.mjs',
  'scripts/check-edition-alignment.mjs',
  'scripts/sync-english-edition.mjs',
]

for (const file of requiredFiles) {
  if (!existsSync(join(projectRoot, file))) {
    addFinding(findings, 'error', 'required_file', file, 1, 'Required open-source release file is missing.', file)
  }
}

const licenseText = readTextIfExists('LICENSE')
if (!licenseText.includes('Apache License') || !licenseText.includes('Version 2.0')) {
  addFinding(findings, 'error', 'license_policy', 'LICENSE', 1, 'Project license must be Apache License 2.0.', 'Apache License 2.0')
}

const rootPackage = JSON.parse(readTextIfExists('package.json') || '{}')
if (rootPackage.license !== 'Apache-2.0') {
  addFinding(
    findings,
    'error',
    'license_policy',
    'package.json',
    1,
    'Root package license must be Apache-2.0.',
    String(rootPackage.license ?? '(missing)'),
  )
}

const packageFiles = ['workbench/package.json', 'runtime_server/package.json']
for (const file of packageFiles) {
  const packageJson = JSON.parse(readTextIfExists(file) || '{}')
  if (packageJson.license !== 'Apache-2.0') {
    addFinding(
      findings,
      'error',
      'license_policy',
      file,
      1,
      'Package license must be Apache-2.0.',
      String(packageJson.license ?? '(missing)'),
    )
  }
}

const requiredEditionFiles = [
  'versions/README.md',
  'versions/chinese/README.md',
  'versions/chinese-open/README.md',
  'versions/chinese-open/QUICKSTART_AGENT.md',
  'versions/chinese-open/docs/00_定位与建设规则.md',
  'versions/chinese-open/docs/01_权威来源与许可证登记.md',
  'versions/chinese-open/docs/02_知识网录入规范.md',
  'versions/chinese-open/docs/03_工程记忆案例录入规范.md',
  'versions/chinese-open/docs/04_Agent接入工作流.md',
  'versions/chinese-open/docs/05_开源贡献流程.md',
  'versions/chinese-open/docs/06_成熟数据源导入策略.md',
  'versions/chinese-open/docs/07_Agent协议与最小接入.md',
  'versions/chinese-open/docs/08_常见Agent接入片段.md',
  'versions/chinese-open/docs/09_实机评测报告.md',
  'versions/chinese-open/docs/roadmap.md',
  'versions/chinese-open/examples/README.md',
  'versions/chinese-open/examples/external-agent-bootstrap.md',
  'versions/chinese-open/examples/route-output.example.json',
  'versions/chinese-open/examples/tool-result-summary.example.json',
  'versions/chinese-open/golden-tasks/tool-stability.golden.json',
  'versions/chinese-open/knowledge/README.md',
  'versions/chinese-open/knowledge/graph.schema.json',
  'versions/chinese-open/knowledge/graph.seed.json',
  'versions/chinese-open/knowledge/route_index.json',
  'versions/chinese-open/knowledge/source_registry.json',
  'versions/chinese-open/knowledge/language-tree-hub/README.md',
  'versions/chinese-open/knowledge/language-tree-hub/core.json',
  'versions/chinese-open/knowledge/language-tree-hub/thought_modes.json',
  'versions/chinese-open/knowledge/language-tree-hub/intent_patterns.json',
  'versions/chinese-open/knowledge/language-tree-hub/association_rules.json',
  'versions/chinese-open/knowledge/language-tree-hub/association_playbooks.json',
  'versions/chinese-open/knowledge/language-tree-hub/abstraction_playbooks.json',
  'versions/chinese-open/knowledge/language-tree-hub/lexicon_seed.json',
  'versions/chinese-open/knowledge/logic/taxonomy.json',
  'versions/chinese-open/knowledge/logic/reasoning_methods.json',
  'versions/chinese-open/knowledge/logic/argument_patterns.json',
  'versions/chinese-open/knowledge/logic/fallacy_patterns.json',
  'versions/chinese-open/knowledge/logic/validation_checklists.json',
  'versions/chinese-open/knowledge/mathematics/taxonomy.json',
  'versions/chinese-open/knowledge/mathematics/methods.json',
  'versions/chinese-open/knowledge/mathematics/modeling_patterns.json',
  'versions/chinese-open/knowledge/mathematics/validation_checklists.json',
  'versions/chinese-open/knowledge/computer-science/taxonomy.json',
  'versions/chinese-open/knowledge/computer-science/engineering_methods.json',
  'versions/chinese-open/knowledge/computer-science/system_patterns.json',
  'versions/chinese-open/knowledge/computer-science/validation_checklists.json',
  'versions/chinese-open/knowledge/agent-tooling/taxonomy.json',
  'versions/chinese-open/knowledge/agent-tooling/action.schema.json',
  'versions/chinese-open/knowledge/agent-tooling/context_pack.schema.json',
  'versions/chinese-open/knowledge/agent-tooling/action_templates.json',
  'versions/chinese-open/knowledge/agent-tooling/operation_playbooks.json',
  'versions/chinese-open/knowledge/agent-tooling/tool_gateway_policies.json',
  'versions/chinese-open/knowledge/agent-tooling/result_summary_patterns.json',
  'versions/chinese-open/knowledge/agent-tooling/stability_scenarios.json',
  'versions/chinese-open/knowledge/agent-tooling/tool_call_failure_patterns.json',
  'versions/chinese-open/knowledge/agent-tooling/critical_error_domains.json',
  'versions/chinese-open/knowledge/agent-tooling/reflection_patterns.json',
  'versions/chinese-open/knowledge/agent-tooling/evaluation_metrics.json',
  'versions/chinese-open/knowledge/powershell-safety/taxonomy.json',
  'versions/chinese-open/knowledge/powershell-safety/command_review_flow.json',
  'versions/chinese-open/knowledge/powershell-safety/risk_matrix.json',
  'versions/chinese-open/knowledge/powershell-safety/safe_command_patterns.json',
  'versions/chinese-open/knowledge/powershell-safety/command_review_checklist.json',
  'versions/chinese-open/knowledge/powershell-safety/do_not_patterns.json',
  'versions/chinese-open/knowledge/powershell-safety/failure_patterns.json',
  'versions/chinese-open/knowledge/rules/agent_tool_governance.json',
  'versions/chinese-open/knowledge/rules/powershell_safety.json',
  'versions/chinese-open/knowledge/database/content_units.jsonl',
  'versions/chinese-open/knowledge/database/content_index.json',
  'versions/chinese-open/knowledge/database/data_sources.json',
  'versions/chinese-open/knowledge/database/samples/README.md',
  'versions/chinese-open/knowledge/database/candidates/README.md',
  'versions/chinese-open/knowledge/indexes/subject_index.json',
  'versions/chinese-open/knowledge/indexes/alias_index.json',
  'versions/chinese-open/knowledge/indexes/scoping_index.json',
  'versions/chinese-open/tests/agent-effect-smoke.mjs',
  'versions/chinese-open/project-memory-cases/case.schema.json',
  'versions/english/README.md',
  'versions/english/QUICKSTART_AGENT.md',
  'versions/english/docs/agent-protocol.md',
  'versions/english/docs/common-agent-snippets.md',
  'versions/english/docs/real-evaluation-report.md',
  'versions/english/docs/roadmap.md',
  'versions/english/examples/README.md',
  'versions/english/examples/external-agent-bootstrap.md',
  'versions/english/examples/route-output.example.json',
  'versions/english/examples/tool-result-summary.example.json',
  'versions/english/golden-tasks/tool-stability.golden.json',
  'versions/english/knowledge/README.md',
  'versions/english/knowledge/graph.schema.json',
  'versions/english/knowledge/graph.seed.json',
  'versions/english/knowledge/source_registry.json',
  'versions/english/knowledge/language-tree-hub/core.json',
  'versions/english/knowledge/language-tree-hub/thought_modes.json',
  'versions/english/knowledge/language-tree-hub/intent_patterns.json',
  'versions/english/knowledge/language-tree-hub/association_rules.json',
  'versions/english/knowledge/language-tree-hub/association_playbooks.json',
  'versions/english/knowledge/language-tree-hub/abstraction_playbooks.json',
  'versions/english/knowledge/language-tree-hub/lexicon_seed.json',
  'versions/english/knowledge/language-tree-hub/routes.json',
  'versions/english/knowledge/logic/taxonomy.json',
  'versions/english/knowledge/mathematics/taxonomy.json',
  'versions/english/knowledge/computer-science/taxonomy.json',
  'versions/english/knowledge/agent-tooling/stability_scenarios.json',
  'versions/english/knowledge/agent-tooling/tool_gateway_policies.json',
  'versions/english/knowledge/powershell-safety/taxonomy.json',
  'versions/english/knowledge/database/content_units.jsonl',
  'versions/english/knowledge/indexes/subject_index.json',
  'versions/english/knowledge/indexes/alias_index.json',
  'versions/english/knowledge/indexes/scoping_index.json',
  'versions/english/knowledge/professional-knowledge/programming/placeholder.json',
  'versions/english/knowledge/professional-knowledge/design/placeholder.json',
  'versions/english/knowledge/route_index.json',
  'versions/english/tests/agent-effect-smoke.mjs',
]

for (const file of requiredEditionFiles) {
  if (!existsSync(join(projectRoot, file))) {
    addFinding(findings, 'error', 'required_edition_file', file, 1, 'Required edition file is missing.', file)
  }
}

const errors = findings.filter((item) => item.severity === 'error')
const warnings = findings.filter((item) => item.severity === 'warn')

console.log(
  JSON.stringify(
    {
      ok: errors.length === 0,
      scanned_files: scannedFiles.length,
      errors: errors.length,
      warnings: warnings.length,
      findings,
    },
    null,
    2,
  ),
)

if (errors.length > 0) process.exit(1)
