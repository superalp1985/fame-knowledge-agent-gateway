# API Endpoints v0.1

## 状态
```text
GET /health
```
返回建木知识网状态、资产盘点、worker 数量。

## Worker Registry / Health
```text
GET /workers
GET /workers/health
GET /workers/{worker_name}
```

## Jobs / Async Queue
```text
POST /tasks/course-production/async
GET /jobs
GET /jobs/{job_id}
```

## Task Store / Query
```text
GET /tasks?limit=50&topic=&task_type=&status=
GET /tasks/{task_id}
GET /tasks/{task_id}/manifest
GET /tasks/{task_id}/manifest/validate
GET /tasks/{task_id}/artifacts
GET /tasks/{task_id}/artifacts/read?kind=&index=&max_chars=
GET /tasks/{task_id}/audits?kind=
```

## 文档理解
```text
POST /documents/outline
```
输入本地文档路径，返回轻量结构化大纲。

## PPT 草稿
```text
POST /ppt/draft
```
输入标题、受众、大纲、讲稿，输出 PPT 请求包、交接审计、Marp-compatible PPT 草稿。

## 视频计划
```text
POST /video/plan
```
输入标题、讲稿、可选幻灯片，输出视频讲稿、交接审计、结构化 video plan JSON。

## 动画计划
```text
POST /animation/plan
```
输入知识点、教学目标、旁白、风格，输出动画简报、交接审计、结构化 animation plan JSON。

## 本地化语言包
```text
POST /localization/package
```
输入 Markdown 源文本和目标语言，输出多语种讲稿 scaffold、SRT 字幕 scaffold、language_pack JSON。

## 课程包
```text
POST /tasks/course-pack
```
生成研究简报、课程大纲、逐页讲稿、交接审计、Marp 课件草稿、PDF、来源清单。

## 统一课程生产
```text
POST /tasks/course-production
```
串联 course-pack、PPT draft、video plan、animation plan、localization package，输出统一 manifest 和总交接审计，并写入 SQLite task store + JSONL index。

## 审计原则
文字交给下一级 worker 前先审计并记录。v0.1 默认 non-blocking，避免拖慢集成。

## 集成节奏
先保证各模块入口/协议/产物链打通，再慢慢调质量。
