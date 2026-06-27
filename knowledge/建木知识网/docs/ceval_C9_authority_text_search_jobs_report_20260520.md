# C-Eval C9 正文级权威来源搜索任务表（2026-05-20）

## 背景

入口页解析收益很低，很多官方站点是导航页或动态站点。因此改为正文级搜索任务：围绕高频卡片，直接找课程标准、考试大纲、法律法规原文、国家/行业标准或权威教材。

## 产物

- 搜索任务 CSV：`[REDACTED_LOCAL_PATH]`
- Top jobs JSON：`[REDACTED_LOCAL_PATH]`

## 统计

- total search jobs: 1942
- engineering: 360 jobs
- computer: 360 jobs
- medicine: 270 jobs
- politics_history: 720 jobs
- legal_exam: 232 jobs

## 用法

- 按 priority 从高到低抓取。
- 命中官方/权威正文后，切片为 authority_snippets。
- 再灌入 card 的 definition/scope_boundary/regularity/exception。