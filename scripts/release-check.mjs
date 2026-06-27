import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { extname, join, relative } from 'node:path'

const projectRoot = process.cwd()

const scanRoots = [
  '.env.example',
  '.github',
  'README.md',
  'SECURITY.md',
  'CONTRIBUTING.md',
  'LICENSE',
  'package.json',
  'docs',
  'examples',
  'scripts',
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
  'docs/deployment.md',
  'docs/api-reference.md',
  'docs/mcp-integration.md',
  'docs/release-checklist.md',
  '.github/workflows/ci.yml',
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
  'versions/english/README.md',
  'versions/english/docs/roadmap.md',
  'versions/english/knowledge/README.md',
  'versions/english/knowledge/language-tree-hub/core.json',
  'versions/english/knowledge/language-tree-hub/routes.json',
  'versions/english/knowledge/professional-knowledge/programming/placeholder.json',
  'versions/english/knowledge/professional-knowledge/design/placeholder.json',
  'versions/english/knowledge/route_index.json',
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
