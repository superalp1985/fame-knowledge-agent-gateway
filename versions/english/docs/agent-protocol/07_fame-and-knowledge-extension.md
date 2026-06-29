# 07 FAME And Knowledge Extension Protocol

This page is for external agents and contributors. It defines how to read FAME parameters, score routes, retain failure lessons, extend the knowledge graph, and keep private project memory separate from the public knowledge net.

## 1. FAME Parameters

Every route, important edge and lesson can carry FAME parameters:

```json
{
  "mu": 0.55,
  "chi": 0.70,
  "epsilon": 0.80,
  "kappa": 0.75,
  "nu": 0.25,
  "delta": 0.0,
  "rho": 0.60,
  "risk": 0.20
}
```

| Parameter | Meaning | Main Evidence |
| --- | --- | --- |
| `mu` | route effectiveness | tests, builds, real execution |
| `chi` | semantic fit to the goal | Language Tree normalization, user feedback |
| `epsilon` | evidence strength and verifiability | reproducible checks, authoritative sources |
| `kappa` | operability and tool stability | tool results, stable parameters |
| `nu` | novelty and associative transfer value | useful cross-route analogy |
| `delta` | conflict, bias, failure or correction signal | failure signatures, human correction |
| `rho` | reuse stability and context pressure | repeated reuse, context cost |
| `risk` | safety, license, freshness or engineering risk | review and policy checks |

## 2. Route Score

Default route score:

```text
route_score =
  0.22 * mu
+ 0.18 * chi
+ 0.20 * epsilon
+ 0.12 * kappa
+ 0.10 * nu
+ 0.08 * rho
- 0.06 * abs(delta)
- 0.04 * risk
```

Agents must not blindly choose the highest score. They must also check:

- `project_id`
- `subject`
- `route_id`
- `task_id`
- `context_budget`
- negative FAME lessons
- whether `ProposedAction` is required
- whether `ApprovedAction` is required

## 3. FAME Update Rules

After execution, agents should submit FAME update candidates. They should not silently overwrite the core knowledge net.

Suggested rules:

- Passing tests, successful builds and confirmed usefulness increase `mu`.
- Accurate semantic routing increases `chi`.
- Reproducible evidence and authoritative sources increase `epsilon`.
- Stable tool calls, correct paths and correct parameters increase `kappa`.
- Useful association or cross-domain transfer increases `nu`.
- Failures, conflicts, near misses and human corrections lower `delta` or create negative lessons.
- Stable reuse with low context cost increases `rho`.
- Unknown license, stale data or dangerous operations increase `risk`.

Failed routes must not be deleted. Convert them into:

```text
lesson
warns_against edge
negative FAME route
failure_signature
```

## 4. Knowledge Extension Hierarchy

New knowledge must go from abstraction to concrete use:

```text
Language Tree Hub
-> discipline
-> field
-> topic_cluster
-> abstract method / rule
-> route
-> knowledge_point / content_unit
-> verification
-> lesson
```

Do not put long tutorials, full papers, raw logs, large images or videos directly into graph nodes. Graph nodes should keep only:

- `id`
- `label`
- `subject`
- `node_type`
- `abstraction_level`
- `summary`
- `source_refs`
- `content_refs`
- `route_refs`
- `fame`

Detailed content belongs in:

```text
knowledge/database/content_units.jsonl
knowledge/rules/*.json
knowledge/indexes/*.json
asset_store/**
memory/**
external database or object storage
```

## 5. Minimal Checklist For New Knowledge

Before adding knowledge, an agent must generate or check:

```json
{
  "subject": "agent-tooling",
  "abstraction_level": "L5_operation",
  "canonical_terms": ["tool action contract"],
  "route_id": "route-agent-tool-action-contract",
  "summary": "A short summary, ideally under 120 Chinese characters or one compact English sentence.",
  "source_refs": ["source-id-or-url"],
  "content_refs": ["content-unit-id"],
  "verification": ["test/check/evidence"],
  "fame": {
    "mu": 0.55,
    "chi": 0.70,
    "epsilon": 0.80,
    "kappa": 0.75,
    "nu": 0.25,
    "delta": 0.0,
    "rho": 0.60,
    "risk": 0.20
  }
}
```

## 6. KnowledgePatchProposal

Agents should not directly write new material into the core knowledge net. They should first create a proposal:

```json
{
  "kind": "KnowledgePatchProposal",
  "proposal_id": "kp-2026-0001",
  "edition_id": "english",
  "project_id": "optional-project",
  "subject": "agent-tooling",
  "operation": "add_route | add_rule | add_lesson | update_fame | add_content_ref",
  "target_ids": ["route-agent-tool-action-contract"],
  "language_tree_anchor": "language-tree-hub/tool-action",
  "summary": "Reason and scope of this change.",
  "source_refs": [],
  "content_refs": [],
  "fame_update": {},
  "license_review": "clear | pending | blocked",
  "review_status": "draft | pending_review | approved | rejected"
}
```

Only `review_status = approved` may be written to the core knowledge net.

## 7. Private Project Memory Boundary

Default rule:

```text
Project Memory overlay != core knowledge net
```

Private project memory belongs in `memory/**` or a project overlay. It must not automatically pollute the core knowledge net.

Promotion to public knowledge requires:

- private paths, secrets and business details removed
- rewritten as a generic route, rule or lesson
- source and license status reviewed
- verification evidence attached
- failure signatures or FAME update rationale retained

## 8. Agent Must Not

- full-load the knowledge net
- put long logs into context
- bypass `ProposedAction` / `ApprovedAction`
- delete failed routes
- automatically merge private project overlay into core knowledge
- overwrite FAME values without evidence
- import full-text material with unclear license into the open knowledge net

