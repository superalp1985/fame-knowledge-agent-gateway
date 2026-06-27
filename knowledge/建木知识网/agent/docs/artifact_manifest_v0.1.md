# Artifact Manifest v0.1

## 目标
给 Tauri UI、任务队列、审计回放、产物管理提供统一 manifest。

## 实现
```text
src/manifest.py
```

核心类：
- `ArtifactRecord`
- `ArtifactManifestBuilder`

## Manifest Schema
```json
{
  "schema": "jianmu.agent.artifact_manifest.v0.1",
  "task_id": "...",
  "topic": "...",
  "created_at": "...",
  "artifact_count": 22,
  "artifacts": [],
  "extra": {}
}
```

## ArtifactRecord 字段
- `kind`：产物类型，如 research / slides_pdf / video_plan / language_pack。
- `title`：展示标题。
- `path`：绝对路径。
- `relative_path`：相对 agent 工程根目录路径，供 UI 展示和打包使用。
- `exists`：文件是否存在。
- `size_bytes`：文件大小。
- `sha256`：文件 hash，用于审计、缓存、回放和变更检测。
- `producer`：产物生产者，如 course-pack / PptDraftWorker / VideoPlanWorker。
- `step`：任务步骤，如 course_pack / ppt_draft / video_plan。
- `audit_path`：关联的交接审计记录。

## 当前接入
`CourseProductionRouter` 已使用 manifest builder。

`POST /tasks/course-production` 输出：
- `manifest` artifact
- manifest 内含所有子任务产物记录
- 每个 artifact 均带 hash / relative_path / producer / step / audit_path

## 注意
manifest 文件自身当前不递归写入 manifest 内部，避免 hash 自引用问题。API 返回 artifacts 中仍包含 manifest artifact。

## 下一步
1. 增加 artifact preview 类型：markdown/pdf/json/media。
2. 增加 artifact lineage：parent task / source artifact。
3. 增加 manifest diff。
4. 增加 UI 可用的 manifest index。
5. 增加任务数据库/队列持久化。
