# 候选索引

本目录保存从成熟数据源样本衍生出的候选索引。

候选索引不是核心知识：

- 不自动写入 `content_units.jsonl`。
- 不自动写入 `graph.seed.json`。
- 不作为事实来源直接使用。
- 只用于提示下一批人工审核、来源核验和知识单元补充方向。

## 当前文件

| 文件 | 生成命令 | 用途 |
| --- | --- | --- |
| `openalex_topic_candidates.json` | `npm run build:chinese-open:openalex-candidates` | 从 OpenAlex topic 样本生成学科候选主题和来源发现路线 |

## 晋升条件

候选主题晋升为 content unit 前必须满足：

1. 找到更权威或更贴近主题的来源。
2. 写成自有摘要。
3. 绑定 subject、route_refs、validation_refs。
4. 确认许可证和 attribution。
5. 通过 `npm run check:chinese-open`。

## 质量标记

`openalex_topic_candidates.json` 会去掉重复 topic，并对明显离题候选写入 `scope_flags`。带有 `scope_flags` 的候选只能作为发现信号，不进入优先审核队列。
