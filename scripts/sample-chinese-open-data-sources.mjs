import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const projectRoot = process.cwd()
const outputRoot = join(projectRoot, 'versions', 'chinese-open', 'knowledge', 'database', 'samples')
const now = new Date().toISOString()

const userAgent = 'FAME-ChineseOpenSampleImporter/0.1 (metadata sample; no bulk import)'
const timeoutMs = Number.parseInt(process.env.FAME_SAMPLE_TIMEOUT_MS ?? '8000', 10)
const perPage = Number.parseInt(process.env.FAME_SAMPLE_PER_PAGE ?? '3', 10)
const enabledSourceIds = new Set(
  (process.env.FAME_SAMPLE_SOURCES ?? 'wikidata,openalex,opencitations')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean),
)

const subjects = [
  {
    id: 'computer-science',
    terms: ['computer science', 'software engineering', 'knowledge graph'],
    doi: '10.1145/3664191',
  },
  {
    id: 'mathematics',
    terms: ['mathematics', 'graph theory', 'probability theory'],
    doi: '10.1090/noti1173',
  },
  {
    id: 'logic',
    terms: ['logic', 'formal logic', 'model theory'],
    doi: '10.1093/0195138590.001.0001',
  },
]

const sourceConfigs = [
  {
    id: 'wikidata',
    license_hint: 'CC0 public domain dedication for Wikidata data',
    mode: 'metadata_sample',
    fetcher: fetchWikidata,
  },
  {
    id: 'openalex',
    license_hint: 'CC0',
    mode: 'metadata_sample',
    fetcher: fetchOpenAlex,
  },
  {
    id: 'opencitations',
    license_hint: 'CC0 for citation data',
    mode: 'citation_count_sample',
    fetcher: fetchOpenCitations,
  },
]

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function stableSampleId(sourceId, subjectId, value) {
  return `${sourceId}:${subjectId}:${value}`.toLowerCase().replace(/[^a-z0-9:.-]+/g, '-')
}

async function fetchJson(url, requestTimeoutMs = timeoutMs) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), requestTimeoutMs)
  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': userAgent, Accept: 'application/json' },
      signal: controller.signal,
    })
    const text = await response.text()
    let data = null
    try {
      data = text ? JSON.parse(text) : null
    } catch {
      data = { raw_text: text.slice(0, 500) }
    }
    return { ok: response.ok, status: response.status, data }
  } catch (error) {
    const name = error?.name ? `${error.name}: ` : ''
    return { ok: false, status: 0, error: `${name}${error.message}` }
  } finally {
    clearTimeout(timer)
  }
}

async function fetchWikidata(subject) {
  const records = []
  for (const term of subject.terms) {
    const url = `https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${encodeURIComponent(term)}&language=en&format=json&limit=${perPage}&origin=*`
    const result = await fetchJson(url)
    if (!result.ok) {
      records.push({
        id: stableSampleId('wikidata', subject.id, term),
        status: 'skipped_or_error',
        query: term,
        error: result.error ?? `HTTP ${result.status}`,
      })
      continue
    }
    for (const item of result.data?.search ?? []) {
      records.push({
        id: stableSampleId('wikidata', subject.id, item.id),
        status: 'sampled',
        query: term,
        external_id: item.id,
        label: item.label ?? null,
        description: item.description ?? null,
        aliases: item.aliases ?? [],
        url: item.concepturi ?? item.url ?? null,
      })
    }
    await sleep(250)
  }
  return records
}

async function fetchOpenAlex(subject) {
  const records = []
  for (const term of subject.terms) {
    const url = `https://api.openalex.org/topics?search=${encodeURIComponent(term)}&per-page=${perPage}`
    const result = await fetchJson(url)
    if (!result.ok) {
      records.push({
        id: stableSampleId('openalex', subject.id, term),
        status: 'skipped_or_error',
        query: term,
        error: result.error ?? `HTTP ${result.status}`,
      })
      continue
    }
    for (const item of result.data?.results ?? []) {
      records.push({
        id: stableSampleId('openalex', subject.id, item.id ?? item.display_name ?? term),
        status: 'sampled',
        query: term,
        external_id: item.id ?? null,
        display_name: item.display_name ?? null,
        description: item.description ?? null,
        domain: item.domain?.display_name ?? null,
        field: item.field?.display_name ?? null,
        subfield: item.subfield?.display_name ?? null,
        works_count: item.works_count ?? null,
        cited_by_count: item.cited_by_count ?? null,
      })
    }
    await sleep(250)
  }
  return records
}

async function fetchOpenCitations(subject) {
  const encodedDoi = encodeURIComponent(subject.doi)
  const urls = {
    citation_count: `https://api.opencitations.net/index/v2/citation-count/${encodedDoi}`,
    reference_count: `https://api.opencitations.net/index/v2/reference-count/${encodedDoi}`,
  }
  const records = []
  for (const [kind, url] of Object.entries(urls)) {
    const result = await fetchJson(url)
    if (!result.ok) {
      records.push({
        id: stableSampleId('opencitations', subject.id, `${kind}-${subject.doi}`),
        status: result.status === 404 ? 'not_found' : 'skipped_or_error',
        query: subject.doi,
        metric: kind,
        endpoint: url,
        error: result.error ?? `HTTP ${result.status}`,
      })
      continue
    }
    records.push({
      id: stableSampleId('opencitations', subject.id, `${kind}-${subject.doi}`),
      status: 'sampled',
      query: subject.doi,
      metric: kind,
      endpoint: url,
      value: Array.isArray(result.data) ? (result.data[0]?.count ?? null) : null,
      raw_shape: Array.isArray(result.data) ? 'array' : typeof result.data,
    })
    await sleep(250)
  }
  return records
}

function summarize(sourceId, records) {
  const sampled = records.filter((record) => record.status === 'sampled').length
  const failed = records.length - sampled
  return { source_id: sourceId, records: records.length, sampled, failed }
}

mkdirSync(outputRoot, { recursive: true })

const manifest = {
  edition_id: 'chinese-open',
  generated_at: now,
  generator: 'scripts/sample-chinese-open-data-sources.mjs',
  mode: 'small_metadata_sample',
  policy: {
    no_bulk_download: true,
    no_full_text_import: true,
    output_is_candidate_index_only: true,
    core_graph_unchanged: true,
    timeout_ms: timeoutMs,
    per_page: perPage,
    enabled_sources: [...enabledSourceIds],
  },
  subjects: subjects.map(({ id, terms, doi }) => ({ id, terms, doi })),
  sources: [],
}

for (const config of sourceConfigs.filter((source) => enabledSourceIds.has(source.id))) {
  const records = []
  for (const subject of subjects) {
    const subjectRecords = await config.fetcher(subject)
    records.push(
      ...subjectRecords.map((record) => ({
        ...record,
        source_id: config.id,
        subject: subject.id,
        license_hint: config.license_hint,
        import_mode: config.mode,
      })),
    )
  }
  const outputFile = join(outputRoot, `${config.id}.sample.jsonl`)
  writeFileSync(outputFile, `${records.map((record) => JSON.stringify(record)).join('\n')}\n`, 'utf8')
  manifest.sources.push({ ...summarize(config.id, records), output: `knowledge/database/samples/${config.id}.sample.jsonl` })
}

writeFileSync(join(outputRoot, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`, 'utf8')

console.log(JSON.stringify(manifest, null, 2))
