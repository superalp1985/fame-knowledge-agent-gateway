# 04 ProposedAction

Mutating actions must declare:

- `tool_name`
- `operation_type`
- `scope.working_directory`
- `scope.paths`
- `expected_output`
- `validation_plan`
- `rollback_plan`
- whether `ApprovedAction` is required

If `working_directory` or path scope is unclear, do not run write, delete, move, publish or script execution actions.
