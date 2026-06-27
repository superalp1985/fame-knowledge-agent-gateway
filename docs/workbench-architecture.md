# Workbench Architecture

The Workbench uses a two-layer visual model:

```text
3D Knowledge Universe
  large-scale overview, subjects, roots, cross-subject associations

2D Route Detail
  scoped route, FAME edge state, GoalGate traversal, patch proposal
```

Both layers include search:

```text
3D Search
  universe nodes, route shards, file titles, headings, keywords, paths

2D Search
  local route nodes, route ids, summaries, source refs, FAME edge ids
```

Search result clicks select the matching 3D node/shard or open the local 2D route and highlight the node/edge. This is required because the public knowledge base is large enough that visual browsing alone is not a usable navigation strategy.

## Main Modules

```text
KnowledgeUniverse3D.tsx
  Three.js scene, orbit controls, spatial graph, node picking

App.tsx
  view state, inspector panels, 2D route detail, patch proposal UI

routeEngine.ts
  kappa_eff, route scoring, pruning, GoalPath generation

scripts/build-knowledge-universe.mjs
  public knowledge scanner and generated index writer

scripts/prepare-public-knowledge.mjs
  sanitized public knowledge base generator
```

## Data Source

The workbench indexes `knowledge/` by default. It can fall back to `knowledge_backup/` for private local development, but generated open-source artifacts should come from `knowledge/`.
