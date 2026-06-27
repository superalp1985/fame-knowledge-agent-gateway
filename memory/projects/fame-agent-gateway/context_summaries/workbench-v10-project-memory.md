# Context Summary: workbench-v10-project-memory

project_id: fame-agent-gateway
task_id: workbench-v10-project-memory
route_id: project-memory-overlay

## Minimal Resume Context

The goal is to create a project-specific engineering memory graph for actual agent engineering work. It must record project tasks, decisions, modules, artifacts, tool summaries, failures, quality gates, context summaries and FAME overlay without polluting the core knowledge net.

## Active Constraints

- Project memory writes to memory/projects/{project_id}/ only.
- Core knowledge net remains read-only.
- Reusable lessons become promotion candidates, not direct core edits.
- Project FAME overlay combines with core FAME only at evaluation time.

## Next Action Hint

Expose Project Memory in Workbench with isolation status, overlay FAME, failure lessons, context summaries and promotion candidates.
