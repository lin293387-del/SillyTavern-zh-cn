# 前端扩展 SDK 说明（**在调用时保证运行环境已经加载主页面并初始化过 SillyTavern.extensions。**）

本文档介绍 SillyTavern 新增的 `SillyTavern.extensions` 命名空间，包括暴露的能力、典型用法以及迁移注意事项，帮助扩展作者快速对接新版前端 SDK。各子模块封装了底层 API 调用，扩展只需使用这里描述的 SDK 接口即可。

## 1. 命名空间结构

```
SillyTavern.extensions = {
  events,          // 核心事件封装
  messages,        // 消息生命周期
  virtualization,  // 虚拟化阶段
  workers,         // Worker 调度
  chat,            // 聊天数据访问
  worldInfo,       // 世界书读写与激活
  characters,      // 角色卡管理
  presets,         // 预设/模板管理
  ui,              // 常用界面工具
  variables,       // power_user / settings 等全局变量
  prompts,         // 提示词模块注册
  backend,         // 后端 API 开关与状态
  macros,          // 宏注册与即时替换
  templates,       // Handlebars 模板渲染与缓存管理
  errors           // 统一错误码
}
```

所有子模块均为只读对象；若调用返回 `ExtensionEventToken`，可通过其 `dispose()` 主动注销监听。

## 2. 事件模块

- `events.on(eventName, handler, options?)`：监听白名单事件，`options` 支持 `once`/`capture`/`passive`。
- `events.off(token)`：传入 `token.token` 或直接调用 `token.dispose()` 即可释放监听。
- `events.emit(eventName, payload, { allowList })`：仅当 `allowList` 显式包含目标事件时才会派发。
- `events.types`：对 `event_types` 的只读映射，便于引用核心事件常量。
- `events.domEvents`：列出虚拟化、Worker 相关的 DOM 自定义事件（如 `virtualization-toggle`）。

```javascript
const dispose = SillyTavern.extensions.events.on(
  SillyTavern.extensions.events.types.MESSAGE_SENT,
  (mesId) => console.debug('用户发送消息', mesId),
);
// …需要时调用 dispose.dispose();
```

新增事件常量说明：
- `GENERATION_PHASE_BEFORE` / `GENERATION_PHASE_STREAM` / `GENERATION_PHASE_AFTER`：覆盖消息生成前、中、后的流式钩子，payload 包含阶段、文本、消息 ID、是否流式/中止等信息。
- `IMPORT_TASK_SUBMITTED` / `IMPORT_TASK_PROGRESS` / `IMPORT_TASK_COMPLETED` / `IMPORT_TASK_FAILED`：统一导入解析队列的提交、进度与完成事件（后续迭代会逐步接入各类导入入口）。
- `BACKEND_API_STATUS_CHANGED`：后端 API 开关或日志状态变化时触发，可用于调整扩展能力开关。

## 3. 消息生命周期

- `messages.onMount(handler)` / `messages.onUnmount(handler)`：监听虚拟化挂载/卸载，回调参数包含 `mesId`、`element`、`message`、`virtual` 等字段。
- `messages.getElement(mesId)`：返回消息对应的 DOM 节点（若虚拟化可见）。

```javascript
SillyTavern.extensions.messages.onMount(({ mesId, element, virtual }) => {
  if (!virtual && element) {
    element.dataset.myAddon = 'highlight';
  }
});
```

## 4. 虚拟化阶段

- `virtualization.Phase`：阶段枚举（`BEFORE_MOUNT`、`MOUNT`、`AFTER_RENDER`、`UNMOUNT`、`RENDER_START`、`RENDER_END`、`TOGGLE`、`TOGGLE_COMPLETE`）。
- `virtualization.onPhase(phase, handler)`：订阅阶段事件，回调 `detail` 会附带 `phase`、`mesId`、`element`、`enabled` 等信息。

```javascript
SillyTavern.extensions.virtualization.onPhase(
  SillyTavern.extensions.virtualization.Phase.TOGGLE_COMPLETE,
  ({ enabled }) => console.info('虚拟化状态：', enabled ? '启用' : '关闭'),
);
```

## 5. Worker 调度

- `workers.dispatch(type, payload, options?)`：派发任务，返回 Promise 结果。
- `workers.onTaskEvent(handler)`：监听 `st-worker-task` 生命周期事件（`phase`、`type`、`taskId`、`result`、`error` 等）。
- `workers.registerFallback(type, fallback)` / `workers.extendConfig(type, overrides)`：扩展或调整任务配置。
- `workers.FallbackStrategy`：可选策略常量（`IMMEDIATE`、`RETRY` 等）。

```javascript
const { dispatch, onTaskEvent, FallbackStrategy } = SillyTavern.extensions.workers;

onTaskEvent(({ type, phase, error }) => {
  if (phase === 'error') console.warn(`[${type}] 任务失败`, error?.message);
});

await dispatch('tokenizer-count', { text: 'demo' }, {
  fallbackStrategy: FallbackStrategy.RETRY,
});
```

## 6. 聊天数据接口

- `chat.getSnapshot({ includeVirtual })`：返回 `{ count, messages, virtualization }`，其中 `messages` 为 `{ index, message }` 数组。
- `chat.mutateMessage(mesId, updater, { rerender, broadcast })`：乐观更新消息；`updater` 可返回新对象或直接修改草稿。
- `chat.sendUserMessage({ text, bias, insertAt, compact, name, avatar })`：以用户身份注入消息，并返回持久化后的消息体。
- **chat.input 输入区 SDK（试验性）**：统一封装原生输入框与发送按钮，便于扩展和角色卡共用流程。
  - `chat.input.getTextarea()`：返回聊天输入框的 `HTMLTextAreaElement`；若界面尚未渲染聊天区会返回 `null`。
  - `chat.input.getSendButton()`：返回主发送按钮的 `HTMLButtonElement`。
  - `chat.input.getDraft()`：读取当前草稿文本，保持与原生输入框一致的换行与宏占位处理。
  - `chat.input.setDraft(value, { append = false, caret = 'end', silent = false })`：写入或追加草稿；支持 `caret: 'start' | 'end' | 'preserve' | number` 调整光标；`silent` 时不会触发 `input` 事件或广播。
  - `chat.input.clearDraft({ focus = true, silent = false })`：清空草稿并可选重新聚焦输入框；非 `silent` 会触发 `DRAFT_RESET` 与 `DRAFT_CHANGED` 事件。
  - `chat.input.focus({ selectAll = false, preventScroll = false })`：聚焦输入框，可选全选文本或禁止滚动跳动。
  - `chat.input.onDraftChange(handler, { emitImmediately = false })`：监听草稿变化，回调 `{ draft, source, textarea }`；`emitImmediately` 可立即推送当前草稿。
  - `chat.input.onSubmit(handler)`：在发送前插入拦截逻辑；返回 `false` 可取消提交，返回 `{ text, generateType }` 可替换草稿与生成类型。
  - `chat.input.submit({ text, append, caret, silent, generateType, focus = true, preventScroll = false, selectAll = false, source = 'extension' })`：写入并复用原生 `sendTextareaMessage` 管线，返回 `{ canceled, generateType, result }`。
  - `chat.input.sendDraft({ generateType, focus = true, preventScroll = false, selectAll = false, source = 'extension' })`：直接提交当前草稿的便捷方法。
  - 事件补充：`events.types.DRAFT_CHANGED`、`events.types.DRAFT_SUBMITTED`、`events.types.DRAFT_RESET` 已在核心事件表中定义，可统一在 `SillyTavern.extensions.events.on(...)` 里监听。
  - 所有方法都会走与界面一致的宏解析、slash 命令检测、附件校验、`continue_on_send` 与群聊队列逻辑，避免各自实现分叉。

```javascript
// 示例：正则扩展里的自定义输入/展示（前端卡可看）
const { chat, events } = SillyTavern.extensions;

function mountCustomInput(root) {
  const input = root.querySelector('.my-regex-input');
  const sendBtn = root.querySelector('.my-regex-send');
  const messagesPane = root.querySelector('.my-regex-messages');

  const tokens = [];
  tokens.push(chat.input.onDraftChange(({ draft }) => {
    if (document.activeElement !== input) input.value = draft;
  }, { emitImmediately: true }));

  input.addEventListener('input', () => {
    chat.input.setDraft(input.value, { caret: 'preserve' });
  });

  sendBtn.addEventListener('click', async () => {
    const { canceled } = await chat.input.submit({ source: 'regex-extension', focus: false });
    if (!canceled) input.value = '';
  });

  const renderSnapshot = async () => {
    const snapshot = await chat.getSnapshot();
    messagesPane.innerHTML = snapshot.messages.map(({ message }) => `<div class="msg">${message.mes}</div>`).join('');
  };

  const refreshEvents = [
    events.types.MESSAGE_SENT,
    events.types.MESSAGE_RECEIVED,
    events.types.MESSAGE_UPDATED,
    events.types.MESSAGE_DELETED,
  ];
  refreshEvents.forEach((type) => {
    tokens.push(events.on(type, renderSnapshot));
  });
  renderSnapshot();

  return () => tokens.forEach((token) => token.dispose?.());
}
```

```javascript
const snapshot = await SillyTavern.extensions.chat.getSnapshot();
console.log('当前可见消息：', snapshot.virtualization.range);

await SillyTavern.extensions.chat.mutateMessage(0, (draft) => {
  draft.mes = `[MODIFIED] ${draft.mes}`;
});
```

## 7. 世界书模块

`worldInfo` 仍保留原有的便捷方法（`listBooks`、`getBook`、`listEntries`、`getSettings/updateSettings`、`refresh`、`forceActivate`、`ensureEmbeddedWorld/importEmbeddedWorldInfo` 以及 `events` 系列监听）。在此基础上新增了更细粒度的子命名空间：

- `worldInfo.books`：管理世界书文件
  - `list()` 获取名称数组（与旧方法等价）
  - `load(name, { refresh })` 直接读取后端世界书数据
  - `save(name, data, { immediately, refreshList })` 覆盖存盘
  - `create(name, { interactive })` / `delete(name)` / `rename(oldName, newName, { overwrite })` / `duplicate(source, target, { overwrite, refreshList })`
  - `mutate(name, mutator, { immediately, refreshEditor, navigation, flash, refreshList })`：在单次事务内读写数据并自动保存
  - `openEditor(name)` / `reloadEditor(name, { loadIfNotSelected })` / `editorState()` / `refreshList()`
- `worldInfo.entries`：操纵单条条目
  - `list(book, { refresh })` / `get(book, uid, { refresh })`
  - `create(book, payload, { immediately, refreshEditor, navigation, flash, updateOriginal })`
  - `update(book, uid, mutator, { immediately, refreshEditor, navigation, flash })`
  - `remove(book, uid, { immediately, refreshEditor, navigation, flash, silent })`
  - `duplicate(book, uid, { immediately, refreshEditor, navigation, flash })`
  - `move(source, target, uid, { deleteOriginal })`
  - `render(book, uid, { data, entry })`：复用原生模板生成条目面板 HTML
- `worldInfo.editor`：快速控制面板状态
  - `open(name)`、`reload(name, options)`、`state()`、`refresh(navigation, flash)`
- `worldInfo.navigation` / `worldInfo.anchorPosition`：暴露 `navigation_option` 与 `wi_anchor_position` 枚举常量，便于调用时保持一致

```javascript
// 复制世界书后追加新条目
const sdk = SillyTavern.extensions.worldInfo;
await sdk.books.duplicate('原始世界书', '备份世界书', { overwrite: true });
const newEntry = await sdk.entries.create('备份世界书', {
  comment: '由扩展自动添加',
  content: '扩展写入的条目内容',
  key: ['trigger'],
}, { refreshEditor: true, navigation: sdk.navigation.previous });

console.info('新增条目 UID:', newEntry.uid);

// 使用 mutate 原子修改整本书
await sdk.books.mutate('备份世界书', ({ data, setOriginal }) => {
  Object.values(data.entries).forEach((entry) => {
    if (!entry.comment) {
      entry.comment = entry.key?.[0] ?? '无标题';
      setOriginal(entry.uid, 'comment', entry.comment);
    }
  });
}, { immediately: true, refreshList: false });

// 监听更新事件以同步 UI
sdk.onUpdated(() => {
  console.debug('世界书数据已刷新');
});
```

## 8. 扩展管理模块

`SillyTavern.extensions.manager` 聚合了扩展启停、安装卸载、分支切换、更新检查等操作，返回值会包含 `reloadRequired` 以提示是否需要刷新页面。

- `manager.listInstalled({ includeManifest })`：读取扩展清单，返回 `id / externalId / type / isActive / isDisabled / modules` 等元数据。
- `manager.listDiscovered()`：获取可供安装的第三方扩展。
- `manager.enable(name, { reload, includeManifest })` / `manager.disable(...)`：修改启用状态，默认不强制刷新。
- `manager.install({ url, branch, global, notify, includeManifest })`：从仓库安装扩展，返回服务端响应及新增条目（若能识别）。
- `manager.remove(name, { notify, reload, includeManifest })`：卸载扩展，可由调用方决定是否刷新页面。
- `manager.move(name, 'global' | 'local', { notify, refreshDetails, includeManifest })`：在全局与个人目录之间迁移扩展。
- `manager.switchBranch(name, branch, { notify, refreshDetails, includeManifest })`：切换第三方扩展使用的分支。
- `manager.update(name, { quiet, notify, refreshDetails, timeout, includeManifest })`：更新单个扩展。
- `manager.updateAll({ force, notify })` / `manager.checkUpdates({ force, notify })`：批量自动更新或仅检查可更新列表。
- `manager.getBranches(name, { notify })` / `manager.getVersion(name, { signal })`：查询扩展可用分支与最新版本信息。
- `manager.refresh({ settings, versionChanged, enableAutoUpdate, includeManifest })`：重新加载扩展配置（等价于手动调用 `loadExtensionSettings`）。
- `manager.reloadPending()` / `manager.clearReloadFlag()`：查询或清空等待刷新标记，便于统一提示。

```javascript
const { manager, ui } = SillyTavern.extensions;

await manager.disable('third-party/sample-extension', { reload: false });
if (manager.reloadPending()) {
  ui.showToast('info', '扩展已禁用，如需彻底卸载请刷新页面。');
}

const installed = manager.listInstalled();
console.table(installed.map(({ displayName, type, isActive }) => ({ displayName, type, isActive })));
```

> 全局可通过 `config.json` 中的 `extensionToastNotifications`（默认 `true`）关闭扩展管理操作的自动 toast 提示；SDK 所有 `notify` 选项在未明确指定时都会遵循该配置。

## 9. 角色管理模块

- `characters.list({ refresh })`：返回 `{ index, character }` 数组，可选择刷新后再获取。
- `characters.get(index)`：获取指定角色快照。
- `characters.getActive()`：返回当前激活角色信息。
- `characters.setActive(index, { switchMenu })`：切换激活角色。
- `characters.rename(index, newName, options)`：重命名角色（自动维护 UI 状态）。
- `characters.duplicate(index)`：复制角色并返回最新角色列表。
- `characters.remove(index, { deleteChats })`：删除角色，可选是否级联删除聊天记录。
- `characters.refresh()`：强制刷新并返回最新角色列表。
- `characters.events` / `characters.on(event, handler)` / `characters.onAnyChange(handler)`：监听 `CHARACTER_EDITED`、`CHARACTER_DELETED` 等事件。

```javascript
await SillyTavern.extensions.characters.rename(0, '全新角色名');
SillyTavern.extensions.characters.onAnyChange(({ detail }) => {
  console.log('角色发生变化', detail);
});
```

## 10. 预设模块

- `presets.list(apiId)`：获取某 API 下的预设名称列表。
- `presets.getSelected(apiId)`：返回当前选中的预设名称。
- `presets.select(apiId, value)`：切换选中的预设。
- `presets.getSettings(apiId, name?)`：获取指定预设的配置快照。
- `presets.save(apiId, name, settings, options)` / `presets.saveAs(apiId)`：保存或另存预设。
- `presets.rename(apiId, newName)`：重命名预设。
- `presets.remove(apiId, name)`：删除预设。
- `presets.events` / `presets.on(event, handler)`：监听 `PRESET_CHANGED`、`PRESET_DELETED`。

```javascript
const allInstruct = SillyTavern.extensions.presets.list('instruct');
await SillyTavern.extensions.presets.save('openai', '我的新预设', presetPayload);
```

## 11. UI 工具

- `ui.toggleDrawer(selector, expand?)`：控制任意抽屉的展开/折叠。
- `ui.focus(selector)`：聚焦指定元素。
- `ui.scrollIntoView(selector, options)`：滚动至指定元素。
- `ui.setClass(selector, className, value)` / `ui.bodyClass(className, value)`：批量设置类名。
- `ui.showToast(type, message, title?, options?)`：显示 toast 提示。
- `ui.showLoader()` / `ui.hideLoader()`：操作全局加载遮罩。

```javascript
SillyTavern.extensions.ui.toggleDrawer('#world_info_drawer', true);
SillyTavern.extensions.ui.showToast('success', '扩展初始化完成');
```

## 12. 变量与设置

- `variables.getPowerUser()` / `variables.updatePowerUser(updater)`：读取或更新 `power_user`，自动应用样式并保存。
- `variables.getSettings()` / `variables.updateSettings(updater)`：读取或更新全局设置，自动调用 `saveSettings` 并广播 `SETTINGS_UPDATED`。
- `variables.mainApi`：只读访问当前主 API。
- `variables.onSettingsUpdated(handler)`：监听设置变更事件。
- 变量作用域支持 `message` / `chat` / `global` 之外的 `character` 与 `script`，事件会附带 `characterId`、`scriptId` 等标识，角色变量存储在当前角色数据扩展区，脚本变量归档于 `extension_settings.variables.scripts`。
- 新增 Promise 工具：`variables.replaceVariables()`、`variables.updateVariablesWith()`、`variables.insertOrAssignVariables()`、`variables.insertVariables()`、`variables.deleteVariable()`，便于扩展一次性替换、增量合并或按路径删除变量。
- `variables.snapshot()` 现支持 `{ incremental, track }` 选项，可按需获取差分快照并控制是否更新内部基准。

```javascript
await SillyTavern.extensions.variables.updatePowerUser((draft) => {
  draft.enable_virtualization = true;
  return draft;
});
```

```javascript
// 脚本作用域变量：按脚本 ID 管理自定义状态
await SillyTavern.extensions.variables.insertOrAssignVariables(
  { usageCount: 1 },
  { type: 'script', scriptId: 'my-extension-script' },
);

// 读取差分快照（不更新内部基准）
const diff = SillyTavern.extensions.variables.snapshot({ incremental: true, track: false });
console.debug(diff.script?.['my-extension-script']);
```

## 13. 统一错误码

`SillyTavern.extensions.errors` 暴露以下键值常量（通过 `errors.*` 访问，括号内为实际字符串值）：
- `errors.OK`（`'EXT_OK'`）：操作成功。
- `errors.HANDLER_REJECTED`（`'EXT_E_HANDLER_REJECTED'`）：扩展处理器主动拒绝或返回 `false`。
- `errors.TIMEOUT`（`'EXT_E_TIMEOUT'`）：操作或等待超时。
- `errors.ABORTED`（`'EXT_E_ABORTED'`）：请求或任务被主动取消。
- `errors.FORBIDDEN`（`'EXT_E_FORBIDDEN'`）：因权限或 CSRF 校验失败被拒绝。
- `errors.BAD_PAYLOAD`（`'EXT_E_BAD_PAYLOAD'`）：入参或数据格式不符合要求。
- `errors.UNSUPPORTED`（`'EXT_E_UNSUPPORTED'`）：当前环境或配置不支持该能力。
- `errors.NOT_FOUND`（`'EXT_E_NOT_FOUND'`）：目标资源不存在或不可获取。
- `errors.UNAVAILABLE`（`'EXT_E_UNAVAILABLE'`）：依赖服务暂不可用或被禁用。

扩展可在内部统一处理 Promise 结果或事件回调的错误语义。

## 14. 后端开关模块（封装后端 API）

- `backend.list()`：返回当前所有后端开关的 `{ key, label, enabled }` 列表。
- `backend.isEnabled(key)` / `backend.getLabel(key)`：查询单个开关状态或显示名称。
- `backend.getStatus()`：获取 `{ toggles, loggingEnabled }` 快照。
- `backend.refresh()`：重新从 `/api/meta/api-toggles` 拉取配置，返回最新快照。
- `backend.setEnabled(key, enabled, { source })`：前端侧临时禁止/恢复指定后端；`source` 仅用于事件日志。
- `backend.setLogging(enabled, { source })`：控制是否在控制台输出被拦截的请求提示，默认仅在服务器返回 `loggingEnabled` 时开启。

```javascript
const { backend } = SillyTavern.extensions;

backend.setEnabled('chatCompletion', false, { source: 'plugin' });
const status = await backend.refresh();
console.log(status.toggles.chatCompletion);
```

> 这些开关只影响前端的调用行为，并不会修改服务器端配置；若需要永久禁用某后端，请在服务器 `config.json` 中设置。

## 15. 宏模块

- `macros.register(key, value, description?)`：注册宏，`value` 支持字符串或 `(nonce) => string` 函数；重复注册会覆盖旧值。
- `macros.unregister(key)`：注销指定宏，返回布尔结果。
- `macros.list()`：返回 `[{ key, description }]` 列表，便于在调试 UI 中展示可用宏。
- `macros.evaluate(content, env?, postProcessFn?)` / `macros.evaluateAsync(...)`：在指定 `env` 上执行宏替换，可选传入后处理函数。

```javascript
const { macros } = SillyTavern.extensions;

macros.register('demoTime', () => new Date().toLocaleTimeString(), '示例：打印当前时间');

const text = '现在时间：{{demoTime}}。';
const resolved = macros.evaluate(text, { user: 'Alice' });
console.log(resolved);
```

> `env` 对象会被浅拷贝注入当前上下文，可结合变量服务/聊天元数据生成动态输出。

## 16. 模板模块

- `templates.render(id, data?, { sanitize, localize, fullPath }?)`：异步渲染 Handlebars 模板，默认执行 DOMPurify 及本地化。
- `templates.renderSync(...)`：同步渲染版本，建议仅在已缓存或小模板场景使用。
- `templates.clearCache(id?, { fullPath }?)`：删除缓存；不传 `id` 时清空全部模板缓存。
- `templates.hasCache(id, { fullPath }?)`：判断模板是否已缓存。

```javascript
const { templates } = SillyTavern.extensions;

await templates.render('popup/info', { title: 'Demo' });
templates.clearCache('popup/info'); // 热更新模板或本地调试时使用
```

## 17. 提示词模块

- `prompts.registerModule({ id, label, stage, priority, handler, validator })`：注册提示词模块，`handler` 将在指定阶段运行；`validator` 返回 `false` 可跳过本次执行。返回值附带 `dispose()` 便于注销。
- `prompts.unregisterModule(id)`：移除指定模块。
- `prompts.list()`：查看已注册模块的概要信息。
- `prompts.stages`：阶段枚举，当前支持 `BEFORE_COMBINE`（合并 Prompt 之前）与 `AFTER_COMBINE`（合并完成后）。

```javascript
const { prompts } = SillyTavern.extensions;

const token = prompts.registerModule({
  id: 'demo.inject-authors-note',
  stage: prompts.stages.BEFORE_COMBINE,
  priority: 10,
  validator: ({ data }) => !data.persona?.includes('skipAN'),
  handler: ({ data, setExtensionPrompt }) => {
    setExtensionPrompt('demo_an', '（来自扩展的附加提示）', 0, 0);
  },
});

// 停用时可调用 token.dispose();
// token.dispose();
```

模块上下文会提供：
- `data`：与 `GENERATE_BEFORE_COMBINE_PROMPTS` 相同的草稿对象，可直接读取或通过 `set/merge` 方法更新；
- `setExtensionPrompt` / `removeExtensionPrompt` / `getExtensionPrompt`：统一维护扩展提示；
- `setCombinedPrompt`：在 `BEFORE_COMBINE` 阶段直接写入合并结果以覆盖默认逻辑；
- `setPrompt` / `appendPrompt`：在 `AFTER_COMBINE` 阶段调整最终 Prompt。

## 18. 迁移建议

1. **停止直接访问全局函数**：`registerMessageDom`、`registerWorkerFallback` 等现已只读并打印弃用提示，需改用 SDK 对应方法。详见 `docs优化文档/extension-migration.md`。
2. **管理监听生命周期**：`events.on`、`messages.onMount` 等都会返回 `token`，请在扩展卸载时调用 `dispose()`，或绑定到 `beforeUnload` 事件及时释放。
3. **谨慎派发事件**：`events.emit` 必须带上 `allowList`，避免误派导致核心逻辑被污染。
4. **处理兼容环境**：若浏览器不支持 Worker，SDK 会自动回退并触发黄色提示；扩展可监听 `st-worker-enabled-changed` 做兜底逻辑。

## 19. 常见问题

- **如何判断虚拟化是否开启？** 使用 `chat.getSnapshot()` 返回的 `virtualization.enabled` 字段或监听 `virtualization.onPhase('TOGGLE_COMPLETE', …)`。
- **可以继续使用旧的事件名吗？** 事件名仍与旧版一致，但推荐引用 `events.types`/`events.domEvents`，避免拼写错误和未来改名风险。
- **是否支持 TypeScript？** 已提供 `docs优化文档/sillytavern-extensions.d.ts` 声明文件，可在扩展项目中引用以获得完整类型提示。

## 20. 声明文件引用

- 在 SillyTavern 前端中，声明文件默认已包含于仓库，可直接使用 VS Code 等编辑器获取智能提示。
- 为 `public/scripts/chat/` 子模块补齐细粒度声明（如 `chat-renderer.d.ts`、`message-dom-map.d.ts`、`chat-events.d.ts`、`message-lifecycle.d.ts`、`message-render-cache.d.ts`、`render-task-queue.d.ts`、`offscreen-manager.d.ts`、`render-pipeline-config.d.ts`），扩展可直接引用这些类型了解消息渲染、虚拟化、调度等内部结构。
- 若在独立扩展项目中使用，可将该文件复制到项目根目录，并通过以下方式引用：
  - 在 JS/TS 文件顶部添加 `/// <reference path="./sillytavern-extensions.d.ts" />`
  - 或在 `tsconfig.json` 中通过 `typeRoots` / `include` 指向该声明。
- 声明涵盖所有子模块 API、事件回调、错误码常量，如发现缺漏请提交 issue（或反馈到discord）。

---
如需示例或反馈问题，请在 discord 中附带扩展名称与复现步骤，我们会定期同步 SDK 变更与迁移建议。

## 21. 常见场景示例

以下示例展示如何组合 SDK 方法，快速完成常见任务。示例默认为异步上下文（如扩展初始化函数）：

```javascript
const { variables, manager, worldInfo, characters, presets, events } = SillyTavern.extensions;

// 1. 读取和写入变量（power_user）
const powerUser = variables.getPowerUser();
console.log('当前 power_user 配置', powerUser);

await variables.updatePowerUser((draft) => {
  draft.enable_virtualization = true;
  return draft;
});

// 2. 提交导入任务，并监听任务完成事件
const payload = new FormData();
payload.append('type', 'character');
payload.append('file', someFileObject);

const response = await fetch('/api/import/parse', {
  method: 'POST',
  body: payload,
});
const { taskId } = await response.json();

const disposeImport = events.on(
  events.types.IMPORT_TASK_COMPLETED,
  ({ detail }) => {
    if (detail.taskId === taskId) {
      console.log('导入完成：', detail.result);
      disposeImport.dispose();
    }
  }
);

// 3. 向世界书写入数据（在备份世界书添加条目）
const bookName = '备份世界书';
await worldInfo.books.mutate(bookName, ({ data, setOriginal }) => {
  const entry = worldInfo.entries.create(bookName, {
    comment: '自动添加条目',
    content: '这是扩展写入的内容。',
    key: ['auto'],
  }, { updateOriginal: true });
  setOriginal(entry.uid, 'comment', entry.comment);
}, { refreshEditor: true });

// 4. 重命名角色（index = 0）
await SillyTavern.extensions.characters.rename(0, '新的角色名称');

// 5. 获取某 API 的预设列表
const openAiPresets = presets.list('openai');
console.log('OpenAI 预设：', openAiPresets);

// 6. 禁用某个扩展并根据返回值提示刷新
const result = await manager.disable('third-party/demo-extension', { reload: false });
if (result.reloadRequired) {
  SillyTavern.extensions.ui.showToast('info', '扩展已禁用，请刷新页面以加载最新状态。');
}
```

> 注意：导入任务监听示例依赖 `/api/import/parse` 队列基础（详见《优化方案第20点.md》），如部署环境尚未启用，请根据文档开启。添加世界书条目时，`entries.create` 会立即执行；若需要更多控制，可在 `mutate` 上下文中手动调用 `setOriginal` 记录变更。
