import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs'
import { basename, dirname, extname, join, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptDir = dirname(fileURLToPath(import.meta.url))
const projectRoot = resolve(scriptDir, '..')
const sourceRoot = join(projectRoot, 'knowledge_backup')
const targetRoot = join(projectRoot, 'knowledge')

const allowedExtensions = new Set(['.md', '.markdown', '.yaml', '.yml', '.json', '.jsonl', '.txt', '.csv'])
const maxTextFileBytes = 3 * 1024 * 1024

const ignoredDirs = new Set([
  '.git',
  '.cache',
  '.pytest_cache',
  '.ruff_cache',
  '.mypy_cache',
  '.ipynb_checkpoints',
  '__pycache__',
  'node_modules',
  'dist',
  'build',
  'outputs',
  'cache',
  'backups',
  'leaderboard_runs',
  'results',
  'training_data',
  'ceval',
  'eval',
  'fineval',
  'vendor',
  'exports',
  'hf_cache',
  'wandb',
  '.wandb',
  'venv',
  '.venv',
  'env',
  '.env',
])

const ignoredFileNames = new Set([
  '.env',
  '.env.local',
  'settings.json',
  'credentials.json',
  'package-lock.json',
  'yarn.lock',
  'pnpm-lock.yaml',
  'err.txt',
  'out.txt',
])

const ignoredFilePrefixes = ['tmp_', 'pk_', 'result_', 'round']
const ignoredPathFragments = [
  '/agent/data/',
  '/private/',
  '/secrets/',
  '/credentials/',
  '/local_settings/',
  '/agent/vendor/',
  '/agent/exports/',
  '/sparsity/hf_cache/',
  '/hf_cache/',
]

const report = {
  generatedAt: new Date().toISOString(),
  source: relative(projectRoot, sourceRoot).replace(/\\/g, '/'),
  target: relative(projectRoot, targetRoot).replace(/\\/g, '/'),
  copiedFiles: 0,
  copiedBytes: 0,
  copiedByExtension: {},
  skippedFiles: 0,
  skippedByReason: {},
  redactions: {},
  roots: {},
  warnings: [
    'This is a sanitized public knowledge base prepared from local knowledge_backup.',
    'Run a dedicated secret scan and license review before publishing a release.',
    'Generated reports are evidence, not a legal or security guarantee.',
  ],
}

const manifest = []

function addSkipped(reason) {
  report.skippedFiles += 1
  report.skippedByReason[reason] = (report.skippedByReason[reason] ?? 0) + 1
}

function addRedaction(name, count) {
  if (count <= 0) return
  report.redactions[name] = (report.redactions[name] ?? 0) + count
}

function assertSafeTarget() {
  const resolvedProject = resolve(projectRoot)
  const resolvedTarget = resolve(targetRoot)
  if (basename(resolvedTarget) !== 'knowledge') {
    throw new Error(`Refusing to clean unexpected target: ${resolvedTarget}`)
  }
  if (!resolvedTarget.startsWith(`${resolvedProject}${sep}`)) {
    throw new Error(`Refusing to clean outside project root: ${resolvedTarget}`)
  }
}

function normalizeRel(value) {
  return value.replace(/\\/g, '/')
}

function shouldSkipFileName(fileName) {
  const lower = fileName.toLowerCase()
  if (ignoredFileNames.has(lower)) return true
  return ignoredFilePrefixes.some((prefix) => lower.startsWith(prefix))
}

function shouldSkipRelPath(relPath) {
  const normalized = `/${normalizeRel(relPath).toLowerCase()}/`
  return ignoredPathFragments.some((fragment) => normalized.includes(fragment))
}

function redactText(input) {
  let text = input
  const replacements = [
    {
      name: 'openai_style_key',
      regex: /sk-(?:proj-)?[A-Za-z0-9_-]{16,}/g,
      replacement: '[REDACTED_API_KEY]',
    },
    {
      name: 'bearer_token',
      regex: /(bearer\s+)[A-Za-z0-9._~+/=-]{16,}/gi,
      replacement: '$1[REDACTED_TOKEN]',
    },
    {
      name: 'key_value_secret',
      regex:
        /((?:^|[{\s,"'])(?:api[_-]?key|access[_-]?key|secret[_-]?key|client[_-]?secret|auth[_-]?token|access[_-]?token|refresh[_-]?token|id[_-]?token|bearer[_-]?token|token|password|passwd|pwd)(?:["'\s:=]+))([^"',\s}]+)/gim,
      replacement: '$1[REDACTED]',
    },
    {
      name: 'private_api_url',
      regex: /((?:base_url|api_url|endpoint)(?:["'\s:=]+))(https?:\/\/[^\s"',}]+)/gi,
      replacement: '$1[REDACTED_URL]',
    },
    {
      name: 'authorization_header',
      regex: /((?:authorization|x-api-key)(?:["'\s:=]+))([^"',\s}]+)/gi,
      replacement: '$1[REDACTED]',
    },
    {
      name: 'local_windows_path',
      regex: /(?:external:)?[A-Za-z]:[\\/][^\r\n`"'<>]*/g,
      replacement: '[REDACTED_LOCAL_PATH]',
    },
    {
      name: 'local_user_home',
      regex: /(?:\/Users|\/home)\/[^\s`"'<>]+/g,
      replacement: '[REDACTED_LOCAL_PATH]',
    },
    {
      name: 'personal_name_cn',
      regex: /王秉钦/g,
      replacement: '[REDACTED_AUTHOR]',
    },
  ]

  for (const item of replacements) {
    let count = 0
    text = text.replace(item.regex, (...args) => {
      count += 1
      return item.replacement.replace(/\$(\d+)/g, (_, index) => args[Number(index)] ?? '')
    })
    addRedaction(item.name, count)
  }

  return text
}

function copyKnowledgeFile(sourceFile) {
  const relPath = normalizeRel(relative(sourceRoot, sourceFile))
  const ext = extname(sourceFile).toLowerCase()
  const fileName = basename(sourceFile)
  const size = statSync(sourceFile).size

  if (!allowedExtensions.has(ext)) {
    addSkipped('extension_not_public_text')
    return
  }
  if (shouldSkipFileName(fileName)) {
    addSkipped('file_name_blocked')
    return
  }
  if (shouldSkipRelPath(relPath)) {
    addSkipped('path_fragment_blocked')
    return
  }
  if (size > maxTextFileBytes) {
    addSkipped('text_file_too_large')
    return
  }

  const targetFile = join(targetRoot, relPath)
  mkdirSync(dirname(targetFile), { recursive: true })

  const content = readFileSync(sourceFile, 'utf8').replace(/^\uFEFF/, '')
  const sanitized = redactText(content)
  writeFileSync(targetFile, sanitized, 'utf8')

  const rootName = relPath.split('/')[0] || '(root)'
  report.roots[rootName] = (report.roots[rootName] ?? 0) + 1
  report.copiedFiles += 1
  report.copiedBytes += Buffer.byteLength(sanitized, 'utf8')
  report.copiedByExtension[ext || '(none)'] = (report.copiedByExtension[ext || '(none)'] ?? 0) + 1
  manifest.push({
    path: relPath,
    extension: ext || '(none)',
    bytes: Buffer.byteLength(sanitized, 'utf8'),
    root: rootName,
  })
}

function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name)
    if (entry.isDirectory()) {
      if (ignoredDirs.has(entry.name.toLowerCase())) {
        addSkipped('directory_blocked')
        continue
      }
      walk(fullPath)
      continue
    }
    if (entry.isFile()) copyKnowledgeFile(fullPath)
  }
}

function writeReadme() {
  const readme = `# Public Knowledge Base

This directory is the sanitized public base of the FAME / 建木 knowledge net.

It is intentionally separate from \`knowledge_backup/\`:

- \`knowledge/\` is meant to be committed and improved by the open-source community.
- \`knowledge_backup/\` is local/private and may contain generated artifacts, settings, datasets, caches, or secrets.

The public base keeps readable knowledge-route materials such as Markdown, YAML, JSON, JSONL, TXT, and CSV files after path filtering and basic secret redaction.

## Scope

The workbench indexes this directory by default:

\`\`\`text
knowledge/
-> knowledge roots
-> subject / route shards
-> file entries
-> headings, excerpts, keywords
\`\`\`

Large generated artifacts, caches, benchmark runs, private settings, and training/evaluation datasets are excluded from this public base.

## Refreshing From Local Backup

\`\`\`bash
npm run prepare:public-knowledge
npm run generate:knowledge
\`\`\`

Before publishing a release, run a dedicated secret scan and license review.
`
  writeFileSync(join(targetRoot, 'README.md'), readme, 'utf8')
}

function writeReports() {
  manifest.sort((a, b) => a.path.localeCompare(b.path))
  writeFileSync(join(targetRoot, 'PUBLIC_KNOWLEDGE_MANIFEST.json'), `${JSON.stringify(manifest, null, 2)}\n`, 'utf8')
  writeFileSync(join(targetRoot, '.sanitize-report.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8')

  const markdown = `# Public Knowledge Sanitize Report

Generated at: ${report.generatedAt}

Source: \`${report.source}\`  
Target: \`${report.target}\`

## Summary

- Copied files: ${report.copiedFiles}
- Copied bytes: ${report.copiedBytes}
- Skipped files/events: ${report.skippedFiles}

## Copied By Root

${Object.entries(report.roots)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([name, count]) => `- \`${name}\`: ${count}`)
  .join('\n')}

## Copied By Extension

${Object.entries(report.copiedByExtension)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([name, count]) => `- \`${name}\`: ${count}`)
  .join('\n')}

## Skipped By Reason

${Object.entries(report.skippedByReason)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([name, count]) => `- \`${name}\`: ${count}`)
  .join('\n')}

## Redactions

${
  Object.keys(report.redactions).length > 0
    ? Object.entries(report.redactions)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([name, count]) => `- \`${name}\`: ${count}`)
        .join('\n')
    : '- No pattern-based redactions were applied.'
}

## Notes

${report.warnings.map((warning) => `- ${warning}`).join('\n')}
`
  writeFileSync(join(targetRoot, 'SANITIZE_REPORT.md'), markdown, 'utf8')
}

if (!existsSync(sourceRoot)) {
  throw new Error(`Missing local source folder: ${sourceRoot}`)
}

assertSafeTarget()
rmSync(targetRoot, { recursive: true, force: true })
mkdirSync(targetRoot, { recursive: true })
walk(sourceRoot)
writeReadme()
writeReports()

console.log(
  `Prepared ${normalizeRel(relative(projectRoot, targetRoot))} with ${report.copiedFiles} files, ${report.skippedFiles} skipped events, ${Object.values(report.redactions).reduce((sum, count) => sum + count, 0)} redactions.`,
)
