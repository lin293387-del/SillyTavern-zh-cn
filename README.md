# SillyTavern-zh-cn
sillytavern特供版
# 基于原 SillyTavern 项目的部分优化重构与 SDK 成果展示

> 灵感来源于：酒馆现有体验仍有诸多可优化之处；加之社区内其他讨论帖引发的联想，于是在 gpt5-codex指导下，把近期的改造成果整理成文与实物

## 非常非常非常感谢橘狐大佬的教程

**本项目未大规模重构底层，因此与原项目完全适配，你可以直接导入data/default-user内的数据以及SillyTavern\public\scripts\extensions\third-party内的数据到本项目（不要直接迁移整个public，只能迁移extensions或third-party）**
```迁移前请确保你至少留有一份数据备份```
- 本项目全程仅我一人测试，可能会有意想不到的bug，所以非常非常希望大家能参与到本项目进行测试，该项目可以保证给大家好的体验

---

## 0. 背景说明
- 本版基于原版进行优化、修bug、重构等操作共计21大条（详情可查看**优化方案.md文档**）
- 本版为特供版，不发布在官方仓库，且更新可能不会与官方同步（但应该能做到比官方勤），如果你有任何优化的思路（无论何种），你都可以在帖子内提出，全部都会看（可以@我。如果你对本项目感兴趣，想参与共创，可以私聊我，但请证明你的身份（避免恶意影响），暂不开放基于本版的二创权限）
- 目标：缓解渲染卡顿、统一扩展接口、简化导入流程、提升后端可观测性，提取SDK供各位作者使用（只要调用接口即可实现功能，因此只要你的产物可以调用这些接口就可）。
- 工具：SillyTavern 主仓库 + 自建脚本 + vs code，关键思路由 gpt5-codex 提供方向与校对。
- > 项目地址：(https://github.com/lin293387-del/SillyTavern-zh-cn.git) — 如果它对你有帮助，点个 👍 支持一下，谢谢喵~

---

## 1. 前端性能：虚拟化 & Worker 共同托底

| 模块 | 改进要点 |
| ---- | -------- |
| 虚拟化容器 | 聊天与角色列表采用 `VirtualList` + `scheduler.postTask`，帧耗控制在 16 ms。新增 `st-chat-render-start` / `st-chat-render-end` / `virtualization-toggle-complete` 等事件，扩展可完整掌握生命周期。 |
| 增量 diff | 大模板懒加载支持三次重试，失败时保留占位并打印中文提示；样式延迟加载使用优先级队列。 |
| Worker 调度 |宏替换、ZIP 解析统一迁移至 Web Worker，SharedArrayBuffer 提供消息池，`st-worker-task` 事件涵盖 start/complete/error/fallback。 |

---

## 2. 输入链路与内存治理

- **事件委托**：将 document 级监听替换为局部容器委托（`#chat`、`#left-nav-panel` 等），PointerEvent 默认 passive。
- **DOM 减脂**：利用 DocumentFragment 批量操作节点，`registerDynamicStyle()/releaseDynamicStylesFromElement()` 管理动态样式，避免重复 `<style>`。
- **内存治理**：
  - 聊天 iframe 在卸载时清理 blob URL、事件监听器与 ResizeObserver。
  - 大模板采用占位 + 异步 hydrate，记录哈希并在删除时自动释放缓存。
  - SHOWDOWN 模板引入 LRU 缓存，减少重复编译。

---

## 3. 配置与后端：API 开关、导入队列、指标输出

- `config.json`
  - `apiToggles` / `apiToggleLogging`：控制各后端可用性及拦截日志输出。
  - `extensionToastNotifications`：决定扩展启停、安装等操作是否弹出 toast 提示（SDK `notify` 参数可覆盖）。
- `/api/import/parse`：提供统一导入任务队列，配合 `IMPORT_TASK_*` 事件，可在前端监听进度。
- `/metrics`：支持 JSON 与 Prometheus 文本格式，集中输出缓存命中率、淘汰统计、队列积压等指标。
- JSON/body 限额重新规划，上传流程统一支持流式落盘，避免一次读取撑爆内存。

---

## 4. SDK：SillyTavern.extensions 总控台（这意味着现在大部分接口你可以直接使用平台为你提供的接口，且更方便，以docs优化文档/前端SDK说明.md文件为主）

### 4.1 子模块概览

```
SillyTavern.extensions = {
  events, messages, virtualization, workers,
  chat, worldInfo, characters, presets,
  ui, variables, prompts, backend,
  macros, templates, manager, errors
}
```

### 4.2 世界书、扩展管理等关键 API

- `worldInfo`
  - `books`: `list/load/save/create/delete/rename/duplicate/mutate/openEditor/reloadEditor/editorState/refreshList`
  - `entries`: `list/get/create/update/remove/duplicate/move/render`
  - `editor`: `open/reload/state/refresh`，并提供 `navigation`、`anchorPosition` 常量
- `manager`
  - `listInstalled/listDiscovered`
  - `enable/disable/install/remove/move/switchBranch/update/updateAll/checkUpdates`
  - `getBranches/getVersion/refresh/reloadPending/clearReloadFlag`
  - 返回值统一 `{ ok, message?, data?, extension?, reloadRequired }`
- 其他模块：`characters`（快照、重命名、删除…）、`presets`（列举/保存/删除）、`ui`（抽屉/Toast/Loader）、`variables`（读写 power_user/settings）、`prompts`（自定义提示词管线）等。

### 4.3 常见场景代码段

```javascript
const { variables, manager, worldInfo, characters, presets, events } = SillyTavern.extensions;

// 1. 修改 power_user 配置
await variables.updatePowerUser((draft) => {
  draft.enable_virtualization = true;
  return draft;
});

// 2. 提交导入任务并监听完成
const form = new FormData();
form.append('type', 'character');
form.append('file', someFileObject);
const { taskId } = await (await fetch('/api/import/parse', { method: 'POST', body: form })).json();
const dispose = events.on(events.types.IMPORT_TASK_COMPLETED, ({ detail }) => {
  if (detail.taskId === taskId) {
    console.log('角色导入完成:', detail.result);
    dispose.dispose();
  }
});

// 3. 向世界书写入条目
await worldInfo.books.mutate('备份世界书', ({ data, setOriginal }) => {
  const entry = worldInfo.entries.create('备份世界书', {
    comment: '自动添加条目',
    content: 'Hello, Tavern!',
    key: ['auto'],
  });
  setOriginal(entry.uid, 'comment', entry.comment);
}, { refreshEditor: true });

// 4. 重命名角色
await characters.rename(0, '新的角色名称');

// 5. 获取 OpenAI 预设列表
const openAiPresets = presets.list('openai');
console.log(openAiPresets);

// 6. 禁用扩展并根据状态提示
const result = await manager.disable('third-party/demo-extension', { reload: false });
if (result.reloadRequired) {
  SillyTavern.extensions.ui.showToast('info', '扩展已禁用，请刷新页面以加载最新状态');
}
```

> 注：导入任务示例依赖 `/api/import/parse` 队列基础配置，详见《后端异步执行.md》使用说明。

---

## 5. 一些小tips：

- “酒馆”依旧有无限潜力，优化过程中越深入发现其实在伟大，几乎无遗漏（虽然bug一坨...）
- 感谢 gpt5-codex。从方案推演、边界校验到代码审阅都给了我不少帮助。
- 若你也准备动手优化，欢迎参考docs优化文档文件夹内的文档，在帖子下留言交流。


