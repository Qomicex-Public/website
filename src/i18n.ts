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
}

export function t(key: string, lang: Lang): string {
  return (lang === 'en' ? en : zh)[key] ?? key
}

export function langFromPath(pathname: string): Lang {
  return pathname.startsWith('/en/') ? 'en' : 'zh'
}
