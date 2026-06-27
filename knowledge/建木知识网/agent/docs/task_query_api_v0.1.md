# Task Query API v0.1

## 目标
把后端补齐到 UI 可直接消费：任务列表、任务详情、产物列表、产物读取、manifest 校验、审计记录读取。

## 实现
```text
src/task_query.py
```

核心类：
- `TaskQueryService`

## API
```text
GET /tasks?limit=50&topic=&task_type=
GET /tasks/{task_id}
GET /tasks/{task_id}/manifest
GET /tasks/{task_id}/manifest/validate
GET /tasks/{task_id}/artifacts
GET /tasks/{task_id}/artifacts/read?kind=&index=&max_chars=20000
GET /tasks/{task_id}/audits?kind=
```

## 能力
- 按 topic / task_type 过滤任务列表。
- 读取任务详情和 manifest summary。
- 列出 manifest 内所有 artifacts。
- 文本 artifact 可直接读取内容。
- 二进制 artifact 返回 `content_type=binary`，不直接读内容。
- 校验 manifest 中文件是否存在、大小是否变化。
- 读取与 artifacts 关联的 handoff audit。

## 完整烟测结果（2026-05-21 16:03）
```text
HEALTH 200
WORKERS 200
DOC_OUTLINE 200
PPT_DRAFT 200
VIDEO_PLAN 200
ANIMATION_PLAN 200
LOCALIZATION 200
TASK 200
BUNDLE 200
TASKS 200
TASKS_FILTERED 200
TASK_DETAIL 200
TASK_MANIFEST 200 jianmu.agent.artifact_manifest.v0.1 22
MANIFEST_VALIDATE 200 True 0
ARTIFACTS 200 22
ARTIFACT_READ 200 text 500
ARTIFACT_READ_PDF 200 binary
AUDITS 200 22
```

## 下一步
后端 v0.1 已基本可支撑最小 UI。继续后端可做：
1. SQLite/DuckDB 替代 JSONL。
2. 异步任务队列。
3. error task 记录。
4. artifact preview metadata。
5. worker health check。
