# SillyTavern 提示词构建系统分析

## 1. 总体架构概览
- 提示词构建链路围绕 PromptManager、OpenAI 特定组装逻辑与通用 ChatCompletion 容器展开：PromptManager 负责管理提示模板与用户配置，OpenAI 模块将模板与实时上下文合并，最终交由 ChatCompletion 负责 token 预算、消息集合与输出。
- `Generate` 作为统一入口，将聊天上下文、扩展数据、Quiet Prompt 等汇集后调用 `prepareOpenAIMessages`，随后依据 API 类型选择发送实现。

## 2. 核心组件与职责
- **PromptManager**（`public/scripts/PromptManager.js:302`）：管理系统/自定义提示、分组拖拽顺序、启用状态，`preparePrompt` 负责对单个模板执行变量替换并返回 `Prompt` 实例。
- **PromptCollection**（`public/scripts/PromptManager.js:180` 起）：保证提示顺序、提供覆盖与查找能力，支持扩展在主提示缺失时注入占位条目。
- **OpenAI 适配层**（`public/scripts/openai.js:1274` 及以后）：`preparePromptsForChatCompletion` 汇总系统提示与 PromptManager 输出，`populateChatCompletion` 将 Prompt 集合转成消息集合并处理插入策略。
- **ChatCompletion 与 MessageCollection**（`public/scripts/openai.js:3037`, `public/scripts/openai.js:3144`）：统一管理 token 预算、消息扁平化、提示覆盖记录以及日志输出。
- **消息实体 Message**（`public/scripts/openai.js:2802`）：支持文本/图像/视频嵌入与 token 统计，保证发送给模型的数据结构一致。

## 3. 提示词来源与注入策略
1. **基础系统提示**（`public/scripts/openai.js:1284-1323`）
   - 角色描述、人格、场景、World Info 前后块以 system 角色加入。
   - Quiet Prompt、Group Nudge、Bias 等按固定标识符写入，便于 PromptManager 覆盖。
2. **扩展与插件**（`public/scripts/openai.js:1305-1330`）
   - Tavern Extras、Vectors、ChromaDB 等以 `extensionPrompts` 注册，支持 `position` 与 `role`。
   - 未识别扩展需通过 `extension_prompt_types` 限制注入位置。
3. **PromptManager 配置**（`public/scripts/PromptManager.js:1510-1576`）
   - `getPromptCollection` 基于按角色排序表（全局或角色特定）抽取启用提示，支持按生成类型(`generationType`)触发。
   - 主提示禁用时提供空字符串占位以维持扩展相对插入逻辑。
4. **角色覆盖与禁用**（`public/scripts/openai.js:1344-1366`）
   - `systemPromptOverride` 与 `jailbreakPromptOverride` 在允许覆盖时替换原始内容，并调用 `preparePrompt` 重新执行替换。
5. **聊天历史与消息示例**（`public/scripts/openai.js:870-987`）
   - `populateChatHistory` 依据 token 预算拼接历史消息、工具调用结果以及 continue/quiet 相关提示。

## 4. 变量替换与宏体系
- **环境构建**：`substituteParams`（`public/script.js:7131`）调用 `buildSubstituteEnvironment`（`public/script.js:7060`）生成包含用户、角色、群组、角色卡字段、模型名的环境对象；支持群组静音成员过滤与单次 `original` 占位输出。
- **宏阶段**：`evaluateMacros`（`public/scripts/macros.js:575`）依序执行预处理宏（固定标签、骰子、变量命令）、环境变量宏与后置宏（时间、历史消息、反转字符串等）。
- **变量命令**：`getVariableMacros`（`public/scripts/variables.js:363`）提供 {{setvar}}、{{getvar}}、自增/自减等指令，默认写入聊天作用域变量。
- **变量服务**：`variableService`（`public/script.js:3114`, `public/scripts/variable-service.js:494`）为变量操作提供统一事务、订阅、持久化接口，作用域涵盖消息、聊天、全局、角色、脚本；`setLocalVariable`/`setGlobalVariable`（`public/scripts/variables.js:177`, `public/scripts/variables.js:206`）在服务不可用时回退到旧存储。
- **扩展宏**：`substituteParamsExtended`（`public/script.js:7045`）允许附加自定义 macro 并重用主流程，扩展模板（记忆、表达等）大量使用该接口。

## 5. 提示词构建流程
1. **PromptManager 准备**：`setupChatCompletionPromptManager`（`public/scripts/openai.js:661`）懒加载 PromptManager，并在设置加载后保持 UI 同步。
2. **集合生成**：`getPromptCollection` 根据排序表与触发条件选择 Prompt，调用 `preparePrompt` 进行变量替换（含群组成员追加），并记录覆盖状态。
3. **集合合并**：`preparePromptsForChatCompletion` 将系统提示与 PromptManager 集合合并，如果集合中存在同名标识符则继承 `role、position、injection_depth/order` 等配置。
4. **控制提示**：Quiet Prompt、Impersonation、Bias、扩展控制提示在 `populateChatCompletion` 被集中处理，保证顺序与 token 预算。
5. **绝对/相对注入**：PromptManager 中 `injection_position` 为 `ABSOLUTE` 的提示在聊天历史插入前处理，其余相对提示按标识符顺序插入。

## 6. 消息打包与发送链路
- **消息构建**：`populateChatCompletion` 将 Prompt 转成 `MessageCollection` 并按顺序加入 `ChatCompletion`，同时处理 Chat History、Examples、Tool Calls 及 Quiet Prompt 特殊逻辑。
- **预算管理**：`ChatCompletion` 通过 `reserveBudget`/`freeBudget`（`public/scripts/openai.js:3232`）扣减或释放 token，超过预算会抛出 `TokenBudgetExceededError`。
- **扁平化输出**：`ChatCompletion.getChat`（`public/scripts/openai.js:3335`）将嵌套集合扁平化，形成最终 `messages` 数组供 API 调用。
- **Generate 入口**：`Generate`（`public/script.js:10240`）在非 dry-run 时执行 Slash 命令、扩展拦截、WI 计算与 Quiet Prompt 调整，之后调用 `prepareOpenAIMessages` 并记录 token 统计。
- **发送实现**：`sendOpenAIRequest`（`public/scripts/openai.js:2178`）根据 `chat_completion_source` 组装参数，兼容自定义代理、logit bias、工具调用、流式返回等；`sendStreamingRequest`（`public/script.js:12143`）在开启流式时委托到对应后端。

## 7. 优化关注点与建议
1. **PromptManager 渲染性能**：`renderPromptManager`/`renderPromptManagerListItems`（`public/scripts/PromptManager.js:1773` 起）使用防抖与 DOM 局部刷新，优化时须保持 `overriddenPrompts` 与计数刷新逻辑。
2. **Token 统计并发**：`recalculatePromptTokens`（`public/scripts/PromptManager.js:1605`）对每个提示并行统计 token，需要避免重复触发造成未决 Promise 堆积。
3. **宏执行成本**：`buildMacroStages` 会为每次替换生成完整宏列表，若要缓存需确保 `nonce` 与单次 `original()` 语义不受影响。
4. **变量服务事件量**：`variableService` 支持监控与批量事件（`public/scripts/variable-service.js:518-720`），新增变量相关功能时应考虑订阅器性能与事务回滚策略。
5. **Quiet Prompt & Continue 场景**：`populateChatHistory`、`modifyLastPromptLine`（`public/script.js:10760` 起）对静默生成有专门路径，重构时需验证 continue/quiet、工具调用与 instruct 模式的兼容性。
6. **多后端兼容**：`sendOpenAIRequest` 对不同供应商执行字段裁剪，扩展新特性时应保持分支独立，避免破坏已有模型的必需参数。

---
本文档以 UTF-8（无 BOM）编码保存，供后续提示词优化与重构参考。