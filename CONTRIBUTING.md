# Contributing

Thanks for helping build FAME Knowledge Agent Gateway.

## Local Setup

```bash
npm run install:all
npm run generate:all
npm run dev
```

Run the gateway smoke test:

```bash
npm run gateway:smoke
```

Run the full local gate:

```bash
npm run ci
```

## Development Flow

1. Define the current scope: `project_id`, `subject`, `route_id`, `task_id`.
2. Resolve the goal and route before adding tools or graph changes.
3. Keep mutation tools behind `ProposedAction -> ApprovedAction -> Tool Gateway`.
4. Keep project memory in overlay storage unless a promotion review approves a core knowledge update.
5. Update docs when changing architecture, schemas, routing, enforcement, visualization or runtime behavior.

## Pull Request Expectations

- Keep changes scoped.
- Add or update tests for runtime behavior.
- Add or update docs for public API, MCP, deployment or security changes.
- Run `npm run ci`.
- Do not commit private knowledge data, generated private indexes, local env files, runtime DBs or secrets.

## Knowledge Patch Rule

Core knowledge should not be edited directly by an agent. Use a `KnowledgePatchProposal` flow:

```text
proposal -> review -> approval -> sidecar patch or core update
```

## Frontend Review

For UI changes, verify:

- desktop layout
- mobile layout
- 3D canvas is nonblank
- 2D route detail opens
- search works
- text does not overlap controls
