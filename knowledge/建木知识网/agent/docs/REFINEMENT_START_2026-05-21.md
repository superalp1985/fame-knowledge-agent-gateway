# 建木 Agent Studio 精修开工记录

时间：2026-05-21 23:00 Asia/Shanghai

## 当前基线

建木 Agent Studio 已具备 v0.1 可用闭环：

- UI 聊天自然语言入口
- API Gateway
- 建木知识网优先检索
- 联网补充资料
- 统一 openai-compatible 云端 AI 算力池
- 本地 fallback worker
- 多模态产物输出
- 成果包/Manifest/下载/预览

## 已接入能力

- 课程包：研究简报、课程大纲、讲稿、slides markdown、来源清单
- PPT：本地 PPTX fallback + 云端 presentation request
- 图片：本地 PNG/SVG fallback + 云端 image request
- 视频：storyboard、script、preview/final MP4、本地 ffmpeg/imageio path + 云端 video request
- 音乐：MusicGen-ready fallback + WeaveMuse 创作编排 + 云端 music request
- TTS：Edge TTS + 云端 tts request
- 动画：HTML 原型、Manim 脚本、本地轻量 MP4 preview + 云端 animation request
- 文档：DocAdapterLite + 云端 document task
- 本地多模态文件：按路径读取 image/audio/video/pdf/text/office 元数据并调度云端分析
- 外部重 worker：PresentAgent-2 / Code2Video 通过 sandbox request envelope 接入，不嵌入 Gateway 主进程

## 精修总目标

把 Studio 从“能用工具集合”打磨成“极限精品工作台”：

一句自然语言任务，自动完成：

1. 输入理解
2. 建木知识检索
3. 联网补充与来源记录
4. 文字成果生成
5. PPT/图片/TTS/音乐/视频/动画多模态生产
6. 统一成果包
7. 质量诊断
8. 下一步建议

## 第一轮精修重点

### P0：Pipeline 编排器

目标：聊天窗口支持一条自然语言触发完整 pipeline，而不是只调单个模块。

计划能力：

- 识别“做一套/形成成果/完整材料/从文件生成”等复合任务
- 支持本地路径作为输入
- 自动决定是否联网补充
- 调用 CourseProductionRouter 或新版 StudioPipeline
- 输出统一 task_id、成果清单和下载入口

### P1：质量闭环

每次任务结束生成：

- quality_report.md
- artifact_inventory.json
- source_trace.md
- next_actions.md
- failure_notes.md（如有）

### P2：UI 体验

- 聊天回复展示 route/action/task_id/artifact count
- 对可下载成果包给醒目链接
- 对 cloud/local fallback 状态给清晰说明

### P3：稳定性

- 错误不吞掉
- 云端失败不影响本地 fallback
- 大文件不直接塞主进程，走 metadata/path/sandbox
- API Key 不回显、不写入记忆

## 当前已知边界

- 云端模型已经接入，但不同供应商的原生图片/音频/视频 API 仍需专属适配才能满血。
- 大视频深度理解应走 sandbox/cloud worker，不应直接在 Gateway 主进程处理。
- lisun-ai-DocAgent 仅 reference only，不内置。
- PresentAgent-2 / Code2Video 已有 sandbox envelope，但还未真正启动其重依赖 runtime。

## 下一步动作

立即开始 P0：实现 StudioPipeline / natural language composite route，让聊天中的“做一套完整成果”稳定进入多模块流水线。
