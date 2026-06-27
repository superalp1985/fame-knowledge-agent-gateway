# C-Eval C8 Authority Snippets 接入报告（2026-05-20）

## 目标

把 C7 source packs 解析为 authority snippets，并谨慎挂回 authority-ready cards。

## 产物

- Authority snippets：`[REDACTED_LOCAL_PATH]`
- Cards with snippets：`[REDACTED_LOCAL_PATH]`
- Sidecar v4：`[REDACTED_LOCAL_PATH]`
- Summary CSV：`[REDACTED_LOCAL_PATH]`

## 统计

- source packs: 5
- snippets extracted: 3
- cards processed: 971
- cards with attached snippets: 1

## 说明

- 本轮只把能从官方/权威入口稳定抽到的文本做 snippets。
- 对动态站点/入口页/抓不到正文的来源，不硬编内容，只保留 source pointer。
- snippets 作为候选 evidence，不覆盖原 definition/regularity；后续人工或更强解析器可再提升为正式定义。
- computer: snippets=0, cards_with_snippets=0/180
- engineering: snippets=1, cards_with_snippets=1/180
- legal_exam: snippets=1, cards_with_snippets=0/116
- medicine: snippets=1, cards_with_snippets=0/135
- politics_history: snippets=0, cards_with_snippets=0/360