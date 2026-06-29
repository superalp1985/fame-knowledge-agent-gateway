import { spawn } from 'node:child_process'
import fs from 'node:fs'
import http from 'node:http'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const logsRoot = path.join(projectRoot, 'logs')
const host = process.env.FAME_START_HOST || process.env.FAME_GATEWAY_HOST || '127.0.0.1'
const gatewayPort = Number(process.env.FAME_GATEWAY_PORT || 5191)
const workbenchPort = Number(process.env.FAME_WORKBENCH_PORT || 5178)
const mode = process.env.FAME_START_MODE || 'dev'
const openBrowser = process.env.FAME_OPEN_BROWSER !== '0'
const install = process.env.FAME_SKIP_INSTALL !== '1'
const generate = process.env.FAME_SKIP_GENERATE !== '1'
const buildBeforePreview = process.env.FAME_BUILD_PREVIEW === '1'
const isWindows = process.platform === 'win32'
const npmCmd = 'npm'

function commandFor(command, args) {
  if (!isWindows) return { command, args }
  if (command !== 'npm') return { command, args }
  return {
    command: 'cmd.exe',
    args: ['/d', '/s', '/c', ['npm', ...args].join(' ')],
  }
}

fs.mkdirSync(logsRoot, { recursive: true })

function logLine(line) {
  const text = `[${new Date().toISOString()}] ${line}\n`
  process.stdout.write(text)
  fs.appendFileSync(path.join(logsRoot, 'startup.log'), text, 'utf8')
}

function runStep(label, command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const resolved = commandFor(command, args)
    logLine(`${label}: ${resolved.command} ${resolved.args.join(' ')}`)
    const child = spawn(resolved.command, resolved.args, {
      cwd: options.cwd ?? projectRoot,
      shell: false,
      stdio: ['ignore', 'pipe', 'pipe'],
      env: { ...process.env, ...options.env },
    })
    const logFile = fs.createWriteStream(path.join(logsRoot, `${label}.log`), { flags: 'a' })
    child.stdout.on('data', (chunk) => {
      process.stdout.write(chunk)
      logFile.write(chunk)
    })
    child.stderr.on('data', (chunk) => {
      process.stderr.write(chunk)
      logFile.write(chunk)
    })
    child.on('error', reject)
    child.on('exit', (code) => {
      logFile.end()
      if (code === 0) resolve()
      else reject(new Error(`${label} exited with ${code}`))
    })
  })
}

function startService(label, command, args, options = {}) {
  const resolved = commandFor(command, args)
  logLine(`${label}: ${resolved.command} ${resolved.args.join(' ')}`)
  const out = fs.openSync(path.join(logsRoot, `${label}.log`), 'a')
  const child = spawn(resolved.command, resolved.args, {
    cwd: options.cwd ?? projectRoot,
    shell: false,
    stdio: ['ignore', out, out],
    env: { ...process.env, ...options.env },
  })
  child.on('exit', (code) => logLine(`${label} exited with ${code}`))
  child.on('error', (error) => logLine(`${label} error: ${error.message}`))
  return child
}

function waitForHttp(url, timeoutMs = 30000) {
  const started = Date.now()
  return new Promise((resolve, reject) => {
    function tick() {
      const req = http.get(url, (res) => {
        res.resume()
        if ((res.statusCode ?? 500) < 500) resolve()
        else retry()
      })
      req.on('error', retry)
      req.setTimeout(1500, () => {
        req.destroy()
        retry()
      })
    }
    function retry() {
      if (Date.now() - started > timeoutMs) {
        reject(new Error(`Timed out waiting for ${url}`))
        return
      }
      setTimeout(tick, 700)
    }
    tick()
  })
}

function openUrl(url) {
  if (!openBrowser) return
  const command = isWindows ? 'cmd.exe' : process.platform === 'darwin' ? 'open' : 'xdg-open'
  const args = isWindows ? ['/d', '/s', '/c', 'start', '', url] : [url]
  try {
    spawn(command, args, { detached: true, stdio: 'ignore' }).unref()
  } catch (error) {
    logLine(`open browser failed: ${error.message}`)
  }
}

function ensureNodeVersion() {
  const major = Number(process.versions.node.split('.')[0])
  if (major < 24) throw new Error(`Node.js >= 24 is required. Current: ${process.version}`)
}

async function main() {
  ensureNodeVersion()
  logLine(`FAME startup mode=${mode} host=${host} workbench=${workbenchPort} gateway=${gatewayPort}`)

  if (install && !fs.existsSync(path.join(projectRoot, 'workbench', 'node_modules'))) {
    await runStep('install-workbench', npmCmd, ['ci', '--prefix', 'workbench'])
  }
  if (generate) await runStep('generate-all', npmCmd, ['run', 'generate:all'])
  if (mode === 'preview' || buildBeforePreview) await runStep('build-workbench', npmCmd, ['run', 'build'])

  const gateway = startService('runtime', npmCmd, ['run', 'gateway'], {
    env: {
      FAME_GATEWAY_HOST: host,
      FAME_GATEWAY_PORT: String(gatewayPort),
    },
  })

  const workbenchArgs = mode === 'preview'
    ? ['run', 'preview', '--prefix', 'workbench', '--', '--host', host, '--port', String(workbenchPort)]
    : ['run', 'dev', '--prefix', 'workbench', '--', '--host', host, '--port', String(workbenchPort)]
  const workbench = startService('workbench', npmCmd, workbenchArgs)

  const gatewayUrl = `http://${host}:${gatewayPort}/health`
  const workbenchUrl = `http://${host}:${workbenchPort}`
  await waitForHttp(gatewayUrl)
  await waitForHttp(workbenchUrl)
  logLine(`Gateway ready: ${gatewayUrl}`)
  logLine(`Workbench ready: ${workbenchUrl}`)
  openUrl(workbenchUrl)
  logLine('Press Ctrl+C to stop all services.')

  const stop = () => {
    logLine('Stopping services...')
    for (const child of [workbench, gateway]) {
      if (!child.killed) child.kill()
    }
    setTimeout(() => process.exit(0), 400)
  }
  process.on('SIGINT', stop)
  process.on('SIGTERM', stop)
}

main().catch((error) => {
  logLine(`startup failed: ${error.message}`)
  process.exit(1)
})
