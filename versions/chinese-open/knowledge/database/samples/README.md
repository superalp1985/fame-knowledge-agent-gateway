# 数据源小样本

本目录由 `npm run sample:chinese-open:data-sources` 生成。

样本只用于评估成熟数据源的可达性、字段结构、许可证提示和导入候选质量：

- 不下载全量 dump。
- 不导入论文全文、网页正文、问答正文或源码。
- 不修改核心图谱。
- 失败记录也保留，用于评估接口可达性、超时、404 和命中率。

## 文件

| 文件 | 来源 | 用途 |
| --- | --- | --- |
| `manifest.json` | 本地生成 | 记录生成时间、策略、来源、样本数量和输出文件 |
| `wikidata.sample.jsonl` | Wikidata API | 通用实体和多语言别名候选 |
| `openalex.sample.jsonl` | OpenAlex API | 学术主题和来源发现候选 |
| `opencitations.sample.jsonl` | OpenCitations API | 引用计数候选；404 代表样本 DOI 暂未命中 |

## 配置

采样命令支持环境变量：

- `FAME_SAMPLE_SOURCES`：逗号分隔的数据源，默认 `wikidata,openalex,opencitations`。
- `FAME_SAMPLE_TIMEOUT_MS`：单次请求超时，默认 `8000`。
- `FAME_SAMPLE_PER_PAGE`：每个查询最多取多少条，默认 `3`。

## 晋升规则

样本不得直接晋升核心知识网。只有满足以下条件后，才可以把自写摘要或索引引用写入 `content_units.jsonl`：

1. 许可证和 attribution 已确认。
2. 字段 schema 已固定。
3. 样本命中率可接受。
4. 与 subject、route 和 validation_refs 已映射。
5. 不含隐私或版权复杂正文。
