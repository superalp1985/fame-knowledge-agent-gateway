# Backend Hardening v0.1

## 老板要求
先把后端 1-5 做完，然后完整测试：
1. worker health check
2. error task 记录
3. artifact preview metadata
4. 异步任务队列
5. SQLite/DuckDB 替代 JSONL

## 完成项

### 1. Worker Health Check
实现：`src/worker_health.py`

API：
```text
GET /workers/health
```

检查 worker registry 中的路径是否存在，并区分 required / optional。

### 2. Error Task 记录
实现：`TaskStore.append_error()`。

`/tasks/course-production` 同步执行遇到异常时会写入 error task。

### 3. Artifact Preview Metadata
实现：`src/artifact_preview.py`

对 artifact 增加：
- preview_type: text / pdf / image / video / audio / binary
- can_inline
- can_read_text

已接入：
- `GET /tasks/{task_id}`
- `GET /tasks/{task_id}/artifacts`
- `GET /tasks/{task_id}/artifacts/read`

### 4. Async Task Queue
实现：`src/task_queue.py`

API：
```text
POST /tasks/course-production/async
GET /jobs
GET /jobs/{job_id}
```

当前为 in-process ThreadPoolExecutor，后续可替换 Celery/RQ/Arq。

### 5. SQLite Task Store
实现：`src/task_db.py`

数据库：
```text
data/tasks.sqlite3
```

JSONL 继续保留作 append-only 调试记录：
```text
data/task_index.jsonl
```

SQLite 是 v0.1+ 主要查询后端。

## 完整测试结果（2026-05-21 16:10）
```text
HEALTH 200
WORKER_HEALTH 200 True
WORKERS 200
WORKER_ONE 200
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
ARTIFACT_READ_PDF 200 pdf
AUDITS 200 22
ASYNC_SUBMIT 200 running
ASYNC_JOB 200 ok
JOBS 200
```

## 修复项
- `WorkerRegistry.root` 原本误算到 `[REDACTED_LOCAL_PATH]`，导致 worker health false；已修复为 agent 工程根：`Path(__file__).resolve().parents[1]`。
