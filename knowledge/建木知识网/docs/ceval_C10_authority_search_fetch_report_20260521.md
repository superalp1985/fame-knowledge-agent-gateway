# C-Eval C10 批量执行正文级 authority search jobs（2026-05-21）

## 范围

- 从 C9 search jobs 中按 group 各取高优先级任务执行搜索/抓取。
- 本轮作为 C10 第一批，不追求全量 1942 条跑完，先验证管线。

## 产物

- Fetch results：`[REDACTED_LOCAL_PATH]`
- Authority snippets：`[REDACTED_LOCAL_PATH]`
- Raw fetched dir：`[REDACTED_LOCAL_PATH]`

## 统计

- jobs selected: 60
- fetch records: 162
- snippets: 31
- fetch err: 54
- fetch ok: 108

### snippets by group
- engineering: 9
- computer: 20
- politics_history: 2

## 判断

- C10 第一批把“搜索任务 → 搜索结果 → 原始抓取 → snippets”管线跑通。
- 后续可扩大 selected 数量，或把论文库 skill 接入医学/计算机/工程补权威解释。