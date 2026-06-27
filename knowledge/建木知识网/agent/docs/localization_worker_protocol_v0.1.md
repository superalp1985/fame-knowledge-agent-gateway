# Localization Worker Protocol v0.1

## 目标
为多语种 PPT 讲稿、视频字幕、语言包建立统一协议。

## 当前 API
```text
POST /localization/package
```

## 输入
`LocalizationRequest`：
- title
- source_language
- target_languages
- text_markdown
- output_kinds
- target_worker

## 当前输出 artifacts
- `handoff_audit`：源文本交给本地化 worker 前的审计记录。
- `localization_source`：本地化源文本。
- `localized_speaker_notes`：各语言讲稿。
- `subtitles_srt`：各语言字幕。
- `language_pack`：语言包 JSON。

## 当前实现
`src/adapters/localization_worker.py` 中的 `LocalizationWorker` 是协议优先占位实现。

v0.1 不假装真实翻译，只生成 scaffold：
```text
<!-- TODO translate to en-US -->
原文
```

## Claw Code / Agent Skills 位置
后续真实翻译由以下层替换：
- Claw Code 跨语言翻译
- Agent Skills 自动化语言包生成
- Model Adapter 调用翻译模型
- 术语表/风格表/字幕长度约束

## 下一步
1. 加术语表 glossary。
2. 加字幕长度和断句规则。
3. 加 language pack diff。
4. 接真实 LLM 翻译。
5. 接 PPT / video pipeline 自动输出多语种版本。
