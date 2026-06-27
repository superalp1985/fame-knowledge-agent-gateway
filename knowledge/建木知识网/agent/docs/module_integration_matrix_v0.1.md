# 建木 Agent 模块接入清单（v0.1）

| 模块 | 作用 | 接入优先级 | 备注 |
|---|---|---:|---|
| DocAgent | 长文档理解、结构化大纲、审查 | P1 | 适合作为输入层 |
| DeepPresenter / PPTAgent | 幻灯片生成 | P1 | PPT 主模块首选 |
| PresentAgent-2 | 文档到讲解视频全流程 | P1 | 视频主链路候选 |
| Code2Video | 教学动画、可执行代码视频 | P2 | 适合增强片段 |
| edge-tts | TTS 起步 | P2 | 先满足可用性 |
| ffmpeg | 媒体合成基础设施 | P2 | 视频链路底座 |

## 统一判断
- 这些项目都可以接。
- 但它们是后台模块，不是主脑。
- 主脑仍然是：Claw Code + API Gateway + 建木知识网。
