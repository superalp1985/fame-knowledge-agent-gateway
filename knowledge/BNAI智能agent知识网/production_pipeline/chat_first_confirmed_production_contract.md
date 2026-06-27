# Chat-first 到 Confirmed Full Path 生产契约

## 目的

用户提出成品任务时，Jianmu Studio 先让模型参与需求探索，再由用户确认任务书，最后重新进入完整生产链路。这个流程用于同时保留模型建议能力和正式生产稳定性。

## 三段式流程

1. Chat-first requirement discovery
   - 允许调用 fast chat 模型。
   - 只做需求澄清、创意建议和任务书草案。
   - 不生成最终成果，不写 final，不执行 worker。

2. User confirmation
   - 将探索结果整理为 confirmed task spec。
   - 用户必须明确确认执行。
   - 用户可以修改交付物、受众、风格、范围、时长、页数、素材边界。

3. Confirmed full path production
   - 重新进入 Jianmu preflight、knowledge routing、Universal Production Harness、OpenClaw agent 主推理。
   - confirmed task spec 只作为输入约束和需求记录。
   - 正式结果必须重新推理、重新组织、重新检查，不得直接复制裸聊草案。

## 不可违反规则

- 裸聊草案不是最终成果。
- confirmed task spec 不能绕过知识路由。
- confirmed task spec 不能绕过 Harness。
- full path 必须重新生成推理结果。
- 多模态模型只能在主脑规划后临时生成素材。
- final 目录只能写通过质量门的成果。

## Envelope 字段

```json
{
  "taskDiscovery": {
    "confirmationOnly": true,
    "createsFinalArtifact": false,
    "requiresUserConfirmationBeforeFullPath": true,
    "fullPathMustRegenerate": true
  },
  "userConfirmation": {
    "confirmedTaskSpecProvided": true,
    "fullPathMayStart": true
  },
  "architectureSemantics": {
    "chatFirstDiscoveryIsConfirmationOnly": true
  }
}
```

## 质量检查

进入 full path 前必须确认：

- 用户目标明确。
- 交付物明确。
- 受众明确或有默认受众。
- 风格明确或有默认风格。
- 页数、时长、篇幅有预算或可由主脑估算。
- 来源材料和外部资料边界明确。
