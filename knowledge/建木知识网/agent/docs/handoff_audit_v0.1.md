# Handoff Audit v0.1

## 老板确认原则
审计环节不能等成品出来才做；Claw Code / 中控 Agent 把文字交给下一级工作模块时，审计就要开始。

## 当前落地
- 新增 `src/adapters/audit_adapter.py`。
- `run_course_pack()` 在把 `slides_text` 交给 `MarpAdapter` 前先执行 `HandoffAudit.audit_text()`。
- 每次课程包生成 `00_handoff_audit.json`，作为下游交接审计记录。
- 当前策略：**记录/告警，不阻断**，优先保证各模块快速集成。

## v0.1 检查项
- 空文本：error。
- 编码污染字符 `�`：error。
- 疑似 secret/password/token/API key：warning。
- 涉及建木知识网但没有外部搜索边界声明：info。

## 后续升级
1. 对每个 worker 都建立交接审计：Doc、PPT、Video、Code2Video、TTS。
2. 按 worker 定制规则：
   - PPT：页数、标题层级、来源边界、敏感信息。
   - Video：讲稿长度、TTS 风格、不可传播内容。
   - Code2Video：代码安全、执行沙盒、外部素材授权。
   - Web：来源可信度、入库边界、冲突提示。
3. 从 non-blocking 逐步升级为 selectable gates：高风险阻断，低风险只记录。
