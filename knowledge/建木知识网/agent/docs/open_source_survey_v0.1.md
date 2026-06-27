# 建木 Agent Studio 开源项目调研与接入顺序（v0.1）

## 调研方式
- GitHub 页面通过 web_fetch 多数失败，改用 npm / pip 包信息做可用性确认。
- 当前本机已有：Node、npm、npx、Python、pip、git。
- 当前本机缺：ffmpeg、marp CLI、pandoc。
- pip 已有：FastAPI 0.131.0、edge-tts 7.2.8。

## 已确认包信息
| 模块 | 项目 | 当前可用版本/最新 | 许可证 | 结论 |
|---|---|---:|---|---|
| PPT Markdown 转换 | `@marp-team/marp-cli` | 4.4.0 | MIT | v0.1 首选 |
| PPTX 生成 | `pptxgenjs` | 4.0.1 | MIT | v0.2 模板化首选 |
| 图表/流程图 | `@mermaid-js/mermaid-cli` | 11.15.0 | MIT | v0.1 可接，注意 Chromium 依赖 |
| API 网关 | `fastapi` | 已装 0.131.0 / 最新 0.136.1 | MIT | v0.1 首选 |
| TTS | `edge-tts` | 已装 7.2.8 | LGPL/MPL? 需后续复核 | v0.3 首选起步 |
| 网页正文抽取 | `trafilatura` | 最新 2.0.0 | GPLv3? 需注意许可证 | 可用但许可证需谨慎 |

## 接入优先级
### P0：立刻接入
1. **FastAPI**：作为本地 API Gateway 原型。
2. **建木知识网 Adapter**：读取 entries/rules/associations/route_index/docs。
3. **Markdown 输出协议**：研究简报、课程大纲、讲稿、课件草稿。

### P1：第一批下载/安装
1. **Marp CLI**：Markdown → PPT/PDF。
2. **PptxGenJS**：后续正式 PPTX 模板。
3. **Mermaid CLI**：架构图/流程图渲染。

### P2：第二批
1. **ffmpeg**：视频合成基础设施。
2. **edge-tts**：TTS 起步。
3. **MoviePy**：Python 视频编排，依赖 ffmpeg。

### P3：后置评估
1. **Tauri**：v0.2 UI 外壳。
2. **Rust/Axum 网关**：如 FastAPI 原型稳定后再考虑迁移。
3. **Firecrawl/Crawl4AI/SearXNG**：如果 OpenClaw web_fetch/browser 不够，再引入。
4. **LangGraph/AutoGen/CrewAI**：暂不接，避免增加框架复杂度。

## 推荐第一版技术路线
```text
CLI/文件流水线
  ↓
FastAPI Gateway
  ↓
Claw Code 中控
  ↓
建木知识网 Adapter + Web Fetch Adapter
  ↓
Markdown 课程包
  ↓
Marp / PptxGenJS 导出课件
```

## 下载前注意事项
- 不全局污染系统环境，优先放在 `[REDACTED_LOCAL_PATH]` 或项目局部依赖中。
- Node 依赖用 `package.json` 锁版本。
- Python 依赖用 `requirements.txt` 锁版本。
- ffmpeg 优先便携版，放入 agent runtime。
- Tauri 后置，等 CLI 流水线跑通再上 UI。

## 成熟 Agent 模块判断
- DocAgent / DeepPresenter / PresentAgent-2 / Code2Video 都可纳入接入清单。
- 统一原则：模块化接入，不让单个项目吞掉整个架构。
- 选型标准：接入简单、稳定、可移植、易维护、输出质量高。
