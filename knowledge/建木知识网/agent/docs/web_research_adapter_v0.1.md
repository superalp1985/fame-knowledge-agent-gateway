# Web Research Adapter v0.1

## 定位
Web Research Adapter 是外部证据源适配器，只提供临时引用，不直接写入建木知识网。

## 当前能力
- `fetch_url(url)`：抓取 URL，抽取 title 和简单正文。
- `fetch_many(urls)`：批量抓取 URL。
- `AgentTask.web_urls`：任务可携带外部 URL。
- `allow_web=True` 且提供 `web_urls` 时，课程包会生成 `00_web_research.md` 并在研究简报/来源清单中标注外部来源。

## 限制
- v0.1 只支持 URL 抓取，不做搜索引擎查询。
- 对 JS-heavy 网站抽取能力有限。
- 外部内容不入库，只做临时证据。

## 后续增强
1. 接 OpenClaw `web_fetch` / browser fallback。
2. 接 Tavily / SearXNG / Bing / Serper 作为搜索层。
3. 加来源可信度评分。
4. 加与建木知识网冲突检测。
5. 加“建议入库”草案，但必须人工确认。
