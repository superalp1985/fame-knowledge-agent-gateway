import { execFileSync } from 'node:child_process'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

const projectRoot = process.cwd()
const releaseRoot = path.join(projectRoot, '.tmp', 'release')
const packageJson = JSON.parse(fs.readFileSync(path.join(projectRoot, 'package.json'), 'utf8'))
const version = packageJson.version
const repository = process.env.FAME_RELEASE_REPOSITORY || process.env.GITHUB_REPOSITORY || '__GITHUB_REPOSITORY__'
const portableName = 'fame-knowledge-agent-gateway-portable.zip'
const versionedName = `fame-knowledge-agent-gateway-v${version}-portable.zip`

function run(command, args) {
  if (process.platform === 'win32' && command === 'npm') {
    execFileSync('cmd.exe', ['/d', '/s', '/c', ['npm', ...args].join(' ')], { cwd: projectRoot, stdio: 'inherit' })
    return
  }
  execFileSync(command, args, { cwd: projectRoot, stdio: 'inherit' })
}

function sha256(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
}

function writeReleaseNotes(files) {
  const installUrl = repository === '__GITHUB_REPOSITORY__'
    ? 'https://github.com/<owner>/<repo>/releases/latest/download/install.ps1'
    : `https://github.com/${repository}/releases/latest/download/install.ps1`
  const portableUrl = repository === '__GITHUB_REPOSITORY__'
    ? `https://github.com/<owner>/<repo>/releases/latest/download/${versionedName}`
    : `https://github.com/${repository}/releases/latest/download/${versionedName}`

  const notes = `# FAME Knowledge Agent Gateway v${version}

## Windows one-click install

\`\`\`powershell
Invoke-WebRequest -Uri "${installUrl}" -OutFile "install.ps1"
powershell -NoProfile -ExecutionPolicy Bypass -File .\\install.ps1
\`\`\`

The installer prefers a non-system drive when one is available. To choose the location yourself:

\`\`\`powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\\install.ps1 -InstallDir "<install-path>"
\`\`\`

## Portable package

Download:

${portableUrl}

Then extract it and run:

\`\`\`powershell
.\\start.ps1
\`\`\`

## Release assets

${files.map((file) => `- ${path.basename(file)}`).join('\n')}
`
  fs.writeFileSync(path.join(releaseRoot, 'RELEASE_NOTES.md'), notes, 'utf8')
}

function main() {
  fs.mkdirSync(releaseRoot, { recursive: true })

  run('npm', ['run', 'release:check'])
  run('npm', ['run', 'package:portable'])

  const portablePath = path.join(releaseRoot, portableName)
  const versionedPath = path.join(releaseRoot, versionedName)
  fs.copyFileSync(portablePath, versionedPath)

  const hash = sha256(versionedPath)
  const checksumPath = `${versionedPath}.sha256`
  fs.writeFileSync(checksumPath, `${hash}  ${versionedName}\n`, 'utf8')

  const installerTemplate = fs.readFileSync(path.join(projectRoot, 'scripts', 'install-release.ps1'), 'utf8')
  const installerPath = path.join(releaseRoot, 'install.ps1')
  fs.writeFileSync(installerPath, installerTemplate.replaceAll('__GITHUB_REPOSITORY__', repository), 'utf8')

  const manifest = {
    ok: true,
    package: packageJson.name,
    version,
    repository,
    created_at: new Date().toISOString(),
    assets: [
      path.relative(projectRoot, versionedPath).replace(/\\/g, '/'),
      path.relative(projectRoot, checksumPath).replace(/\\/g, '/'),
      path.relative(projectRoot, installerPath).replace(/\\/g, '/'),
      '.tmp/release/release-assets.json',
    ],
    sha256: hash,
  }
  fs.writeFileSync(path.join(releaseRoot, 'release-assets.json'), `${JSON.stringify(manifest, null, 2)}\n`, 'utf8')
  writeReleaseNotes([versionedPath, checksumPath, installerPath, path.join(releaseRoot, 'release-assets.json')])
  console.log(JSON.stringify(manifest, null, 2))
}

main()
