# 任务完成检查
- 确认 `npm run lint` 无错误（或针对修改范围执行局部 ESLint）
- 若涉及后端逻辑，考虑运行相关 API 手动测试或启动开发服务器验证
- 更新文档/配置示例（如 `config.yaml`、`README` 内说明）以保持一致
- 涉及依赖或构建流程调整时，检查 `post-install.js`、`webpack.config.js` 是否需同步修改
- 提醒用户备份数据目录 `data/`，避免在配置/迁移操作中丢失历史会话
- 在 Git 工作流中：查看 `git status` 确认改动范围，必要时添加说明性提交信息