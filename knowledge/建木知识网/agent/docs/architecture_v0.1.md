# 建木 Agent Studio 总架构图（v0.1）

```mermaid
flowchart TD
    U[用户] --> UI[Tauri 单窗口 UI<br/>Rust + WebView2]
    UI --> GW[API Gateway<br/>统一入口 / 集中治理]

    GW --> AUTH[权限 / 配置 / 审计 / 日志]
    GW --> TASK[任务队列 / 状态管理 / 产物管理]
    GW --> CTRL[Claw Code 中控 Agent]

    CTRL --> PLAN[任务规划器<br/>研究 / 备课 / 课件 / 视频]
    CTRL --> JIANMU[建木知识网 Adapter<br/>优先知识源]
    CTRL --> WEB[Web Research Adapter<br/>联网搜索 / 网页抽取]
    CTRL --> PPT[PPT Adapter<br/>Marp / PptxGenJS]
    CTRL --> CHART[图表 Adapter<br/>Mermaid / ECharts]
    CTRL --> TTS[TTS Adapter<br/>edge-tts / 后续念起AI]
    CTRL --> VIDEO[Video Adapter<br/>ffmpeg / MoviePy]
    CTRL --> MODEL[AI Model Adapter<br/>本地/远程模型统一封装]

    JIANMU --> K1[(entries)]
    JIANMU --> K2[(rules)]
    JIANMU --> K3[(associations)]
    JIANMU --> K4[(route_index)]
    JIANMU --> K5[(reports/docs)]

    WEB --> SRC[外部来源<br/>URL / 时间 / 可信度]

    PLAN --> OUT[统一成果包]
    JIANMU --> OUT
    WEB --> OUT
    PPT --> OUT
    CHART --> OUT
    TTS --> OUT
    VIDEO --> OUT

    OUT --> A1[研究简报.md]
    OUT --> A2[课程大纲.md]
    OUT --> A3[逐页讲稿.md]
    OUT --> A4[课件.md/.pptx/.pdf]
    OUT --> A5[视频脚本.md/.srt]
    OUT --> A6[成片.mp4]
    OUT --> A7[来源清单.md]

    subgraph Sandbox[内置运行环境 / 沙盒]
      CTRL
      PLAN
      JIANMU
      WEB
      PPT
      CHART
      TTS
      VIDEO
      MODEL
    end
```

## 核心原则
1. 用户只面对 Tauri 单窗口。
2. API Gateway 是唯一入口，负责集中治理。
3. Claw Code 是中控，负责调度工具和整合成果。
4. 建木知识网是第一知识源。
5. Web 搜索只做补充证据，默认不入库。
6. 开源项目只做工具层，不做主脑。
7. 环境随应用一起封装，目标是装到哪台电脑都能用。
