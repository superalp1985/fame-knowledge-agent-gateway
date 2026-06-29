# Common Agent Snippets

## Generic Agent Prompt

~~~text
Use the FAME English open edition. Before tools, run route:english --compact. Load only the returned route ids and summaries. Mutating tools need ProposedAction. High-risk tools need ApprovedAction. After execution, write ToolResultSummary.
~~~

## MCP

Expose knowledge files as resources, route:english as a routing tool, and the external-agent prompt as an MCP prompt.

## OpenAI Agents SDK / LangGraph / AutoGen / CrewAI

Map tool_gateway_decision to guardrails:

~~~text
if blockers.length > 0: block
if requires_approved_action: ask for approval
if requires_proposed_action: require ProposedAction
else: allow read-only execution
~~~
