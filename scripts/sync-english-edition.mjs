import fs from 'node:fs'
import path from 'node:path'

const projectRoot = process.cwd()
const sourceRoot = path.join(projectRoot, 'versions', 'chinese-open')
const targetRoot = path.join(projectRoot, 'versions', 'english')

const fameFormula = '0.22*mu + 0.18*chi + 0.20*epsilon + 0.12*kappa + 0.10*nu + 0.08*rho - 0.06*abs(delta) - 0.04*risk'

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true })
}

function writeText(relativePath, text) {
  const file = path.join(targetRoot, relativePath)
  ensureDir(path.dirname(file))
  fs.writeFileSync(file, text.endsWith('\n') ? text : `${text}\n`, 'utf8')
}

function writeJson(relativePath, value) {
  writeText(relativePath, JSON.stringify(value, null, 2))
}

function readSourceJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(sourceRoot, relativePath), 'utf8'))
}

function readSourceJsonl(relativePath) {
  return fs.readFileSync(path.join(sourceRoot, relativePath), 'utf8')
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => JSON.parse(line))
}

function copySource(relativePath, transform = (value) => value) {
  const source = readSourceJson(relativePath)
  writeJson(relativePath, transform(source))
}

function copyText(relativePath, targetRelativePath = relativePath) {
  const source = fs.readFileSync(path.join(sourceRoot, relativePath), 'utf8')
  writeText(targetRelativePath, source)
}

const routeText = {
  'route-language-intent-to-scope': ['Intent to Scope', 'Translate the user goal into edition_id, project_id, subject, route_id, task_id and context budget before loading subject knowledge.', ['intent', 'scope', 'context', 'route']],
  'route-language-abstraction-to-association': ['Abstraction to Association Transfer', 'Lift a local problem to an abstraction layer, search adjacent subjects for transferable methods, and attach validation conditions.', ['abstraction', 'association', 'transfer', 'goal gate']],
  'route-language-multi-path-association': ['Multi-path Lateral Association', 'For open problems, generate several candidate routes from the Language Tree and rank them by budget, FAME, risk and validation hooks. Failed routes become reflection or negative FAME lessons.', ['multi-path', 'association', 'Tree of Thoughts', 'backtracking']],
  'route-language-abstraction-transfer': ['Abstraction Transfer Landing', 'Raise a concrete task to method, topic and subject layers, transfer a verifiable structure laterally, then land it back into the smallest executable action.', ['abstraction transfer', 'analogy', 'semantics', 'validation']],
  'route-knowledge-taxonomy-entry': ['Knowledge Taxonomy Entry', 'When adding knowledge, locate the subject level and abstraction level first, then write summary, source, content_ref and initial FAME values.', ['authoring', 'taxonomy', 'abstraction level', 'source']],
  'route-logic-argument-check': ['Argument and Consistency Check', 'Separate claim, reason, evidence, hidden premise and counterexample before deciding whether a proposal is executable or needs more evidence.', ['logic', 'argument', 'counterexample', 'consistency']],
  'route-logic-tool-precheck': ['Logical Tool Precheck', 'Before tool use, check goal, premise, schema, scope, side effect, validation method and unproven assumptions.', ['logic', 'tool call', 'precondition', 'ProposedAction']],
  'route-logic-failure-diagnosis': ['Failure Diagnosis Logic', 'Split a failure into observed facts, candidate causes, distinguishing tests, repair action and FAME update candidates.', ['failure', 'diagnosis', 'abduction', 'counterexample', 'FAME']],
  'route-logic-knowledge-consistency': ['Knowledge Authoring Consistency', 'Before adding knowledge, check subject level, abstraction level, source, license, detail location and FAME rationale.', ['knowledge governance', 'source', 'license', 'consistency']],
  'route-math-modeling-abstraction': ['Modeling Abstraction', 'Map a problem into variables, assumptions, relations, objective and validation method before selecting a computation or proof.', ['modeling', 'variable', 'assumption', 'validation']],
  'route-math-graph-traversal': ['Graph Traversal Goal Gate', 'Search candidate knowledge routes by scope, edge budget, FAME score, risk and context budget.', ['graph traversal', 'goal gate', 'scope', 'budget']],
  'route-math-evidence-update': ['Evidence-driven Parameter Update', 'Use tests, tool results, human feedback and failure samples to update FAME parameters.', ['evidence', 'Bayesian update', 'metrics', 'FAME']],
  'route-math-route-optimization': ['Route Scoring and Optimization', 'Compare candidate routes by goal fit, constraints, weights, risk penalty and context cost.', ['optimization', 'route score', 'tradeoff', 'context cost']],
  'route-cs-engineering-knowledge': ['Engineering Knowledge Boundary', 'Keep graph structure, routes, sources, summaries and index references in the graph; store long content, assets and logs in databases or external stores.', ['knowledge graph', 'database', 'index', 'boundary']],
  'route-cs-spec-to-test': ['Specification to Test', 'Turn a user goal into observable behavior, acceptance criteria and a test path, then write evidence summary after execution.', ['specification', 'test', 'acceptance criteria', 'evidence']],
  'route-cs-kg-indexing': ['Knowledge Graph and Index Engineering', 'Use light graph, content database, rule store, alias index, semantic index and scoped search to support large knowledge nets.', ['indexing', 'knowledge graph', 'scoping', 'retrieval']],
  'route-cs-agent-memory-loop': ['Agent Project Memory Loop', 'Write goals, tool events, test evidence, failure lessons and resume points into a project memory overlay.', ['project memory', 'overlay', 'trace', 'resume']],
  'route-cs-open-source-release-gate': ['Open-source Release Gate', 'Before release, check licenses, source registry, secrets, paths, docs, edition checks and residual risk.', ['open source', 'license', 'release check', 'security']],
  'route-agent-tool-doc-first': ['Tool Manual First', 'For an unfamiliar or schema-sensitive tool, read the tool description and parameter contract once before the call.', ['tool manual', 'schema', 'one-shot', 'precheck']],
  'route-agent-action-template-selection': ['Action Template Selection', 'Select read-only, file edit, test/build, network download or destructive filesystem templates by operation type and risk.', ['action template', 'risk', 'operation type']],
  'route-agent-tool-proposed-action': ['ProposedAction Before Tool Execution', 'Represent any mutating tool call as a ProposedAction with goal, scope, args, risk, validation and rollback.', ['ProposedAction', 'tool gateway', 'scope']],
  'route-agent-tool-gateway-policy': ['Tool Gateway Policy Execution', 'Apply doc-first, mutation proposal, high-risk approval and result summary policies according to tool risk.', ['Tool Gateway', 'policy', 'approval']],
  'route-agent-tool-result-summary': ['ToolResultSummary Write-back', 'After every tool run, write status, evidence, error, next step and FAME update candidates, while keeping long logs outside context.', ['ToolResultSummary', 'summary', 'evidence', 'context']],
  'route-agent-reflection-improvement': ['Reflection Iteration and Failure Write-back', 'After failure, partial success or user correction, create reflection summary, failure signature, minimal next test and FAME update candidates.', ['reflection', 'failure signature', 'self improvement']],
  'route-agent-usability-evaluation': ['Agent Usability Evaluation', 'Measure tool success rate, context token savings, failure recurrence reduction, route hit rate and manual correction rate.', ['evaluation', 'metrics', 'tool success']],
  'route-powershell-command-review': ['PowerShell Command Review Flow', 'Before running a PowerShell command, check cmdlet, parameters, quoting, pipeline, current directory, target path, streams and side effects.', ['PowerShell', 'command review', 'quoting', 'path']],
  'route-powershell-safe-command': ['PowerShell Safe Command Pattern', 'Prefer native PowerShell cmdlets and LiteralPath, keep destructive actions in one shell, and verify resolved paths before recursion.', ['PowerShell', 'LiteralPath', 'Remove-Item', 'safety']],
  'route-negative-fame-lesson': ['Negative FAME Lesson Route', 'Retain failed, conflicting or low-usefulness routes as lessons for pruning, recurrence prevention and later review.', ['negative lesson', 'failure', 'FAME', 'pruning']],
  'route-language-thought-layer-selection': ['Thinking Layer Selection', 'Choose meta, subject, topic, concept, method, operation or case layer before route traversal so the agent knows whether to reason broadly or execute narrowly.', ['thinking layer', 'abstraction', 'route depth']],
  'route-language-semantic-adaptation': ['Semantic Adaptation and Term Normalization', 'Normalize user wording, aliases, Chinese-English terms and tool names to canonical terms before subject and route selection.', ['semantic adaptation', 'canonical term', 'alias']],
  'route-language-directory-index': ['Text Directory Index', 'Expose the knowledge net as an expandable subject directory synchronized with graph and database edits.', ['directory', 'index', 'tree view']],
  'route-agent-one-shot-tool-use': ['One-shot Tool-use Contract', 'Keep tool documentation and command logic out of long-lived context; read the manual at call time and retain only the summary.', ['one-shot tool use', 'manual', 'context hygiene']],
  'route-agent-reminder-clock': ['Self-set Clock and Reminder', 'Let agents schedule checkpoints and resume prompts so long tasks do not silently stall and prior memory can guide self-iteration.', ['clock', 'reminder', 'checkpoint']],
  'route-agent-mechanism-enforcement': ['Mechanism Enforcement', 'Make the workflow mandatory through route checks, Tool Gateway decisions, doctor/eval scripts and connector prompts so the model cannot casually skip it.', ['enforcement', 'guardrail', 'doctor', 'eval']],
  'route-agent-database-sync': ['Database and Knowledge-net Sync', 'Manual graph edits create database sync items for assets, content indexes and FAME history; writes still need review and approval.', ['database sync', 'manual edit', 'asset index']],
  'route-language-goal-backcasting': ['Goal Gate Backcasting', 'Start from success criteria, evidence, forbidden outcomes and context budget, then work backward to the minimal route set.', ['goal gate', 'backcasting', 'done criteria']],
  'route-language-global-situation-model': ['Global Situation Model', 'Before action, review goal, constraints, resources, risks, history and stop conditions so the agent keeps the big picture.', ['global situation', 'constraints', 'risk', 'big picture']],
  'route-agent-tool-action-contract': ['Tool Action Contract', 'Compress a tool intent into one contract: tool, operation, scope, expected signal, validation, rollback and approval need.', ['tool action contract', 'scope', 'validation']],
  'route-agent-stability-preflight': ['High-frequency Pitfall Preflight', 'Check PowerShell, Git, Node/npm, Python, structured data, network import, working directory and database sync before executing.', ['preflight', 'failure signature', 'stability']],
  'route-agent-integration-usability-test': ['Agent Integration Usability Test', 'Verify an external agent can read the protocol, select routes, build a ContextPack, form an action contract and write ToolResultSummary.', ['agent integration', 'usability', 'plugin']],
  'route-powershell-encoding-output': ['PowerShell Chinese Encoding Output Route', 'When PowerShell output looks garbled, distinguish terminal display, pipe decoding and real file corruption with UTF-8/JSON/file roundtrip evidence.', ['PowerShell', 'encoding', 'mojibake', 'UTF-8']],
  'route-agent-local-connect-check': ['Local Agent Connection Check', 'Let the user select a local agent preset or custom agent, generate the connection message, and confirm connected/not_connected with blockers.', ['local agent', 'connection', 'wizard', 'preset']],
  'route-agent-mcp-capability-boundary': ['MCP Capability Discovery and Tool Boundary', 'When an external agent connects, separate resources, prompts and tools, then build a capability boundary from schema, permissions, side effects and scope.', ['MCP', 'capability discovery', 'resources', 'prompts', 'tools', 'tool boundary']],
  'route-agent-guardrail-human-review': ['Guardrail and Human Review Route', 'Sensitive tool calls pass through guardrails that allow, rewrite, block or ask the user, preserving approval state and resume points.', ['guardrails', 'human review', 'approval', 'block', 'rewrite']],
  'route-agent-checkpoint-store-memory': ['Checkpoint/Store Project Memory Route', 'Separate short-term checkpoints, long-term stores, project overlays and core knowledge; keep full memory externally and graph only summaries, route refs and FAME evidence.', ['checkpoint', 'store', 'project memory', 'external memory', 'resume']],
  'route-agent-computer-interface-loop': ['Agent-Computer Interface Engineering Loop', 'Engineering agents observe repository state, scope work, edit, test, summarize errors and choose the next action through a repeatable repo-navigation/edit/test loop.', ['Agent-Computer Interface', 'repo navigation', 'edit', 'test', 'ToolResultSummary']],
  'route-cs-ci-security-release-hardening': ['CI Security and Release Hardening', 'Before release, check CI permissions, secrets, third-party actions, artifact provenance, license boundaries and package scope.', ['CI', 'GitHub Actions', 'secrets', 'release assets', 'provenance']],
  'route-powershell-native-command-boundary': ['PowerShell Native Command Boundary', 'Before calling git, node, npm, python, docker or other native commands from PowerShell, verify argument parsing, cwd, exit code, encoding and structured output.', ['PowerShell', 'native command', 'argument boundary', 'structured output', 'exit code']],
}

const nodeText = {
  'language-tree-hub': ['Language Tree Hub', 'English open knowledge center for intent, lexicon, grammar, semantic abstraction, lateral association, expression and validation.'],
  'language-multi-path-association': ['Multi-path Lateral Association', 'Generate several candidate routes from the Language Tree and rank them by FAME, risk, budget and validation hooks.'],
  'language-abstraction-transfer': ['Abstraction Transfer Landing', 'Raise concrete tasks to method and subject layers, transfer verifiable structure laterally, then return to minimal action.'],
  logic: ['Logic', 'Provides argument analysis, proof obligations, counterexamples, consistency checks and failure diagnosis for agents.'],
  'logic-tool-precheck': ['Logical Tool Precheck', 'Checks goal, premise, schema, scope, side effect and validation method before tool use.'],
  'logic-failure-diagnosis': ['Failure Diagnosis Logic', 'Splits a failure into observed facts, hypotheses, distinguishing tests, repairs and FAME update candidates.'],
  'logic-knowledge-consistency': ['Knowledge Authoring Consistency', 'Constrains knowledge additions by subject level, abstraction level, source, license and FAME rationale.'],
  mathematics: ['Mathematics', 'Provides formalization, modeling, graph traversal, scoring, uncertainty handling and optimization.'],
  'math-graph-traversal-route': ['Graph Traversal Goal Gate', 'Finds candidate knowledge routes by scope, edge budget, FAME score, risk and context budget.'],
  'math-evidence-update': ['Evidence-driven Parameter Update', 'Updates FAME parameters from tests, tool results, human feedback and failure examples.'],
  'math-route-optimization': ['Route Scoring and Optimization', 'Compares route candidates by effectiveness, fit, confidence, novelty, risk and context pressure.'],
  'computer-science': ['Computer Science', 'Provides software engineering, systems, data, AI, security, HCI and open-source governance knowledge.'],
  'cs-spec-to-test': ['Specification to Test', 'Turns goals into observable behavior, acceptance criteria and evidence-backed tests.'],
  'cs-kg-indexing': ['Knowledge Graph and Index Engineering', 'Combines light graph, content database, alias index, semantic index and scoped search.'],
  'cs-agent-memory-loop': ['Agent Project Memory Loop', 'Stores real implementation traces, tool evidence, lessons and resume points outside core knowledge.'],
  'cs-open-source-release-gate': ['Open-source Release Gate', 'Checks license, sources, secrets, docs, edition health and residual risk before release.'],
  'agent-tooling': ['Agent Tooling', 'Governs tool description reading, schema checks, approvals, execution, summaries and failure recurrence prevention.'],
  'agent-action-template-selection': ['Action Template Selection', 'Chooses the right ProposedAction template by operation type and risk.'],
  'agent-tool-gateway-policy': ['Tool Gateway Policy Execution', 'Applies doc-first, proposal, approval and result-summary policies.'],
  'agent-reflection-improvement': ['Reflection Iteration and Failure Write-back', 'Turns failures and corrections into recurrence guards and negative FAME lessons.'],
  'agent-usability-evaluation': ['Agent Usability Evaluation', 'Measures whether the system makes agents easier to connect and less error-prone.'],
  'powershell-safety': ['PowerShell Safety', 'Reduces Windows shell mistakes around parsing, quoting, paths, recursion, streams and encoding.'],
  'powershell-command-review': ['PowerShell Command Review Flow', 'Reviews command shape, path resolution, pipeline and side effects before execution.'],
  'route-negative-fame-lesson': ['Negative FAME Lesson Route', 'Preserves failed or conflicting routes as visible lessons instead of deleting them.'],
  'project-memory-overlay': ['Project Memory Overlay', 'Keeps implementation memory separate from reusable core knowledge.'],
  'language-thought-layer-selection': ['Thinking Layer Selection', 'Selects the right abstraction layer before traversal or execution.'],
  'language-semantic-adaptation': ['Semantic Adaptation and Term Normalization', 'Maps user wording, aliases and tool names to canonical terms.'],
  'language-directory-index': ['Text Directory Index', 'Provides expandable subject indexes synchronized with graph edits.'],
  'agent-one-shot-tool-use': ['One-shot Tool Use', 'Reads tool manuals at call time and retains only summaries to protect context.'],
  'agent-reminder-clock': ['Self-set Clock and Reminder', 'Schedules checkpoints and resume prompts for long-running tasks.'],
  'agent-mechanism-enforcement': ['Mechanism Enforcement', 'Makes route, action contract, approval and result summary checks difficult for an agent to skip.'],
  'agent-database-sync': ['Database and Knowledge-net Sync', 'Keeps multimodal and detailed data in databases while the graph keeps light previews and refs.'],
  'language-goal-backcasting': ['Goal Gate Backcasting', 'Works backward from success criteria, evidence and forbidden outcomes to a minimal route set.'],
  'language-global-situation-model': ['Global Situation Model', 'Keeps goal, constraints, resources, risk, history and stop conditions visible before action.'],
  'agent-tool-action-contract': ['Tool Action Contract', 'Normalizes every tool intent into scope, expected signal, validation, rollback and approval requirements.'],
  'agent-stability-preflight': ['High-frequency Pitfall Preflight', 'Checks common tool failure domains before execution.'],
  'agent-integration-usability-test': ['Agent Integration Usability Test', 'Tests whether external agents can use the plugin immediately.'],
  'powershell-encoding-output': ['PowerShell Chinese Encoding Output', 'Distinguishes display mojibake from pipe decoding and real file corruption.'],
  'agent-local-connect-check': ['Local Agent Connection Check', 'Lets a user pick a local agent, generate config or prompt text, and confirm connection.'],
  'agent-mcp-capability-boundary': ['MCP Capability Discovery and Tool Boundary', 'Separates MCP resources, prompts and tools, then compresses schema, permissions, side effects and scope into a pre-call boundary.'],
  'agent-guardrail-human-review': ['Guardrail and Human Review Route', 'Uses guardrails and human review to block high-risk tool drift and preserve resume points.'],
  'agent-checkpoint-store-memory': ['Checkpoint/Store Project Memory Route', 'Splits short-term state, long-term project memory and core knowledge while keeping the graph lightweight.'],
  'agent-computer-interface-loop': ['Agent-Computer Interface Engineering Loop', 'Provides the repository observation, navigation, edit, test, summary and next-action loop for engineering agents.'],
  'cs-ci-security-release-hardening': ['CI Security and Release Hardening', 'Checks CI permissions, secrets, third-party actions, artifact provenance and license boundaries before release.'],
  'powershell-native-command-boundary': ['PowerShell Native Command Boundary', 'Reviews native command argument passing, encoding, exit code and structured evidence in PowerShell.'],
}

const contentText = {
  'cu-language-tree-001': ['Language Tree Hub task', 'The Language Tree converts natural-language goals into scope, subject routes, abstraction level, association transfer, context packs and validation tasks.'],
  'cu-route-scope-001': ['Scoped traversal', 'Agents should restrict graph traversal by edition_id, project_id, subject, route_id and task_id, crossing branches only when abstraction or association requires it.'],
  'cu-logic-argument-001': ['Engineering use of argument analysis', 'When an agent must judge whether a plan is valid, it first separates claim, reason, evidence, hidden premise and counterexample.'],
  'cu-logic-tool-precheck-001': ['Logical precheck before tool use', 'Before calling a tool, check goal, premise, schema, scope, side effects and validation method; missing premises block execution.'],
  'cu-logic-failure-diagnosis-001': ['Failure diagnosis logic', 'Separate observed facts from guesses, list candidate causes, run minimal distinguishing tests, and write reusable lessons to negative FAME routes.'],
  'cu-logic-knowledge-consistency-001': ['Knowledge authoring consistency', 'New knowledge must align subject level, abstraction level, source license, detail location and FAME rationale to avoid structural drift.'],
  'cu-math-modeling-001': ['Lightweight modeling steps', 'Translate a problem into variables, assumptions, relations, objective and validation method before applying formulas.'],
  'cu-math-graph-traversal-001': ['Graph traversal goal gate', 'Limit scope first, drill down through contains edges, associate laterally through association edges, and control expansion with FAME, risk and context budget.'],
  'cu-math-evidence-update-001': ['Evidence-driven parameter update', 'Use tests, tool outputs and human feedback to update FAME parameters; retain failures for delta, risk and rho adjustments.'],
  'cu-math-route-optimization-001': ['Route scoring and optimization', 'Rank candidate routes by usefulness, fit, evidence strength, operability, association value, reuse stability, risk and context cost.'],
  'cu-cs-kg-001': ['Knowledge graph boundary', 'The graph stores structure, routes, sources, summaries and index refs; long content, assets and logs live in databases or external stores.'],
  'cu-cs-spec-to-test-001': ['Specification to test', 'Turn an engineering task into observable behavior, acceptance criteria and test commands, then preserve evidence after execution.'],
  'cu-cs-kg-indexing-001': ['Knowledge graph and indexing engineering', 'Large projects need light graph structure plus strong indexes: subject, alias, semantic, route_id and project_id scoping.'],
  'cu-cs-agent-memory-loop-001': ['Agent project memory loop', 'Store goal, plan, action contract, tool result, failure signature, test evidence and resume point as project overlay memory.'],
  'cu-cs-open-source-release-gate-001': ['Open-source release gate', 'Before publishing, check license, source registration, secret/path leakage, docs, tests, package artifacts and residual risk.'],
  'cu-agent-tool-proposed-action-001': ['ProposedAction fields', 'A mutating tool call must declare action_id, project_id, task_id, routes, tool, operation, scope, args, risk, validation and rollback.'],
  'cu-agent-action-template-selection-001': ['Action template selection', 'Choose templates by operation type and risk: read-only, structured edit, test/build, network download or destructive filesystem.'],
  'cu-agent-tool-gateway-policy-001': ['Tool Gateway policy execution', 'The gateway blocks unknown tools, requires ProposedAction for mutations, requires ApprovedAction for high risk, and requires summaries after execution.'],
  'cu-agent-tool-result-summary-001': ['Tool result summary', 'Every tool call writes a short evidence-backed summary with status, errors, next steps and FAME update candidates.'],
  'cu-ps-new-item-path-001': ['New-Item multi-path lesson', 'PowerShell path creation should handle multiple paths and parent directories explicitly instead of relying on ambiguous shell behavior.'],
  'cu-ps-quoting-001': ['Quoting choice', 'Use PowerShell-native quoting deliberately; prefer LiteralPath for paths and avoid string-built cross-shell commands.'],
  'cu-ps-filesystem-safety-001': ['Filesystem mutation safety', 'Resolve absolute paths and verify they remain inside the intended root before recursive delete or move.'],
  'cu-ps-command-review-001': ['PowerShell command review flow', 'Review command, parameters, pipeline, working directory, target path, streams and side effects before execution.'],
  'cu-ps-env-001': ['Environment variable scope', 'Distinguish process, user and machine environment variables and avoid persisting secrets accidentally.'],
  'cu-language-multi-path-association-001': ['Multi-path lateral association', 'For open tasks, generate multiple route candidates and keep only those with validation hooks and acceptable context cost.'],
  'cu-language-abstraction-transfer-001': ['Abstraction transfer landing', 'Lift a concrete problem to methods and subjects, transfer a verifiable structure, then return to an executable action.'],
  'cu-agent-reflection-improvement-001': ['Reflection iteration and failure write-back', 'Failures produce a compact reflection, a normalized signature, a minimal validation step and FAME update candidates.'],
  'cu-agent-usability-metrics-001': ['Agent usability evaluation', 'Evaluate tool success, context savings, failure recurrence reduction, route hit rate and manual correction rate.'],
  'cu-language-lexical-semantic-relations-001': ['Lexical semantic relations', 'Synonym, hypernym, part-whole and related-term relations help map user words into canonical route anchors.'],
  'cu-language-grammar-dependency-001': ['Grammar dependency and operation frame', 'Grammar parsing extracts operation, object, constraint and expected result before tool routing.'],
  'cu-language-intent-classification-001': ['Intent classification to route', 'Classify user requests into planning, authoring, tool execution, debugging, evaluation or release routes.'],
  'cu-language-context-pack-001': ['Minimal sufficient context pack', 'A healthy context pack contains summaries, refs and necessary evidence, not full logs or full graph dumps.'],
  'cu-language-association-guardrail-001': ['Association guardrail', 'Lateral association is allowed only with a validation hook and a budget, otherwise it becomes context drift.'],
  'cu-logic-formalization-001': ['Natural language formalization', 'Convert informal goals into claims, constraints, variables and obligations before proof or execution.'],
  'cu-logic-proof-obligation-001': ['Proof obligation decomposition', 'When a plan claims safety or correctness, list the obligations that must be shown or tested.'],
  'cu-logic-counterexample-001': ['Counterexample-first check', 'Search for a small counterexample before accepting a broad plan or cross-domain transfer.'],
  'cu-logic-modal-status-001': ['Fact, assumption, plan and obligation layers', 'Mark each statement as fact, assumption, plan or obligation so agents do not execute guesses as facts.'],
  'cu-logic-temporal-invariant-001': ['Temporal and invariant checks', 'Long tasks need invariants and time-aware checkpoints to prevent drift and repeated mistakes.'],
  'cu-math-set-relation-function-001': ['Sets, relations and functions', 'Basic set/relation/function thinking helps map graph nodes, edges, indexes and route transforms.'],
  'cu-math-proof-methods-001': ['Common proof methods', 'Direct proof, contradiction, induction and case analysis become lightweight engineering validation patterns.'],
  'cu-math-graph-search-scope-001': ['Scoped graph search', 'Use project_id, subject, route_id and task_id as filters before expanding graph neighborhoods.'],
  'cu-math-shortest-cost-route-001': ['Cost-aware route search', 'Pick routes by expected value under context cost, execution risk and validation cost.'],
  'cu-math-statistical-evaluation-001': ['Metrics and statistical evaluation', 'Use repeated scenarios and clear pass rates rather than anecdotal impressions to evaluate agent improvement.'],
  'cu-math-bayesian-fame-update-001': ['FAME evidence update', 'Use new evidence to update confidence, risk and usefulness rather than overwriting history.'],
  'cu-math-optimization-tradeoff-001': ['Multi-objective tradeoff', 'Balance correctness, speed, context cost, safety and learning value when choosing routes.'],
  'cu-cs-algorithm-complexity-001': ['Complexity and resource budget', 'Graph traversal and indexing must account for time, memory and token cost.'],
  'cu-cs-software-requirements-001': ['Requirements to acceptance criteria', 'Turn vague implementation goals into behavior, constraints and verification commands.'],
  'cu-cs-testing-layers-001': ['Testing layers', 'Use unit, integration, smoke, real-eval and release checks according to risk and blast radius.'],
  'cu-cs-database-schema-versioning-001': ['Database schema and versioning', 'Database-backed memory and asset stores need schemas, migrations, version fields and compatibility checks.'],
  'cu-cs-information-retrieval-001': ['Inverted and semantic indexes', 'Large knowledge nets need lexical and semantic indexes plus scoped filters to avoid graph explosion.'],
  'cu-cs-kg-light-graph-heavy-store-001': ['Light graph, heavy store', 'Keep only preview and index refs in the graph; raw multimodal payloads and long text stay in stores.'],
  'cu-cs-version-control-001': ['Version control and traceable change', 'Check dirty worktrees and preserve user changes before editing or packaging.'],
  'cu-cs-security-ssdf-001': ['Secure development gate', 'Release workflows should check secrets, unsafe defaults, exposed services and dependency risk.'],
  'cu-cs-web-platform-001': ['Web platform knowledge entry', 'Frontend work should connect UI behavior, accessibility, build artifacts and browser evidence.'],
  'cu-cs-python-runtime-001': ['Python runtime knowledge entry', 'Agent scripts should verify interpreter, environment, module path, encoding and working directory.'],
  'cu-agent-tool-manifest-001': ['Tool manifest and capability boundary', 'Agents should know tool names, schemas, permissions, side effects and output shape before calling them.'],
  'cu-agent-tool-schema-contract-001': ['Schema contract', 'Tool arguments must be structured and validated against schema instead of improvised strings.'],
  'cu-agent-proposed-action-risk-001': ['ProposedAction risk statement', 'Risk level determines whether the action is read-only, proposed, blocked or requires approval.'],
  'cu-agent-tool-result-evidence-001': ['Tool result as evidence', 'A result summary records exit state, key output, errors, artifacts and next verification.'],
  'cu-agent-memory-overlay-boundary-001': ['Project memory overlay boundary', 'Project memory informs future tasks but does not automatically pollute reusable core knowledge.'],
  'cu-agent-evaluation-scorecard-001': ['Agent scorecard', 'Use stable metrics: tool success rate, context savings, repeated failure drop and user correction rate.'],
  'cu-ps-parsing-native-command-001': ['PowerShell parsing and native commands', 'PowerShell parses cmdlets and native commands differently; arguments must be reviewed accordingly.'],
  'cu-ps-here-string-001': ['Here-string boundary', 'Here-strings are useful for text payloads but can hide unintended newlines and quoting assumptions.'],
  'cu-ps-redirection-streams-001': ['Output streams and redirection', 'PowerShell streams and redirection behavior affect evidence capture and error diagnosis.'],
  'cu-ps-execution-policy-001': ['Execution policy and script boundary', 'Execution policy changes are environment changes and should not be made casually.'],
  'cu-agent-filesystem-scope-001': ['Filesystem scope', 'Filesystem tools must declare working directory, allowed paths and expected side effects.'],
  'cu-agent-git-safety-001': ['Git safety operations', 'Do not reset, checkout or overwrite user changes without explicit approval; inspect status before edits.'],
  'cu-agent-node-npm-001': ['Node/npm command boundary', 'Confirm package root, script semantics and artifact side effects before npm commands.'],
  'cu-agent-python-runtime-001': ['Python runtime boundary', 'Confirm interpreter, virtual environment, module path and working directory before Python execution.'],
  'cu-agent-structured-data-001': ['Structured data edit safety', 'Use parsers for JSON/JSONL and update indexes after edits.'],
  'cu-agent-network-download-001': ['Network download and external data import', 'Record URL, date, license and purpose; unknown licenses remain links and summaries only.'],
  'cu-agent-test-build-001': ['Test and build evidence', 'Do not claim completion without executing the relevant validation or explaining why it could not run.'],
  'cu-agent-database-sync-001': ['Database and knowledge-net sync boundary', 'Manual graph edits produce sync proposals for databases and asset indexes; review remains required.'],
  'cu-agent-working-directory-001': ['Working directory confirmation', 'Wrong working directory is a common failure signature; verify it before tool calls.'],
  'cu-language-thought-layer-selection-001': ['Thinking layer selection', 'Choose broad abstraction or narrow execution mode deliberately before graph traversal.'],
  'cu-language-semantic-adaptation-001': ['Semantic adaptation and term normalization', 'Normalize aliases, multilingual terms and tool names before route selection.'],
  'cu-language-directory-index-001': ['Text directory index', 'Provide an expandable subject directory synchronized with graph changes.'],
  'cu-agent-one-shot-tool-use-001': ['One-shot tool use', 'Load tool manuals only when needed and retain only the resulting summary.'],
  'cu-agent-reminder-clock-001': ['Self-set clock and reminder', 'Use reminders and checkpoints to avoid task interruption and to resume from memory.'],
  'cu-agent-mechanism-enforcement-001': ['Mechanism enforcement', 'Use checks, route decisions and gateway policies to make the workflow mandatory for agents.'],
  'cu-language-goal-backcasting-001': ['Goal gate backcasting', 'Work backward from done criteria and evidence to the smallest route set.'],
  'cu-language-global-situation-model-001': ['Global situation model', 'Before action, hold goal, constraints, resources, risks, prior lessons and stop conditions together.'],
  'cu-agent-tool-action-contract-001': ['Tool action contract', 'Every tool call needs tool, operation, scope, expected signal, validation, rollback and approval state.'],
  'cu-agent-stability-preflight-001': ['High-frequency pitfall preflight', 'Precheck common failure domains before execution.'],
  'cu-agent-error-signature-map-001': ['Failure signature normalization', 'Normalize recurring tool failures into signatures that can trigger recurrence guards.'],
  'cu-agent-integration-usability-001': ['External agent integration usability', 'A useful plugin must be easy for agents to start, route, act and summarize without custom training.'],
  'cu-agent-effect-smoke-scenarios-001': ['Agent effect smoke scenarios', 'Representative tasks show whether route, scope, preflight and summary mechanisms actually change behavior.'],
  'cu-agent-ecosystem-mapping-001': ['External agent ecosystem mapping', 'Codex, Cursor, Claude, OpenAI Agents SDK, LangGraph, AutoGen, CrewAI, Dify and generic agents can all map onto the same route/action/summary protocol.'],
  'cu-agent-practical-bridge-001': ['Open-source practical bridge', 'The open edition focuses on immediate wins: safer tool calls, better context control and clearer agent connection.'],
  'cu-ps-encoding-output-001': ['PowerShell Chinese output encoding probe', 'When Chinese output looks wrong, verify console encoding, pipe decoding and UTF-8 file roundtrip before modifying files.'],
  'cu-agent-local-connect-001': ['Local Agent guided connection check', 'The user can select an agent preset or custom agent and confirm whether the agent has acknowledged the FAME protocol.'],
  'cu-agent-real-eval-encoding-001': ['PowerShell encoding real-eval', 'The real evaluation verifies UTF-8 console/output settings and JSON file roundtrip with a Chinese probe string.'],
  'cu-agent-mcp-capability-boundary-001': ['MCP capability discovery and boundary', 'External agents first separate MCP resources, prompts and tools; only tools may create external actions, and each tool must declare schema, permission, output shape and side effects.'],
  'cu-agent-tool-permission-scope-001': ['Tool permission and scope trimming', 'Each task receives only the minimum required tools, paths, network and database permissions; anything outside project, subject, route or allowed root must block or ask for approval.'],
  'cu-agent-guardrail-human-review-001': ['Guardrail and human review', 'Sensitive tool calls are checked by guardrails and may pause for user approval or rejection, while preserving action id, approval state, block reason and resume point.'],
  'cu-agent-output-validation-001': ['Output validation and blocking', 'Before and after tool execution, structured outputs must parse, engineering completion must include evidence, and unsafe recommendations must route to rewrite, block or ask_user.'],
  'cu-agent-checkpoint-store-memory-001': ['Checkpoint/store project memory mapping', 'Short-term checkpoints hold active task state and resume points, while long-term stores hold project lessons, failure signatures, user preferences and FAME evidence.'],
  'cu-agent-thread-resume-001': ['Thread resume and continuation', 'Long tasks save thread_id, checkpoint_id, last stable evidence, blockers and the smallest next action; resuming reads summaries instead of replaying full logs.'],
  'cu-agent-computer-interface-loop-001': ['Agent-Computer Interface loop', 'Engineering agents need stable repository observation, file navigation, editing, testing, error summaries and next-action interfaces instead of relying on model memory alone.'],
  'cu-agent-repo-navigation-edit-test-001': ['Repository navigation-edit-test loop', 'Before code edits, locate package roots, test entries, related files and dirty worktree state; after edits, run risk-matched tests and summarize evidence.'],
  'cu-cs-ci-security-hardening-001': ['CI security hardening', 'Open-source CI should limit default permissions, protect secrets, review third-party actions, pin release flow and treat security failures as release blockers.'],
  'cu-cs-release-artifact-provenance-001': ['Release artifact provenance', 'Portable zips, Docker images, release assets and install scripts must be traceable to source, build command, version, checks and license boundaries.'],
  'cu-ps-native-command-boundary-001': ['PowerShell native command boundary', 'When invoking git, node, npm, python, docker or other native commands, confirm whether PowerShell pre-parses arguments and avoid opaque command strings.'],
  'cu-ps-structured-output-preference-001': ['Prefer structured PowerShell output', 'Agents should prefer JSON, explicit encoding and short summaries over localized tables or colored terminal text, then verify redirects with UTF-8 or byte-stream rules.'],
}

const subjectLabels = {
  'language-tree-hub': 'Language Tree Hub',
  logic: 'Logic',
  mathematics: 'Mathematics',
  'computer-science': 'Computer Science',
  'agent-tooling': 'Agent Tooling',
  'powershell-safety': 'PowerShell Safety',
}

const subjectFocus = {
  'language-tree-hub': ['layer selection', 'semantic adaptation', 'directory index', 'abstract then concrete', 'goal-gate backcasting', 'global situation model'],
  logic: ['preconditions', 'counterexamples', 'proof obligations', 'failure diagnosis', 'consistency'],
  mathematics: ['graph traversal', 'route scoring', 'evidence updates', 'context budget', 'tradeoffs'],
  'computer-science': ['programming', 'testing', 'indexing', 'project memory', 'release gate'],
  'agent-tooling': ['tool contracts', 'gateway policy', 'recurrence guard', 'result summaries', 'agent connection'],
  'powershell-safety': ['quoting', 'paths', 'recursive mutation', 'streams', 'encoding'],
}

const scenarios = {
  'scenario-powershell-destructive-delete': {
    label: 'PowerShell Recursive Delete Review',
    trigger: 'The task needs to delete, move, clear or recursively mutate filesystem paths.',
    checks: [
      'Confirm working_directory.',
      'Confirm target absolute path with Resolve-Path or equivalent.',
      'Confirm target stays inside allowed_root.',
      'Do not enumerate in PowerShell and then delete through cmd/bash.',
      'High-risk actions require ApprovedAction.',
    ],
  },
  'scenario-jsonl-knowledge-edit': {
    label: 'JSONL Knowledge Base Edit',
    trigger: 'The task needs to add, update or sync content_units.jsonl, route_index.json, alias_index.json or similar structured knowledge files.',
    checks: [
      'Keep JSONL as one object per line.',
      'Parse every line after writing.',
      'Ensure route, content and source refs exist.',
      'Sync content_index, subject_index and alias_index.',
      'Run check:english and release checks.',
    ],
  },
  'scenario-git-dirty-worktree': {
    label: 'Git Dirty Worktree Protection',
    trigger: 'Before editing, moving, deleting files or committing.',
    checks: [
      'Read git status --short.',
      'Identify untracked files and unknown changes in touched files.',
      'Do not reset, checkout or overwrite user changes.',
      'After edits, list changed_files and validation results.',
    ],
  },
  'scenario-node-npm-build': {
    label: 'Node/npm Test and Build',
    trigger: 'The task needs to run npm scripts, build, lint, test or install dependencies.',
    checks: [
      'Confirm the package.json directory.',
      'Confirm script meaning and side effects.',
      'Treat dependency install or lockfile edits as mutating actions.',
      'Record exit code, key output and artifacts.',
    ],
  },
  'scenario-python-runtime': {
    label: 'Python Runtime Decision',
    trigger: 'The task needs to run Python, install packages, import modules or generate data.',
    checks: [
      'Confirm interpreter path and version.',
      'Confirm virtual environment or bundled runtime.',
      'Confirm module path and working directory.',
      'Package installs or side-effect scripts require a proposal.',
      'Record encoding and key error summary.',
    ],
  },
  'scenario-network-source-import': {
    label: 'Network Download and Source Import',
    trigger: 'The task needs to download, scrape or import external material or open-source cases.',
    checks: [
      'Record URL, snapshot date, purpose and destination.',
      'Register source_registry or data_sources.',
      'Unknown license keeps only summary and link.',
      'Large or ShareAlike content stays isolated from core knowledge.',
    ],
  },
  'scenario-external-agent-integration': {
    label: 'External Agent Integration',
    trigger: 'An external agent is connecting to the English open knowledge net for the first time or needs usability validation.',
    checks: [
      'Read docs/agent-protocol.md.',
      'Use lexicon_seed for semantic normalization.',
      'Generate the minimal ContextPack.',
      'Create a read-only tool action contract.',
      'Write ToolResultSummary.',
    ],
  },
  'scenario-powershell-encoding-mojibake': {
    label: 'PowerShell Chinese Encoding Diagnosis',
    trigger: 'PowerShell, terminal, command output or logs display Chinese mojibake and the agent must distinguish display issues, pipe decoding and real file damage.',
    checks: [
      'Record PowerShell version, Console.OutputEncoding and $OutputEncoding.',
      'Verify screen output, JSON output and UTF-8 file roundtrip with a Chinese probe.',
      'Do not decide that source files are damaged from terminal mojibake alone.',
      'When writing files, explicitly use UTF-8 and read back.',
      'ToolResultSummary records whether evidence came from terminal, JSON or file.',
    ],
  },
  'scenario-local-agent-connect-check': {
    label: 'Local Agent Connection State Check',
    trigger: 'The user wants to select a local agent and know whether it has connected to the English open edition.',
    checks: [
      'Select agent type: codex, cursor, claude-desktop, claude-code, openai-agents, gemini-cli, openhands, swe-agent, aider, cline, roo-code, continue, langgraph, autogen, crewai, dify, generic or other.',
      'Check QUICKSTART_AGENT, AGENTS, route CLI, doctor and real eval availability.',
      'Generate agent_start_prompt, connection message and next_command.',
      'The graphical path must wait for user confirmation after the agent replies.',
      'Output connected/not_connected with blockers.',
      'Do not rewrite user agent configuration unless explicitly requested.',
    ],
  },
  'scenario-mcp-tool-boundary': {
    label: 'MCP Tool Capability Boundary Check',
    trigger: 'An external agent connects through MCP or a similar protocol and must separate resources, prompts and tools.',
    checks: [
      'Separate resources, prompts and tools.',
      'Read tool schema and output contract.',
      'Confirm each tool side effect and permission boundary.',
      'If the boundary is missing, allow read-only probing only.',
    ],
  },
  'scenario-guardrail-human-review': {
    label: 'Sensitive Action Approval Check',
    trigger: 'The tool action touches deletion, release, secrets, external writes or non-reversible side effects.',
    checks: [
      'Create ProposedAction.',
      'Decide whether ApprovedAction is required.',
      'Record user approval or rejection.',
      'Block execution when approval state is missing.',
    ],
  },
  'scenario-powershell-native-command': {
    label: 'PowerShell Native Command Argument Check',
    trigger: 'PowerShell invokes git, node, npm, python, docker, curl or another external program.',
    checks: [
      'Confirm working directory.',
      'Confirm argument boundary and quoting rules.',
      'Confirm exit code and error stream.',
      'Prefer JSON or concise summaries as evidence.',
    ],
  },
  'scenario-agent-resume-memory': {
    label: 'Agent Resume Memory Check',
    trigger: 'A long task was interrupted, paused for approval, failed at a tool call or resumed from a thread.',
    checks: [
      'Read checkpoint/thread summary.',
      'Confirm last stable evidence.',
      'List unresolved blockers.',
      'Generate the smallest next action instead of replaying full logs.',
    ],
  },
}

const failurePatternLabels = {
  'ps-failure-cross-shell-delete': 'PowerShell-to-cmd destructive delete',
  'tool-failure-unscoped-mutation': 'Unscoped mutating tool call',
  'tool-failure-json-string-edit': 'String-based JSON/JSONL edit',
  'tool-failure-knowledge-index-drift': 'Knowledge index drift',
  'tool-failure-dirty-worktree-overwrite': 'Dirty worktree overwrite risk',
  'tool-failure-wrong-working-directory': 'Wrong working directory',
  'tool-failure-test-claim-without-evidence': 'Claimed success without evidence',
  'tool-failure-runtime-assumption': 'Runtime assumption without verification',
  'tool-failure-network-import-pollution': 'Network import polluted core knowledge',
  'tool-failure-skip-doc': 'Skipped required documentation',
  'tool-failure-context-bloat': 'Context bloat from unnecessary loading',
  'ps-failure-output-encoding-mojibake': 'PowerShell output encoding mojibake',
  'tool-failure-terminal-mojibake-misdiagnosis': 'Terminal mojibake misdiagnosed as file corruption',
  'tool-failure-capability-boundary-confusion': 'Capability boundary confusion',
  'tool-failure-approval-bypass': 'Approval bypass for sensitive action',
  'tool-failure-native-command-argument-drift': 'Native command argument drift',
  'tool-failure-memory-resume-loss': 'Lost memory on resume',
}

function routeToEnglish(route) {
  const [name, content, keywords] = routeText[route.id] ?? [
    route.id.replace(/^route-/, '').replaceAll('-', ' '),
    'English open route aligned with the Chinese open edition.',
    route.keywords ?? [],
  ]
  return {
    ...route,
    name,
    content,
    keywords,
  }
}

function translateContentUnit(unit) {
  const [title, summary] = contentText[unit.id] ?? [
    unit.title,
    `English open content unit aligned with ${unit.id}; keep the same route and source references as the Chinese open edition.`,
  ]
  return {
    ...unit,
    title,
    summary,
  }
}

function translateGraph(graph) {
  return {
    ...graph,
    edition_id: 'english',
    nodes: graph.nodes.map((node) => {
      const [label, summary] = nodeText[node.id] ?? [node.label, `English node aligned with ${node.id}.`]
      return { ...node, label, summary }
    }),
    edges: graph.edges.map((edge) => ({
      ...edge,
      summary: edge.summary ? `English edition mirror: ${edge.edge_type} from ${edge.source} to ${edge.target}.` : edge.summary,
    })),
  }
}

function translateSimpleLabels(value) {
  if (Array.isArray(value)) return value.map(translateSimpleLabels)
  if (value && typeof value === 'object') {
    const out = {}
    for (const [key, inner] of Object.entries(value)) {
      if (key === 'edition_id') out[key] = 'english'
      else if (key === 'label' && typeof inner === 'string') out[key] = inner
      else if (key === 'purpose' && typeof inner === 'string') out[key] = inner
      else out[key] = translateSimpleLabels(inner)
    }
    return out
  }
  return value
}

function buildSubjectIndex(source) {
  return {
    ...source,
    edition_id: 'english',
    subjects: source.subjects.map((subject) => ({
      ...subject,
      label: subjectLabels[subject.id] ?? subject.label,
      focus: subjectFocus[subject.id] ?? subject.focus,
    })),
  }
}

function buildAliasIndex(source) {
  const englishAliases = [
    ['language tree', 'Language Tree Hub', 'language-tree-hub', 'language-tree-hub'],
    ['semantic tree', 'Language Tree Hub', 'language-tree-hub', 'language-tree-hub'],
    ['route', 'Route', 'route-language-intent-to-scope', 'language-tree-hub'],
    ['tool calling', 'Agent Tooling', 'agent-tooling', 'agent-tooling'],
    ['function calling', 'Agent Tooling', 'agent-tooling', 'agent-tooling'],
    ['ProposedAction', 'Action Template Selection', 'agent-action-template-selection', 'agent-tooling'],
    ['Tool Gateway', 'Tool Gateway Policy Execution', 'agent-tool-gateway-policy', 'agent-tooling'],
    ['ToolResultSummary', 'Tool Result Summary Write-back', 'agent-tool-result-summary', 'agent-tooling'],
    ['PowerShell safety', 'PowerShell Safety', 'powershell-safety', 'powershell-safety'],
    ['mojibake', 'PowerShell Chinese Encoding Output Route', 'powershell-encoding-output', 'powershell-safety'],
    ['goal gate', 'Goal Gate Backcasting', 'language-goal-backcasting', 'language-tree-hub'],
    ['global situation', 'Global Situation Model', 'language-global-situation-model', 'language-tree-hub'],
    ['recurrence guard', 'Reflection Iteration and Failure Write-back', 'agent-reflection-improvement', 'agent-tooling'],
    ['project memory', 'Agent Project Memory Loop', 'cs-agent-memory-loop', 'computer-science'],
    ['dirty worktree', 'Git safety operations', 'agent-stability-preflight', 'agent-tooling'],
    ['working directory', 'Working Directory Confirmation', 'agent-stability-preflight', 'agent-tooling'],
    ['one-shot tool use', 'One-shot Tool Use', 'agent-one-shot-tool-use', 'agent-tooling'],
  ]
  return {
    edition_id: 'english',
    aliases: englishAliases.map(([term, canonical, node_ref, subject]) => ({ term, canonical, node_ref, subject })),
  }
}

function buildScopingIndex(source) {
  return {
    ...source,
    edition_id: 'english',
    policies: [
      { id: 'scope-subject-first', summary: 'By default, traverse only the current subject taxonomy, rules and content refs.' },
      { id: 'scope-language-center', summary: 'Before cross-subject association, return to the Language Tree Hub to confirm abstraction layer and association budget.' },
      { id: 'scope-association-budget', summary: 'Association may cross at most two subjects and read at most twelve association edges, with validation hooks required.' },
      { id: 'scope-context-health', summary: 'Context packs contain summaries, refs and necessary evidence; long logs remain in external memory.' },
      { id: 'scope-multi-path-budget', summary: 'Open problems keep at most five candidate routes and three active routes; over budget means re-scope through the Language Tree.' },
      { id: 'scope-reflection-on-failure', summary: 'After repeated or related failure, read reflection and negative FAME lessons before continuing.' },
      { id: 'scope-metrics-by-project', summary: 'Agent metrics aggregate by project_id, subject and route_id so projects do not pollute each other.' },
    ],
  }
}

function buildCore() {
  return {
    id: 'language-tree-hub',
    edition_id: 'english',
    type: 'LanguageTreeHub',
    label: 'Language Tree Hub',
    status: 'clean_seed',
    description: 'The center layer that turns English natural-language goals into subject scope, abstraction layer, association routes, context packs and validation tasks.',
    layers: [
      { id: 'intent', label: 'Intent Layer', purpose: 'Identify user goal, task type, done criteria and risk level.', inputs: ['user_goal', 'project_state', 'agent_role'], outputs: ['task_intent', 'done_criteria', 'risk_flags'] },
      { id: 'lexicon', label: 'Lexicon Layer', purpose: 'Maintain terms, aliases, multilingual mappings and subject ownership.', inputs: ['terms', 'aliases', 'source_refs'], outputs: ['canonical_terms', 'subject_candidates'] },
      { id: 'grammar', label: 'Grammar Layer', purpose: 'Identify operation structure, constraints, inputs, outputs and command shape.', inputs: ['sentence', 'operation_tokens'], outputs: ['operation_frame', 'constraints'] },
      { id: 'semantic_abstraction', label: 'Semantic Abstraction Layer', purpose: 'Raise local requests into reusable concepts, principles, methods or rules.', inputs: ['operation_frame', 'canonical_terms'], outputs: ['abstraction_level', 'route_candidates'] },
      { id: 'association', label: 'Association Transfer Layer', purpose: 'Search adjacent subjects, failure lessons and transferable methods by abstract similarity.', inputs: ['route_candidates', 'fame_edges'], outputs: ['association_routes', 'negative_lessons'] },
      { id: 'expression', label: 'Expression Layer', purpose: 'Generate context packs, steps, instructions and user-readable summaries for agents.', inputs: ['selected_routes', 'content_refs'], outputs: ['context_pack', 'action_brief'] },
      { id: 'validation', label: 'Validation Layer', purpose: 'Write tests, tool results, human feedback and evidence back into route parameters.', inputs: ['tool_result', 'tests', 'human_feedback'], outputs: ['fame_update_candidates', 'memory_trace'] },
    ],
    routing_policy: {
      center_first: true,
      scope_keys: ['edition_id', 'project_id', 'subject', 'route_id', 'task_id'],
      context_policy: 'summary_refs_lazy_load',
      full_memory_retention: true,
      do_not_full_graph_load: true,
      association_budget: { max_subject_hops: 2, max_association_edges: 12, require_validation_hook: true },
    },
    fame_defaults: { mu: 0.5, chi: 0.55, epsilon: 0.6, kappa: 0.5, nu: 0.35, delta: 0, rho: 0.35, risk: 0.25 },
  }
}

function buildLexicon() {
  return {
    edition_id: 'english',
    subject: 'language-tree-hub',
    status: 'manual_seed',
    policy: 'Self-authored core terminology. External lexical resources remain candidates until license review.',
    terms: [
      { canonical: 'Language Tree Hub', aliases: ['language tree', 'semantic tree', 'language hub'], subject_refs: ['language-tree-hub'], abstraction_level: 'L0_meta', summary: 'Natural-language entry point for intent, semantics, association and expression.' },
      { canonical: 'Route', aliases: ['knowledge route', 'routing path'], subject_refs: ['language-tree-hub'], abstraction_level: 'L4_method', summary: 'Executable path from task intent to subject, rules, context pack and validation.' },
      { canonical: 'Scope', aliases: ['scoping', 'boundary'], subject_refs: ['language-tree-hub', 'agent-tooling'], abstraction_level: 'L4_method', summary: 'Limits context and graph traversal by project_id, subject, route_id and task_id.' },
      { canonical: 'Project Memory', aliases: ['external memory', 'overlay memory'], subject_refs: ['agent-tooling'], abstraction_level: 'L6_case', summary: 'External overlay that records process, evidence, decisions, tool results and lessons.' },
      { canonical: 'Tool Calling', aliases: ['function calling', 'tool use'], subject_refs: ['agent-tooling'], abstraction_level: 'L5_operation', summary: 'Schema, approval, execution and write-back process around external capabilities.' },
      { canonical: 'PowerShell Safety', aliases: ['PowerShell syntax', 'PowerShell common failures'], subject_refs: ['powershell-safety'], abstraction_level: 'L2_field', summary: 'Rules that reduce Windows shell mistakes around quoting, path handling and destructive operations.' },
      { canonical: 'PowerShell Chinese Encoding', aliases: ['Chinese mojibake', 'encoding issue', 'UTF-8 output'], subject_refs: ['powershell-safety', 'agent-tooling'], abstraction_level: 'L5_operation', summary: 'Route for diagnosing Chinese output, file encoding, pipe decoding and evidence reliability.' },
      { canonical: 'Local Agent Connection', aliases: ['agent connect', 'connection wizard'], subject_refs: ['agent-tooling'], abstraction_level: 'L5_operation', summary: 'Select a local agent type and check that route, doctor, eval and connection prompt are available.' },
    ],
  }
}

function buildLanguageTreeFiles() {
  writeJson('knowledge/language-tree-hub/core.json', buildCore())
  writeJson('knowledge/language-tree-hub/lexicon_seed.json', buildLexicon())
  writeJson('knowledge/language-tree-hub/abstraction_levels.json', {
    edition_id: 'english',
    levels: [
      { id: 'L0_meta', label: 'Meta Hub', use: 'language tree, route rules and governance' },
      { id: 'L1_discipline', label: 'Discipline', use: 'logic, mathematics, computer science and agent tooling' },
      { id: 'L2_field', label: 'Field', use: 'subject subfields such as PowerShell safety or indexing' },
      { id: 'L3_concept', label: 'Concept', use: 'terms and reusable concepts' },
      { id: 'L4_method', label: 'Method', use: 'routes, patterns and playbooks' },
      { id: 'L5_operation', label: 'Operation', use: 'tool actions and concrete workflow steps' },
      { id: 'L6_case', label: 'Case', use: 'project memory, lessons and examples' },
    ],
  })
  writeJson('knowledge/language-tree-hub/thought_modes.json', {
    edition_id: 'english',
    modes: [
      { id: 'L0_meta', trigger: 'architecture, governance or route design', output: 'principles and constraints' },
      { id: 'L4_method', trigger: 'planning, abstraction transfer or lateral association', output: 'candidate routes and validation hooks' },
      { id: 'L5_operation', trigger: 'tool use, file edits, tests or builds', output: 'ProposedAction and ToolResultSummary' },
      { id: 'L6_case', trigger: 'debugging repeated failures or resuming work', output: 'project memory refs and lessons' },
    ],
  })
  writeJson('knowledge/language-tree-hub/intent_patterns.json', {
    edition_id: 'english',
    patterns: [
      { id: 'intent-tool-call', triggers: ['run', 'execute', 'test', 'build', 'delete', 'download'], route_refs: ['route-agent-tool-action-contract', 'route-agent-stability-preflight'] },
      { id: 'intent-knowledge-edit', triggers: ['add knowledge', 'edit jsonl', 'sync index'], route_refs: ['route-knowledge-taxonomy-entry', 'route-agent-database-sync'] },
      { id: 'intent-connect-agent', triggers: ['connect agent', 'agent preset', 'wizard'], route_refs: ['route-agent-local-connect-check', 'route-agent-integration-usability-test'] },
    ],
  })
  writeJson('knowledge/language-tree-hub/association_rules.json', {
    edition_id: 'english',
    rules: [
      { id: 'association-requires-validation', summary: 'Any lateral association must keep a validation hook.' },
      { id: 'association-budget', summary: 'Limit cross-subject expansion by subject hops, edge count and context budget.' },
      { id: 'failure-first-reflection', summary: 'Repeated failure triggers reflection routes before retrying.' },
    ],
  })
  writeJson('knowledge/language-tree-hub/association_playbooks.json', {
    edition_id: 'english',
    playbooks: [
      { id: 'playbook-tool-error-to-logic', steps: ['Normalize failure signature', 'Check preconditions', 'Run minimal distinguishing test', 'Write negative FAME lesson'] },
      { id: 'playbook-route-search', steps: ['Select goal gate', 'List candidate routes', 'Score by FAME and context cost', 'Keep top routes with validation'] },
    ],
  })
  writeJson('knowledge/language-tree-hub/abstraction_playbooks.json', {
    edition_id: 'english',
    playbooks: [
      { id: 'abstract-then-land', steps: ['Extract operation frame', 'Raise to method', 'Find transferable structure', 'Land as ProposedAction'] },
      { id: 'global-before-local', steps: ['Review goal', 'Review constraints', 'Review risks', 'Select smallest executable route'] },
    ],
  })
  writeText('knowledge/language-tree-hub/README.md', `# Language Tree Hub

The Language Tree Hub is the semantic center of the English open edition. It normalizes user language, chooses abstraction level, selects routes and keeps association under a validation budget.

Read order:

1. core.json
2. lexicon_seed.json
3. thought_modes.json
4. intent_patterns.json
5. association_rules.json
6. association_playbooks.json
7. abstraction_playbooks.json
`)
}

function buildSubjectFiles() {
  const subjectFiles = {
    logic: {
      readme: 'Logic supports argument analysis, proof obligations, counterexamples, consistency checks and failure diagnosis.',
      files: ['taxonomy.json', 'abstraction_levels.json', 'reasoning_methods.json', 'argument_patterns.json', 'fallacy_patterns.json', 'validation_checklists.json'],
    },
    mathematics: {
      readme: 'Mathematics supports modeling, graph traversal, route scoring, evidence updates and optimization tradeoffs.',
      files: ['taxonomy.json', 'abstraction_levels.json', 'methods.json', 'modeling_patterns.json', 'validation_checklists.json'],
    },
    'computer-science': {
      readme: 'Computer Science supports programming, testing, indexing, project memory, release gates and practical engineering routes.',
      files: ['taxonomy.json', 'abstraction_levels.json', 'engineering_methods.json', 'system_patterns.json', 'validation_checklists.json'],
    },
    'powershell-safety': {
      readme: 'PowerShell Safety covers parsing, quoting, path scope, destructive operations, streams and Chinese output encoding.',
      files: ['taxonomy.json', 'command_review_flow.json', 'risk_matrix.json', 'safe_command_patterns.json', 'command_review_checklist.json', 'do_not_patterns.json', 'failure_patterns.json'],
    },
  }

  for (const [subject, config] of Object.entries(subjectFiles)) {
    writeText(`knowledge/${subject}/README.md`, `# ${subjectLabels[subject] ?? subject}

${config.readme}

This branch is intentionally compact. It gives agents stable abstractions and practical guardrails while leaving broad subject expansion to the community.
`)
    for (const file of config.files) {
      const source = readSourceJson(`knowledge/${subject}/${file}`)
      writeJson(`knowledge/${subject}/${file}`, {
        ...translateSimpleLabels(source),
        edition_id: 'english',
        subject,
        note: 'English open edition mirror. IDs and structure stay aligned with chinese-open; labels are concise English summaries.',
      })
    }
  }
}

function buildAgentToolingFiles() {
  copySource('knowledge/agent-tooling/action.schema.json', (value) => ({ ...value, edition_id: 'english' }))
  copySource('knowledge/agent-tooling/context_pack.schema.json', (value) => ({ ...value, edition_id: 'english' }))
  copySource('knowledge/agent-tooling/action_templates.json', (source) => ({
    ...source,
    edition_id: 'english',
    templates: source.templates.map((template) => ({
      ...template,
      label: template.id.replace(/^template-/, '').replaceAll('-', ' '),
      validation_plan: (template.validation_plan ?? []).map((_, index) => [
        'Confirm tool manual and schema have been read.',
        'Confirm the action has one primary side effect.',
        'Confirm working directory, paths and permission boundary.',
        'Confirm observable signal after execution.',
        'Write ToolResultSummary after execution.',
      ][index] ?? 'Keep evidence concise.'),
    })),
  }))
  copySource('knowledge/agent-tooling/tool_gateway_policies.json', (source) => ({
    ...source,
    edition_id: 'english',
    policies: source.policies.map((policy) => ({
      ...policy,
      label: policy.id.replace(/^gateway-policy-/, '').replaceAll('-', ' '),
      summary: {
        'gateway-policy-doc-first': 'If the tool name, schema, permission or side effect is unclear, block until the manual is checked.',
        'gateway-policy-read-only-fast-path': 'Read-only tools may run quickly, but output must be bounded and summarized.',
        'gateway-policy-mutation-proposed-action': 'Mutating actions must declare goal, scope, risk, validation and rollback.',
        'gateway-policy-high-risk-approval': 'High-risk actions require ApprovedAction or equivalent human confirmation.',
        'gateway-policy-result-summary': 'Every tool execution writes status, evidence, errors, next steps and FAME update candidates.',
        'gateway-policy-negative-lesson': 'Failures are retained as project memory and negative FAME candidates.',
      }[policy.id] ?? policy.summary,
    })),
  }))
  copySource('knowledge/agent-tooling/stability_scenarios.json', (source) => ({
    ...source,
    edition_id: 'english',
    label: 'Tool-call stability scenario matrix',
    purpose: 'Convert frequent agent engineering actions into prechecked, routed, validated and reviewable scenarios.',
    scenarios: source.scenarios.map((scenario) => {
      const info = scenarios[scenario.id]
      return {
        ...scenario,
        label: info?.label ?? scenario.label,
        trigger: info?.trigger ?? scenario.trigger,
        required_checks: info?.checks ?? scenario.required_checks,
      }
    }),
  }))
  copySource('knowledge/agent-tooling/result_summary_patterns.json', (source) => ({
    ...source,
    edition_id: 'english',
    patterns: source.patterns.map((pattern) => ({ ...pattern, label: pattern.id.replace(/^result-pattern-/, '').replaceAll('-', ' ') })),
  }))
  copySource('knowledge/agent-tooling/tool_call_failure_patterns.json', (source) => ({
    ...source,
    edition_id: 'english',
    patterns: source.patterns.map((pattern) => ({
      ...pattern,
      label: failurePatternLabels[pattern.id] ?? pattern.label,
      summary: failurePatternLabels[pattern.id] ? `Recurring failure: ${failurePatternLabels[pattern.id]}.` : pattern.summary,
    })),
  }))
  for (const file of ['taxonomy.json', 'operation_playbooks.json', 'critical_error_domains.json', 'reflection_patterns.json', 'evaluation_metrics.json']) {
    copySource(`knowledge/agent-tooling/${file}`, (source) => ({ ...translateSimpleLabels(source), edition_id: 'english', subject: 'agent-tooling' }))
  }
  writeText('knowledge/agent-tooling/README.md', `# Agent Tooling

This branch is the practical center of the English open edition. It makes agents safer by forcing route selection, action contracts, gateway policy and result summaries before and after tools.

Primary files:

- stability_scenarios.json
- tool_gateway_policies.json
- action_templates.json
- result_summary_patterns.json
- tool_call_failure_patterns.json
- evaluation_metrics.json
`)
}

function buildDatabaseFiles() {
  const contentUnits = readSourceJsonl('knowledge/database/content_units.jsonl').map(translateContentUnit)
  writeText('knowledge/database/content_units.jsonl', contentUnits.map((unit) => JSON.stringify(unit)).join('\n'))
  copySource('knowledge/database/content_index.json', (source) => ({ ...translateSimpleLabels(source), edition_id: 'english' }))
  copySource('knowledge/database/data_sources.json', (source) => ({ ...translateSimpleLabels(source), edition_id: 'english' }))
  copySource('knowledge/database/samples/manifest.json', (source) => ({ ...source, edition_id: 'english' }))
  copyText('knowledge/database/samples/openalex.sample.jsonl')
  copyText('knowledge/database/samples/opencitations.sample.jsonl')
  copyText('knowledge/database/samples/wikidata.sample.jsonl')
  writeText('knowledge/database/samples/README.md', `# Database Samples

Samples are small, license-aware records used to validate import strategy. They are not bulk imports and must not be treated as full source ingestion.
`)
  copySource('knowledge/database/candidates/openalex_topic_candidates.json', (source) => ({ ...source, edition_id: 'english' }))
  writeText('knowledge/database/candidates/README.md', `# Candidate Indexes

Candidate indexes help discover possible external sources. They do not write the core graph or content units automatically.
`)
}

function buildRulesAndIndexes() {
  copySource('knowledge/indexes/subject_index.json', buildSubjectIndex)
  copySource('knowledge/indexes/alias_index.json', buildAliasIndex)
  copySource('knowledge/indexes/scoping_index.json', buildScopingIndex)
  copySource('knowledge/rules/agent_tool_governance.json', (source) => ({ ...translateSimpleLabels(source), edition_id: 'english' }))
  copySource('knowledge/rules/powershell_safety.json', (source) => ({ ...translateSimpleLabels(source), edition_id: 'english' }))
}

function buildSourceRegistry() {
  const source = readSourceJson('knowledge/source_registry.json')
  writeJson('knowledge/source_registry.json', {
    ...source,
    edition_id: 'english',
    policy: {
      default_usage: 'reference_summary_only',
      do_not_copy_full_text_without_review: true,
      license_review_required_before_import: true,
    },
    sources: source.sources.map((item) => ({
      ...item,
      notes: `Reference-only source for the English open edition. Keep summaries self-authored and review license before any data import. Source id mirrors chinese-open: ${item.id}.`,
    })),
  })
}

function buildKnowledgeRoot() {
  const routeIndex = readSourceJson('knowledge/route_index.json')
  writeJson('knowledge/route_index.json', {
    edition_id: 'english',
    status: 'clean_open_seed',
    stats: routeIndex.stats,
    fame_score_formula: fameFormula,
    routes: routeIndex.routes.map(routeToEnglish),
  })
  writeJson('knowledge/graph.seed.json', translateGraph(readSourceJson('knowledge/graph.seed.json')))
  copySource('knowledge/graph.schema.json', (source) => ({ ...source, edition_id: 'english' }))
  buildSourceRegistry()
  writeText('knowledge/README.md', `# English Open Knowledge Net

The English edition is now mechanism-aligned with the Chinese open edition. It keeps the same route ids, scenario ids, content refs, schemas, golden tasks and evaluation flow, while using English documentation and summaries.

## Subject Structure

~~~text
language-tree-hub/
logic/
mathematics/
computer-science/
agent-tooling/
powershell-safety/
database/
indexes/
rules/
~~~

## Read Order For Agents

1. route_index.json
2. indexes/subject_index.json
3. language-tree-hub/core.json
4. language-tree-hub/lexicon_seed.json
5. language-tree-hub/thought_modes.json
6. indexes/scoping_index.json
7. agent-tooling/stability_scenarios.json
8. agent-tooling/tool_gateway_policies.json
9. agent-tooling/action_templates.json

Do not load the full graph. Start from the Language Tree Hub, choose a thinking layer, route by subject and route_id, and keep long logs in project memory or databases.
`)
}

function buildExamplesAndDocs() {
  writeText('QUICKSTART_AGENT.md', `# Quickstart For External Agents

Start here when connecting an agent to the English open edition.

~~~bash
npm run connect:english -- --agent codex
npm run doctor:english
npm run route:english -- --goal "edit JSONL knowledge and sync indexes" --compact
~~~

Required loop:

~~~text
Language Tree normalization
-> scoped route
-> ContextPack
-> ProposedAction when needed
-> Tool Gateway decision
-> tool execution or block
-> ToolResultSummary
-> failure_signature and negative FAME lesson when needed
~~~

For PowerShell Chinese mojibake, do not assume file corruption. Run:

~~~bash
npm run route:english -- --goal "PowerShell Chinese output mojibake" --compact
~~~
`)
  writeText('docs/agent-protocol.md', `# Agent Protocol And Minimal Integration

This file is for external agents. The English open edition aims to reduce tool-call errors, keep thinking layered, and load only necessary context.

## Startup Read Set

1. knowledge/route_index.json
2. knowledge/indexes/subject_index.json
3. knowledge/language-tree-hub/core.json
4. knowledge/language-tree-hub/lexicon_seed.json
5. knowledge/language-tree-hub/thought_modes.json
6. knowledge/indexes/scoping_index.json
7. knowledge/agent-tooling/stability_scenarios.json
8. knowledge/agent-tooling/tool_gateway_policies.json
9. knowledge/agent-tooling/action_templates.json

## Minimal ContextPack

~~~json
{
  "edition_id": "english",
  "project_id": "example-project",
  "task_id": "task-001",
  "subject": "agent-tooling",
  "semantic_anchor": "language-tree-hub",
  "route_ids": ["route-agent-tool-action-contract"],
  "thought_mode": "L5_operation",
  "summaries": [],
  "content_refs": [],
  "negative_lessons": [],
  "context_budget": 2200
}
~~~

## Minimal ProposedAction

~~~json
{
  "kind": "ProposedAction",
  "tool_name": "exec_command",
  "operation_type": "read",
  "scope": {
    "working_directory": "<project-root>",
    "allowed_paths": ["<project-root>"],
    "allowed_side_effects": []
  },
  "expected_output": "bounded evidence summary"
}
~~~

## Mandatory Tool Loop

1. Normalize terms with the Language Tree Hub.
2. Backcast from the goal gate: done criteria, evidence, forbidden outcomes and budget.
3. Check the global situation: goal, constraints, resources, risks, prior lessons and stop conditions.
4. Write a Tool Action Contract.
5. Run the stability preflight for PowerShell, Git, Node/npm, Python, structured data, network import and database sync.
6. Write ToolResultSummary after execution.

High-risk actions require ApprovedAction or equivalent human confirmation.

## CLI Entry

~~~bash
npm run route:english -- --goal "run npm test after confirming package root" --compact
npm run connect:english -- --agent other --agent-name OpenClaw --json
~~~

The same preset list as chinese-open is supported: Codex, Cursor, Claude Desktop, Claude Code, OpenAI Agents SDK, Gemini CLI, OpenHands, SWE-agent, Aider, Cline, Roo Code, Continue, LangGraph, AutoGen, CrewAI, Dify, Generic Agent and Other.
`)
  writeText('docs/common-agent-snippets.md', `# Common Agent Snippets

## Generic Agent Prompt

~~~text
Use the FAME English open edition. Before tools, run route:english --compact. Load only the returned route ids and summaries. Mutating tools need ProposedAction. High-risk tools need ApprovedAction. After execution, write ToolResultSummary.
~~~

## MCP

Expose knowledge files as resources, route:english as a routing tool, and the external-agent prompt as an MCP prompt.

## OpenAI Agents SDK / LangGraph / AutoGen / CrewAI

Map tool_gateway_decision to guardrails:

~~~text
if blockers.length > 0: block
if requires_approved_action: ask for approval
if requires_proposed_action: require ProposedAction
else: allow read-only execution
~~~
`)
  writeText('docs/real-evaluation-report.md', `# English Open Edition Real Evaluation Report

Run:

~~~bash
npm run eval:english
~~~

This evaluation mirrors the Chinese open edition: JSONL edit, real npm test, Git dirty worktree detection, PowerShell path guard, PowerShell Chinese encoding probe, local agent connection and failure recurrence guard.

Expected result: all checks pass with route accuracy proxy and tool safety pass rate equal to 1 for the built-in scenarios.
`)
  writeText('docs/roadmap.md', `# Roadmap

The English edition is mechanism-complete for open-source use. Future work should expand authoritative programming and design subject content gradually, without breaking route ids or agent protocols.

Near-term focus:

- Keep English and Chinese route/scenario/golden-task ids aligned.
- Improve practical tool-call cases.
- Add community-reviewed programming and design knowledge under the same hierarchy.
`)
  writeText('examples/README.md', `# Examples

Examples show the route output and ToolResultSummary shape used by external agents.
`)
  writeJson('examples/route-output.example.json', {
    ok: true,
    edition_id: 'english',
    context_pack: {
      edition_id: 'english',
      project_id: 'example-project',
      task_id: 'task-001',
      subject: 'agent-tooling',
      semantic_anchor: 'language-tree-hub',
      route_ids: ['route-agent-tool-action-contract', 'route-agent-stability-preflight'],
      thought_mode: 'L5_operation',
    },
    proposed_action: {
      kind: 'ProposedAction',
      action_id: 'task-001-scenario-jsonl-knowledge-edit',
      tool_name: 'exec_command',
      operation_type: 'write',
      scope: {
        working_directory: '<project-root>',
        paths: ['versions/english/knowledge/database/content_units.jsonl'],
        subjects: ['agent-tooling'],
        allowed_side_effects: ['modify_declared_files'],
      },
      expected_output: 'JSONL parses and indexes sync',
    },
  })
  writeJson('examples/tool-result-summary.example.json', {
    kind: 'ToolResultSummary',
    action_id: 'task-001-scenario-jsonl-knowledge-edit',
    tool_name: 'exec_command',
    status: 'success',
    summary: 'JSONL parsed and English edition checks passed.',
    evidence: ['npm run doctor:english'],
    errors: [],
    next_steps: [],
    fame_update_candidates: [],
  })
  writeText('examples/external-agent-bootstrap.md', `# External Agent Bootstrap

1. Run \`npm run connect:english -- --agent <agent>\`.
2. Run \`npm run route:english -- --goal "<goal>" --compact\`.
3. Follow blockers, ProposedAction and Tool Gateway decision.
4. Write ToolResultSummary after the tool call.
`)
}

function buildGoldenAndTests() {
  writeJson('golden-tasks/tool-stability.golden.json', {
    edition_id: 'english',
    purpose: 'Fixed tool-stability tasks proving that connected agents make fewer immediate tool mistakes.',
    tasks: [
      { id: 'golden-powershell-delete', goal: 'PowerShell delete directory but avoid accidental deletion', args: ['--operation', 'delete', '--tool-name', 'exec_command', '--working-directory', '<project-root>', '--expected-output', 'list absolute path and wait for approval'], expected_scenario: 'scenario-powershell-destructive-delete', must_have: ['requires_approved_action', 'route-powershell-safe-command'] },
      { id: 'golden-jsonl-edit', goal: 'edit JSONL knowledge base and sync indexes', args: [], expected_scenario: 'scenario-jsonl-knowledge-edit', must_have: ['route-agent-database-sync', 'route-logic-knowledge-consistency'] },
      { id: 'golden-git-dirty-worktree', goal: 'prepare to edit files while protecting a dirty Git worktree', args: ['--operation', 'write'], expected_scenario: 'scenario-git-dirty-worktree', must_have: ['tool-failure-dirty-worktree-overwrite'] },
      { id: 'golden-node-build', goal: 'run npm test after confirming working directory and package.json', args: ['--operation', 'build'], expected_scenario: 'scenario-node-npm-build', must_have: ['tool-failure-wrong-working-directory'] },
      { id: 'golden-no-evidence-no-complete', goal: 'do not claim completion without testing evidence', args: ['--operation', 'build'], expected_scenario: 'scenario-node-npm-build', must_have: ['tool-failure-test-claim-without-evidence', 'result-pattern-command-success'] },
    ],
  })
  writeText('tests/agent-effect-smoke.mjs', `import { execFileSync } from 'node:child_process'
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
`)
}

function buildProjectMemoryCases() {
  writeText('project-memory-cases/README.md', `# Project Memory Cases

Project memory cases are external overlays. They do not automatically modify the core knowledge net.
`)
  writeJson('project-memory-cases/case.schema.json', {
    $schema: 'https://json-schema.org/draft/2020-12/schema',
    title: 'English Project Memory Case',
    type: 'object',
    required: ['case_id', 'project_id', 'summary', 'route_refs', 'evidence_refs'],
    properties: {
      case_id: { type: 'string' },
      project_id: { type: 'string' },
      summary: { type: 'string' },
      route_refs: { type: 'array', items: { type: 'string' } },
      evidence_refs: { type: 'array', items: { type: 'string' } },
      promotion_candidate: { type: 'boolean' },
    },
  })
  writeJson('project-memory-cases/candidate_sources.json', {
    edition_id: 'english',
    policy: 'Reference open-source engineering cases only after license review. Keep summaries self-authored.',
    candidates: [],
  })
}

function buildRootReadme() {
  writeText('README.md', `# FAME English Open Edition

This edition is aligned with the Chinese open edition in mechanism, route ids, scenario ids, golden tasks and evaluation flow.

## One-minute Start

~~~bash
npm run connect:english -- --agent codex
npm run doctor:english
npm run route:english -- --goal "edit JSONL knowledge and sync indexes" --compact
~~~

## Positioning

This is a universal external plugin substrate for agents. It is not plain retrieval. It combines a Language Tree Hub, scoped route traversal, FAME route parameters, project memory overlay, Tool Gateway enforcement, one-shot tool manual checks and ToolResultSummary write-back.

## Structure

~~~text
language-tree-hub/     semantic center and thinking layers
logic/                 argument, precondition and consistency checks
mathematics/           graph traversal, route scoring and evidence update
computer-science/      programming, testing, indexing and release gates
agent-tooling/         tool governance, connection and recurrence guards
powershell-safety/     Windows shell safety and Chinese encoding diagnosis
database/              detailed content units and source/data registries
indexes/               subject, alias and scoping indexes
~~~

## Verification

~~~bash
npm run doctor:english
npm run eval:english
npm run check:english
~~~

The English edition intentionally keeps programming and tool-call knowledge practical and compact. Broad subject expansion should happen gradually through reviewed community contributions.
`)
}

function main() {
  ensureDir(targetRoot)
  buildRootReadme()
  buildKnowledgeRoot()
  buildLanguageTreeFiles()
  buildSubjectFiles()
  buildAgentToolingFiles()
  buildDatabaseFiles()
  buildRulesAndIndexes()
  buildExamplesAndDocs()
  buildGoldenAndTests()
  buildProjectMemoryCases()
  writeJson('knowledge/professional-knowledge/programming/placeholder.json', {
    edition_id: 'english',
    status: 'legacy_placeholder',
    note: 'Kept only for compatibility. The aligned structure now uses knowledge/computer-science and knowledge/agent-tooling.',
  })
  writeJson('knowledge/professional-knowledge/design/placeholder.json', {
    edition_id: 'english',
    status: 'future_subject_placeholder',
    note: 'Design can be expanded later under the same Language Tree routing rules.',
  })
  writeText('knowledge/professional-knowledge/README.md', '# Professional Knowledge\n\nLegacy placeholder. Current aligned branches are computer-science and agent-tooling.\n')
  writeText('knowledge/professional-knowledge/programming/README.md', '# Programming Placeholder\n\nUse knowledge/computer-science for the current open edition.\n')
  writeText('knowledge/professional-knowledge/design/README.md', '# Design Placeholder\n\nReserved for future community expansion.\n')
  writeText('knowledge/language-tree-hub/routes.json', JSON.stringify(readSourceJson('knowledge/route_index.json').routes.filter((route) => route.subject === 'language-tree-hub').map(routeToEnglish), null, 2))
}

main()

