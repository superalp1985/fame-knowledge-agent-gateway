# Task Store v0.1

## 目标
给 Tauri UI / 任务队列 / 历史记录提供任务索引，不让 UI 扫 outputs 文件夹。

## 实现
```text
src/task_store.py
```

核心类：
- `TaskIndexRecord`
- `TaskStore`

## 存储
```text
data/task_index.jsonl
```

采用 append-only JSONL，方便调试和恢复。

## TaskIndexRecord 字段
- `task_id`
- `topic`
- `task_type`
- `status`
- `manifest_path`
- `artifact_count`
- `created_at`
- `updated_at`

## API
```text
GET /tasks?limit=50
GET /tasks/{task_id}/manifest
```

## 当前接入
`CourseProductionRouter` 生成 manifest 后自动写入 task index。

## 烟测
`scripts/smoke_api.py` 已覆盖：
- 生成 course-production bundle
- `/tasks?limit=5` 能查到刚生成的 task
- `/tasks/{task_id}/manifest` 能读取 manifest

## 下一步
1. 增加任务状态：running / ok / error / cancelled。
2. 增加任务 type 过滤。
3. 增加 topic 搜索。
4. 增加 task detail API。
5. 后续迁移到 SQLite 或 DuckDB。
