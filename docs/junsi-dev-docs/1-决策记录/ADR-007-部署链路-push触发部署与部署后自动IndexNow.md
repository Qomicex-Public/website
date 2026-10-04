# ADR-007：部署链路修复：push 触发部署，并在部署成功后自动推送 IndexNow

| 属性 | 内容 |
|---|---|
| 状态 | 已采纳 |
| 日期 | 2026-10-04 |
| 决策者 | AI Agent |

## 背景

用户要求「npm run indexnow 应该在每次部署时自动」。排查中发现更根本的问题：**push 不会触发部署**。证据链：①`git ls-remote` 显示远端 master 已含本地全部提交（d109425）②线上站点仍为旧版（首页无 JSON-LD、关于页无友链，而本地 dist 两者都有）③`.github/workflows/vercel-redeploy.yml` 的触发条件仅 `schedule: '0 0 * * *'` 与 `workflow_dispatch`，无 push。这意味着此前的 SEO 改动与友链要等到次日 00:00 UTC（北京 08:00）才上线——这正是用户此前反馈「修复都没用」的真实原因：并非改动无效，而是根本没部署。此外 IndexNow 此前只是一个人工命令，完全未自动化。

## 决策

把 IndexNow 挂在**真正执行部署的 workflow** 里，并排在部署步骤之后。具体：①新增 `push: branches: [master]` 触发，使 push 即部署；加 `paths-ignore`（docs/**、.memory/**、*.md）避免纯文档改动触发无意义重部署。**关键细节**：paths-ignore 最初写作 `'**.md'`，但该模式会匹配 `src/content/docs/**/*.md` —— 那 18 个 Markdown 是文档页的内容源，忽略它们会导致内容更新被漏部署；已收窄为 `'*.md'`（仅仓库根）并用路径表逐一验证 glob 语义。②加 `concurrency(group: deploy-production, cancel-in-progress: true)`，避免连续 push 时多次部署互相覆盖、以及向 IndexNow 重复提交同一批 URL。③Node 18 → 22：`package.json` 的 engines 要求 `>=22.12.0`，原配置会让 `npm ci` 因引擎不匹配失败。④新增「部署后」步骤执行 IndexNow：顺序至关重要——部署完成前提交 URL 会让爬虫抓到 404，损害收录信任度。⑤该步骤先**轮询线上站点可达**（而非裸 sleep），避免打向仍在收敛的边缘节点。⑥`indexnow.mjs` 增强：`--live` 从线上 sitemap 取 URL（保证提交集合正是刚部署上线的那批）、`--dry-run` 预览、提交前 host 校验（IndexNow 对非本 host 返回 422）、部署后首几秒的缓存穿透重试。舍弃方案：新建独立 push 触发 workflow（实测 push 不触发 Vercel 部署，独立 workflow 无从得知部署何时完成；且会与部署流程并行导致时序错乱，已写完并删除）；把 indexnow 追加到 build 末尾（构建完成 ≠ 已上线）；仅保留每日定时（与 IndexNow 的时效价值相冲）；裸 sleep 替代轮询（部署耗时波动，不可靠）。

## 备选方案

### 方案 保持每日定时部署，只把 indexnow 挂上去（未采纳）
- 优点：改动最小，不增加部署频率。
- 缺点：每日仅有 1 次部署，内容更新最长延迟 24 小时；与 IndexNow 追求的「快速收录」目标矛盾。
- 为何不选：用户明确选择加上 push 触发；且 24 小时延迟与 IndexNow 的价值相冲。

### 方案 把 indexnow 追加到 npm run build 末尾（未采纳）
- 优点：只改一行，不进 workflow。
- 缺点：Vercel 构建完就推，但此时流量尚未切换，提交的 URL 可能 404（短暂但存在）。
- 为何不选：时序错误：部署是异步的（构建→上传→切流量），构建完成≠已上线。

### 方案 新建 push 触发的独立 IndexNow workflow（未采纳，已写后删除）
- 优点：职责单一。
- 缺点：需新建独立 workflow，但会与部署流程职责分离，且无法保证「部署成功后」这一时序。
- 为何不选：实测 push 不触发 Vercel 部署，独立 workflow 无法知道部署何时完成；且会与部署 workflow 并行导致时序错乱。

### 方案 用 sleep 固定等待替代轮询（未采纳）
- 优点：实现更简单。
- 缺点：无变更时每日重复提交同一批 URL，IndexNow 可能视为无效提交。
- 为何不选：固定等待不可靠（部署耗时波动），轮询线上可达是可靠信号。

## 影响
- .github/workflows/vercel-redeploy.yml：更名为 Deploy & IndexNow；新增 push 触发 + paths-ignore + concurrency；Node 18→22；新增部署后「等待线上就绪」与「Ping IndexNow」两步
- scripts/indexnow.mjs：新增 --live（读线上 sitemap）/ --dry-run / 提交前 host 校验 / 带重试的 fetchText
- package.json：无需改动（indexnow script 已存在）
- 验证：workflow 经 js-yaml 真实解析通过；步骤顺序 部署(4)→IndexNow(6)；paths-ignore 语义逐例验证（内容源 .md 触发部署、项目文档不触发）；node scripts/indexnow.mjs --live 返回 200 OK；push 后约 60 秒线上即含最新改动（JSON-LD 与新描述均上线）；GitHub Actions Run #188 显示 on: push 且 completed successfully (49s)——IndexNow 为最后一步，若失败 job 会标红，故证明其已被自动执行；线上核验 6 项标记全部 ✓，sitemap 仍为 14 条

## 修订记录
| 日期 | 版本 | 修改内容 | 修改人 |
|---|---|---|---|
| 2026-10-04 | v1.0 | 初版创建 | AI Agent |