# SillyTavern 前端扩展 API 参考

本参考文档提供 `SillyTavern.extensions` 命名空间的详细说明，列举所有可用方法、事件、参数与返回值，方便扩展作者查阅。

> **说明**：该命名空间在页面初始化完成后常驻于 `globalThis.SillyTavern.extensions`，所有模块均为只读对象。若接口返回 token（`ExtensionEventToken`），请在扩展卸载时调用 `dispose()` 释放资源。

---

## 目录

1. [命名空间概述](#命名空间概述)
2. [events 模块](#events-模块)
3. [messages 模块](#messages-模块)
4. [virtualization 模块](#virtualization-模块)
5. [workers 模块](#workers-模块)
6. [chat 模块](#chat-模块)
7. [worldInfo 模块](#worldinfo-模块)
8. [characters 模块](#characters-模块)
9. [presets 模块](#presets-模块)
10. [ui 模块](#ui-模块)
11. [variables 模块](#variables-模块)
12. [统一错误码](#统一错误码)
13. [迁移说明与注意事项](#迁移说明与注意事项)

---

## 命名空间概述

```js
SillyTavern.extensions = {
  events,
  messages,
  virtualization,
  workers,
  chat,
  worldInfo,
  characters,
  presets,
  ui,
  variables,
  errors,
};
```

每个子模块的使用示例如下：

```js
const { on, types } = SillyTavern.extensions.events;
const token = on(types.MESSAGE_SENT, (mesId) => console.log('发送消息', mesId));
// ...扩展卸载时：
token.dispose();
```

---

## events 模块

### 方法
- `events.on(eventName, handler, options?)` → `ExtensionEventToken`
  - `eventName`: 事件名称，需属于白名单（见 `events.types` 与 `events.domEvents`）。
  - `handler`: 回调函数，支持 async/Promise。
  - `options.once`: 仅触发一次。
  - `options.capture`、`options.passive`: DOM 事件参数（仅对 `domEvents` 生效）。

- `events.off(token)` → `boolean`
  - 传入 `on` 返回的 token 字符串或 `ExtensionEventToken` 对象。

- `events.emit(eventName, payload, { allowList, bubbles, cancelable }?)`
  - 仅在 `allowList` 显式包含 `eventName` 时生效。
  - 对 DOM 事件，可控制是否冒泡和可取消。

### 常量
- `events.types`: 结构与 `event_types` 相同，供扩展引用（如 `MESSAGE_SENT`、`CHARACTER_DELETED`）。
- `events.domEvents`: 虚拟化、Worker 相关的 DOM 事件（如 `virtualization-toggle`、`st-worker-task`）。

---

## messages 模块

- `messages.onMount(handler, options?)` / `messages.onUnmount(handler, options?)` → `ExtensionEventToken`
  - 回调签名：`({ mesId, element, message, virtual, reason })`。
- `messages.getElement(mesId)` → `HTMLElement | null`

---

## virtualization 模块

- `virtualization.Phase`: 阶段枚举（`BEFORE_MOUNT`、`MOUNT`、`AFTER_RENDER`、`UNMOUNT`、`RENDER_START`、`RENDER_END`、`TOGGLE`、`TOGGLE_COMPLETE`）。
- `virtualization.onPhase(phase, handler, options?)` → `ExtensionEventToken`
  - 回调签名：`({ phase, enabled, mesId, element, virtual, reason })`。

---

## workers 模块

- `workers.dispatch(type, payload, options?)` → `Promise<any>`
  - `options.fallbackStrategy`: 参见 `workers.FallbackStrategy`。
  - `options.onProgress`: 监听进度。
  - `options.signal`: `AbortSignal` 用于取消。

- `workers.onTaskEvent(handler, options?)` → `ExtensionEventToken`
  - 回调签名：`({ type, phase, taskId, payload, viaFallback, result, error })`。

- `workers.registerFallback(type, fallback)` / `workers.extendConfig(type, overrides)`：注册回退或修改任务配置。
- `workers.FallbackStrategy`: `IMMEDIATE`、`RETRY` 等常量。

---

## chat 模块

- `chat.getSnapshot({ includeVirtual }?)` → `{ count, messages: { index, message }[], virtualization }`
- `chat.mutateMessage(mesId, updater, { rerender, broadcast }?)` → `Promise<any>`
  - `updater(draft, { index, original })` 可同步/异步返回对象。
- `chat.sendUserMessage({ text, bias, insertAt, compact, name, avatar })` → `Promise<any>`

---

## worldInfo 模块

- `worldInfo.listBooks()` → `string[]`
- `worldInfo.getBook(name)` → `object | null`
- `worldInfo.listEntries(name, { sort }?)` → `object[]`
- `worldInfo.getSettings()` / `worldInfo.updateSettings(partial, dataOverride?)`
- `worldInfo.refresh()` → `Promise<string[]>`
- `worldInfo.forceActivate(entries)` → 触发 `WORLDINFO_FORCE_ACTIVATE`
- `worldInfo.ensureEmbeddedWorld(characterId)` / `worldInfo.importEmbeddedWorldInfo(characterId)`
- `worldInfo.events`: `UPDATED`, `SETTINGS_UPDATED`, `FORCE_ACTIVATE`
- `worldInfo.onUpdated(handler)` / `worldInfo.onSettingsUpdated(handler)`

---

## characters 模块

- `characters.list({ refresh }?)` → `{ index, character }[]`
- `characters.get(index)` → `object`
- `characters.getActive()` → `{ index, character } | null`
- `characters.setActive(index, { switchMenu }?)`
- `characters.rename(index, newName, options?)`
- `characters.duplicate(index)` / `characters.remove(index, options?)`
- `characters.refresh()` → 最新角色列表
- `characters.events`: `CHARACTER_EDITED`、`CHARACTER_DELETED`、`CHARACTER_DUPLICATED`、`CHARACTER_RENAMED`、`CHARACTER_PAGE_LOADED`
- `characters.on(eventName, handler)` / `characters.onAnyChange(handler)`

---

## presets 模块

- `presets.list(apiId)` → `string[]`
- `presets.getSelected(apiId)` → `string | null`
- `presets.select(apiId, value)`
- `presets.getSettings(apiId, name?)`
- `presets.save(apiId, name, settings, options?)`
- `presets.saveAs(apiId)` / `presets.rename(apiId, newName)`
- `presets.remove(apiId, name)`
- `presets.events`: `PRESET_CHANGED`, `PRESET_DELETED`
- `presets.on(eventName, handler)`

---

## ui 模块

- `ui.toggleDrawer(selector, expand?)`
- `ui.focus(selector)` / `ui.scrollIntoView(selector, options?)`
- `ui.setClass(selector, className, value)` / `ui.bodyClass(className, value)`
- `ui.showToast(type, message, title?, options?)`
- `ui.showLoader()` / `ui.hideLoader()`

---

## variables 模块

- `variables.getPowerUser()` / `variables.updatePowerUser(updater)`：读写 `power_user` 并自动应用样式、保存设置。
- `variables.getSettings()` / `variables.updateSettings(updater)`：读写全局设置并触发 `SETTINGS_UPDATED`。
- `variables.mainApi`（只读）：当前主 API。
- `variables.onSettingsUpdated(handler)`：监听设置变更。
- 作用域支持 `message` / `chat` / `global` / `character` / `script`，角色数据写入角色扩展区，脚本变量统一存放于 `extension_settings.variables.scripts`，事件 detail 会附带 `characterId`、`scriptId`。
- Promise 工具：
  - `variables.replaceVariables(payload, options?)`
  - `variables.updateVariablesWith(updater, options?)`
  - `variables.insertOrAssignVariables(payload, options?)`
  - `variables.insertVariables(payload, options?)`
  - `variables.deleteVariable(path, options?)`
- `variables.snapshot(options?)`：默认返回全量快照，接受 `{ incremental, track }` 以获取差分并控制是否更新基准。
- `variables.scope` 辅助：`variables.message/chat/global/character/script` 皆可使用 `get/set/remove/transaction` 快捷方法。
- 调试入口：`window.__variableDebug__` 提供 `snapshot/subscribe/get/set/remove`，平行于事件桥接（`variables.subscribe` → `variables_updated`、`variables_batch_updated`、`st-variables-updated`）。

---

## 统一错误码

`SillyTavern.extensions.errors` 包含以下常量：

| 常量 | 说明 |
| ---- | ---- |
| `EXT_OK` | 操作成功 |
| `EXT_E_TIMEOUT` | 操作或等待超时 |
| `EXT_E_ABORTED` | 请求或任务被主动取消 |
| `EXT_E_FORBIDDEN` | 权限不足或 CSRF 校验失败 |
| `EXT_E_BAD_PAYLOAD` | 入参/数据格式不符合要求 |
| `EXT_E_UNSUPPORTED` | 当前环境或配置不支持 |
| `EXT_E_NOT_FOUND` | 目标资源不存在或不可获取 |
| `EXT_E_UNAVAILABLE` | 依赖服务暂不可用或被禁用 |
| `EXT_E_HANDLER_REJECTED` | 扩展处理器主动拒绝或返回 `false` |
---

## 迁移说明与注意事项

1. **弃用全局函数**：`registerMessageDom`、`registerWorkerFallback`、`workerManager` 等传统全局对象已改为只读或打印警告，请改用 SDK 接口。
2. **管理监听生命周期**：`events.on`、`messages.onMount` 等返回值均可 `dispose()`，建议在 `beforeUnload` 或扩展卸载流程中统一释放。
3. **显式允许 emit**：`events.emit` 需传入 `allowList`，以避免扩展误将内部事件传播给核心逻辑。
4. **Worker 回退提示**：若浏览器不支持 Worker 或被用户关闭，SDK 会自动回退并触发黄色提示，扩展应监听 `st-worker-enabled-changed` 处理兜底逻辑。
5. **类型与注释**：代码内已提供 JSDoc，可直接在 VS Code 获取智能提示；后续将补充 `.d.ts` 文件。

---

如需更多示例或报告问题，请在仓库 issue 中（或者discord社区）附带扩展名称、复现步骤与控制台输出，方便我们持续完善 SDK 与文档。
