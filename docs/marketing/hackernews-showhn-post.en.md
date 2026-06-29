# Hacker News / Show HN Draft

HN guideline reminder:

- Submit the GitHub repository URL, not the Zhihu article.
- Title must start with `Show HN`.
- Keep the tone plain and technical.
- Do not ask anyone to upvote or comment.
- Be around after posting to answer questions.

Official guideline:

```text
https://news.ycombinator.com/showhn.html
```

## Recommended Submission

Title:

```text
Show HN: FAME Knowledge Agent Gateway – external memory and tool governance for agents
```

URL:

```text
https://github.com/superalp1985/fame-knowledge-agent-gateway
```

Text field, if HN shows it:

```text
I built FAME Knowledge Agent Gateway as a local external brain for coding agents.

The project is not another agent and not a normal RAG app. It sits beside tools like Codex, Claude Code, Cursor, OpenAI Agents SDK, Gemini CLI, OpenHands, SWE-agent and Aider, and gives them a scoped knowledge route, project memory, tool-call approval flow, and failure memory.

The main problem I am trying to solve is mundane but painful: coding agents often know roughly which tool to call, but still make mistakes in real projects: wrong working directory, stale context, unsafe shell commands, dirty git worktrees, missing tool manuals, repeated failures, or huge context dumps.

The gateway adds an external route before action:

goal -> scoped knowledge route -> compact context pack -> ProposedAction -> ApprovedAction -> Tool Gateway -> ToolResultSummary -> retained memory

Current v0.1.0 includes:

- local React/Three.js workbench with 3D and 2D knowledge graph views
- Chinese and English open editions
- MCP and HTTP runtime gateway
- project memory overlay that does not pollute the core knowledge graph
- FAME route parameters for effectiveness, confidence, risk, conflict, resource pressure and failure lessons
- tool approval tokens that block unauthorized, missing-token and tampered-token execution
- knowledge graph editing and lightweight multimodal asset indexing
- portable Windows zip, one-click installer, Docker files and release assets

I added real evals instead of only screenshots:

- Chinese open edition: 8/8 checks passed
- English edition: 8/8 checks passed
- high-risk delete without scope is blocked
- scoped high-risk delete still requires ApprovedAction
- dirty git worktree protection is detected
- PowerShell UTF-8/mojibake probe passes
- wrong-working-directory npm test failure is retained and guarded on retry
- runtime smoke test blocks unauthorized, missing-token and tampered-token calls
- MCP initializes with 15 tools

The knowledge graph currently generates 623 indexed files, 2714 route records, 3337 runtime entries, 51 shards, 235 3D nodes and 287 links.

The part I am most interested in feedback on is the boundary between existing memory systems and tool-governance systems. I don't want to replace LangGraph/Mem0/Zep/GraphRAG/MCP; I want this to be a local layer that routes an agent before it acts, and writes back failures after it acts.

Repo:
https://github.com/superalp1985/fame-knowledge-agent-gateway

Release:
https://github.com/superalp1985/fame-knowledge-agent-gateway/releases/tag/v0.1.0
```

## Shorter First Comment Version

Use this if HN does not show the submission text and you need to add a first comment.

```text
I built this as a local external brain for coding agents.

It is not another agent and not a normal RAG app. It sits beside Codex, Claude Code, Cursor, OpenAI Agents SDK, Gemini CLI, OpenHands, SWE-agent or Aider, and gives them:

- scoped knowledge routes
- compact context packs
- project memory that survives context limits
- ProposedAction -> ApprovedAction -> Tool Gateway flow
- failure signatures and retained lessons
- 3D/2D knowledge graph workbench
- MCP/HTTP runtime gateway

The concrete failure modes I am targeting are boring but common: wrong working directory, unsafe shell commands, stale context, dirty git worktrees, missing tool manuals, repeated failures, and dumping too much knowledge into the model context.

Current real evals:

- Chinese open edition: 8/8 checks passed
- English edition: 8/8 checks passed
- high-risk delete without scope is blocked
- scoped high-risk delete still requires ApprovedAction
- dirty git worktree protection is detected
- PowerShell UTF-8/mojibake probe passes
- wrong-working-directory npm test failure is retained and guarded on retry
- runtime smoke test blocks unauthorized, missing-token and tampered-token calls
- MCP initializes with 15 tools

The generated graph currently has 623 indexed files, 2714 route records, 3337 runtime entries, 51 shards, 235 3D nodes and 287 links.

I'd especially like feedback on the design boundary: should this kind of thing be a memory layer, a guardrail layer, an MCP server, or a separate local "engineering route" layer?
```

## Alternative Titles

```text
Show HN: A local external brain and tool gateway for coding agents
```

```text
Show HN: FAME Gateway – scoped memory, tool approvals and failure lessons for agents
```

```text
Show HN: I built a local knowledge graph and tool-governance layer for agents
```

Recommended title is the first one in this file. The alternatives are slightly more descriptive but less neutral.

## Screenshot / Cover Image

HN itself does not need an inline image, but a screenshot link is useful if someone asks what it looks like.

Local image:

```text
docs/marketing/hn-assets/00-cover-showhn.png
```

After pushing these marketing files, the raw GitHub image URL will be:

```text
https://raw.githubusercontent.com/superalp1985/fame-knowledge-agent-gateway/main/docs/marketing/hn-assets/00-cover-showhn.png
```

Optional screenshot line for a first comment:

```text
Screenshot:
https://raw.githubusercontent.com/superalp1985/fame-knowledge-agent-gateway/main/docs/marketing/hn-assets/00-cover-showhn.png
```

Use the screenshot line only if it feels natural. HN usually prefers the repo and a clear explanation over marketing images.

## Suggested Posting Steps

1. Make sure the GitHub repo page is clean and the release assets are visible.
2. Open `https://news.ycombinator.com/submit`.
3. Paste the recommended title.
4. Paste the GitHub repository URL.
5. Paste the long text if HN accepts text with URL submissions.
6. If the text does not appear on the thread, add the shorter version as the first comment.
7. Do not ask anyone to upvote.
8. Stay around for several hours and answer technical questions directly.

