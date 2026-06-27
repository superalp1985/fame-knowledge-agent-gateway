# FAME Workbench

The Workbench is the local UI for FAME Knowledge Agent Gateway.

It provides:

- 3D Knowledge Universe
- 2D Route Detail
- FAME edge inspection
- GoalGate traversal debug
- KnowledgePatchProposal entry
- module health and metrics panels

## Scripts

```bash
npm install
npm run generate:knowledge
npm run dev -- --host 127.0.0.1 --port 5178
npm run build
```

## Generated Files

```text
src/generated/knowledgeUniverse.generated.ts
src/generated/knowledgeIndex.generated.ts
```

These are generated from local knowledge roots and are ignored at the repository root for open-source safety.

