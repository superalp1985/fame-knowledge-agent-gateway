import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { basename, extname, join, relative } from 'node:path'

const projectRoot = join(process.cwd(), '..')
const memoryRoot = join(projectRoot, 'memory', 'projects')
const outDir = join(process.cwd(), 'src', 'generated')
const publicGeneratedDir = join(process.cwd(), 'public', 'generated')
const tsOutFile = join(outDir, 'projectMemory.generated.ts')
const jsonOutFile = join(publicGeneratedDir, 'projectMemory.generated.json')

function readUtf8(file) {
  return readFileSync(file, 'utf8').replace(/^\uFEFF/, '')
}

function readJson(file, fallback = null) {
  if (!existsSync(file)) return fallback
  return JSON.parse(readUtf8(file))
}

function readJsonl(file) {
  if (!existsSync(file)) return []
  return readUtf8(file)
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line))
}

function listFiles(dir, predicate = () => true) {
  const result = []
  if (!existsSync(dir)) return result
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) result.push(...listFiles(full, predicate))
    else if (entry.isFile() && predicate(full)) result.push(full)
  }
  return result
}

function compactWhitespace(text) {
  return String(text ?? '').replace(/\s+/g, ' ').trim()
}

function excerptMarkdown(text) {
  return compactWhitespace(
    text
      .split(/\r?\n/)
      .filter((line) => line.trim() && !line.trim().startsWith('#'))
      .slice(0, 10)
      .join(' '),
  ).slice(0, 520)
}

function classifyProjectNode(type) {
  if (type === 'ProjectTask') return 'task'
  if (type === 'ProjectDecision') return 'decision'
  if (type === 'ProjectModule') return 'module'
  if (type === 'ProjectArtifact') return 'artifact'
  if (type === 'QualityGateResult') return 'quality'
  return 'memory'
}

function averageFame(overlays) {
  const keys = ['mu', 'chi', 'epsilon', 'kappa', 'nu', 'delta', 'rho', 'lambda']
  const result = Object.fromEntries(keys.map((key) => [key, 0]))
  if (overlays.length === 0) return result
  for (const overlay of overlays) {
    for (const key of keys) result[key] += Number(overlay.fame?.[key] ?? 0)
  }
  for (const key of keys) result[key] = Number((result[key] / overlays.length).toFixed(3))
  return result
}

function promotionReadiness(candidate) {
  const checks = candidate.promotion_checks ?? {}
  const positive = [
    checks.cross_project_repeated,
    checks.source_refs_present,
    checks.quality_gate_refs_present,
    checks.human_review_required,
  ].filter(Boolean).length
  const blocked = checks.core_write_allowed === false
  return {
    score: Number((positive / 4).toFixed(2)),
    blocked,
    reason: blocked ? 'core_write_allowed=false; needs review before promotion' : 'promotion checks allow review',
  }
}

function buildProjectPayload(projectDir) {
  const projectId = basename(projectDir)
  const manifest = readJson(join(projectDir, 'project_manifest.json'), {
    project_id: projectId,
    project_name: projectId,
    memory_policy: {},
    roots: {},
  })
  const nodes = readJsonl(join(projectDir, 'project_graph.jsonl')).map((node) => ({
    ...node,
    layer: classifyProjectNode(node.type),
  }))
  const edges = readJsonl(join(projectDir, 'project_edges.jsonl'))
  const fameOverlay = readJsonl(join(projectDir, 'fame_overlay.jsonl'))
  const toolInvocations = readJsonl(join(projectDir, 'tool_invocation_summary.jsonl'))
  const failureLessons = readJsonl(join(projectDir, 'failure_lessons.jsonl'))
  const contextSummaries = listFiles(join(projectDir, 'context_summaries'), (file) => extname(file).toLowerCase() === '.md')
    .sort()
    .map((file) => {
      const text = readUtf8(file)
      return {
        id: basename(file, extname(file)),
        path: relative(projectRoot, file).replace(/\\/g, '/'),
        title: text.match(/^#\s+(.+)$/m)?.[1] ?? basename(file, extname(file)),
        excerpt: excerptMarkdown(text),
        size_bytes: statSync(file).size,
      }
    })
  const promotionCandidates = listFiles(join(projectDir, 'promotion_candidates'), (file) => extname(file).toLowerCase() === '.json')
    .sort()
    .map((file) => {
      const candidate = readJson(file, {})
      return {
        ...candidate,
        path: relative(projectRoot, file).replace(/\\/g, '/'),
        readiness: promotionReadiness(candidate),
      }
    })

  const edgeByOverlay = new Map(fameOverlay.map((overlay) => [overlay.edge_id, overlay]))
  const linkedEdges = edges.map((edge) => {
    const overlay = edgeByOverlay.get(edge.fame_overlay_ref)
    return {
      ...edge,
      fame: overlay?.fame ?? null,
      fame_score:
        overlay?.fame
          ? Number(
              (
                0.18 * overlay.fame.mu +
                0.08 * overlay.fame.chi +
                0.14 * overlay.fame.epsilon +
                0.22 * overlay.fame.kappa -
                0.12 * overlay.fame.nu -
                0.16 * overlay.fame.delta -
                0.06 * overlay.fame.rho -
                0.12 * overlay.fame.lambda
              ).toFixed(3),
            )
          : null,
    }
  })

  const stats = {
    project_id: manifest.project_id,
    node_count: nodes.length,
    edge_count: linkedEdges.length,
    fame_overlay_count: fameOverlay.length,
    tool_invocation_count: toolInvocations.length,
    failure_lesson_count: failureLessons.length,
    context_summary_count: contextSummaries.length,
    promotion_candidate_count: promotionCandidates.length,
    successful_tool_calls: toolInvocations.filter((item) => item.status === 'success').length,
    blocked_tool_calls: toolInvocations.filter((item) => item.status === 'blocked').length,
    failed_tool_calls: toolInvocations.filter((item) => item.status === 'fail').length,
    avg_fame: averageFame(fameOverlay),
    generated_at: new Date().toISOString(),
  }

  return {
    manifest,
    nodes,
    edges: linkedEdges,
    fameOverlay,
    toolInvocations,
    failureLessons,
    contextSummaries,
    promotionCandidates,
    stats,
  }
}

function buildPayload() {
  const projects = existsSync(memoryRoot)
    ? readdirSync(memoryRoot, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .map((entry) => buildProjectPayload(join(memoryRoot, entry.name)))
    : []

  return {
    projects,
    stats: {
      project_count: projects.length,
      total_nodes: projects.reduce((sum, project) => sum + project.stats.node_count, 0),
      total_edges: projects.reduce((sum, project) => sum + project.stats.edge_count, 0),
      total_promotion_candidates: projects.reduce((sum, project) => sum + project.stats.promotion_candidate_count, 0),
      generated_at: new Date().toISOString(),
    },
  }
}

function emitTs() {
  return `// Generated by scripts/build-project-memory.mjs. Do not edit by hand.
export type ProjectMemoryFameVector = {
  mu: number
  chi: number
  epsilon: number
  kappa: number
  nu: number
  delta: number
  rho: number
  lambda: number
}

export type ProjectMemoryScope = {
  project_id: string
  subject: string
  route_id: string
  task_id: string
  [key: string]: unknown
}

export type ProjectMemoryNode = {
  id: string
  type: string
  layer: 'task' | 'decision' | 'module' | 'artifact' | 'quality' | 'memory'
  label: string
  scope: ProjectMemoryScope
  summary: string
  core_refs: string[]
  status: string
  created_at: string
}

export type ProjectMemoryEdge = {
  id: string
  type: string
  source: string
  target: string
  summary: string
  fame_overlay_ref: string
  fame: ProjectMemoryFameVector | null
  fame_score: number | null
}

export type ProjectFameOverlay = {
  edge_id: string
  core_edge_ref: string
  scope: ProjectMemoryScope
  fame: ProjectMemoryFameVector
  dynamics: Record<string, unknown>
  evidence: Record<string, unknown>
}

export type ProjectToolInvocation = {
  invocation_id: string
  project_id: string
  task_id: string
  route_id: string
  tool_id: string
  purpose: string
  inputs_summary: string
  outputs_summary: string
  status: 'success' | 'fail' | 'blocked' | 'skipped'
  failure_category: string
  fame_delta: Partial<ProjectMemoryFameVector>
  started_at: string
  ended_at: string
}

export type ProjectFailureLesson = {
  lesson_id: string
  project_id: string
  route_id: string
  failure_category: string
  summary: string
  fame_delta: Partial<ProjectMemoryFameVector>
  fix_recipe: string
  source_refs: string[]
  created_at: string
}

export type ProjectContextSummary = {
  id: string
  path: string
  title: string
  excerpt: string
  size_bytes: number
}

export type ProjectPromotionCandidate = {
  proposal_id: string
  proposer: string
  source_project_id: string
  target_core_route_id: string
  promotion_type: string
  review_status: string
  content_summary: string
  evidence_refs: string[]
  promotion_checks: Record<string, boolean>
  initial_fame: ProjectMemoryFameVector
  path: string
  readiness: {
    score: number
    blocked: boolean
    reason: string
  }
}

export type ProjectMemoryManifest = {
  project_id: string
  project_name: string
  workspace_root: string
  agent_id: string
  core_knowledge_version: string
  memory_policy: Record<string, unknown>
  active_scope: Record<string, unknown>
  project_phase: string
  created_at: string
  updated_at: string
  roots: Record<string, string>
}

export type ProjectMemoryProject = {
  manifest: ProjectMemoryManifest
  nodes: ProjectMemoryNode[]
  edges: ProjectMemoryEdge[]
  fameOverlay: ProjectFameOverlay[]
  toolInvocations: ProjectToolInvocation[]
  failureLessons: ProjectFailureLesson[]
  contextSummaries: ProjectContextSummary[]
  promotionCandidates: ProjectPromotionCandidate[]
  stats: {
    project_id: string
    node_count: number
    edge_count: number
    fame_overlay_count: number
    tool_invocation_count: number
    failure_lesson_count: number
    context_summary_count: number
    promotion_candidate_count: number
    successful_tool_calls: number
    blocked_tool_calls: number
    failed_tool_calls: number
    avg_fame: ProjectMemoryFameVector
    generated_at: string
  }
}

export type ProjectMemoryPayload = {
  projects: ProjectMemoryProject[]
  stats: {
    project_count: number
    total_nodes: number
    total_edges: number
    total_promotion_candidates: number
    generated_at: string
  }
}

const projectMemoryUrl = \`\${import.meta.env.BASE_URL}generated/projectMemory.generated.json\`

let cachedProjectMemory: Promise<ProjectMemoryPayload> | null = null

export function loadProjectMemory() {
  cachedProjectMemory ??= fetch(projectMemoryUrl).then((response) => {
    if (!response.ok) throw new Error(\`Failed to load project memory: \${response.status} \${response.statusText}\`)
    return response.json() as Promise<ProjectMemoryPayload>
  })
  return cachedProjectMemory
}
`
}

const payload = buildPayload()
mkdirSync(outDir, { recursive: true })
mkdirSync(publicGeneratedDir, { recursive: true })
writeFileSync(tsOutFile, emitTs(), 'utf8')
writeFileSync(jsonOutFile, JSON.stringify(payload, null, 2), 'utf8')
console.log(
  `Generated ${relative(process.cwd(), tsOutFile)} and ${relative(process.cwd(), jsonOutFile)} with ${payload.stats.project_count} projects, ${payload.stats.total_nodes} nodes, ${payload.stats.total_edges} edges.`,
)
