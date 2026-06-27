# Contract Validation v0.1

## 目标
把“协议冻结”进一步变成可执行校验：任务 manifest 是否符合冻结合同。

## 实现
```text
src/contract_validation.py
```

核心：
- `ContractValidationService`

## API
```text
GET /tasks/{task_id}/contracts/validate
```

## 校验逻辑
- 从 task manifest 里按 `step` 聚合 artifact kinds。
- 对照 `ContractRegistry` 中的冻结合同。
- 检查每个 step 是否缺少 required artifact。
- 额外 artifact 标为 info，不直接判错。

## 当前 step -> contract 映射
- course_pack -> course-pack
- ppt_draft -> ppt-draft
- video_plan -> video-plan
- animation_plan -> animation-plan
- localization -> localization-package

## 输出
```json
{
  "task_id": "...",
  "schema": "jianmu.agent.contract_validation.v0.1",
  "ok": true,
  "checks": [],
  "issues": []
}
```

## 测试结果
```text
CONTRACT_VALIDATE 200 True 0
```

## 下一步
1. 给 error task 也做 contract validate。
2. 增加 contract diff / version bump 提示。
3. 增加单独 contract health API。
