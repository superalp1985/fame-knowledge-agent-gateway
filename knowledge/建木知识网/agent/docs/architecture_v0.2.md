# 建木 Agent Studio 总架构图（v0.2）

```mermaid
flowchart TD
    U[用户] --> UI[Tauri 单窗口 UI<br/>Rust + WebView2]
    UI --> GW[API Gateway<br/>统一入口 / 集中治理]

    GW --> AUTH[权限 / 配置 / 审计 / 日志]
    GW --> TASK[任务队列 / 状态管理 / 产物管理]
    GW --> CTRL[Claw Code 中控 Agent]

    CTRL --> PLAN[任务规划器<br/>研究 / 备课 / 课件 / 视频]
    CTRL --> JIANMU[建木知识网 Adapter<br/>第一知识源]
    CTRL --> WEB[Web Research Adapter<br/>联网搜索 / 网页抽取]
    CTRL --> DOC[DocAgent<br/>长文档理解 / 大纲 / 审查]
    CTRL --> PPT[DeepPresenter / PPTAgent<br/>幻灯片生成]
    CTRL --> VIDEO1[PresentAgent-2<br/>研究→素材→讲解视频]
    CTRL --> VIDEO2[Code2Video<br/>动画教学片段]
    CTRL --> TTS[TTS Adapter<br/>edge-tts / 后续念起AI]
    CTRL --> CHART[图表 Adapter<br/>Mermaid / ECharts]
    CTRL --> MODEL[AI Model Adapter<br/>本地/远程模型统一封装]
    CTRL --> RENDER[Media Render Layer<br/>ffmpeg / MoviePy]

    JIANMU --> K1[(entries)]
    JIANMU --> K2[(rules)]
    JIANMU --> K3[(associations)]
    JIANMU --> K4[(route_index)]
    JIANMU --> K5[(reports/docs)]

    WEB --> SRC[外部来源
URL / 时间 / 可信度]
    DOC --> OUT1[结构化大纲 / 审查意见]
    PPT --> OUT2[PPT / PDF]
    VIDEO1 --> OUT3[讲解视频主链路]
    VIDEO2 --> OUT4[动画增强片段]
    TTS --> OUT5[配音 / 字幕]
    RENDER --> OUT6[成片 / 合成产物]
    PLAN --> OUT[统一成果包]
    JIANMU --> OUT
    WEB --> OUT
    DOC --> OUT
    PPT --> OUT
    VIDEO1 --> OUT
    VIDEO2 --> OUT
    TTS --> OUT
    CHART --> OUT
    RENDER --> OUT

    OUT --> A1[研究简报.md]
    OUT --> A2[课程大纲.md]
    OUT --> A3[逐页讲稿.md]
    OUT --> A4[课件.md/.pptx/.pdf]
    OUT --> A5[视频脚本.md/.srt]
    OUT --> A6[成片.mp4]
    OUT --> A7[来源清单.md]
    OUT --> A8[知识回写建议.md]

    subgraph Sandbox[内置运行环境 / 沙盒]
      CTRL
      PLAN
      JIANMU
      WEB
      DOC
      PPT
      VIDEO1
      VIDEO2
      TTS
      CHART
      MODEL
      RENDER
    end
```

## 核心原则
1. 用户只面对 Tauri 单窗口。
2. API Gateway 是唯一入口，负责集中治理。
3. Claw Code 是中控，负责调度工具和整合成果。
4. 建木知识网是第一知识源。
5. Web 搜索只做补充证据，默认不入库。
6. DocAgent / DeepPresenter / PresentAgent-2 / Code2Video 都是后台模块，不是主脑。
7. 环境随应用一起封装，目标是装到哪台电脑都能用。
8. 视频主链路优先 PresentAgent-2，动画增强交给 Code2Video。
