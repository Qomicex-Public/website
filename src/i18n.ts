export type Lang = 'zh' | 'en'

const zh = {
  'site.title': 'QML启动器',
  'site.titleSuffix': ' | Qomicex Launcher | QML 启动器',
  'site.homeTitle': 'Qomicex Launcher | QML 启动器 - 现代化的 Minecraft 启动器',
  'site.h1': 'Qomicex Launcher | QML 启动器 — 现代化的 Minecraft 启动器',
  'site.description': 'Qomicex Launcher（QML 启动器）是免费开源的 Minecraft 启动器，支持多实例管理、模组与整合包安装、账户管理、多人联机与个性化主题，兼容 Windows、macOS 和 Linux，下载即用。',
  'site.keywords': 'QML, QML启动器, Qomicex启动器, Qomicex Launcher, Minecraft启动器, 我的世界启动器, 多实例管理, 模组安装',

  // 各页专属 SEO 标题与描述（避免多页共用同一 description 被搜索引擎判为重复内容）
  // 这些 title 是「完整标题」，自带品牌词，Base.astro 不会再拼接 site.titleSuffix
  'seo.about.title': '关于 Qomicex Launcher（QML 启动器）— 开源免费的 Minecraft 启动器',
  'seo.about.desc': 'Qomicex Launcher（QML 启动器）是采用 GPL-3.0 开源协议的免费 Minecraft 启动器，支持多实例管理、模组安装、账户管理与多人联机，兼容 Windows、macOS 与 Linux 全平台。',
  'seo.download.title': '下载 Qomicex Launcher（QML 启动器）— Windows、macOS、Linux 全平台安装包',
  'seo.download.desc': '下载 Qomicex Launcher（QML 启动器）最新版：提供 Windows（x64/ARM64）、macOS（Intel/Apple Silicon）与 Linux（AppImage/DEB/RPM）安装包，含正式版与测试版，支持代理与镜像加速下载。',
  'seo.versions.title': 'Qomicex Launcher（QML 启动器）版本历史 — 全部发行版本与更新说明',
  'seo.versions.desc': '查看 Qomicex Launcher（QML 启动器）的完整版本历史与更新说明，包含每个正式版与测试版的发布日期、更新内容与各平台安装包下载链接。',
  'seo.changelog.title': 'Qomicex Launcher（QML 启动器）更新日志 — 各版本更新内容与发布日期',
  'seo.changelog.desc': 'Qomicex Launcher（QML 启动器）的更新日志：按时间倒序记录每个版本的更新内容，包括多实例管理、模组安装、多人联机等功能的迭代详情。',
  'seo.faq.title': 'Qomicex Launcher（QML 启动器）常见问题 — 安装、模组与故障排查',
  'seo.faq.desc': 'Qomicex Launcher（QML 启动器）常见问题解答：涵盖安装、Java 环境配置、启动失败排查、模组与整合包安装、多人联机等高频问题的处理方法。',
  'seo.legal.title': 'Qomicex Launcher（QML 启动器）用户协议 — 完整服务条款与许可范围',
  'seo.legal.desc': 'Qomicex Launcher（QML 启动器）用户协议：请在使用本软件前仔细阅读全部服务条款，了解您的权利与义务、软件许可范围及免责声明。',

  'nav.home': '首页',
  'nav.download': '下载',
  'nav.docs': '文档',
  'nav.about': '关于',
  'nav.versions': '版本历史',
  'nav.afdian': '爱发电',

  'hero.desc': '一个现代化的 Minecraft 启动器，拥有',

  'dl.stable': '下载正式版',
  'dl.download': '下载',
  'dl.pre': '下载测试版',
  'dl.version': '版本',
  'dl.current': '当前选择',
  'dl.beta': 'Beta',
  'dl.reco': '当前平台',
  'dl.recoFallback': '正在识别你的平台…',
  'dl.sysreq': '系统要求',

  'footer.copyright': 'Qomicex Launcher · GPL-3.0',
  'footer.qq': 'QQ 群',
  'footer.afdian': '爱发电',
  'footer.about': '关于',
  'footer.agreement': '用户协议',
  'footer.dataUpdated': '数据更新于',
  'about.friends': '友情链接',

  'docs.title': '文档',
  'docs.back': '返回文档首页',
  'docs.viewTutorial': '查看详细教程',
  'docs.jump': '跳转到...',
  'docs.toc': '目录',
  'docs.description': '了解如何使用 QML启动器 的所有功能。',

  'partners.title': '集成支持',
  'partners.desc': '与主流 Minecraft 资源平台深度集成',

  'dlmodal.platform': '选择平台',
  'dlmodal.arch': '选择架构',
  'dlmodal.type': '选择安装包类型',
  'dlmodal.source': '下载源',
  'dlmodal.download': '下载',
  'dlmodal.started': '下载已开始',
  'dlmodal.retry': '如果下载未自动开始，',
  'dlmodal.retryLink': '点击此处重试',
  'dlmodal.after': '下载完成后，打开安装程序即可开始使用。',
  'dlmodal.guide': '安装指南',
  'dlmodal.gotIt': '知道了',
  'dlmodal.sourceProxy': '代理下载 (推荐)',
  'dlmodal.sourceMirror': '镜像源',
  'dlmodal.sourceDirect': 'GitHub 直连',

  'versions.title': '版本历史',
  'versions.changes': '更新说明',
  'versions.noChanges': '无详细更新说明',
  'versions.prerelease': '预发布',

  'stats.downloads': '{n} 次下载',
  'stats.usage': '{n} 次启动',
}

export function formatNumber(n: number | string): string {
  const num = typeof n === 'string' ? Number(n) : n
  if (!Number.isFinite(num)) return String(n)
  return num.toLocaleString('en-US')
}

const en: Record<string, string> = {
  'site.title': 'QML Launcher',
  'site.titleSuffix': ' | Qomicex Launcher | QML Launcher',
  'site.homeTitle': 'Qomicex Launcher | QML Launcher - A Modern Minecraft Launcher',
  'site.h1': 'Qomicex Launcher | QML Launcher — A Modern Minecraft Launcher',
  'site.description': 'Qomicex Launcher (QML Launcher) is a free, open-source Minecraft launcher for Windows, macOS and Linux with multi-instance, mod and multiplayer support.',
  'site.keywords': 'QML, QML Launcher, Qomicex Launcher, Qomicex, Minecraft launcher, Minecraft 启动器',

  // Per-page SEO titles and descriptions (avoids many pages sharing one
  // description, which search engines treat as duplicate content).
  'seo.about.title': 'About QML Launcher — Free, Open-Source Minecraft Launcher',
  'seo.about.desc': 'Qomicex Launcher (QML Launcher) is a free, GPL-3.0 open-source Minecraft launcher for Windows, macOS and Linux, with multi-instance, mod and account management.',
  'seo.download.title': 'Download QML Launcher — Windows, macOS & Linux',
  'seo.download.desc': 'Download Qomicex Launcher (QML Launcher) for Windows (x64/ARM64), macOS and Linux (AppImage/DEB/RPM). Stable and preview builds available.',
  'seo.versions.title': 'Version History — All QML Launcher Releases',
  'seo.versions.desc': 'Browse the release history of Qomicex Launcher (QML Launcher) - every stable and preview build with dates, changelogs and installer links.',
  'seo.changelog.title': 'Qomicex Launcher (QML Launcher) Changelog — Release Notes by Version',
  'seo.changelog.desc': 'The complete changelog for Qomicex Launcher (QML Launcher): what changed in every release across multi-instance, mods and multiplayer.',
  'seo.faq.title': 'FAQ — QML Launcher Help & Troubleshooting',
  'seo.faq.desc': 'FAQs for Qomicex Launcher (QML Launcher): installation, Java setup, startup troubleshooting, mods and modpacks, and multiplayer issues.',
  'seo.legal.title': 'User Agreement — QML Launcher Terms of Service',
  'seo.legal.desc': 'The Qomicex Launcher (QML Launcher) user agreement: your rights, the GPL-3.0 license scope and the disclaimer.',

  'nav.home': 'Home',
  'nav.download': 'Download',
  'nav.docs': 'Docs',
  'nav.about': 'About',
  'nav.versions': 'Version History',
  'nav.afdian': 'Donate',

  'hero.desc': 'A modern Minecraft launcher with',

  'dl.stable': 'Download Stable',
  'dl.download': 'Download',
  'dl.pre': 'Download Preview',
  'dl.version': 'Version',
  'dl.current': 'Selected',
  'dl.beta': 'Beta',
  'dl.reco': 'Your platform',
  'dl.recoFallback': 'Detecting your platform…',
  'dl.sysreq': 'System Requirements',

  'footer.copyright': 'Qomicex Launcher · GPL-3.0',
  'footer.qq': 'QQ Group',
  'footer.afdian': 'Afdian',
  'footer.about': 'About',
  'footer.agreement': 'User Agreement',
  'footer.dataUpdated': 'Data updated on',
  'about.friends': 'Friends',

  'docs.title': 'Docs',
  'docs.back': 'Back to docs home',
  'docs.viewTutorial': 'View tutorial',
  'docs.jump': 'Jump to...',
  'docs.toc': 'Table of Contents',
  'docs.description': 'Learn about all features of QML Launcher.',

  'partners.title': 'Integrations',
  'partners.desc': 'Deep integration with major Minecraft resource platforms',

  'dlmodal.platform': 'Select Platform',
  'dlmodal.arch': 'Select Architecture',
  'dlmodal.type': 'Select Package Type',
  'dlmodal.source': 'Download Source',
  'dlmodal.download': 'Download',
  'dlmodal.started': 'Download Started',
  'dlmodal.retry': 'If download does not start, ',
  'dlmodal.retryLink': 'click here to retry',
  'dlmodal.after': 'After download, open the installer to get started.',
  'dlmodal.guide': 'Install Guide',
  'dlmodal.gotIt': 'Got it',
  'dlmodal.sourceProxy': 'Proxy Download (Recommended)',
  'dlmodal.sourceMirror': 'Mirror',
  'dlmodal.sourceDirect': 'GitHub Direct',

  'versions.title': 'Version History',
  'versions.changes': 'Changelog',
  'versions.noChanges': 'No detailed changelog',
  'versions.prerelease': 'Pre-release',

  'stats.downloads': '{n} downloads',
  'stats.usage': '{n} launches',
}

export function t(key: string, lang: Lang, params?: Record<string, string | number>): string {
  let s = (lang === 'en' ? en : zh)[key] ?? key
  if (params) for (const [k, v] of Object.entries(params)) s = s.replace(`{${k}}`, String(v))
  return s
}

const featureDataZh = [
  {
    title: '极简主界面',
    desc: '清晰直观的布局，让一切操作都触手可及。',
    tags: ['多实例隔离', '高速下载', '一键配置'],
  },
  {
    title: '多实例管理',
    desc: '同时管理多个游戏实例，版本隔离、模组配置互不干扰。',
    tags: ['版本独立', '模组隔离', '快速切换'],
  },
  {
    title: '账户管理',
    desc: '支持多个 Minecraft 账户快捷切换，账号信息本地加密存储。',
    tags: ['加密存储', '快速切换', '多账户'],
  },
  {
    title: '版本列表',
    desc: '快速浏览并筛选可用的 Minecraft 版本，支持稳定版、测试版及不同加载器类型。',
    tags: ['版本隔离', '加载器筛选', '稳定版/测试版'],
  },
  {
    title: '资源中心',
    desc: '一站式获取模组、整合包、资源包，支持 CurseForge 和 Modrinth。',
    tags: ['模组', '整合包', '资源包', '插件'],
  },
  {
    title: '高速下载',
    desc: '多线程分片下载，最大程度利用带宽，极速安装。',
    tags: ['分片下载', '断点续传', '带宽优化'],
  },
  {
    title: '实例详情',
    desc: '细粒度管理每个实例的版本、模组、设置，掌控一切。',
    tags: ['版本管理', '模组管理', '启动参数'],
  },
  {
    title: '游戏设置',
    desc: '在实例内直接编辑游戏选项与启动参数，支持搜索与开关式编辑，不必再手动翻改配置文件。',
    tags: ['选项编辑', '启动参数', '快捷开关'],
  },
  {
    title: '存档设置',
    desc: '世界名称、游戏模式、难度、作弊与极限模式随手可改，存档配置不再需要手动编辑。',
    tags: ['游戏模式', '难度', '世界选项'],
  },
  {
    title: '地图预览',
    desc: '俯视渲染整个存档的已探索区块，可调高度切片查看洞穴，并标记路径点与上次位置。',
    tags: ['俯视地图', '高度切片', '路径点'],
  },
  {
    title: '投影预览',
    desc: '直接打开 .litematic 蓝图，用等距投影查看结构，可按图层裁剪、自由旋转镜头。',
    tags: ['litematic', '等距投影', '图层裁剪'],
  },
  {
    title: '自动安装前置依赖',
    desc: '智能检测并自动安装前置 Mod，一次点击轻松安装。',
    tags: ['前置检测', '自动安装', '一键安装'],
  },
  {
    title: '多人联机',
    desc: '支持局域网联机，一键 NAT 穿透，与好友畅快开黑。',
    tags: ['局域网联机', 'NAT 穿透'],
  },
]

const featureDataEn = [
  {
    title: 'Minimalist Home',
    desc: 'A clean and intuitive layout that puts everything at your fingertips.',
    tags: ['Instance Isolation', 'Fast Download', 'One-Click Setup'],
  },
  {
    title: 'Multi-Instance',
    desc: 'Manage multiple game instances simultaneously with version isolation and independent mod configs.',
    tags: ['Version Isolation', 'Mod Isolation', 'Quick Switch'],
  },
  {
    title: 'Accounts',
    desc: 'Quickly switch between multiple Minecraft accounts with locally encrypted credentials.',
    tags: ['Encrypted', 'Quick Switch', 'Multi-Account'],
  },
  {
    title: 'Version List',
    desc: 'Browse and filter available Minecraft versions, including stable and preview builds with various loaders.',
    tags: ['Version Filter', 'Loader Filter', 'Stable/Preview'],
  },
  {
    title: 'Resource Center',
    desc: 'One-stop shop for mods, modpacks, and resource packs, powered by CurseForge and Modrinth.',
    tags: ['Mods', 'Modpacks', 'Resource Packs', 'Plugins'],
  },
  {
    title: 'Fast Downloads',
    desc: 'Multi-threaded segmented downloads that maximize bandwidth and speed up installation.',
    tags: ['Segmented DL', 'Resume Support', 'Bandwidth Optimized'],
  },
  {
    title: 'Instance Details',
    desc: 'Granular control over each instance — version, mods, launch args, and more.',
    tags: ['Version Mgmt', 'Mod Mgmt', 'Launch Args'],
  },
  {
    title: 'Game Settings',
    desc: 'Edit game options and launch arguments right inside the instance, with search and toggle-based editing — no more hand-editing config files.',
    tags: ['Options', 'Launch Args', 'Toggles'],
  },
  {
    title: 'World Settings',
    desc: 'World name, game mode, difficulty, cheats and hardcore mode are all one click away — no manual level.dat editing.',
    tags: ['Game Mode', 'Difficulty', 'World Options'],
  },
  {
    title: 'World Preview',
    desc: 'Render every explored chunk from above, slice through the height range to reveal caves, and mark waypoints and your last position.',
    tags: ['Top-down Map', 'Height Slice', 'Waypoints'],
  },
  {
    title: 'Projection Preview',
    desc: 'Open .litematic schematics and inspect the build in isometric projection, clipping by layer and orbiting the camera freely.',
    tags: ['Litematic', 'Isometric', 'Layer Clipping'],
  },
  {
    title: 'Auto Install Prerequisites',
    desc: 'Smart detection and auto-install of prerequisite mods with a single click.',
    tags: ['Dependency Check', 'Auto Install', 'One-Click'],
  },
  {
    title: 'Multiplayer',
    desc: 'LAN multiplayer with one-click NAT traversal for seamless play with friends.',
    tags: ['LAN', 'NAT Traversal'],
  },
]

export const carouselWords: Record<Lang, string[]> = {
  zh: ['多实例管理', '快捷的模组安装', '账户管理', '多人联机', '个性化主题设置'],
  en: ['Multi-instance', 'Quick Mod Install', 'Account Management', 'Multiplayer', 'Custom Themes'],
}

export interface FeatureData {
  img: string
  title: string
  desc: string
  tags: string[]
  reversed: boolean
}

export function getFeatures(lang: Lang): FeatureData[] {
  const data = lang === 'en' ? featureDataEn : featureDataZh
  const images = [
    '/screenshots/home.webp',
    '/screenshots/instances.webp',
    '/screenshots/accounts.webp',
    '/screenshots/download-instance.webp',
    '/screenshots/resource-center.webp',
    '/screenshots/download-management.webp',
    '/screenshots/instance-detail.webp',
    '/screenshots/game-settings.webp',
    '/screenshots/world-settings.webp',
    '/screenshots/world-preview.webp',
    '/screenshots/projection-preview.webp',
    '/screenshots/download-mod.webp',
    '/screenshots/online.webp',
  ]
  return data.map((d, i) => ({
    img: images[i],
    title: d.title,
    desc: d.desc,
    tags: d.tags,
    reversed: i % 2 === 1,
  }))
}


export function langFromPath(pathname: string): Lang {
  return pathname.startsWith('/en/') ? 'en' : 'zh'
}
