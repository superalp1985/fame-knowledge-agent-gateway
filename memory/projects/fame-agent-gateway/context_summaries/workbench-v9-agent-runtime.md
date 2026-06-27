# Context Summary: workbench-v9-agent-runtime

project_id: fame-agent-gateway
task_id: workbench-v9-agent-runtime
route_id: agent-runtime-semantic-autofit

## Minimal Resume Context

Workbench v9 added an Agent Runtime view. It shows connectors, thinking pipeline, enforcement preview, semantic auto-fit proposals and context pack retain/release. 3D controls keep left pan / right rotate / wheel zoom and add zoomToCursor/maxTargetRadius for stability.

## Active Constraints

- Main knowledge net is read-only unless KnowledgePatchProposal is approved.
- Tool calls must follow ProposedAction -> ApprovedAction.
- Context strategy is summary-first.
- 3D overview must not expand all route records.

## Route Decisions

- MCP is interface, not decision brain.
- Jianmu/FAME/Enforcement remain the decision layer.
- Semantic auto-fit is proposal/review based.

## Next Action Hint

Implement ProjectMemoryGraph as an isolated overlay under memory/projects/{project_id}, with promotion candidates for reusable lessons.
