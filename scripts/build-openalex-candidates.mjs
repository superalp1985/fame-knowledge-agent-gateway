import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const projectRoot = process.cwd()
const sampleRoot = join(projectRoot, 'versions', 'chinese-open', 'knowledge', 'database', 'samples')
const candidateRoot = join(projectRoot, 'versions', 'chinese-open', 'knowledge', 'database', 'candidates')
const sampleFile = join(sampleRoot, 'openalex.sample.jsonl')
const outputFile = join(candidateRoot, 'openalex_topic_candidates.json')

if (!existsSync(sampleFile)) {
  console.error(`Missing sample file: ${sampleFile}`)
  process.exit(1)
}

function readJsonl(file) {
  return readFileSync(file, 'utf8')
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => JSON.parse(line))
}

function clamp(value, min = 0, max = 1) {
  return Math.max(min, Math.min(max, value))
}

function score(record) {
  const works = Math.log10(Math.max(1, record.works_count ?? 0)) / 6
  const citations = Math.log10(Math.max(1, record.cited_by_count ?? 0)) / 7
  const fieldMatch = record.field?.toLowerCase().includes(record.subject.replace('-', ' ')) ? 0.18 : 0
  const queryMatch = record.display_name?.toLowerCase().includes(record.query.toLowerCase()) ? 0.12 : 0
  const scopePenalty = scopeFlags(record).length * 0.08
  return Number(clamp(0.35 * works + 0.35 * citations + fieldMatch + queryMatch - scopePenalty, 0, 1).toFixed(3))
}

function scopeFlags(record) {
  const flags = []
  const field = String(record.field ?? '').toLowerCase()
  const subfield = String(record.subfield ?? '').toLowerCase()
  const title = String(record.display_name ?? '').toLowerCase()
  const query = String(record.query ?? '').toLowerCase()
  const haystack = `${field} ${subfield} ${title}`

  if (record.subject === 'computer-science' && !/computer|information|artificial|computational|data|software|engineering/.test(haystack)) {
    flags.push('weak_computer_science_scope')
  }
  if (record.subject === 'mathematics' && !/math|statistic|probability|geometry|topology|theoretical|graph|algebra/.test(haystack)) {
    flags.push('weak_mathematics_scope')
  }
  if (record.subject === 'logic' && !/logic|formal|model|verification|type|programming|mathematics|theoretical|computer/.test(haystack)) {
    flags.push('weak_logic_scope')
  }
  if (query === 'model theory' && !/model theory|logic|topology|set theory|formal/.test(haystack)) {
    flags.push('model_theory_query_drift')
  }
  return flags
}

function outOfOpenScope(record) {
  const haystack = [
    record.display_name,
    record.title,
    record.description,
    record.domain,
    record.field,
    record.subfield,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()

  return [
    'history and philosophy',
    'history of science',
    'history and theory',
    'technology in society',
    'economic theories',
    'chemical physics',
    'epidemiology',
    'ecology models',
    'quantum mechanics',
    'advanced technologies in various fields',
    'political',
    'politics',
  ].some((needle) => haystack.includes(needle))
}

function suggestedRoutes(subject) {
  if (subject === 'computer-science') {
    return ['route-cs-engineering-knowledge', 'route-cs-kg-indexing', 'route-cs-spec-to-test']
  }
  if (subject === 'mathematics') {
    return ['route-math-modeling-abstraction', 'route-math-graph-traversal', 'route-math-evidence-update']
  }
  if (subject === 'logic') {
    return ['route-logic-argument-check', 'route-logic-knowledge-consistency', 'route-logic-failure-diagnosis']
  }
  return ['route-language-intent-to-scope']
}

function fameFromScore(candidateScore) {
  return {
    mu: Number(clamp(0.45 + candidateScore * 0.25).toFixed(3)),
    chi: Number(clamp(0.4 + candidateScore * 0.3).toFixed(3)),
    epsilon: 0.45,
    kappa: 0.42,
    nu: 0.5,
    delta: 0,
    rho: Number(clamp(0.35 + candidateScore * 0.25).toFixed(3)),
    risk: Number(clamp(0.35 - candidateScore * 0.12).toFixed(3)),
  }
}

const allSampleRecords = readJsonl(sampleFile)
const excludedRecords = allSampleRecords.filter((record) => record.status === 'excluded' || outOfOpenScope(record))
const records = allSampleRecords.filter((record) => record.status === 'sampled' && !outOfOpenScope(record))
const uniqueRecords = [...records.reduce((map, record) => {
  const key = `${record.subject}:${record.external_id ?? record.id}`
  const existing = map.get(key)
  if (!existing || score(record) > score(existing)) map.set(key, record)
  return map
}, new Map()).values()]

const candidates = uniqueRecords
  .map((record) => {
    const candidateScore = score(record)
    const flags = scopeFlags(record)
    return {
      id: record.id.replace(/^openalex:/, 'candidate:openalex:'),
      source_id: 'openalex',
      source_record_id: record.external_id,
      subject: record.subject,
      query: record.query,
      title: record.display_name,
      summary: record.description,
      domain: record.domain,
      field: record.field,
      subfield: record.subfield,
      works_count: record.works_count,
      cited_by_count: record.cited_by_count,
      relevance_score: candidateScore,
      scope_flags: flags,
      recommended_action: candidateScore >= 0.55 && flags.length === 0 ? 'review_for_content_unit_candidate' : 'keep_as_discovery_signal',
      route_refs: suggestedRoutes(record.subject),
      validation_refs: ['route-logic-knowledge-consistency', 'route-math-evidence-update'],
      license_hint: record.license_hint,
      fame_seed: fameFromScore(candidateScore),
      import_policy: {
        do_not_import_as_fact: true,
        use_as_source_discovery: true,
        require_human_review: true,
        require_authoritative_source_before_core_content: true,
      },
    }
  })
  .sort((a, b) => b.relevance_score - a.relevance_score || String(a.title).localeCompare(String(b.title)))

const bySubject = {}
for (const candidate of candidates) {
  bySubject[candidate.subject] ??= []
  bySubject[candidate.subject].push(candidate.id)
}

const output = {
  edition_id: 'chinese-open',
  generated_at: new Date().toISOString(),
  generator: 'scripts/build-openalex-candidates.mjs',
  source_sample: 'knowledge/database/samples/openalex.sample.jsonl',
  policy: {
    candidate_index_only: true,
    no_core_graph_write: true,
    no_content_unit_write: true,
    require_human_review_before_import: true,
  },
  summary: {
    records_read: allSampleRecords.length,
    records_used: records.length,
    records_excluded: excludedRecords.length,
    unique_records: uniqueRecords.length,
    duplicates_removed: records.length - uniqueRecords.length,
    candidates: candidates.length,
    by_subject: Object.fromEntries(Object.entries(bySubject).map(([subject, ids]) => [subject, ids.length])),
  },
  by_subject: bySubject,
  candidates,
}

mkdirSync(candidateRoot, { recursive: true })
writeFileSync(outputFile, `${JSON.stringify(output, null, 2)}\n`, 'utf8')

console.log(JSON.stringify(output.summary, null, 2))
