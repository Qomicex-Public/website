---
title: 下载与安装
category: 快速开始
order: 1
lang: zh
---

欢迎使用 Qomicex Launcher! 此文档将引导你下载与安装 Qomicex Launcher

# 下载

从[下载页面](/download)获取对应系统的安装包。

![下载页面](/tutorial/download.png)

选择合适的系统及架构与安装包即可选择一个下载源进行下载，国内推荐第一个和第二个，国外推荐第三个


# 安装

- **Windows** — 运行 `.exe` 安装包，按向导完成安装。完成后从开始菜单启动。
- **macOS** — 挂载 `.dmg` 文件，将 Qomicex Launcher 拖入 Applications 文件夹。首次启动需在「安全性与隐私」中允许打开。
- **Linux** — 运行 `.AppImage`（`chmod +x` 后直接运行），或通过包管理器安装 `.deb` / `.rpm` 包。


# 环境要求

> 以下表格列出了当前支持的平台、最低版本要求和测试状态。


 平台 | 支持架构 | 最低系统版本 | 支持状态 | 安装包/方式 |
| :--- | :--- | :--- | :--- | :--- |
| **Windows** | `x64`, `ARM64` | Windows 10 1809+ | ✅ | `.exe`（NSIS 安装器）|
| **macOS** | `x64`（Intel）<br>`ARM64`（Apple Silicon） | macOS 10.15+ | ✅ | `.dmg` / `.app` |
| **Linux** | `x64`, `ARM64`<br>`LoongArch64` (理论可用但无机器)<br>`RISC-V 64`(实验性,推进中) | Ubuntu 20.04+ / Fedora 34+ / glibc 2.28+ | ✅  | `.deb` / `.rpm` / AppImage |