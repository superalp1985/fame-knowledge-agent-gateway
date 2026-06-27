import { closeSync, existsSync, mkdirSync, openSync, readFileSync, readSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { basename, extname, join, relative } from 'node:path'

const projectRoot = join(process.cwd(), '..')
const outDir = join(process.cwd(), 'src', 'generated')
const publicGeneratedDir = join(process.cwd(), 'public', 'generated')
const universeOutFile = join(outDir, 'knowledgeUniverse.generated.ts')
const indexOutFile = join(outDir, 'knowledgeIndex.generated.ts')
const graphOutFile = join(outDir, 'knowledgeGraph.generated.ts')
const indexJsonOutFile = join(publicGeneratedDir, 'knowledgeIndex.generated.json')
const graphJsonOutFile = join(publicGeneratedDir, 'knowledgeGraph.generated.json')

const knowledgeRoots = [
  {
    id: 'knowledge-meta',
    label: 'Knowledge Root Manifest',
    publicRelativePath: 'knowledge',
    privateRelativePath: 'knowledge',
    color: '#6b7280',
    directFilesOnly: true,
  },
  {
    id: 'bnai-agent',
    label: 'BNAI智能agent知识网',
    publicRelativePath: 'knowledge/BNAI智能agent知识网',
    privateRelativePath: 'knowledge_backup/BNAI智能agent知识网',
    color: '#197278',
  },
  {
    id: 'jianmu',
    label: '建木知识网',
    publicRelativePath: 'knowledge/建木知识网',
    privateRelativePath: 'knowledge_backup/建木知识网',
    color: '#101828',
  },
]

const textExtensions = new Set([
  '.md',
  '.markdown',
  '.yaml',
  '.yml',
  '.json',
  '.jsonl',
  '.txt',
  '.csv',
  '.tsv',
  '.rst',
  '.html',
  '.htm',
  '.py',
  '.js',
  '.jsx',
  '.ts',
  '.tsx',
  '.mjs',
  '.cjs',
  '.css',
  '.scss',
  '.vue',
  '.sh',
  '.ps1',
  '.cmd',
  '.bat',
  '.dockerfile',
  '.conf',
  '.cfg',
  '.toml',
  '.xml',
  '.jinja',
  '.tmpl',
  '.log',
])
const assetExtensions = new Set([
  '.jpg',
  '.jpeg',
  '.png',
  '.gif',
  '.svg',
  '.ico',
  '.pdf',
  '.docx',
  '.pptx',
  '.mp3',
  '.wav',
  '.mp4',
  '.srt',
  '.mid',
  '.parquet',
  '.sqlite',
  '.sqlite3',
  '.db',
  '.npy',
  '.pt',
  '.safetensors',
  '.tiktoken',
  '.bpe',
  '.whl',
  '.zip',
  '.ttf',
  '.woff',
  '.woff2',
])
const ignoredDirs = new Set([
  '.git',
  '.cache',
  '__pycache__',
  'node_modules',
  'dist',
  'build',
  'cache',
])

const ignoredFiles = new Set(['package-lock.json', 'yarn.lock', 'pnpm-lock.yaml'])
const textFileNames = new Set([
  'dockerfile',
  'modelfile',
  'makefile',
  'readme',
  'license',
  'requirements',
])
const maxTextReadBytes = 1024 * 1024

const colors = [
  '#2f9e65',
  '#2d7dd2',
  '#d79a20',
  '#9b5de5',
  '#197278',
  '#c05621',
  '#5171a5',
  '#b94e70',
  '#5f8f3f',
  '#6b7280',
  '#0f766e',
  '#be185d',
]

const crossSubjectLinks = [
  ['art', 'photography', 'visual_abstraction'],
  ['photography', 'film', 'image_to_scene'],
  ['film', 'video', 'scene_to_timeline'],
  ['narrative', 'literature', 'story_structure'],
  ['narrative', 'film', 'story_to_scene'],
  ['audio', 'music', 'sound_structure'],
  ['audio', 'video', 'sound_to_media'],
  ['chart_diagram', 'ppt', 'diagram_to_presentation'],
  ['design_systems', 'art', 'visual_rules'],
  ['language_tree_links', 'schemas', 'abstraction_to_schema'],
  ['schemas', 'production_pipeline', 'quality_contract'],
  ['review_prompts', 'production_pipeline', 'review_loop'],
  ['examples', 'review_prompts', 'pattern_to_review'],
  ['text_research', 'literature', 'research_to_expression'],
  ['agent', 'docs', 'agent_architecture'],
  ['rules', 'reports', 'rule_to_evaluation'],
  ['associations', 'language', 'association_to_language'],
  ['meta', 'entries', 'metadata_to_entry'],
  ['fineval', 'eval', 'evaluation_loop'],
]

const languageCenterId = 'language-tree-root'

const languageLayerNodes = [
  {
    id: 'language-layer-entry',
    label: '语言入口',
    subject: 'language_entry',
    file_path: 'knowledge/建木知识网/backbone.json#lang_layer_0_entry',
    position: [0, 4.8, 0],
  },
  {
    id: 'language-layer-lexicon',
    label: '词汇层',
    subject: 'lexicon',
    file_path: 'knowledge/建木知识网/backbone.json#lang_layer_1_lexicon',
    position: [-5.4, 2.4, 3.8],
  },
  {
    id: 'language-layer-grammar',
    label: '语法层',
    subject: 'grammar',
    file_path: 'knowledge/建木知识网/backbone.json#lang_layer_1_grammar',
    position: [5.4, 2.4, 3.8],
  },
  {
    id: 'language-layer-semantics',
    label: '语义层',
    subject: 'semantics',
    file_path: 'knowledge/建木知识网/backbone.json#lang_layer_1_semantics',
    position: [0, 2.4, -6.2],
  },
]

function safeId(value) {
  return value
    .replace(/\\/g, '/')
    .replace(/\.[^.]+$/, '')
    .replace(/[^a-zA-Z0-9\u4e00-\u9fa5]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 120)
}

function normalizePath(value) {
  return value.replace(/\\/g, '/')
}

function shouldIndexFile(fileName) {
  if (ignoredFiles.has(fileName)) return false
  const ext = extname(fileName).toLowerCase()
  if (!ext && textFileNames.has(fileName.toLowerCase())) return true
  return textExtensions.has(ext) || assetExtensions.has(ext)
}

function listTextFiles(dir) {
  const result = []
  if (!existsSync(dir)) return result

  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) {
      if (!ignoredDirs.has(entry.name)) result.push(...listTextFiles(full))
    } else if (entry.isFile() && shouldIndexFile(entry.name)) {
      result.push(full)
    }
  }
  return result
}

function listDirectTextFiles(dir) {
  if (!existsSync(dir)) return []
  return readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && shouldIndexFile(entry.name))
    .map((entry) => join(dir, entry.name))
}

function selectKnowledgeRoot(rootConfig) {
  const publicDir = join(projectRoot, rootConfig.publicRelativePath)
  const privateDir = join(projectRoot, rootConfig.privateRelativePath)
  const forceSource = process.env.FAME_KNOWLEDGE_SOURCE

  if (forceSource === 'private' && existsSync(privateDir)) {
    return { relativePath: rootConfig.privateRelativePath, sourceKind: 'knowledge_backup' }
  }
  if (forceSource === 'public' && existsSync(publicDir)) {
    return { relativePath: rootConfig.publicRelativePath, sourceKind: 'knowledge' }
  }
  if (existsSync(publicDir)) {
    return { relativePath: rootConfig.publicRelativePath, sourceKind: 'knowledge' }
  }
  return { relativePath: rootConfig.privateRelativePath, sourceKind: 'knowledge_backup' }
}

function readUtf8(file) {
  const raw = readFileSync(file)
  return raw.toString('utf8').replace(/^\uFEFF/, '')
}

function readUtf8Preview(file, stat) {
  if (stat.size <= maxTextReadBytes) return readUtf8(file)
  const fd = openSync(file, 'r')
  try {
    const buffer = Buffer.alloc(maxTextReadBytes)
    const bytesRead = readSync(fd, buffer, 0, maxTextReadBytes, 0)
    return buffer.subarray(0, bytesRead).toString('utf8').replace(/^\uFEFF/, '')
  } finally {
    closeSync(fd)
  }
}

function isTextKnowledgeFile(file, ext) {
  if (textExtensions.has(ext)) return true
  return !ext && textFileNames.has(basename(file).toLowerCase())
}

function readJsonIfExists(relativePath) {
  const file = join(projectRoot, relativePath)
  if (!existsSync(file)) return null
  try {
    return JSON.parse(readUtf8(file))
  } catch {
    return null
  }
}

function redactSecrets(text) {
  return text
    .replace(/sk-[A-Za-z0-9_-]{12,}/g, '[REDACTED_API_KEY]')
    .replace(/(api[_-]?key|token|secret|password)(["'\s:=]+)([^"',\s}]+)/gi, '$1$2[REDACTED]')
    .replace(/(base_url|api_url)(["'\s:=]+)(https?:\/\/[^\s"',}]+)/gi, '$1$2[REDACTED_URL]')
}

function compactWhitespace(text) {
  return text.replace(/\s+/g, ' ').trim()
}

function extractHeadings(text) {
  return text
    .split(/\r?\n/)
    .map((line) => line.match(/^(#{1,6})\s+(.+)$/))
    .filter(Boolean)
    .slice(0, 12)
    .map((match) => ({
      level: match[1].length,
      text: compactWhitespace(match[2]).slice(0, 120),
    }))
}

function extractTitle(file, text) {
  const heading = text.match(/^#\s+(.+)$/m)
  if (heading) return compactWhitespace(heading[1]).slice(0, 120)
  return basename(file, extname(file))
}

function extractExcerpt(text, ext = '') {
  if (!textExtensions.has(ext)) return `Asset file (${ext || 'unknown'}) indexed as metadata.`
  const cleaned = redactSecrets(text)
    .split(/\r?\n/)
    .filter((line) => {
      const trimmed = line.trim()
      return trimmed && !trimmed.startsWith('```') && !trimmed.startsWith('|')
    })
    .slice(0, 12)
    .join(' ')
  return compactWhitespace(cleaned).slice(0, 520)
}

function topSubject(rootDir, file) {
  const parts = normalizePath(relative(rootDir, file)).split('/')
  return parts.length > 1 ? parts[0] : '(root)'
}

function keywordCandidates(entry) {
  const raw = [
    entry.title,
    entry.subject,
    ...entry.headings.map((heading) => heading.text),
    basename(entry.path, extname(entry.path)),
  ].join(' ')

  return Array.from(
    new Set(
      raw
        .split(/[^A-Za-z0-9\u4e00-\u9fa5]+/)
        .map((word) => word.trim())
        .filter((word) => word.length >= 2 && word.length <= 28)
        .slice(0, 18),
    ),
  )
}

function uniqueKeywords(values, limit = 24) {
  return Array.from(
    new Set(
      values
        .flatMap((value) => String(value ?? '').split(/[^A-Za-z0-9\u4e00-\u9fa5]+/))
        .map((word) => word.trim())
        .filter((word) => word.length >= 2 && word.length <= 32),
    ),
  ).slice(0, limit)
}

function routeSample(route) {
  const subject = String(route.subject || '(unknown)')
  const domain = String(route.domain || '(general)')
  return {
    id: String(route.id ?? safeId(route.name ?? route.content ?? subject)),
    name: String(route.name ?? route.id ?? domain).slice(0, 120),
    subject,
    domain,
    type: String(route.type ?? 'route'),
    content: compactWhitespace(String(route.content ?? '')).slice(0, 360),
    keywords: (route.keywords ?? []).slice(0, 10),
    priority: Number(route.priority ?? 1),
  }
}

function routeToIndexEntry(route, rootConfig, selectedRoot, index) {
  const sample = routeSample(route)
  const aliases = Array.isArray(route.aliases) ? route.aliases : []
  const keywords = Array.isArray(route.keywords) ? route.keywords : []
  const negativeKeywords = Array.isArray(route.negative_keywords) ? route.negative_keywords : []
  const excerpt = sample.content || `${sample.domain} / ${sample.type}`
  const routePath = `${selectedRoot.relativePath}/route_index.json#${sample.id}`
  return {
    id: `${rootConfig.id}:route:${safeId(sample.id)}-${index}`,
    root_id: rootConfig.id,
    root_label: rootConfig.label,
    path: routePath,
    title: sample.name,
    subject: sample.subject ?? String(route.subject || '(unknown)'),
    extension: '.route',
    size_bytes: Buffer.byteLength(String(route.content ?? ''), 'utf8'),
    headings: [{ level: 2, text: sample.domain }],
    excerpt,
    depth: 2,
    route_id: String(sample.id),
    entry_type: 'route_record',
    route_domain: sample.domain,
    route_type: sample.type,
    priority: sample.priority,
    keywords: uniqueKeywords(
      [sample.id, sample.name, sample.subject, sample.domain, sample.type, ...aliases, ...keywords, ...negativeKeywords, excerpt],
      36,
    ),
  }
}

function buildIndex() {
  const entries = []
  const roots = []

  for (const rootConfig of knowledgeRoots) {
    const selectedRoot = selectKnowledgeRoot(rootConfig)
    const rootDir = join(projectRoot, selectedRoot.relativePath)
    const files = (rootConfig.directFilesOnly ? listDirectTextFiles(rootDir) : listTextFiles(rootDir)).sort()
    const routeIndex = rootConfig.id === 'jianmu' ? readJsonIfExists(`${selectedRoot.relativePath}/route_index.json`) : null
    const routeRecords = Array.isArray(routeIndex?.routes) ? routeIndex.routes : []
    const rootEntry = {
      id: rootConfig.id,
      label: rootConfig.label,
      path: selectedRoot.relativePath,
      sourceKind: selectedRoot.sourceKind,
      fileCount: files.length,
      routeRecordCount: routeRecords.length,
      color: rootConfig.color,
    }
    roots.push(rootEntry)

    for (const file of files) {
      const ext = extname(file).toLowerCase()
      const stat = statSync(file)
      const isText = isTextKnowledgeFile(file, ext)
      const text = isText ? readUtf8Preview(file, stat) : ''
      const relFromRoot = normalizePath(relative(rootDir, file))
      const relFromProject = `${selectedRoot.relativePath}/${relFromRoot}`
      const subject = topSubject(rootDir, file)
      const headings = isText ? extractHeadings(text) : []
      const entry = {
        id: `${rootConfig.id}:file:${safeId(relFromRoot)}-${safeId(ext.replace(/^\./, '') || 'noext')}`,
        root_id: rootConfig.id,
        root_label: rootConfig.label,
        path: relFromProject,
        title: extractTitle(file, text),
        subject,
        extension: ext || '(none)',
        size_bytes: stat.size,
        headings,
        excerpt: isText
          ? `${stat.size > maxTextReadBytes ? '[Preview first 1MB] ' : ''}${extractExcerpt(text, ext || '.txt')}`
          : extractExcerpt('', ext),
        depth: relFromRoot.split('/').length,
        route_id: `${rootConfig.id}/${safeId(subject)}`,
        entry_type: isText ? 'file' : 'asset',
      }
      entry.keywords = keywordCandidates(entry)
      entries.push(entry)
    }

    routeRecords.forEach((route, index) => {
      entries.push(routeToIndexEntry(route, rootConfig, selectedRoot, index))
    })
  }

  return { entries, roots }
}

function buildShards(entries, roots) {
  const shardMap = new Map()
  for (const entry of entries) {
    const key = `${entry.root_id}/${entry.subject}`
    if (!shardMap.has(key)) {
      shardMap.set(key, {
        shard_id: key,
        root_id: entry.root_id,
        root_label: entry.root_label,
        subject: entry.subject,
        route_id: `${entry.root_id}/${safeId(entry.subject)}`,
        entry_count: 0,
        file_count: 0,
        route_record_count: 0,
        total_size_bytes: 0,
        sample_files: [],
        sample_routes: [],
        top_headings: [],
        keywords: [],
      })
    }
    const shard = shardMap.get(key)
    shard.entry_count += 1
    if (entry.entry_type === 'route_record') {
      shard.route_record_count += 1
      if (shard.sample_routes.length < 12) {
        shard.sample_routes.push({
          id: entry.id,
          route_id: entry.route_id,
          title: entry.title,
          domain: entry.route_domain ?? '(general)',
          path: entry.path,
          excerpt: entry.excerpt,
          priority: entry.priority ?? 1,
        })
      }
    } else {
      shard.file_count += 1
      shard.total_size_bytes += entry.size_bytes
    }
    if (entry.entry_type !== 'route_record' && shard.sample_files.length < 8) {
      shard.sample_files.push({ id: entry.id, title: entry.title, path: entry.path, excerpt: entry.excerpt })
    }
    for (const heading of entry.headings) {
      if (shard.top_headings.length < 20) shard.top_headings.push({ file_id: entry.id, ...heading })
    }
    for (const keyword of entry.keywords) {
      if (!shard.keywords.includes(keyword) && shard.keywords.length < 28) shard.keywords.push(keyword)
    }
  }

  const shards = Array.from(shardMap.values()).sort((a, b) => {
    if (a.root_id !== b.root_id) return a.root_id.localeCompare(b.root_id)
    return b.entry_count - a.entry_count
  })

  const stats = {
    roots,
    sources: Array.from(new Set(roots.map((root) => root.sourceKind))),
    totalFiles: roots.reduce((sum, root) => sum + root.fileCount, 0),
    totalEntries: entries.length,
    totalRouteRecords: roots.reduce((sum, root) => sum + (root.routeRecordCount ?? 0), 0),
    shardCount: shards.length,
    totalSizeBytes: entries.reduce((sum, entry) => sum + entry.size_bytes, 0),
    generatedAt: new Date().toISOString(),
  }

  return { shards, stats }
}

function buildKnowledgeGraph(entries) {
  const backbone =
    readJsonIfExists('knowledge/建木知识网/backbone.json') ??
    readJsonIfExists('knowledge_backup/建木知识网/backbone.json')
  const routeIndex =
    readJsonIfExists('knowledge/建木知识网/route_index.json') ??
    readJsonIfExists('knowledge_backup/建木知识网/route_index.json')
  const crossDomain =
    readJsonIfExists('knowledge/建木知识网/associations/cross_domain.json') ??
    readJsonIfExists('knowledge_backup/建木知识网/associations/cross_domain.json')

  const routeRecords = Array.isArray(routeIndex?.routes) ? routeIndex.routes : []
  const routeSubjects = new Map()
  const routeDomains = new Map()
  for (const route of routeRecords) {
    const subject = route.subject || '(unknown)'
    const domain = route.domain || '(general)'
    const subjectRecord = routeSubjects.get(subject) ?? {
      subject,
      route_count: 0,
      domains: [],
      keywords: [],
      sample_routes: [],
    }
    subjectRecord.route_count += 1
    if (!subjectRecord.domains.includes(domain) && subjectRecord.domains.length < 24) subjectRecord.domains.push(domain)
    for (const keyword of route.keywords ?? []) {
      if (!subjectRecord.keywords.includes(keyword) && subjectRecord.keywords.length < 32) subjectRecord.keywords.push(keyword)
    }
    if (subjectRecord.sample_routes.length < 16) {
      subjectRecord.sample_routes.push({
        id: String(route.id ?? safeId(route.name ?? route.content ?? subject)),
        name: String(route.name ?? route.id ?? domain).slice(0, 120),
        domain,
        type: String(route.type ?? 'route'),
        content: compactWhitespace(String(route.content ?? '')).slice(0, 360),
        keywords: (route.keywords ?? []).slice(0, 10),
        priority: Number(route.priority ?? 1),
      })
    }
    routeSubjects.set(subject, subjectRecord)

    const domainKey = `${subject}/${domain}`
    const domainRecord = routeDomains.get(domainKey) ?? { subject, domain, route_count: 0 }
    domainRecord.route_count += 1
    routeDomains.set(domainKey, domainRecord)
  }

  const assetSummary = entries.reduce((acc, entry) => {
    if (entry.entry_type === 'route_record') return acc
    if (textExtensions.has(entry.extension) || entry.excerpt.startsWith('[Preview first 1MB] ') || entry.extension === '(none)') return acc
    acc.total += 1
    acc.by_extension[entry.extension] = (acc.by_extension[entry.extension] ?? 0) + 1
    return acc
  }, { total: 0, by_extension: {} })

  const languageTree = {
    tree_id: backbone?.tree_id ?? 'language_tree_root',
    name: backbone?.name ?? '语言大树 (Language Backbone)',
    description: backbone?.description ?? '',
    root: backbone?.structure?.root ?? '语言中枢',
    layers: (backbone?.structure?.layers ?? []).map((layer) => ({
      id: layer.id,
      name: layer.name,
      type: layer.type,
      parent: layer.parent ?? null,
      children: layer.children ?? [],
      rule_ref: layer.rule_ref ?? null,
    })),
    neurons: (backbone?.structure?.specific_neurons ?? []).map((neuron) => ({
      id: neuron.id,
      name: neuron.name,
      type: neuron.type,
      file: neuron.file ?? '',
      route: neuron.route ?? '',
      total_entries: neuron.total_entries ?? null,
      domains: neuron.domains ?? [],
      description: neuron.description ?? '',
    })),
    abstraction_rules: (backbone?.structure?.abstraction_rules ?? []).map((rule) => ({
      id: rule.id,
      name: rule.name,
      rule: rule.rule,
      examples: rule.examples ?? [],
    })),
  }

  return {
    languageTree,
    routeStats: {
      total_routes: routeRecords.length,
      manual_routes: routeIndex?.stats?.manual ?? 0,
      stats: routeIndex?.stats ?? {},
      subjects: Array.from(routeSubjects.values()).sort((a, b) => b.route_count - a.route_count),
      domains: Array.from(routeDomains.values()).sort((a, b) => b.route_count - a.route_count).slice(0, 200),
    },
    associations: {
      cross_domain_count: Array.isArray(crossDomain) ? crossDomain.length : 0,
      cross_domain: (Array.isArray(crossDomain) ? crossDomain : []).slice(0, 96).map((item) => ({
        id: String(item.id ?? safeId(item.name ?? 'cross')),
        name: String(item.name ?? ''),
        from: String(item.from ?? ''),
        to: String(item.to ?? ''),
        insight: compactWhitespace(String(item.insight ?? '')).slice(0, 360),
      })),
    },
    sourceCoverage: {
      indexed_files: entries.filter((entry) => entry.entry_type !== 'route_record').length,
      route_records: entries.filter((entry) => entry.entry_type === 'route_record').length,
      asset_files: assetSummary.total,
      asset_by_extension: assetSummary.by_extension,
    },
  }
}

function nodeRadiusWeight(fileCount) {
  return Math.min(1, 0.28 + Math.log10(fileCount + 1) / 2.1)
}

function isLanguageShard(shard) {
  const text = `${shard.root_id}/${shard.subject}/${shard.route_id}/${shard.keywords.join(' ')}`.toLowerCase()
  return text.includes('language') || text.includes('语言') || text.includes('语文')
}

function languageLinkType(shard) {
  if (shard.subject === 'language' || shard.subject.includes('语言') || shard.subject === '语文') return 'language_trunk'
  if (shard.subject.includes('language_tree') || shard.subject.includes('multimodal') || shard.subject === '(root)') {
    return 'language_binding'
  }
  return 'language_growth'
}

function linkRiskLevel(type) {
  if (type.includes('conflict') || type.includes('deprecated') || type.includes('negative')) return 'risk'
  if (type.includes('failure') || type.includes('lesson') || type.includes('recurrence')) return 'lesson'
  if (type.includes('risk') || type.includes('stale') || type.includes('evaluation_loop')) return 'watch'
  return 'stable'
}

function makeLink(source, target, type, strength, color) {
  return { source, target, type, strength, color, riskLevel: linkRiskLevel(type) }
}

function buildUniverse(entries, roots, shards, graph) {
  const nodes = []
  const links = []

  nodes.push({
    id: languageCenterId,
    label: '语言树 / Language Backbone',
    kind: 'core',
    subject: 'language_tree',
    shard_id: 'jianmu/language',
    file_path: 'knowledge/建木知识网/backbone.json',
    weight: 1,
    color: '#0f766e',
    position: [0, 0, 0],
  })

  nodes.push({
    id: 'knowledge-super-root',
    label: 'FAME 工程总控',
    kind: 'bridge',
    subject: 'governance',
    shard_id: 'all',
    file_path: roots.map((root) => root.path).join(' + '),
    weight: 0.82,
    color: '#101828',
    position: [0, -6.4, 0],
  })
  links.push(makeLink(languageCenterId, 'knowledge-super-root', 'fame_governance', 0.9, '#101828'))

  languageLayerNodes.forEach((node, index) => {
    nodes.push({
      ...node,
      kind: 'bridge',
      shard_id: 'jianmu/language',
      weight: 0.7,
      color: colors[index % colors.length],
    })
    links.push(makeLink(languageCenterId, node.id, index === 0 ? 'language_trunk' : 'language_binding', 0.92, '#0f766e'))
  })

  const neuronLayerMap = {
    lexicon: 'language-layer-lexicon',
    grammar: 'language-layer-grammar',
    semantics: 'language-layer-semantics',
  }
  graph.languageTree.neurons.forEach((neuron, index) => {
    const parentId = neuronLayerMap[neuron.type] ?? 'language-layer-entry'
    const angle = (index / Math.max(graph.languageTree.neurons.length, 1)) * Math.PI * 2
    const radius = 7.8
    const nodeId = `language-neuron-${safeId(neuron.id)}`
    nodes.push({
      id: nodeId,
      label: neuron.name,
      kind: 'bridge',
      subject: neuron.type,
      shard_id: 'jianmu/language',
      file_path: `knowledge/建木知识网/${neuron.file}`,
      weight: neuron.total_entries ? 0.92 : 0.58,
      color: colors[(index + 4) % colors.length],
      position: [Math.cos(angle) * radius, 6.8 + (index % 2) * 1.4, Math.sin(angle) * radius],
    })
    links.push(makeLink(parentId, nodeId, 'language_neuron', 0.78, '#0f766e'))
  })

  roots.forEach((root, index) => {
    const angle = (index / Math.max(roots.length, 1)) * Math.PI * 2
    const radius = 10
    const rootNodeId = `root-${root.id}`
    nodes.push({
      id: rootNodeId,
      label: root.label,
      kind: 'root',
      subject: root.id,
      shard_id: root.id,
      file_path: root.path,
      weight: nodeRadiusWeight(root.fileCount),
      color: root.color,
      position: [Math.cos(angle) * radius, -1.5, Math.sin(angle) * radius],
    })
    links.push(makeLink(languageCenterId, rootNodeId, root.id === 'jianmu' ? 'language_trunk' : 'language_growth', 1, root.color))
    links.push(makeLink('knowledge-super-root', rootNodeId, 'knowledge_root', 0.68, root.color))
  })

  shards.forEach((shard, index) => {
    const rootIndex = roots.findIndex((root) => root.id === shard.root_id)
    const rootAngle = (rootIndex / Math.max(roots.length, 1)) * Math.PI * 2
    const shardAngle = rootAngle + ((index % 37) / 37) * Math.PI * 1.5 - Math.PI * 0.75
    const layer = index % 4
    const languageAnchored = isLanguageShard(shard)
    const radius = languageAnchored ? 12 + layer * 2.8 : 21 + layer * 6 + Math.floor(index / 37) * 8
    const y = languageAnchored ? ((index % 5) - 2) * 2 : ((index % 7) - 3) * 2.8
    const color = colors[index % colors.length]
    const subjectNodeId = `subject-${safeId(shard.shard_id)}`
    const rootNodeId = `root-${shard.root_id}`
    const subjectPosition = [Math.cos(shardAngle) * radius, y, Math.sin(shardAngle) * radius]

    nodes.push({
      id: subjectNodeId,
      label: shard.subject === '(root)' ? `${shard.root_label} 根协议` : shard.subject,
      kind: 'subject',
      subject: shard.subject,
      shard_id: shard.shard_id,
      file_path: `${shard.root_label}/${shard.subject}`,
      weight: nodeRadiusWeight(shard.file_count + (graph.routeStats.subjects.find((item) => item.subject === shard.subject)?.route_count ?? 0)),
      color,
      position: subjectPosition,
    })
    links.push(makeLink(rootNodeId, subjectNodeId, 'route_shard', 0.72, color))
    if (languageAnchored || shard.subject === '(root)' || graph.routeStats.subjects.some((item) => item.subject === shard.subject)) {
      links.push(makeLink(languageCenterId, subjectNodeId, languageLinkType(shard), 0.88, '#0f766e'))
    }

    shard.sample_files.slice(0, 6).forEach((file, fileIndex) => {
      const localAngle = (fileIndex / Math.max(Math.min(shard.sample_files.length, 6), 1)) * Math.PI * 2
      const localRadius = 3.1 + (fileIndex % 3) * 1.15
      const nodeId = `file-${safeId(file.id || file.path)}-${fileIndex}`
      nodes.push({
        id: nodeId,
        label: file.title,
        kind: 'file',
        subject: shard.subject,
        shard_id: shard.shard_id,
        file_path: file.path,
        weight: 0.38,
        color,
        position: [
          subjectPosition[0] + Math.cos(localAngle) * localRadius,
          subjectPosition[1] + ((fileIndex % 4) - 1.5) * 1.05,
          subjectPosition[2] + Math.sin(localAngle) * localRadius,
        ],
      })
      links.push(makeLink(subjectNodeId, nodeId, 'sample_file', 0.45, color))
    })
  })

  for (const [source, target, type] of crossSubjectLinks) {
    for (const root of roots) {
      const sourceId = `subject-${safeId(`${root.id}/${source}`)}`
      const targetId = `subject-${safeId(`${root.id}/${target}`)}`
      if (nodes.some((node) => node.id === sourceId) && nodes.some((node) => node.id === targetId)) {
        links.push(makeLink(sourceId, targetId, type, 0.82, '#b94e70'))
      }
    }
  }

  return { nodes, links }
}

function emitUniverse(nodes, links, stats) {
  return `// Generated by scripts/build-knowledge-universe.mjs. Do not edit by hand.
export type UniverseNodeKind = 'core' | 'root' | 'subject' | 'file' | 'bridge'

export type UniverseNode = {
  id: string
  label: string
  kind: UniverseNodeKind
  subject: string
  shard_id: string
  file_path: string
  weight: number
  color: string
  position: [number, number, number]
}

export type UniverseLink = {
  source: string
  target: string
  type: string
  strength: number
  color: string
  riskLevel: 'stable' | 'watch' | 'risk' | 'lesson'
}

export const universeNodes = ${JSON.stringify(nodes, null, 2)} satisfies UniverseNode[]

export const universeLinks = ${JSON.stringify(links, null, 2)} satisfies UniverseLink[]

export const universeStats = ${JSON.stringify({
    source: stats.sources.join('+'),
    rootCount: stats.roots.length,
    totalIndexedFiles: stats.totalFiles,
    shardCount: stats.shardCount,
    totalSizeBytes: stats.totalSizeBytes,
    nodeCount: nodes.length,
    linkCount: links.length,
    generatedAt: stats.generatedAt,
  }, null, 2)}
`
}

function emitIndex() {
  return `// Generated by scripts/build-knowledge-universe.mjs. Do not edit by hand.
export type KnowledgeHeading = {
  level: number
  text: string
}

export type KnowledgeIndexEntry = {
  id: string
  root_id: string
  root_label: string
  path: string
  title: string
  subject: string
  extension: string
  size_bytes: number
  headings: KnowledgeHeading[]
  excerpt: string
  depth: number
  route_id: string
  keywords: string[]
  entry_type: 'file' | 'asset' | 'route_record'
  route_domain?: string
  route_type?: string
  priority?: number
}

export type KnowledgeShardSummary = {
  shard_id: string
  root_id: string
  root_label: string
  subject: string
  route_id: string
  entry_count: number
  file_count: number
  route_record_count: number
  total_size_bytes: number
  sample_files: Array<{ id: string; title: string; path: string; excerpt: string }>
  sample_routes: Array<{ id: string; route_id: string; title: string; domain: string; path: string; excerpt: string; priority: number }>
  top_headings: Array<{ file_id: string; level: number; text: string }>
  keywords: string[]
}

export type KnowledgeRootSummary = {
  id: string
  label: string
  path: string
  sourceKind: string
  fileCount: number
  routeRecordCount: number
  color: string
}

export type KnowledgeIndexStats = {
  roots: KnowledgeRootSummary[]
  sources: string[]
  totalFiles: number
  totalEntries: number
  totalRouteRecords: number
  shardCount: number
  totalSizeBytes: number
  generatedAt: string
}

export type KnowledgeIndexPayload = {
  entries: KnowledgeIndexEntry[]
  shards: KnowledgeShardSummary[]
  stats: KnowledgeIndexStats
}

const knowledgeIndexUrl = \`\${import.meta.env.BASE_URL}generated/knowledgeIndex.generated.json\`

let cachedKnowledgeIndex: Promise<KnowledgeIndexPayload> | null = null

export function loadKnowledgeIndex() {
  cachedKnowledgeIndex ??= fetch(knowledgeIndexUrl).then((response) => {
    if (!response.ok) throw new Error(\`Failed to load knowledge index: \${response.status} \${response.statusText}\`)
    return response.json() as Promise<KnowledgeIndexPayload>
  })
  return cachedKnowledgeIndex
}
`
}

function emitIndexJson(entries, shards, stats) {
  return JSON.stringify({ entries, shards, stats }, null, 2)
}

function emitGraphJson(graph) {
  return JSON.stringify({
    languageTreeGraph: graph.languageTree,
    routeGraphStats: graph.routeStats,
    associationGraph: graph.associations,
    knowledgeSourceCoverage: graph.sourceCoverage,
  }, null, 2)
}

function emitGraph() {
  return `// Generated by scripts/build-knowledge-universe.mjs. Do not edit by hand.
export type KnowledgeRouteSample = {
  id: string
  name: string
  domain: string
  type: string
  content: string
  keywords: string[]
  priority: number
}

export type KnowledgeRouteSubject = {
  subject: string
  route_count: number
  domains: string[]
  keywords: string[]
  sample_routes: KnowledgeRouteSample[]
}

export type RouteGraphStats = {
  total_routes: number
  manual_routes: number
  stats: Record<string, unknown>
  subjects: KnowledgeRouteSubject[]
  domains: Array<{ subject: string; domain: string; route_count: number }>
}

export type AssociationGraph = {
  cross_domain_count: number
  cross_domain: Array<{ id: string; name: string; from: string; to: string; insight: string }>
}

export type KnowledgeSourceCoverage = {
  indexed_files: number
  route_records: number
  asset_files: number
  asset_by_extension: Record<string, number>
}

export type LanguageTreeGraph = {
  id: string
  name: string
  [key: string]: unknown
}

export type KnowledgeGraphPayload = {
  languageTreeGraph: LanguageTreeGraph
  routeGraphStats: RouteGraphStats
  associationGraph: AssociationGraph
  knowledgeSourceCoverage: KnowledgeSourceCoverage
}

const knowledgeGraphUrl = \`\${import.meta.env.BASE_URL}generated/knowledgeGraph.generated.json\`

let cachedKnowledgeGraph: Promise<KnowledgeGraphPayload> | null = null

export function loadKnowledgeGraph() {
  cachedKnowledgeGraph ??= fetch(knowledgeGraphUrl).then((response) => {
    if (!response.ok) throw new Error(\`Failed to load knowledge graph: \${response.status} \${response.statusText}\`)
    return response.json() as Promise<KnowledgeGraphPayload>
  })
  return cachedKnowledgeGraph
}
`
}

const { entries, roots } = buildIndex()
const { shards, stats } = buildShards(entries, roots)
const graph = buildKnowledgeGraph(entries)
const { nodes, links } = buildUniverse(entries, roots, shards, graph)

mkdirSync(outDir, { recursive: true })
mkdirSync(publicGeneratedDir, { recursive: true })
writeFileSync(universeOutFile, emitUniverse(nodes, links, stats), 'utf8')
writeFileSync(indexOutFile, emitIndex(), 'utf8')
writeFileSync(graphOutFile, emitGraph(), 'utf8')
writeFileSync(indexJsonOutFile, emitIndexJson(entries, shards, stats), 'utf8')
writeFileSync(graphJsonOutFile, emitGraphJson(graph), 'utf8')
console.log(
  `Generated ${relative(process.cwd(), universeOutFile)}, ${relative(process.cwd(), indexOutFile)}, ${relative(process.cwd(), graphOutFile)}, ${relative(process.cwd(), indexJsonOutFile)} and ${relative(process.cwd(), graphJsonOutFile)} with ${stats.totalFiles} indexed files, ${stats.totalRouteRecords} route records, ${entries.length} runtime entries, ${shards.length} shards, ${nodes.length} universe nodes, ${links.length} links.`,
)
