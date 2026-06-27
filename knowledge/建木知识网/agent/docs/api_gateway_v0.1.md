# 建木 Agent Studio API Gateway v0.1

## 当前状态
已完成最小 API 闭环，并已接入 `route_index.json` 轻量检索：

```text
POST /tasks/course-pack
  → run_course_pack
  → JianmuAdapter 读取建木知识网
  → search_routes 从 route_index 召回主题相关知识
  → 生成研究简报 / 课程大纲 / 逐页讲稿 / Marp 课件草稿 / 来源清单
  → MarpAdapter 导出 PDF
  → 返回统一 artifacts
```

## 接口

### GET /health
返回网关状态和建木知识网资产盘点。

### POST /tasks/course-pack
请求示例：

```json
{
  "topic": "AI时代财务数字化转型",
  "audience": "高校财务干部",
  "duration_minutes": 90,
  "output_kinds": ["course_pack"],
  "allow_web": false,
  "style": "稳健、清晰、适合课堂讲授"
}
```

返回：

```json
{
  "task_id": "...",
  "status": "ok",
  "artifacts": [
    {"kind": "research", "path": ".../01_research_brief.md", "title": "研究简报"},
    {"kind": "outline", "path": ".../02_course_outline.md", "title": "课程大纲"},
    {"kind": "script", "path": ".../03_speaker_notes.md", "title": "逐页讲稿"},
    {"kind": "slides_md", "path": ".../04_slides.md", "title": "Marp课件草稿"},
    {"kind": "slides_pdf", "path": ".../04_slides.pdf", "title": "Marp课件PDF"},
    {"kind": "sources", "path": ".../09_sources.md", "title": "来源清单"}
  ],
  "message": "course pack generated"
}
```

## 运行烟测

```powershell
cd [REDACTED_LOCAL_PATH]
python scripts\smoke_api.py
```

## 已修问题
- Windows 下 `subprocess` 找不到 `npx`：已改为自动查找 `npx.cmd` / `npx`。
- 中文路径硬编码污染：源码不再硬编码 `[REDACTED_LOCAL_PATH]`，改用 `Path(__file__).resolve()` 反推项目根。
- 测试脚本中文被终端编码污染：改用 Unicode 转义写入脚本，生成产物中文正常。

## 下一步
1. 优化 `route_index.json` 检索：加入 subject/domain 过滤、负关键词、去重和课程资产优先级。
2. 给 `/tasks/course-pack` 增加任务状态和异步队列。
3. 接 Web Research Adapter。
4. 接 PPTAgent/DeepPresenter worker。
