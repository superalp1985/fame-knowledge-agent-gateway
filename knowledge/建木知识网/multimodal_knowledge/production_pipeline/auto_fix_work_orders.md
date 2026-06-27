# 自动修正工作单

自动修正不能只说“优化一下”，必须生成可执行工作单。

## 1. 工作单字段

- ticket_id：修正单编号。
- artifact_path：目标文件。
- issue_type：问题类型。
- severity：严重等级。
- evidence：证据。
- fix_strategy：修正策略。
- patch_steps：具体步骤。
- requires_rerender：是否需要重新渲染。
- requires_recheck：是否需要复审。
- retry_count / max_retries：重试控制。

## 2. PPT 修正单示例

问题：文字溢出。

修正步骤：

1. 找到溢出文本框。
2. 判断是否可缩短文本。
3. 优先把长句转为关键词。
4. 如果仍溢出，拆成两页。
5. 重新导出截图。
6. 再跑 Vision 审查。

## 3. 视频修正单示例

问题：字幕遮挡主体。

修正步骤：

1. 定位字幕 bbox 与主体 bbox 重叠区域。
2. 移动到安全区。
3. 如果字幕过长，按语义切短。
4. 加半透明底板提高可读性。
5. 重新渲染 scene。
6. 复查关键帧。

## 4. 音频修正单示例

问题：BGM 压旁白。

修正步骤：

1. 降低 BGM 总音量。
2. 在旁白段启用 ducking。
3. 削减与人声冲突频段。
4. 删除高频打击或强 lead。
5. 重新导出音频。
6. 复查 intelligibility。
