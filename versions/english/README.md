# English Edition

This is the seed for a pure English edition of FAME Knowledge Agent Gateway.

The English edition keeps the same agent plugin mechanisms as the Chinese edition, but starts with a simplified public knowledge structure for tomorrow's subject-by-subject expansion:

```text
Language Tree Hub
-> Professional Knowledge
   -> Programming
   -> Design
```

## Current Status

- Language Tree Hub: seed structure only.
- Programming: placeholder branch.
- Design: placeholder branch.
- Detailed subject mapping: pending manual review.

## Non-Negotiable Mechanisms

- The knowledge graph remains route-first, not plain retrieval.
- Language is the central coordination layer for abstraction, expression and cross-domain association.
- FAME parameters stay on routes and edges to record usefulness, uncertainty, conflict, cost and lessons.
- Project memory is an overlay and does not pollute the core knowledge net.
- Tool execution must pass through `ProposedAction -> ApprovedAction -> Tool Gateway`.
- Context packing uses summaries, refs and scoped lazy loading while retaining full memory externally.
- Multimodal raw payloads stay in the asset database or object store; the graph keeps only preview/index references.

## Seed Files

```text
knowledge/language-tree-hub/
knowledge/professional-knowledge/programming/
knowledge/professional-knowledge/design/
```

Run future English indexing work against this directory only after the English edition has its own generator profile.
