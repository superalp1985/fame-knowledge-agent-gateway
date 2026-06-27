# Worker Registry v0.1

## 目标
先把各模块集成起来，再慢慢调试。
审计点前移到“Claw Code 把文字交给下一级工作模块”那一刻，而不是等成品产出后才看。

## 当前统一入口
- `PPTAgent`：PPT/DeepPresenter worker
- `PresentAgent-2`：讲解视频主链路 worker
- `Code2Video`：动画教学片段 worker
- `DocAdapterLite`：自研轻量文档理解模块
- `lisun-ai-DocAgent`：仅参考，不直接内嵌

## 集成原则
1. 先统一任务协议，再接各 worker。
2. 先接入口和产物，不追求一次调到最佳。
3. 审计前置，但 v0.1 先记录/告警，不阻断主链路。
4. Web 内容默认不入库，只做临时证据。
5. 许可证冲突优先于技术便利。

## 后续方向
- 任务路由器
- worker registry API
- worker 独立运行时
- 审计规则按 worker 分类
- 产物标准化（md/pdf/mp4/json）
