# ADR-002：官网 SEO 优化：h1 语义补全 + 标题规范化 + OG/robots/sitemap 修复

| 属性 | 内容 |
|---|---|
| 状态 | 已采纳 |
| 日期 | 2026-10-04 |
| 决策者 | AI Agent |

## 背景

官网（Astro 7 静态站）SEO 审计发现五类缺陷：（1）首页 title 由 `pageTitle + titleSuffix` 拼接，当页面无 title 时回退到 `site.title`，产出「QML启动器 — QML启动器」品牌自我重复；（2）首页与关于页 h1 数量为 0（首页 h1 缺失为重构前既有问题，hero 区直接使用 h2），缺失页面主标题语义；（3）`og:image` 使用相对路径 `/og-image.webp`，社交平台无法解析，分享卡片图必然失效；且缺 `og:url`/`og:type`/`og:site_name`/`og:image:alt`/全部 twitter 标签；（4）`public/robots.txt` 完全不存在，爬虫无 sitemap 指引；（5）sitemap 收录 35 条 URL，其中 21 条是 `/docs/**`、`/en/docs/**`、`/tutorial/` 的 meta-refresh 跳转桩（文档站已迁至 docs.qomicex.top），且全部 URL 无 `lastmod`。用户要求优化 SEO，并将标题定为「Qomicex Launcher | QML 启动器」。

## 决策

分三块处理，全部不动视觉、不加运行时 JS、不引新依赖。（一）h1 语义补全：首页 zh/en 在 hero 容器顶部插入 `<h1 class="sr-only">`（含品牌词与定位关键词），logo 图片与布局完全不动，视觉风险为零——此方案依赖 `.sr-only` 被 Tailwind 生成，因该工具类此前无人使用，构建后已实测确认其出现在产物 CSS 中；关于页把 `AppInfoCard` 内应用名由 `<div>` 升为 `<h1>`，class 保持不变，依据是 Tailwind preflight 对 `h1` 施加 `font-size:inherit; font-weight:inherit` 并清零 margin，与 `div` 渲染一致（已从产物 CSS 取证实证，非推断）。（二）标题规范：新增 i18n 键 `site.homeTitle` 与 `site.h1`，`Base.astro` 以 `isHome`（pathname 为 `/` 或 `/en/`）分支——首页直接用 `site.homeTitle`（「Qomicex Launcher | QML 启动器 - 现代化的 Minecraft 启动器」），内页为「页面名 + site.titleSuffix（' | Qomicex Launcher | QML 启动器'）」，由此消除首页自我重复；原 `titleSuffix` 的破折号形式改为竖线分隔。（三）元数据与爬虫：`og:image` 改绝对 URL 并补 og:url/og:type/og:site_name/og:image:alt/twitter:card 等；新增 `public/robots.txt` 声明 sitemap；`astro.config.mjs` 的 sitemap 增加 `filter` 排除跳转桩（35→14 条真实内容页）与 `serialize` 补 `lastmod`（取 `src/data/last-fetch.json` 的 `updatedAt`，反映版本/下载数据新鲜度）、`changefreq: weekly`、`priority`（首页 1.0、其余 0.8）；5 个跳转桩页通过 `Base` 新增的 `noindex` prop 输出 `<meta name="robots" content="noindex, follow">`。舍弃方案：JSON-LD（SoftwareApplication）结构化数据——用户在多选确认中未勾选，按「不加未要求功能」原则不做，留待后续；把 logo 图片包进 h1——h1 可访问名将来自图片 alt，需额外兜底避免与 sr-only 文本重名，收益不抵复杂度。附带修复：上一轮组件库重构引入的回归——`AppInfoCard` 硬编码中文「版本」导致英文关于页显示中文，改为 `versionLabel` prop 由 zh/en 各自传入。

## 备选方案

### 首页 h1 的两种替代做法（已评估未采用）
- **把 logo 图片包进 `<h1>`**：优点是语义上「图形即标题」；缺点是其可访问名来自图片 `alt`，需额外处理避免与正文重名，收益不抵复杂度。
- **只改 title 不改 h1**：改动最小，但 hero 区无可见文本标题，缺失的 h1 语义仍需隐藏文本承担，等于没简化。

### 全站统一「品牌 | 定位词」标题（未采用）
所有页面都以品牌串开头、内页在末尾追加限定词。品牌曝光最强，但内页关键信息被挤到标题后段，反而降低长尾页面的点击识别度；最终选择首页用完整规范标题、内页以页面名打头。

### 保留跳转桩在 sitemap 中（未采用）
`/docs/**` 等页面仍能通过 sitemap 被发现，但它们是 meta-refresh 跳转桩，收录会消耗抓取预算并稀释站点质量信号；改为 `noindex` + sitemap 排除。

### JSON-LD 结构化数据（本次未做）
可注入 `SoftwareApplication` 结构化数据以获得富摘要。用户在多选确认中未勾选，按「不加未要求功能」原则留待后续。


## 影响
- src/i18n.ts：新增 site.homeTitle、site.h1（zh/en 各一套），site.titleSuffix 由 ' — QML启动器' 改为 ' | Qomicex Launcher | QML 启动器'
- src/layouts/Base.astro：isHome 标题分支、noindex prop、ogImage 绝对 URL、补齐 OG/Twitter 元数据
- src/pages/index.astro 与 src/pages/en/index.astro：hero 顶部新增 sr-only h1
- src/components/about/AppInfoCard.tsx：应用名 div→h1、新增 versionLabel prop（修复英文页「版本」硬编码回归）
- src/pages/about.astro 与 src/pages/en/about.astro：传入 versionLabel
- src/pages/{docs/index,docs/[slug],en/docs/index,en/docs/[slug],tutorial}.astro：Base 加 noindex
- public/robots.txt：新增
- astro.config.mjs：sitemap filter（排除跳转桩）+ serialize（lastmod/changefreq/priority）
- 验证结果：35 页构建通过；内容页 h1 全为 1、跳转桩 h1=0 且全部 noindex（0 处失败）；sitemap 14 条 URL 无跳转桩残留、lastmod 覆盖率 14/14；robots.txt 已输出；astro-island 0、client: 指令 0（零运行时 JS 未被破坏）

## 修订记录
| 日期 | 版本 | 修改内容 | 修改人 |
|---|---|---|---|
| 2026-10-04 | v1.0 | 初版创建 | AI Agent |