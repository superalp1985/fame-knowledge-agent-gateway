# DocAdapterLite v0.1

## 定位
自研轻量文档理解入口，先替代重型/非商业限制 DocAgent 的最小可用切片。

## 为什么自研
`lisun-ai/DocAgent` 的思路很适合建木：树形大纲、交互式阅读、reviewer、memory bank。但其许可证是 CC BY-NC 4.0，不适合直接作为未来可分发产品内置模块。因此 v0.1 先做内部轻量版。

## 当前能力
- 文件类型：`.md` / `.txt` / `.csv` / `.json` / `.pdf`
- PDF 依赖：PyMuPDF，如未安装会返回 warning。
- 输出：`DocumentOutline`
  - path
  - title
  - chars
  - warnings
  - blocks: level / title / text

## API
```text
POST /documents/outline
```

请求：
```json
{
  "path": "[REDACTED_LOCAL_PATH]",
  "max_blocks": 80
}
```

## 下一步
1. 加 chunk id 和 hash。
2. 加 reviewer 输入格式。
3. 加引用页码/行号。
4. 接入课程包 pipeline：从文档 outline 生成课程素材。
5. 做多文档合并 outline。
