# ADR-001：官网重构：采用 plugin-ui + Astro Islands 静态渲染方案

| 属性 | 内容 |
|---|---|
| 状态 | 已采纳 |
| 日期 | 2026-10-04 |
| 决策者 | AI Agent |

## 背景

官网（Astro 7 静态站）原有 UI 全部为手写 `.astro` + Tailwind 类名，与 Qomicex Launcher 桌面端已统一的 `@qomicex/plugin-ui`（React 19 + Tailwind 3）组件库存在视觉语言漂移，两端品牌观感不一致，且同类 UI（卡片、按钮、徽章、表格）在两端重复实现、分别维护。

约束：官网是纯静态站，必须保持「零运行时 JS / 首屏无水合开销」这一既有性能特征；SEO 语义（标题层级、链接、文案）不可退让。

## 决策

采用 **Astro Islands 静态渲染 + 中心 SSR DOM 守卫** 方案：

1. 在 Astro 中接入 `@astrojs/react`，把各页内联 UI 块重构为 React `.tsx` 岛组件；`.astro` 壳层只负责数据获取与 i18n（frontmatter 里 `t()`），岛组件只负责 UI，props 保证 JSON 可序列化。
2. **全程不添加任何 `client:*` 指令**——React 组件仅在构建期 `renderToString`，产物 HTML 中不出现 `astro-island`，页面零 JS 交付（实测 `astro-island` 标签数 = 0，无渲染器 chunk 被引用）。
3. 所有使用 `Card`/`Dialog`/`Popover`/`Tooltip` 等库组件的岛，**首行统一 `import '../../lib/ssr-dom-shim'`**（全站唯一守卫）：plugin-ui 的 `Card` 经 `useMaterial()` 在 `useState` 初始化器中读取 `document.documentElement`，无客户端水合时 Node 端 `renderToString` 必然抛 `ReferenceError: document is not defined`；守卫在 `document` 缺失时注入最小 stub（`dataset` + `style.getPropertyValue`），幂等且服务端专用。
4. `CardTitle` 渲染为 `<div>`，凡承载原 `h2`/`h3` 语义的标题一律手写真实标题元素，不用 `CardTitle` 顶替。
5. 依赖交互状态的组件（`Tabs` 需要 `onChange` + `useEffect`）在无 JS 约束下会渲染成「点不动的死头部」，**禁用**；改用并列卡片、`Badge` 或原生 HTML（如 FAQ 用原生 `<details>`，天然零 JS 可折叠）。
6. 视觉保真优先于「用上组件」：找不到对应物或套壳会造成观感劣化的块，保留原样并在交付说明中记录，不硬套。
7. 既有 vanilla `<script>`（移动端菜单、下载模态框、轮播、`data-animate` 观察器、文档 TOC）一律原样保留，由它们继续承担交互。

## 备选方案

### 备选 H5：改用 `client:load` / `client:visible` 水合，让交互组件真正可用
- 优点：`Tabs`/`Dialog` 等交互组件可直接使用，代码更贴近桌面端写法。
- 缺点：每个岛都会把 React 运行时（约 215KB）注入页面，首屏多一次 JS 下载与执行，静态站的性能特征被破坏。
- **为何不选**：与「零运行时 JS」硬约束直接冲突；本站在桌面端已提供完整功能页，官网交互需求可由既有 vanilla 脚本承担。

### 备选 2：不接组件库，继续维护手写 Astro UI
- 优点：零新增依赖、零构建链改动、零 SSR 风险。
- 缺点：与桌面端视觉语言持续漂移，组件重复实现、样式改一处要改两处，长期维护成本更高。
- **为何不选**：本次需求即为「用官方组件库统一」，且实测接入成本可控（仅需 SSR 守卫 + 少量保真取舍）。

### 备选 3：全站一次性替换为 React SPA
- 优点：组件复用最彻底，交互最自由。
- 缺点：需重做路由、i18n、内容集合管线；丢失 Astro 的静态产物与 SEO 优势；改动量与回归面远超本次范围。
- **为何不选**：典型过度重构，风险与收益不成比例。

## 影响

- `src/components/` 新增岛组件：`Header.tsx`、`Footer.tsx`、`DownloadButton.tsx`、`index/{FeatureCard,StatBadge,CtaButton}.tsx`、`download/{PlatformCard,CompatibilityCard}.tsx`、`versions/VersionList.tsx`、`changelog/ReleaseEntry.tsx`、`faq/FaqItem.tsx`、`about/{AppInfoCard,ContributorCard}.tsx`。
- `src/pages/` 更新 12 个页面文件（index / download / versions / changelog / faq / about 的 zh + en）。
- `src/lib/ssr-dom-shim.ts`（新增）：全站唯一 SSR 守卫，Card 类岛强制引用。
- `astro.config.mjs`：新增 `react()` 集成。
- `tailwind.config.js`：改用 `@qomicex/plugin-ui/tailwind-preset`，`content` 追加扫描包 `dist`。
- 新增依赖：`@qomicex/plugin-ui@0.2.8`、`@astrojs/react`、`react@19`、`react-dom@19`。
- 构建产物：35 页，`astro-island` 标签 0，无渲染器 chunk 引用，零新增安全告警。
- 遗留：`src/layouts/DocsLayout.astro` 未 Island 化（其交互全部由既有 vanilla TOC 脚本驱动，套组件库无净收益，按保真原则保留）。
- 遗留：首页 `h1` 数量为 0 属**重构前既有问题**（HEAD 版本同样无 `h1`），本次未擅自变更，另案处理。

## 修订记录

| 日期 | 版本 | 修改内容 | 修改人 |
|---|---|---|---|
| 2026-10-04 | v1.0 | 初版创建 | AI Agent |
| 2026-10-04 | v1.1 | 修正备选方案（原版把已采纳方案误列为备选、理由写成优点） | AI Agent |
