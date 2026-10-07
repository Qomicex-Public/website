# ADR-009：Bing 评级违规整改：内容质量优先、淡化离线模式、消除抓取浪费

| 属性 | 内容 |
|---|---|
| 状态 | 已采纳 |
| 日期 | 2026-10-07 |
| 决策者 | AI Agent |

## 背景

Bing Webmaster 支持工单回复称：站点在最近一次抓取时「未达到 Bing 维持索引的标准」，且经升级人工复核确认违反 Webmaster Guidelines，但「无法提供具体原因」。该回复经核实为标准模板——SERoundtable、Hacker News、Reddit r/bing 三处有逐字相同文本，故「人工复核」不代表确实逐页审查，需自行按 Guidelines 反向定位。

已用实测排除的候选（避免误改）：
- **Cloaking**：以 bingbot / Googlebot / Chrome 三种 UA 请求 /、/download/、/versions/、/faq/、/about/、/docs/install/，返回 HTML 字节数逐一相同 → 排除。
- **blockhelm 关键词污染**：`git log --all -S blockhelm` 零命中 → 排除（曾怀疑被人做负面 SEO）。
- **服务端重定向 / robots / sitemap / IndexNow / 阻止 URL / 恶意软件 / 隐藏文本**：前次排查已逐项实测正常（详见 ADR-008）。

Bing 附带的 5 篇参考文章中，3 篇聚焦内容质量与站点权威度（The Role of Content Quality in Bing Ranking、Building Authority & Setting Expectations），无一篇讨论链接方案——这为定级提供了方向。结合实测数据：首页正文 155 词、/about/ 67 词、/faq/ 80 词，且站点几乎无入站链接（仅 GitHub 与 GTNH Wiki）。

宣传渠道取证（解释「为什么没有外链」）：
- **MineBBS**：游戏交流版版规仅允许【游戏日常】【教程攻略】【联机招募】三种前缀，并明令禁止「宣传链接、拉新推广话术」；发布作品资源须前往「创思艺海」资源板块。启动器宣传帖发在话题版必然被拒。
- **红石中继站**：社区守则禁止「广告」「宣传或引导到其他与本站相同定位的社区」「大量发布 AI 生成内容」。
- 两个平台均禁止「盗版游戏、破解资源」相关内容——而官网此前主动宣传「离线模式」，直接触及其审核红线。

因果链：官网宣传离线模式 → 中文 MC 社区拒绝宣传帖 → 无法获取权威外链 → 站点权威度≈0 → Bing 判定内容与权威度不足。因此淡化离线模式不仅是 Bing 侧风险，更是解开外链获取死结的前提。

## 决策

按「内容质量优先」顺序实施五项整改：

1. **淡化离线模式**（`src/pages/legal/user-agreement.astro` 中英）：将「离线模式：无需网络认证，仅需用户名即可使用」改为「本地账户模式」，明确其限于单机/自有环境且不得用于规避正版授权；账户管理条目改为优先描述 Microsoft 正版账户；新增警示框「请支持正版」。不删除功能描述——法律文档须准确，且隐瞒比淡化更糟。
2. **补厚单薄页面**：about 177→1129 词（新增项目简介、功能概览、系统要求表、开源与参与、正版声明）、faq 24→1820 词（增至 16 条，答案自足）、download 438→730 词（新增安装说明、版本选择、校验与安全、常见问题）。首页 248→772 词（既有功能区块）。
3. **修正英文 FAQ 内容错配**：`src/data/faq.ts` 原仅中文，而 `/en/faq/` 直接渲染同一数组，导致英文页输出中文问答。改为 `getFaqs(lang)` 双语文案，保留 `faqs` 导出供兼容。
4. **精简 /versions/**：38 个版本卡片全部保留，去掉 498 条逐资产下载链接，改为每版一个「GitHub 发布页」链接 + 一句按平台归总摘要。实测 535KB/541 外链 → 208KB/81 外链。
5. **桩页改 301**：`vercel.json` 为 /docs、/en/docs、/tutorial 加 301 指向 docs.qomicex.top，删除 5 个 meta-refresh 桩页（35 页 → 14 页）。采用 301 而非保留 meta refresh，因 meta refresh 正是此前导致 Bing 判定 / 为重定向页的同类机制（Guideline 7 要求用重定向而非 canonical）。

另按要求保留 MCNav 友链（本站入站链接极少，删除只会更少；且 MCNav 是运营 5 年、收录约 400 个真实站点的导航站，非链接农场），仅清理 `friends.ts` 与 about 页中「先挂友链再提交收录」的表述——问题不是链接本身，而是把链接当作收录交换筹码的可被解读的模式。

## 备选方案

### 方案 按原计划优先移除 MCNav 互换友链
- 优点：唯一自我记录了动机的项，命中 Link Schemes 字面描述
- 缺点：经核实 MCNav 的措辞是「可以得到优先审核」而非强制要求，且它是真实运营的导航站；删除会使本已几乎为零的入站链接再少一条，与「提升权威度」的目标相反
- 为何不选：用户反问后重新核实，改为保留链接、仅清理交换表述——问题是动机表述而非链接

### 方案 逐资产下载链接改为折叠(仅最近版本展开)
- 优点：保留旧版本的可下载性
- 缺点：页面体积仍大，且旧版本资产本就不建议下载(存在兼容与安全问题)
- 为何不选：统一收敛到 GitHub 发布页，结构更简单且用户能在那里看到完整资产列表

### 方案 删除离线模式功能描述
- 优点：彻底消除平台方合规风险
- 缺点：法律文档将不再准确；隐瞒能力比中性描述更糟，且该功能确实存在
- 为何不选：保持文档准确，改为中性命名+正版声明

### 方案 为 docs 桩页做一一对应 301
- 优点：权重与用户路径精确转移
- 缺点：docs.qomicex.top 用 VitePress，路径体系与主站 slug 完全不同(/install/ 在docs站是 404)，逐页映射会大量指向 404
- 为何不选：统一指向 docs 站首页，由站内导航接管

## 影响
- src/pages/legal/user-agreement.astro 与 src/pages/en/legal/user-agreement.astro：离线模式改名 + 正版声明
- src/data/faq.ts：改为 getFaqs(lang) 双语，新增 16 条问答；src/pages/{,en/}faq.astro：改用 getFaqs + 补充导语与未解决指引
- src/pages/{,en/}about.astro：新增项目简介/功能概览/系统要求表/开源与参与四大内容块
- src/pages/{,en/}download.astro：新增安装说明四小节
- src/components/versions/VersionList.tsx、src/pages/{,en/}versions.astro：下链接收敛为每版一个 GitHub 发布页 + 摘要
- vercel.json：新增 5 条 301；删除 src/pages/docs/[slug].astro、docs/index.astro、en/docs/[slug].astro、en/docs/index.astro、tutorial.astro
- 构建产物：35 页 → 14 页；/versions/ 535KB → 208KB
- 验证：build 通过（残留 2 条 WARN 为既存，与本次无关）；回归验证成立（撤掉 versions 修复→541 外链，恢复→81 外链）；sitemap 仍 14 条真实内容页且不含桩页；首页不含 navigator.language 逻辑

## 修订记录
| 日期 | 版本 | 修改内容 | 修改人 |
|---|---|---|---|
| 2026-10-07 | v1.0 | 初版创建 | AI Agent |