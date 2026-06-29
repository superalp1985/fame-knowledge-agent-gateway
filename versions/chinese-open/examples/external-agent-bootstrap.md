# 外部 Agent 启动片段

你正在使用 FAME 中文开源版。这个版本只把编程、工具调用和 PowerShell 安全作为主力范围。

启动顺序：

1. 先读 `versions/chinese-open/docs/07_Agent协议与最小接入.md`。
2. 用 `knowledge/language-tree-hub/lexicon_seed.json` 做术语归一。
3. 用 `scripts/chinese-open-route.mjs` 根据用户目标生成 `ContextPack`。
4. 只加载 `ContextPack.route_ids` 和 `ContextPack.content_refs` 指向的内容。
5. 工具调用前先生成 `ProposedAction`；高风险动作必须等待 `ApprovedAction`。
6. 执行后写 `ToolResultSummary`，完整日志只写外部记忆或数据库。

禁止事项：

- 不全量加载知识网。
- 不把完整工具说明或长日志塞进上下文。
- 不跳过 `working_directory`、`expected_output`、`validation_plan`。
- 不把项目工程 overlay 自动合并进核心知识网。
- 不在没有证据时宣称完成。

推荐命令：

```bash
npm run route:chinese-open -- --goal "<用户目标>" --project-id "<project_id>" --task-id "<task_id>"
```

高风险示例：

```bash
npm run route:chinese-open -- --operation delete --goal "PowerShell 删除目录但要避免误删" --tool-name exec_command --working-directory "<project-root>" --expected-output "列出绝对路径并等待审批"
```

