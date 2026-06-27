# 成熟 Agent 候选仓库初审（2026-05-21）

## 本轮结论
成熟项目可以接，但不能直接变成主工程。应以 Adapter / 子进程 / Docker / 独立环境形式挂到 API Gateway 与 Claw Code 中控下面。

## 1. PPTAgent / DeepPresenter
- 仓库：`http[REDACTED_LOCAL_PATH]`
- 本地路径：`[REDACTED_LOCAL_PATH]`
- 许可证：MIT
- 语言：Python
- 项目定位：An Agentic Framework for Reflective PowerPoint Generation；DeepPresenter 已接受 ACL 2026。
- 优点：
  - PPT 生成能力强，带 reflective / 生成-渲染-审视机制。
  - 支持 PPTX export 和 offline mode。
  - 自带 `deeppresenter` 与 `pptagent` 两条线。
  - 适合作为建木 Agent Studio 的 PPT 主模块。
- 风险：
  - README 明确：Windows is not supported，Windows 建议用 WSL。
  - 依赖重：Docker、Playwright、Firecrawl、markitdown、pdf2image、python-pptx、fastmcp 等。
  - 推荐其微调模型 DeepPresenter-9B，若不用模型，效果需实测。
- 接入建议：
  - P1 研究，P2 以 WSL/Docker/独立环境方式接。
  - 不直接混入主 Python 环境。
  - 先封装为 `pptagent_adapter`：输入大纲/素材/风格，输出 pptx/pdf/审查报告。

## 2. PresentAgent-2
- 仓库：`http[REDACTED_LOCAL_PATH]`
- 本地路径：`[REDACTED_LOCAL_PATH]`
- 项目定位：query → research → multimodal materials → slides/scripts/narration → presentation video。
- 优点：
  - 与老板提出的“一体化视频流程”高度贴合。
  - 支持 query-to-video 和 url-to-video。
  - 有 Windows 安装说明。
  - 可作为视频主链路候选。
- 风险：
  - 依赖很重：torch、transformers、MegaTTS3、whisper、modelscope、ffmpeg、LibreOffice、TTS checkpoint。
  - 官方 Todo 仍有 local deployment guide 未完成。
  - 可能不适合 v0.1 直接内嵌，需要先跑通独立 demo。
- 接入建议：
  - P2 研究，P3 接入。
  - 作为独立 worker：输入 query/source.md，输出 pptx/mp4/json。
  - 建木主流程先产出 `source.md` 和课程结构，再交给它生成视频。

## 3. Code2Video
- 仓库：`http[REDACTED_LOCAL_PATH]`
- 本地路径：`[REDACTED_LOCAL_PATH]`
- 许可证：MIT
- 项目定位：以代码为中心的教学视频生成框架；Planner / Coder / Critic 三智能体，生成可执行 Manim 代码。
- 优点：
  - 与“教学动画片段增强”高度匹配。
  - 代码生成视频，清晰、可复现、适合公式/流程/图解。
  - 依赖虽多，但比 PresentAgent-2 的 TTS/大模型检查点链路更清晰。
- 风险：
  - 依赖 Manim 0.19.0、OpenGL/Cairo/Pango、moviepy、imageio-ffmpeg 等，Windows 下需要单独环境验证。
  - 需要 LLM API/VLM API/IconFinder API 才能跑完整三智能体链路。
  - 不适合作为整门课程视频主引擎，更适合作为“动画片段 worker”。
- 接入建议：
  - P2 接入。
  - 封装为 `code2video_adapter`：输入知识点/脚本片段，输出 Manim 脚本、渲染视频、诊断日志。
  - 不进主 Python 环境，单独 venv/worker。

## 4. DocAgent
- 仓库：`http[REDACTED_LOCAL_PATH]`
- 本地路径：`[REDACTED_LOCAL_PATH]`
- 许可证：Creative Commons Attribution-NonCommercial 4.0 International（非商业）
- 项目定位：Multi-Modal Long-Context Document Understanding，EMNLP 2025。
- 优点：
  - 与老板描述高度一致：结构化树形大纲、交互式阅读接口、reviewer agent、memory bank。
  - 适合做长文档理解/资料预处理/审查模块。
  - 依赖相对轻：pdfservices-sdk、openpyxl、pandas、PyMuPDF、openai、pillow。
- 风险：
  - 许可证是 CC BY-NC 4.0，非商业限制明显，不宜直接内嵌到未来商业/培训产品。
  - 预处理依赖 Adobe PDF Services Client ID/Secret。
  - 需要 OpenAI API key。
- 接入建议：
  - P1 研究学习，P2 参考思想自研轻量 Doc Adapter。
  - 不建议直接作为可分发内置模块，除非确认用途仅限内部非商业研究或另行取得许可。
  - 第一版可用 `PyMuPDF/markitdown + outline extractor + reviewer prompt` 复刻其关键思想。

## 当前优先策略
1. v0.1 主工程继续走轻量路线：FastAPI Gateway + JianmuAdapter + Markdown/Marp。
2. PPTAgent/DeepPresenter 不直接装进主环境，先作为候选 worker。
3. PresentAgent-2 也不直接装进主环境，先作为独立视频 worker。
4. Code2Video 和 DocAgent 继续确认。
5. 所有重型 Agent 都通过 API Gateway 注册为 Tool Adapter，保持主系统干净。


