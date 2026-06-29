import { execFileSync } from 'node:child_process'
import assert from 'node:assert/strict'

const output = execFileSync(process.execPath, ['scripts/english-route.mjs', '--goal', 'run npm test after confirming package root', '--compact'], {
  cwd: new URL('../../..', import.meta.url),
  encoding: 'utf8',
})
const result = JSON.parse(output)
assert.equal(result.edition_id, 'english')
assert.equal(result.scenario, 'scenario-node-npm-build')
assert.ok(result.route_ids.includes('route-agent-tool-action-contract'))
console.log(JSON.stringify({ ok: true, edition_id: 'english', scenario: result.scenario }, null, 2))
