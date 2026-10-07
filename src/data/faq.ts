import type { Lang } from '../i18n'

export interface FaqItem {
  question: string
  answer: string
}

/**
 * FAQ 内容（双语）。
 *
 * 早先这里只有中文，但英文 FAQ 页同样渲染该数组，导致 /en/faq/ 输出的是中文
 * 问答——语言与声明不符，且构成跨语言重复内容。现改为按语言分别提供。
 *
 * 内容取向：只写可被验证的真实信息（版本、平台、日志位置、排障步骤），
 * 不堆砌关键词。答案尽量自足，用户无需跳转外部页面即可解决问题。
 */
const faqZh: FaqItem[] = [
  {
    question: '支持哪些 Minecraft 版本？',
    answer:
      '支持从 1.6 到最新正式版的所有 Minecraft Java 版版本，包括快照版。启动器会从官方版本清单拉取可用版本列表，新版本发布后无需更新启动器即可安装；安装时可按需选择原版或配合 Forge、Fabric、Quilt、NeoForge 等加载器。',
  },
  {
    question: '支持哪些模组加载器？',
    answer:
      '支持 Forge、Fabric、Quilt、NeoForge 与 OptiFine，并兼容整合包常用的 LiteLoader、Cleanroom 等加载器。安装实例时可指定加载器与对应游戏版本，启动器会自动补全该加载器所需的依赖库文件。',
  },
  {
    question: '启动器支持哪些操作系统？',
    answer:
      '支持 Windows（x64 / ARM64）、macOS（Intel x64 / Apple Silicon）与 Linux（x64 / ARM64，AppImage、DEB、RPM 三种包格式）。Linux 另提供 LoongArch64 与 RISC-V 64 的实验性构建，稳定性尚未保证。各平台最低系统版本见下载页的系统要求表。',
  },
  {
    question: '为什么启动器需要 Java？要装哪个版本？',
    answer:
      'Minecraft Java 版本身依赖 Java 运行环境。启动器可自动扫描并下载适配目标游戏版本的 Java（如 1.17 以上通常需要 Java 17+，更早版本需要 Java 8）。若自动安装失败，也可在设置中手动指定本地 Java 路径。',
  },
  {
    question: '启动器无法启动游戏怎么办？',
    answer:
      '建议按顺序排查：①确认实例的游戏版本与已安装的 Java 版本匹配；②检查是否缺少加载器依赖库，可在实例详情中尝试修复；③查看启动器日志（设置页可直接打开日志目录）定位具体报错；④更新显卡驱动，部分光影或高版本资源对驱动版本敏感。若问题仍在，请附带日志文件提交 GitHub Issue。',
  },
  {
    question: '如何迁移其他启动器的实例？',
    answer:
      '暂不支持一键导入其他启动器的实例。可行的做法是手动复制：把原启动器 .minecraft 目录下的 versions、mods、saves、resourcepacks 等文件夹，分别复制到 QML 对应实例的目录中。由于不同启动器的版本隔离结构可能不同，建议先复制 versions 与 saves，确认可正常启动后再迁移模组。',
  },
  {
    question: '什么是「版本隔离」？',
    answer:
      '版本隔离指每个实例拥有独立的游戏目录。开启后，实例的模组、存档、配置文件互不影响，因此可以在不同实例中安装彼此冲突的模组，或同时保留多个整合包而不必反复增删文件。关闭隔离则会让实例共用同一个 .minecraft 目录。',
  },
  {
    question: '如何管理多个游戏实例？',
    answer:
      '在「实例」页面可以创建、重命名、复制与删除实例，并为每个实例单独配置 Java 版本、内存上限、窗口尺寸、启动参数以及启动前后的自定义命令。每个实例也可单独备份与恢复，备份目录支持自定义位置。',
  },
  {
    question: '模组和整合包从哪里来？',
    answer:
      '资源中心集成了 Modrinth 与 CurseForge 两个平台，可按游戏版本、加载器、来源与分类筛选，查看项目详情与依赖关系后直接安装到指定实例。安装模组时启动器会自动检查缺失的前置依赖并提供补全入口。',
  },
  {
    question: '多人联机怎么用？',
    answer:
      '联机模块基于 EasyTier 组网实现。可由一名玩家创建房间并生成房间码，其他玩家凭房间码加入，无需公网 IP 或手动配置端口映射。启动器也可自动发现本机已开放到局域网的 Minecraft 世界，便于快速联机。',
  },
  {
    question: '启动器是免费的吗？如何获取源代码？',
    answer:
      '完全免费且开源，基于 GPL-3.0 协议发布。源代码托管于 GitHub（Qomicex-Public/Qomicex.Tauri），你可以自由使用、阅读、修改与分发，但分发衍生作品时需遵守 GPL-3.0 的条款，例如同样以 GPL-3.0 开源。',
  },
  {
    question: '启动器会收集我的数据吗？',
    answer:
      '不会。启动器不包含遥测或行为分析，也不自动上传任何数据。账户凭据、应用设置、下载任务等全部保存在本机，凭据文件经过加密且与机器码绑定。唯一主动外传数据的场景是你在崩溃分析中手动触发日志上传，且上传前会展示将要发送的内容。',
  },
  {
    question: '为什么换电脑后账户需要重新登录？',
    answer:
      '账户凭据在本地加密存储，且加密密钥与当前机器的硬件标识绑定。更换设备或重装系统后，原凭据文件无法在新环境解密，因此需要重新登录。这是为防止凭据文件被直接复制到其他机器使用而采取的保护措施。',
  },
  {
    question: '下载速度慢怎么办？',
    answer:
      '下载页提供代理下载、镜像源与 GitHub 直连三种来源，可在下载弹窗中切换。启动器支持多线程分片下载与断点续传，也可在设置中调整并发线程数与限速。若某个镜像不稳定，切换到其他来源通常即可恢复速度。',
  },
  {
    question: '更新检查会发送什么信息？',
    answer:
      '更新检查仅向 GitHub Releases 与项目更新接口请求版本清单，用于判断是否有新版本；请求不包含个人身份信息。你可以在设置中关闭自动检查更新，改用手动检查。',
  },
  {
    question: '如何反馈 Bug 或提出功能建议？',
    answer:
      '请前往 GitHub 仓库的 Issues 页面提交（Qomicex-Public/Qomicex.Tauri/issues）。提交前建议先搜索是否已有同类问题；报告 Bug 时请附上启动器版本、操作系统、复现步骤，以及设置页中导出的日志文件，这些信息能显著加快定位速度。',
  },
]

const faqEn: FaqItem[] = [
  {
    question: 'Which Minecraft versions are supported?',
    answer:
      'All Minecraft: Java Edition versions from 1.6 through the latest release, including snapshots. The launcher pulls the version manifest from the official source, so newly released versions can be installed without updating the launcher itself. You can install vanilla or pair a version with Forge, Fabric, Quilt or NeoForge.',
  },
  {
    question: 'Which mod loaders are supported?',
    answer:
      'Forge, Fabric, Quilt, NeoForge and OptiFine, along with loaders commonly used by modpacks such as LiteLoader and Cleanroom. You choose the loader and target game version when creating an instance, and the launcher resolves the required library files automatically.',
  },
  {
    question: 'Which operating systems are supported?',
    answer:
      'Windows (x64 / ARM64), macOS (Intel x64 / Apple Silicon) and Linux (x64 / ARM64, available as AppImage, DEB or RPM). Experimental builds exist for LoongArch64 and RISC-V 64 on Linux, though their stability is not guaranteed. Minimum OS versions are listed in the system requirements table on the download page.',
  },
  {
    question: 'Why does the launcher need Java, and which version?',
    answer:
      'Minecraft: Java Edition itself runs on the Java runtime. The launcher can detect and download the Java version that matches your target game version (Java 17+ for 1.17 and later, Java 8 for older releases). If automatic installation fails, you can point the launcher at a local Java installation in settings.',
  },
  {
    question: 'The game will not start. What should I check?',
    answer:
      'Work through these in order: (1) confirm the instance game version matches an installed Java version; (2) check for missing loader libraries and try the repair action on the instance detail page; (3) open the launcher logs from the settings page to find the actual error; (4) update your GPU drivers, since some shaders and newer versions are driver-sensitive. If the problem persists, open a GitHub issue and attach the log file.',
  },
  {
    question: 'Can I import instances from another launcher?',
    answer:
      'One-click import from other launchers is not supported yet. A practical workaround is to copy folders manually: move the versions, mods, saves and resourcepacks folders from the other launcher\u2019s .minecraft directory into the matching QML instance directory. Because version-isolation layouts differ between launchers, start with versions and saves, confirm the instance launches, then migrate mods.',
  },
  {
    question: 'What is version isolation?',
    answer:
      'Version isolation gives each instance its own game directory. With it enabled, mods, saves and config files stay independent per instance, so you can run instances with conflicting mods side by side or keep several modpacks installed at once without repeatedly adding and removing files. Disabling it makes the instance share a single .minecraft directory.',
  },
  {
    question: 'How do I manage multiple game instances?',
    answer:
      'The Instances page lets you create, rename, duplicate and delete instances, and configure Java version, memory limit, window size, launch arguments and pre-launch or post-exit commands per instance. Each instance can also be backed up and restored, with a configurable backup location.',
  },
  {
    question: 'Where do mods and modpacks come from?',
    answer:
      'The resource center integrates Modrinth and CurseForge. You can filter by game version, loader, source and category, inspect project details and dependencies, then install directly into a chosen instance. When a mod requires prerequisite libraries, the launcher detects the missing dependencies and offers to install them.',
  },
  {
    question: 'How does multiplayer work?',
    answer:
      'The multiplayer module uses EasyTier mesh networking. One player creates a room and shares its code; others join with that code, with no public IP or manual port forwarding required. The launcher can also discover Minecraft worlds already opened to your local network for quick LAN play.',
  },
  {
    question: 'Is the launcher free, and where is the source code?',
    answer:
      'It is completely free and open source under GPL-3.0. The source is hosted on GitHub at Qomicex-Public/Qomicex.Tauri. You are free to use, read, modify and redistribute it, provided that derivative distributions comply with GPL-3.0, for example by also releasing under GPL-3.0.',
  },
  {
    question: 'Does the launcher collect my data?',
    answer:
      'No. There is no telemetry or behavioural analytics, and nothing is uploaded automatically. Account credentials, application settings and download tasks are stored locally, and the credentials file is encrypted and bound to your machine identifier. The only case where data leaves your machine is when you deliberately trigger crash-log sharing, and the content to be uploaded is shown to you first.',
  },
  {
    question: 'Why must I sign in again after changing computers?',
    answer:
      'Account credentials are stored encrypted, with the key bound to your machine\u2019s hardware identifier. After moving to a new device or reinstalling the OS, the existing credentials file can no longer be decrypted, so you need to sign in again. This is deliberate: it prevents a copied credentials file from working on another machine.',
  },
  {
    question: 'Downloads are slow. What can I do?',
    answer:
      'The download page offers three sources: proxy download, mirror and direct GitHub. You can switch between them in the download dialog. The launcher supports multi-threaded segmented downloads and resume, and the concurrency limit and speed cap are configurable in settings. If one mirror is unstable, switching source usually restores full speed.',
  },
  {
    question: 'What is sent when the launcher checks for updates?',
    answer:
      'The update check only requests a version manifest from GitHub Releases and the project update endpoint to determine whether a newer build exists. The request contains no personal identifiers. Automatic update checks can be disabled in settings in favour of manual checks.',
  },
  {
    question: 'How do I report a bug or suggest a feature?',
    answer:
      'Open an issue on GitHub at Qomicex-Public/Qomicex.Tauri/issues. Before filing, please search for an existing report. For bug reports, include the launcher version, your operating system, reproduction steps and the log file exported from the settings page; these details substantially speed up diagnosis.',
  },
]

export function getFaqs(lang: Lang): FaqItem[] {
  return lang === 'en' ? faqEn : faqZh
}

/** @deprecated 保留仅为兼容既有引用；新代码请用 getFaqs(lang) 以取得正确语言的内容。 */
export const faqs: FaqItem[] = faqZh
