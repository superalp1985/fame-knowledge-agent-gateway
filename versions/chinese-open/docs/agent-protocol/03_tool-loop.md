# 03 工具调用闭环

工具调用前先走六步稳定闭环。

1. 语义归一：用 `language-tree-hub/lexicon_seed.json` 找 canonical term。
2. 找球门：走 `route-language-goal-backcasting`，确定完成标准、证据、禁止事项和预算。
3. 看大局：走 `route-language-global-situation-model`，检查目标、约束、资源、风险、教训和停止条件。
4. 写契约：走 `route-agent-tool-action-contract`，把意图压成工具动作契约。
5. 做预检：走 `route-agent-stability-preflight`，检查 PowerShell、Git、Node/npm、Python、结构化数据、网络下载和数据库同步。
6. 摘要回写：走 `route-agent-tool-result-summary`，只把摘要、证据和下一步留在上下文。

PowerShell 中文乱码先走 `route-powershell-encoding-output`，不要直接判断源文件损坏。
