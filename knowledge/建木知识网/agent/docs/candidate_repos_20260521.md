# 建木 Agent Studio 成熟 Agent 仓库候选（2026-05-21）

## 检索结论
已通过 GitHub 页面搜索确认以下候选仓库。它们全部只作为后台模块接入，不替代主脑。

| 模块 | 候选仓库 | 星标/状态 | 初步判断 |
|---|---|---:|---|
| PPT 生成 | `icip-cas/PPTAgent` | 约 4414 stars，Python，22小时前更新 | PPT 模块第一候选；描述为 reflective PowerPoint generation |
| 视频主链路 | `AIGeeksGroup/PresentAgent-2` | 约 13 stars，Python，7天前更新 | PresentAgent-2 官方/主候选；需检查成熟度和依赖 |
| 动画视频 | `showlab/Code2Video` | 约 1759 stars，Python，19天前更新 | Code2Video 主候选；适合动画教学片段 |
| 文档理解 | `lisun-ai/DocAgent` | 约 16 stars，Python | 与用户描述更接近；需检查论文/功能是否匹配 |
| 文档/代码文档 | `facebookresearch/DocAgent` | 约 439 stars，Python | 同名但偏代码文档生成，暂不作为建木长文档理解首选 |

## 当前动作
候选仓库正在浅克隆到：

```text
[REDACTED_LOCAL_PATH]
```

## 下一步检查项
1. README：功能是否匹配。
2. LICENSE：能否商用/内嵌。
3. requirements / package：依赖重量。
4. 是否需要 Docker / GPU / 外部 API。
5. 输入输出接口是否容易包装成 Adapter。
6. 是否适合随 Tauri 应用封装。

## 当前排序
1. `icip-cas/PPTAgent`：优先研究。
2. `showlab/Code2Video`：第二优先。
3. `AIGeeksGroup/PresentAgent-2`：检查是否过重。
4. `lisun-ai/DocAgent`：检查是否真是长文档理解链路。
