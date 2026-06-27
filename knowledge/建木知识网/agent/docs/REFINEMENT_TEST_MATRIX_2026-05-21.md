# 精修多场景测试记录 - 2026-05-21 23:20

## 本轮优化

- `CourseProductionRouter` 增加 `00_studio_run_summary.md`，让成果包具备一眼可读的交付摘要。
- `00_artifact_inventory.json` 增加 recommended_first_open 和 download_hint。
- 仅在发现缺失文件或云端响应异常时生成 `00_failure_notes.md`，避免无意义噪声。
- `ToolPlanner` 修复“不联网”误判：现在 `不联网/不要联网/无需联网/no web/offline` 会优先关闭 web。
- `ToolPlanner` 增强复合意图：完整成果/一整套/全套/成果包/pipeline/工作流/流水线，以及带路径的生成型任务，会优先进入完整 course_production pipeline。

## 多场景实测

| 场景 | 输入形态 | 预期路由 | 结果 |
|---|---|---:|---|
| 本地图片分析 | `分析这个图片 <png path>` | `local_file` | 通过 |
| 本地文档导出 Office | `把这个文档导出成Word <md path>` | `office` | 通过 |
| 教学动画生成 | `生成一个预算绩效闭环的教学动画` | `animation` | 通过 |
| Code2Video 沙箱 | `/workers/Code2Video/sandbox-plan` | `external_process_or_container` | 通过 |
| 从本地文件生成完整成果包 | `基于这个文件做一套完整成果包，不联网 <md path>` | `course_production` | 通过 |

## 发现并修复的问题

1. `不联网` 早期会被简单关键词 `联网` 误判为需要联网；已新增 `_wants_web()` 处理否定意图。
2. 中文测试脚本在 PowerShell 编码下可能出现 mojibake，测试侧改用 unicode escape 保证真实中文意图进入服务。
3. 完整 pipeline 在 TestClient 中提交异步任务后，测试进程可能因后台线程未退出而挂住；这是测试脚本生命周期问题，不影响 live 服务，但后续可给 TaskQueue 增加 test shutdown 或同步测试入口。

## 当前判断

多种非重复实际场景已通过，Studio 的自然语言路由覆盖面和成果包交付感均有提升。下一轮应继续做 UI 侧的“任务状态/产物入口/质量报告”可视化增强。
