# C-Eval C12b 术语在线正式补厚报告（2026-05-21）

## 修正

C12 初版 API 字段路径解析错误；已修正为 `result.searchResult[0].result.tmWordList`，并降低查询频率。

## 产物

- Results CSV：`[REDACTED_LOCAL_PATH]`
- Cards with TermOnline：`[REDACTED_LOCAL_PATH]`

## 统计

- queried terms: 60
- hit terms: 41
- attached cards: 45
- status ok: 41
- status err: 19

### hits by group
- medicine: 5
- engineering: 7
- computer: 12
- politics_history: 16
- legal_exam: 1

## 判断

术语在线 API 已可用，适合作为 national_terminology_database 补充 definition / English alias / source。后续应小批量、限速查询，避免 429。