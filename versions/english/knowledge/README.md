# English Open Knowledge Net

The English edition is now mechanism-aligned with the Chinese open edition. It keeps the same route ids, scenario ids, content refs, schemas, golden tasks and evaluation flow, while using English documentation and summaries.

## Subject Structure

~~~text
language-tree-hub/
logic/
mathematics/
computer-science/
agent-tooling/
powershell-safety/
database/
indexes/
rules/
~~~

## Read Order For Agents

1. route_index.json
2. indexes/subject_index.json
3. language-tree-hub/core.json
4. language-tree-hub/lexicon_seed.json
5. language-tree-hub/thought_modes.json
6. indexes/scoping_index.json
7. agent-tooling/stability_scenarios.json
8. agent-tooling/tool_gateway_policies.json
9. agent-tooling/action_templates.json

Do not load the full graph. Start from the Language Tree Hub, choose a thinking layer, route by subject and route_id, and keep long logs in project memory or databases.
