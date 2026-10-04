# ADR-004：官网综合优化：Header 品牌与 Tabs 化导航、CTA 去发光、统计千分位、返回顶部、下载页去 AI 感重构

| 属性 | 内容 |
|---|---|
| 状态 | 已采纳 |
| 日期 | 2026-10-04 |
| 决策者 | AI Agent |

## 背景

官网为 Astro 7 静态站，全站硬约束「零运行时 JS」（构建期 renderToString，无 client:* 指令），已接入 @qomicex/plugin-ui。本轮用户提出 7 项优化：Header 品牌文案与标题改动对齐、首页主下载按钮去「AI 发光」、统计数字千分位、Header 导航改 Tabs 组件、新增一键返回顶部，并发起一轮「下载页去 AI 生成感」重构（参考 Apple/Microsoft/GitHub/JetBrains 的克制设计，保留深色主题与品牌绿，不新增装饰元素，不改业务逻辑）。经代码勘查：首页 CTA 使用硬编码 green-500 并叠加 shadow-lg+绿色光晕+hover 位移+active 缩放；下载页「正式版/测试版」是两张带彩色边框与背景填充的 Card，CTA 区同时存在「下载正式版」主按钮与「下载测试版」文字链两个竞争入口；「兼容平台」用 Card 壳包表格；统计文案为「总下载 1446 次」（无千分位）。关键约束冲突：读 node_modules/@qomicex/plugin-ui/dist/components/Tabs.js 证实 Tabs 为受控组件（onClick 仅回调 onChange；指示器初始 width:0/height:0，尺寸靠 useEffect 读 offsetWidth 写入），在无 client:* 的静态站中会导航失效且指示器不可见，而导航本质是跨页跳转。

## 决策

七项全部在「零运行时 JS」与「不改业务逻辑」两条硬约束下完成。（1）Header 品牌统一为「Qomicex Launcher」（zh/en 同），与首页 title 品牌词对齐。（2）首页 CTA 去发光：移除 shadow-lg/shadow-green-500/30 绿色光晕、hover:shadow-xl、hover:-translate-y-0.5 位移与 active:scale，颜色由硬编码 green-500 改为品牌绿 bg-primary，过渡改为 transition-colors，尺寸 h-14→h-11、rounded-xl→rounded-lg，与下载页 CTA 统一。（3）统计千分位：i18n 新增 formatNumber()（toLocaleString('en-US')），stats.downloads 文案由「总下载 {n} 次」改为「{n} 次下载」，首页 badge 与页脚共用同一 key 同时生效。（4）Header 导航改「Tabs 视觉语言」：不套用受控 Tabs 组件，改为横排等高 <a> + 当前页 border-primary 底部指示条 + aria-current="page"，移动端降级为纵向列表。（5）一键返回顶部：Base.astro 全站注入 <a href="#top">（html 已设 scroll-behavior:smooth，无需新增），极小 vanilla 脚本按 scrollY>400 切换 opacity/pointer-events，无 JS 时保持隐藏不占位。（6）下载页去 AI 感：标题 text-2xl→text-xl/2xl 并上移（py-16→pt-10），径向渐变 0.08→0.05 且限高 h-64；版本选择由 SaaS 卡片改为克制的纵向列表（无 Card 壳/无阴影/无彩色边框，选中态由 Tailwind data-[selected=true] 与 group-data-[selected=true] 变体表达，壳层脚本只切属性不拼 className，配合 role=listbox/option）；CTA 合并为单一入口且文案随版本选择动态切换；新增「当前平台」推荐区（复用脚本既有 detect()，构建期 Windows·x64 兜底、客户端按 UA 覆写）；「兼容平台」改「系统要求」并移除 Card 壳改为平面表格（rounded-none、无背景填充、状态列由亮绿改低对比 muted）；圆角建立层级（主按钮 rounded-lg > 版本选择 rounded-md > 系统要求 rounded-none）；模态框同步收敛（rounded-2xl→lg、shadow-2xl→xl、去掉 CTA 光晕）。（7）删除被取代的 PlatformCard.tsx 与 CompatibilityCard.tsx（已无引用，避免死代码）。附带修复自查发现的无障碍缺陷：版本项「当前选择」文本用 text-transparent 占位，导致屏幕阅读器会把未选中项也读成已选中，已加 aria-hidden（选中语义由 aria-selected 承担）。

## 备选方案

### 方案 Tabs 视觉语言 + 原生 <a> 链接（已采纳）
- 优点：保留零运行时 JS；导航可用；右键新窗口/SEO 友好；关键决策 1：横排等高铁底边框 + 当前项 border-primary 指示条 + aria-current=page；移动端降级为纵向列表。
- 缺点：样式与桌面端组件库不完全一致（组件库 Tabs 为受控交互组件，视觉上本站已用相同视觉语言对齐）。
- 为何不选：导航本质是跨页跳转而非同页切换内容，语义上应为链接；且组件库 Tabs 在无 client:* 下会「点不动 + 指示器不可见」。

### 方案 使用真 Tabs 组件 + client:load 水合
- 优点：与桌面端组件库实现完全一致。
- 缺点：Header 引入 React 运行时下载与执行（违背全站零 JS 硬指标），首屏参数增加 ~215KB，且导航退化为 button（不能右键新窗口、爬虫不可跟）。
- 为何不选：破坏全站零 JS 硬约束，代价远大于收益。

### 方案 使用真 Tabs 组件但不加水合
- 优点：名义上「用了官方组件」。
- 缺点：导航直接失效（点击无响应、指示器不可见）。
- 为何不选：经阅读 Tabs.js 源码证明其依赖 onChange 回调 + useEffect 测量 offsetWidth，静态渲染下无法工作。

## 影响
- src/i18n.ts：新增 dl.version/dl.current/dl.beta/dl.reco/dl.recoFallback/dl.sysreq，改写 stats.downloads 与 stats.usage，新增 formatNumber()
- src/layouts/Base.astro：body 加 id=top，注入 #to-top 返回顶部按钮 + 可见性脚本
- src/components/Header.tsx + Header.astro：品牌文案、currentPath 高亮、Tabs 视觉语言导航（弃用 Button 包裹）
- src/components/index/CtaButton.tsx：去发光改品牌绿、h-11/rounded-lg
- src/pages/index.astro + en/index.astro + src/components/Footer.astro：formatNumber 千分位
- src/components/download/VersionSelector.tsx（新增，替代 PlatformCard layout=panel）
- src/components/download/SystemRequirements.tsx（新增，替代 CompatibilityCard，去 Card 壳）
- 删除 src/components/download/PlatformCard.tsx 与 CompatibilityCard.tsx
- src/pages/download.astro + en/download.astro：页面结构重写 + 脚本扩展（selectVersion/updateCtaLabel/updateReco），移除 #dl-pre-btn 双 CTA 逻辑
- 验证：构建 35 页通过；零 astro-island、零 client:*；品牌=Qomicex Launcher；版本切换联动 CTA（下载正式版↔下载测试版）与 data-selected/aria-selected 互斥实测通过；正式版与测试版下载链接均指向 /releases/download/ 直接安装包（回归未被破坏）；返回顶部实测（短页不显示、首页滚 1200 后出现、点击平滑回顶并自动隐藏）；CTA 计算样式品牌绿 rgb(35,209,99)、44px 高、无绿色光晕；千分位 1,446 在 zh/en 首页与下载页均已生效

## 修订记录
| 日期 | 版本 | 修改内容 | 修改人 |
|---|---|---|---|
| 2026-10-04 | v1.0 | 初版创建 | AI Agent |