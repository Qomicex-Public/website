# ADR-003：修复「下载正式版」跳转 GitHub 页：GitHub releases 分页截断导致正式版数据缺失

| 属性 | 内容 |
|---|---|
| 状态 | 已采纳 |
| 日期 | 2026-10-04 |
| 决策者 | AI Agent |

## 背景

官网「下载正式版」按钮点击后不直接下载安装包，而是跳转到 GitHub 的 release 页面。逐层排查：前端 index.astro/download.astro 的下载逻辑为 `const stable = releases.find(r => !r.prerelease)`，点击后经 `matchAsset(stableAssets, ...)` 匹配当前平台资产，匹配失败才 fallback 到 release 页。探针实测发现 `releases.json` 中 `prerelease=false` 的条目数为 **0**，而 `stableAssets=[]` 使 `matchAsset()` 对所有平台必然返回 null。进一步用 API 实测：GitHub 上**确实存在**正式版 `v0.1.0-release1.0`（prerelease=false，30 个资产，`/releases/latest` 即指向它），故问题定位在「数据未被抓取到」而非「代码逻辑错误」。根因：`scripts/fetch-site-data.mjs` 请求 GitHub `/releases` 时**未带分页参数**，而该端点默认只返回 30 条并按 `created_at` 降序；正式版创建于 2026-08-12，其后又产生 40+ 个 beta，实测在全部 80 条中排第 45 位，被挤出首页。该缺陷在重构前提交 `e551120` 中已存在（已核对该行代码），非本次重构引入。

## 决策

在 `scripts/fetch-site-data.mjs` 中新增 `fetchAllReleases()`：以 `per_page=100` 请求并跟随响应 `Link` 头的 `rel="next"` 翻页（上限 20 页作防御），取代原先的单次请求。实测抓取条数 29→38，正式版 0→1。同时修复一个相邻隐患：原 `fetchJSON` 的 fallback 会把 GitHub 原始结构（`tag_name`）与已归一化缓存结构（`tagName`）混用，且网络失败时会将 `releases.json` 覆盖为空数组（本次构建中已实际复现）；现改为「抓取全部失败则复用上次归一化缓存并在 stderr 告警」，保证线上版本列表不会被清空。排序保持 GitHub 默认（与 GitHub 网页一致）。未采用「仅前端回退到最新 beta」，因为那会把测试版当作正式版展示，属语义错误而非修复。

## 备选方案

### 仅前端在无正式版时回退到最新 beta（未采纳）
- 优点：改动最小，能立即消除「跳 GitHub 页」。
- 缺点：语义错误——会把 beta 当作「正式版」展示，用户下载到的是测试版而非正式版，反而制造新的误导；且完全不解决数据缺失本身。
- 为何不选：以错误语义掩盖数据缺失。正式版在 GitHub 上真实存在，只是未被取回，修数据源比改 UI 语义更正确。

### 改按 published_at 自行排序（未采纳）
- 优点：理论上更贴近「最新发布」的直觉。
- 缺点：不解决根本问题——正式版的 published_at 同样在 09-13，仍会被 40+ 个更新的 beta 压在 30 名之外；且会与 GitHub 网页展示顺序不一致。
- 为何不选：与 GitHub 默认排序保持一致更符合用户预期。

### 在抓取失败时写入空数组（原行为，已修正）
- 缺点：网络抖动的单次失败即会导致线上版本列表与下载页整片变空（本次构建中已实际复现）。
- 为何不选：数据可用性风险过高，现改为回退复用上次归一化缓存并在 stderr 告警。

## 影响
- scripts/fetch-site-data.mjs：新增 fetchAllReleases() 分页取数；调用点替换；修正 fallback 结构冲突；增加抓取失败保护与告警
- src/data/releases.json：29→38 条，正式版 0→1（v0.1.0-release1.0）
- 上游页面自动恢复：src/pages/index.astro、en/index.astro（首页「下载正式版」按钮）、src/pages/download.astro、en/download.astro（正式版面板与下载链接）
- 验证：反向测试成立（修复前 0 passed/10 failed，修复后 10 passed/0 failed）；构建 35 页通过；Playwright 端到端实测 zh/en 首页与下载页点击「下载正式版」均得到 /releases/download/v0.1.0-release1.0/...x64-setup.exe（直接下载，非 release 页）；测试版按钮未受影响；下载页恢复正式版+测试版双面板

## 修订记录
| 日期 | 版本 | 修改内容 | 修改人 |
|---|---|---|---|
| 2026-10-04 | v1.0 | 初版创建 | AI Agent |