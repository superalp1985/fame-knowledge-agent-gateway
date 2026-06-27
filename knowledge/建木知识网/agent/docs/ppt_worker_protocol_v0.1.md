# PPT Worker Protocol v0.1

## 目标
先统一 PPT worker 的输入/输出协议，不先陷入 PPTAgent/DeepPresenter 的重依赖调试。

## 当前 API
```text
POST /ppt/draft
```

## 输入
`PptDraftRequest`：
- title
- audience
- outline_markdown
- speaker_notes
- style
- target_worker

## 当前输出 artifacts
- `ppt_request`：请求包，保存输入大纲和讲稿。
- `handoff_audit`：交接审计记录，发生在文字交给 PPT worker 前。
- `ppt_draft_md`：Marp-compatible PPT 草稿。

## 当前实现
`src/adapters/ppt_worker.py` 中的 `PptDraftWorker` 是协议优先的占位 worker。

## 替换路径
后续接 PPTAgent / DeepPresenter 时保持 API 不变：

```text
上游 pipeline → PptDraftRequest → 前置审计 → PPT worker → artifacts
```

只替换 worker 内部实现，不改 Claw Code 中控和 API Gateway。

## 下一步
1. 增加 PPTX artifact 类型。
2. 接 `pptxgenjs` 或 PPTAgent dry-run。
3. 增加模板参数。
4. 增加页级审计。
