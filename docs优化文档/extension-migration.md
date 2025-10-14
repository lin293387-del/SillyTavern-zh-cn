# 扩展迁移指南

本文列出旧版 SillyTavern 前端全局接口与新版 `SillyTavern.extensions` SDK 的对应关系，帮助扩展作者完成迁移。旧接口仍可通过 `SillyTavernLegacy` 名称空间访问，但仅用于过渡阶段，请尽快改用新 API。

## 1. 总览

| 旧接口 (已弃用) | 说明 | 对应新接口 |
| ---------------- | ---- | ---------- |
| `registerMessageDom(element)` | 手工维护消息 DOM 注册 | `SillyTavern.extensions.messages.onMount` / `getElement` |
| `unregisterMessageDom(element)` | 取消注册消息 DOM | `SillyTavern.extensions.messages.onUnmount` |
| `reassignMessageDomId(oldId, newId)` | 调整消息 DOM 索引 | `SillyTavern.extensions.chat.mutateMessage` + 虚拟化事件 |
| `rebuildMessageDomRegistry()` | 重新构建消息 DOM 索引 | 监听 `virtualization` 事件或使用 `chat.getSnapshot` |
| `eventSource.on/off/emit` | 自定义事件总线 | `SillyTavern.extensions.events.on/off/emit` |
| `event_types.*` | 事件常量 | `SillyTavern.extensions.events.types` |
| `workerManager.registerFallback` | 注册 Worker 回退逻辑 | `SillyTavern.extensions.workers.registerFallback` |
| `workerManager.extendTaskConfig` | 修改 Worker 配置 | `SillyTavern.extensions.workers.extendConfig` |
| `workerManager.dispatchTask` | 派发 Worker 任务 | `SillyTavern.extensions.workers.dispatch` |
| `setWorkerOptimizationEnabled` | 开关 Worker 优化 | `SillyTavern.extensions.variables.updatePowerUser` 以修改 `worker_optimization` |
| `workerManager` | Worker 管理器实例 | `SillyTavern.extensions.workers` |
| `eventSource` | 事件总线实例 | `SillyTavern.extensions.events` |

## 2. 迁移步骤建议

1. **替换事件监听**：
   - 旧代码：`eventSource.on(event_types.MESSAGE_SENT, handler)`
   - 新代码：
     ```js
     const token = SillyTavern.extensions.events.on(
       SillyTavern.extensions.events.types.MESSAGE_SENT,
       handler,
     );
     // 扩展卸载时调用 token.dispose()
     ```

2. **消息 DOM 操作**：扩展若依赖 DOM 注册，请改为监听 `messages.onMount/onUnmount`，并利用 `detail.element` 获取节点。

3. **Worker 任务**：将 `workerManager.dispatchTask`、`registerFallback`、`extendTaskConfig` 等替换为 `SillyTavern.extensions.workers.*`，并使用 `FallbackStrategy` 常量控制策略。

4. **世界书 / 角色 / 预设**：旧扩展常直接修改全局对象，如 `world_info`、`characters`、`presetManagers`。现在可改用以下 API：
   - `SillyTavern.extensions.worldInfo.*`
   - `SillyTavern.extensions.characters.*`
   - `SillyTavern.extensions.presets.*`

5. **设置与样式**：
   - 对 `power_user` 的修改使用 `SillyTavern.extensions.variables.updatePowerUser`。
   - 全局设置使用 `SillyTavern.extensions.variables.updateSettings`。

## 3. `SillyTavernLegacy` 名称空间

为兼容旧扩展，系统提供 `SillyTavernLegacy`，包含上述常用接口。首次访问会在控制台打印弃用提示。例如：

```js
SillyTavernLegacy.registerMessageDom(element);
// 控制台： [SillyTavernLegacy] registerMessageDom 已弃用，请改用 SillyTavern.extensions.messages.onMount / getElement。
```

请将其视为临时过渡方案，不建议用于新扩展。

## 4. 调试与问题反馈

- 若迁移后出现问题，可在浏览器控制台检查是否存在 `[SillyTavernLegacy]` 提示。
- 使用 `docs优化文档/sillytavern-extensions.d.ts` 享受完整类型提示。
- 如需进一步帮助，请在仓库 issue （或discord）中附带示例代码、控制台输出和期望行为。
