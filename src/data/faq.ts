export interface FaqItem {
  question: string
  answer: string
}

export const faqs: FaqItem[] = [
  { question: '支持哪些 Minecraft 版本？', answer: '支持从 1.6 到最新版本的所有 Minecraft 版本，包括快照版。' },
  { question: '支持哪些模组加载器？', answer: '支持 Forge、Fabric、Quilt、NeoForge、OptiFine，以及整合包常用的 LiteLoader、Cleanroom 等。' },
  { question: '为什么启动器无法启动？', answer: '请确保已安装 Java 17+ 和最新的显卡驱动。如果问题仍然存在，请查看启动器日志或提交 GitHub Issue。' },
  { question: '如何迁移其他启动器的实例？', answer: '目前暂不支持直接导入其他启动器的实例。你可以手动复制 .minecraft 目录下的版本文件到 Qomicex 对应目录。' },
  { question: '启动器是免费的吗？', answer: '是的，完全免费开源。项目基于 GPL-3.0 协议发布。' },
  { question: '如何报告 Bug 或提建议？', answer: '请前往 GitHub Issues 提交，或加入 QQ 群 623362446 反馈。' },
  { question: '支持 Linux 和 macOS 吗？', answer: '支持。我们为所有主流桌面平台提供构建版本。' },
  { question: '启动器会收集我的数据吗？', answer: '不会。本启动器不收集任何用户数据，所有配置仅存储在本地。' },
]
