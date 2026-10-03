// src/components/download/PlatformCard.tsx
/**
 * 下载页平台卡片 — 基于 QML 官方组件库 @qomicex/plugin-ui Card 组合 + Button（asChild 包 <a> 外链）。
 * 构建期静态渲染（页面以无 client:* 指令方式使用），零运行时 JS；props 全部为可序列化字符串/数组。
 *
 * 双布局：
 * - `panel`    ：hero 区「正式版 / 测试版」并列面板（紧凑版式，无 assets、无下载按钮）。
 *                与原手写 div 逐类对齐：p-4 text-left / 眉标行 mb-1 flex items-center gap-1.5 text-xs /
 *                版本 text-lg font-semibold / 日期 text-xs text-muted-foreground；
 *                测试版 accent='preview' 用黄色边框与底色覆盖（border-yellow-500/20 bg-yellow-500/5）。
 * - `platform` ：完整平台下载卡片（标题/描述/版本 + assets 文件清单 + 下载 CTA）。
 *                主下载按钮 variant=default，备选源 variant=outline，均 asChild 渲染 <a target="_blank" rel="noopener">。
 *
 * 卡内图标为与 astro-icon 输出一致的静态 lucide SVG（verified=badge-check / beaker），
 * 不引入运行时图标方案；先例见 src/components/Header.tsx 的内联 SVG。
 */
// SSR 静态岛守卫：Card/useMaterial 构建期渲染必需，实现收敛于全站唯一入口 src/lib/ssr-dom-shim.ts
import '../../lib/ssr-dom-shim';
import { Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, cn } from '@qomicex/plugin-ui';

export interface DownloadAsset {
  /** 文件名（GitHub release asset name） */
  name: string;
  /** 可读体积，如 "104 MB" */
  size?: string;
  /** 下载地址（可为直链/代理/镜像前缀拼接后的完整 URL） */
  url: string;
  /** 平台/来源短标签，如 "x64"、"GitHub 直链" */
  osLabel?: string;
}

export interface PlatformCardProps {
  /** 卡片标题（panel=正式版/测试版 眉标；platform=平台名） */
  title: string;
  /** 副文案（panel=发布日期；platform=平台描述） */
  desc?: string;
  /** 版本号文本，如 "v2.3.1"（含前缀 v，原样展示） */
  version?: string;
  /** 下载文件列表（仅 platform 布局消费；panel 布局忽略） */
  assets?: DownloadAsset[];
  /** 下载按钮文案 */
  downloadLabel?: string;
  /** 眉标图标（静态 SVG） */
  icon?: 'verified' | 'beaker';
  /** 配色强调：default=语义卡底色；preview=测试版黄色强调 */
  accent?: 'default' | 'preview';
  /** 布局模式 */
  layout?: 'panel' | 'platform';
  /** 外层附加类（如并列面板里的 flex-1） */
  className?: string;
}

/** lucide:verified（图标库中为 badge-check）— 与 @iconify-json/lucide body 逐字一致 */
function IconVerified({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" className={className}>
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
        <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77a4 4 0 0 1 6.74 0a4 4 0 0 1 4.78 4.78a4 4 0 0 1 0 6.74a4 4 0 0 1-4.77 4.78a4 4 0 0 1-6.75 0a4 4 0 0 1-4.78-4.77a4 4 0 0 1 0-6.76" />
        <path d="m9 12l2 2l4-4" />
      </g>
    </svg>
  );
}

/** lucide:beaker — 与 @iconify-json/lucide body 逐字一致 */
function IconBeaker({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" className={className}>
      <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.5 3h15M6 3v16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V3M6 14h12" />
    </svg>
  );
}

export default function PlatformCard({
  title,
  desc,
  version,
  assets = [],
  downloadLabel = '下载',
  icon,
  accent = 'default',
  layout = 'platform',
  className,
}: PlatformCardProps) {
  const iconEl =
    icon === 'verified' ? <IconVerified className="size-3" /> :
    icon === 'beaker' ? <IconBeaker className="size-3" /> :
    null;

  // —— 紧凑版式：正式版/测试版并列面板（信息架构与原页完全一致，仅卡片化，不加按钮/Tab） ——
  if (layout === 'panel') {
    return (
      <Card className={cn('p-4 text-left shadow-none', accent === 'preview' && 'border-yellow-500/20 bg-yellow-500/5', className)}>
        <CardHeader
          className={cn(
            'mb-1 flex-row items-center gap-1.5 space-y-0 p-0 text-xs',
            accent === 'preview' ? 'text-yellow-600 dark:text-yellow-400' : 'text-muted-foreground',
          )}
        >
          {iconEl}
          {/* 原眉标为行内文本；CardTitle 需覆盖默认 font-semibold/leading-none/tracking-tight 与 text-xs 的 1rem 行高保持一致 */}
          <CardTitle className="font-normal leading-[1rem] tracking-normal">{title}</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {version !== undefined && <div className="text-lg font-semibold">{version}</div>}
          {desc !== undefined && <div className="text-xs text-muted-foreground">{desc}</div>}
        </CardContent>
      </Card>
    );
  }

  // —— 完整平台下载卡片（Card 组合 + Button asChild 外链 CTA） ——
  const [primary, ...alternates] = assets;
  return (
    <Card className={cn('text-left', accent === 'preview' && 'border-yellow-500/20 bg-yellow-500/5', className)}>
      <CardHeader>
        <div className="flex items-center gap-2">
          {iconEl}
          <CardTitle className={accent === 'preview' ? 'text-yellow-600 dark:text-yellow-400' : undefined}>{title}</CardTitle>
        </div>
        {desc !== undefined && <CardDescription>{desc}</CardDescription>}
      </CardHeader>
      <CardContent className="space-y-1.5">
        {version !== undefined && version !== '' && (
          <div className="text-sm font-medium text-muted-foreground">{version}</div>
        )}
        {assets.length > 0 && (
          <ul className="space-y-1 text-xs text-muted-foreground">
            {assets.map((a) => (
              <li key={a.url + '|' + a.name} className="flex items-baseline justify-between gap-2">
                <span>
                  {a.name}
                  {a.osLabel && <span className="opacity-70"> · {a.osLabel}</span>}
                </span>
                {a.size && <span className="shrink-0">{a.size}</span>}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
      {primary && (
        <CardFooter className="flex-col items-stretch gap-2">
          <Button asChild className="w-full">
            <a href={primary.url} target="_blank" rel="noopener">
              <span>{downloadLabel}</span>
              {primary.osLabel && <span className="text-xs opacity-70">({primary.osLabel})</span>}
            </a>
          </Button>
          {alternates.map((a) => (
            <Button asChild key={a.url + '|' + a.name} variant="outline" size="sm" className="w-full">
              <a href={a.url} target="_blank" rel="noopener">
                {downloadLabel} · {a.osLabel ?? a.name}
                {a.size && <span className="opacity-70"> ({a.size})</span>}
              </a>
            </Button>
          ))}
        </CardFooter>
      )}
    </Card>
  );
}
