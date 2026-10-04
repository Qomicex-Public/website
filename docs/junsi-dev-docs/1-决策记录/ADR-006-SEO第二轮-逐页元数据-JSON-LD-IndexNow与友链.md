# ADR-006：SEO 第二轮：逐页独立元数据 + JSON-LD + IndexNow，以及 MCNav 友链

| 属性 | 内容 |
|---|---|
| 状态 | 已采纳 |
| 日期 | 2026-10-04 |
| 决策者 | AI Agent |

## 友链（同批工作）

MCNav（https://www.mcnav.net/）的站内公告明确要求「主动提交网站前请添加 MCNav 友情链接」，因此本站先挂友链、再提交收录。

- **位置**：关于页新增「友情链接 / Friends」区块。站内此前无友链位置；关于页已有卡片式区块（版本信息、开发者），直接沿用，无需新建页面。仅 1 条友链时新建 `/friends` 独立页与导航入口的成本不抵收益。
- **形式**：纯文字列表（站名 + 一句描述），不用图标/第三方图片——避免额外请求与对方图片失效导致破图。
- **数据**：`src/data/friends.ts`，描述取自对 MCNav 站点的实际访问结论（Minecraft 综合导航站），非编造；新增友链只需往数组追加一项。
- **卡片实现**：刻意复用同页兄弟卡片的完全一致写法（`div` + `rounded-xl border border-border bg-card p-6`），未使用 plugin-ui `Card` —— 后者会带来圆角/内边距差异，且需引入 SSR 守卫。区块标题手写 `h2` 保持标题层级。
- **rel 属性**：`target="_blank" rel="noopener"`，**不含 nofollow**。友链是互惠收录，加 nofollow 会使链接不计权重、被对方判定为无效友链，与「友链」语义相悖。
- 验证：卡片类名与同页兄弟卡片完全一致；`rel=noopener` 且无 nofollow；页面 h1 数量仍为 1；中英文描述均正确渲染；该 URL 恰好出现在 2 个关于页；零 `astro-island` / 零 `client:*`。

## 背景

用户提供第三方 SEO 分析报告（www.qomicex.top_SEOAnalysisSummary_2026_10_04.csv），列出 7 项问题：img 缺 ALT(10)、入站链接不足、描述重复(50 页)、描述过短(47 页)、标题过短(40 页)、未用 IndexNow(高)、缺 h1(高，2 页)。动手前对报告做了事实核查：①“缺 h1 2 页”已在上一轮修复（线上实测 0 页）；②“img 缺 ALT 10 处”不准确——线上/本地均为 0 处无 alt，只有 14 处 alt=""（header logo，属装饰性图片的标准写法）；③“未用 IndexNow”不准确——key 文件 511e7619b0c04f65824972919a831202.txt 已存在且线上 HTTP 200 可访问，缺的是主动推送步骤；④报告称“50 页/47 页/40 页”，但本站共 35 个 HTML、线上 sitemap 仅 14 条，数字明显失真（分析工具可能用了旧快照或含已迁移的 docs 子站）。但指出的问题类型是真实的：14 个内容页中确实有 12 页共用同一 description、8 页描述仅 63 字符、8 页标题仅 31-39 字符。经用户确认采纳四项：逐页独立描述、加长标题、接入 IndexNow、加 JSON-LD；空 alt 保留不改。

## 决策

①逐页独立元数据：Base.astro 新增 `page` 键参数，从 i18n 解析该页专属的完整 SEO 标题与描述（zh/en 双语共 14 个新键）；标题优先级为「首页规范标题 > 该页专属完整标题 > 页面名+品牌后缀」。同时修正了旧方案的一个实际 bug：原先给 title 统一追加品牌后缀，导致本就含品牌词的专属标题变成「关于 Qomicex Launcher（QML 启动器）… | Qomicex Launcher | QML 启动器」式重复，现专属标题不再拼接后缀。②JSON-LD：仅在首页 zh/en 输出 SoftwareApplication 结构化数据（name/alternateName/operatingSystem/softwareVersion/license/offers/isAccessibleForFree/inLanguage/sameAs/author），版本号取自 releases.json 保证与页面一致；用 set:html 输出避免 Astro 对对象做 HTML 转义；内页不输出，避免同一实体多份声明。③IndexNow：新增 scripts/indexnow.mjs（校验 key 文件存在且内容与文件名一致 → 读取 dist/sitemap-0.xml 取 URL → POST api.indexnow.org），并加 `npm run indexnow` script；脚本不挂进 prebuild（构建不应有外部副作用）。已实际执行一次，14 个 URL 返回 200 OK。④空 alt 保留 alt=""：这是装饰性图片（旁边已有品牌文字）的无障碍最佳实践，改成描述性 alt 会让屏幕阅读器把品牌名念两遍。舍弃：给友链加 nofollow（与互惠友链语义相悖）。

## 备选方案

### 方案 逐页独立元数据 + 首页 JSON-LD（已采纳）
- 优点：每页描述唯一，彻底消除重复内容；标题含真实关键词（平台名/功能名）；JSON-LD 从 releases.json 取版本号，与页面展示天然一致。
- 缺点：为每页写双语标题/描述需新增 14 个 i18n 键；JSON-LD 仅在首页，内页不输出（同一实体的多份声明反而会削弱信号）。
- 为何不选：直接解决报告点名的重复/过短问题，且与现有 i18n 双语架构一致。

### 方案 友链加 nofollow（未采纳）
- 优点：避免向外部站传导权重（SEO 保守做法）。
- 缺点：友链的 nofollow 会使链接不计权重，MCNav 会判定友链无效。
- 为何不选：友链为互惠收录，nofollow 与“友链”语义相悖，对方审核不会通过。

### 方案 友链放在新建 /friends 独立页（未采纳）
- 优点：友链集中展示、便于长期扩展。
- 缺点：需新建文件与新增脚本，但这是 IndexNow 唯一有效的接入方式（key 已在但无推送）。
- 为何不选：当前只有 1 个友链，新建页面+导航入口成本不抵收益；关于页已有卡片式区块，直接沿用。

## 影响
- src/i18n.ts：新增 seo.{about,download,versions,changelog,faq,legal}.{title,desc} 共 24 个双语键；改写 site.description 至 109/191 字符；新增 about.friends
- src/layouts/Base.astro：新增 page prop 解析专属标题/描述，标题优先级调整，首页注入 JSON-LD，导入 releases.json
- 12 个内页（about/changelog/download/faq/legal/versions × zh/en）：Base 加 page 键
- scripts/indexnow.mjs：新增（IndexNow 主动推送）；package.json 加 indexnow script
- 验证：构建 35 页；可索引页中标题<40 字符 0 页、描述<70 字符 0 页；14 个可索引页各具唯一描述；JSON-LD 恰好出现在 2 个首页且 JSON.parse 可解析；sitemap 仍为 14 条真实内容页；零 astro-island / 零 client:*；IndexNow 提交返回 200

## 修订记录
| 日期 | 版本 | 修改内容 | 修改人 |
|---|---|---|---|
| 2026-10-04 | v1.0 | 初版创建 | AI Agent |