import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const projectRoot = process.cwd()
const releaseRoot = path.join(projectRoot, '.tmp', 'release')
const stageName = 'fame-knowledge-agent-gateway-portable'
const stageRoot = path.join(releaseRoot, stageName)
const zipPath = path.join(releaseRoot, `${stageName}.zip`)

const includeEntries = [
  '.env.example',
  '.editorconfig',
  '.gitattributes',
  '.gitignore',
  'AGENTS.md',
  'CONTRIBUTING.md',
  'Dockerfile',
  'LICENSE',
  'NOTICE',
  'README.md',
  'SECURITY.md',
  'docker-compose.yml',
  '.dockerignore',
  'package.json',
  'start.bat',
  'start.ps1',
  'docs',
  'examples',
  'knowledge',
  'scripts',
  'runtime_server',
  'versions',
  'workbench',
  'asset_store',
  'memory',
]

const excludedNames = new Set([
  '.git',
  '.tmp',
  'node_modules',
  'dist',
  'build',
  '.cache',
  'runtime_store',
  'knowledge_backup',
  'logs',
])

const excludedRelative = new Set([
  'workbench/src/generated',
  'workbench/public/generated',
  'workbench/node_modules',
  'workbench/dist',
])

function normalize(file) {
  return path.relative(projectRoot, file).replace(/\\/g, '/')
}

function shouldSkip(source) {
  const rel = normalize(source)
  if (excludedRelative.has(rel)) return true
  return source.split(path.sep).some((part) => excludedNames.has(part))
}

function copyRecursive(source, target) {
  if (!fs.existsSync(source) || shouldSkip(source)) return
  const stat = fs.statSync(source)
  if (stat.isDirectory()) {
    fs.mkdirSync(target, { recursive: true })
    for (const item of fs.readdirSync(source)) {
      copyRecursive(path.join(source, item), path.join(target, item))
    }
    return
  }
  fs.mkdirSync(path.dirname(target), { recursive: true })
  fs.copyFileSync(source, target)
}

function run(command, args) {
  if (process.platform === 'win32' && (command === 'npm' || command === 'npm.cmd')) {
    execFileSync('cmd.exe', ['/d', '/s', '/c', ['npm', ...args].join(' ')], { cwd: projectRoot, stdio: 'inherit' })
    return
  }
  execFileSync(command, args, { cwd: projectRoot, stdio: 'inherit' })
}

function main() {
  fs.rmSync(stageRoot, { recursive: true, force: true })
  fs.rmSync(zipPath, { force: true })
  fs.mkdirSync(stageRoot, { recursive: true })

  run('npm', ['run', 'check:editions'])
  run('npm', ['run', 'check:english'])
  run('npm', ['run', 'doctor:english'])
  run('npm', ['run', 'build'])

  for (const entry of includeEntries) {
    copyRecursive(path.join(projectRoot, entry), path.join(stageRoot, entry))
  }

  const manifest = {
    package: stageName,
    created_at: new Date().toISOString(),
    start: ['start.ps1', 'start.bat', 'npm run start'],
    checks: ['npm run check:chinese-open', 'npm run check:english', 'npm run check:editions'],
    license: 'Apache-2.0',
  }
  fs.writeFileSync(path.join(stageRoot, 'PORTABLE_MANIFEST.json'), `${JSON.stringify(manifest, null, 2)}\n`, 'utf8')

  if (process.platform === 'win32') {
    execFileSync('powershell', [
      '-NoProfile',
      '-Command',
      `Compress-Archive -LiteralPath '${stageRoot.replaceAll("'", "''")}' -DestinationPath '${zipPath.replaceAll("'", "''")}' -Force`,
    ], { cwd: projectRoot, stdio: 'inherit' })
  } else {
    execFileSync('zip', ['-r', zipPath, stageName], { cwd: releaseRoot, stdio: 'inherit' })
  }

  console.log(JSON.stringify({
    ok: true,
    stage: stageRoot,
    zip: zipPath,
    bytes: fs.statSync(zipPath).size,
  }, null, 2))
}

main()
