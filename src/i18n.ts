export type Lang = 'zh' | 'en'

const zh = {
  'site.title': 'QML启动器',
  'site.titleSuffix': ' — QML启动器',
  'site.description': 'QML启动器 — 一个现代化的 Minecraft 启动器，拥有多实例管理、模组安装、账户管理、多人联机、个性化主题设置等功能',
  'site.keywords': 'QML, QML启动器, Qomicex启动器, Qomicex Launcher, Minecraft启动器, 我的世界启动器, 多实例管理, 模组安装',

  'nav.home': '首页',
  'nav.download': '下载',
  'nav.docs': '文档',
  'nav.about': '关于',
  'nav.afdian': '爱发电',

  'hero.desc': '一个现代化的 Minecraft 启动器，拥有',

  'dl.stable': '下载正式版',
  'dl.download': '下载',
  'dl.pre': '下载测试版',

  'footer.copyright': 'Qomicex Launcher · GPL-3.0',
  'footer.qq': 'QQ 群',
  'footer.afdian': '爱发电',
  'footer.about': '关于',
  'footer.agreement': '用户协议',
  'footer.dataUpdated': '数据更新于',

  'docs.title': '文档',
  'docs.back': '返回文档首页',
  'docs.viewTutorial': '查看详细教程',
  'docs.description': '了解如何使用 QML启动器 的所有功能。',

  'partners.title': '集成支持',
  'partners.desc': '与主流 Minecraft 资源平台深度集成',
}

const en: Record<string, string> = {
  'site.title': 'QML Launcher',
  'site.titleSuffix': ' — QML Launcher',
  'site.description': 'QML Launcher — A modern Minecraft launcher with multi-instance management, mod installation, account management, multiplayer support, and customizable themes.',
  'site.keywords': 'QML, QML Launcher, Qomicex Launcher, Qomicex, Minecraft launcher, Minecraft 启动器',

  'nav.home': 'Home',
  'nav.download': 'Download',
  'nav.docs': 'Docs',
  'nav.about': 'About',
  'nav.afdian': 'Afdian',

  'hero.desc': 'A modern Minecraft launcher with',

  'dl.stable': 'Download Stable',
  'dl.download': 'Download',
  'dl.pre': 'Download Preview',

  'footer.copyright': 'Qomicex Launcher · GPL-3.0',
  'footer.qq': 'QQ Group',
  'footer.afdian': 'Afdian',
  'footer.about': 'About',
  'footer.agreement': 'User Agreement',
  'footer.dataUpdated': 'Data updated on',

  'docs.title': 'Docs',
  'docs.back': 'Back to docs home',
  'docs.viewTutorial': 'View tutorial',
  'docs.description': 'Learn about all features of QML Launcher.',

  'partners.title': 'Integrations',
  'partners.desc': 'Deep integration with major Minecraft resource platforms',
}

export function t(key: string, lang: Lang): string {
  return (lang === 'en' ? en : zh)[key] ?? key
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
    '/screenshots/home.png',
    '/screenshots/instances.png',
    '/screenshots/accounts.png',
    '/screenshots/download-instance.png',
    '/screenshots/resource-center.png',
    '/screenshots/download-management.png',
    '/screenshots/instance-detail.png',
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
