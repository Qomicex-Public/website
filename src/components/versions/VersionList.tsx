// src/components/versions/VersionList.tsx
// SSR 静态岛守卫：凡使用 plugin-ui Card 的岛，必须在库 import 之前第一行引入中心守卫。
// Card → useMaterial() 的 useState 初始化器读 document.documentElement，无 client:* 的岛在
// Node 端 renderToString 时会抛 ReferenceError: document is not defined（已实证）。
import '../../lib/ssr-dom-shim';
import { Badge, Button, Card } from '@qomicex/plugin-ui';

/**
 * 版本历史列表岛（卡片流）。
 *
 * 由 src/pages/versions.astro 与 src/pages/en/versions.astro 共用：
 * 壳层 .astro 负责 releases.json 读取、排序、平台分组、archLabel/extLabel/platLabel
 * 与 i18n 文案，全部算成 JSON 可序列化的字符串/数组再传入；本文件只做纯渲染。
 *
 * 无 client:* 指令 → 构建期静态渲染，零运行时 JS（Card 依赖的 document 由上面守卫兜住，
 * 浏览器端真实 document 存在，守卫不生效）。
 *
 * 组件选型说明（W4）：
 * - 卡片外壳用 plugin-ui `Card`（原 div 就是 rounded-xl border border-border bg-card p-5，
 *   与 Card 基底逐字相同），className 传 p-5 + shadow-none：原卡无投影，抵消 Card 默认
 *   shadow；glass-surface 站内无 CSS 定义为惰性类、text-card-foreground 与 --foreground
 *   同值 → 均无视觉影响（同 W3 PlatformCard 结论）。
 * - 不使用 CardHeader/CardTitle/CardContent：会引入多余 wrapper 层与 p-6/space-y-1.5，
 *   且 CardTitle 渲染 <div>，会丢掉本页真实的 h2/h3 标题层级（SEO 优先，标题元素手写）。
 * - `Table` 组 SSR 安全，但本页是「每个版本一张卡、卡内含变更列表 + 按平台多行下载」
 *   的卡片流，硬套表格会破坏结构与视觉，故未使用。
 * - `Tabs` 按主会话禁令不使用：无 client:* 时切换依赖 onChange+useEffect，是不可点的死
 *   tab 头。本页也无稳定/测试分组需求（逐版本一张卡，预发布用 Badge 标记）。
 * - 预发布标记用 `Badge variant="outline"`（数据只有 prerelease 布尔，稳定版本页原本
 *   不显示任何标记，因此不新增「稳定版」徽章，文案零变更）。
 * - 下载项用 `Button asChild variant="outline" size="sm"` 包 <a>（Slot 合并到 <a>，
 *   DOM 层级不变），className 反向覆盖掉 Button 的 h-8/px-3/bg-background/shadow-sm/
 *   font-medium/active:scale-95 等，使静态与 hover 观感与原手写 <a> 完全一致。
 * - 卡头「GitHub 发布页」是纯文本小链接（ml-auto text-xs underline），按 W1 Footer 先例
 *   保持原生 <a>：包 Button 需要覆盖 h-8/bg-background/shadow/font-medium 等，反向覆盖
 *   成本高于收益，且 baseline 对齐会受定高按钮影响。
 */

/** 单个下载资产（已由壳层算好展示文本） */
export interface VersionAssetLink {
  /** 展示文本，如 "x64 EXE"、"ARM64 DMG"（原 archLabel + extLabel 结果，可为空串） */
  label: string;
  /** 资产下载地址，原样透传，不加 target/rel */
  url: string;
}

/** 一个平台下的下载资产分组 */
export interface VersionDownloadGroup {
  /** 平台展示名，如 "Windows" / "macOS (ARM)" */
  platform: string;
  assets: VersionAssetLink[];
}

/** 一条版本记录 */
export interface VersionReleaseRow {
  /** 版本号（渲染为 v{version}） */
  version: string;
  /** 发布日期，已 slice(0,10)，如 "2025-11-01" */
  date: string;
  /** 是否预发布 */
  isPrerelease: boolean;
  /** 预发布徽章文案（t('versions.prerelease', lang)） */
  prereleaseLabel: string;
  /** 发布详情页链接文案（"GitHub 发布页" / "GitHub"） */
  detailLabel: string;
  /** 发布详情页 URL（r.htmlUrl） */
  detailUrl: string;
  /** 变更小节标题文案（t('versions.changes', lang)） */
  changesLabel: string;
  /** 变更条目 */
  changes: string[];
  /** 该版本对外提供的下载项（仅用于合成摘要文案，不再逐条渲染链接） */
  downloads: VersionDownloadGroup[];
  /** 下载摘要文案，如 "Windows、macOS、Linux 共 12 个安装包" */
  downloadsSummary: string;
  /** 下载小节标题文案（"下载" / "Downloads"） */
  downloadsLabel: string;
  /** 下载入口链接文案（"前往 GitHub 下载" / "Download on GitHub"） */
  downloadsLinkLabel: string;
}

export interface VersionListProps {
  releases: VersionReleaseRow[];
}

/**
 * 版本历史列表岛（卡片流）。
 *
 * 为什么每个版本只保留一个外链：早先每个版本都逐条渲染全部构建产物
 * （38 版 × 约 13 个资产 = 498 条指向 github.com 的链接），使本页达到
 * 535KB / 545 条站外链接。搜索引擎把这种「大量低价值站外链接」视为抓取
 * 浪费，会稀释本页与全站的信号质量（Bing Webmaster Guidelines 第 8、21 条）。
 * 现在每版只保留「GitHub 发布页」一个链接，用户在该页可取到全部资产；
 * 常规下载入口本就由 /download/ 页承担。
 */
export default function VersionList({ releases }: VersionListProps) {
  return (
    <div className="space-y-6">
      {releases.map((r) => (
        <Card key={`${r.version}-${r.date}`} className="p-5 shadow-none">
          <div className="mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h2 className="text-lg font-semibold">v{r.version}</h2>
            <span className="text-xs text-muted-foreground">{r.date}</span>
            {r.isPrerelease && (
              <Badge
                variant="outline"
                /* Badge 基础类硬编码 animate-zoom-fade-in，且 twMerge 不会把
                   animate-zoom-fade-in / animate-none 判为同类冲突（两条都会留下），
                   最终由样式表顺序决定 → 用内联 style 确定性关掉入场动画，
                   保持与原页面「无动画」一致。 */
                style={{ animation: 'none' }}
                className="rounded-full border-0 bg-yellow-500/10 px-2 py-0.5 font-medium text-yellow-600 dark:text-yellow-400"
              >
                {r.prereleaseLabel}
              </Badge>
            )}
            <a
              href={r.detailUrl}
              className="ml-auto text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
            >
              {r.detailLabel}
            </a>
          </div>

          {r.changes.length > 0 && (
            <>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{r.changesLabel}</h3>
              <ul className="mb-4 space-y-1 text-sm text-muted-foreground">
                {r.changes.map((c, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="mt-1.5 block h-1 w-1 shrink-0 rounded-full bg-muted-foreground/40" />
                    {c}
                  </li>
                ))}
              </ul>
            </>
          )}

          {r.downloads.length > 0 && (
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-border/50 pt-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{r.downloadsLabel}</h3>
              <span className="text-sm text-muted-foreground">{r.downloadsSummary}</span>
              <Button
                asChild
                variant="outline"
                size="sm"
                className="h-auto w-auto gap-1 border-border bg-transparent px-2 py-1 font-normal shadow-none transition-colors hover:border-primary/40 hover:bg-transparent hover:text-foreground active:scale-100"
              >
                <a href={r.detailUrl} target="_blank" rel="noopener">
                  <span>{r.downloadsLinkLabel}</span>
                </a>
              </Button>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}
