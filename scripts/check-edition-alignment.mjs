import fs from 'node:fs'
import path from 'node:path'

const projectRoot = process.cwd()
const chineseRoot = path.join(projectRoot, 'versions', 'chinese-open')
const englishRoot = path.join(projectRoot, 'versions', 'english')

function readJson(root, relativePath) {
  return JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8').replace(/^\uFEFF/, ''))
}

function readJsonlIds(root, relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8')
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => JSON.parse(line).id)
    .sort()
}

function ids(root, relativePath, getter) {
  return getter(readJson(root, relativePath)).sort()
}

function compare(name, left, right, findings) {
  const leftOnly = left.filter((item) => !right.includes(item))
  const rightOnly = right.filter((item) => !left.includes(item))
  if (leftOnly.length > 0 || rightOnly.length > 0) {
    findings.push({ id: name, ok: false, left_only: leftOnly, right_only: rightOnly })
  } else {
    findings.push({ id: name, ok: true, count: left.length })
  }
}

const findings = []

compare(
  'route_ids',
  ids(chineseRoot, 'knowledge/route_index.json', (json) => json.routes.map((route) => route.id)),
  ids(englishRoot, 'knowledge/route_index.json', (json) => json.routes.map((route) => route.id)),
  findings,
)
compare(
  'graph_node_ids',
  ids(chineseRoot, 'knowledge/graph.seed.json', (json) => json.nodes.map((node) => node.id)),
  ids(englishRoot, 'knowledge/graph.seed.json', (json) => json.nodes.map((node) => node.id)),
  findings,
)
compare(
  'graph_edge_ids',
  ids(chineseRoot, 'knowledge/graph.seed.json', (json) => json.edges.map((edge) => edge.id)),
  ids(englishRoot, 'knowledge/graph.seed.json', (json) => json.edges.map((edge) => edge.id)),
  findings,
)
compare(
  'scenario_ids',
  ids(chineseRoot, 'knowledge/agent-tooling/stability_scenarios.json', (json) => json.scenarios.map((scenario) => scenario.id)),
  ids(englishRoot, 'knowledge/agent-tooling/stability_scenarios.json', (json) => json.scenarios.map((scenario) => scenario.id)),
  findings,
)
compare(
  'content_unit_ids',
  readJsonlIds(chineseRoot, 'knowledge/database/content_units.jsonl'),
  readJsonlIds(englishRoot, 'knowledge/database/content_units.jsonl'),
  findings,
)
compare(
  'golden_task_ids',
  ids(chineseRoot, 'golden-tasks/tool-stability.golden.json', (json) => json.tasks.map((task) => task.id)),
  ids(englishRoot, 'golden-tasks/tool-stability.golden.json', (json) => json.tasks.map((task) => task.id)),
  findings,
)
compare(
  'subject_ids',
  ids(chineseRoot, 'knowledge/indexes/subject_index.json', (json) => json.subjects.map((subject) => subject.id)),
  ids(englishRoot, 'knowledge/indexes/subject_index.json', (json) => json.subjects.map((subject) => subject.id)),
  findings,
)

const routeRefsChinese = new Set(ids(chineseRoot, 'knowledge/route_index.json', (json) => json.routes.flatMap((route) => route.content_refs ?? [])))
const routeRefsEnglish = new Set(ids(englishRoot, 'knowledge/route_index.json', (json) => json.routes.flatMap((route) => route.content_refs ?? [])))
compare('route_content_refs', [...routeRefsChinese].sort(), [...routeRefsEnglish].sort(), findings)

const failures = findings.filter((finding) => !finding.ok)
console.log(JSON.stringify({
  ok: failures.length === 0,
  compared: findings.length,
  failures: failures.length,
  findings,
}, null, 2))

if (failures.length > 0) process.exit(1)
