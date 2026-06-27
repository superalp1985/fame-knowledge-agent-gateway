# Web Search & API Keys v0.1

## 目标
把外部 Web 能力从“用户提供 URL 后抓取”升级为“主动搜索引擎式 Web Search”，并在 UI 设置页补齐 API key / provider / base URL 配置。

## 后端新增/修改

### WebResearchAdapter
```text
src/adapters/web_adapter.py
```

新增：
- `search(query, limit, provider)`
- `search_and_fetch(query, limit, max_chars, provider)`
- `WebSearchResult`

默认 provider：
```text
duckduckgo_html
```

优点：免 key，可用于 v0.1 本地测试。

### API
```text
POST /web/search
POST /web/search-fetch
POST /web/fetch
```

### AgentTask Schema
```text
allow_web: bool
web_urls: list[str]
web_search_query: str
web_search_limit: int
```

`course-pack/course-production` 中：
- `allow_web=true` 时可主动搜索。
- 若提供 `web_urls`，继续按 URL 抓取。
- Web 结果只进入本次任务临时证据和来源清单，不写入建木知识网。

## 设置项
```text
clawbot_api_url
search_provider
search_api_key
llm_base_url
llm_api_key
tts_api_key
ppt_worker_api_key
video_worker_api_key
```

UI 设置页已增加对应输入框，其中 key 字段使用 password [REDACTED]

## UI 新增
首页新增：
```text
Web Search
```

能力：
- 输入关键词
- 设置搜索结果数量
- 主动搜索
- 展示标题 / URL / 摘要
- 对单条结果执行抓取

## 测试结果
```text
SETTINGS_KEYS_OK 200
WEB_SEARCH 200 2
WEB_UI_OK 200
healthcheck_studio.py OK
```

## 边界
- DuckDuckGo HTML 是免 key 的轻量方案，可能受网络/反爬影响。
- 其它搜索 API 暂未接入，但设置页已预留 `search_api_key`。
- 外部 Web 仍是临时证据源，不直接污染建木知识网。
