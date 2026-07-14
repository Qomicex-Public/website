---
title: 设置 Java
category: 快速开始
order: 2
lang: zh
---

# Java配置

::: warning
Qomicex Launcher 至少需要一个 Java 8 用于处理加载器安装。
:::

首次启动时启动器会自动检测系统中的 Java。你也可以在设置中手动配置:
1. 点击侧边栏的「设置」进入设置页面。
![设置页面](/tutorial/settings-page.png)
2. 在「Java 运行时」部分，点击「浏览」手动选择 Java 可执行文件路径。
![Java运行时页面](/tutorial/javaruntime-page.png)
3. 或点击「下载 Java」让启动器自动下载并配置一个新的 Java 版本,推荐使用 `Zulu` 发行版,架构和平台会自动识别，但还是根据实际情况二次确认一下。
![Java下载页面](/tutorial/java-download.png)
4. 你还可以为每个游戏实例单独指定 Java 参数（如内存分配、JVM 参数等）。
![实例自定义Java](/tutorial/custom-instance-java.png)