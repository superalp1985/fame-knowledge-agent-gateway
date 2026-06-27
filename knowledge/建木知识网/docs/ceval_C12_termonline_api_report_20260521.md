# C-Eval C12 术语在线 API 概念补厚报告（2026-05-21）

## 来源

- 术语在线 TermOnline：全国科学技术名词审定委员会权威术语库。
- 通过页面资源发现 API：`/main-serve/business/tm/tmWord/allSearch`。

## 产物

- API results CSV：`[REDACTED_LOCAL_PATH]`
- Cards with termonline：`[REDACTED_LOCAL_PATH]`
- Sidecar v5：`[REDACTED_LOCAL_PATH]`

## 统计

- queried terms: 120
- cards attached: 0
- status ok: 31
- status err: 89

### hits by group

## 判断

- 术语在线可作为稳定的概念定义/英文别名/学科来源补强源。
- 本轮不覆盖原定义，只追加 definition_candidates_from_termonline 和 english_aliases_from_termonline。
- 下一步 C13 可结合 C11 错题任务，优先用术语在线命中的定义改进 option semantic alignment。