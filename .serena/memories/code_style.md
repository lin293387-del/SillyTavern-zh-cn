# 代码风格
- 后端与构建脚本使用 ECMAScript Module 语法（`type: module`），插件目录允许 CJS；前端脚本混合模块与全局挂载
- ESLint 规则见 `.eslintrc.cjs`：单引号、4 空格缩进、必须分号、对象花括号留空格、禁止未使用变量、允许浏览器全局
- JSDoc 插件启用但当前仅做轻度校验（`jsdoc/no-undefined-types` 警告）
- 结构化目录区分服务器端 (`src/**`)、静态前端 (`public/**`)、插件 (`plugins/**`)、测试 (`tests/**`)
- 代码中广泛使用 async/await，注意服务器启动流程（预/后置任务）遵循模块化函数
- 配置文件主要是 YAML（`config.yaml`），建议保持键名小写、布尔值使用未加引号的 true/false