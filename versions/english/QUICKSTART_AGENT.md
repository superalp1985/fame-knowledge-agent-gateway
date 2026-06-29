# Quickstart For External Agents

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

Before adding or changing knowledge, read:

~~~text
versions/english/docs/agent-protocol/07_fame-and-knowledge-extension.md
~~~

Do not write directly into the core knowledge net. Create a KnowledgePatchProposal first, keep raw/private material in project memory or asset storage, and promote only reviewed generic routes, rules or lessons.

For PowerShell Chinese mojibake, do not assume file corruption. Run:

~~~bash
npm run route:english -- --goal "PowerShell Chinese output mojibake" --compact
~~~
