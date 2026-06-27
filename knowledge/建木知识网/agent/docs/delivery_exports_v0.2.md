# Delivery Exports v0.2

## 本轮目标
把复杂任务从 plan-only 推进到可交付文件包：

- PPT 草稿 Markdown -> `.pptx`
- 视频计划/讲稿 -> 可打开的分镜 HTML + 后续渲染脚本

## PPTX 导出

新增：

```text
scripts/md_to_pptx.mjs
```

使用 `pptxgenjs` 将 Marp/Markdown 草稿转换成宽屏 PPTX。

`PptDraftWorker` 新增产物：

```text
ppt_draft_pptx
```

如果导出失败，会写入：

```text
pptx_export_error
```

## 视频分镜与渲染脚本

`VideoPlanWorker` 新增产物：

```text
video_storyboard_html
video_render_script
```

当前 `video_render_script` 是占位脚本，用于后续接入：

- PresentAgent-2
- TTS
- ffmpeg

## 预览分类

`ArtifactPreviewService` 已支持：

- `.pptx/.docx/.xlsx` -> `office`
- `.html/.htm/.ps1` -> text/readable

## 测试

```text
PPT ok ['ppt_request', 'handoff_audit', 'ppt_draft_md', 'ppt_draft_pptx']
VIDEO ok ['handoff_audit', 'video_script', 'video_plan', 'video_storyboard_html', 'video_render_script']
HTTP_RESULT 20260521_191321_3571a3e4 ok 26
HAS_PPTX True
HAS_STORYBOARD True
HAS_RENDER_SCRIPT True
manifest/validate True
contracts/validate True
healthcheck_studio.py OK
```

## 边界

当前已能产出真实 `.pptx`。视频侧已产出分镜 HTML 与渲染脚本，但 `.mp4` 仍依赖后续接入 TTS/PresentAgent-2/ffmpeg。
