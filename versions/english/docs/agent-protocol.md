# Agent Protocol And Minimal Integration

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

## FAME And Knowledge Extension

Read `agent-protocol/07_fame-and-knowledge-extension.md` for:

- FAME parameter meanings
- route scoring
- FAME update candidates
- negative lessons and failure signatures
- knowledge graph extension hierarchy
- KnowledgePatchProposal
- private project-memory promotion rules
