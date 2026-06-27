import { mkdirSync } from 'node:fs'
import { DatabaseSync } from 'node:sqlite'
import { defaultAgentRecord, hashToken, normalizeAgent } from './auth.mjs'
import { gatewayDbPath, gatewayStoreDir } from './paths.mjs'
import { nowIso, stableId } from './json.mjs'

export const eventTypes = {
  proposedAction: 'ProposedAction',
  enforcementDecision: 'EnforcementDecision',
  approvedAction: 'ApprovedAction',
  blockedAction: 'BlockedAction',
  toolResult: 'ToolResult',
  contextPack: 'ContextPack',
  summaryMemory: 'SummaryMemory',
  knowledgePatchProposal: 'KnowledgePatchProposal',
  assetDbSyncItem: 'AssetDbSyncItem',
  clockEvent: 'ClockEvent',
  traceSpan: 'TraceSpan',
}

function ensureColumn(db, table, column, definition) {
  const columns = db.prepare(`PRAGMA table_info(${table})`).all().map((row) => row.name)
  if (!columns.includes(column)) {
    db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`)
  }
}

export function openGatewayStore(dbPath = gatewayDbPath) {
  mkdirSync(gatewayStoreDir, { recursive: true })
  const db = new DatabaseSync(dbPath)
  db.exec(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS events (
      event_id TEXT PRIMARY KEY,
      event_type TEXT NOT NULL,
      project_id TEXT NOT NULL,
      subject TEXT NOT NULL,
      route_id TEXT NOT NULL,
      task_id TEXT NOT NULL,
      payload_json TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_events_scope
      ON events(project_id, subject, route_id, task_id, created_at);

    CREATE INDEX IF NOT EXISTS idx_events_type
      ON events(event_type, created_at);

    CREATE TABLE IF NOT EXISTS approvals (
      approval_token TEXT PRIMARY KEY,
      approval_token_hash TEXT,
      action_id TEXT NOT NULL,
      agent_id TEXT,
      project_id TEXT NOT NULL,
      subject TEXT NOT NULL,
      route_id TEXT NOT NULL,
      task_id TEXT NOT NULL,
      adapter TEXT NOT NULL,
      tool_id TEXT NOT NULL,
      status TEXT NOT NULL,
      checks_json TEXT NOT NULL,
      approval_payload_json TEXT,
      expires_at TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_approvals_action
      ON approvals(action_id, status, expires_at);

    CREATE TABLE IF NOT EXISTS checkpoints (
      checkpoint_id TEXT PRIMARY KEY,
      project_id TEXT NOT NULL,
      subject TEXT NOT NULL,
      route_id TEXT NOT NULL,
      task_id TEXT NOT NULL,
      state_json TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS agents (
      agent_id TEXT PRIMARY KEY,
      api_key_hash TEXT NOT NULL UNIQUE,
      role TEXT NOT NULL,
      scopes_json TEXT NOT NULL,
      allowed_tools_json TEXT NOT NULL,
      allowed_adapters_json TEXT NOT NULL,
      status TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS scheduler_jobs (
      job_id TEXT PRIMARY KEY,
      project_id TEXT NOT NULL,
      subject TEXT NOT NULL,
      route_id TEXT NOT NULL,
      task_id TEXT NOT NULL,
      kind TEXT NOT NULL,
      status TEXT NOT NULL,
      run_at TEXT NOT NULL,
      payload_json TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_scheduler_due
      ON scheduler_jobs(status, run_at, project_id, subject, route_id);

    CREATE TABLE IF NOT EXISTS semantic_documents (
      doc_id TEXT PRIMARY KEY,
      kind TEXT NOT NULL,
      project_id TEXT NOT NULL,
      subject TEXT NOT NULL,
      route_id TEXT NOT NULL,
      title TEXT NOT NULL,
      body TEXT NOT NULL,
      keywords_json TEXT NOT NULL,
      source_ref TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS semantic_terms (
      term TEXT NOT NULL,
      doc_id TEXT NOT NULL,
      tf INTEGER NOT NULL,
      PRIMARY KEY(term, doc_id)
    );

    CREATE INDEX IF NOT EXISTS idx_semantic_terms
      ON semantic_terms(term, tf);

    CREATE INDEX IF NOT EXISTS idx_semantic_scope
      ON semantic_documents(project_id, subject, route_id, kind);

    CREATE TABLE IF NOT EXISTS asset_records (
      asset_id TEXT PRIMARY KEY,
      project_id TEXT NOT NULL,
      modality TEXT NOT NULL,
      label TEXT NOT NULL,
      db_ref TEXT NOT NULL,
      object_ref TEXT NOT NULL,
      text_ref TEXT NOT NULL,
      index_json TEXT NOT NULL,
      fame_json TEXT NOT NULL,
      sync_status TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_asset_scope
      ON asset_records(project_id, modality, sync_status);

    CREATE TABLE IF NOT EXISTS asset_sync_records (
      sync_id TEXT PRIMARY KEY,
      status TEXT NOT NULL,
      proposal_id TEXT NOT NULL,
      asset_id TEXT NOT NULL,
      operation TEXT NOT NULL,
      payload_json TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `)
  ensureColumn(db, 'approvals', 'approval_token_hash', 'TEXT')
  ensureColumn(db, 'approvals', 'agent_id', 'TEXT')
  ensureColumn(db, 'approvals', 'approval_payload_json', 'TEXT')
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_approvals_hash
      ON approvals(approval_token_hash);
  `)

  const now = nowIso()
  const devAgent = defaultAgentRecord(now)
  db.prepare(`
    INSERT INTO agents(
      agent_id, api_key_hash, role, scopes_json, allowed_tools_json, allowed_adapters_json, status, created_at, updated_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(agent_id) DO UPDATE SET
      api_key_hash = excluded.api_key_hash,
      role = excluded.role,
      scopes_json = excluded.scopes_json,
      allowed_tools_json = excluded.allowed_tools_json,
      allowed_adapters_json = excluded.allowed_adapters_json,
      status = excluded.status,
      updated_at = excluded.updated_at
  `).run(
    devAgent.agent_id,
    devAgent.api_key_hash,
    devAgent.role,
    devAgent.scopes_json,
    devAgent.allowed_tools_json,
    devAgent.allowed_adapters_json,
    devAgent.status,
    devAgent.created_at,
    devAgent.updated_at,
  )
  return db
}

export class GatewayStore {
  constructor(db = openGatewayStore()) {
    this.db = db
    this.insertEventStmt = db.prepare(`
      INSERT INTO events(event_id, event_type, project_id, subject, route_id, task_id, payload_json, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `)
    this.insertApprovalStmt = db.prepare(`
      INSERT INTO approvals(
        approval_token,
        approval_token_hash,
        action_id,
        agent_id,
        project_id,
        subject,
        route_id,
        task_id,
        adapter,
        tool_id,
        status,
        checks_json,
        approval_payload_json,
        expires_at,
        created_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    this.updateApprovalStatusStmt = db.prepare(`
      UPDATE approvals SET status = ? WHERE approval_token = ?
    `)
    this.getApprovalStmt = db.prepare(`
      SELECT * FROM approvals WHERE approval_token = ?
    `)
    this.getApprovalByHashStmt = db.prepare(`
      SELECT * FROM approvals WHERE approval_token_hash = ?
    `)
    this.insertCheckpointStmt = db.prepare(`
      INSERT INTO checkpoints(checkpoint_id, project_id, subject, route_id, task_id, state_json, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `)
    this.getAgentByKeyHashStmt = db.prepare(`
      SELECT * FROM agents WHERE api_key_hash = ? AND status = 'active'
    `)
    this.upsertSchedulerJobStmt = db.prepare(`
      INSERT INTO scheduler_jobs(
        job_id, project_id, subject, route_id, task_id, kind, status, run_at, payload_json, created_at, updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(job_id) DO UPDATE SET
        project_id = excluded.project_id,
        subject = excluded.subject,
        route_id = excluded.route_id,
        task_id = excluded.task_id,
        kind = excluded.kind,
        status = excluded.status,
        run_at = excluded.run_at,
        payload_json = excluded.payload_json,
        updated_at = excluded.updated_at
    `)
    this.updateSchedulerJobStmt = db.prepare(`
      UPDATE scheduler_jobs SET status = ?, updated_at = ? WHERE job_id = ?
    `)
    this.upsertSemanticDocumentStmt = db.prepare(`
      INSERT INTO semantic_documents(
        doc_id, kind, project_id, subject, route_id, title, body, keywords_json, source_ref, updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(doc_id) DO UPDATE SET
        kind = excluded.kind,
        project_id = excluded.project_id,
        subject = excluded.subject,
        route_id = excluded.route_id,
        title = excluded.title,
        body = excluded.body,
        keywords_json = excluded.keywords_json,
        source_ref = excluded.source_ref,
        updated_at = excluded.updated_at
    `)
    this.insertSemanticTermStmt = db.prepare(`
      INSERT INTO semantic_terms(term, doc_id, tf)
      VALUES (?, ?, ?)
      ON CONFLICT(term, doc_id) DO UPDATE SET tf = excluded.tf
    `)
    this.upsertAssetRecordStmt = db.prepare(`
      INSERT INTO asset_records(
        asset_id, project_id, modality, label, db_ref, object_ref, text_ref, index_json, fame_json, sync_status, updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(asset_id) DO UPDATE SET
        project_id = excluded.project_id,
        modality = excluded.modality,
        label = excluded.label,
        db_ref = excluded.db_ref,
        object_ref = excluded.object_ref,
        text_ref = excluded.text_ref,
        index_json = excluded.index_json,
        fame_json = excluded.fame_json,
        sync_status = excluded.sync_status,
        updated_at = excluded.updated_at
    `)
    this.insertAssetSyncRecordStmt = db.prepare(`
      INSERT INTO asset_sync_records(sync_id, status, proposal_id, asset_id, operation, payload_json, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(sync_id) DO UPDATE SET
        status = excluded.status,
        proposal_id = excluded.proposal_id,
        asset_id = excluded.asset_id,
        operation = excluded.operation,
        payload_json = excluded.payload_json,
        updated_at = excluded.updated_at
    `)
  }

  appendEvent(eventType, scope, payload) {
    const createdAt = nowIso()
    const eventId = stableId(eventType.replace(/[^a-zA-Z0-9]+/g, '-').toLowerCase())
    this.insertEventStmt.run(
      eventId,
      eventType,
      scope.project_id,
      scope.subject,
      scope.route_id,
      scope.task_id,
      JSON.stringify(payload),
      createdAt,
    )
    return { event_id: eventId, event_type: eventType, created_at: createdAt, payload }
  }

  insertApproval(approval) {
    this.insertApprovalStmt.run(
      approval.approval_token,
      approval.approval_token_hash ?? hashToken(approval.approval_token),
      approval.action_id,
      approval.agent_id ?? '',
      approval.scope.project_id,
      approval.scope.subject,
      approval.scope.route_id,
      approval.scope.task_id,
      approval.adapter,
      approval.tool_id,
      approval.status,
      JSON.stringify(approval.checks),
      JSON.stringify(approval.approval_payload ?? {}),
      approval.expires_at,
      approval.created_at,
    )
  }

  getApproval(token) {
    const row = this.getApprovalStmt.get(token) ?? this.getApprovalByHashStmt.get(hashToken(token))
    if (!row) return null
    return {
      approval_token: row.approval_token,
      approval_token_hash: row.approval_token_hash,
      action_id: row.action_id,
      agent_id: row.agent_id ?? '',
      scope: {
        project_id: row.project_id,
        subject: row.subject,
        route_id: row.route_id,
        task_id: row.task_id,
      },
      adapter: row.adapter,
      tool_id: row.tool_id,
      status: row.status,
      checks: JSON.parse(row.checks_json),
      approval_payload: row.approval_payload_json ? JSON.parse(row.approval_payload_json) : {},
      expires_at: row.expires_at,
      created_at: row.created_at,
    }
  }

  markApprovalUsed(token) {
    this.updateApprovalStatusStmt.run('used', token)
  }

  writeCheckpoint(scope, state) {
    const checkpointId = stableId('checkpoint')
    const createdAt = nowIso()
    this.insertCheckpointStmt.run(
      checkpointId,
      scope.project_id,
      scope.subject,
      scope.route_id,
      scope.task_id,
      JSON.stringify(state),
      createdAt,
    )
    return { checkpoint_id: checkpointId, created_at: createdAt }
  }

  getAgentByApiKeyHash(apiKeyHash) {
    return normalizeAgent(this.getAgentByKeyHashStmt.get(apiKeyHash))
  }

  scheduleJob(job) {
    const createdAt = job.created_at ?? nowIso()
    const updatedAt = job.updated_at ?? createdAt
    this.upsertSchedulerJobStmt.run(
      job.job_id,
      job.scope.project_id,
      job.scope.subject,
      job.scope.route_id,
      job.scope.task_id,
      job.kind,
      job.status,
      job.run_at,
      JSON.stringify(job.payload ?? {}),
      createdAt,
      updatedAt,
    )
    return { ...job, created_at: createdAt, updated_at: updatedAt }
  }

  listDueJobs(now = nowIso(), limit = 20) {
    const rows = this.db
      .prepare(`
        SELECT * FROM scheduler_jobs
        WHERE status = 'scheduled' AND run_at <= ?
        ORDER BY run_at ASC
        LIMIT ?
      `)
      .all(now, Math.min(Number(limit) || 20, 100))
    return rows.map((row) => this.normalizeJob(row))
  }

  listJobs({ project_id, subject, route_id, task_id, status, limit = 50 } = {}) {
    const clauses = []
    const params = []
    if (project_id) {
      clauses.push('project_id = ?')
      params.push(project_id)
    }
    if (subject) {
      clauses.push('subject = ?')
      params.push(subject)
    }
    if (route_id) {
      clauses.push('route_id = ?')
      params.push(route_id)
    }
    if (task_id) {
      clauses.push('task_id = ?')
      params.push(task_id)
    }
    if (status) {
      clauses.push('status = ?')
      params.push(status)
    }
    const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : ''
    return this.db
      .prepare(`SELECT * FROM scheduler_jobs ${where} ORDER BY run_at ASC LIMIT ?`)
      .all(...params, Math.min(Number(limit) || 50, 200))
      .map((row) => this.normalizeJob(row))
  }

  normalizeJob(row) {
    return {
      job_id: row.job_id,
      scope: {
        project_id: row.project_id,
        subject: row.subject,
        route_id: row.route_id,
        task_id: row.task_id,
      },
      kind: row.kind,
      status: row.status,
      run_at: row.run_at,
      payload: JSON.parse(row.payload_json),
      created_at: row.created_at,
      updated_at: row.updated_at,
    }
  }

  markJobStatus(jobId, status) {
    this.updateSchedulerJobStmt.run(status, nowIso(), jobId)
  }

  clearSemanticIndex() {
    this.db.exec('DELETE FROM semantic_terms; DELETE FROM semantic_documents;')
  }

  upsertSemanticDocument(doc, termCounts) {
    this.upsertSemanticDocumentStmt.run(
      doc.doc_id,
      doc.kind,
      doc.project_id,
      doc.subject,
      doc.route_id,
      doc.title,
      doc.body,
      JSON.stringify(doc.keywords ?? []),
      doc.source_ref,
      doc.updated_at ?? nowIso(),
    )
    this.db.prepare('DELETE FROM semantic_terms WHERE doc_id = ?').run(doc.doc_id)
    Object.entries(termCounts).forEach(([term, tf]) => {
      this.insertSemanticTermStmt.run(term, doc.doc_id, Number(tf) || 1)
    })
  }

  semanticSearch({ terms = [], scope = {}, top_k = 10 } = {}) {
    const uniqueTerms = [...new Set(terms.filter(Boolean))].slice(0, 12)
    if (uniqueTerms.length === 0) return []
    const placeholders = uniqueTerms.map(() => '?').join(', ')
    const clauses = [`t.term IN (${placeholders})`]
    const params = [...uniqueTerms]
    if (scope.project_id) {
      clauses.push("(d.project_id = ? OR d.project_id = '*')")
      params.push(scope.project_id)
    }
    if (scope.subject) {
      clauses.push("(d.subject = ? OR d.subject = '*' OR d.subject = '(root)')")
      params.push(scope.subject)
    }
    if (scope.route_id) {
      clauses.push("(d.route_id = ? OR d.route_id = '*')")
      params.push(scope.route_id)
    }
    const rows = this.db
      .prepare(`
        SELECT
          d.*,
          SUM(t.tf) AS raw_score,
          COUNT(DISTINCT t.term) AS matched_terms
        FROM semantic_terms t
        JOIN semantic_documents d ON d.doc_id = t.doc_id
        WHERE ${clauses.join(' AND ')}
        GROUP BY d.doc_id
        ORDER BY matched_terms DESC, raw_score DESC, d.updated_at DESC
        LIMIT ?
      `)
      .all(...params, Math.min(Number(top_k) || 10, 50))
    return rows.map((row) => ({
      doc_id: row.doc_id,
      kind: row.kind,
      scope: {
        project_id: row.project_id,
        subject: row.subject,
        route_id: row.route_id,
      },
      title: row.title,
      body: row.body,
      keywords: JSON.parse(row.keywords_json),
      source_ref: row.source_ref,
      score: Number(row.raw_score ?? 0),
      matched_terms: Number(row.matched_terms ?? 0),
      updated_at: row.updated_at,
    }))
  }

  upsertAssetRecord(asset) {
    const updatedAt = asset.updated_at ?? nowIso()
    this.upsertAssetRecordStmt.run(
      asset.asset_id,
      asset.project_id,
      asset.modality,
      asset.label,
      asset.db_ref,
      asset.object_ref,
      asset.text_ref,
      JSON.stringify(asset.index ?? {}),
      JSON.stringify(asset.fame ?? {}),
      asset.sync_status,
      updatedAt,
    )
    return { ...asset, updated_at: updatedAt }
  }

  insertAssetSyncRecord(sync) {
    const createdAt = sync.created_at ?? nowIso()
    const updatedAt = sync.updated_at ?? createdAt
    this.insertAssetSyncRecordStmt.run(
      sync.sync_id,
      sync.status,
      sync.proposal_id,
      sync.asset_id,
      sync.operation,
      JSON.stringify(sync.payload ?? {}),
      createdAt,
      updatedAt,
    )
    return { ...sync, created_at: createdAt, updated_at: updatedAt }
  }

  listAssets({ project_id, modality, sync_status, limit = 50 } = {}) {
    const clauses = []
    const params = []
    if (project_id) {
      clauses.push('project_id = ?')
      params.push(project_id)
    }
    if (modality) {
      clauses.push('modality = ?')
      params.push(modality)
    }
    if (sync_status) {
      clauses.push('sync_status = ?')
      params.push(sync_status)
    }
    const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : ''
    return this.db
      .prepare(`SELECT * FROM asset_records ${where} ORDER BY updated_at DESC LIMIT ?`)
      .all(...params, Math.min(Number(limit) || 50, 200))
      .map((row) => ({
        asset_id: row.asset_id,
        project_id: row.project_id,
        modality: row.modality,
        label: row.label,
        db_ref: row.db_ref,
        object_ref: row.object_ref,
        text_ref: row.text_ref,
        index: JSON.parse(row.index_json),
        fame: JSON.parse(row.fame_json),
        sync_status: row.sync_status,
        updated_at: row.updated_at,
      }))
  }

  listEvents({ project_id, subject, route_id, task_id, event_type, limit = 50 } = {}) {
    const clauses = []
    const params = []
    if (project_id) {
      clauses.push('project_id = ?')
      params.push(project_id)
    }
    if (subject) {
      clauses.push('subject = ?')
      params.push(subject)
    }
    if (route_id) {
      clauses.push('route_id = ?')
      params.push(route_id)
    }
    if (task_id) {
      clauses.push('task_id = ?')
      params.push(task_id)
    }
    if (event_type) {
      clauses.push('event_type = ?')
      params.push(event_type)
    }
    const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : ''
    const rows = this.db
      .prepare(`SELECT * FROM events ${where} ORDER BY created_at DESC LIMIT ?`)
      .all(...params, Math.min(Number(limit) || 50, 200))
    return rows.map((row) => ({
      event_id: row.event_id,
      event_type: row.event_type,
      scope: {
        project_id: row.project_id,
        subject: row.subject,
        route_id: row.route_id,
        task_id: row.task_id,
      },
      created_at: row.created_at,
      payload: JSON.parse(row.payload_json),
    }))
  }

  stats() {
    const eventCount = this.db.prepare('SELECT COUNT(*) AS count FROM events').get().count
    const approvalCount = this.db.prepare('SELECT COUNT(*) AS count FROM approvals').get().count
    const checkpointCount = this.db.prepare('SELECT COUNT(*) AS count FROM checkpoints').get().count
    const pendingApprovals = this.db.prepare("SELECT COUNT(*) AS count FROM approvals WHERE status = 'approved'").get().count
    const agentCount = this.db.prepare('SELECT COUNT(*) AS count FROM agents').get().count
    const scheduledClockCount = this.db.prepare("SELECT COUNT(*) AS count FROM scheduler_jobs WHERE status = 'scheduled'").get().count
    const semanticDocumentCount = this.db.prepare('SELECT COUNT(*) AS count FROM semantic_documents').get().count
    const semanticTermCount = this.db.prepare('SELECT COUNT(*) AS count FROM semantic_terms').get().count
    const assetRecordCount = this.db.prepare('SELECT COUNT(*) AS count FROM asset_records').get().count
    const assetSyncCount = this.db.prepare('SELECT COUNT(*) AS count FROM asset_sync_records').get().count
    return {
      event_count: eventCount,
      approval_count: approvalCount,
      checkpoint_count: checkpointCount,
      pending_approval_count: pendingApprovals,
      agent_count: agentCount,
      scheduled_clock_count: scheduledClockCount,
      semantic_document_count: semanticDocumentCount,
      semantic_term_count: semanticTermCount,
      asset_record_count: assetRecordCount,
      asset_sync_count: assetSyncCount,
    }
  }

  close() {
    this.db.close()
  }
}
