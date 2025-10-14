## 监控与后台队列使用指南

### 1. 启用 `/metrics` 端点

- 在 `config.yaml`（或启动参数）中设置：

  ```yaml
  # Enable the `/metrics` endpoint
  server:
    exposeMetrics: true
    extensionsJsonLimitMb: 25   # 可选，覆盖扩展路由 JSON 限额
  ```

**server.extensionsJsonLimitMb 用来限定 /api/extensions/* 路由接受的 JSON 体积，目的是防止某些扩展一次性塞入超大配置把进程内存撑爆、或拖慢解析。默认值 25 MB 是一个折中：足以覆盖常见的扩展配置、元数据同步、少量资源清单，又不会让误操作或恶意请求瞬间占满内存。**

**推荐值可按以下思路调整：**

**只同步配置 / 元数据（大多数扩展）：保持 25 MB 即可。**
**扩展需要批量传输长文本、富媒体描述：可调到 50 MB 左右，但最好同步把传输拆分为分段接口或改用流式上传。**
**确实要推大批量二进制或压缩包：建议改走 multer 或自建上传端点，而不是继续抬 JSON 限额；否则一次请求会把数据复制多份并占用 GC 时间。**
**总之，限制应该与该路由里真实发送的数据类型成正比——越是结构化的小配置，越要保持小限额；**

- 重启服务后，以下端点可用：
  - `GET /metrics` 或 `GET /metrics/json`：返回 JSON 结构，包含缓存命中率、淘汰统计与队列积压。
  - `GET /metrics?format=prom` 或 `GET /metrics/prometheus`：返回 Prometheus text/plain 格式，可直接被 Prometheus/Vector 等采集。

```yaml
未启用 server.exposeMetrics 时，服务仍可正常运行和排队处理，但会失去以下能力：
- /metrics 与 /metrics/prometheus 不会暴露，无法在浏览器或 Prometheus 等监控系统中查看缓存命中率、淘汰次数、后台队列积压等指标。
- 扩展或运维无法通过统一接口确认新改动带来的资源压力（如缓存是否频繁 miss、队列是否堆满），需要手动查日志或使用自建脚本，排障成本更高。
- 队列处理逻辑仍会积累统计，但因为没有对外输出，这些数据无法被可视化或预警系统消费。
```
**换句话说，不启用仅意味着“没有指标可看”，不会影响现有功能，但会失去监控与自动化告警的基础。**


### 2. 缓存指标字段说明

- `sillytavern_cache_size{name="tokenizers"}`：当前缓存条目数。
- `sillytavern_cache_hits_total` / `sillytavern_cache_misses_total`：命中 / 未命中次数。
- `sillytavern_cache_evictions_total{reason="ttl|lru|manual"}`：按原因划分的淘汰次数。
- `sillytavern_cache_max_entries` / `sillytavern_cache_ttl_ms`：配置的上限与 TTL。

所有使用 `createCache(name, options)` 创建的缓存会自动登记指标，无需额外操作。

### 3. 队列指标字段说明

- `sillytavern_queue_size{name="extensions:tasks"}`：当前待处理任务数量。
- `sillytavern_queue_pending`：待处理 + 正在执行的任务总数。

可通过 `registerQueueMetric(name, collector)` 手动登记其他队列。

### 4. 扩展后台任务队列

- 服务启动时会创建 `queues:extensions`，扩展可在任意 Express 请求处理器中获取：

  ```js
  const queue = req.app.get('queues:extensions');
  queue.enqueue({ type: 'rebuild-avatar', handle: 'demo-user' });
  ```

- 队列默认处理器会触发 `serverEvents` 上的 `EVENT_NAMES.EXTENSION_TASK` 事件，可在服务扩展或自定义插件中注册处理器：

  ```js
  import serverEvents, { EVENT_NAMES } from '../server-events.js';

  serverEvents.on(EVENT_NAMES.EXTENSION_TASK, async (task) => {
    // 在此执行异步任务；抛出的异常会被捕获并写入日志
  });
  ```

- 如扩展需要完全接管处理逻辑，可直接调用 `queue.setProcessor(async task => { ... })`。请确保在自定义处理器内处理异常并在 `process.on('exit')` 钩子中清理资源。

### 5. 手动验证建议

1. `在浏览器控制台输入以下命令：
   ```js
   fetch('/metrics', { headers: { Accept: 'application/json' } })
     .then(res => res.json())
     .then(console.log);
   ```
   确认 JSON 输出包含 `caches` / `queues` 字段。
2. `curl -H "Accept: text/plain" http://localhost:8000/metrics`，确认返回 Prometheus 格式 （在项目内打开命令提示符输入）。
**你也可以在浏览器输入 http://localhost:8000/metrics?format=prom**
3. 通过扩展或临时脚本调用 `req.app.get('queues:extensions').enqueue({ demo: true })`，观察日志输出及 `/metrics` 中的队列积压是否增加；注册处理器后应自动清零。
4. 手动调用需要 TTL 的缓存（如 tokenizer 请求），观察命中率与淘汰计数是否变化。

如需将数据接入 Prometheus，可在 scrape 配置中添加：

```yaml
scrape_configs:
  - job_name: sillytavern
    metrics_path: /metrics/prometheus
    static_configs:
      - targets: ['localhost:8000']
```
