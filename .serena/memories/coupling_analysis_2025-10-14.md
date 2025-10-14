# 2025-10-14 前后端耦合分析
## 前端主控 `public/script.js`
- 文件超 16k 行，集中管理聊天、角色、扩展、设置等所有 UI 逻辑，是绝大多数浏览器逻辑的单点（如 `createChatInputApi`, `addOneMessage`, VirtualList 生命周期等）。
- `messageDomRegistry`（~1293 行）维护消息 id→DOM 的全局索引，供扩展和虚拟化使用；任何 DOM 重构需要同步更新注册与清理逻辑，否则 `notifyMessageMounted/Unmounted` 事件会失配。
- `configureChatEvents` 调用（~1397 行）将 `chat` 数据、DOM 注册器、虚拟化开关注入 `chat-events` 模块；修改这些依赖时必须保持接口一致，避免消息生命周期事件缺失。
- `initChatVirtualList`（~1408 行）实例化虚拟滚动并依赖 `handleVirtualMessageMount/Unmount`；调整虚拟化参数需同步检查顶部“展示更多消息”入口和 `chatRenderStart` 的分页逻辑。
- `createChatInputApi`（~600 行）暴露统一的草稿读取/写入/提交接口，会触发 `emitDraftChanged/Submitted/Reset`，是扩展 SDK 的公共入口；改动输入框事件链要保证这些事件仍能触发。

## 聊天事件广播 `public/scripts/chat/chat-events.js`
- 定义虚拟化 DOM 事件常量并映射到 `dispatchMessageLifecycle`；`broadcastChatRender` 会聚合消息 id 再通过 `safeEmit` 同步给扩展和 DOM，自带 rAF 合帧节流。
- `notifyMessageMounted/Unmounted` 既更新注册表又触发生命周期事件；若调用路径遗漏 `broadcastChatRender` 会导致扩展无法得知刷新原因。
- `scheduleChatRender` 维护全局帧调度 state，多处调用共享 `pendingChatRenderIds/pendingChatRenderReason`；需要保持原子性防止交叉渲染。

## 渲染调度 `public/scripts/chat/render-task-queue.js`
- 定义 pipeline/media/extension 三路队列，限制总长度 150；在 `dropLowPriorityTasks` 内可丢弃 allowDrop=true 的扩展任务，还会记录指标到 `renderTaskObservers`。
- `ensureScheduler` 优先使用 `requestIdleCallback`，否则退化到 rAF；任何新增任务必须设置 `queue`、`allowDrop`、`onDrop`，否则会破坏节流策略。
- 调试日志走 `console.info('[renderQueue]'...)`，与 `window.__renderTaskDebug__` 配合；关闭调试需检查 `power_user` 或配置。

## 服务端主流程 `src/server-main.js`
- 启动时配置 CSP/压缩/响应时间/Session/CSRF 等中间件；`cliArgs` 控制是否启用 BasicAuth、白名单、CORS 反代。
- `createTaskQueue('extensions:tasks')`、`createTaskQueue('import:parse')` 与 `registerImportProcessors` 将前端扩展任务与导入解析异步化；关闭队列前会在 `process.exit` 清理。
- 默认 JSON 限额来源于 `config.json` (`server.defaultJsonLimitMb` 等)，并在特定路由覆盖；调整限额必须同时更新 `docs/request-body-limits.md`。
- CORS 代理、访问日志、host 白名单耦合 `cliArgs`; 重构时要保留 `cliArgs.listen`, `enableCorsProxy`, `basicAuthMode` 等 CLI flag。

## 聊天后端 `src/endpoints/chats.js`
- 管理聊天备份（`backupChat`/`getBackupFunction`），依赖 `createCache('chats:backup-functions', ttl/max)` 实现节流；优化备份逻辑需确保 flush/evict 调用。
- 支持多个导入格式（Agnai、Ooba、CAI 等），并与 `generateTimestamp`, `humanizedISO8601DateTime` 等工具耦合；调整数据结构需同步更新导入/导出和前端解析。
- 使用 `multer` 上传、流式复制和 JSONL 写入；修改上传路径时要考虑 `validateAvatarUrlMiddleware`、`cleanUploads`。

## 潜在改动风险
- 前端 DOM/虚拟化：任何 DOM 结构或事件链调优需同步更新 `messageDomRegistry` 注册、`chat-events` 生命周期广播及扩展 SDK 事件，否则第三方扩展会失灵。
- 渲染调度：压缩/扩展 `render-task-queue` 时要维持三队列配额和 `MAX_TOTAL_QUEUE_LENGTH`，避免非虚拟化模式出现任务堆积导致 UI 冻结。
- 输入框/草稿：`createChatInputApi` 的事件用于扩展草稿同步，改动 textarea 组件时必须保证 `ensureChatInputDomListeners` 仍能挂载。
- 服务端 JSON 限额/中间件：优化请求限额或会话设置时需更新 `getConfigValue` 默认值并确认 CSRF、Session 中间件顺序不变，防止登录态或 API 调用失效。
- 队列/导入：`importTaskQueue` 与 `registerImportProcessors` 需要在退出时 close；重构为外部消息队列时要保留 `app.set('queues:*')` 供路由/扩展获取。
- 聊天备份：修改节流配置需确保 `process.on('exit')` flush，以及 `removeOldBackups` 行为不被破坏。

> 后续重构建议：优先在局部模块（如 `public/scripts/chat/` 子模块）引入 TypeScript 类型或单元测试，避免一次性触碰 `public/script.js` 主体；若要拆分主脚本，可先在扩展 SDK 层建立稳定接口以保护现有扩展。