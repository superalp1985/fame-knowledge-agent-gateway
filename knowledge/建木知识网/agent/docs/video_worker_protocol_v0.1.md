# Video Worker Protocol v0.1

## 目标
先统一视频 worker 输入/输出协议，不先调 PresentAgent-2 / TTS / ffmpeg 重依赖。

## 当前 API
```text
POST /video/plan
```

## 输入
`VideoPlanRequest`：
- title
- script_text
- slide_markdown
- audience
- duration_minutes
- target_worker

## 当前输出 artifacts
- `handoff_audit`：讲稿/幻灯片文字交给视频 worker 前的审计记录。
- `video_script`：视频讲稿。
- `video_plan`：结构化 JSON，包括 scenes、estimated_seconds、visual_hint、downstream。

## 当前实现
`src/adapters/video_worker.py` 中的 `VideoPlanWorker` 只生成 plan，不渲染视频。

## 替换路径
后续接 PresentAgent-2 / TTS / ffmpeg 时保持 API 不变：

```text
上游脚本/PPT → VideoPlanRequest → 前置审计 → Video worker → artifacts
```

## 下一步
1. 接 TTS worker。
2. 接 ffmpeg / moviepy。
3. 接 PresentAgent-2 dry-run。
4. 加视频素材清单和授权审计。
