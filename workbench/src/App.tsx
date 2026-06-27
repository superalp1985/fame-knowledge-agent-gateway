import { type ReactNode, useEffect, useMemo, useState } from 'react'
import {
  Background,
  Controls,
  Handle,
  MarkerType,
  MiniMap,
  Position,
  ReactFlow,
  type Edge,
  type Node,
  type NodeProps,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import {
  Activity,
  Binary,
  BookOpen,
  BrainCircuit,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock3,
  Crosshair,
  FileText,
  GitBranch,
  Layers3,
  Network,
  Orbit,
  Pencil,
  Plus,
  Radar,
  Route,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Save,
  Trash2,
} from 'lucide-react'
import './App.css'
import { KnowledgeUniverse3D } from './KnowledgeUniverse3D'
import {
  loadProjectMemory,
  type ProjectMemoryPayload,
  type ProjectMemoryProject,
} from './generated/projectMemory.generated'
import {
  loadMultimodalAssets,
  type MultimodalAssetPayload,
  type MultimodalAssetSyncItem,
} from './generated/multimodalAssets.generated'
import {
  loadV13Runtime,
  type V13RuntimePayload,
} from './generated/v13Runtime.generated'
import {
  loadKnowledgeIndex,
  type KnowledgeIndexEntry,
  type KnowledgeIndexPayload,
  type KnowledgeShardSummary,
} from './generated/knowledgeIndex.generated'
import {
  loadKnowledgeGraph,
  type AssociationGraph,
  type KnowledgeGraphPayload,
  type KnowledgeSourceCoverage,
  type RouteGraphStats,
} from './generated/knowledgeGraph.generated'
import { universeLinks, universeNodes, universeStats, type UniverseNode } from './generated/knowledgeUniverse.generated'
import {
  activeGoalGate,
  defaultScope,
  fameEdges,
  fameTimeseriesPoints,
  fullMemoryRetentionStates,
  moduleDebugStates,
  physicalFeedbackEvents,
  routePosteriorState,
  routeNodes,
  seedProposals,
  syncOutboxEvents,
  temporalTruthEdges,
  traceSpanEvents,
} from './sampleData'
import {
  buildGoalPath,
  edgeHeatColor,
  edgeRiskLabel,
  edgeRiskLevel,
  edgeStrokePattern,
  kappaEff,
  routeScore,
} from './routeEngine'
import {
  agentConnectors,
  buildActionProposal,
  buildContextPackPreview,
  buildSemanticAssociationProposals,
  buildThinkingStages,
  previewApprovedAction,
} from './agentRuntime'
import type { FameEdgeState, FameKey, KnowledgePatchProposal, RouteNode, Scope } from './model'

type ViewMode = 'universe' | 'directory' | 'route' | 'agent' | 'project' | 'assets' | 'v13' | 'fame' | 'traversal' | 'patch' | 'debug'

type SearchResultKind =
  | 'universe-node'
  | 'knowledge-shard'
  | 'knowledge-file'
  | 'knowledge-route'
  | 'route-node'
  | 'fame-edge'
  | 'project-memory'
  | 'multimodal-asset'
  | 'v13-runtime'

type SearchResult = {
  id: string
  kind: SearchResultKind
  label: string
  detail: string
  score: number
  universeNodeId?: string
  shardId?: string
  entryId?: string
  routeNodeId?: string
  edgeId?: string
  projectId?: string
  assetId?: string
  v13Target?: 'fame' | 'scac' | 'posterior' | 'memory' | 'truth' | 'outbox' | 'trace'
}

type V13Focus = NonNullable<SearchResult['v13Target']>

type RouteDraft = {
  scopeKey: string
  nodes: RouteNode[]
  edges: FameEdgeState[]
}

type RuntimeAssetSyncItem = MultimodalAssetSyncItem & {
  source: 'asset_store' | 'runtime_patch'
  proposal?: KnowledgePatchProposal
}

type RuntimeDataStatus = 'loading' | 'ready' | 'error'

type DirectorySyncStatus = 'clean' | 'synced' | 'pending' | 'review' | 'outbox' | 'blocked'

const emptyV13Runtime: V13RuntimePayload = {
  manifest: {
    runtime_id: 'fame-v13-theory-runtime',
    version: '13.0.0',
    project_id: 'fame-agent-gateway',
    memory_policy: 'full_retention_context_distillation',
    policy: {},
    roots: {},
  },
  fameTimeseries: fameTimeseriesPoints,
  physicalFeedback: physicalFeedbackEvents,
  routePosterior: routePosteriorState,
  fullMemoryRetention: fullMemoryRetentionStates,
  temporalTruth: temporalTruthEdges,
  syncOutbox: syncOutboxEvents,
  traceSpans: traceSpanEvents,
  stats: {
    fame_timeseries_count: fameTimeseriesPoints.length,
    physical_feedback_count: physicalFeedbackEvents.length,
    route_candidate_count: routePosteriorState.candidates.length,
    full_memory_retention_count: fullMemoryRetentionStates.length,
    temporal_truth_count: temporalTruthEdges.length,
    sync_outbox_count: syncOutboxEvents.length,
    sync_outbox_pending_count: syncOutboxEvents.filter((event) => !['applied', 'replayed'].includes(event.status)).length,
    trace_span_count: traceSpanEvents.length,
    scac_contraction_rate: 0,
    posterior_entropy_drop_avg: 0,
    generated_at: '',
  },
}

const emptyProjectMemory: ProjectMemoryPayload = {
  projects: [],
  stats: {
    project_count: 0,
    total_nodes: 0,
    total_edges: 0,
    total_promotion_candidates: 0,
    generated_at: '',
  },
}

const emptyMultimodalAssets: MultimodalAssetPayload = {
  manifest: {
    store_id: 'fame-multimodal-asset-store',
    policy: {},
    roots: {},
  },
  indexes: [],
  edges: [],
  extractionRuns: [],
  fameHistory: [],
  syncQueue: [],
  stats: {
    asset_count: 0,
    index_count: 0,
    edge_count: 0,
    extraction_run_count: 0,
    fame_history_count: 0,
    sync_queue_count: 0,
    pending_sync_count: 0,
    modality_counts: {},
    extraction_status_counts: {},
    avg_fame: {
      mu: 0,
      chi: 0,
      epsilon: 0,
      kappa: 0,
      nu: 0,
      delta: 0,
      rho: 0,
      lambda: 0,
    },
    generated_at: '',
  },
}

const emptyKnowledgeIndex: KnowledgeIndexPayload = {
  entries: [],
  shards: [],
  stats: {
    roots: [],
    sources: [],
    totalFiles: 0,
    totalEntries: 0,
    totalRouteRecords: 0,
    shardCount: 0,
    totalSizeBytes: 0,
    generatedAt: '',
  },
}

const emptyRouteGraphStats: RouteGraphStats = {
  total_routes: 0,
  manual_routes: 0,
  stats: {},
  subjects: [],
  domains: [],
}

const emptyAssociationGraph: AssociationGraph = {
  cross_domain_count: 0,
  cross_domain: [],
}

const emptyKnowledgeSourceCoverage: KnowledgeSourceCoverage = {
  indexed_files: 0,
  route_records: 0,
  asset_files: 0,
  asset_by_extension: {},
}

const emptyKnowledgeGraph: KnowledgeGraphPayload = {
  languageTreeGraph: { id: 'language_tree_root', name: 'Language Backbone' },
  routeGraphStats: emptyRouteGraphStats,
  associationGraph: emptyAssociationGraph,
  knowledgeSourceCoverage: emptyKnowledgeSourceCoverage,
}

const viewLabels: Record<ViewMode, string> = {
  universe: '3D Knowledge Universe',
  directory: 'Knowledge Directory',
  route: '2D Detail',
  agent: 'Agent Runtime',
  project: 'Project Memory',
  assets: 'Multimodal Assets',
  v13: 'v13 Runtime',
  fame: 'FAME Heatmap',
  traversal: 'GoalGate',
  patch: 'Patch Entry',
  debug: 'Module Debug',
}

const fameKeys: FameKey[] = ['mu', 'chi', 'epsilon', 'kappa', 'nu', 'delta', 'rho', 'lambda']

const patchPresets: Array<{
  type: KnowledgePatchProposal['patch_type']
  label: string
  summary: string
  section: string
  fame: string
}> = [
  {
    type: 'add_route',
    label: '添加路线',
    summary: '为当前知识分片补充一条可被 GoalGate 使用的新路线。',
    section: 'route/new',
    fame: 'mu=0.58, chi=0.72, epsilon=0.68, kappa=0.42, nu=0.32, delta=0.10, rho=0.22, lambda=0.08',
  },
  {
    type: 'add_edge',
    label: '添加联想',
    summary: '把当前知识点和另一个学科/抽象层建立可验证联想边。',
    section: 'association/new',
    fame: 'mu=0.50, chi=0.82, epsilon=0.70, kappa=0.38, nu=0.40, delta=0.12, rho=0.24, lambda=0.10',
  },
  {
    type: 'add_lesson',
    label: '记录教训',
    summary: '把失败、冲突或低新鲜度线路记录成可复盘的 FAME 教训。',
    section: 'lesson/failure',
    fame: 'mu=0.30, chi=0.62, epsilon=0.55, kappa=0.30, nu=0.72, delta=0.58, rho=0.48, lambda=0.78',
  },
  {
    type: 'update_tool_manual',
    label: '工具说明',
    summary: '更新一次性工具说明书，减少下一次调用参数错误。',
    section: 'tool/manual',
    fame: 'mu=0.62, chi=0.40, epsilon=0.74, kappa=0.66, nu=0.22, delta=0.08, rho=0.18, lambda=0.06',
  },
  {
    type: 'deprecate_edge',
    label: '弃用路线',
    summary: '标记一条不再可靠或负值过高的路线，保留为反例和剪枝证据。',
    section: 'route/deprecate',
    fame: 'mu=0.22, chi=0.45, epsilon=0.45, kappa=0.28, nu=0.68, delta=0.72, rho=0.52, lambda=0.70',
  },
]

const nodeIcons: Record<RouteNode['kind'], ReactNode> = {
  intent: <Crosshair size={16} />,
  association: <BrainCircuit size={16} />,
  abstraction: <Layers3 size={16} />,
  rule: <SlidersHorizontal size={16} />,
  tool: <Binary size={16} />,
  quality: <ShieldCheck size={16} />,
  summary: <Activity size={16} />,
  lesson: <Radar size={16} />,
}

function RouteCardNode({ data, selected }: NodeProps<Node<RouteNode>>) {
  const item = data
  return (
    <div className={`route-node route-node-${item.kind} ${selected ? 'is-selected' : ''}`}>
      <Handle type="target" position={Position.Left} />
      <div className="route-node-head">
        <span>{nodeIcons[item.kind]}</span>
        <strong>{item.label}</strong>
      </div>
      <p>{item.summary}</p>
      <small>{item.source_ref}</small>
      <Handle type="source" position={Position.Right} />
    </div>
  )
}

const nodeTypes = { routeCard: RouteCardNode }

function routeScopeForShard(shard?: KnowledgeShardSummary): Scope {
  if (!shard) return defaultScope
  const subject = shard.subject === '(root)' ? shard.root_id : shard.subject
  return {
    ...defaultScope,
    subject,
    domain: shard.root_label,
    route_id: shard.route_id,
    task_id: `inspect-${shard.shard_id.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]+/g, '-')}`,
  }
}

function routeEntryNodeId(entryId: string) {
  return `local-route-entry-${entryId.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]+/g, '-')}`.slice(0, 150)
}

function makeRouteNodeFromEntry(entry: KnowledgeIndexEntry, index: number, focused: boolean, scope: Scope): RouteNode {
  return {
    id: routeEntryNodeId(entry.id),
    label: focused ? `★ ${entry.title}` : entry.title,
    kind: index % 3 === 0 ? 'rule' : 'abstraction',
    subject: scope.subject,
    route_id: entry.route_id,
    summary: entry.excerpt || `${entry.route_domain ?? 'route'} / ${entry.route_type ?? entry.extension}`,
    source_ref: entry.path,
    position: { x: 300 + (index % 3) * 280, y: 465 + Math.floor(index / 3) * 145 },
  }
}

function makeLocalRouteNodes(
  selectedUniverseNode: UniverseNode,
  routeGraphStats: RouteGraphStats,
  shard?: KnowledgeShardSummary,
  routeEntries: KnowledgeIndexEntry[] = [],
  focusedRouteEntryId: string | null = null,
): RouteNode[] {
  if (!shard) {
    return routeNodes.map((node) =>
      node.id === 'association-jianshu'
        ? {
            ...node,
            label: selectedUniverseNode.label,
            summary: selectedUniverseNode.file_path || '当前 3D 节点暂未绑定知识分片，保留默认路线用于调试。',
            source_ref: selectedUniverseNode.file_path || node.source_ref,
          }
        : node,
    )
  }

  const scope = routeScopeForShard(shard)
  const sampleFiles = shard.sample_files.slice(0, 5)
  const routeSubject = routeGraphStats.subjects.find((item) => item.subject === shard.subject)
  const focusedRouteEntry = routeEntries.find((entry) => entry.id === focusedRouteEntryId)
  const rankedRouteEntries = [...routeEntries].sort(
    (a, b) => (b.priority ?? 1) - (a.priority ?? 1) || a.title.localeCompare(b.title),
  )
  const routeEntriesForGraph = focusedRouteEntry
    ? [focusedRouteEntry, ...rankedRouteEntries.filter((entry) => entry.id !== focusedRouteEntry.id).slice(0, 11)]
    : rankedRouteEntries.slice(0, 12)
  const routeSamples = routeEntriesForGraph.length > 0 ? [] : routeSubject?.sample_routes.slice(0, 6) ?? []
  const topKeywords = shard.keywords.slice(0, 8).join(' / ') || '等待补充关键词'
  const baseNodes: RouteNode[] = [
    {
      id: 'local-language-tree',
      label: '语言树主干',
      kind: 'intent',
      subject: scope.subject,
      route_id: scope.route_id,
      summary: '所有知识先回到语言树中枢，再按学科、抽象和工程目标生长。',
      source_ref: 'knowledge/建木知识网/backbone.json',
      position: { x: 20, y: 145 },
    },
    {
      id: 'local-shard',
      label: shard.subject === '(root)' ? `${shard.root_label} 根协议` : shard.subject,
      kind: 'association',
      subject: scope.subject,
      route_id: scope.route_id,
      summary: `${shard.file_count} 个文件，${routeSubject?.route_count ?? 0} 条路线，关键词：${topKeywords}`,
      source_ref: `${shard.root_label}/${shard.subject}`,
      position: { x: 300, y: 115 },
    },
    {
      id: 'local-abstraction',
      label: '抽象与联想',
      kind: 'abstraction',
      subject: scope.subject,
      route_id: scope.route_id,
      summary: '从当前分片抽取概念、规则、跨域类比和可验证工程路线。',
      source_ref: 'knowledge/*/language_tree_links',
      position: { x: 580, y: 40 },
    },
    {
      id: 'local-goalgate',
      label: '找球门遍历',
      kind: 'rule',
      subject: scope.subject,
      route_id: scope.route_id,
      summary: '按 project_id / subject / route_id 限定 top-k 候选，并保留剪枝原因。',
      source_ref: '方案设计/09_可视化工作台_联想机制_找球门遍历.md',
      position: { x: 860, y: 70 },
    },
    {
      id: 'local-quality',
      label: '质量门与强制执行',
      kind: 'quality',
      subject: scope.subject,
      route_id: scope.route_id,
      summary: 'proposal/review、工具说明书按需读取、ApprovedAction 才能执行。',
      source_ref: '方案设计/08_完整版实施蓝图.md',
      position: { x: 1140, y: 80 },
    },
    {
      id: 'local-patch',
      label: '图形化补知识',
      kind: 'summary',
      subject: scope.subject,
      route_id: scope.route_id,
      summary: '把新增路线、联想、失败教训或工具说明以 KnowledgePatchProposal 提交。',
      source_ref: sampleFiles[0]?.path ?? shard.route_id,
      position: { x: 1140, y: 245 },
    },
    {
      id: 'local-lesson',
      label: '负值 FAME 教训',
      kind: 'lesson',
      subject: scope.subject,
      route_id: scope.route_id,
      summary: 'delta / lambda / nu 高的线路不丢弃，转成醒目的风险边和复盘入口。',
      source_ref: '方案设计/04_FAME公式与参数.md',
      position: { x: 860, y: 270 },
    },
  ]

  const fileNodes: RouteNode[] = sampleFiles.map((file, index) => ({
    id: `local-file-${index}`,
    label: file.title,
    kind: index % 2 === 0 ? 'tool' : 'association',
    subject: scope.subject,
    route_id: scope.route_id,
    summary: file.excerpt || '样例文件，双层搜索可定位到该知识源。',
    source_ref: file.path,
    position: { x: 575 + (index % 2) * 280, y: 190 + Math.floor(index / 2) * 150 },
  }))

  const routeSampleNodes: RouteNode[] = routeSamples.map((route, index) => ({
    id: `local-route-${index}`,
    label: route.name,
    kind: index % 3 === 0 ? 'rule' : 'abstraction',
    subject: scope.subject,
    route_id: String(route.id),
    summary: route.content || `${route.domain} / ${route.type}`,
    source_ref: `knowledge/建木知识网/route_index.json#${route.id}`,
    position: { x: 300 + (index % 3) * 280, y: 465 + Math.floor(index / 3) * 145 },
  }))

  const routeEntryNodes = routeEntriesForGraph.map((entry, index) =>
    makeRouteNodeFromEntry(entry, index, entry.id === focusedRouteEntry?.id, scope),
  )

  return [...baseNodes, ...fileNodes, ...routeEntryNodes, ...routeSampleNodes]
}

function makeLocalFameEdges(nodes: RouteNode[], shard?: KnowledgeShardSummary): FameEdgeState[] {
  if (!shard) return fameEdges
  const scope = routeScopeForShard(shard)
  const edges: FameEdgeState[] = [
    {
      edge_id: 'local-edge-language-shard',
      source_id: 'local-language-tree',
      target_id: 'local-shard',
      relation_type: 'routes_to',
      scope,
      fame: { mu: 0.84, chi: 0.72, epsilon: 0.8, kappa: 0.72, nu: 0.18, delta: 0.04, rho: 0.2, lambda: 0.06 },
      dynamics: { xi: 0.76, freshness: 0.96, half_life_days: 90, last_verified_at: '2026-06-27' },
      evidence: { success_count: 5, failure_count: 0, conflict_count: 0, lesson_count: 0, source_refs: ['knowledge/建木知识网/backbone.json'], log_refs: [] },
    },
    {
      edge_id: 'local-edge-shard-abstraction',
      source_id: 'local-shard',
      target_id: 'local-abstraction',
      relation_type: 'supports',
      scope,
      fame: { mu: 0.68, chi: 0.86, epsilon: 0.76, kappa: 0.58, nu: 0.38, delta: 0.12, rho: 0.25, lambda: 0.18 },
      dynamics: { xi: 0.72, freshness: 0.9, half_life_days: 60, last_verified_at: '2026-06-27' },
      evidence: { success_count: 3, failure_count: 1, conflict_count: 0, lesson_count: 1, source_refs: shard.sample_files.slice(0, 2).map((file) => file.path), log_refs: [] },
    },
    {
      edge_id: 'local-edge-abstraction-goalgate',
      source_id: 'local-abstraction',
      target_id: 'local-goalgate',
      relation_type: 'routes_to',
      scope,
      fame: { mu: 0.72, chi: 0.78, epsilon: 0.82, kappa: 0.67, nu: 0.32, delta: 0.08, rho: 0.38, lambda: 0.12 },
      dynamics: { xi: 0.66, freshness: 0.93, half_life_days: 45, last_verified_at: '2026-06-27' },
      evidence: { success_count: 3, failure_count: 0, conflict_count: 0, lesson_count: 1, source_refs: ['方案设计/09_可视化工作台_联想机制_找球门遍历.md'], log_refs: [] },
    },
    {
      edge_id: 'local-edge-goalgate-quality',
      source_id: 'local-goalgate',
      target_id: 'local-quality',
      relation_type: 'supports',
      scope,
      fame: { mu: 0.78, chi: 0.5, epsilon: 0.82, kappa: 0.76, nu: 0.18, delta: 0.06, rho: 0.22, lambda: 0.06 },
      dynamics: { xi: 0.64, freshness: 0.94, half_life_days: 90, last_verified_at: '2026-06-27' },
      evidence: { success_count: 4, failure_count: 0, conflict_count: 0, lesson_count: 0, source_refs: ['方案设计/08_完整版实施蓝图.md'], log_refs: [] },
    },
    {
      edge_id: 'local-edge-quality-patch',
      source_id: 'local-quality',
      target_id: 'local-patch',
      relation_type: 'summarizes_to',
      scope,
      fame: { mu: 0.7, chi: 0.66, epsilon: 0.8, kappa: 0.62, nu: 0.24, delta: 0.1, rho: 0.2, lambda: 0.08 },
      dynamics: { xi: 0.6, freshness: 0.91, half_life_days: 40, last_verified_at: '2026-06-27' },
      evidence: { success_count: 2, failure_count: 0, conflict_count: 0, lesson_count: 1, source_refs: [shard.sample_files[0]?.path ?? shard.route_id], log_refs: [] },
    },
    {
      edge_id: 'local-edge-risk-lesson',
      source_id: 'local-goalgate',
      target_id: 'local-lesson',
      relation_type: 'fixes_by',
      scope,
      fame: { mu: 0.42, chi: 0.62, epsilon: 0.64, kappa: 0.38, nu: 0.72, delta: 0.61, rho: 0.58, lambda: 0.78 },
      dynamics: { xi: 0.48, freshness: 0.72, half_life_days: 14, last_verified_at: '2026-06-20' },
      evidence: { success_count: 1, failure_count: 3, conflict_count: 2, lesson_count: 4, source_refs: ['方案设计/04_FAME公式与参数.md'], log_refs: [`failure_summary/${shard.shard_id}`] },
    },
  ]

  nodes
    .filter((node) => node.id.startsWith('local-file-'))
    .forEach((node, index) => {
      edges.push({
        edge_id: `local-edge-file-${index}`,
        source_id: 'local-shard',
        target_id: node.id,
        relation_type: 'supports',
        scope,
        fame: { mu: 0.6, chi: 0.62, epsilon: 0.7, kappa: 0.52, nu: 0.28 + index * 0.04, delta: 0.08, rho: 0.22, lambda: 0.1 },
        dynamics: { xi: 0.5, freshness: Math.max(0.78, 0.95 - index * 0.03), half_life_days: 30, last_verified_at: '2026-06-27' },
        evidence: { success_count: 1, failure_count: 0, conflict_count: 0, lesson_count: 0, source_refs: [node.source_ref], log_refs: [] },
      })
    })

  nodes
    .filter((node) => node.id.startsWith('local-route-'))
    .forEach((node, index) => {
      edges.push({
        edge_id: `local-edge-route-${index}`,
        source_id: 'local-shard',
        target_id: node.id,
        relation_type: 'routes_to',
        scope: { ...scope, route_id: node.route_id },
        fame: { mu: 0.64, chi: 0.7, epsilon: 0.72, kappa: 0.46, nu: 0.3, delta: 0.1, rho: 0.24, lambda: 0.1 },
        dynamics: { xi: 0.55, freshness: 0.88, half_life_days: 45, last_verified_at: '2026-06-27' },
        evidence: { success_count: 1, failure_count: 0, conflict_count: 0, lesson_count: 0, source_refs: [node.source_ref], log_refs: [] },
      })
      edges.push({
        edge_id: `local-edge-route-abstraction-${index}`,
        source_id: node.id,
        target_id: 'local-abstraction',
        relation_type: 'supports',
        scope: { ...scope, route_id: node.route_id },
        fame: { mu: 0.58, chi: 0.82, epsilon: 0.68, kappa: 0.4, nu: 0.36, delta: 0.12, rho: 0.28, lambda: 0.12 },
        dynamics: { xi: 0.62, freshness: 0.86, half_life_days: 45, last_verified_at: '2026-06-27' },
        evidence: { success_count: 1, failure_count: 0, conflict_count: 0, lesson_count: 1, source_refs: [node.source_ref], log_refs: [] },
      })
    })

  return edges
}

function projectLayerKind(layer: ProjectMemoryProject['nodes'][number]['layer']): RouteNode['kind'] {
  if (layer === 'task') return 'intent'
  if (layer === 'decision') return 'rule'
  if (layer === 'module') return 'tool'
  if (layer === 'artifact') return 'summary'
  if (layer === 'quality') return 'quality'
  return 'association'
}

function makeProjectRouteNodes(project?: ProjectMemoryProject): RouteNode[] {
  if (!project) return routeNodes
  const layerY: Record<ProjectMemoryProject['nodes'][number]['layer'], number> = {
    task: 70,
    decision: 210,
    module: 350,
    artifact: 490,
    quality: 630,
    memory: 770,
  }
  const layerCounts = new Map<string, number>()
  const internalNodes = project.nodes.map((node) => {
    const count = layerCounts.get(node.layer) ?? 0
    layerCounts.set(node.layer, count + 1)
    return {
      id: `project-${node.id}`,
      label: node.label,
      kind: projectLayerKind(node.layer),
      subject: node.scope.subject,
      route_id: node.scope.route_id,
      summary: node.summary,
      source_ref: node.core_refs[0] ?? project.manifest.roots.project_memory ?? 'memory/projects',
      position: {
        x: 40 + count * 280,
        y: layerY[node.layer],
      },
    }
  })
  const knownNodeIds = new Set(project.nodes.map((node) => node.id))
  const externalIds = Array.from(
    new Set(
      project.edges
        .flatMap((edge) => [edge.source, edge.target])
        .filter((id) => !knownNodeIds.has(id)),
    ),
  )
  const anchorCounts = new Map<'core' | 'promotion' | 'external', number>()
  const externalNodes = externalIds.map((id) => {
    const promotion = project.promotionCandidates.find((candidate) => candidate.proposal_id === id)
    const anchorKind = id.startsWith('core:') ? 'core' : promotion ? 'promotion' : 'external'
    const count = anchorCounts.get(anchorKind) ?? 0
    anchorCounts.set(anchorKind, count + 1)
    return {
      id: `project-${id}`,
      label: promotion ? `Promotion: ${promotion.target_core_route_id}` : id.startsWith('core:') ? `Core: ${id.slice(5)}` : id,
      kind: promotion ? 'lesson' : 'abstraction',
      subject: promotion ? 'project-memory' : 'core-knowledge',
      route_id: promotion?.target_core_route_id ?? id,
      summary: promotion
        ? `${promotion.content_summary} (${promotion.readiness.reason})`
        : `核心知识网只读锚点：${id}。项目经验只能引用它，不能直接写入它。`,
      source_ref: promotion?.path ?? project.manifest.roots.core_knowledge ?? 'knowledge/',
      position: {
        x: anchorKind === 'core' ? -360 : 40 + count * 320,
        y: anchorKind === 'promotion' ? 820 : anchorKind === 'core' ? 70 + count * 150 : 820,
      },
    } satisfies RouteNode
  })

  return [...internalNodes, ...externalNodes]
}

function makeProjectFameEdges(project?: ProjectMemoryProject): FameEdgeState[] {
  if (!project) return fameEdges
  return project.edges.map((edge, index) => {
    const source = project.nodes.find((node) => node.id === edge.source)
    const target = project.nodes.find((node) => node.id === edge.target)
    const scope = {
      ...defaultScope,
      project_id: project.manifest.project_id,
      subject: target?.scope.subject ?? source?.scope.subject ?? 'project-memory',
      domain: project.manifest.project_phase,
      route_id: target?.scope.route_id ?? source?.scope.route_id ?? 'project-memory-overlay',
      task_id: target?.scope.task_id ?? source?.scope.task_id ?? 'project-memory',
    }
    const fame = edge.fame ?? { mu: 0.5, chi: 0.5, epsilon: 0.5, kappa: 0.4, nu: 0.35, delta: 0.12, rho: 0.25, lambda: 0.12 }
    const overlay = project.fameOverlay.find((item) => item.edge_id === edge.fame_overlay_ref)
    return {
      edge_id: `project-edge-${edge.id}`,
      source_id: `project-${edge.source}`,
      target_id: `project-${edge.target}`,
      relation_type:
        edge.type === 'protects_core'
          ? 'supports'
          : edge.type === 'promotes_candidate'
            ? 'summarizes_to'
            : edge.type === 'validated_by'
              ? 'fixes_by'
              : 'routes_to',
      scope,
      fame,
      dynamics: {
        xi: 0.62,
        freshness: Number(overlay?.dynamics?.freshness ?? 0.94),
        half_life_days: Number(overlay?.dynamics?.half_life_days ?? 30),
        last_verified_at: String(overlay?.dynamics?.last_verified_at ?? project.manifest.updated_at),
      },
      evidence: {
        success_count: Number(overlay?.evidence?.success_count ?? (index === 0 ? 1 : 0)),
        failure_count: Number(overlay?.evidence?.failure_count ?? 0),
        conflict_count: Number(overlay?.evidence?.conflict_count ?? 0),
        lesson_count: Number(overlay?.evidence?.lesson_count ?? 0),
        source_refs: Array.isArray(overlay?.evidence?.source_refs) ? overlay.evidence.source_refs.map(String) : [edge.id],
        log_refs: Array.isArray(overlay?.evidence?.log_refs) ? overlay.evidence.log_refs.map(String) : [],
      },
    }
  })
}

function makeFlowNodes(nodes: RouteNode[], selectedNodeId: string | null): Node<RouteNode>[] {
  return nodes.map((node) => ({
    id: node.id,
    type: 'routeCard',
    position: node.position,
    data: node,
    selected: selectedNodeId === node.id,
  }))
}

function makeFlowEdges(edges: FameEdgeState[], selectedEdgeId: string | null, selectedGoalEdges: string[]): Edge[] {
  return edges.map((edge) => {
    const isSelected = selectedEdgeId === edge.edge_id
    const inGoalPath = selectedGoalEdges.includes(edge.edge_id)
    const riskLevel = edgeRiskLevel(edge)
    const isNegative = riskLevel === 'risk' || riskLevel === 'lesson'
    return {
      id: edge.edge_id,
      source: edge.source_id,
      target: edge.target_id,
      label: `${edgeRiskLabel(edge)} / ${edge.relation_type} / ${routeScore(edge, edge.scope)}`,
      markerEnd: { type: MarkerType.ArrowClosed, color: edgeHeatColor(edge) },
      animated: inGoalPath || isNegative,
      style: {
        stroke: edgeHeatColor(edge),
        strokeWidth: isSelected || inGoalPath || isNegative ? 4.5 : riskLevel === 'watch' ? 3 : 2,
        strokeDasharray: edgeStrokePattern(edge),
      },
      className: `flow-edge-${riskLevel}`,
      interactionWidth: isNegative ? 24 : 14,
      labelStyle: { fill: isNegative ? edgeHeatColor(edge) : '#27313f', fontSize: 11, fontWeight: 800 },
      labelBgStyle: { fill: isNegative ? '#fff0f0' : '#f7f9fb', fillOpacity: 0.92 },
    }
  })
}

function numberText(value: number) {
  return value.toFixed(2)
}

function searchable(value: unknown) {
  return String(value ?? '').toLocaleLowerCase()
}

function scoreCandidate(query: string, tokens: string[], title: string, fields: unknown[]) {
  const titleText = searchable(title)
  const body = searchable([title, ...fields].join(' '))
  if (!tokens.every((token) => body.includes(token))) return 0

  let score = 1
  if (titleText === query) score += 8
  if (titleText.startsWith(query)) score += 5
  if (titleText.includes(query)) score += 3
  score += tokens.filter((token) => titleText.includes(token)).length
  return score
}

function assetIntentBoost(query: string, tokens: string[], fields: unknown[]) {
  const body = searchable(fields.join(' '))
  const assetTerms = ['asset', 'assets', 'multimodal', 'db_ref', 'object_ref', 'text_ref', 'thumbnail', 'route_index']
  const hasAssetTerm = assetTerms.some((term) => query.includes(term) || tokens.includes(term))
  const hasStrongFieldHit = tokens.some((token) => token.length >= 3 && body.includes(token))
  return hasAssetTerm || hasStrongFieldHit ? 4.4 : 0
}

function normalizeForMatch(value: string) {
  return searchable(value).replace(/\\/g, '/')
}

function formatBytes(value: number) {
  if (value < 1024) return `${value} B`
  if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KB`
  return `${(value / 1024 / 1024).toFixed(1)} MB`
}

function syncRank(status: DirectorySyncStatus) {
  const rank: Record<DirectorySyncStatus, number> = {
    clean: 0,
    synced: 1,
    pending: 2,
    outbox: 3,
    review: 4,
    blocked: 5,
  }
  return rank[status]
}

function mergeSyncStatus(current: DirectorySyncStatus, next: DirectorySyncStatus) {
  return syncRank(next) > syncRank(current) ? next : current
}

function syncStatusLabel(status: DirectorySyncStatus) {
  const labels: Record<DirectorySyncStatus, string> = {
    clean: 'clean',
    synced: 'synced',
    pending: 'pending',
    review: 'review',
    outbox: 'outbox',
    blocked: 'blocked',
  }
  return labels[status]
}

function syncStatusForShard(
  shard: KnowledgeShardSummary,
  proposals: KnowledgePatchProposal[],
  syncItems: RuntimeAssetSyncItem[],
  outbox: V13RuntimePayload['syncOutbox'],
) {
  const shardKey = normalizeForMatch(`${shard.root_id}/${shard.subject}`)
  const routeKey = normalizeForMatch(shard.route_id)
  const fileKeys = shard.sample_files.map((file) => normalizeForMatch(file.path))
  let status: DirectorySyncStatus = 'clean'
  let count = 0

  for (const proposal of proposals) {
    const targetText = normalizeForMatch(`${proposal.target.route_id} ${proposal.target.file_path} ${proposal.target.section} ${proposal.content_summary}`)
    const matched =
      targetText.includes(routeKey) ||
      targetText.includes(shardKey) ||
      fileKeys.some((path) => path && targetText.includes(path))
    if (!matched) continue
    count += 1
    status = mergeSyncStatus(status, proposal.review_status === 'approved' ? 'pending' : 'review')
  }

  for (const item of syncItems) {
    const targetText = normalizeForMatch(`${item.route_id} ${item.file_path} ${item.target_asset_id} ${item.reason}`)
    const matched =
      targetText.includes(routeKey) ||
      targetText.includes(shardKey) ||
      fileKeys.some((path) => path && targetText.includes(path))
    if (!matched) continue
    count += 1
    if (item.status === 'synced') status = mergeSyncStatus(status, 'synced')
    else if (item.status === 'needs_review' || item.status === 'pending_review') status = mergeSyncStatus(status, 'review')
    else status = mergeSyncStatus(status, 'pending')
  }

  for (const event of outbox) {
    const targetText = normalizeForMatch(`${event.target} ${event.reason} ${event.source_proposal_id}`)
    const matched =
      targetText.includes(routeKey) ||
      targetText.includes(shardKey) ||
      fileKeys.some((path) => path && targetText.includes(path))
    if (!matched) continue
    count += 1
    if (event.status === 'blocked' || event.status === 'failed') status = mergeSyncStatus(status, 'blocked')
    else if (event.status === 'applied' || event.status === 'replayed') status = mergeSyncStatus(status, 'synced')
    else status = mergeSyncStatus(status, 'outbox')
  }

  return { status, count }
}

function syncStatusForRoot(
  shards: KnowledgeShardSummary[],
  proposals: KnowledgePatchProposal[],
  syncItems: RuntimeAssetSyncItem[],
  outbox: V13RuntimePayload['syncOutbox'],
) {
  return shards.reduce(
    (result, shard) => {
      const next = syncStatusForShard(shard, proposals, syncItems, outbox)
      return {
        status: mergeSyncStatus(result.status, next.status),
        count: result.count + next.count,
      }
    },
    { status: 'clean' as DirectorySyncStatus, count: 0 },
  )
}

function rootDirectoryKey(rootId: string) {
  return `root:${rootId}`
}

function subjectDirectoryKey(rootId: string, subject: string) {
  return `subject:${rootId}/${subject}`
}

function shardViewKey(shard: KnowledgeShardSummary, index = 0) {
  return `${shard.root_id}:${shard.shard_id}:${shard.route_id}:${index}`
}

function operationForPatchType(type: KnowledgePatchProposal['patch_type']) {
  if (type === 'add_route') return 'append_asset_index'
  if (type === 'edit_route') return 'refresh_asset_index'
  if (type === 'add_edge') return 'upsert_asset_edge'
  if (type === 'add_lesson' || type === 'deprecate_edge') return 'append_asset_fame_history'
  if (type === 'update_tool_manual') return 'verify_asset_refs'
  return 'refresh_asset_index'
}

function statusForPatchSync(type: KnowledgePatchProposal['patch_type']) {
  return type === 'deprecate_edge' || type === 'add_lesson' ? 'needs_review' : 'pending_review'
}

function runtimeSyncItemFromProposal(
  proposal: KnowledgePatchProposal,
  indexes: MultimodalAssetPayload['indexes'],
  index: number,
): RuntimeAssetSyncItem {
  const routeId = proposal.target.route_id
  const filePath = proposal.target.file_path
  const matchText = normalizeForMatch([filePath, routeId, proposal.content_summary, ...proposal.evidence_refs].join(' '))
  const matchedAsset =
    indexes.find((asset) => matchText.includes(normalizeForMatch(asset.asset_id))) ??
    indexes.find((asset) => matchText.includes(normalizeForMatch(asset.object_ref)) || matchText.includes(normalizeForMatch(asset.extracted_text_ref))) ??
    indexes.find((asset) => asset.route_refs.some((route) => matchText.includes(normalizeForMatch(route)))) ??
    indexes.find((asset) => asset.subject_refs.some((subject) => matchText.includes(normalizeForMatch(subject)))) ??
    indexes.find((asset) => matchText.includes(normalizeForMatch(asset.source_ref))) ??
    indexes[0]
  const targetAssetId = matchedAsset?.asset_id ?? `draft-asset-index-${String(index + 1).padStart(2, '0')}`
  const syncId = `sync-runtime-${proposal.proposal_id}`
  return {
    sync_id: syncId,
    source_proposal_id: proposal.proposal_id,
    trigger: 'manual_knowledge_patch',
    target_asset_id: targetAssetId,
    route_id: routeId,
    file_path: filePath,
    operation: operationForPatchType(proposal.patch_type),
    status: statusForPatchSync(proposal.patch_type),
    review_required: true,
    reason: `人工知识网调整后，同步 ${targetAssetId} 的轻量索引、路线锚点或 FAME 历史，避免资产数据库与知识网分叉。`,
    db_refs: {
      asset_index: `asset_store/asset_index.jsonl#${targetAssetId}`,
      asset_edges: `asset_store/asset_edges.jsonl#${targetAssetId}`,
      fame_history: `asset_store/asset_fame_history.jsonl#${targetAssetId}`,
      sync_queue: `asset_store/asset_sync_queue.jsonl#${syncId}`,
    },
    proposed_changes: {
      route_refs_add: [routeId].filter(Boolean),
      route_refs_remove: proposal.patch_type === 'deprecate_edge' ? [routeId].filter(Boolean) : [],
      fields:
        proposal.patch_type === 'add_edge'
          ? ['asset_edges', 'route_refs']
          : proposal.patch_type === 'add_lesson' || proposal.patch_type === 'deprecate_edge'
            ? ['fame_history', 'fame_summary', 'route_refs']
            : ['asset_index', 'caption', 'summary', 'route_refs'],
      raw_asset_write: false,
    },
    guardrails: [
      'KnowledgePatchProposal approval required before core write',
      'ApprovedAction required before asset database write',
      'raw multimodal payload never enters the knowledge graph',
    ],
    created_at: 'runtime-preview',
    updated_at: 'runtime-preview',
    source: 'runtime_patch',
    proposal,
  }
}

function universeNodeForShard(shardId: string, nodes: UniverseNode[] = universeNodes) {
  return (
    nodes.find((node) => node.shard_id === shardId && node.kind === 'subject') ??
    nodes.find((node) => node.shard_id === shardId) ??
    nodes.find((node) => node.id === `root-${shardId}`)
  )
}

function parseFamePreset(value: string) {
  const vector = { mu: 0.55, chi: 0.75, epsilon: 0.65, kappa: 0.45, nu: 0.35, delta: 0.12, rho: 0.2, lambda: 0.08 }
  for (const part of value.split(',')) {
    const [rawKey, rawValue] = part.split('=').map((item) => item.trim())
    const key = rawKey as FameKey
    if (!fameKeys.includes(key)) continue
    const parsed = Number(rawValue)
    if (Number.isFinite(parsed)) vector[key] = Math.max(0, Math.min(1, parsed))
  }
  return vector
}

function createDefaultDraftEdge(sourceId: string, targetId: string, scope: Scope, index: number): FameEdgeState {
  return {
    edge_id: `draft-edge-${Date.now()}-${index}`,
    source_id: sourceId,
    target_id: targetId,
    relation_type: 'supports',
    scope,
    fame: { mu: 0.52, chi: 0.68, epsilon: 0.62, kappa: 0.34, nu: 0.32, delta: 0.12, rho: 0.2, lambda: 0.08 },
    dynamics: { xi: 0.42, freshness: 1, half_life_days: 30, last_verified_at: '2026-06-27' },
    evidence: { success_count: 0, failure_count: 0, conflict_count: 0, lesson_count: 0, source_refs: ['workbench/draft'], log_refs: [] },
  }
}

function moduleProposal(
  base: KnowledgePatchProposal[],
  type: KnowledgePatchProposal['patch_type'],
  routeId: string,
  filePath: string,
  section: string,
  summary: string,
  affected: string[],
) {
  return [
    {
      proposal_id: `kpp-local-${String(base.length + 1).padStart(3, '0')}`,
      proposer: 'human',
      target: {
        route_id: routeId,
        file_path: filePath || 'workbench/local-route-draft',
        section,
      },
      patch_type: type,
      content_summary: summary,
      evidence_refs: [filePath || 'workbench/local-route-draft'],
      affected_edges: affected,
      initial_fame: parseFamePreset(patchPresets.find((preset) => preset.type === type)?.fame ?? ''),
      review_status: 'proposed',
    } satisfies KnowledgePatchProposal,
    ...base,
  ]
}

function createProposal(base: KnowledgePatchProposal[], form: HTMLFormElement) {
  const data = new FormData(form)
  const summary = String(data.get('content_summary') ?? '').trim()
  const routeId = String(data.get('route_id') ?? '').trim() || defaultScope.route_id
  return [
    {
      proposal_id: `kpp-local-${String(base.length + 1).padStart(3, '0')}`,
      proposer: 'human',
      target: {
        route_id: routeId,
        file_path:
          String(data.get('file_path') ?? '').trim() ||
          'knowledge/BNAI智能agent知识网/knowledge_hierarchy.md',
        section: String(data.get('section') ?? '').trim() || 'route/new',
      },
      patch_type: String(data.get('patch_type') ?? 'add_edge') as KnowledgePatchProposal['patch_type'],
      content_summary: summary || '新增一条待审核知识路线补充。',
      evidence_refs: String(data.get('evidence_refs') ?? '')
        .split('\n')
        .map((item) => item.trim())
        .filter(Boolean),
      affected_edges: String(data.get('affected_edges') ?? '')
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
      initial_fame: parseFamePreset(String(data.get('initial_fame') ?? '')),
      review_status: 'proposed',
    } satisfies KnowledgePatchProposal,
    ...base,
  ]
}

function EdgeInspector({ edge }: { edge: FameEdgeState }) {
  const riskLevel = edgeRiskLevel(edge)
  return (
    <section className="panel">
      <div className="panel-title">
        <GitBranch size={17} />
        <h2>FAME Edge</h2>
      </div>
      <div className="edge-id">{edge.edge_id}</div>
      <div className={`risk-badge risk-${riskLevel}`}>
        <strong>{edgeRiskLabel(edge)}</strong>
        <span>failure {edge.evidence.failure_count} / conflict {edge.evidence.conflict_count}</span>
      </div>
      <dl className="kv">
        <div>
          <dt>score</dt>
          <dd>{routeScore(edge, defaultScope)}</dd>
        </div>
        <div>
          <dt>kappa_eff</dt>
          <dd>{numberText(kappaEff(edge))}</dd>
        </div>
        <div>
          <dt>freshness</dt>
          <dd>{numberText(edge.dynamics.freshness)}</dd>
        </div>
      </dl>
      <div className="fame-grid">
        {fameKeys.map((key) => (
          <div className="fame-meter" key={key}>
            <span>{key}</span>
            <div>
              <i style={{ width: `${edge.fame[key] * 100}%` }} />
            </div>
            <b>{numberText(edge.fame[key])}</b>
          </div>
        ))}
      </div>
      <p className="panel-copy">
        scope: {edge.scope.project_id} / {edge.scope.subject} / {edge.scope.route_id}
      </p>
    </section>
  )
}

function V13RuntimeStage({
  selectedEdgeId,
  focus,
  onFocus,
  runtime,
}: {
  selectedEdgeId: string
  focus: V13Focus
  onFocus: (focus: V13Focus) => void
  runtime: V13RuntimePayload
}) {
  const edgeHistory = runtime.fameTimeseries.filter((point) => point.edge_id === selectedEdgeId)
  const history = edgeHistory.length > 0 ? edgeHistory : runtime.fameTimeseries
  const selectedRoute = runtime.routePosterior.candidates.find((candidate) => candidate.route_id === runtime.routePosterior.selected_route_id)
  const contractionRate =
    runtime.physicalFeedback.length === 0
      ? 0
      : runtime.physicalFeedback.filter((event) => event.kappa_scac < 1).length / runtime.physicalFeedback.length
  const entropyDrop =
    runtime.physicalFeedback.length === 0
      ? 0
      : runtime.physicalFeedback.reduce(
          (sum, event) => sum + event.posterior_entropy_before - event.posterior_entropy_after,
          0,
        ) / runtime.physicalFeedback.length
  const memorySummaryCount = runtime.fullMemoryRetention.filter((item) => item.context_action === 'include_summary').length
  const rawLazyCount = runtime.fullMemoryRetention.filter((item) => item.context_action === 'lazy_load_raw').length
  const outboxPending = runtime.syncOutbox.filter((event) => event.status !== 'applied' && event.status !== 'replayed').length
  const cards: Array<{ id: V13Focus; label: string; value: string; detail: string }> = [
    { id: 'fame', label: 'FAME Dynamics', value: `${runtime.fameTimeseries.length}`, detail: 'timeseries points' },
    { id: 'scac', label: 'SCAC Convergence', value: numberText(contractionRate), detail: 'contraction rate' },
    { id: 'posterior', label: 'Route Posterior', value: numberText(runtime.routePosterior.entropy), detail: 'entropy' },
    { id: 'memory', label: 'Full Memory', value: `${runtime.fullMemoryRetention.length}`, detail: 'all retained' },
    { id: 'truth', label: 'Temporal Truth', value: `${runtime.temporalTruth.length}`, detail: 'truth edges' },
    { id: 'outbox', label: 'Sync Outbox', value: `${outboxPending}`, detail: 'pending events' },
    { id: 'trace', label: 'Trace Runtime', value: `${runtime.traceSpans.length}`, detail: 'spans' },
  ]

  return (
    <section className="v13-stage" data-v13-runtime="ready" data-v13-memory-policy="full-retention">
      <div className="v13-hero">
        <div>
          <strong>v13 Theory Runtime</strong>
          <span>FAME dynamics + SCAC feedback + route posterior + full memory retention</span>
          <p>记忆全量保留；Context Pack 只决定本轮读取摘要、refs 还是懒加载原始记录。</p>
        </div>
        <dl className="kv compact-kv">
          <div><dt>selected</dt><dd>{selectedRoute?.route_id ?? 'none'}</dd></div>
          <div><dt>entropy drop</dt><dd>{numberText(entropyDrop)}</dd></div>
          <div><dt>raw lazy</dt><dd>{rawLazyCount}</dd></div>
        </dl>
      </div>

      <div className="v13-card-grid">
        {cards.map((card) => (
          <button
            className={focus === card.id ? 'v13-card active' : 'v13-card'}
            key={card.id}
            type="button"
            onClick={() => onFocus(card.id)}
          >
            <strong>{card.label}</strong>
            <b>{card.value}</b>
            <span>{card.detail}</span>
          </button>
        ))}
      </div>

      <div className="v13-section-grid">
        <section className={focus === 'fame' ? 'v13-section active' : 'v13-section'}>
          <h3>FAME Dynamics</h3>
          <div className="memory-list">
            {history.map((point) => (
              <article key={point.point_id}>
                <header>
                  <strong>{point.edge_id}</strong>
                  <span>{point.update_reason} / xi {numberText(point.inertia_xi)}</span>
                </header>
                <div className="sparkline" aria-label="FAME vector sparkline">
                  {fameKeys.map((key) => (
                    <i key={key} style={{ height: `${Math.max(8, point.fame[key] * 100)}%` }} title={`${key}: ${numberText(point.fame[key])}`} />
                  ))}
                </div>
                <p>{point.event_ref}</p>
                <small>predicted Δ {numberText(point.predicted_delta)} / observed Δ {numberText(point.observed_delta)}</small>
              </article>
            ))}
          </div>
        </section>

        <section className={focus === 'scac' ? 'v13-section active' : 'v13-section'}>
          <h3>SCAC Convergence</h3>
          <div className="memory-list">
            {runtime.physicalFeedback.map((event) => {
              const converged = event.kappa_scac < 1
              const entropyDelta = event.posterior_entropy_before - event.posterior_entropy_after
              return (
                <article className={converged ? 'converged' : 'not-converged'} key={event.event_id}>
                  <header>
                    <strong>{event.feedback_type}</strong>
                    <span>{event.status} / kappa {numberText(event.kappa_scac)}</span>
                  </header>
                  <p>{event.required_next_step}</p>
                  <small>distance {numberText(event.distance_before)} -&gt; {numberText(event.distance_after)}</small>
                  <small>entropy_drop {numberText(entropyDelta)} / gain {numberText(event.feedback_gain)}</small>
                </article>
              )
            })}
          </div>
        </section>

        <section className={focus === 'posterior' ? 'v13-section active' : 'v13-section'}>
          <h3>Route Posterior</h3>
          <div className="posterior-bars">
            {runtime.routePosterior.candidates.map((candidate) => (
              <article key={candidate.route_id}>
                <header>
                  <strong>{candidate.label}</strong>
                  <span>{candidate.policy_pass ? 'policy pass' : 'blocked'}</span>
                </header>
                <div className="posterior-track">
                  <i style={{ width: `${candidate.posterior * 100}%` }} />
                </div>
                <p>{candidate.rationale}</p>
                <small>prior {numberText(candidate.prior)} / posterior {numberText(candidate.posterior)} / entropy {numberText(candidate.entropy_contribution)}</small>
              </article>
            ))}
          </div>
        </section>

        <section className={focus === 'memory' ? 'v13-section active' : 'v13-section'}>
          <h3>Full Memory Retention</h3>
          <div className="retention-banner">
            <strong>memory policy: full retention</strong>
            <span>{memorySummaryCount} summaries enter context / raw records lazy-load by GoalGate</span>
          </div>
          <div className="memory-list">
            {runtime.fullMemoryRetention.map((item) => (
              <article key={item.memory_id}>
                <header>
                  <strong>{item.memory_type}</strong>
                  <span>{item.context_action}</span>
                </header>
                <p>{item.reason}</p>
                <small>importance {numberText(item.importance)} / freshness {numberText(item.freshness)} / reuse {item.reuse_count}</small>
                <small>{item.storage_ref}</small>
              </article>
            ))}
          </div>
        </section>

        <section className={focus === 'truth' ? 'v13-section active' : 'v13-section'}>
          <h3>Temporal Truth</h3>
          <div className="memory-list">
            {runtime.temporalTruth.map((edge) => (
              <article className={`truth-${edge.status}`} key={edge.edge_id}>
                <header>
                  <strong>{edge.edge_id}</strong>
                  <span>{edge.status}</span>
                </header>
                <p>{edge.provenance_refs.join(' / ')}</p>
                <small>valid {edge.valid_from} -&gt; {edge.valid_to ?? 'now'}</small>
                <small>verified {edge.last_verified_at}</small>
              </article>
            ))}
          </div>
        </section>

        <section className={focus === 'outbox' ? 'v13-section active' : 'v13-section'}>
          <h3>Sync Outbox</h3>
          <div className="memory-list sync-list">
            {runtime.syncOutbox.map((event) => (
              <article className={`sync-item sync-${event.status}`} key={event.outbox_id}>
                <header>
                  <strong>{event.operation}</strong>
                  <span>{event.status}</span>
                </header>
                <p>{event.reason}</p>
                <small>{event.source_proposal_id} -&gt; {event.target}</small>
                <small>{event.replayable ? 'replayable' : 'not replayable'} / {event.trace_id}</small>
              </article>
            ))}
          </div>
        </section>

        <section className={focus === 'trace' ? 'v13-section active' : 'v13-section'}>
          <h3>Trace Runtime</h3>
          <div className="memory-list">
            {runtime.traceSpans.map((span) => (
              <article className={`trace-${span.status}`} key={span.span_id}>
                <header>
                  <strong>{span.name}</strong>
                  <span>{span.module_id} / {span.duration_ms}ms</span>
                </header>
                <p>{span.summary}</p>
                <small>{span.trace_id} / parent {span.parent_span_id ?? 'root'}</small>
              </article>
            ))}
          </div>
        </section>
      </div>
    </section>
  )
}

function LocalRouteGraph({
  nodes,
  edges,
  selectedNodeId,
  selectedEdgeId,
  highlightedEdges,
  onSelectNode,
  onOpenNode,
  onSelectEdge,
}: {
  nodes: RouteNode[]
  edges: FameEdgeState[]
  selectedNodeId: string | null
  selectedEdgeId: string
  highlightedEdges: string[]
  onSelectNode: (id: string) => void
  onOpenNode: (id: string) => void
  onSelectEdge: (id: string) => void
}) {
  const flowNodes = useMemo(() => makeFlowNodes(nodes, selectedNodeId), [nodes, selectedNodeId])
  const flowEdges = useMemo(
    () => makeFlowEdges(edges, selectedEdgeId, highlightedEdges),
    [edges, highlightedEdges, selectedEdgeId],
  )

  return (
    <div className="graph-stage">
      <ReactFlow
        nodes={flowNodes}
        edges={flowEdges}
        nodeTypes={nodeTypes}
        minZoom={0.35}
        fitView
        onNodeClick={(_, node) => onSelectNode(node.id)}
        onNodeDoubleClick={(_, node) => onOpenNode(node.id)}
        onEdgeClick={(_, edge) => onSelectEdge(edge.id)}
      >
        <Background />
        <MiniMap pannable zoomable />
        <Controls />
      </ReactFlow>
    </div>
  )
}

function App() {
  const [view, setView] = useState<ViewMode>('universe')
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>('local-language-tree')
  const [selectedEdgeId, setSelectedEdgeId] = useState<string>('local-edge-language-shard')
  const [selectedUniverseNode, setSelectedUniverseNode] = useState<UniverseNode>(universeNodes[0])
  const [searchQuery, setSearchQuery] = useState('')
  const [runtimeDataStatus, setRuntimeDataStatus] = useState<RuntimeDataStatus>('loading')
  const [runtimeDataError, setRuntimeDataError] = useState('')
  const [knowledgeIndex, setKnowledgeIndex] = useState<KnowledgeIndexPayload>(emptyKnowledgeIndex)
  const [knowledgeGraph, setKnowledgeGraph] = useState<KnowledgeGraphPayload>(emptyKnowledgeGraph)
  const [projectMemory, setProjectMemory] = useState<ProjectMemoryPayload>(emptyProjectMemory)
  const [multimodalAssets, setMultimodalAssets] = useState<MultimodalAssetPayload>(emptyMultimodalAssets)
  const [v13Runtime, setV13Runtime] = useState<V13RuntimePayload>(emptyV13Runtime)
  const [selectedProjectId, setSelectedProjectId] = useState('fame-agent-gateway')
  const [selectedAssetId, setSelectedAssetId] = useState('asset-arch-mermaid-svg')
  const [patchPreset, setPatchPreset] = useState<KnowledgePatchProposal['patch_type']>('add_edge')
  const [proposals, setProposals] = useState<KnowledgePatchProposal[]>(seedProposals)
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null)
  const [routeDraft, setRouteDraft] = useState<RouteDraft | null>(null)
  const [focusedRouteEntryId, setFocusedRouteEntryId] = useState<string | null>(null)
  const [v13Focus, setV13Focus] = useState<V13Focus>('fame')
  const [expandedDirectoryKeys, setExpandedDirectoryKeys] = useState<Set<string>>(
    () => new Set(['root:knowledge-meta', 'root:建木知识网']),
  )
  const knowledgeIndexEntries = knowledgeIndex.entries
  const knowledgeShards = knowledgeIndex.shards
  const knowledgeIndexStats = knowledgeIndex.stats
  const { associationGraph, routeGraphStats } = knowledgeGraph
  const selectedProject = projectMemory.projects.find((project) => project.manifest.project_id === selectedProjectId) ?? projectMemory.projects[0]
  const selectedAsset = multimodalAssets.indexes.find((asset) => asset.asset_id === selectedAssetId) ?? multimodalAssets.indexes[0]
  const selectedAssetEdges = selectedAsset
    ? multimodalAssets.edges.filter((edge) => edge.source_id === selectedAsset.asset_id || edge.target_id === selectedAsset.asset_id)
    : []
  const selectedAssetRuns = selectedAsset
    ? multimodalAssets.extractionRuns.filter((run) => run.asset_id === selectedAsset.asset_id)
    : []
  const selectedAssetHistory = selectedAsset
    ? multimodalAssets.fameHistory.filter((item) => item.asset_id === selectedAsset.asset_id)
    : []
  const runtimeAssetSyncItems = useMemo<RuntimeAssetSyncItem[]>(
    () => proposals.map((proposal, index) => runtimeSyncItemFromProposal(proposal, multimodalAssets.indexes, index)),
    [multimodalAssets.indexes, proposals],
  )
  const assetSyncQueue = useMemo<RuntimeAssetSyncItem[]>(
    () => [
      ...runtimeAssetSyncItems,
      ...multimodalAssets.syncQueue.map((item) => ({ ...item, source: 'asset_store' as const })),
    ],
    [multimodalAssets.syncQueue, runtimeAssetSyncItems],
  )
  const selectedAssetSyncItems = selectedAsset
    ? assetSyncQueue.filter((item) => item.target_asset_id === selectedAsset.asset_id)
    : assetSyncQueue.slice(0, 4)
  const pendingAssetSyncCount = assetSyncQueue.filter((item) => item.status !== 'synced').length
  const selectedShard = knowledgeShards.find((shard) => shard.shard_id === selectedUniverseNode.shard_id)
  const selectedScope = useMemo(() => routeScopeForShard(selectedShard), [selectedShard])
  const selectedRouteEntries = useMemo(
    () =>
      selectedShard
        ? knowledgeIndexEntries.filter(
            (entry) => entry.entry_type === 'route_record' && `${entry.root_id}/${entry.subject}` === selectedShard.shard_id,
          )
        : [],
    [knowledgeIndexEntries, selectedShard],
  )
  const localRouteNodes = useMemo(
    () => makeLocalRouteNodes(selectedUniverseNode, routeGraphStats, selectedShard, selectedRouteEntries, focusedRouteEntryId),
    [focusedRouteEntryId, routeGraphStats, selectedRouteEntries, selectedShard, selectedUniverseNode],
  )
  const localFameEdges = useMemo(() => makeLocalFameEdges(localRouteNodes, selectedShard), [localRouteNodes, selectedShard])
  const projectRouteNodes = useMemo(() => makeProjectRouteNodes(selectedProject), [selectedProject])
  const projectFameEdges = useMemo(() => makeProjectFameEdges(selectedProject), [selectedProject])
  const scopeKey = focusedRouteEntryId ? `${selectedScope.route_id}#${focusedRouteEntryId}` : selectedScope.route_id
  const draftRouteNodes = routeDraft?.scopeKey === scopeKey ? routeDraft.nodes : localRouteNodes
  const draftFameEdges = routeDraft?.scopeKey === scopeKey ? routeDraft.edges : localFameEdges
  const currentRouteNodes = view === 'project'
    ? projectRouteNodes
    : view === 'route' || view === 'agent' || view === 'traversal' || view === 'fame' || view === 'patch' || view === 'v13'
    ? draftRouteNodes
    : routeNodes
  const currentFameEdges = view === 'project'
    ? projectFameEdges
    : view === 'route' || view === 'agent' || view === 'traversal' || view === 'fame' || view === 'patch' || view === 'v13'
    ? draftFameEdges
    : fameEdges
  const goalPath = useMemo(
    () => buildGoalPath(draftRouteNodes, draftFameEdges, selectedScope, activeGoalGate),
    [draftFameEdges, draftRouteNodes, selectedScope],
  )
  const thinkingStages = useMemo(() => buildThinkingStages(selectedScope, goalPath), [goalPath, selectedScope])
  const selectedRouteNode = currentRouteNodes.find((node) => node.id === selectedNodeId) ?? currentRouteNodes[0]
  const actionProposal = useMemo(
    () => buildActionProposal(selectedScope, selectedRouteNode, goalPath),
    [goalPath, selectedRouteNode, selectedScope],
  )
  const actionPreview = useMemo(
    () => previewApprovedAction(actionProposal, currentFameEdges, goalPath),
    [actionProposal, currentFameEdges, goalPath],
  )
  const selectedEdgeFameHistory = useMemo(
    () => v13Runtime.fameTimeseries.filter((point) => point.edge_id === selectedEdgeId),
    [selectedEdgeId, v13Runtime.fameTimeseries],
  )
  const scacContractionRate = useMemo(
    () =>
      v13Runtime.physicalFeedback.length === 0
        ? 0
        : v13Runtime.physicalFeedback.filter((event) => event.kappa_scac < 1).length / v13Runtime.physicalFeedback.length,
    [v13Runtime.physicalFeedback],
  )
  const posteriorEntropyDropAvg = useMemo(
    () =>
      v13Runtime.physicalFeedback.length === 0
        ? 0
        : v13Runtime.physicalFeedback.reduce(
            (sum, event) => sum + event.posterior_entropy_before - event.posterior_entropy_after,
            0,
          ) / v13Runtime.physicalFeedback.length,
    [v13Runtime.physicalFeedback],
  )
  const syncOutboxPendingCount = v13Runtime.syncOutbox.filter(
    (event) => event.status === 'pending' || event.status === 'approved' || event.status === 'sent',
  ).length
  const directoryRoots = useMemo(
    () =>
      knowledgeIndexStats.roots
        .map((root) => {
          const shards = knowledgeShards
            .filter((shard) => shard.root_id === root.id)
            .sort((a, b) => {
              const subjectA = a.subject === '(root)' ? '' : a.subject
              const subjectB = b.subject === '(root)' ? '' : b.subject
              return subjectA.localeCompare(subjectB, 'zh-Hans-CN') || b.file_count - a.file_count
            })
          const sync = syncStatusForRoot(shards, proposals, assetSyncQueue, v13Runtime.syncOutbox)
          return { root, shards, sync }
        })
        .sort((a, b) => b.root.fileCount - a.root.fileCount),
    [assetSyncQueue, knowledgeIndexStats.roots, knowledgeShards, proposals, v13Runtime.syncOutbox],
  )
  const selectedDirectoryShardSync = selectedShard
    ? syncStatusForShard(selectedShard, proposals, assetSyncQueue, v13Runtime.syncOutbox)
    : { status: 'clean' as DirectorySyncStatus, count: 0 }
  const semanticProposals = useMemo(
    () => buildSemanticAssociationProposals(selectedRouteEntries, selectedShard, selectedRouteNode),
    [selectedRouteEntries, selectedRouteNode, selectedShard],
  )
  const contextPack = useMemo(
    () => buildContextPackPreview(selectedScope, selectedRouteNode, goalPath, semanticProposals),
    [goalPath, selectedRouteNode, selectedScope, semanticProposals],
  )
  useEffect(() => {
    let cancelled = false
    setRuntimeDataStatus('loading')
    Promise.all([loadKnowledgeIndex(), loadKnowledgeGraph(), loadProjectMemory(), loadMultimodalAssets(), loadV13Runtime()])
      .then(([nextIndex, nextGraph, nextProjectMemory, nextMultimodalAssets, nextV13Runtime]) => {
        if (cancelled) return
        setKnowledgeIndex(nextIndex)
        setKnowledgeGraph(nextGraph)
        setProjectMemory(nextProjectMemory)
        setMultimodalAssets(nextMultimodalAssets)
        setV13Runtime(nextV13Runtime)
        setSelectedProjectId((current) => nextProjectMemory.projects.some((project) => project.manifest.project_id === current)
          ? current
          : nextProjectMemory.projects[0]?.manifest.project_id ?? current)
        setSelectedAssetId((current) => nextMultimodalAssets.indexes.some((asset) => asset.asset_id === current)
          ? current
          : nextMultimodalAssets.indexes[0]?.asset_id ?? current)
        setRuntimeDataStatus('ready')
        setRuntimeDataError('')
      })
      .catch((error: unknown) => {
        if (cancelled) return
        setRuntimeDataStatus('error')
        setRuntimeDataError(error instanceof Error ? error.message : String(error))
      })
    return () => {
      cancelled = true
    }
  }, [])
  useEffect(() => {
    setRouteDraft({ scopeKey, nodes: localRouteNodes, edges: localFameEdges })
    setEditingNodeId(null)
  }, [localFameEdges, localRouteNodes, scopeKey])
  useEffect(() => {
    if (!currentRouteNodes.some((node) => node.id === selectedNodeId)) {
      setSelectedNodeId(currentRouteNodes[0]?.id ?? null)
    }
    if (!currentFameEdges.some((edge) => edge.edge_id === selectedEdgeId)) {
      setSelectedEdgeId(currentFameEdges[0]?.edge_id ?? '')
    }
  }, [currentFameEdges, currentRouteNodes, selectedEdgeId, selectedNodeId])
  const searchResults = useMemo<SearchResult[]>(() => {
    const query = searchQuery.trim().toLocaleLowerCase()
    const tokens = query.split(/\s+/).filter(Boolean)
    if (tokens.length === 0) return []

    const results: SearchResult[] = []

    for (const node of universeNodes) {
      const score = scoreCandidate(query, tokens, node.label, [node.kind, node.subject, node.shard_id, node.file_path])
      if (score > 0) {
        results.push({
          id: `universe:${node.id}`,
          kind: 'universe-node',
          label: node.label,
          detail: `${node.kind} / ${node.shard_id}`,
          score: score + (node.kind === 'subject' ? 1.4 : 0),
          universeNodeId: node.id,
          shardId: node.shard_id,
        })
      }
    }

    for (const shard of knowledgeShards) {
      const score = scoreCandidate(query, tokens, shard.subject, [
        shard.root_label,
        shard.route_id,
        shard.shard_id,
        shard.keywords.join(' '),
        shard.sample_files.map((file) => `${file.title} ${file.path}`).join(' '),
      ])
      if (score > 0) {
        results.push({
          id: `shard:${shard.shard_id}`,
          kind: 'knowledge-shard',
          label: shard.subject === '(root)' ? `${shard.root_label} 根协议` : shard.subject,
          detail: `${shard.file_count} files / ${shard.route_id}`,
          score: score + 1.2,
          universeNodeId: universeNodeForShard(shard.shard_id, universeNodes)?.id,
          shardId: shard.shard_id,
        })
      }
    }

    for (const entry of knowledgeIndexEntries) {
      const score = scoreCandidate(query, tokens, entry.title, [
        entry.root_label,
        entry.subject,
        entry.path,
        entry.route_id,
        entry.route_domain,
        entry.route_type,
        entry.keywords.join(' '),
        entry.headings.map((heading) => heading.text).join(' '),
        entry.excerpt,
      ])
      if (score > 0) {
        const fileNode =
          universeNodes.find((node) => node.kind === 'file' && node.file_path === entry.path) ??
          universeNodeForShard(`${entry.root_id}/${entry.subject}`, universeNodes)
        results.push({
          id: `${entry.entry_type === 'route_record' ? 'knowledge-route' : 'file'}:${entry.id}`,
          kind: entry.entry_type === 'route_record' ? 'knowledge-route' : 'knowledge-file',
          label: entry.title,
          detail: entry.entry_type === 'route_record' ? `${entry.subject} / ${entry.route_domain ?? 'route'} / ${entry.route_id}` : entry.path,
          score: score + (entry.entry_type === 'route_record' ? 2.2 : 0),
          universeNodeId: fileNode?.id,
          shardId: `${entry.root_id}/${entry.subject}`,
          entryId: entry.id,
        })
      }
    }

    for (const node of draftRouteNodes) {
      const score = scoreCandidate(query, tokens, node.label, [
        node.kind,
        node.subject,
        node.route_id,
        node.summary,
        node.source_ref,
      ])
      if (score > 0) {
        results.push({
          id: `route:${node.id}`,
          kind: 'route-node',
          label: node.label,
          detail: `${node.kind} / ${node.route_id}`,
          score: score + 1,
          routeNodeId: node.id,
        })
      }
    }

    for (const edge of draftFameEdges) {
      const score = scoreCandidate(query, tokens, edge.edge_id, [
        edge.relation_type,
        edge.scope.subject,
        edge.scope.route_id,
        edge.evidence.source_refs.join(' '),
        edge.evidence.log_refs.join(' '),
      ])
      if (score > 0) {
        results.push({
          id: `edge:${edge.edge_id}`,
          kind: 'fame-edge',
          label: edge.edge_id,
          detail: `${edge.relation_type} / score ${routeScore(edge, defaultScope)}`,
          score,
          edgeId: edge.edge_id,
          routeNodeId: edge.target_id,
        })
      }
    }

    for (const project of projectMemory.projects) {
      const projectScore = scoreCandidate(query, tokens, project.manifest.project_name, [
        project.manifest.project_id,
        project.manifest.agent_id,
        project.manifest.core_knowledge_version,
        project.manifest.project_phase,
        JSON.stringify(project.manifest.memory_policy),
      ])
      if (projectScore > 0) {
        results.push({
          id: `project:${project.manifest.project_id}`,
          kind: 'project-memory',
          label: project.manifest.project_name,
          detail: `${project.stats.node_count} nodes / ${project.stats.promotion_candidate_count} promotion candidates`,
          score: projectScore + 2,
          projectId: project.manifest.project_id,
        })
      }
      for (const node of project.nodes) {
        const score = scoreCandidate(query, tokens, node.label, [
          node.type,
          node.layer,
          node.summary,
          node.status,
          node.core_refs.join(' '),
        ])
        if (score > 0) {
          results.push({
            id: `project-node:${node.id}`,
            kind: 'project-memory',
            label: node.label,
            detail: `${node.type} / ${node.scope.route_id}`,
            score: score + 1.8,
            projectId: project.manifest.project_id,
            routeNodeId: `project-${node.id}`,
          })
        }
      }
      for (const lesson of project.failureLessons) {
        const score = scoreCandidate(query, tokens, lesson.failure_category, [
          lesson.lesson_id,
          lesson.summary,
          lesson.fix_recipe,
          lesson.source_refs.join(' '),
        ])
        if (score > 0) {
          results.push({
            id: `project-lesson:${lesson.lesson_id}`,
            kind: 'project-memory',
            label: lesson.failure_category,
            detail: `${lesson.route_id} / lesson`,
            score: score + 1.6,
            projectId: project.manifest.project_id,
          })
        }
      }
      for (const candidate of project.promotionCandidates) {
        const score = scoreCandidate(query, tokens, candidate.proposal_id, [
          candidate.target_core_route_id,
          candidate.promotion_type,
          candidate.review_status,
          candidate.content_summary,
          candidate.evidence_refs.join(' '),
          candidate.readiness.reason,
        ])
        if (score > 0) {
          results.push({
            id: `project-promotion:${candidate.proposal_id}`,
            kind: 'project-memory',
            label: candidate.proposal_id,
            detail: `${candidate.target_core_route_id} / ${candidate.review_status}`,
            score: score + 1.7,
            projectId: project.manifest.project_id,
            routeNodeId: `project-${candidate.proposal_id}`,
          })
        }
      }
    }

    for (const asset of multimodalAssets.indexes) {
      const assetFields = [
        asset.asset_id,
        asset.modality,
        asset.preview_type,
        asset.source_type,
        asset.source_ref,
        asset.summary,
        asset.caption,
        asset.tags.join(' '),
        asset.route_refs.join(' '),
        asset.subject_refs.join(' '),
        asset.db_ref,
        asset.object_ref,
        asset.extracted_text_ref,
      ]
      const score = scoreCandidate(query, tokens, asset.label, assetFields)
      if (score > 0) {
        results.push({
          id: `asset:${asset.asset_id}`,
          kind: 'multimodal-asset',
          label: asset.label,
          detail: `${asset.modality} / ${asset.preview_type} / ${asset.route_refs[0] ?? 'asset'}`,
          score: score + 1.9 + assetIntentBoost(query, tokens, assetFields),
          assetId: asset.asset_id,
        })
      }
    }

    const v13SearchItems: Array<{
      id: string
      label: string
      detail: string
      fields: string[]
      target: SearchResult['v13Target']
      boost: number
    }> = [
      {
        id: 'v13:fame-dynamics',
        label: 'FAME Dynamics',
        detail: `${v13Runtime.fameTimeseries.length} timeseries points / xi inertia`,
        fields: ['FAME', 'dynamics', 'timeseries', 'inertia', 'xi', 'E_target', '情绪动力学'],
        target: 'fame',
        boost: 2.4,
      },
      {
        id: 'v13:scac-convergence',
        label: 'SCAC Convergence',
        detail: `${v13Runtime.physicalFeedback.length} physical feedback events / kappa_scac`,
        fields: ['SCAC', 'physical feedback', 'kappa_scac', 'entropy', '收敛', '真实反馈'],
        target: 'scac',
        boost: 2.4,
      },
      {
        id: 'v13:route-posterior',
        label: 'Route Posterior',
        detail: `${v13Runtime.routePosterior.candidates.length} candidates / entropy ${v13Runtime.routePosterior.entropy}`,
        fields: ['posterior', 'Bayesian', 'route probability', '后验', '路线概率'],
        target: 'posterior',
        boost: 2.2,
      },
      {
        id: 'v13:full-memory-retention',
        label: 'Full Memory Retention',
        detail: `${v13Runtime.fullMemoryRetention.length} retained memory states / context distilled`,
        fields: ['memory', 'full retention', 'context distillation', '全量记忆', '摘要调取', '懒加载'],
        target: 'memory',
        boost: 2.4,
      },
      {
        id: 'v13:temporal-truth',
        label: 'Temporal Truth',
        detail: `${v13Runtime.temporalTruth.length} truth edges / valid time`,
        fields: ['temporal truth', 'valid_from', 'valid_to', 'freshness', '及时性', '真实性'],
        target: 'truth',
        boost: 2.1,
      },
      {
        id: 'v13:sync-outbox',
        label: 'Sync Outbox',
        detail: `${v13Runtime.syncOutbox.length} outbox events / ${syncOutboxPendingCount} pending`,
        fields: ['outbox', 'event sourcing', 'AssetDbSyncItem', 'sync', '同步', '可回放'],
        target: 'outbox',
        boost: 2.1,
      },
      {
        id: 'v13:trace-runtime',
        label: 'Trace Runtime',
        detail: `${v13Runtime.traceSpans.length} trace spans / replayable chain`,
        fields: ['trace', 'span', 'OpenTelemetry', 'replay', '链路追踪', '回放'],
        target: 'trace',
        boost: 2,
      },
    ]

    for (const item of v13SearchItems) {
      const score = scoreCandidate(query, tokens, item.label, [item.detail, ...item.fields])
      if (score > 0) {
        results.push({
          id: item.id,
          kind: 'v13-runtime',
          label: item.label,
          detail: item.detail,
          score: score + item.boost,
          v13Target: item.target,
        })
      }
    }

    return results.sort((a, b) => b.score - a.score || a.label.localeCompare(b.label)).slice(0, 28)
  }, [draftFameEdges, draftRouteNodes, knowledgeIndexEntries, knowledgeShards, multimodalAssets.indexes, projectMemory.projects, searchQuery, syncOutboxPendingCount, v13Runtime])
  const selectedEdge = currentFameEdges.find((edge) => edge.edge_id === selectedEdgeId) ?? currentFameEdges[0]
  const selectedNode = currentRouteNodes.find((node) => node.id === selectedNodeId) ?? currentRouteNodes[0]
  const selectedRoot = knowledgeIndexStats.roots.find((root) => root.id === selectedUniverseNode.shard_id)
  const relatedRootShards =
    selectedUniverseNode.kind === 'root'
      ? knowledgeShards
          .filter((shard) => shard.root_id === selectedUniverseNode.shard_id)
          .sort((a, b) => b.file_count - a.file_count)
          .slice(0, 8)
      : []
  const relatedUniverseLinks = universeLinks.filter(
    (link) => link.source === selectedUniverseNode.id || link.target === selectedUniverseNode.id,
  )
  const activePatchPreset = patchPresets.find((preset) => preset.type === patchPreset) ?? patchPresets[1]
  const patchTargetFile =
    selectedNode?.source_ref.startsWith('knowledge/')
      ? selectedNode.source_ref
      : selectedShard?.sample_files[0]?.path ?? selectedUniverseNode.file_path ?? 'knowledge/BNAI智能agent知识网/knowledge_hierarchy.md'
  const editingNode = currentRouteNodes.find((node) => node.id === editingNodeId) ?? selectedNode

  const toggleDirectoryKey = (key: string) => {
    setExpandedDirectoryKeys((current) => {
      const next = new Set(current)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  const openUniverseNodeIn2D = (node: UniverseNode) => {
    const nodeShard = knowledgeShards.find((shard) => shard.shard_id === node.shard_id)
    setSelectedUniverseNode(node)
    setFocusedRouteEntryId(null)
    setSelectedNodeId(nodeShard ? 'local-language-tree' : 'intent-workbench')
    setSelectedEdgeId(nodeShard ? 'local-edge-language-shard' : 'edge-intent-association')
    setView('route')
  }

  const openShardFromDirectory = (shard: KnowledgeShardSummary, mode: 'directory' | 'route' = 'directory') => {
    const node = universeNodeForShard(shard.shard_id, universeNodes)
    if (node) setSelectedUniverseNode(node)
    setFocusedRouteEntryId(null)
    setSelectedNodeId('local-language-tree')
    setSelectedEdgeId('local-edge-language-shard')
    setExpandedDirectoryKeys((current) => new Set([...current, rootDirectoryKey(shard.root_id), subjectDirectoryKey(shard.root_id, shard.subject)]))
    setView(mode)
  }

  const openDirectoryEntry = (entry: KnowledgeIndexEntry) => {
    const shardId = `${entry.root_id}/${entry.subject}`
    const shard = knowledgeShards.find((item) => item.shard_id === shardId)
    if (shard) {
      openShardFromDirectory(shard, entry.entry_type === 'route_record' ? 'route' : 'directory')
    }
    if (entry.entry_type === 'route_record') {
      setFocusedRouteEntryId(entry.id)
      setSelectedNodeId(routeEntryNodeId(entry.id))
      setSelectedEdgeId('local-edge-route-0')
      setView('route')
    }
  }

  const updateRouteDraft = (updater: (draft: RouteDraft) => RouteDraft) => {
    setRouteDraft((draft) => {
      const baseDraft =
        draft?.scopeKey === scopeKey
          ? draft
          : { scopeKey, nodes: draftRouteNodes, edges: draftFameEdges }
      return updater(baseDraft)
    })
  }

  const saveModuleFromForm = (form: HTMLFormElement) => {
    const data = new FormData(form)
    const nodeId = String(data.get('node_id') ?? '')
    const nextNode: Partial<RouteNode> = {
      label: String(data.get('label') ?? '').trim(),
      kind: String(data.get('kind') ?? 'association') as RouteNode['kind'],
      summary: String(data.get('summary') ?? '').trim(),
      source_ref: String(data.get('source_ref') ?? '').trim(),
    }
    updateRouteDraft((draft) => ({
      ...draft,
      nodes: draft.nodes.map((node) =>
        node.id === nodeId
          ? {
              ...node,
              label: nextNode.label || node.label,
              kind: nextNode.kind ?? node.kind,
              summary: nextNode.summary || node.summary,
              source_ref: nextNode.source_ref || node.source_ref,
            }
          : node,
      ),
    }))
    setProposals((items) =>
      moduleProposal(
        items,
        'edit_route',
        selectedScope.route_id,
        String(nextNode.source_ref || editingNode?.source_ref || patchTargetFile),
        `module/${nodeId}`,
        `编辑 2D 模块：${nextNode.label || nodeId}`,
        currentFameEdges.filter((edge) => edge.source_id === nodeId || edge.target_id === nodeId).map((edge) => edge.edge_id),
      ),
    )
  }

  const addModuleFromCurrent = () => {
    const source = editingNode ?? selectedNode
    const id = `draft-module-${Date.now()}`
    const newNode: RouteNode = {
      id,
      label: '新模块',
      kind: 'association',
      subject: selectedScope.subject,
      route_id: selectedScope.route_id,
      summary: '从当前模块新增的待审核知识模块。',
      source_ref: patchTargetFile,
      position: {
        x: (source?.position.x ?? 280) + 280,
        y: (source?.position.y ?? 120) + 120,
      },
    }
    const edge = createDefaultDraftEdge(source?.id ?? 'local-shard', id, selectedScope, currentFameEdges.length + 1)
    updateRouteDraft((draft) => ({ ...draft, nodes: [...draft.nodes, newNode], edges: [...draft.edges, edge] }))
    setSelectedNodeId(id)
    setEditingNodeId(id)
    setSelectedEdgeId(edge.edge_id)
    setProposals((items) =>
      moduleProposal(items, 'add_route', selectedScope.route_id, patchTargetFile, `module/${id}`, '新增 2D 知识模块草稿。', [edge.edge_id]),
    )
  }

  const connectModuleToPatch = () => {
    const source = editingNode ?? selectedNode
    const targetId = currentRouteNodes.some((node) => node.id === 'local-patch') ? 'local-patch' : currentRouteNodes[0]?.id
    if (!source || !targetId || source.id === targetId) return
    const edge = createDefaultDraftEdge(source.id, targetId, selectedScope, currentFameEdges.length + 1)
    updateRouteDraft((draft) => ({ ...draft, edges: [...draft.edges, edge] }))
    setSelectedEdgeId(edge.edge_id)
    setProposals((items) =>
      moduleProposal(items, 'add_edge', selectedScope.route_id, patchTargetFile, `edge/${edge.edge_id}`, `新增路径：${source.label} -> ${targetId}`, [edge.edge_id]),
    )
  }

  const deleteSelectedPath = () => {
    if (!selectedEdge) return
    updateRouteDraft((draft) => ({ ...draft, edges: draft.edges.filter((edge) => edge.edge_id !== selectedEdge.edge_id) }))
    setProposals((items) =>
      moduleProposal(items, 'deprecate_edge', selectedScope.route_id, patchTargetFile, `edge/${selectedEdge.edge_id}`, `删除/弃用路径：${selectedEdge.edge_id}`, [selectedEdge.edge_id]),
    )
  }

  const deleteEditingModule = () => {
    const node = editingNode ?? selectedNode
    if (!node) return
    if (node.id === 'local-language-tree' || node.id === 'local-shard') return
    const affected = currentFameEdges.filter((edge) => edge.source_id === node.id || edge.target_id === node.id).map((edge) => edge.edge_id)
    updateRouteDraft((draft) => ({
      ...draft,
      nodes: draft.nodes.filter((item) => item.id !== node.id),
      edges: draft.edges.filter((edge) => edge.source_id !== node.id && edge.target_id !== node.id),
    }))
    setEditingNodeId(null)
    setSelectedNodeId(currentRouteNodes[0]?.id ?? null)
    setProposals((items) =>
      moduleProposal(items, 'deprecate_edge', selectedScope.route_id, node.source_ref, `module/${node.id}`, `删除/弃用模块：${node.label}`, affected),
    )
  }

  const openSearchResult = (result: SearchResult) => {
    if (result.kind === 'v13-runtime') {
      setV13Focus(result.v13Target ?? 'fame')
      setView('v13')
      return
    }

    if (result.kind === 'multimodal-asset' && result.assetId) {
      setSelectedAssetId(result.assetId)
      setView('assets')
      return
    }

    if (result.kind === 'project-memory' && result.projectId) {
      setSelectedProjectId(result.projectId)
      if (result.routeNodeId) setSelectedNodeId(result.routeNodeId)
      setSelectedEdgeId(projectFameEdges[0]?.edge_id ?? '')
      setView('project')
      return
    }

    if (result.kind === 'knowledge-route' && result.entryId) {
      const entry = knowledgeIndexEntries.find((item) => item.id === result.entryId)
      if (entry) {
        openDirectoryEntry(entry)
      } else {
        setFocusedRouteEntryId(result.entryId)
        setSelectedNodeId(routeEntryNodeId(result.entryId))
        setSelectedEdgeId('local-edge-route-0')
        setView('route')
      }
      return
    }

    if (result.kind === 'knowledge-file' && result.entryId) {
      const entry = knowledgeIndexEntries.find((item) => item.id === result.entryId)
      if (entry) openDirectoryEntry(entry)
      setView('directory')
      return
    }

    if (result.kind === 'knowledge-shard' && result.shardId) {
      const shard = knowledgeShards.find((item) => item.shard_id === result.shardId)
      if (shard) openShardFromDirectory(shard, 'directory')
      return
    }

    if (result.universeNodeId) {
      const node = universeNodes.find((item) => item.id === result.universeNodeId)
      if (node) setSelectedUniverseNode(node)
      setFocusedRouteEntryId(null)
      setView('universe')
      return
    }

    if (result.routeNodeId) {
      setSelectedNodeId(result.routeNodeId)
      setView('route')
    }

    if (result.edgeId) {
      const edge = currentFameEdges.find((item) => item.edge_id === result.edgeId)
      setSelectedEdgeId(result.edgeId)
      if (edge) setSelectedNodeId(edge.target_id)
      setView('route')
    }
  }

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <Network size={24} />
          <div>
            <h1>FAME Workbench</h1>
            <p>Agent external brain</p>
          </div>
        </div>

        <section className="scope-box">
          <span>WorkStartAlignment</span>
          <strong>{defaultScope.project_id}</strong>
          <p>{defaultScope.subject}</p>
          <code>3d-overview-local-2d-detail</code>
        </section>

        <section className="search-panel">
          <label className="search-field">
            <Search size={16} />
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="搜索 3D / 2D / route / file"
            />
          </label>
          {searchQuery.trim() ? (
            <div className="search-results">
              {searchResults.length > 0 ? (
                searchResults.map((result) => (
                  <button key={result.id} type="button" onClick={() => openSearchResult(result)}>
                    <span>
                      {result.kind === 'route-node' || result.kind === 'fame-edge'
                        ? <Route size={14} />
                        : result.kind === 'multimodal-asset'
                          ? <Layers3 size={14} />
                          : result.kind === 'v13-runtime'
                            ? <BrainCircuit size={14} />
                            : <Orbit size={14} />}
                    </span>
                    <strong>{result.label}</strong>
                    <small>{result.detail}</small>
                  </button>
                ))
              ) : (
                <p>无匹配结果</p>
              )}
            </div>
          ) : (
            <p className="search-hint">3D 节点、知识分片、文件、2D route、FAME edge 与多模态资产索引。</p>
          )}
          <p className={`index-status index-status-${runtimeDataStatus}`}>
            {runtimeDataStatus === 'ready'
              ? `runtime index ready / ${knowledgeIndexStats.totalFiles} files`
              : runtimeDataStatus === 'error'
                ? `runtime index error / ${runtimeDataError}`
                : 'runtime index loading...'}
          </p>
        </section>

        <nav className="mode-list" aria-label="Workbench views">
          {[
            ['universe', Orbit, '3D Universe'],
            ['directory', BookOpen, 'Directory'],
            ['route', Route, '2D Detail'],
            ['agent', BrainCircuit, 'Agent Runtime'],
            ['project', Network, 'Project Memory'],
            ['assets', Layers3, 'Assets'],
            ['v13', BrainCircuit, 'v13 Runtime'],
            ['fame', Activity, 'FAME Heatmap'],
            ['traversal', Crosshair, 'GoalGate'],
            ['patch', Plus, 'Patch Entry'],
            ['debug', ShieldCheck, 'Module Debug'],
          ].map(([id, Icon, label]) => (
            <button
              className={view === id ? 'active' : ''}
              key={String(id)}
              type="button"
              onClick={() => setView(id as ViewMode)}
              title={String(label)}
            >
              <Icon size={18} />
              <span>{String(label)}</span>
            </button>
          ))}
        </nav>

        <section className="legend">
          <h2>3D 图层</h2>
          <p><i className="core-dot" />语言树中心与工程总控</p>
          <p><i className="green" />学科围绕语言树生长</p>
          <p><i className="blue" />文件/规则节点</p>
          <p><i className="purple" />跨学科联想边</p>
          <p><i className="yellow" />左键拖动平移，右键旋转，滚轮缩放，双击节点进 2D</p>
          <p><i className="risk-line" />负值 FAME 风险/教训线路</p>
        </section>

        <section className="legend">
          <h2>FAME 热力图例</h2>
          <p><i className="green" />mu 高，有效路线</p>
          <p><i className="blue" />kappa 高，置信路线</p>
          <p><i className="yellow" />nu 高，可验证风险</p>
          <p><i className="red" />delta 高，冲突阻断</p>
          <p><i className="purple" />lambda 高，失败教训</p>
        </section>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div>
            <p>{viewLabels[view]}</p>
            <h2>
              {view === 'universe'
                ? '用 3D 总览承载学科间联系，用 2D 进入局部路线与补充修改。'
                : activeGoalGate.success_condition}
            </h2>
          </div>
          <div className="topbar-stats">
            <span title={`index ${runtimeDataStatus} / files ${knowledgeIndexStats.totalFiles} / routes ${routeGraphStats.total_routes} / shards ${knowledgeIndexStats.shardCount} / 3D nodes ${universeStats.nodeCount} / links ${universeStats.linkCount}`}>
              <CheckCircle2 size={15} />ready {knowledgeIndexStats.totalFiles}/{routeGraphStats.total_routes}
            </span>
            <span title={`projects ${projectMemory.stats.project_count} / pm edges ${selectedProject?.stats.edge_count ?? 0} / assets ${multimodalAssets.stats.index_count} / asset edges ${multimodalAssets.stats.edge_count} / sync ${pendingAssetSyncCount}`}>
              <Layers3 size={15} />assets {multimodalAssets.stats.index_count} / sync {pendingAssetSyncCount}
            </span>
            <span title={`v13 FAME points ${v13Runtime.stats.fame_timeseries_count} / feedback ${v13Runtime.stats.physical_feedback_count} / scac ${numberText(scacContractionRate)} / posterior ${numberText(v13Runtime.routePosterior.entropy)} / memory ${v13Runtime.fullMemoryRetention.length} / outbox ${syncOutboxPendingCount}`}>
              <BrainCircuit size={15} />v13 {v13Runtime.stats.fame_timeseries_count}/{v13Runtime.stats.physical_feedback_count}
            </span>
            <span title={`score ${goalPath.estimated_score} / context ${goalPath.estimated_context_cost}/${activeGoalGate.context_budget}`}>
              <Clock3 size={15} />goal {goalPath.estimated_score} / ctx {goalPath.estimated_context_cost}
            </span>
          </div>
        </header>

        {view === 'universe' ? (
          <section className="universe-stage">
            <KnowledgeUniverse3D
              nodes={universeNodes}
              links={universeLinks}
              selectedNodeId={selectedUniverseNode.id}
              onSelectNode={setSelectedUniverseNode}
              onOpenNode={openUniverseNodeIn2D}
            />
            <div className="universe-overlay">
              <strong>{selectedUniverseNode.label}</strong>
              <span>{selectedUniverseNode.kind} / {selectedUniverseNode.subject}</span>
              <p>{selectedUniverseNode.file_path}</p>
            </div>
          </section>
        ) : view === 'directory' ? (
          <section className="directory-stage">
            <div className="directory-header">
              <div>
                <strong>Knowledge Directory</strong>
                <span>按大科目逐级展开；目录状态同步 KnowledgePatchProposal、Asset DB Sync 和 v13 Outbox。</span>
              </div>
              <dl className="kv compact-kv">
                <div><dt>roots</dt><dd>{directoryRoots.length}</dd></div>
                <div><dt>shards</dt><dd>{knowledgeIndexStats.shardCount}</dd></div>
                <div><dt>files</dt><dd>{knowledgeIndexStats.totalFiles}</dd></div>
                <div><dt>routes</dt><dd>{knowledgeIndexStats.totalRouteRecords}</dd></div>
              </dl>
            </div>

            <div className="directory-layout">
              <div className="directory-tree" data-directory-tree="ready">
                {directoryRoots.map(({ root, shards, sync }) => {
                  const rootKey = rootDirectoryKey(root.id)
                  const rootOpen = expandedDirectoryKeys.has(rootKey)
                  const subjectGroups = Array.from(
                    shards.reduce((map, shard) => {
                      const key = shard.subject
                      const list = map.get(key) ?? []
                      list.push(shard)
                      map.set(key, list)
                      return map
                    }, new Map<string, KnowledgeShardSummary[]>()),
                  ).sort(([a], [b]) => a.localeCompare(b, 'zh-Hans-CN'))

                  return (
                    <article className="directory-root" key={root.id}>
                      <button className="directory-row root-row" type="button" onClick={() => toggleDirectoryKey(rootKey)}>
                        {rootOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        <span className="directory-icon"><BookOpen size={16} /></span>
                        <strong>{root.label}</strong>
                        <small>{root.fileCount} files / {root.routeRecordCount} routes</small>
                        <i className={`sync-pill sync-${sync.status}`}>{syncStatusLabel(sync.status)}{sync.count ? ` ${sync.count}` : ''}</i>
                      </button>

                      {rootOpen && (
                        <div className="directory-children">
                          {subjectGroups.map(([subject, subjectShards]) => {
                            const subjectKey = subjectDirectoryKey(root.id, subject)
                            const subjectOpen = expandedDirectoryKeys.has(subjectKey)
                            const subjectSync = syncStatusForRoot(subjectShards, proposals, assetSyncQueue, v13Runtime.syncOutbox)
                            const subjectFileCount = subjectShards.reduce((sum, shard) => sum + shard.file_count, 0)
                            const subjectRouteCount = subjectShards.reduce((sum, shard) => sum + shard.route_record_count, 0)
                            return (
                              <div className="directory-subject" key={subjectKey}>
                                <button className="directory-row subject-row" type="button" onClick={() => toggleDirectoryKey(subjectKey)}>
                                  {subjectOpen ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
                                  <span className="directory-icon"><Layers3 size={15} /></span>
                                  <strong>{subject === '(root)' ? 'Root Protocol' : subject}</strong>
                                  <small>{subjectFileCount} files / {subjectRouteCount} routes</small>
                                  <i className={`sync-pill sync-${subjectSync.status}`}>{syncStatusLabel(subjectSync.status)}{subjectSync.count ? ` ${subjectSync.count}` : ''}</i>
                                </button>

                                {subjectOpen && (
                                  <div className="directory-children nested">
                                    {subjectShards.map((shard, shardIndex) => {
                                      const shardSync = syncStatusForShard(shard, proposals, assetSyncQueue, v13Runtime.syncOutbox)
                                      const selected = selectedShard?.shard_id === shard.shard_id
                                      return (
                                        <article className={selected ? 'directory-shard active' : 'directory-shard'} key={shardViewKey(shard, shardIndex)}>
                                          <button className="directory-row shard-row" type="button" onClick={() => openShardFromDirectory(shard, 'directory')}>
                                            <span className="directory-spacer" />
                                            <span className="directory-icon"><Network size={14} /></span>
                                            <strong>{shard.subject === '(root)' ? shard.root_label : shard.subject}</strong>
                                            <small>{shard.entry_count} entries / {formatBytes(shard.total_size_bytes)}</small>
                                            <i className={`sync-pill sync-${shardSync.status}`}>{syncStatusLabel(shardSync.status)}{shardSync.count ? ` ${shardSync.count}` : ''}</i>
                                          </button>
                                          {selected && (
                                            <div className="directory-preview">
                                              <div className="keyword-row">
                                                {shard.keywords.slice(0, 8).map((keyword, keywordIndex) => <span key={`${keyword}-${keywordIndex}`}>{keyword}</span>)}
                                              </div>
                                              <div className="directory-file-list">
                                                {shard.sample_files.slice(0, 4).map((file) => (
                                                  <button key={file.id} type="button" onClick={() => openDirectoryEntry(knowledgeIndexEntries.find((entry) => entry.id === file.id) ?? {
                                                    id: file.id,
                                                    root_id: shard.root_id,
                                                    root_label: shard.root_label,
                                                    path: file.path,
                                                    title: file.title,
                                                    subject: shard.subject,
                                                    extension: '',
                                                    size_bytes: 0,
                                                    headings: [],
                                                    excerpt: file.excerpt,
                                                    depth: 0,
                                                    route_id: shard.route_id,
                                                    keywords: [],
                                                    entry_type: 'file',
                                                  })}>
                                                    <FileText size={14} />
                                                    <span>
                                                      <strong>{file.title}</strong>
                                                      <small>{file.path}</small>
                                                    </span>
                                                  </button>
                                                ))}
                                                {shard.sample_routes.slice(0, 3).map((route) => (
                                                  <button key={route.id} type="button" onClick={() => openShardFromDirectory(shard, 'route')}>
                                                    <Route size={14} />
                                                    <span>
                                                      <strong>{route.title}</strong>
                                                      <small>{route.route_id} / priority {route.priority}</small>
                                                    </span>
                                                  </button>
                                                ))}
                                              </div>
                                            </div>
                                          )}
                                        </article>
                                      )
                                    })}
                                  </div>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </article>
                  )
                })}
              </div>

              <aside className="directory-detail">
                {selectedShard ? (
                  <>
                    <div className="directory-detail-head">
                      <strong>{selectedShard.subject === '(root)' ? selectedShard.root_label : selectedShard.subject}</strong>
                      <span>{selectedShard.root_label} / {selectedShard.route_id}</span>
                    </div>
                    <dl className="kv">
                      <div><dt>files</dt><dd>{selectedShard.file_count}</dd></div>
                      <div><dt>routes</dt><dd>{selectedShard.route_record_count}</dd></div>
                      <div><dt>entries</dt><dd>{selectedShard.entry_count}</dd></div>
                      <div><dt>sync</dt><dd>{syncStatusLabel(selectedDirectoryShardSync.status)} {selectedDirectoryShardSync.count}</dd></div>
                    </dl>
                    <button className="panel-action" type="button" onClick={() => openShardFromDirectory(selectedShard, 'route')}>
                      <Route size={16} />
                      打开 2D 局部路线
                    </button>
                    <div className="directory-sync-card">
                      <strong>Sync Boundary</strong>
                      <p>目录只显示索引和同步状态；核心知识写入仍走 proposal/review，资产数据库写入仍走 ApprovedAction。</p>
                    </div>
                    <div className="directory-file-list detail-list">
                      {selectedShard.sample_files.slice(0, 8).map((file) => (
                        <button key={file.id} type="button" onClick={() => {
                          const entry = knowledgeIndexEntries.find((item) => item.id === file.id)
                          if (entry) openDirectoryEntry(entry)
                        }}>
                          <FileText size={14} />
                          <span>
                            <strong>{file.title}</strong>
                            <small>{file.path}</small>
                          </span>
                        </button>
                      ))}
                    </div>
                  </>
                ) : (
                  <p className="panel-copy">选择一个大科目或知识分片查看目录详情。</p>
                )}
              </aside>
            </div>
          </section>
        ) : view === 'assets' ? (
          <section className="asset-stage">
            <div className="asset-stage-header">
              <div>
                <strong>Multimodal Asset Index</strong>
                <span>知识网只保留轻量预览索引，原始资产、抽取物、embedding 与历史记录留在 asset store。人工调整知识网时，会生成 Asset DB Sync 建议，避免数据库和图谱分叉。</span>
              </div>
              <dl className="kv compact-kv">
                <div><dt>assets</dt><dd>{multimodalAssets.stats.asset_count}</dd></div>
                <div><dt>indexes</dt><dd>{multimodalAssets.stats.index_count}</dd></div>
                <div><dt>edges</dt><dd>{multimodalAssets.stats.edge_count}</dd></div>
                <div><dt>runs</dt><dd>{multimodalAssets.stats.extraction_run_count}</dd></div>
                <div><dt>sync</dt><dd>{pendingAssetSyncCount}</dd></div>
              </dl>
            </div>
            <div className="asset-grid">
              {multimodalAssets.indexes.map((asset) => (
                <button
                  className={selectedAsset?.asset_id === asset.asset_id ? 'asset-card active' : 'asset-card'}
                  key={asset.asset_id}
                  type="button"
                  onClick={() => setSelectedAssetId(asset.asset_id)}
                >
                  <div className={`asset-thumb asset-${asset.modality}`}>
                    <span>{asset.modality}</span>
                  </div>
                  <div>
                    <strong>{asset.label}</strong>
                    <p>{asset.summary}</p>
                    <small>{asset.preview_type} / {asset.route_refs[0] ?? asset.asset_id}</small>
                  </div>
                </button>
              ))}
            </div>
          </section>
        ) : view === 'v13' ? (
          <V13RuntimeStage selectedEdgeId={selectedEdgeId} focus={v13Focus} onFocus={setV13Focus} runtime={v13Runtime} />
        ) : (
          <LocalRouteGraph
            nodes={currentRouteNodes}
            edges={currentFameEdges}
            selectedNodeId={selectedNodeId}
            selectedEdgeId={selectedEdgeId}
            highlightedEdges={view === 'traversal' ? goalPath.selected_edges : []}
            onSelectNode={setSelectedNodeId}
            onOpenNode={(id) => {
              setSelectedNodeId(id)
              setEditingNodeId(id)
            }}
            onSelectEdge={setSelectedEdgeId}
          />
        )}
      </section>

      <aside className="inspector">
        {view === 'universe' && (
          <>
            <section className="panel">
              <div className="panel-title">
                <Orbit size={17} />
                <h2>3D 选中节点</h2>
              </div>
              <h3>{selectedUniverseNode.label}</h3>
              <p className="panel-copy">{selectedUniverseNode.file_path}</p>
              <dl className="kv">
                <div>
                  <dt>kind</dt>
                  <dd>{selectedUniverseNode.kind}</dd>
                </div>
                <div>
                  <dt>shard</dt>
                  <dd>{selectedUniverseNode.shard_id}</dd>
                </div>
                <div>
                  <dt>weight</dt>
                  <dd>{numberText(selectedUniverseNode.weight)}</dd>
                </div>
              </dl>
              <button className="panel-action" type="button" onClick={() => openUniverseNodeIn2D(selectedUniverseNode)}>
                <Route size={16} />
                打开 2D 局部路线
              </button>
            </section>

            {selectedShard && (
              <section className="panel">
                <div className="panel-title">
                  <Layers3 size={17} />
                  <h2>知识分片摘要</h2>
                </div>
                <dl className="kv">
                  <div>
                    <dt>files</dt>
                    <dd>{selectedShard.file_count}</dd>
                  </div>
                  <div>
                    <dt>routes</dt>
                    <dd>{routeGraphStats.subjects.find((item) => item.subject === selectedShard.subject)?.route_count ?? 0}</dd>
                  </div>
                  <div>
                    <dt>root</dt>
                    <dd>{selectedShard.root_label}</dd>
                  </div>
                  <div>
                    <dt>subject</dt>
                    <dd>{selectedShard.subject}</dd>
                  </div>
                  <div>
                    <dt>x-domain</dt>
                    <dd>{associationGraph.cross_domain_count}</dd>
                  </div>
                </dl>
                <div className="keyword-row">
                  {selectedShard.keywords.slice(0, 12).map((keyword, keywordIndex) => (
                    <span key={`${keyword}-${keywordIndex}`}>{keyword}</span>
                  ))}
                </div>
                <div className="shard-files">
                  {selectedShard.sample_files.slice(0, 5).map((file) => (
                    <article key={file.id}>
                      <strong>{file.title}</strong>
                      <small>{file.path}</small>
                      <p>{file.excerpt}</p>
                    </article>
                  ))}
                </div>
              </section>
            )}

            {selectedRoot && (
              <section className="panel">
                <div className="panel-title">
                  <Layers3 size={17} />
                  <h2>知识根分片</h2>
                </div>
                <dl className="kv">
                  <div>
                    <dt>files</dt>
                    <dd>{selectedRoot.fileCount}</dd>
                  </div>
                  <div>
                    <dt>root</dt>
                    <dd>{selectedRoot.label}</dd>
                  </div>
                  <div>
                    <dt>shards</dt>
                    <dd>{relatedRootShards.length}</dd>
                  </div>
                </dl>
                <div className="relation-list">
                  {relatedRootShards.map((shard, shardIndex) => (
                    <article key={shardViewKey(shard, shardIndex)}>
                      <strong>{shard.subject}</strong>
                      <p>{shard.file_count} files / {shard.route_id}</p>
                    </article>
                  ))}
                </div>
              </section>
            )}

            <section className="panel">
              <div className="panel-title">
                <GitBranch size={17} />
                <h2>相关空间边</h2>
              </div>
              <div className="relation-list">
                {relatedUniverseLinks.slice(0, 8).map((link) => (
                  <article key={`${link.source}-${link.target}-${link.type}`}>
                    <strong>{link.type}</strong>
                    <p>{link.source} {'->'} {link.target}</p>
                  </article>
                ))}
              </div>
            </section>

            <section className="panel">
              <div className="panel-title">
                <Layers3 size={17} />
                <h2>双层定位</h2>
              </div>
              <p className="panel-copy">
                3D 负责学科星团、跨域联想和大局感；2D 负责某一条路线的 FAME 边、GoalGate 剪枝、patch proposal 和调试接口。
              </p>
            </section>
          </>
        )}

        {view === 'route' && (
          <>
            <section className="panel module-editor-panel">
              <div className="panel-title">
                <Pencil size={17} />
                <h2>模块编辑</h2>
              </div>
              <p className="panel-copy">双击 2D 模块会进入这里；修改先成为本地草稿和 proposal。</p>
              <form
                key={`module-editor-${editingNode?.id ?? selectedNode.id}`}
                className="patch-form"
                onSubmit={(event) => {
                  event.preventDefault()
                  saveModuleFromForm(event.currentTarget)
                }}
              >
                <input name="node_id" type="hidden" value={editingNode?.id ?? selectedNode.id} />
                <label>label<input name="label" defaultValue={editingNode?.label ?? selectedNode.label} /></label>
                <label>kind
                  <select name="kind" defaultValue={editingNode?.kind ?? selectedNode.kind}>
                    <option value="intent">intent</option>
                    <option value="association">association</option>
                    <option value="abstraction">abstraction</option>
                    <option value="rule">rule</option>
                    <option value="tool">tool</option>
                    <option value="quality">quality</option>
                    <option value="summary">summary</option>
                    <option value="lesson">lesson</option>
                  </select>
                </label>
                <label>summary<textarea name="summary" rows={4} defaultValue={editingNode?.summary ?? selectedNode.summary} /></label>
                <label>source_ref<input name="source_ref" defaultValue={editingNode?.source_ref ?? selectedNode.source_ref} /></label>
                <button type="submit"><Save size={16} />保存模块草稿</button>
              </form>
              <div className="module-actions">
                <button type="button" onClick={addModuleFromCurrent}><Plus size={15} />新增模块</button>
                <button type="button" onClick={connectModuleToPatch}><GitBranch size={15} />新增路径</button>
                <button type="button" onClick={deleteSelectedPath}><Trash2 size={15} />删除路径</button>
                <button className="danger" type="button" onClick={deleteEditingModule}><Trash2 size={15} />删除模块</button>
              </div>
              <dl className="kv">
                <div>
                  <dt>route</dt>
                  <dd>{selectedScope.route_id}</dd>
                </div>
                <div>
                  <dt>modules</dt>
                  <dd>{currentRouteNodes.length}</dd>
                </div>
                <div>
                  <dt>paths</dt>
                  <dd>{currentFameEdges.length}</dd>
                </div>
              </dl>
            </section>
            <EdgeInspector edge={selectedEdge} />
          </>
        )}

        {view === 'agent' && (
          <section className="panel tall agent-runtime-panel">
            <div className="panel-title">
              <BrainCircuit size={17} />
              <h2>Agent Runtime</h2>
            </div>
            <p className="panel-copy">
              万能插件入口以 MCP 为主，HTTP / CLI / IDE / workflow 为适配层；agent 只能提交 ProposedAction，执行必须经过 Enforcement Kernel。
            </p>

            <div className="runtime-section">
              <h3>Connectors</h3>
              <div className="connector-grid">
                {agentConnectors.map((connector) => (
                  <article key={connector.adapter_id}>
                    <header>
                      <strong>{connector.adapter_id}</strong>
                      <span className={`connector-status connector-${connector.status}`}>{connector.kind}</span>
                    </header>
                    <p>{connector.contract}</p>
                    <small>{connector.exposes.join(' / ')}</small>
                  </article>
                ))}
              </div>
            </div>

            <div className="runtime-section">
              <h3>Thinking Pipeline</h3>
              <div className="thinking-list">
                {thinkingStages.map((stage, index) => (
                  <article key={stage.mode}>
                    <b>{String(index + 1).padStart(2, '0')}</b>
                    <div>
                      <strong>{stage.mode}</strong>
                      <p>{stage.input} {'->'} {stage.output}</p>
                      <small>{stage.guardrail}</small>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div className="runtime-section">
              <h3>Enforcement Preview</h3>
              <div className={`approval-card ${actionPreview.approved ? 'approved' : 'blocked'}`}>
                <strong>{actionPreview.approved ? 'ApprovedAction ready' : 'Action blocked'}</strong>
                <span>{actionPreview.approved ? actionPreview.approval_token : actionPreview.blocked_reason}</span>
                <p>{actionProposal.intended_adapter} / {actionProposal.intended_tool_id}</p>
              </div>
              <div className="check-list">
                {actionPreview.checks.map((check) => (
                  <article className={`check-${check.status}`} key={check.check_id}>
                    <strong>{check.label}</strong>
                    <span>{check.status}</span>
                    <p>{check.detail}</p>
                  </article>
                ))}
              </div>
            </div>

            <div className="runtime-section">
              <h3>Semantic Auto-Fit</h3>
              <div className="semantic-list">
                {semanticProposals.length > 0 ? (
                  semanticProposals.map((proposal) => (
                    <article className={`semantic-${proposal.confidence}`} key={proposal.proposal_id}>
                      <strong>{proposal.target_label}</strong>
                      <span>{proposal.anchor_label} / {proposal.score}</span>
                      <p>{proposal.rationale}</p>
                      <small>{proposal.formula}</small>
                    </article>
                  ))
                ) : (
                  <article>
                    <strong>等待路线样本</strong>
                    <p>当前分片还没有足够 route_record 可生成语义适配提案。</p>
                  </article>
                )}
              </div>
            </div>

            <div className="runtime-section">
              <h3>Context Pack</h3>
              <div className="context-card">
                <strong>{contextPack.scope_key}</strong>
                <span>{contextPack.estimated_tokens} tokens / {contextPack.summary_ref}</span>
              </div>
              <div className="context-columns">
                <article>
                  <b>Retain</b>
                  <ul>{contextPack.retained_items.map((item, itemIndex) => <li key={`${item}-${itemIndex}`}>{item}</li>)}</ul>
                </article>
                <article>
                  <b>Release</b>
                  <ul>{contextPack.released_items.map((item, itemIndex) => <li key={`${item}-${itemIndex}`}>{item}</li>)}</ul>
                </article>
              </div>
            </div>
          </section>
        )}

        {view === 'project' && (
          <section className="panel tall project-memory-panel">
            <div className="panel-title">
              <Network size={17} />
              <h2>Project Memory</h2>
            </div>
            {selectedProject ? (
              <>
                <div className="project-hero">
                  <strong>{selectedProject.manifest.project_name}</strong>
                  <span>{selectedProject.manifest.project_id} / {selectedProject.manifest.project_phase}</span>
                  <p>{selectedProject.manifest.workspace_root}</p>
                </div>

                <div className="isolation-card">
                  <strong>Core Knowledge Isolation</strong>
                  <span>{String(selectedProject.manifest.memory_policy.write_scope ?? 'project_overlay_only')}</span>
                  <p>Core knowledge is read-only. Project lessons can only become promotion candidates until review approves them.</p>
                </div>

                <dl className="kv">
                  <div><dt>nodes</dt><dd>{selectedProject.stats.node_count}</dd></div>
                  <div><dt>edges</dt><dd>{selectedProject.stats.edge_count}</dd></div>
                  <div><dt>overlays</dt><dd>{selectedProject.stats.fame_overlay_count}</dd></div>
                  <div><dt>tools</dt><dd>{selectedProject.stats.tool_invocation_count}</dd></div>
                  <div><dt>lessons</dt><dd>{selectedProject.stats.failure_lesson_count}</dd></div>
                  <div><dt>promote</dt><dd>{selectedProject.stats.promotion_candidate_count}</dd></div>
                </dl>

                <div className="runtime-section">
                  <h3>Project FAME Overlay</h3>
                  <div className="fame-grid">
                    {fameKeys.map((key) => (
                      <div className="fame-meter" key={key}>
                        <span>{key}</span>
                        <div>
                          <i style={{ width: `${selectedProject.stats.avg_fame[key] * 100}%` }} />
                        </div>
                        <b>{numberText(selectedProject.stats.avg_fame[key])}</b>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="runtime-section">
                  <h3>Project Nodes</h3>
                  <div className="memory-list">
                    {selectedProject.nodes.map((node) => (
                      <article key={node.id}>
                        <header>
                          <strong>{node.label}</strong>
                          <span>{node.layer}</span>
                        </header>
                        <p>{node.summary}</p>
                        <small>{node.status} / {node.scope.route_id}</small>
                      </article>
                    ))}
                  </div>
                </div>

                <div className="runtime-section">
                  <h3>Tool Summaries</h3>
                  <div className="memory-list">
                    {selectedProject.toolInvocations.map((tool) => (
                      <article key={tool.invocation_id}>
                        <header>
                          <strong>{tool.tool_id}</strong>
                          <span>{tool.status}</span>
                        </header>
                        <p>{tool.outputs_summary}</p>
                        <small>{tool.route_id}</small>
                      </article>
                    ))}
                  </div>
                </div>

                <div className="runtime-section">
                  <h3>Failure Lessons</h3>
                  <div className="memory-list">
                    {selectedProject.failureLessons.map((lesson) => (
                      <article className="lesson-card" key={lesson.lesson_id}>
                        <header>
                          <strong>{lesson.failure_category}</strong>
                          <span>{lesson.route_id}</span>
                        </header>
                        <p>{lesson.summary}</p>
                        <small>{lesson.fix_recipe}</small>
                      </article>
                    ))}
                  </div>
                </div>

                <div className="runtime-section">
                  <h3>Context Summaries</h3>
                  <div className="memory-list">
                    {selectedProject.contextSummaries.map((summary) => (
                      <article key={summary.id}>
                        <strong>{summary.title}</strong>
                        <p>{summary.excerpt}</p>
                        <small>{summary.path}</small>
                      </article>
                    ))}
                  </div>
                </div>

                <div className="runtime-section">
                  <h3>Promotion Candidates</h3>
                  <div className="memory-list">
                    {selectedProject.promotionCandidates.map((candidate) => (
                      <article className={candidate.readiness.blocked ? 'promotion-blocked' : 'promotion-ready'} key={candidate.proposal_id}>
                        <header>
                          <strong>{candidate.proposal_id}</strong>
                          <span>{candidate.review_status} / {candidate.readiness.score}</span>
                        </header>
                        <p>{candidate.content_summary}</p>
                        <small>{candidate.readiness.reason}</small>
                      </article>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <p className="panel-copy">No project memory graph is loaded yet.</p>
            )}
          </section>
        )}

        {view === 'assets' && (
          <section className="panel tall asset-inspector-panel">
            <div className="panel-title">
              <Layers3 size={17} />
              <h2>Multimodal Assets</h2>
            </div>

            <div className="isolation-card">
              <strong>Light Index Boundary</strong>
              <span>{String(multimodalAssets.manifest.policy.knowledge_graph_weight ?? 'light_index_only')}</span>
              <p>Raw files, OCR/ASR/caption, embeddings and extraction history stay in the asset database. The knowledge graph keeps only preview indexes and route anchors.</p>
            </div>

            <div className="sync-card">
              <strong>Manual Sync Boundary</strong>
              <span>{String(multimodalAssets.manifest.policy.manual_knowledge_sync_policy ?? 'KnowledgePatchProposal -> AssetDbSyncItem')}</span>
              <p>Manual knowledge edits create sync proposals for asset_index, asset_edges and FAME history. Database writes still require review and ApprovedAction.</p>
            </div>

            <dl className="kv">
              <div><dt>assets</dt><dd>{multimodalAssets.stats.asset_count}</dd></div>
              <div><dt>indexes</dt><dd>{multimodalAssets.stats.index_count}</dd></div>
              <div><dt>edges</dt><dd>{multimodalAssets.stats.edge_count}</dd></div>
              <div><dt>runs</dt><dd>{multimodalAssets.stats.extraction_run_count}</dd></div>
              <div><dt>history</dt><dd>{multimodalAssets.stats.fame_history_count}</dd></div>
              <div><dt>sync</dt><dd>{assetSyncQueue.length}</dd></div>
              <div><dt>pending</dt><dd>{pendingAssetSyncCount}</dd></div>
              <div><dt>store</dt><dd>{multimodalAssets.manifest.store_id}</dd></div>
            </dl>

            <div className="runtime-section">
              <h3>Modality Counts</h3>
              <div className="keyword-row">
                {Object.entries(multimodalAssets.stats.modality_counts).map(([modality, count]) => (
                  <span key={modality}>{modality}: {count}</span>
                ))}
              </div>
            </div>

            {selectedAsset ? (
              <>
                <div className="project-hero">
                  <strong>{selectedAsset.label}</strong>
                  <span>{selectedAsset.modality} / {selectedAsset.preview_type}</span>
                  <p>{selectedAsset.summary}</p>
                </div>

                <div className="runtime-section">
                  <h3>Asset FAME Summary</h3>
                  <div className="fame-grid">
                    {fameKeys.map((key) => (
                      <div className="fame-meter" key={key}>
                        <span>{key}</span>
                        <div>
                          <i style={{ width: `${Number(selectedAsset.fame_summary[key] ?? 0) * 100}%` }} />
                        </div>
                        <b>{numberText(Number(selectedAsset.fame_summary[key] ?? 0))}</b>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="runtime-section">
                  <h3>Database References</h3>
                  <div className="memory-list">
                    <article>
                      <header>
                        <strong>{selectedAsset.asset_id}</strong>
                        <span>{selectedAsset.source_type}</span>
                      </header>
                      <p>{selectedAsset.caption}</p>
                      <small>db_ref: {selectedAsset.db_ref}</small>
                      <small>object_ref: {selectedAsset.object_ref}</small>
                      <small>text_ref: {selectedAsset.extracted_text_ref}</small>
                    </article>
                  </div>
                </div>

                <div className="runtime-section">
                  <h3>Route Anchors</h3>
                  <div className="keyword-row">
                    {selectedAsset.route_refs.map((route, routeIndex) => <span key={`${route}-${routeIndex}`}>{route}</span>)}
                    {selectedAsset.subject_refs.map((subject, subjectIndex) => <span key={`${subject}-${subjectIndex}`}>{subject}</span>)}
                  </div>
                </div>

                <div className="runtime-section">
                  <h3>Evidence Edges</h3>
                  <div className="memory-list">
                    {selectedAssetEdges.map((edge) => (
                      <article key={edge.edge_id}>
                        <header>
                          <strong>{edge.relation_type}</strong>
                          <span>{edge.scope.route_id}</span>
                        </header>
                        <p>{edge.summary}</p>
                        <small>{edge.source_id} -&gt; {edge.target_id}</small>
                      </article>
                    ))}
                  </div>
                </div>

                <div className="runtime-section">
                  <h3>Extraction Runs</h3>
                  <div className="memory-list">
                    {selectedAssetRuns.map((run) => (
                      <article key={run.run_id}>
                        <header>
                          <strong>{run.extractor}</strong>
                          <span>{run.status}</span>
                        </header>
                        <p>{run.notes}</p>
                        <small>{Object.entries(run.outputs).map(([key, value]) => `${key}:${value}`).join(' / ')}</small>
                      </article>
                    ))}
                  </div>
                </div>

                <div className="runtime-section">
                  <h3>FAME History</h3>
                  <div className="memory-list">
                    {selectedAssetHistory.map((history) => (
                      <article key={history.history_id}>
                        <header>
                          <strong>{history.event_type}</strong>
                          <span>{history.verified_at}</span>
                        </header>
                        <p>{history.evidence_refs.join(' / ')}</p>
                        <small>kappa {numberText(history.fame.kappa)} / lambda {numberText(history.fame.lambda)}</small>
                      </article>
                    ))}
                  </div>
                </div>

                <div className="runtime-section">
                  <h3>Manual Asset DB Sync</h3>
                  <div className="memory-list sync-list">
                    {selectedAssetSyncItems.length > 0 ? selectedAssetSyncItems.map((item) => (
                      <article className={`sync-item sync-${item.status}`} key={item.sync_id}>
                        <header>
                          <strong>{item.operation}</strong>
                          <span>{item.status}</span>
                        </header>
                        <p>{item.reason}</p>
                        <small>proposal: {item.source_proposal_id}</small>
                        <small>route: {item.route_id}</small>
                        <small>db: {Object.values(item.db_refs).join(' / ')}</small>
                        <small>fields: {(item.proposed_changes.fields ?? []).join(', ') || 'route_refs'}</small>
                        <small>guard: {item.guardrails.join(' / ')}</small>
                      </article>
                    )) : (
                      <article className="sync-item">
                        <header>
                          <strong>No pending sync for this asset</strong>
                          <span>clean</span>
                        </header>
                        <p>当前选中资产没有由人工知识网调整触发的数据库同步项。</p>
                      </article>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <p className="panel-copy">No multimodal asset index is loaded yet.</p>
            )}
          </section>
        )}

        {view === 'v13' && (
          <section className="panel tall">
            <div className="panel-title">
              <BrainCircuit size={17} />
              <h2>v13 Runtime Inspector</h2>
            </div>
            <div className="retention-banner">
              <strong>Full Memory Retention</strong>
              <span>底层记忆全量保留；Context Pack 只加载摘要、refs 或按需原始记录。</span>
            </div>
            <dl className="kv">
              <div><dt>fame points</dt><dd>{v13Runtime.fameTimeseries.length}</dd></div>
              <div><dt>feedback</dt><dd>{v13Runtime.physicalFeedback.length}</dd></div>
              <div><dt>scac</dt><dd>{numberText(scacContractionRate)}</dd></div>
              <div><dt>entropy drop</dt><dd>{numberText(posteriorEntropyDropAvg)}</dd></div>
              <div><dt>truth</dt><dd>{v13Runtime.temporalTruth.length}</dd></div>
              <div><dt>outbox</dt><dd>{syncOutboxPendingCount}</dd></div>
            </dl>

            <div className="runtime-section">
              <h3>Selected Edge Dynamics</h3>
              <div className="memory-list">
                {selectedEdgeFameHistory.length > 0 ? selectedEdgeFameHistory.map((point) => (
                  <article key={point.point_id}>
                    <header>
                      <strong>{point.edge_id}</strong>
                      <span>{point.update_reason}</span>
                    </header>
                    <p>{point.event_ref}</p>
                    <small>xi {numberText(point.inertia_xi)} / predicted Δ {numberText(point.predicted_delta)} / observed Δ {numberText(point.observed_delta)}</small>
                  </article>
                )) : (
                  <article>
                    <header>
                      <strong>{selectedEdge?.edge_id ?? 'no edge'}</strong>
                      <span>no timeseries yet</span>
                    </header>
                    <p>当前边尚未写入 FAMETimeseriesPoint，后续反馈会追加而不是覆盖。</p>
                  </article>
                )}
              </div>
            </div>

            <div className="runtime-section">
              <h3>Non-convergent Guards</h3>
              <div className="memory-list">
                {v13Runtime.physicalFeedback.filter((event) => event.kappa_scac >= 1).map((event) => (
                  <article className="not-converged" key={event.event_id}>
                    <header>
                      <strong>{event.event_id}</strong>
                      <span>blocked retry</span>
                    </header>
                    <p>{event.required_next_step}</p>
                    <small>kappa_scac {numberText(event.kappa_scac)} / entropy {numberText(event.posterior_entropy_before - event.posterior_entropy_after)}</small>
                  </article>
                ))}
              </div>
            </div>

            <div className="runtime-section">
              <h3>Context Distillation</h3>
              <div className="memory-list">
                {v13Runtime.fullMemoryRetention.map((item) => (
                  <article key={item.memory_id}>
                    <header>
                      <strong>{item.memory_id}</strong>
                      <span>{item.context_action}</span>
                    </header>
                    <p>{item.reason}</p>
                    <small>{item.summary_ref}</small>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {view === 'fame' && <EdgeInspector edge={selectedEdge} />}

        {view === 'traversal' && (
          <section className="panel tall">
            <div className="panel-title">
              <Crosshair size={17} />
              <h2>找球门遍历</h2>
            </div>
            <p className="panel-copy">{activeGoalGate.success_condition}</p>
            <div className="timeline">
              {goalPath.steps.map((step) => (
                <article key={step.id}>
                  <h3>{step.name}</h3>
                  <p>{step.note}</p>
                  <b>保留</b>
                  <ul>{step.kept.map((item, itemIndex) => <li key={`${item}-${itemIndex}`}>{item}</li>)}</ul>
                  {step.pruned.length > 0 && (
                    <>
                      <b>剪枝</b>
                      <ul>{step.pruned.map((item) => <li key={item.id}>{item.id}: {item.reason}</li>)}</ul>
                    </>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}

        {view === 'patch' && (
          <section className="panel tall">
            <div className="panel-title">
              <Plus size={17} />
              <h2>KnowledgePatchProposal</h2>
            </div>
            <div className="patch-target-card">
              <strong>{selectedShard ? selectedScope.route_id : selectedUniverseNode.label}</strong>
              <span>{patchTargetFile}</span>
            </div>
            <div className="preset-grid" role="group" aria-label="Knowledge patch presets">
              {patchPresets.map((preset) => (
                <button
                  className={patchPreset === preset.type ? 'active' : ''}
                  key={preset.type}
                  type="button"
                  onClick={() => setPatchPreset(preset.type)}
                >
                  <Plus size={14} />
                  <strong>{preset.label}</strong>
                  <small>{preset.type}</small>
                </button>
              ))}
            </div>
            <form
              key={`${patchPreset}-${selectedScope.route_id}-${patchTargetFile}`}
              className="patch-form"
              onSubmit={(event) => {
                event.preventDefault()
                const form = event.currentTarget
                const nextProposal = createProposal(proposals, form)[0]
                setProposals((items) => [nextProposal, ...items])
                form.reset()
              }}
            >
              <label>route_id<input name="route_id" defaultValue={selectedScope.route_id} /></label>
              <label>file_path<input name="file_path" defaultValue={patchTargetFile} /></label>
              <label>section<input name="section" defaultValue={activePatchPreset.section} /></label>
              <label>patch_type
                <select
                  name="patch_type"
                  value={patchPreset}
                  onChange={(event) => setPatchPreset(event.target.value as KnowledgePatchProposal['patch_type'])}
                >
                  <option value="add_route">add_route</option>
                  <option value="edit_route">edit_route</option>
                  <option value="add_edge">add_edge</option>
                  <option value="update_tool_manual">update_tool_manual</option>
                  <option value="add_lesson">add_lesson</option>
                  <option value="deprecate_edge">deprecate_edge</option>
                </select>
              </label>
              <label>content_summary<textarea name="content_summary" rows={4} defaultValue={activePatchPreset.summary} /></label>
              <label>evidence_refs
                <textarea
                  name="evidence_refs"
                  rows={3}
                  defaultValue={[patchTargetFile, selectedEdge?.edge_id].filter(Boolean).join('\n')}
                />
              </label>
              <label>affected_edges<input name="affected_edges" defaultValue={selectedEdge?.edge_id ?? ''} /></label>
              <label>initial_fame<input name="initial_fame" defaultValue={activePatchPreset.fame} /></label>
              <button type="submit"><Plus size={16} />提交 proposal</button>
            </form>
            <div className="proposal-list">
              {proposals.map((proposal) => (
                <article key={proposal.proposal_id}>
                  <strong>{proposal.proposal_id}</strong>
                  <span>{proposal.patch_type} / {proposal.review_status}</span>
                  <p>{proposal.content_summary}</p>
                </article>
              ))}
            </div>

            <div className="runtime-section">
              <h3>Asset DB Sync Preview</h3>
              <p className="panel-copy">人工知识网修改不会直接写资产数据库；这里生成同步项，等待 review 和 ApprovedAction。</p>
              <div className="memory-list sync-list">
                {assetSyncQueue.slice(0, 8).map((item) => (
                  <article className={`sync-item sync-${item.status}`} key={item.sync_id}>
                    <header>
                      <strong>{item.target_asset_id}</strong>
                      <span>{item.operation}</span>
                    </header>
                    <p>{item.reason}</p>
                    <small>{item.source_proposal_id} / {item.status} / {item.source}</small>
                    <small>{item.file_path}</small>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {view === 'debug' && (
          <section className="panel tall">
            <div className="panel-title">
              <ShieldCheck size={17} />
              <h2>模块调试接口</h2>
            </div>
            <div className="module-list">
              {moduleDebugStates.map((module) => (
                <article key={module.module_id}>
                  <header>
                    <strong>{module.module_id}</strong>
                    <span className={module.health}>{module.health}</span>
                  </header>
                  <p>health / explain / dry-run / replay / metrics / trace</p>
                  <dl className="kv">
                    <div><dt>latency</dt><dd>{module.latency_ms}ms</dd></div>
                    <div><dt>trace</dt><dd>{module.last_trace_id}</dd></div>
                  </dl>
                  <pre>{JSON.stringify(module.metrics, null, 2)}</pre>
                </article>
              ))}
            </div>
          </section>
        )}
      </aside>
    </main>
  )
}

export default App
