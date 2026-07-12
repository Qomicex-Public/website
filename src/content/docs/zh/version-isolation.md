---
title: 版本隔离
category: 核心功能
order: 9
lang: zh
---

版本隔离功能让每个游戏实例拥有独立的配置文件和资源目录，互不干扰。

#### 隔离的内容

<div class="grid gap-2 sm:grid-cols-3 text-sm">

<div class="rounded-lg border border-border bg-card px-3 py-2 font-mono text-xs">mods/</div>
<div class="rounded-lg border border-border bg-card px-3 py-2 font-mono text-xs">saves/</div>
<div class="rounded-lg border border-border bg-card px-3 py-2 font-mono text-xs">resourcepacks/</div>
<div class="rounded-lg border border-border bg-card px-3 py-2 font-mono text-xs">shaderpacks/</div>
<div class="rounded-lg border border-border bg-card px-3 py-2 font-mono text-xs">screenshots/</div>
<div class="rounded-lg border border-border bg-card px-3 py-2 font-mono text-xs">datapacks/</div>
<div class="rounded-lg border border-border bg-card px-3 py-2 font-mono text-xs">crash-reports/</div>
<div class="rounded-lg border border-border bg-card px-3 py-2 font-mono text-xs">servers.dat</div>

</div>

#### 开启方法

在创建实例时，勾选「启用版本隔离」选项。已创建的实例可以在实例设置中找到该选项并开启。

共享目录（versions、assets、libraries 等）始终位于 .minecraft 根目录，不会被隔离。
